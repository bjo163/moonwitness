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

class VxRole extends Vertex {
  static override _name = 'vx.role'
  static override _public = true
  static override _softDelete = false
  name = fields.Char({ required: true })
}

registerModel(VxUser)
registerModel(VxRole)

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
  return { res, get: () => ({ status, body: body ? JSON.parse(body) : {}, headers }) }
}

async function request(adapter: FastifyAdapter, url: string, headers: Record<string, string> = {}) {
  const { res, get } = captureRes()
  await adapter.handleRequest({ method: 'GET', url, headers } as IncomingMessage, res as ServerResponse)
  return get()
}

function tokenFor(uid: number, email: string) {
  return issueJwt({ sub: uid, email, tokenVersion: 1 }, TEST_SECRET)
}

describe('Meta route authentication (T-08)', () => {
  let adapter: FastifyAdapter

  beforeEach(() => {
    ;(globalThis as any).moonEmitter = new EventEmitter()
    ;(globalThis as any).moonActiveSSEClients = new Map()
    const tables: Tables = {
      vx_user: [
        { id: 1, email: 'root@moonwitness.org', name: 'Root', password: 'h', token_version: 1, is_active: true },
        { id: 2, email: 'admin@moonwitness.org', name: 'Admin', password: 'h', token_version: 1, is_active: true },
        { id: 3, email: 'user@moonwitness.org', name: 'User', password: 'h', token_version: 1, is_active: true },
      ],
      vx_role: [
        { id: 10, name: 'admin', is_active: true },
        { id: 11, name: 'superadmin', is_active: true },
      ],
      vx_user_vx_role_rel: [
        { vx_user_id: 1, vx_role_id: 11 },
        { vx_user_id: 2, vx_role_id: 10 },
      ],
      mx_model: [{ id: 1, model: 'vx.user' }],
    }
    adapter = new FastifyAdapter({ database: makeDb(tables), jwtSecret: TEST_SECRET })
  })

  afterEach(async () => {
    await teardownOrm()
  })

  it('rejects anonymous GET /meta/models with 401', async () => {
    const result = await request(adapter, '/meta/models')
    expect(result.status).toBe(401)
    expect(result.body.code).toBe('AUTH_REQUIRED')
  })

  it('rejects anonymous GET /api/meta/model/vx.user with 401', async () => {
    const result = await request(adapter, '/api/meta/model/vx.user')
    expect(result.status).toBe(401)
    expect(result.body.code).toBe('AUTH_REQUIRED')
  })

  it('rejects anonymous GET /db/status with 401', async () => {
    const result = await request(adapter, '/db/status')
    expect(result.status).toBe(401)
  })

  it('allows an authenticated user on /meta/models and /api/meta/model/vx.user', async () => {
    const auth = { authorization: `Bearer ${tokenFor(3, 'user@moonwitness.org')}` }
    const models = await request(adapter, '/meta/models', auth)
    expect(models.status).toBe(200)
    expect(Array.isArray(models.body.models)).toBe(true)
    const model = await request(adapter, '/api/meta/model/vx.user', auth)
    expect(model.status).toBe(200)
    expect(model.body.name).toBe('vx.user')
  })

  it('rejects a non-admin user on /db/status with 403', async () => {
    const auth = { authorization: `Bearer ${tokenFor(3, 'user@moonwitness.org')}` }
    const result = await request(adapter, '/db/status', auth)
    expect(result.status).toBe(403)
    expect(result.body.code).toBe('AUTH_FORBIDDEN')
  })

  it('allows a clearance-2 admin on /db/status with 200', async () => {
    const auth = { authorization: `Bearer ${tokenFor(2, 'admin@moonwitness.org')}` }
    const result = await request(adapter, '/db/status', auth)
    expect(result.status).toBe(200)
    expect(result.body.status).toBe('connected')
  })

  it('allows the superuser on /db/status with 200', async () => {
    const auth = { authorization: `Bearer ${tokenFor(1, 'root@moonwitness.org')}` }
    const result = await request(adapter, '/db/status', auth)
    expect(result.status).toBe(200)
  })
})