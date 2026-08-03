import type { IncomingMessage, ServerResponse } from 'node:http'
import { getModel, getDb, createCtx } from '@moon/orm'
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
      return sendJson(res, 401, { error: 'Unauthorized' }, req)
    }

    const body = await parseBody(req)
    const { model, method, args, kwargs } = body

    if (!model || !method) {
      return sendJson(res, 400, { error: 'Model and method required' }, req)
    }

    const ModelClass = getModel(model)
    if (!ModelClass) {
      return sendJson(res, 404, { error: `Model ${model} not found` }, req)
    }

    const methodFn = (ModelClass as any)[method]
    if (typeof methodFn !== 'function') {
      return sendJson(res, 404, { error: `Method ${method} not found on ${model}` }, req)
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
    const isAuthError = ['Token expired', 'Invalid token'].includes(err.message)
    return sendJson(res, isAuthError ? 401 : 500, { error: err.message }, req)
  }
}
