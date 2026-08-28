import type { IncomingMessage, ServerResponse } from 'node:http'
import { getModel, getDb, createCtx, AuthorizationError, ANONYMOUS_ID } from '@moon/orm'
import { parseBody, sendJson } from '../utils/http.js'
import { authenticateRequest, AuthError } from '../utils/auth.js'
import { withDomainSpan } from '../telemetry.js'
import { SpanStatusCode } from '@opentelemetry/api'

/**
 * Handle RPC (Remote Procedure Call) requests
 * Pattern: POST /rpc with { model, method, args, kwargs }
 */
export async function handleRpc(
  req: IncomingMessage,
  res: ServerResponse,
  jwtSecret: string
): Promise<void> {
  return withDomainSpan('rpc.dispatch', async (span) => {
    try {
      const auth = await authenticateRequest(req, jwtSecret, { allowAnonymous: false })
      const uid = auth.uid

      const body = await parseBody(req)
      const { model, method, args, kwargs } = body

      if (!model || !method) {
        span?.setStatus({ code: SpanStatusCode.OK })
        return sendJson(res, 400, { error: 'Model and method required', code: 'INVALID_REQUEST' }, req)
      }

      const ModelClass = getModel(model)
      if (!ModelClass) {
        span?.setStatus({ code: SpanStatusCode.OK })
        return sendJson(res, 404, { error: `Model ${model} not found`, code: 'MODEL_NOT_FOUND' }, req)
      }

      const methodFn = (ModelClass as any)[method]
      if (typeof methodFn !== 'function') {
        span?.setStatus({ code: SpanStatusCode.OK })
        return sendJson(res, 404, { error: `Method ${method} not found on ${model}`, code: 'METHOD_NOT_FOUND' }, req)
      }

      span?.setAttribute('rpc.model', model)
      span?.setAttribute('rpc.method', method)
      span?.setAttribute('auth.user_id', uid)

      const safeArgs = Array.isArray(args) ? args : []
      if (kwargs && Object.keys(kwargs).length > 0) {
        safeArgs.push(kwargs)
      }

      const db = getDb()
      const result = await db.transaction(async (trx) => {
        const env = createCtx(uid, {}, getModel, trx)
        return await methodFn.call(ModelClass, ModelClass, env, ...safeArgs)
      })

      span?.setStatus({ code: SpanStatusCode.OK })
      return sendJson(res, 200, { result }, req)
    } catch (err: any) {
      if (err instanceof AuthError) {
        span?.setStatus({ code: SpanStatusCode.OK })
        return sendJson(res, err.statusCode, { error: err.message, code: err.code }, req)
      }
      if (err instanceof AuthorizationError) {
        span?.setStatus({ code: SpanStatusCode.OK })
        return sendJson(res, err.statusCode, { error: err.message, code: err.code }, req)
      }
      span?.setStatus({ code: SpanStatusCode.ERROR, message: err?.message || String(err) })
      span?.recordException(err instanceof Error ? err : new Error(String(err)))
      const statusCode = err?.statusCode || 500
      return sendJson(res, statusCode, { error: err?.message || 'Internal server error', code: err?.code || 'INTERNAL_ERROR' }, req)
    }
  })
}
