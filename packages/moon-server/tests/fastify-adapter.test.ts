import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { EventEmitter } from 'node:events'
import { createServer as createNetServer } from 'node:net'
import { FastifyAdapter } from '../src/fastify-adapter.js'
import { NativeServer } from '../src/NativeServer.js'
import { closeAllSSEConnections } from '../src/handlers/sse.js'
import { parseBody, sendJson } from '../src/utils/http.js'

function makeDb() {
  const tables: Record<string, any[]> = {
    vx_user: [{ id: 1, email: 'admin@moonwitness.org', name: 'Admin', password: 'hash', token_version: 1, is_active: true }],
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
    async count() { return [{ count: (tables[table] ?? []).length }] },
    async first() { return (tables[table] ?? [])[0] },
    async update(vals: Record<string, any>) {
      const rows = tables[table] ?? []
      for (const row of rows) Object.assign(row, vals)
      return rows.length
    },
    then(resolve: (rows: any[]) => void) { resolve(tables[table] ?? []) },
  })

  dbFn.transaction = async (cb: (trx: any) => Promise<any>) => cb(dbFn)
  dbFn.raw = (sql: string) => sql
  dbFn.on = () => {}
  return dbFn
}

describe('Fastify canonical transport (#126/#132)', () => {
  beforeEach(() => {
    closeAllSSEConnections('test_reset')
    ;(globalThis as any).moonEmitter = new EventEmitter()
    ;(globalThis as any).moonActiveSSEClients = new Map()
  })

  afterEach(() => {
    closeAllSSEConnections('test_cleanup')
  })

  it('keeps NativeServer as the public abstraction over FastifyAdapter', () => {
    const server = new NativeServer({ database: makeDb(), jwtSecret: 'test-secret', port: 0 })
    expect(server).toBeInstanceOf(FastifyAdapter)
  })

  it('starts Fastify and registers built-in routes', async () => {
    const port = await getRandomPort()
    const adapter = new FastifyAdapter({ database: makeDb(), jwtSecret: 'test-secret', port })
    await adapter.start()

    const app = (adapter as any).app
    expect(app).toBeDefined()
    expect(app.server.address().port).toBe(port)

    for (const entry of [
      { path: '/auth/me', method: 'GET' },
      { path: '/rpc', method: 'POST' },
      { path: '/live', method: 'GET' },
      { path: '/health/live', method: 'GET' },
      { path: '/meta/models', method: 'GET' },
    ]) {
      const res = await fetch(`http://localhost:${port}${entry.path}`, { method: entry.method })
      expect(res.status).not.toBe(404)
      expect(res.headers.get('x-request-id')).toBeTruthy()
    }

    await adapter.stop()
  })

  it('registers Moon routes before start and bridges Fastify-parsed JSON bodies', async () => {
    const port = await getRandomPort()
    const adapter = new FastifyAdapter({ database: makeDb(), jwtSecret: 'test-secret', port })
    adapter.post('/test/echo', async (req, res) => {
      const body = await parseBody(req)
      sendJson(res, 200, { echo: body.value }, req)
    })

    await adapter.start()
    const res = await fetch(`http://localhost:${port}/test/echo`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ value: 'fastify-bridge' }),
    })

    expect(res.status).toBe(200)
    expect(await res.json()).toEqual({ echo: 'fastify-bridge' })
    await adapter.stop()
  })

  it('keeps Moon middleware semantics on Fastify-owned routes', async () => {
    const port = await getRandomPort()
    const adapter = new FastifyAdapter({ database: makeDb(), jwtSecret: 'test-secret', port })
    const middleware = vi.fn(async (_req, _res, next) => next())
    adapter.use(middleware)
    adapter.get('/test/middleware', (req, res) => sendJson(res, 200, { ok: true }, req))

    await adapter.start()
    const res = await fetch(`http://localhost:${port}/test/middleware`)
    expect(res.status).toBe(200)
    expect(middleware).toHaveBeenCalledTimes(1)
    await adapter.stop()
  })

  it('routes the legacy handleRequest compatibility shim through Fastify injection', async () => {
    const server = new NativeServer({ database: makeDb(), jwtSecret: 'test-secret', port: 0 })
    const chunks: string[] = []
    const headers: Record<string, unknown> = {}
    let status = 0
    const res: any = {
      setHeader: (name: string, value: unknown) => { headers[name] = value },
      writeHead: (code: number) => { status = code },
      end: (body?: string) => { if (body) chunks.push(body) },
    }

    await server.handleRequest({ method: 'GET', url: '/health/live', headers: {} } as any, res)
    expect(status).toBe(200)
    expect(JSON.parse(chunks.join('')).status).toBe('live')
    expect(Object.keys(headers).some((name) => name.toLowerCase() === 'x-request-id')).toBe(true)
    await server.stop()
  })

  it('returns 404 for unknown routes', async () => {
    const port = await getRandomPort()
    const adapter = new FastifyAdapter({ database: makeDb(), jwtSecret: 'test-secret', port })
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
