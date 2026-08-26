import type { IncomingMessage, ServerResponse } from 'node:http'
import { getModel, createCtx, AuthorizationError } from '@moon/orm'
import { parseBody, sendJson, parseUrl } from '../utils/http.js'
import { verifyToken } from '../utils/auth.js'

const MAX_LIMIT = 100
const DEFAULT_LIMIT = 80
const VALID_ORDER_REGEX = /^[a-zA-Z0-9_]+(\s+(asc|desc|ASC|DESC))?(\s*,\s*[a-zA-Z0-9_]+(\s+(asc|desc|ASC|DESC))?)*$/
const VALID_PARAM_KEY_REGEX = /^[a-zA-Z0-9_]+$/

/**
 * Handle REST API requests for models
 * Pattern: /api/:model or /api/:model/:id
 */
export async function handleRest(
  req: IncomingMessage,
  res: ServerResponse,
  match: RegExpMatchArray,
  jwtSecret: string
): Promise<void> {
  try {
    const decoded = verifyToken(req, jwtSecret)
    const uid = decoded.sub as number

    const model = match[1] as string
    const idStr = match[2]
    const id = idStr ? parseInt(idStr, 10) : undefined

    const ModelClass = getModel(model) as any
    if (!ModelClass) {
      return sendJson(res, 404, { error: `Model ${model} not found`, code: 'MODEL_NOT_FOUND' }, req)
    }

    const { searchParams } = parseUrl(req)
    const env = createCtx(uid, {}, getModel)

    // GET /api/:model - List records
    if (req.method === 'GET' && !id) {
      const query = ModelClass.query(env)

      // Bounded pagination controls
      const rawPage = searchParams.get('page')
      const rawLimit = searchParams.get('limit')
      const page = Math.max(1, parseInt(rawPage || '1', 10) || 1)
      const limit = Math.min(Math.max(1, parseInt(rawLimit || String(DEFAULT_LIMIT), 10) || DEFAULT_LIMIT), MAX_LIMIT)

      // Order/sort handling with SQL injection defense
      const rawOrder = searchParams.get('order') || searchParams.get('sort')
      if (rawOrder) {
        if (!VALID_ORDER_REGEX.test(rawOrder.trim())) {
          return sendJson(res, 400, { error: 'Invalid order specification', code: 'INVALID_ORDER' }, req)
        }
        const orderParts = rawOrder.split(',')
        for (const part of orderParts) {
          const [col, dir] = part.trim().split(/\s+/)
          if (col) {
            query.orderBy(col, (dir?.toLowerCase() as 'asc' | 'desc') || 'asc')
          }
        }
      }

      // Domain/filter processing
      const rawDomain = searchParams.get('domain')
      if (rawDomain) {
        try {
          const parsedDomain = JSON.parse(rawDomain)
          if (!Array.isArray(parsedDomain)) {
            return sendJson(res, 400, { error: 'Domain must be a valid JSON array', code: 'INVALID_DOMAIN' }, req)
          }
          for (const item of parsedDomain) {
            if (Array.isArray(item) && item.length === 3) {
              const [field, op, val] = item
              if (typeof field === 'string' && VALID_PARAM_KEY_REGEX.test(field)) {
                query.where(field, op, val)
              }
            }
          }
        } catch {
          return sendJson(res, 400, { error: 'Invalid JSON domain syntax', code: 'INVALID_DOMAIN' }, req)
        }
      }

      // Other query parameters
      const RESERVED_PARAMS = new Set(['page', 'limit', 'with', 'order', 'sort', 'domain'])
      for (const [key, value] of searchParams.entries()) {
        if (RESERVED_PARAMS.has(key)) continue

        if (key === 'with') {
          const rels = value.split(',')
          for (const rel of rels) {
            if (VALID_PARAM_KEY_REGEX.test(rel.trim())) {
              query.with(rel.trim())
            }
          }
        } else {
          if (!VALID_PARAM_KEY_REGEX.test(key)) {
            return sendJson(res, 400, { error: `Invalid query field: ${key}`, code: 'INVALID_QUERY_FIELD' }, req)
          }
          query.where(key, value)
        }
      }

      const result = await query.paginate(page, limit)
      return sendJson(res, 200, result, req)
    }

    // GET /api/:model/:id - Get single record
    if (req.method === 'GET' && id) {
      const record = await ModelClass.query(env).where('id', id).first()
      if (!record) {
        return sendJson(res, 404, { error: 'Record not found', code: 'RECORD_NOT_FOUND' }, req)
      }
      return sendJson(res, 200, { data: record }, req)
    }

    // POST /api/:model - Create record
    if (req.method === 'POST') {
      const body = await parseBody(req)
      if (!body || typeof body !== 'object' || Array.isArray(body) || Object.keys(body).length === 0) {
        return sendJson(res, 400, { error: 'Non-empty JSON object body required', code: 'INVALID_REQUEST_BODY' }, req)
      }
      const record = await ModelClass.transaction(env, async (txEnv: any) => {
        return await ModelClass.spawn(ModelClass, txEnv, body)
      })
      return sendJson(res, 201, { data: record }, req)
    }

    // PUT /api/:model/:id - Update record
    if (req.method === 'PUT') {
      if (!id) {
        return sendJson(res, 400, { error: 'ID required for update', code: 'INVALID_REQUEST' }, req)
      }
      const body = await parseBody(req)
      if (!body || typeof body !== 'object' || Array.isArray(body)) {
        return sendJson(res, 400, { error: 'JSON object body required', code: 'INVALID_REQUEST_BODY' }, req)
      }
      await ModelClass.transaction(env, async (txEnv: any) => {
        await ModelClass.morph(ModelClass, txEnv, id, body)
      })
      const record = await ModelClass.query(env).where('id', id).first()
      return sendJson(res, 200, { data: record }, req)
    }

    // DELETE /api/:model/:id - Delete record
    if (req.method === 'DELETE') {
      if (!id) {
        return sendJson(res, 400, { error: 'ID required for delete', code: 'INVALID_REQUEST' }, req)
      }
      await ModelClass.transaction(env, async (txEnv: any) => {
        await ModelClass.purge(ModelClass, txEnv, id)
      })
      return sendJson(res, 200, { success: true }, req)
    }

    return sendJson(res, 405, { error: 'Method not allowed', code: 'METHOD_NOT_ALLOWED' }, req)
  } catch (err: any) {
    if (err instanceof AuthorizationError) {
      return sendJson(res, err.statusCode, { error: err.message, code: err.code }, req)
    }
    const isAuthError = ['Token expired', 'Invalid token', 'Authorization header required', 'Invalid authorization format', 'Invalid token subject'].includes(err?.message)
    const statusCode = isAuthError ? 401 : (err?.statusCode || 500)
    return sendJson(res, statusCode, { error: err?.message || 'Internal server error', code: err?.code || (isAuthError ? 'AUTH_REQUIRED' : 'INTERNAL_ERROR') }, req)
  }
}
