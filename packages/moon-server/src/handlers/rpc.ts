import type { IncomingMessage, ServerResponse } from 'node:http'
import { getModel, getDb, createCtx, AuthorizationError, SUPERUSER_ID } from '@moon/orm'
import { parseBody, sendJson } from '../utils/http.js'
import { authenticateRequest, AuthError } from '../utils/auth.js'
import { logger } from '../logger.js'
import { RpcRequestSchema } from '@moon/protocol'
import { validateRpcMethod, resolveRpcProcedure } from '../rpc-registry.js'
import { withDomainSpan } from '../telemetry.js'
import { SpanStatusCode } from '@opentelemetry/api'

/**
 * Handle explicitly registered RPC requests.
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
      const validation = RpcRequestSchema.safeParse(body)
      if (!validation.success) {
        logger.warn('moon.rpc.audit', 'Invalid RPC body', { uid, error: validation.error.message })
        return sendJson(res, 400, { error: 'Invalid RPC body', code: 'INVALID_REQUEST' }, req)
      }

      const { model, method } = validation.data
      const methodValidation = validateRpcMethod(method)
      if (!methodValidation.ok) {
        logger.warn('moon.rpc.audit', 'Forbidden method', { uid, model, method, reason: methodValidation.error })
        return sendJson(res, 403, { error: methodValidation.error, code: 'FORBIDDEN_METHOD' }, req)
      }

      const procedure = resolveRpcProcedure(method)
      if (!procedure) {
        return sendJson(res, 403, { error: `Method ${method} is not registered for RPC access`, code: 'FORBIDDEN_METHOD' }, req)
      }

      if (procedure.requireAdmin && uid !== SUPERUSER_ID) {
        return sendJson(res, 403, { error: 'Administrator access required', code: 'AUTH_FORBIDDEN' }, req)
      }

      const ModelClass = getModel(model)
      if (!ModelClass) {
        return sendJson(res, 404, { error: `Model ${model} not found`, code: 'MODEL_NOT_FOUND' }, req)
      }

      const procedureInput = procedure.input.safeParse({
        model,
        args: validation.data.args ?? [],
        kwargs: validation.data.kwargs ?? {},
      })
      if (!procedureInput.success) {
        logger.warn('moon.rpc.audit', 'Invalid RPC procedure input', {
          uid,
          model,
          method,
          error: procedureInput.error.message,
        })
        return sendJson(res, 400, { error: 'Invalid RPC procedure input', code: 'RPC_VALIDATION_ERROR' }, req)
      }

      const db = getDb()
      const result = await db.transaction(async (trx) => {
        const env = createCtx(uid, {}, getModel, trx)
        return procedure.handler({ uid, model, ModelClass, env }, procedureInput.data)
      })

      const outputValidation = procedure.output.safeParse(result)
      if (!outputValidation.success) {
        logger.error('moon.rpc.audit', 'RPC procedure returned invalid output', {
          uid,
          model,
          method,
          error: outputValidation.error.message,
        })
        return sendJson(res, 500, { error: 'RPC procedure returned invalid output', code: 'RPC_OUTPUT_INVALID' }, req)
      }

      span?.setAttribute('rpc.model', model)
      span?.setAttribute('rpc.method', method)
      span?.setAttribute('auth.user_id', uid)
      span?.setStatus({ code: SpanStatusCode.OK })
      logger.info('moon.rpc.audit', 'RPC executed', { uid, model, method })
      return sendJson(res, 200, { result: outputValidation.data }, req)
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
  })
}
