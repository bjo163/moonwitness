import http from 'node:http'
import {
  setupOrm,
  teardownOrm,
  forge,
  getLastPending,
  getDb,
  getModel,
  createCtx,
  SUPERUSER_ID,
  Vertex,
  registerModel,
  registry,
  checkDbConnection,
  type DbConfig
} from '@moon/orm'
import { globalRoutes, HttpHandler } from './router.js'
import { createProxyHandler } from './proxy.js'
import { logger } from './logger.js'
import { generateOpenApi } from './openapi.js'
import {
  handleLogin,
  handleRegister,
  handleForgotPassword,
  handleVerifyOtp,
  handleResetPassword,
  handleLogout,
  handleGetSession,
  type AuthConfig
} from './handlers/auth.js'
import { handleDbStatus, handleMetaModels, handleMetaModel, handleHealth, handleLiveness, handleReadiness } from './handlers/meta.js'
import { handleRest } from './handlers/rest.js'
import { handleRpc } from './handlers/rpc.js'
import { handleSSE, getActiveClientCount, closeAllSSEConnections } from './handlers/sse.js'
import { renderDashboard, renderSwaggerUI } from './views/dashboard.js'
import { sendJson, handleCorsPreflight, type CorsConfig } from './utils/http.js'
import { authenticateRequest, AuthError, issueJwt } from './utils/auth.js'

export interface MoonConfig {
  database: DbConfig
  jwtSecret: string
  port?: number
  host?: string
  addons?: typeof Vertex[]
  cors?: CorsConfig
  onBoot?: () => Promise<void>
  email?: {
    service?: string
    user?: string
    pass?: string
    from?: string
  }
}

export function publish(topic: string, payload: any) {
  if ((globalThis as any).moonEmitter) {
    (globalThis as any).moonEmitter.emit('moon_event', { topic, payload })
  }
}

export class NativeServer {
  private config: MoonConfig
  private server: http.Server | null = null
  private metricInterval: NodeJS.Timeout | null = null
  private middlewares: ((req: http.IncomingMessage, res: http.ServerResponse, next: () => Promise<void>) => Promise<void> | void)[] = []

  constructor(config: MoonConfig) {
    this.config = config
    const isProduction = process.env.NODE_ENV === 'production'
    if (isProduction) {
      if (!config.jwtSecret || config.jwtSecret === 'secret' || config.jwtSecret.trim().length < 16) {
        throw new Error(
          '[moon.security] Fatal: In production (NODE_ENV=production), JWT_SECRET must be explicitly set to a strong secret (at least 16 characters).'
        )
      }
    } else {
      if (!config.jwtSecret || config.jwtSecret === 'secret') {
        logger.warn(
          'moon.security',
          'Insecure default JWT_SECRET is in use. Set JWT_SECRET in environment for production.'
        )
      }
    }
    setupOrm(config.database)
    if (config.addons) {
      for (const addon of config.addons) {
        registerModel(addon)
      }
    }
  }

  private buildHandlerChain(handler: HttpHandler): HttpHandler {
    const mws = this.middlewares
    return async (req, res) => {
      if (mws.length === 0) return handler(req, res)
      let index = 0
      const next = async () => {
        if (index < mws.length) {
          const mw = mws[index++]!
          return mw(req, res, next)
        }
        return handler(req, res)
      }
      return next()
    }
  }

  public use(mw: (req: http.IncomingMessage, res: http.ServerResponse, next: () => Promise<void>) => Promise<void> | void) {
    this.middlewares.push(mw)
  }

