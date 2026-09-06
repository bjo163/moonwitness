import type { IncomingMessage, ServerResponse } from 'node:http'
import { getModel, createCtx, AuthorizationError } from '@moon/orm'
import { parseBody, sendJson, parseUrl } from '../utils/http.js'
import { authenticateRequest, AuthError } from '../utils/auth.js'
import {
  MAX_LIMIT,
  DEFAULT_LIMIT,
  MAX_RELATIONS,
  ORDER_REGEX,
  DOMAIN_OPERATOR_SET,
  RESERVED_REST_PARAMS,
} from '@moon/protocol'

const VALID_PARAM_KEY_REGEX = /^[a-zA-Z0-9_]+$/
const VALID_MODEL_REGEX = /^[a-z][a-z0-9.]*$/
const RESERVED_PARAMS = new Set<string>(RESERVED_REST_PARAMS)
const VALID_ORDER_REGEX = ORDER_REGEX
const VALID_DOMAIN_OPERATORS = DOMAIN_OPERATOR_SET

function parsePositiveInteger(value: string | null, fallback?: number): number | null {
  if (value === null) return fallback ?? null
  if (!/^\d+$/.test(value)) return null
  const parsed = Number(value)
  if (!Number.isSafeInteger(parsed) || parsed <= 0) return null
  return parsed
}

function getFieldDefs(ModelClass: any): Record<string, any> {
  return typeof ModelClass.getFieldDefs === 'function' ? ModelClass.getFieldDefs(ModelClass) || {} : {}
}

function resolveField(fieldDefs: Record<string, any>, name: string): string | null {
  if (!VALID_PARAM_KEY_REGEX.test(name)) return null
  if (Object.prototype.hasOwnProperty.call(fieldDefs, name)) return name
  const found = Object.keys(fieldDefs).find((key) => key.toLowerCase() === name.toLowerCase())
  return found || null
}

function validateWriteBody(body: unknown, fieldDefs: Record<string, any>): { ok: true; data: Record<string, unknown> } | { ok: false; field?: string } {
  if (!body || typeof body !== 'object' || Array.isArray(body)) return { ok: false }
  const data = body as Record<string, unknown>
  for (const key of Object.keys(data)) {
    if (!resolveField(fieldDefs, key)) return { ok: false, field: key }
  }
  return { ok: true, data }
}

function applyRelations(query: any, rawWith: string | null, fieldDefs: Record<string, any>): { ok: true } | { ok: false; error: string } {
  if (!rawWith) return { ok: true }
  const relations = rawWith.split(',').map((value) => value.trim()).filter(Boolean)
  if (relations.length > MAX_RELATIONS) {
    return { ok: false, error: `A maximum of ${MAX_RELATIONS} relations may be expanded` }
  }
  for (const requested of relations) {
    if (requested.includes('.')) return { ok: false, error: `Nested relation expansion is not supported: ${requested}` }
    const field = resolveField(fieldDefs, requested)
    if (!field) return { ok: false, error: `Unknown relation field: ${requested}` }
    const fieldDef = fieldDefs[field]
    if (!fieldDef || !['many2one', 'one2many', 'many2many'].includes(fieldDef.type)) {
      return { ok: false, error: `Field '${requested}' is not a relation` }
    }
    query.with(field)
  }
  return { ok: true }
}

