import type { IncomingMessage, ServerResponse } from 'node:http'
import { getModel, getDb, createCtx, AuthorizationError } from '@moon/orm'
import { parseBody, sendJson } from '../utils/http.js'
import { verifyToken } from '../utils/auth.js'

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
    const decoded = verifyToken(req, jwtSecret)
    const uid = decoded.sub as number

    if (!uid) {
      return sendJson(res, 401, { error: 'Unauthorized', code: 'AUTH_REQUIRED' }, req)
    }

    const body = await parseBody(req)
    const { model, method, args, kwargs } = body

    if (!model || !method) {
      return sendJson(res, 400, { error: 'Model and method required', code: 'INVALID_REQUEST' }, req)
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

    return sendJson(res, 200, { result }, req)
  } catch (err: any) {
    if (err instanceof AuthorizationError) {
      return sendJson(res, err.statusCode, { error: err.message, code: err.code }, req)
    }
    const isAuthError = ['Token expired', 'Invalid token', 'Authorization header required'].includes(err?.message)
    const statusCode = isAuthError ? 401 : (err?.statusCode || 500)
    return sendJson(res, statusCode, { error: err?.message || 'Internal server error', code: err?.code || (isAuthError ? 'AUTH_REQUIRED' : 'INTERNAL_ERROR') }, req)
  }
}
