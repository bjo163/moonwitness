import fastify from 'fastify'
import type { FastifyInstance, FastifyRequest, FastifyReply, FastifyError, HTTPMethods } from 'fastify'
import type { IncomingMessage, ServerResponse } from 'node:http'
import {
  setupOrm,
  teardownOrm,
  getModel,
  createCtx,
  SUPERUSER_ID,
  Vertex,
  registerModel,
  checkDbConnection,
  forge,
  registry,
  type DbConfig,
  isSqlite,
} from '@moon/orm'
import { defineEndpoint, type EndpointDef } from '@moon/protocol'
import { authenticateRequest, AuthError, issueJwt, resolveUserRole } from './utils/auth.js'
import {
  handleLogin,
  handleRegister,
  handleForgotPassword,
  handleVerifyOtp,
  handleResetPassword,
  handleLogout,
  handleGetSession,
  type AuthConfig,
} from './handlers/auth.js'
import {
  handleDbStatus,
  handleMetaModels,
  handleMetaModel,
  handleHealth,
  handleLiveness,
  handleReadiness,
} from './handlers/meta.js'
import { handleRest } from './handlers/rest.js'
import { handleRpc } from './handlers/rpc.js'
import { handleSSE, getActiveClientCount, closeAllSSEConnections } from './handlers/sse.js'
import { sendJson, setCorsConfig, handleCorsPreflight, getSecurityHeaders, type CorsConfig } from './utils/http.js'
import { logger } from './logger.js'
import { globalRoutes, type HttpHandler } from './router.js'
import { createProxyHandler } from './proxy.js'
import { renderDashboard, renderSwaggerUI } from './views/dashboard.js'
import { generateOpenApi } from './openapi.js'
import { bootstrapTelemetry, shutdownTelemetry } from './telemetry.js'

export interface FastifyAdapterConfig {
  database: DbConfig
  jwtSecret: string
  port?: number
  host?: string
  addons?: typeof Vertex[]
  cors?: CorsConfig
  onBoot?: () => Promise<void>
  email?: { service?: string; user?: string; pass?: string; from?: string }
}

type MoonMiddleware = (
  req: IncomingMessage,
  res: ServerResponse,
  next: () => Promise<void>,
) => Promise<void> | void

