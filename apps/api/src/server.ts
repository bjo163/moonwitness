import 'dotenv/config'
import Fastify from 'fastify'
import cors from '@fastify/cors'
import jwt from '@fastify/jwt'
import db from './db.js'
import { healthRoutes } from './routes/health.js'
import { dbRoutes } from './routes/db.js'
import { loadModels, syncSchema, getLastPending } from './models/index.js'
import { seedBaseData } from './models/addons/base/seed.js'
import { loginHandler } from './services/auth.js'

const app = Fastify({ logger: true })

const jwtSecret = process.env.JWT_SECRET
if (!jwtSecret) {
  throw new Error('JWT_SECRET environment variable is required')
}

app.register(cors, { origin: true })

app.register(jwt, {
  secret: jwtSecret,
  sign: {
    expiresIn: process.env.JWT_EXPIRES_IN || '24h'
  }
})

app.addHook('preHandler', async (request, reply) => {
  if (request.url === '/auth/login' && request.method === 'POST') {
    return
  }
  try {
    await request.jwtVerify()
  } catch (err) {
    return reply.status(401).send({ error: 'Invalid credentials' })
  }
})

app.register(healthRoutes, { prefix: '/health' })
app.register(dbRoutes, { prefix: '/db' })

app.post('/auth/login', loginHandler)

app.get('/ping', async () => {
  const result = await db.select(db.raw('now() as now'))
  return { pong: true, time: result[0].now }
})

const start = async () => {
  try {
    await loadModels()
    const { applied } = await syncSchema()
    const pending = getLastPending()
    app.log.info(
      `Schema sync: ${applied.length} applied, ${pending.length} pending`
    )
    await seedBaseData()
    const port = Number(process.env.PORT) || 4000
    await app.listen({ port, host: '0.0.0.0' })
  } catch (err) {
    app.log.error(err)
    process.exit(1)
  }
}

start()