  private async requireAdmin(req: http.IncomingMessage, res: http.ServerResponse) {
    try {
      const session = await authenticateRequest(req, this.config.jwtSecret, { allowAnonymous: false })
      if (session.uid !== SUPERUSER_ID) {
        await sendJson(res, 403, { error: 'Administrator access required', code: 'AUTH_FORBIDDEN' }, req, this.config.cors)
        return null
      }
      return session
    } catch (error) {
      if (error instanceof AuthError) {
        await sendJson(res, error.statusCode, { error: error.message, code: error.code }, req, this.config.cors)
        return null
      }
      await sendJson(res, 500, { error: 'Internal server error', code: 'INTERNAL_ERROR' }, req, this.config.cors)
      return null
    }
  }

  private registerRoute(method: string, path: string, handler: HttpHandler) {
    const wrapped = this.buildHandlerChain(handler)
    globalRoutes.push({
      method,
      path,
      handler: wrapped,
      params: path.includes(':') ? path.match(/:([^/]+)/g)?.map(p => p.slice(1)) : undefined
    })
  }

  public get(path: string, handler: HttpHandler) {
    this.registerRoute('GET', path, handler)
  }

  public post(path: string, handler: HttpHandler) {
    this.registerRoute('POST', path, handler)
  }

  public put(path: string, handler: HttpHandler) {
    this.registerRoute('PUT', path, handler)
  }

  public delete(path: string, handler: HttpHandler) {
    this.registerRoute('DELETE', path, handler)
  }

  public proxy(method: string, path: string, targetUrl: string, options?: {
    cache?: string
    query?: string[]
    headers?: Record<string, string>
    apiKey?: string
  }) {
    const handler = createProxyHandler({
      targetUrl,
      ...options
    })
    this.registerRoute(method, path, handler)
  }

  private matchParamRoute(req: http.IncomingMessage, route: { path: string; handler: HttpHandler }): { handler: HttpHandler; params: Record<string, string> } | null {
    const path = ((req.url || '').split('?')[0]) ?? ''
    if (!route.path.includes(':')) return null
    const escapeRegex = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const pattern = route.path.split('/').map(segment => {
      if (segment === '') return ''
      if (segment.startsWith(':')) return '([^/]+)'
      return escapeRegex(segment)
    }).join('/')
    const regex = new RegExp(`^${pattern}$`)
    const match = path.match(regex)
    if (!match) return null
    const paramNames = (route.path.match(/:([^/]+)/g) || []).map(p => p.slice(1))
    const params: Record<string, string> = {}
    paramNames.forEach((name, idx) => {
      params[name] = match[idx + 1] as string
    })
    return { handler: route.handler, params }
  }

