import { describe, it, expect, beforeEach, vi } from 'vitest'
import { EventEmitter } from 'node:events'
import type { IncomingMessage, ServerResponse } from 'node:http'
import bcrypt from 'bcryptjs'
import {
  issueJwt,
  resolveUserRole,
} from '../src/utils/auth.ts'
import { handleLogin, handleRegister } from '../src/handlers/auth.js'
import { registerModel, setupOrm, Vertex, fields, ANONYMOUS_ID, SUPERUSER_ID, createCtx, getModel } from '@moon/orm'

const TEST_SECRET = 'super-secret-jwt-key-for-unit-testing-32chars!'
const TEST_PASSWORD_HASH = bcrypt.hashSync('hashed-password', 10)

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
    if (!this.tables[tableName]) {
      this.tables[tableName] = []
    }
  }

  where(columnOrFn: string | Record<string, any> | ((qb: any) => void), opOrVal?: any, val?: any): this {
    if (typeof columnOrFn === 'function') {
      columnOrFn(this)
      return this
    }

    if (typeof columnOrFn === 'object' && columnOrFn !== null) {
      this.filters.push((row) =>
        Object.entries(columnOrFn).every(([key, expected]) => row[key] === expected)
      )
      return this
    }

    const column = String(columnOrFn).replace(`${this.tableName}.`, '')
    if (val !== undefined) {
      const op = String(opOrVal).toLowerCase()
      if (op === '=' || op === '==') {
        if (val === null) {
          this.filters.push((row) => row[column] === null || row[column] === undefined)
        } else {
          this.filters.push((row) => row[column] === val)
        }
      } else if (op === 'in') {
        const values = Array.isArray(val) ? val : [val]
        this.filters.push((row) => values.includes(row[column]))
      }
    } else {
      if (opOrVal === null) {
        this.filters.push((row) => row[column] === null || row[column] === undefined)
      } else {
        this.filters.push((row) => row[column] === opOrVal)
      }
    }

    return this
  }

  andWhere(columnOrFn: string | Record<string, any> | ((qb: any) => void), opOrVal?: any, val?: any): this {
    return this.where(columnOrFn, opOrVal, val)
  }

  orWhere(columnOrFn: string | Record<string, any> | ((qb: any) => void), opOrVal?: any, val?: any): this {
    return this.where(columnOrFn, opOrVal, val)
  }

  whereIn(columnOrFn: string, values: any[]): this {
    const column = String(columnOrFn).replace(`${this.tableName}.`, '')
    this.filters.push((row) => values.includes(row[column]))
    return this
  }

  select(..._columns: string[]): this {
    return this
  }

  orderBy(_column: string, _direction?: string): this {
    return this
  }

  limit(_count: number): this {
    return this
  }

  offset(_count: number): this {
    return this
  }

  async count(_column?: string): Promise<{ count: number }[]> {
    const rows = this.executeFilter()
    return [{ count: rows.length }]
  }

  async first(): Promise<Row | undefined> {
    const results = this.executeFilter()
    return results[0]
  }

  private executeFilter(): Row[] {
    let rows = [...(this.tables[this.tableName] ?? [])]
    for (const filter of this.filters) {
      rows = rows.filter(filter)
    }
    return rows
  }

  async update(vals: Record<string, any>): Promise<number> {
    const rows = this.executeFilter()
    for (const r of rows) {
      Object.assign(r, vals)
    }
    return rows.length
  }

  insert(vals: any): { returning: (cols: string) => Promise<Row[]> } {
    const rowsToInsert = Array.isArray(vals) ? vals : [vals]
    const tableRows = this.tables[this.tableName] ?? []
    const createdRows: Row[] = []

    for (const v of rowsToInsert) {
      const newRow = {
        id: v.id ?? tableRows.length + 1,
        ...v,
      }
      tableRows.push(newRow)
      createdRows.push(newRow)
    }

    return {
      returning: (_cols: string) => Promise.resolve(createdRows),
    }
  }

  then(resolve: (rows: Row[]) => void): void {
    resolve(this.executeFilter())
  }
}

