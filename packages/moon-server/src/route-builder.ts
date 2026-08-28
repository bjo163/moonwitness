/**
 * ◈ MOONWITNESS — DECLARATIVE ROUTE BUILDER
 *
 * DRY alternative to manual globalRoutes.push() with inline error handling.
 * Provides: auto CORS headers, auto query parsing, auto error envelopes,
 * optional auth check, runtime Zod schema validation, and clean RouteContext for handlers.
 */
import type { IncomingMessage, ServerResponse } from 'node:http'
import { z } from 'zod'
import { globalRoutes } from './router.js'
import { authenticateRequest, AuthError } from './utils/auth.js'
import { createCtx, getModel, SUPERUSER_ID, ANONYMOUS_ID, AuthorizationError } from '@moon/orm'
import { resolveCorsOrigin, getSecurityHeaders, getCorsConfig } from './utils/http.js'
import { defineEndpoint } from '@moon/protocol'

// ── ROUTE CONTEXT ─────────────────────────────────────────────
export interface RouteContext {
  /** Parsed query params from URL */
  query: Record<string, string>
  /** Parsed JSON body (POST/PUT) */
  body: any
  /** Raw IncomingMessage (escape hatch) */
  req: IncomingMessage
  /** Raw ServerResponse (escape hatch) */
  res: ServerResponse
  /** ORM context for the authenticated user */
  env: ReturnType<typeof createCtx>
  /** Authenticated user ID */
  uid: number
  /** URL path params from route pattern (e.g. :id) */
  params: Record<string, string>
}

export interface SchemaValidator<T = any> {
  safeParse: (data: unknown) => { success: true; data: T } | { success: false; error: any }
}

export interface RouteSchemas {
  body?: SchemaValidator
  query?: SchemaValidator
  params?: SchemaValidator
}

// ── ROUTE DEFINITION ──────────────────────────────────────────
export interface RouteDefinition<TBody = any, TQuery = Record<string, string>> {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE'
  path: string
  /** Auth requirement: 'none' = public, 'user' = any authenticated, 'admin' = superuser only */
  auth?: 'none' | 'user' | 'admin'
  /** Optional Zod runtime validation schemas for body, query, or params */
  schema?: RouteSchemas
  /** OpenAPI group(s). Defaults to a tag derived from the path. */
  tags?: string[]
  /** Human-readable summary/description for the generated OpenAPI document. */
  summary?: string
  description?: string
  /** Optional Zod response schema; surfaced in the generated OpenAPI document. */
  response?: z.ZodTypeAny
  /** Handler receives clean context, returns data to be JSON-serialized */
  handler: (ctx: RouteContext & { body: TBody; query: TQuery }) => Promise<unknown>
}

function buildHeaders(req: IncomingMessage): Record<string, string> {
  const headers = getSecurityHeaders()
  headers['Content-Type'] = 'application/json'
  const reqOrigin = req.headers.origin as string | undefined
  const corsConfig = getCorsConfig()
  const allowedOrigin = resolveCorsOrigin(reqOrigin, corsConfig)
  if (allowedOrigin) {
    headers['Access-Control-Allow-Origin'] = allowedOrigin
    if (allowedOrigin !== '*') {
      headers['Vary'] = 'Origin'
      if (corsConfig?.allowCredentials !== false) {
        headers['Access-Control-Allow-Credentials'] = 'true'
      }
    }
    headers['Access-Control-Allow-Methods'] = 'OPTIONS, POST, GET, PUT, DELETE, PATCH'
    headers['Access-Control-Allow-Headers'] =
      (req.headers['access-control-request-headers'] as string) ||
      'Content-Type, Authorization, X-Requested-With, Accept, Origin, Cache-Control, Last-Event-ID'
  }
  return headers
}

/**
 * Parse JSON body from request (max 1MB)
 */
async function readBody(req: IncomingMessage): Promise<any> {
  if (req.method === 'GET' || req.method === 'HEAD' || req.method === 'DELETE') {
    return {}
  }

  return new Promise((resolve, reject) => {
    let body = ''
    let size = 0
    const MAX = 1024 * 1024

    req.on('data', (chunk: Buffer | string) => {
      const part = typeof chunk === 'string' ? chunk : chunk.toString('utf8')
      size += Buffer.byteLength(part)
      if (size > MAX) {
        req.destroy()
        return reject(Object.assign(new Error('Request body too large'), { statusCode: 413 }))
      }
      body += part
    })

    req.on('end', () => {
      if (!body.trim()) return resolve({})
      try { resolve(JSON.parse(body)) }
      catch { reject(Object.assign(new Error('Invalid JSON body'), { statusCode: 400 })) }
    })

    req.on('error', reject)
  })
}

