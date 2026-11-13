import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { EventEmitter } from 'node:events'
import { createServer as createNetServer } from 'node:net'
import { FastifyAdapter } from '../src/fastify-adapter.js'
import { parseBody, sendJson } from '../src/utils/http.js'
import { closeAllSSEConnections } from '../src/handlers/sse.js'

const TEST_SECRET = 'super-secret-jwt-key-for-unit-testing-32chars!'

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

describe('FastifyAdapter post-hijack error handling (T-03)', () => {
  let adapter: FastifyAdapter
  let port: number

  beforeAll(async () => {
    ;(globalThis as any).moonEmitter = new EventEmitter()
    ;(globalThis as any).moonActiveSSEClients = new Map()
    port = await getRandomPort()
    adapter = new FastifyAdapter({ database: makeDb(), jwtSecret: TEST_SECRET, port })
    adapter.get('/ok', (req, res) => sendJson(res, 200, { ok: true }, req))
    adapter.get('/boom', () => {
      throw new Error('secret-internal-detail-boom')
    })
    adapter.get('/partial', (_req, res) => {
      res.writeHead(200, { 'Content-Type': 'text/plain' })
      res.write('partial')
      throw new Error('secret-after-headers')
    })
    adapter.post('/echo', async (req, res) => {
      const body = await parseBody(req)
      sendJson(res, 200, { echo: body }, req)
    })
    await adapter.start()
  })

  afterAll(async () => {
    closeAllSSEConnections('test_cleanup')
    await adapter.stop()
  })

  it('returns a generic 500 with requestId within 2s when a handler throws after hijack', async () => {
    const startedAt = Date.now()
    const res = await fetch(`http://127.0.0.1:${port}/boom`, { signal: AbortSignal.timeout(2000) })
    expect(Date.now() - startedAt).toBeLessThan(2000)
    expect(res.status).toBe(500)
    const body = await res.json()
    expect(body.error).toBe('Internal server error')
    expect(body.code).toBe('INTERNAL_ERROR')
    expect(body.requestId).toBeTruthy()
    expect(res.headers.get('x-request-id')).toBe(body.requestId)
    expect(JSON.stringify(body)).not.toContain('secret-internal-detail-boom')
  })

  it('keeps the happy path returning 200', async () => {
    const res = await fetch(`http://127.0.0.1:${port}/ok`, { signal: AbortSignal.timeout(2000) })
    expect(res.status).toBe(200)
    expect(await res.json()).toEqual({ ok: true })
  })

  it('ends the response when a handler throws after headers were already sent', async () => {
    const res = await fetch(`http://127.0.0.1:${port}/partial`, { signal: AbortSignal.timeout(2000) })
    expect(res.status).toBe(200)
    expect(await res.text()).toBe('partial')
  })

  it('returns an informative 4xx for malformed JSON through the Fastify error handler', async () => {
    const res = await fetch(`http://127.0.0.1:${port}/echo`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: '{invalid-json',
      signal: AbortSignal.timeout(2000),
    })
    expect(res.status).toBe(400)
    const body = await res.json()
    expect(body.error).toBeTruthy()
  })
})