  public async handleRequest(req: http.IncomingMessage, res: http.ServerResponse) {
    const startTime = Date.now()
    
    const originalEnd = res.end
    res.end = function(chunk: any, encoding?: any, cb?: any) {
      const duration = Date.now() - startTime
      logger.info('moon.http', `${req.method} ${req.url} ${res.statusCode} (${duration}ms)`)
      return originalEnd.call(res, chunk, encoding, cb)
    } as any
    
    if (req.method === 'OPTIONS') {
      if (handleCorsPreflight(req, res, this.config.cors)) {
        return
      }
    }
    
    if (req.method === 'GET' && (req.url === '/favicon.ico' || req.url === '/favicon.png')) {
      res.writeHead(200, { 'Content-Type': 'image/x-icon' })
      return res.end()
    }

    const urlPath = (req.url || '').split('?')[0]
    const customRoute = globalRoutes.find(r => r.method === req.method && r.path === urlPath)
    if (customRoute) {
      return customRoute.handler(req, res)
    }

    const paramRoute = globalRoutes.find(r => {
      if (r.method !== req.method) return false
      if (!r.path.includes(':')) return false
      return this.matchParamRoute(req, r) !== null
    })
    if (paramRoute) {
      const matched = this.matchParamRoute(req, paramRoute)
      if (matched) {
        ;(req as any).params = matched.params
        return matched.handler(req, res)
      }
    }

    const authConfig: AuthConfig = {
      jwtSecret: this.config.jwtSecret,
      emailService: this.config.email?.service,
      emailUser: this.config.email?.user,
      emailPass: this.config.email?.pass,
      emailFrom: this.config.email?.from
    }

    if (req.method === 'GET' && (req.url === '/' || req.url === '')) {
      const session = await this.requireAdmin(req, res)
      if (!session) return
      const sessionToken = issueJwt({ sub: session.uid, email: session.email, tokenVersion: session.tokenVersion }, this.config.jwtSecret)
      const cookieFlags = process.env.NODE_ENV === 'production' ? '; Secure' : ''
      const html = renderDashboard()
      res.writeHead(200, {
        'Content-Type': 'text/html',
        'Cache-Control': 'no-store',
        'Set-Cookie': `moon_session=${encodeURIComponent(sessionToken)}; HttpOnly; SameSite=Strict; Path=/${cookieFlags}`
      })
      return res.end(html)
    }

    if (req.method === 'GET' && req.url === '/openapi.json') {
      return sendJson(res, 200, generateOpenApi(), req, this.config.cors)
    }

    if (req.method === 'GET' && req.url === '/docs') {
      const html = renderSwaggerUI()
      res.writeHead(200, { 'Content-Type': 'text/html' })
      return res.end(html)
    }

    if (req.method === 'POST' && req.url === '/auth/login') {
      return handleLogin(req, res, authConfig)
    }

    if (req.method === 'POST' && req.url === '/auth/register') {
      return handleRegister(req, res, authConfig)
    }

    if (req.method === 'POST' && req.url === '/auth/forgot-password') {
      return handleForgotPassword(req, res, authConfig)
    }

    if (req.method === 'POST' && req.url === '/auth/verify-otp') {
      return handleVerifyOtp(req, res, authConfig)
    }

    if (req.method === 'POST' && req.url === '/auth/reset-password') {
      return handleResetPassword(req, res, authConfig)
    }

    if (req.method === 'POST' && req.url === '/auth/logout') {
      return handleLogout(req, res, authConfig)
    }

    if (req.method === 'GET' && (req.url === '/auth/me' || req.url === '/auth/session')) {
      return handleGetSession(req, res, authConfig)
    }

    if (req.method === 'POST' && req.url === '/rpc') {
      return handleRpc(req, res, this.config.jwtSecret)
    }

    if (req.method === 'GET' && (req.url === '/health/live' || req.url === '/livez')) {
      return handleLiveness(req, res)
    }

    if (req.method === 'GET' && (req.url === '/health/ready' || req.url === '/readyz')) {
      return handleReadiness(req, res)
    }

    if (req.method === 'GET' && (req.url === '/health' || req.url === '/healthz' || req.url === '/api/health')) {
      return handleHealth(req, res)
    }

    if (req.method === 'GET' && req.url === '/db/status') {
      return handleDbStatus(req, res)
    }

    if (req.method === 'GET' && req.url === '/meta/models') {
      return handleMetaModels(req, res)
    }

    // Cosmic Matrix Engine: Rich single-model schema introspection
    const metaModelMatch = req.url?.match(/^\/api\/meta\/model\/([a-z0-9.-]+)(?:\?.*)?$/)
    if (req.method === 'GET' && metaModelMatch) {
      return handleMetaModel(req, res, metaModelMatch[1]!)
    }

    if (req.method === 'GET' && req.url && req.url.startsWith('/live')) {
      if (!(await this.requireAdmin(req, res))) return
      return handleSSE(req, res, { cors: this.config.cors })
    }

    // Capture any non-slash record-id segment here; handleRest performs the strict
    // positive-integer validation so malformed IDs deterministically return 400.
    const restMatch = req.url?.match(/^\/api\/([a-z0-9.-]+)(?:\/([^/?]+))?(?:\?.*)?$/)
    if (restMatch) {
      return handleRest(req, res, restMatch, this.config.jwtSecret)
    }

    return sendJson(res, 404, { error: 'Not Found' }, req, this.config.cors)
  }