function makeDb(tables: Tables) {
  const dbFn: any = (table: string) => new FakeDbQuery(table, tables)
  dbFn.transaction = async (cb: (trx: any) => Promise<any>) => cb(dbFn)
  dbFn.raw = (sql: string) => sql
  dbFn.on = vi.fn()
  return dbFn
}

function createMockReq(body: Record<string, any>): IncomingMessage {
  const emitter = new EventEmitter() as any
  emitter.headers = {}
  emitter.destroy = () => {}

  process.nextTick(() => {
    emitter.emit('data', JSON.stringify(body))
    emitter.emit('end')
  })

  return emitter
}

function createMockRes(): { res: ServerResponse; getResult: () => { status: number; body: any } } {
  let statusCode = 200
  let responseData = ''
  const res: any = {
    statusCode: 200,
    setHeader: vi.fn(),
    writeHead: (code: number) => {
      statusCode = code
    },
    end: (data: string) => {
      responseData = data
    },
  }

  return {
    res,
    getResult: () => ({
      status: statusCode,
      body: responseData ? JSON.parse(responseData) : {},
    }),
  }
}

describe('Auth Role Contract (#118)', () => {
  describe('resolveUserRole', () => {
    it('falls back to user level 1 when vx.role model is missing', async () => {
      setupOrm(makeDb({ vx_user: [{ id: 1, email: 'a@b.com' }], mx_model: [] }))
      const env = createCtx(ANONYMOUS_ID, {}, getModel as any)
      const result = await resolveUserRole(1, env)
      expect(result).toEqual({ role: 'user', clearanceLevel: 1 })
    })

    it('falls back to user level 1 when junction table is missing', async () => {
      setupOrm(makeDb({
        vx_user: [{ id: 1, email: 'a@b.com' }],
        vx_role: [{ id: 1, name: 'admin' }],
        mx_model: [],
      }))
      const env = createCtx(ANONYMOUS_ID, {}, getModel as any)
      const result = await resolveUserRole(1, env)
      expect(result).toEqual({ role: 'user', clearanceLevel: 1 })
    })

    it('falls back to user level 1 when user has no roles', async () => {
      setupOrm(makeDb({
        vx_user: [{ id: 1, email: 'a@b.com' }],
        vx_role: [{ id: 1, name: 'admin' }],
        vx_user_vx_role_rel: [],
        mx_model: [],
      }))
      const env = createCtx(ANONYMOUS_ID, {}, getModel as any)
      const result = await resolveUserRole(1, env)
      expect(result).toEqual({ role: 'user', clearanceLevel: 1 })
    })

    it('returns single role and clearance level from DB', async () => {
      setupOrm(makeDb({
        vx_user: [{ id: 1, email: 'a@b.com' }],
        vx_role: [
          { id: 1, name: 'admin', is_active: true },
          { id: 2, name: 'superadmin', is_active: true },
        ],
        vx_user_vx_role_rel: [{ vx_user_id: 1, vx_role_id: 1 }],
        mx_model: [],
      }))
      const env = createCtx(ANONYMOUS_ID, {}, getModel as any)
      const result = await resolveUserRole(1, env)
      expect(result).toEqual({ role: 'admin', clearanceLevel: 2 })
    })

    it('returns highest clearance level when user has multiple roles', async () => {
      setupOrm(makeDb({
        vx_user: [{ id: 1, email: 'a@b.com' }],
        vx_role: [
          { id: 1, name: 'admin', is_active: true },
          { id: 2, name: 'superadmin', is_active: true },
          { id: 3, name: 'editor', is_active: true },
        ],
        vx_user_vx_role_rel: [
          { vx_user_id: 1, vx_role_id: 1 },
          { vx_user_id: 1, vx_role_id: 2 },
          { vx_user_id: 1, vx_role_id: 3 },
        ],
        mx_model: [],
      }))
      const env = createCtx(ANONYMOUS_ID, {}, getModel as any)
      const result = await resolveUserRole(1, env)
      expect(result).toEqual({ role: 'superadmin', clearanceLevel: 3 })
    })

    it('returns highest priority role when clearance levels tie', async () => {
      setupOrm(makeDb({
        vx_user: [{ id: 1, email: 'a@b.com' }],
        vx_role: [
          { id: 1, name: 'admin', is_active: true },
          { id: 2, name: 'moderator', is_active: true },
          { id: 3, name: 'editor', is_active: true },
        ],
        vx_user_vx_role_rel: [
          { vx_user_id: 1, vx_role_id: 1 },
          { vx_user_id: 1, vx_role_id: 2 },
          { vx_user_id: 1, vx_role_id: 3 },
        ],
        mx_model: [],
      }))
      const env = createCtx(ANONYMOUS_ID, {}, getModel as any)
      const result = await resolveUserRole(1, env)
      expect(result).toEqual({ role: 'admin', clearanceLevel: 2 })
    })
  })

  describe('handleLogin role contract', () => {
    const config = { jwtSecret: TEST_SECRET }

    beforeEach(() => {
      setupOrm(makeDb({
        vx_user: [
          {
            id: 42,
            email: 'operator@moonwitness.org',
            name: 'Operator Alice',
            password: TEST_PASSWORD_HASH,
            token_version: 1,
            is_active: true,
          },
        ],
        vx_role: [
          { id: 1, name: 'admin', is_active: true },
          { id: 2, name: 'superadmin', is_active: true },
        ],
        vx_user_vx_role_rel: [
          { vx_user_id: 42, vx_role_id: 1 },
          { vx_user_id: 42, vx_role_id: 2 },
        ],
        mx_model: [{ id: 1, model: 'vx.user' }],
      }))
    })

    it('returns DB-driven role and clearanceLevel instead of email-based role', async () => {
      const req = createMockReq({ email: 'operator@moonwitness.org', password: 'hashed-password' })
      ;(req as any).method = 'POST'
      ;(req as any).url = '/auth/login'
      const { res, getResult } = createMockRes()

      await handleLogin(req, res, config)
      const result = getResult()

      expect(result.status).toBe(200)
      expect(result.body.token).toBeDefined()
      expect(result.body.user.role).toBe('superadmin')
      expect(result.body.user.clearanceLevel).toBe(3)
    })

    it('falls back to user level 1 when no roles assigned', async () => {
      setupOrm(makeDb({
        vx_user: [
          {
            id: 42,
            email: 'operator@moonwitness.org',
            name: 'Operator Alice',
            password: TEST_PASSWORD_HASH,
            token_version: 1,
            is_active: true,
          },
        ],
        vx_role: [{ id: 1, name: 'admin', is_active: true }],
        vx_user_vx_role_rel: [],
        mx_model: [{ id: 1, model: 'vx.user' }],
      }))

      const req = createMockReq({ email: 'operator@moonwitness.org', password: 'hashed-password' })
      ;(req as any).method = 'POST'
      ;(req as any).url = '/auth/login'
      const { res, getResult } = createMockRes()

      await handleLogin(req, res, config)
      const result = getResult()

      expect(result.status).toBe(200)
      expect(result.body.user.role).toBe('user')
      expect(result.body.user.clearanceLevel).toBe(1)
    })
  })

  describe('handleRegister role contract', () => {
    const config = { jwtSecret: TEST_SECRET }

    beforeEach(() => {
      setupOrm(makeDb({
        vx_user: [],
        vx_role: [{ id: 1, name: 'explorer', is_active: true }],
        vx_user_vx_role_rel: [],
        mx_model: [{ id: 1, model: 'vx.user' }],
        vx_node: [{ id: 1, isCompany: true }],
      }))
    })

    it('includes role and clearanceLevel in registration response', async () => {
      const req = createMockReq({ email: 'new@moonwitness.org', password: 'password123', name: 'New User' })
      ;(req as any).method = 'POST'
      ;(req as any).url = '/auth/register'
      const { res, getResult } = createMockRes()

      await handleRegister(req, res, config)
      const result = getResult()

      expect(result.status).toBe(201)
      expect(result.body.token).toBeDefined()
      expect(result.body.user.role).toBe('user')
      expect(result.body.user.clearanceLevel).toBe(1)
    })
  })
})