export async function handleRest(
  req: IncomingMessage,
  res: ServerResponse,
  match: RegExpMatchArray,
  jwtSecret: string
): Promise<void> {
  try {
    const auth = await authenticateRequest(req, jwtSecret, { allowAnonymous: true })
    const uid = auth.uid
    const model = match[1] as string

    if (!VALID_MODEL_REGEX.test(model)) {
      return sendJson(res, 400, { error: `Invalid model name: ${model}`, code: 'INVALID_MODEL' }, req)
    }

    const ModelClass = getModel(model) as any
    if (!ModelClass) {
      return sendJson(res, 404, { error: `Model ${model} not found`, code: 'MODEL_NOT_FOUND' }, req)
    }

    const idStr = match[2]
    let id: number | undefined
    if (idStr !== undefined) {
      const parsedId = parsePositiveInteger(idStr)
      if (parsedId === null) {
        return sendJson(res, 400, { error: 'Record ID must be a positive integer', code: 'INVALID_RECORD_ID' }, req)
      }
      id = parsedId
    }

    const { searchParams } = parseUrl(req)
    const env = createCtx(uid, {}, getModel)
    const fieldDefs = getFieldDefs(ModelClass)

    if (req.method === 'GET' && id === undefined) {
      const query = ModelClass.query(env)
      const page = parsePositiveInteger(searchParams.get('page'), 1)
      const requestedLimit = parsePositiveInteger(searchParams.get('limit'), DEFAULT_LIMIT)
      if (page === null || requestedLimit === null) {
        return sendJson(res, 400, { error: 'page and limit must be positive integers', code: 'INVALID_PAGINATION' }, req)
      }
      const limit = Math.min(requestedLimit, MAX_LIMIT)

      const rawOrder = searchParams.get('order') || searchParams.get('sort')
      if (rawOrder) {
        const orderParts = rawOrder.split(',').map((part) => part.trim()).filter(Boolean)
        if (orderParts.length === 0) {
          return sendJson(res, 400, { error: 'Invalid order specification', code: 'INVALID_ORDER' }, req)
        }
        for (const part of orderParts) {
          const matchOrder = part.match(/^([a-zA-Z0-9_]+)(?:\s+(asc|desc))?$/i)
          if (!matchOrder) return sendJson(res, 400, { error: 'Invalid order specification', code: 'INVALID_ORDER' }, req)
          const field = resolveField(fieldDefs, matchOrder[1]!)
          if (!field) return sendJson(res, 400, { error: `Unknown order field: ${matchOrder[1]}`, code: 'INVALID_ORDER_FIELD' }, req)
          query.orderBy(field, (matchOrder[2]?.toLowerCase() as 'asc' | 'desc') || 'asc')
        }
      }

      const rawDomain = searchParams.get('domain')
      if (rawDomain) {
        let parsedDomain: unknown
        try {
          parsedDomain = JSON.parse(rawDomain)
        } catch {
          return sendJson(res, 400, { error: 'Invalid JSON domain syntax', code: 'INVALID_DOMAIN' }, req)
        }
        if (!Array.isArray(parsedDomain)) {
          return sendJson(res, 400, { error: 'Domain must be a JSON array', code: 'INVALID_DOMAIN' }, req)
        }
        for (const item of parsedDomain) {
          if (!Array.isArray(item) || item.length !== 3 || typeof item[0] !== 'string' || typeof item[1] !== 'string') {
            return sendJson(res, 400, { error: 'Every domain clause must be [field, operator, value]', code: 'INVALID_DOMAIN' }, req)
          }
          const field = resolveField(fieldDefs, item[0])
          const op = item[1].toLowerCase()
          if (!field) return sendJson(res, 400, { error: `Unknown domain field: ${item[0]}`, code: 'INVALID_DOMAIN_FIELD' }, req)
          if (!VALID_DOMAIN_OPERATORS.has(op)) return sendJson(res, 400, { error: `Unsupported domain operator: ${item[1]}`, code: 'INVALID_DOMAIN_OPERATOR' }, req)
          query.where(field, op, item[2])
        }
      }

      const relationResult = applyRelations(query, searchParams.get('with'), fieldDefs)
      if (!relationResult.ok) {
        return sendJson(res, 400, { error: relationResult.error, code: 'INVALID_RELATION' }, req)
      }

      for (const [key, value] of searchParams.entries()) {
        if (RESERVED_PARAMS.has(key)) continue
        const field = resolveField(fieldDefs, key)
        if (!field) return sendJson(res, 400, { error: `Unknown query field: ${key}`, code: 'INVALID_QUERY_FIELD' }, req)
        query.where(field, value)
      }

      return sendJson(res, 200, await query.paginate(page, limit), req)
    }

    if (req.method === 'GET' && id !== undefined) {
      const query = ModelClass.query(env).where('id', id)
      const relationResult = applyRelations(query, searchParams.get('with'), fieldDefs)
      if (!relationResult.ok) {
        return sendJson(res, 400, { error: relationResult.error, code: 'INVALID_RELATION' }, req)
      }
      const record = await query.first()
      if (!record) return sendJson(res, 404, { error: 'Record not found', code: 'RECORD_NOT_FOUND' }, req)
      return sendJson(res, 200, { data: record }, req)
    }

    if (req.method === 'POST') {
      const validated = validateWriteBody(await parseBody(req), fieldDefs)
      if (!validated.ok) {
        return sendJson(res, 400, {
          error: validated.field ? `Unknown write field: ${validated.field}` : 'JSON object body required',
          code: validated.field ? 'INVALID_WRITE_FIELD' : 'INVALID_REQUEST_BODY'
        }, req)
      }
      if (Object.keys(validated.data).length === 0) {
        return sendJson(res, 400, { error: 'Non-empty JSON object body required', code: 'INVALID_REQUEST_BODY' }, req)
      }
      const record = await ModelClass.transaction(env, async (txEnv: any) => ModelClass.spawn(ModelClass, txEnv, validated.data))
      return sendJson(res, 201, { data: record }, req)
    }

    if (req.method === 'PUT' || req.method === 'PATCH') {
      if (id === undefined) return sendJson(res, 400, { error: 'ID required for update', code: 'INVALID_REQUEST' }, req)
      const validated = validateWriteBody(await parseBody(req), fieldDefs)
      if (!validated.ok) {
        return sendJson(res, 400, {
          error: validated.field ? `Unknown write field: ${validated.field}` : 'JSON object body required',
          code: validated.field ? 'INVALID_WRITE_FIELD' : 'INVALID_REQUEST_BODY'
        }, req)
      }
      await ModelClass.transaction(env, async (txEnv: any) => ModelClass.morph(ModelClass, txEnv, id, validated.data))
      const record = await ModelClass.query(env).where('id', id).first()
      return sendJson(res, 200, { data: record }, req)
    }

    if (req.method === 'DELETE') {
      if (id === undefined) return sendJson(res, 400, { error: 'ID required for delete', code: 'INVALID_REQUEST' }, req)
      await ModelClass.transaction(env, async (txEnv: any) => ModelClass.purge(ModelClass, txEnv, id))
      return sendJson(res, 200, { success: true }, req)
    }

    return sendJson(res, 405, { error: 'Method not allowed', code: 'METHOD_NOT_ALLOWED' }, req)
  } catch (err: any) {
    if (err instanceof AuthError || err instanceof AuthorizationError) {
      return sendJson(res, err.statusCode, { error: err.message, code: err.code }, req)
    }
    if (err?.message?.startsWith('Validation Error:')) {
      return sendJson(res, 400, { error: err.message, code: 'VALIDATION_ERROR' }, req)
    }
    const statusCode = err?.statusCode || 500
    return sendJson(res, statusCode, {
      error: statusCode >= 500 ? 'Internal server error' : (err?.message || 'Request failed'),
      code: err?.code || 'INTERNAL_ERROR'
    }, req)
  }
}