/**
 * Parse query string from URL into Record
 */
function parseQueryParams(url: string): Record<string, string> {
  const q: Record<string, string> = {}
  const idx = url.indexOf('?')
  if (idx === -1) return q
  const params = url.slice(idx + 1).split('&')
  for (const p of params) {
    const eqIdx = p.indexOf('=')
    if (eqIdx === -1) continue
    const k = decodeURIComponent(p.slice(0, eqIdx))
    const v = decodeURIComponent(p.slice(eqIdx + 1))
    q[k] = v
  }
  return q
}

/**
 * Register a route using the declarative pattern.
 * Auto-handles: error wrapping, CORS, query parsing, body parsing, auth, and Zod schema validation.
 */
export function defineRoute(def: RouteDefinition): void {
  const isSystemMutation = def.path.startsWith('/api/system/') && def.method !== 'GET'
  if (isSystemMutation && def.auth !== 'admin') {
    throw new Error(`System mutation routes must explicitly require admin authorization: ${def.method} ${def.path}`)
  }

  // Register the canonical contract so the generated OpenAPI document and
  // contract tests read the same source of truth as the runtime handler.
  defineEndpoint({
    method: def.method,
    path: def.path,
    auth: def.auth || 'none',
    tags: def.tags,
    description: def.description || def.summary,
    query: def.schema?.query as any,
    body: def.schema?.body as any,
    params: def.schema?.params as any,
    response: def.response || (z.unknown() as any),
    successStatus: def.method === 'POST' ? 200 : 200,
  })

  globalRoutes.push({
    method: def.method,
    path: def.path,
    handler: async (req: IncomingMessage, res: ServerResponse) => {
      try {
        // ── AUTH ──
        const jwtSecret = process.env.JWT_SECRET || ''
        let uid = ANONYMOUS_ID
        const authLevel = def.auth || 'none'

        if (authLevel !== 'none') {
          try {
            const session = await authenticateRequest(req, jwtSecret, {
              allowAnonymous: false,
            })
            uid = session.uid

            if (authLevel === 'admin' && uid !== SUPERUSER_ID) {
              res.writeHead(403, buildHeaders(req))
              res.end(JSON.stringify({ error: 'Administrator access required', code: 'AUTH_FORBIDDEN' }))
              return
            }
          } catch (error) {
            if (error instanceof AuthError) {
              res.writeHead(error.statusCode, buildHeaders(req))
              res.end(JSON.stringify({ error: error.message, code: error.code }))
              return
            }
            throw error
          }
        }

        // ── PARSE ──
        let query = parseQueryParams(req.url || '')
        let body = await readBody(req)
        const params = (req as any).params || {}
        const env = createCtx(uid, {}, getModel as any)

        // ── SCHEMA VALIDATION ──
        if (def.schema) {
          if (def.schema.query) {
            const parsedQuery = def.schema.query.safeParse(query)
            if (!parsedQuery.success) {
              res.writeHead(400, buildHeaders(req))
              res.end(JSON.stringify({
                error: 'Invalid query parameters',
                code: 'VALIDATION_ERROR',
                details: parsedQuery.error.format ? parsedQuery.error.format() : parsedQuery.error,
              }))
              return
            }
            query = parsedQuery.data
          }

          if (def.schema.body && (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH')) {
            const parsedBody = def.schema.body.safeParse(body)
            if (!parsedBody.success) {
              res.writeHead(400, buildHeaders(req))
              res.end(JSON.stringify({
                error: 'Invalid request body',
                code: 'VALIDATION_ERROR',
                details: parsedBody.error.format ? parsedBody.error.format() : parsedBody.error,
              }))
              return
            }
            body = parsedBody.data
          }
        }

        // ── EXECUTE ──
        const result = await def.handler({ query, body, req, res, env, uid, params })

        // If handler already sent response (escape hatch), skip
        if (res.writableEnded) return

        // ── RESPOND ──
        res.writeHead(200, buildHeaders(req))
        res.end(JSON.stringify(result))
      } catch (err: any) {
        // Don't double-send if already responded
        if (res.writableEnded) return

        if (err instanceof AuthError) {
          res.writeHead(err.statusCode, buildHeaders(req))
          res.end(JSON.stringify({ error: err.message, code: err.code }))
          return
        }
        if (err instanceof AuthorizationError) {
          res.writeHead(err.statusCode, buildHeaders(req))
          res.end(JSON.stringify({ error: err.message, code: err.code }))
          return
        }

        const statusCode = err?.statusCode || 500
        const code = err?.code || 'INTERNAL_ERROR'
        res.writeHead(statusCode, buildHeaders(req))
        res.end(JSON.stringify({ error: err?.message || 'Internal server error', code }))
      }
    },
  })
}