  public async start() {
    try {
      const dbHealth = await checkDbConnection()
      if (dbHealth.ok) {
        logger.info(
          'moon.db',
          `Database connection established: [${dbHealth.dialect}] ${dbHealth.version || 'Connected'} (${dbHealth.latencyMs}ms)`
        )
      } else {
        logger.error(
          'moon.db',
          `Database connection failed: ${dbHealth.error} (${dbHealth.latencyMs}ms)`
        )
      }

      const { applied, summary } = await forge()
      if (applied.length > 0) {
        logger.info(
          'moon.schema',
          `Schema auto-sync: ${applied.length} changes applied (${summary.tablesCreated} tables, ${summary.columnsAdded} cols, ${summary.foreignKeysAdded} FKs, ${summary.indexesCreated} indexes)`
        )
      } else {
        logger.info(
          'moon.schema',
          `Schema verified & up-to-date: ${summary.totalModels} models (${summary.totalColumns} fields synchronized with PostgreSQL)`
        )
      }

      if (this.config.onBoot) {
        await this.config.onBoot()
      }

      const builtinRoutes = [
        { method: 'POST', path: '/auth/login' },
        { method: 'POST', path: '/auth/register' },
        { method: 'POST', path: '/auth/forgot-password' },
        { method: 'POST', path: '/auth/verify-otp' },
        { method: 'POST', path: '/auth/reset-password' },
        { method: 'POST', path: '/auth/logout' },
        { method: 'GET', path: '/auth/me' },
        { method: 'POST', path: '/rpc' },
        { method: 'GET', path: '/db/status' },
        { method: 'GET', path: '/meta/models' },
        { method: 'GET', path: '/live' },
        { method: 'GET', path: '/openapi.json' },
        { method: 'GET', path: '/docs' }
      ]

      logger.info('moon.rest', '--- Built-in Endpoints ---')
      for (const route of builtinRoutes) {
        logger.info('moon.rest', `${route.method.padEnd(14)} ${route.path}`)
      }
      
      if (globalRoutes.length > 0) {
        logger.info('moon.rest', '--- Custom Endpoints ---')
        for (const route of globalRoutes) {
          logger.info('moon.rest', `${route.method.padEnd(14)} ${route.path}`)
        }
      }

      logger.info('moon.rest', '--- Auto-Generated REST Endpoints ---')
      for (const [name] of registry) {
        logger.info('moon.rest', `GET, POST      /api/${name}`)
        logger.info('moon.rest', `GET, PUT, DEL  /api/${name}/:id`)
      }

      const server = http.createServer((req, res) => this.handleRequest(req, res))
      this.server = server

      const port = this.config.port || Number(process.env.API_PORT || process.env.PORT) || 4000
      const host = this.config.host || '0.0.0.0'
      
      server.listen(port, host, () => {
        logger.info('moon.core', `Native Engine running at http://${host}:${port}`)
        
        this.metricInterval = setInterval(async () => {
          try {
            const MxMetric = getModel('mx.metric')
            const activeCount = getActiveClientCount()
            if (MxMetric) {
              const env = createCtx(SUPERUSER_ID, {}, getModel as any)
              await MxMetric.spawn(MxMetric as any, env, { name: 'active_connections', value: activeCount })
            }
          } catch(e) {
            logger.error('moon.metrics', 'Failed to flush metric to DB', e)
          }
        }, 60000)
      })
    } catch (err) {
      logger.error('moon.core', 'Failed to start:', err)
      process.exit(1)
    }
  }

  public async stop(): Promise<void> {
    if (this.metricInterval) {
      clearInterval(this.metricInterval)
      this.metricInterval = null
    }

    closeAllSSEConnections()

    if (this.server) {
      await new Promise<void>((resolve, reject) => {
        this.server!.close((err) => (err ? reject(err) : resolve()))
      })
      this.server = null
    }

    await teardownOrm()
  }
}
