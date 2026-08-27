import type { IncomingMessage, ServerResponse } from 'node:http'
import { z } from 'zod'
import { getModel, getDb, createCtx, AuthorizationError, ANONYMOUS_ID } from '@moon/orm'
import { parseBody, sendJson } from '../utils/http.js'
import { authenticateRequest, AuthError } from '../utils/auth.js'
import { logger } from '../logger.js'

const RpcRequestSchema = z.object({
  model: z.string().min(1),
  method: z.string().min(1),
  args: z.array(z.any()).optional(),
  kwargs: z.record(z.any()).optional()
})

const METHOD_NAME_REGEX = /^[a-zA-Z0-9_]+$/

const DANGEROUS_METHODS = new Set([
  'spawn',
  'morph',
  'purge',
  'destroy',
  'unlink',
  'create',
  'write',
  'update',
  'delete',
  'transaction',
  'emitEvent',
  'getFieldDefs',
  'tableName'
])

function validateMethodName(method: string): { ok: boolean; error?: string } {
  if (!METHOD_NAME_REGEX.test(method)) {
    return { ok: false, error: `Invalid method name format: ${method}` }
  }
  if (method.includes('__')) {
    return { ok: false, error: `Dunder methods are not allowed: ${method}` }
  }
  if (method.startsWith('_')) {
    return { ok: false, error: `Private methods are not allowed: ${method}` }
  }
  if (DANGEROUS_METHODS.has(method)) {
    return { ok: false, error: `Forbidden method: ${method}` }
  }
  return { ok: true }
}

/**
 * Handle RPC (Remote Procedure Call) requests
 * Pattern: POST /rpc with { model, method, args, kwargs }
 */
export async function handleRpc(
  req: IncomingMessage,
  res: ServerResponse,
  jwtSecret: string
): Promise<void> {
  try {
    const auth = await authenticateRequest(req, jwtSecret, { allowAnonymous: false })
    const uid = auth.uid

    const body = await parseBody(req)
    const validation = RpcRequestSchema.safeParse(body)
    if (!validation.success) {
      logger.warn('moon.rpc.audit', 'Invalid RPC body', { uid, error: validation.error.message })
      return sendJson(res, 400, { error: 'Invalid RPC body', code: 'INVALID_REQUEST' }, req)
    }

    const { model, method, args, kwargs } = validation.data

    const methodValidation = validateMethodName(method)
    if (!methodValidation.ok) {
      logger.warn('moon.rpc.audit', 'Forbidden method', { uid, model, method, reason: methodValidation.error })
      return sendJson(res, 403, { error: methodValidation.error, code: 'FORBIDDEN_METHOD' }, req)
    }

    const ModelClass = getModel(model)
    if (!ModelClass) {
      return sendJson(res, 404, { error: `Model ${model} not found`, code: 'MODEL_NOT_FOUND' }, req)
    }

    const methodFn = (ModelClass as any)[method]
    if (typeof methodFn !== 'function') {
      return sendJson(res, 404, { error: `Method ${method} not found on ${model}`, code: 'METHOD_NOT_FOUND' }, req)
    }

    const safeArgs = Array.isArray(args) ? args : []
    if (kwargs && Object.keys(kwargs).length > 0) {
      safeArgs.push(kwargs)
    }

    const db = getDb()
    const result = await db.transaction(async (trx) => {
      const env = createCtx(uid, {}, getModel, trx)
      return await methodFn.call(ModelClass, ModelClass, env, ...safeArgs)
    })

    logger.info('moon.rpc.audit', 'RPC executed', { uid, model, method })
    return sendJson(res, 200, { result }, req)
  } catch (err: any) {
    if (err instanceof AuthError) {
      return sendJson(res, err.statusCode, { error: err.message, code: err.code }, req)
    }
    if (err instanceof AuthorizationError) {
      return sendJson(res, err.statusCode, { error: err.message, code: err.code }, req)
    }
    const statusCode = err?.statusCode || 500
    return sendJson(res, statusCode, { error: err?.message || 'Internal server error', code: err?.code || 'INTERNAL_ERROR' }, req)
  }
}
