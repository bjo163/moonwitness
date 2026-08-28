import fastify from 'fastify'
import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import { setupOrm, teardownOrm, getDb, getModel, createCtx, SUPERUSER_ID, Vertex, registerModel, checkDbConnection, forge, registry, type DbConfig } from '@moon/orm'
import { authenticateRequest, AuthError, issueJwt } from './utils/auth.js'
import { handleLogin, handleRegister, handleForgotPassword, handleVerifyOtp, handleResetPassword, handleLogout, handleGetSession, type AuthConfig } from './handlers/auth.js'
import { handleDbStatus, handleMetaModels, handleMetaModel, handleHealth, handleLiveness, handleReadiness } from './handlers/meta.js'
import { handleRest } from './handlers/rest.js'
import { handleRpc } from './handlers/rpc.js'
import { handleSSE, getActiveClientCount, closeAllSSEConnections } from './handlers/sse.js'
import { sendJson, setCorsConfig, type CorsConfig } from './utils/http.js'
import { logger } from './logger.js'
import { globalRoutes, HttpHandler } from './router.js'
import { createProxyHandler } from './proxy.js'
import { renderDashboard, renderSwaggerUI } from './views/dashboard.js'
import { generateOpenApi } from './openapi.js'

export interface FastifyAdapterConfig {
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

export class FastifyAdapter {
  private config: FastifyAdapterConfig
  private app: FastifyInstance | null = null
  private metricInterval: NodeJS.Timeout | null = null

  constructor(config: FastifyAdapterConfig) {
    this.config = config
    if (config.cors) {
      setCorsConfig(config.cors)
    }
    const isProduction = process.env.NODE_ENV === 'production'
    if (isProduction) {
      if (!config.jwtSecret || config.jwtSecret === 'secret' || config.jwtSecret.trim().length < 16) {
        throw new Error('[moon.security] Fatal: In production (NODE_ENV=production), JWT_SECRET must be explicitly set to a strong secret (at least 16 characters).')
      }
      if (!config.database || String(config.database).includes('localhost')) {
        throw new Error('[moon.security] Fatal: In production (NODE_ENV=production), DATABASE_URL must be explicitly set to a non-localhost database connection string.')
      }
    } else {
      if (!config.jwtSecret || config.jwtSecret === 'secret') {
        logger.warn('moon.security', 'Insecure default JWT_SECRET is in use. Set JWT_SECRET in environment for production.')
      }
    }
    setupOrm(config.database)
    if (config.addons) {
      for (const addon of config.addons) {
        registerModel(addon)
      }
    }
  }

  private async requireAdmin(req: FastifyRequest, res: FastifyReply) {
    try {
      const session = await authenticateRequest(req.raw as any, this.config.jwtSecret, { allowAnonymous: false })
      if (session.uid !== SUPERUSER_ID) {
        await sendJson(res.raw as any, 403, { error: 'Administrator access required', code: 'AUTH_FORBIDDEN' }, req.raw as any, this.config.cors)
        return null
      }
      return session
    } catch (error) {
      if (error instanceof AuthError) {
        await sendJson(res.raw as any, error.statusCode, { error: error.message, code: error.code }, req.raw as any, this.config.cors)
        return null
      }
      await sendJson(res.raw as any, 500, { error: 'Internal server error', code: 'INTERNAL_ERROR' }, req.raw as any, this.config.cors)
      return null
    }
  }

  private buildHandler(handler: HttpHandler): (req: FastifyRequest, res: FastifyReply) => Promise<void> | void {
    return async (req: FastifyRequest, res: FastifyReply) => {
      const startTime = Date.now()
      const originalSend = res.send.bind(res)
      res.send = function (payload: any) {
        const duration = Date.now() - startTime
        logger.info('moon.http', `${req.method} ${req.url} ${res.statusCode} (${duration}ms)`)
        return originalSend(payload)
      } as any
      return handler(req as any, res as any)
    }
  }

  public get(path: string, handler: HttpHandler) {
    this.app?.get(path, this.buildHandler(handler))
  }

  public post(path: string, handler: HttpHandler) {
    this.app?.post(path, this.buildHandler(handler))
  }

  public put(path: string, handler: HttpHandler) {
    this.app?.put(path, this.buildHandler(handler))
  }

  public delete(path: string, handler: HttpHandler) {
    this.app?.delete(path, this.buildHandler(handler))
  }

  public proxy(method: string, path: string, targetUrl: string, options?: {
    cache?: string
    query?: string[]
    headers?: Record<string, string>
    apiKey?: string
  }) {
    const handler = createProxyHandler({ targetUrl, ...options })
    const fastifyHandler = this.buildHandler(handler)
    switch (method) {
      case 'GET':
        this.app?.get(path, fastifyHandler)
        break
      case 'POST':
        this.app?.post(path, fastifyHandler)
        break
      case 'PUT':
        this.app?.put(path, fastifyHandler)
        break
      case 'DELETE':
        this.app?.delete(path, fastifyHandler)
        break
    }
  }

