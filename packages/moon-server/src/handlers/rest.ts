import type { IncomingMessage, ServerResponse } from 'node:http'
import { getModel, createCtx, AuthorizationError } from '@moon/orm'
import { parseBody, sendJson, parseUrl } from '../utils/http.js'
import { verifyToken } from '../utils/auth.js'

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

      let page = 1
      let limit = 50

      for (const [key, value] of searchParams.entries()) {
        if (key === 'page') {
          page = parseInt(value, 10) || 1
        } else if (key === 'limit') {
          limit = parseInt(value, 10) || 50
        } else if (key === 'with') {
          const rels = value.split(',')
          for (const rel of rels) {
            query.with(rel.trim())
          }
        } else {
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
    const isAuthError = ['Token expired', 'Invalid token', 'Authorization header required'].includes(err?.message)
    const statusCode = isAuthError ? 401 : (err?.statusCode || 500)
    return sendJson(res, statusCode, { error: err?.message || 'Internal server error', code: err?.code || (isAuthError ? 'AUTH_REQUIRED' : 'INTERNAL_ERROR') }, req)
  }
}