function resolveCorsConfig(config?: CorsConfig): CorsConfig {
  if (config) return config
  const rawOrigins = (process.env.ALLOWED_ORIGINS || '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean)

  if (rawOrigins.length > 0) {
    return {
      allowedOrigins: rawOrigins,
      allowCredentials: true,
    }
  }

  // In development, automatically allow localhost and loopback origins
  if (process.env.NODE_ENV !== 'production') {
    return {
      allowedOrigins: (origin: string) => {
        try {
          const url = new URL(origin)
          return (
            url.hostname === 'localhost' ||
            url.hostname === '127.0.0.1' ||
            url.hostname === '0.0.0.0'
          )
        } catch {
          return false
        }
      },
      allowCredentials: true,
    }
  }

  return {
    allowedOrigins: [],
    allowCredentials: true,
  }
}

const PG_CLIENTS = new Set(['pg', 'postgres', 'postgresql'])

function normalizeDatabaseUrl(config: DbConfig): string {
  if (typeof config === 'string') return config.trim()
  const knexConfig: any = typeof config === 'function' ? (config as any).client?.config : config
  if (!knexConfig || typeof knexConfig !== 'object') return ''
  const client = String(knexConfig.client ?? '').toLowerCase()
  const connection = knexConfig.connection
  if (typeof connection === 'string') return connection.trim()
  if (connection && typeof connection === 'object') {
    if (typeof connection.filename === 'string') return `sqlite://${connection.filename}`
    const host = connection.host ? String(connection.host) : ''
    const scheme = PG_CLIENTS.has(client) ? 'postgres' : client
    if (!host) return scheme ? `${scheme}://` : ''
    const port = connection.port ? `:${connection.port}` : ''
    const database = connection.database ? `/${connection.database}` : ''
    return `${scheme}://${host}${port}${database}`
  }
  return client ? `${PG_CLIENTS.has(client) ? 'postgres' : client}://` : ''
}

function assertProductionDatabase(config: DbConfig): void {
  const reject = (reason: string): never => {
    throw new Error(`[moon.security] Fatal: production DATABASE_URL ${reason}`)
  }
  const url = normalizeDatabaseUrl(config)
  if (!url) reject('must be explicit and non-empty.')
  const lower = url.toLowerCase()
  if (lower.startsWith('sqlite') || lower === ':memory:' || /\.(db|sqlite|sqlite3)$/.test(lower)) {
    reject('must not use SQLite in production.')
  }
  if (!/^(postgres(ql)?|pg):\/\//.test(lower)) reject('must use the PostgreSQL dialect.')
  let parsed: URL
  try {
    parsed = new URL(url)
  } catch {
    return reject('must be a valid PostgreSQL URL.')
  }
  const host = parsed.hostname.toLowerCase()
  if (!host || host === 'localhost' || host === '127.0.0.1' || host === '::1' || host === '[::1]' || host === '0.0.0.0') {
    reject('must be explicit and non-localhost.')
  }
}

// vue.global.js compiles in-DOM templates via new Function, so the dashboard needs 'unsafe-eval';
// both views load Vue/Swagger assets from unpkg and use inline scripts/styles.
const HTML_CSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://unpkg.com",
  "style-src 'self' 'unsafe-inline' https://unpkg.com",
  "img-src 'self' data:",
  "connect-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'self'",
].join('; ')


export class FastifyAdapter {
  private readonly config: FastifyAdapterConfig
  private readonly middlewares: MoonMiddleware[] = []
  private app: FastifyInstance | null = null
  private metricInterval: NodeJS.Timeout | null = null
  private started = false

  constructor(config: FastifyAdapterConfig) {
    this.config = { ...config, cors: resolveCorsConfig(config.cors) }
    setCorsConfig(this.config.cors!)

    if (process.env.NODE_ENV === 'production') {
      if (!config.jwtSecret || config.jwtSecret === 'secret' || config.jwtSecret.trim().length < 16) {
        throw new Error('[moon.security] Fatal: JWT_SECRET must be a strong explicit production secret.')
      }
      assertProductionDatabase(config.database)
    } else if (!config.jwtSecret || config.jwtSecret === 'secret') {
      logger.warn('moon.security', 'Insecure default JWT_SECRET is in use. Set JWT_SECRET for production.')
    }

    setupOrm(config.database)
    for (const addon of config.addons ?? []) registerModel(addon)
  }

  public use(middleware: MoonMiddleware) {
    if (this.started) throw new Error('Moon middleware must be registered before server.start()')
    this.middlewares.push(middleware)
  }

  private registerRoute(method: string, path: string, handler: HttpHandler, auth: 'none' | 'user' | 'admin' = 'none') {
    if (this.started) throw new Error('Moon routes must be registered before server.start()')

    const effectiveHandler = auth === 'none' ? handler : this.withAuth(handler, auth)

    globalRoutes.push({ method, path, handler: effectiveHandler })
    defineEndpoint({ method: method as EndpointDef['method'], path, description: `Dynamic route ${method} ${path}`, auth })
  }

  private withAuth(handler: HttpHandler, auth: 'user' | 'admin'): HttpHandler {
    return async (req: IncomingMessage, res: ServerResponse) => {
      try {
        const session = await authenticateRequest(req, this.config.jwtSecret, { allowAnonymous: false })
        if (auth === 'admin' && session.uid !== SUPERUSER_ID) {
          // Allow users with admin/superadmin role (clearance >= 2) in addition to SUPERUSER_ID
          const authCtx = createCtx(session.uid, {}, getModel as any)
          const { clearanceLevel } = await resolveUserRole(session.uid, authCtx)
          if (clearanceLevel < 2) {
            sendJson(res, 403, { error: 'Administrator access required', code: 'AUTH_FORBIDDEN' }, req, this.config.cors)
            return
          }
        }
        ;(req as any).__moonSession = session
        return await handler(req, res)
      } catch (error) {
        if (error instanceof AuthError) {
          sendJson(res, error.statusCode, { error: error.message, code: error.code }, req, this.config.cors)
        } else {
          sendJson(res, 401, { error: 'Authentication required', code: 'AUTH_REQUIRED' }, req, this.config.cors)
        }
      }
    }
  }

  public get(path: string, handler: HttpHandler, auth: 'none' | 'user' | 'admin' = 'none') {
    this.registerRoute('GET', path, handler, auth)
  }

  public post(path: string, handler: HttpHandler, auth: 'none' | 'user' | 'admin' = 'none') {
    this.registerRoute('POST', path, handler, auth)
  }

  public put(path: string, handler: HttpHandler, auth: 'none' | 'user' | 'admin' = 'none') {
    this.registerRoute('PUT', path, handler, auth)
  }

  public delete(path: string, handler: HttpHandler, auth: 'none' | 'user' | 'admin' = 'none') {
    this.registerRoute('DELETE', path, handler, auth)
  }

  public proxy(
    method: string,
    path: string,
    targetUrl: string,
    options?: { cache?: string; query?: string[]; headers?: Record<string, string>; apiKey?: string; timeoutMs?: number },
    auth: 'none' | 'user' | 'admin' = 'user',
  ) {
    this.registerRoute(method, path, createProxyHandler({ targetUrl, method, ...options }), auth)
  }

  private bridgeRequest(req: FastifyRequest): IncomingMessage {
    const raw = req.raw as IncomingMessage & {
      __moonBody?: unknown
      __moonBodyPresent?: boolean
      params?: Record<string, string>
      requestId?: string
    }
    raw.__moonBody = req.body
    raw.__moonBodyPresent = true
    raw.params = (req.params ?? {}) as Record<string, string>
    raw.requestId = req.id
    return raw
  }

  private async runMiddlewares(req: IncomingMessage, res: ServerResponse, handler: () => Promise<void> | void) {
    let index = 0
    const next = async (): Promise<void> => {
      const middleware = this.middlewares[index++]
      if (middleware) return void await middleware(req, res, next)
      await handler()
    }
    await next()
  }

  private rawHandler(handler: HttpHandler) {
    return async (req: FastifyRequest, reply: FastifyReply) => {
      const startedAt = Date.now()
      const rawReq = this.bridgeRequest(req)
      reply.raw.setHeader('x-request-id', req.id)
      reply.hijack()
      try {
        await this.runMiddlewares(rawReq, reply.raw, () => handler(rawReq, reply.raw))
      } catch (error) {
        logger.error('moon.http', `Unhandled handler error: ${req.method} ${req.url}`, {
          requestId: req.id,
          error: error instanceof Error ? { message: error.message, stack: error.stack } : String(error),
        })
        const res = reply.raw
        if (!res.headersSent) {
          sendJson(res, 500, { error: 'Internal server error', code: 'INTERNAL_ERROR', requestId: req.id }, rawReq, this.config.cors)
        }
        if (!res.writableEnded) res.end()
      }
      logger.info('moon.http', `${req.method} ${req.url} ${reply.raw.statusCode} (${Date.now() - startedAt}ms)`, { requestId: req.id })
    }
  }

  private async requireAdmin(req: IncomingMessage, res: ServerResponse) {
    try {
      const session = await authenticateRequest(req, this.config.jwtSecret, { allowAnonymous: false })
      if (session.uid !== SUPERUSER_ID) {
        // Allow users with admin/superadmin role (clearance >= 2) in addition to SUPERUSER_ID
        const authCtx = createCtx(session.uid, {}, getModel as any)
        const { clearanceLevel } = await resolveUserRole(session.uid, authCtx)
        if (clearanceLevel < 2) {
          sendJson(res, 403, { error: 'Administrator access required', code: 'AUTH_FORBIDDEN' }, req, this.config.cors)
          return null
        }
      }
      return session
    } catch (error) {
      if (error instanceof AuthError) {
        sendJson(res, error.statusCode, { error: error.message, code: error.code }, req, this.config.cors)
      } else {
        sendJson(res, 500, { error: 'Internal server error', code: 'INTERNAL_ERROR' }, req, this.config.cors)
      }
      return null
    }
  }

  private addRawRoute(app: FastifyInstance, method: string, path: string, handler: HttpHandler) {
    app.route({ method: method as HTTPMethods, url: path, handler: this.rawHandler(handler) })
  }

  private registerBuiltinRoutes(app: FastifyInstance) {
    const authConfig: AuthConfig = {
      jwtSecret: this.config.jwtSecret,
      emailService: this.config.email?.service,
      emailUser: this.config.email?.user,
      emailPass: this.config.email?.pass,
      emailFrom: this.config.email?.from,
    }

    this.addRawRoute(app, 'GET', '/', async (req, res) => {
      const session = await this.requireAdmin(req, res)
      if (!session) return
      const authCtx = createCtx(session.uid, {}, getModel as any)
      const { role, clearanceLevel } = await resolveUserRole(session.uid, authCtx)
      const token = issueJwt({
        sub: session.uid,
        email: session.email,
        tokenVersion: session.tokenVersion,
        role,
        clearanceLevel,
      }, this.config.jwtSecret)
      const secure = process.env.NODE_ENV === 'production' ? '; Secure' : ''
      res.writeHead(200, {
        'Content-Type': 'text/html',
        'Cache-Control': 'no-store',
        ...getSecurityHeaders(),
        'Content-Security-Policy': HTML_CSP,
        'Set-Cookie': `moon_session=${encodeURIComponent(token)}; HttpOnly; SameSite=Strict; Path=/${secure}`,
      })
      res.end(renderDashboard())
    })
    this.addRawRoute(app, 'GET', '/openapi.json', (req, res) => sendJson(res, 200, generateOpenApi(), req, this.config.cors))
    this.addRawRoute(app, 'GET', '/docs', (_req, res) => {
      res.writeHead(200, {
        'Content-Type': 'text/html',
        ...getSecurityHeaders(),
        'Content-Security-Policy': HTML_CSP,
      })
      res.end(renderSwaggerUI())
    })
    this.addRawRoute(app, 'POST', '/auth/login', (req, res) => handleLogin(req, res, authConfig))
    this.addRawRoute(app, 'POST', '/auth/register', (req, res) => handleRegister(req, res, authConfig))
    this.addRawRoute(app, 'POST', '/auth/forgot-password', (req, res) => handleForgotPassword(req, res, authConfig))
    this.addRawRoute(app, 'POST', '/auth/verify-otp', (req, res) => handleVerifyOtp(req, res, authConfig))
    this.addRawRoute(app, 'POST', '/auth/reset-password', (req, res) => handleResetPassword(req, res, authConfig))
    this.addRawRoute(app, 'POST', '/auth/logout', (req, res) => handleLogout(req, res, authConfig))
    this.addRawRoute(app, 'GET', '/auth/me', (req, res) => handleGetSession(req, res, authConfig))
    this.addRawRoute(app, 'GET', '/auth/session', (req, res) => handleGetSession(req, res, authConfig))
    this.addRawRoute(app, 'POST', '/rpc', (req, res) => handleRpc(req, res, this.config.jwtSecret))
    
    for (const path of ['/health/live', '/livez']) this.addRawRoute(app, 'GET', path, handleLiveness)
    for (const path of ['/health/ready', '/readyz']) this.addRawRoute(app, 'GET', path, handleReadiness)
    for (const path of ['/health', '/healthz', '/api/health', '/api/system/health']) this.addRawRoute(app, 'GET', path, handleHealth)
    this.addRawRoute(app, 'GET', '/db/status', this.withAuth(handleDbStatus, 'admin'))
    this.addRawRoute(app, 'GET', '/meta/models', this.withAuth(handleMetaModels, 'user'))
    this.addRawRoute(app, 'GET', '/api/meta/model/:model', this.withAuth((req, res) => handleMetaModel(req, res, (req as any).params.model), 'user'))
    this.addRawRoute(app, 'GET', '/live', async (req, res) => {
      if (!(await this.requireAdmin(req, res))) return
      handleSSE(req, res, { cors: this.config.cors, jwtSecret: this.config.jwtSecret })
    })

    const rest = (withId: boolean): HttpHandler => (req, res) => {
      const params = (req as any).params ?? {}
      const match = ['', params.model, ...(withId ? [String(params.id)] : [])] as unknown as RegExpMatchArray
      return handleRest(req, res, match, this.config.jwtSecret)
    }
    for (const method of ['GET', 'POST']) this.addRawRoute(app, method, '/api/:model', rest(false))
    for (const method of ['GET', 'PUT', 'DELETE']) this.addRawRoute(app, method, '/api/:model/:id', rest(true))
  }

  private registerCustomRoutes(app: FastifyInstance) {
    const seen = new Set<string>()
    for (const route of globalRoutes) {
      const key = `${route.method.toUpperCase()} ${route.path}`
      if (seen.has(key)) continue
      seen.add(key)
      this.addRawRoute(app, route.method.toUpperCase(), route.path, route.handler)
    }
  }

  private ensureApp(): FastifyInstance {
    if (this.app) return this.app
    const app = fastify({
      logger: false,
      bodyLimit: (Number(process.env.MAX_REQUEST_BODY_MB || 1) || 1) * 1024 * 1024,
      requestIdHeader: 'x-request-id',
    })
    app.addHook('onRequest', async (req, reply) => {
      reply.header('x-request-id', req.id)
    })
    app.setErrorHandler<FastifyError>((error, request, reply) => {
      const statusCode = error.statusCode && error.statusCode >= 400 && error.statusCode < 500 ? error.statusCode : 500
      if (statusCode >= 500) {
        logger.error('moon.http', `Unhandled request error: ${request.method} ${request.url}`, {
          requestId: request.id,
          error: { message: error.message, stack: error.stack },
        })
        reply.status(500).send({ error: 'Internal server error', code: 'INTERNAL_ERROR', requestId: request.id })
        return
      }
      reply.status(statusCode).send({ error: error.message, code: error.code ?? 'BAD_REQUEST' })
    })
    this.registerCustomRoutes(app)
    this.registerBuiltinRoutes(app)
    app.options('/*', this.rawHandler((req, res) => {
      if (!handleCorsPreflight(req, res, this.config.cors)) {
        res.writeHead(204)
        res.end()
      }
    }))
    app.setNotFoundHandler(this.rawHandler((req, res) => sendJson(res, 404, { error: 'Not Found', code: 'NOT_FOUND' }, req, this.config.cors)))
    this.app = app
    return app
  }

  private async verifySchema() {
    if (process.env.MOON_AUTO_SYNC === 'true' || isSqlite()) {
      const { applied, summary } = await forge()
      if (applied.length > 0) {
        logger.info('moon.schema', `Schema auto-sync complete: ${applied.length} changes across ${summary.totalModels} models`)
      } else {
        logger.info('moon.schema', `Schema verified: ${summary.totalModels} models / ${summary.totalColumns} fields`)
      }
      return
    }
    const { migrations, summary } = await forge({ dryRun: true })
    if (migrations.length > 0) {
      logger.warn('moon.schema', `Schema drift detected: ${migrations.length} pending changes across ${summary.totalModels} models`)
    } else {
      logger.info('moon.schema', `Schema verified: ${summary.totalModels} models / ${summary.totalColumns} fields`)
    }
  }

  /** Compatibility shim for legacy tests/callers; routing is still executed by Fastify. */
  public async handleRequest(req: IncomingMessage, res: ServerResponse): Promise<void> {
    const app = this.ensureApp()
    const body = (req as any).__moonBody ?? (req as any).body
    const response: any = await (app.inject as any)({
      method: req.method || 'GET',
      url: req.url || '/',
      headers: req.headers,
      payload: body === undefined ? undefined : body,
    })
    for (const [name, value] of Object.entries(response.headers as Record<string, unknown>)) {
      if (value !== undefined && res.setHeader) res.setHeader(name, value as any)
    }
    res.writeHead(response.statusCode)
    res.end(response.body)
  }

  public async start() {
    if (this.started) return
    await bootstrapTelemetry({ serviceName: 'moonwitness-api' })

    const dbHealth = await checkDbConnection()
    if (dbHealth.ok) logger.info('moon.db', `Database connected: ${dbHealth.dialect} (${dbHealth.latencyMs}ms)`)
    else logger.error('moon.db', `Database connection failed: ${dbHealth.error}`)

    await this.verifySchema()
    if (this.config.onBoot) await this.config.onBoot()

    const app = this.ensureApp()
    const port = this.config.port ?? (Number(process.env.API_PORT || process.env.PORT) || 4000)
    const host = this.config.host || '0.0.0.0'
    await app.listen({ port, host })
    this.started = true
    logger.info('moon.core', `Fastify Engine running at http://${host}:${port}`)
    logger.info('moon.rest', `Registered ${globalRoutes.length} custom routes and ${registry.size} model REST surfaces`)

    this.metricInterval = setInterval(async () => {
      try {
        await this.flushConnectionMetric()
      } catch (error) {
        logger.error('moon.metrics', 'Failed to flush active connection metric', error)
      }
    }, 60000)
    this.metricInterval.unref()
  }

  private async flushConnectionMetric(): Promise<void> {
    const MxMetric = getModel('mx.metric')
    if (!MxMetric) return
    const env = createCtx(SUPERUSER_ID, {}, getModel as any)
    const value = getActiveClientCount()
    const existing = await MxMetric.fetch(MxMetric as any, env, [['name', '=', 'active_connections']], ['id'], { limit: 1 })
    if (existing.length > 0) {
      await MxMetric.morph(MxMetric as any, env, existing[0].id, { value })
    } else {
      await MxMetric.spawn(MxMetric as any, env, { name: 'active_connections', value })
    }
  }

  public async stop(): Promise<void> {
    if (this.metricInterval) clearInterval(this.metricInterval)
    this.metricInterval = null
    closeAllSSEConnections()
    if (this.app) await this.app.close()
    this.app = null
    this.started = false
    await teardownOrm()
    await shutdownTelemetry()
  }
}