  public async start() {
    try {
      const dbHealth = await checkDbConnection()
      if (dbHealth.ok) {
        logger.info('moon.db', `Database connection established: [${dbHealth.dialect}] ${dbHealth.version || 'Connected'} (${dbHealth.latencyMs}ms)`)
      } else {
        logger.error('moon.db', `Database connection failed: ${dbHealth.error} (${dbHealth.latencyMs}ms)`)
      }

      const { applied, summary } = await forge()
      if (applied.length > 0) {
        logger.info('moon.schema', `Schema auto-sync: ${applied.length} changes applied (${summary.tablesCreated} tables, ${summary.columnsAdded} cols, ${summary.foreignKeysAdded} FKs, ${summary.indexesCreated} indexes)`)
      } else {
        logger.info('moon.schema', `Schema verified & up-to-date: ${summary.totalModels} models (${summary.totalColumns} fields synchronized with PostgreSQL)`)
      }

      if (this.config.onBoot) {
        await this.config.onBoot()
      }

      const app = fastify({ logger: false })
      this.app = app

      const authConfig: AuthConfig = {
        jwtSecret: this.config.jwtSecret,
        emailService: this.config.email?.service,
        emailUser: this.config.email?.user,
        emailPass: this.config.email?.pass,
        emailFrom: this.config.email?.from
      }

      app.get('/', async (req: FastifyRequest, res: FastifyReply) => {
        const session = await this.requireAdmin(req, res)
        if (!session) return
        const sessionToken = issueJwt({ sub: session.uid, email: session.email, tokenVersion: session.tokenVersion, role: 'superadmin', clearanceLevel: 3 }, this.config.jwtSecret)
        const cookieFlags = process.env.NODE_ENV === 'production' ? '; Secure' : ''
        const html = renderDashboard()
        res.header('Set-Cookie', `moon_session=${encodeURIComponent(sessionToken)}; HttpOnly; SameSite=Strict; Path=/${cookieFlags}`)
        return html
      })

      app.get('/openapi.json', async (req: FastifyRequest, res: FastifyReply) => {
        return sendJson(res.raw as any, 200, generateOpenApi(), req.raw as any, this.config.cors)
      })

      app.get('/docs', async (req: FastifyRequest, res: FastifyReply) => {
        const html = renderSwaggerUI()
        res.type('text/html')
        return html
      })

      app.post('/auth/login', async (req: FastifyRequest, res: FastifyReply) => handleLogin(req as any, res as any, authConfig))
      app.post('/auth/register', async (req: FastifyRequest, res: FastifyReply) => handleRegister(req as any, res as any, authConfig))
      app.post('/auth/forgot-password', async (req: FastifyRequest, res: FastifyReply) => handleForgotPassword(req as any, res as any, authConfig))
      app.post('/auth/verify-otp', async (req: FastifyRequest, res: FastifyReply) => handleVerifyOtp(req as any, res as any, authConfig))
      app.post('/auth/reset-password', async (req: FastifyRequest, res: FastifyReply) => handleResetPassword(req as any, res as any, authConfig))
      app.post('/auth/logout', async (req: FastifyRequest, res: FastifyReply) => handleLogout(req as any, res as any, authConfig))
      app.get('/auth/me', async (req: FastifyRequest, res: FastifyReply) => handleGetSession(req as any, res as any, authConfig))
      app.get('/auth/session', async (req: FastifyRequest, res: FastifyReply) => handleGetSession(req as any, res as any, authConfig))
      app.post('/rpc', async (req: FastifyRequest, res: FastifyReply) => handleRpc(req as any, res as any, this.config.jwtSecret))
      app.get('/health/live', async (req: FastifyRequest, res: FastifyReply) => handleLiveness(req as any, res as any))
      app.get('/livez', async (req: FastifyRequest, res: FastifyReply) => handleLiveness(req as any, res as any))
      app.get('/health/ready', async (req: FastifyRequest, res: FastifyReply) => handleReadiness(req as any, res as any))
      app.get('/readyz', async (req: FastifyRequest, res: FastifyReply) => handleReadiness(req as any, res as any))
      app.get('/health', async (req: FastifyRequest, res: FastifyReply) => handleHealth(req as any, res as any))
      app.get('/healthz', async (req: FastifyRequest, res: FastifyReply) => handleHealth(req as any, res as any))
      app.get('/api/health', async (req: FastifyRequest, res: FastifyReply) => handleHealth(req as any, res as any))
      app.get('/db/status', async (req: FastifyRequest, res: FastifyReply) => handleDbStatus(req as any, res as any))
      app.get('/meta/models', async (req: FastifyRequest, res: FastifyReply) => handleMetaModels(req as any, res as any))

      app.get('/api/meta/model/:model', async (req: FastifyRequest, res: FastifyReply) => {
        return handleMetaModel(req as any, res as any, (req as any).params.model)
      })

      app.get('/live*', async (req: FastifyRequest, res: FastifyReply) => {
        const session = await this.requireAdmin(req, res)
        if (!session) return
        return handleSSE(req as any, res as any, { cors: this.config.cors, jwtSecret: this.config.jwtSecret })
      })

      app.get('/api/:model([a-z0-9.-]+)', async (req: FastifyRequest, res: FastifyReply) => {
        const model = (req as any).params.model
        return handleRest(req.raw as any, res.raw as any, ['', model] as unknown as RegExpMatchArray, this.config.jwtSecret)
      })

      app.get('/api/:model([a-z0-9.-]+)/:id', async (req: FastifyRequest, res: FastifyReply) => {
        const model = (req as any).params.model
        const id = (req as any).params.id
        return handleRest(req.raw as any, res.raw as any, ['', model, String(id)] as unknown as RegExpMatchArray, this.config.jwtSecret)
      })

      app.post('/api/:model([a-z0-9.-]+)', async (req: FastifyRequest, res: FastifyReply) => {
        const model = (req as any).params.model
        return handleRest(req.raw as any, res.raw as any, ['', model] as unknown as RegExpMatchArray, this.config.jwtSecret)
      })

      app.put('/api/:model([a-z0-9.-]+)/:id', async (req: FastifyRequest, res: FastifyReply) => {
        const model = (req as any).params.model
        const id = (req as any).params.id
        return handleRest(req.raw as any, res.raw as any, ['', model, String(id)] as unknown as RegExpMatchArray, this.config.jwtSecret)
      })

      app.delete('/api/:model([a-z0-9.-]+)/:id', async (req: FastifyRequest, res: FastifyReply) => {
        const model = (req as any).params.model
        const id = (req as any).params.id
        return handleRest(req.raw as any, res.raw as any, ['', model, String(id)] as unknown as RegExpMatchArray, this.config.jwtSecret)
      })

      const builtinRoutes = [
        { method: 'GET', path: '/' },
        { method: 'GET', path: '/openapi.json' },
        { method: 'GET', path: '/docs' },
        { method: 'POST', path: '/auth/login' },
        { method: 'POST', path: '/auth/register' },
        { method: 'POST', path: '/auth/forgot-password' },
        { method: 'POST', path: '/auth/verify-otp' },
        { method: 'POST', path: '/auth/reset-password' },
        { method: 'POST', path: '/auth/logout' },
        { method: 'GET', path: '/auth/me' },
        { method: 'GET', path: '/auth/session' },
        { method: 'POST', path: '/rpc' },
        { method: 'GET', path: '/health/live' },
        { method: 'GET', path: '/livez' },
        { method: 'GET', path: '/health/ready' },
        { method: 'GET', path: '/readyz' },
        { method: 'GET', path: '/health' },
        { method: 'GET', path: '/healthz' },
        { method: 'GET', path: '/api/health' },
        { method: 'GET', path: '/db/status' },
        { method: 'GET', path: '/meta/models' },
        { method: 'GET', path: '/live' },
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

      const port = this.config.port || Number(process.env.API_PORT || process.env.PORT) || 4000
      const host = this.config.host || '0.0.0.0'

      await app.listen({ port, host })
      logger.info('moon.core', `Fastify Engine running at http://${host}:${port}`)

      this.metricInterval = setInterval(async () => {
        try {
          const MxMetric = getModel('mx.metric')
          const activeCount = getActiveClientCount()
          if (MxMetric) {
            const env = createCtx(SUPERUSER_ID, {}, getModel as any)
            await MxMetric.spawn(MxMetric as any, env, { name: 'active_connections', value: activeCount })
          }
        } catch (e) {
          logger.error('moon.metrics', 'Failed to flush metric to DB', e)
        }
      }, 60000)
    } catch (err: any) {
      const message = err?.message || String(err)
      logger.error('moon.core', `Failed to start: ${message}`)
      throw err
    }
  }

  public async stop(): Promise<void> {
    if (this.metricInterval) {
      clearInterval(this.metricInterval)
      this.metricInterval = null
    }

    closeAllSSEConnections()

    if (this.app) {
      await this.app.close()
      this.app = null
    }

    await teardownOrm()
  }
}
