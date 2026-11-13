import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { EventEmitter } from 'node:events'
import type { IncomingMessage, ServerResponse } from 'node:http'
import { FastifyAdapter } from '../src/fastify-adapter.js'
import { issueJwt } from '../src/utils/auth.js'
import { registerModel, teardownOrm, Vertex, fields } from '@moon/orm'

const TEST_SECRET = 'super-secret-jwt-key-for-unit-testing-32chars!'

class VxUser extends Vertex {
  static override _name = 'vx.user'
  static override _public = true
  static override _softDelete = false
  email = fields.Char({ required: true })
  name = fields.Char()
  password = fields.Char({ required: true })
  tokenVersion = fields.Integer({ default: 1 })
  isActive = fields.Boolean({ default: true })
}

registerModel(VxUser)

type Row = Record<string, any>
type Tables = Record<string, Row[]>

class FakeDbQuery {
  private tableName: string
  private tables: Tables
  private filters: Array<(row: Row) => boolean> = []
  constructor(tableName: string, tables: Tables) {
    this.tableName = tableName
    this.tables = tables
    if (!this.tables[tableName]) this.tables[tableName] = []
  }
  where(columnOrFn: any, opOrVal?: any, val?: any): this {
    if (typeof columnOrFn === 'function') { columnOrFn(this); return this }
    if (typeof columnOrFn === 'object' && columnOrFn !== null) {
      this.filters.push((row) => Object.entries(columnOrFn).every(([k, v]) => row[k] === v))
      return this
    }
    const column = String(columnOrFn).replace(`${this.tableName}.`, '')
    if (val !== undefined) {
      const op = String(opOrVal).toLowerCase()
      if (op === '=' || op === '==') this.filters.push((row) => row[column] === val)
      else if (op === 'in') this.filters.push((row) => (Array.isArray(val) ? val : [val]).includes(row[column]))
    } else {
      this.filters.push((row) => row[column] === opOrVal)
    }
    return this
  }
  andWhere(c: any, o?: any, v?: any): this { return this.where(c, o, v) }
  orWhere(c: any, o?: any, v?: any): this { return this.where(c, o, v) }
  whereIn(column: string, values: any[]): this {
    const col = String(column).replace(`${this.tableName}.`, '')
    this.filters.push((row) => values.includes(row[col]))
    return this
  }
  select(): this { return this }
  orderBy(): this { return this }
  limit(): this { return this }
  offset(): this { return this }
  async count() { return [{ count: this.executeFilter().length }] }
  async first() { return this.executeFilter()[0] }
  private executeFilter(): Row[] {
    let rows = [...(this.tables[this.tableName] ?? [])]
    for (const f of this.filters) rows = rows.filter(f)
    return rows
  }
  async update(vals: Record<string, any>) {
    const rows = this.executeFilter()
    for (const r of rows) Object.assign(r, vals)
    return rows.length
  }
  then(resolve: (rows: Row[]) => void) { resolve(this.executeFilter()) }
}

function makeDb(tables: Tables) {
  const dbFn: any = (table: string) => new FakeDbQuery(table, tables)
  dbFn.transaction = async (cb: (trx: any) => Promise<any>) => cb(dbFn)
  dbFn.raw = (sql: string) => sql
  dbFn.on = () => {}
  return dbFn
}

function captureRes() {
  let status = 200
  let body = ''
  const headers: Record<string, any> = {}
  const res: any = {
    statusCode: 200,
    setHeader: (name: string, value: any) => { headers[name.toLowerCase()] = value },
    writeHead: (code: number) => { status = code },
    end: (data?: string) => { body = data ?? '' },
  }
  return { res, get: () => ({ status, body, headers }) }
}

async function request(adapter: FastifyAdapter, url: string, headers: Record<string, string> = {}) {
  const { res, get } = captureRes()
  await adapter.handleRequest({ method: 'GET', url, headers } as IncomingMessage, res as ServerResponse)
  return get()
}

function expectSecurityHeaders(headers: Record<string, any>) {
  expect(headers['x-frame-options']).toBe('SAMEORIGIN')
  expect(headers['x-content-type-options']).toBe('nosniff')
  expect(headers['referrer-policy']).toBe('strict-origin-when-cross-origin')
  expect(headers['content-security-policy']).toBeTruthy()
  expect(headers['content-security-policy']).toContain("frame-ancestors 'self'")
}

describe('HTML response security headers (T-20)', () => {
  let adapter: FastifyAdapter

  beforeEach(() => {
    ;(globalThis as any).moonEmitter = new EventEmitter()
    ;(globalThis as any).moonActiveSSEClients = new Map()
    const tables: Tables = {
      vx_user: [{ id: 1, email: 'root@moonwitness.org', name: 'Root', password: 'h', token_version: 1, is_active: true }],
      mx_model: [{ id: 1, model: 'vx.user' }],
    }
    adapter = new FastifyAdapter({ database: makeDb(tables), jwtSecret: TEST_SECRET })
  })

  afterEach(async () => {
    await teardownOrm()
  })

  it('serves GET /docs with frame, sniffing, referrer, and CSP headers', async () => {
    const result = await request(adapter, '/docs')
    expect(result.status).toBe(200)
    expect(result.headers['content-type']).toContain('text/html')
    expectSecurityHeaders(result.headers)
    expect(result.headers['content-security-policy']).toContain('https://unpkg.com')
  })

  it('serves the authenticated dashboard GET / with the same security headers', async () => {
    const token = issueJwt({ sub: 1, email: 'root@moonwitness.org', tokenVersion: 1 }, TEST_SECRET)
    const result = await request(adapter, '/', { authorization: `Bearer ${token}` })
    expect(result.status).toBe(200)
    expect(result.headers['content-type']).toContain('text/html')
    expectSecurityHeaders(result.headers)
    expect(result.headers['content-security-policy']).toContain('https://unpkg.com')
    expect(result.headers['cache-control']).toBe('no-store')
  })
})