import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { EventEmitter } from 'node:events'
import { FastifyAdapter } from '../src/fastify-adapter.js'
import { closeAllSSEConnections } from '../src/handlers/sse.js'
import { createServer as createNetServer } from 'node:net'

function makeDb() {
  const tables: Record<string, any[]> = {
    vx_user: [
      {
        id: 1,
        email: 'admin@moonwitness.org',
        name: 'Admin',
        password: '$2a$10$abcdefghijklmnopqrstuvwxyz0123456789012345678901',
        token_version: 1,
        is_active: true,
      },
    ],
    mx_model: [{ id: 1, model: 'vx.user' }],
  }

  const dbFn: any = (table: string) => ({
    table,
    where: () => dbFn,
    andWhere: () => dbFn,
    orWhere: () => dbFn,
    whereIn: () => dbFn,
    select: () => dbFn,
    orderBy: () => dbFn,
    limit: () => dbFn,
    offset: () => dbFn,
    async count() {
      return [{ count: (tables[table] ?? []).length }]
    },
    async first() {
      return (tables[table] ?? [])[0]
    },
    async update(vals: Record<string, any>) {
      const rows = tables[table] ?? []
      for (const r of rows) {
        Object.assign(r, vals)
      }
      return rows.length
    },
    then(resolve: (rows: any[]) => void) {
      resolve(tables[table] ?? [])
    },
  })

  dbFn.transaction = async (cb: (trx: any) => Promise<any>) => cb(dbFn)
  dbFn.raw = (sql: string) => sql
  dbFn.on = () => {}
  return dbFn
}

describe('FastifyAdapter (#128)', () => {
  beforeEach(() => {
    closeAllSSEConnections('test_reset')
    ;(globalThis as any).moonEmitter = new EventEmitter()
    ;(globalThis as any).moonActiveSSEClients = new Map()
  })

  afterEach(async () => {
    closeAllSSEConnections('test_cleanup')
  })

  it('can be instantiated with config', () => {
    const adapter = new FastifyAdapter({
      database: makeDb(),
      jwtSecret: 'test-secret',
      port: 0,
    })
    expect(adapter).toBeDefined()
  })

  it('starts and listens on a random port', async () => {
    const port = await getRandomPort()
    const adapter = new FastifyAdapter({
      database: makeDb(),
      jwtSecret: 'test-secret',
      port,
    })

    await adapter.start()
    
    const app = (adapter as any).app
    expect(app).toBeDefined()
    expect(app).toHaveProperty('server')
    const addr = app.server.address()
    expect(addr.port).toBe(port)

    await adapter.stop()
  })

  it('registers built-in routes and returns non-404 for known paths', async () => {
    const port = await getRandomPort()
    const adapter = new FastifyAdapter({
      database: makeDb(),
      jwtSecret: 'test-secret',
      port,
    })

    await adapter.start()
    
    const paths: { path: string; method?: string }[] = [
      { path: '/auth/me' },
      { path: '/rpc', method: 'POST' },
      { path: '/live' },
      { path: '/health/live' },
      { path: '/meta/models' },
    ]
    for (const entry of paths) {
      const res = await fetch(`http://localhost:${port}${entry.path}`, {
        method: entry.method || 'GET',
      })
      expect(res.status).not.toBe(404)
    }

    await adapter.stop()
  })

  it('returns 404 for unknown routes', async () => {
    const port = await getRandomPort()
    const adapter = new FastifyAdapter({
      database: makeDb(),
      jwtSecret: 'test-secret',
      port,
    })

    await adapter.start()
    
    const res = await fetch(`http://localhost:${port}/unknown-route`)
    expect(res.status).toBe(404)

    await adapter.stop()
  })
})

async function getRandomPort(): Promise<number> {
  return new Promise<number>((resolve) => {
    const server = createNetServer()
    server.unref()
    server.listen(0, () => {
      const port = (server.address() as any).port
      server.close(() => resolve(port))
    })
  })
}
