import { describe, it, expect, beforeEach, vi } from 'vitest'
import type { IncomingMessage, ServerResponse } from 'node:http'
import bcrypt from 'bcryptjs'
import { handleForgotPassword, handleVerifyOtp, handleResetPassword } from '../src/handlers/auth.js'
import { hashOtpToken } from '../src/utils/auth.js'
import { registerModel, setupOrm, Vertex, fields } from '@moon/orm'

// Define models for testing if not already registered
class VxUser extends Vertex {
  static override _name = 'vx.user'
  static override _softDelete = false
  email = fields.Char({ required: true })
  name = fields.Char()
  password = fields.Char({ required: true })
  tokenVersion = fields.Integer({ default: 1 })
}

class VxAuthChallenge extends Vertex {
  static override _name = 'vx.auth.challenge'
  static override _softDelete = false
  userId = fields.Integer({ required: true })
  purpose = fields.Char({ required: true })
  tokenHash = fields.Char({ required: true })
  expiresAt = fields.DateTime({ required: true })
  attempts = fields.Integer({ default: 0 })
  maxAttempts = fields.Integer({ default: 5 })
  consumedAt = fields.DateTime()
}

registerModel(VxUser)
registerModel(VxAuthChallenge)

type Row = Record<string, any>
type Tables = Record<string, Row[]>

class FakeDbQuery {
  private tableName: string
  private tables: Tables
  private filters: Array<(row: Row) => boolean> = []
  private selects?: string[]
  private orderClause?: string
  private limitCount?: number

  constructor(tableName: string, tables: Tables) {
    this.tableName = tableName
    this.tables = tables
    if (!this.tables[tableName]) {
      this.tables[tableName] = []
    }
  }

  where(columnOrFn: string | Record<string, any> | ((qb: any) => void), opOrVal?: any, val?: any): this {
    if (typeof columnOrFn === 'function') {
      const nestedQb = new FakeDbQuery(this.tableName, this.tables)
      columnOrFn(nestedQb)
      this.filters.push((row) => nestedQb.filters.every((f) => f(row)))
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
      } else if (op === '!=' || op === '<>') {
        this.filters.push((row) => row[column] !== val)
      } else if (op === '>') {
        this.filters.push((row) => row[column] > val)
      } else if (op === '<') {
        this.filters.push((row) => row[column] < val)
      } else if (op === '>=') {
        this.filters.push((row) => row[column] >= val)
      } else if (op === '<=') {
        this.filters.push((row) => row[column] <= val)
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

  andWhere(fn: (qb: any) => void): this {
    return this.where(fn)
  }

  orWhere(fn: (qb: any) => void): this {
    const nestedQb = new FakeDbQuery(this.tableName, this.tables)
    fn(nestedQb)
    const prevFilters = [...this.filters]
    this.filters = [
      (row) =>
        (prevFilters.length === 0 || prevFilters.every((f) => f(row))) ||
        nestedQb.filters.every((f) => f(row)),
    ]
    return this
  }

  whereNot(columnOrFn: string | ((qb: any) => void), val?: any): this {
    if (typeof columnOrFn === 'function') {
      const nestedQb = new FakeDbQuery(this.tableName, this.tables)
      columnOrFn(nestedQb)
      this.filters.push((row) => !nestedQb.filters.every((f) => f(row)))
      return this
    }
    const column = String(columnOrFn).replace(`${this.tableName}.`, '')
    this.filters.push((row) => row[column] !== val)
    return this
  }

  whereIn(columnOrFn: string, values: any[]): this {
    const column = String(columnOrFn).replace(`${this.tableName}.`, '')
    this.filters.push((row) => values.includes(row[column]))
    return this
  }

  whereNotIn(columnOrFn: string, values: any[]): this {
    const column = String(columnOrFn).replace(`${this.tableName}.`, '')
    this.filters.push((row) => !values.includes(row[column]))
    return this
  }

  orderBy(column: string, direction: 'asc' | 'desc' = 'asc'): this {
    this.orderClause = `${column} ${direction}`
    return this
  }

  limit(count: number): this {
    this.limitCount = count
    return this
  }

  select(...columns: string[]): this {
    this.selects = columns.map((c) => c.replace(`${this.tableName}.`, ''))
    return this
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
    if (this.orderClause) {
      const [col, dir] = this.orderClause.split(' ')
      rows.sort((a, b) => {
        if (dir === 'desc') return (b[col] ?? 0) > (a[col] ?? 0) ? 1 : -1
        return (a[col] ?? 0) > (b[col] ?? 0) ? 1 : -1
      })
    }
    if (this.limitCount !== undefined) {
      rows = rows.slice(0, this.limitCount)
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

  async delete(): Promise<number> {
    const rowsToDelete = new Set(this.executeFilter())
    const tableRows = this.tables[this.tableName] ?? []
    this.tables[this.tableName] = tableRows.filter((r) => !rowsToDelete.has(r))
    return rowsToDelete.size
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
    this.tables[this.tableName] = tableRows

    return {
      returning: async () => createdRows,
    }
  }

  then(resolve: (rows: Row[]) => void): void {
    resolve(this.executeFilter())
  }
}

function makeDb(tables: Tables) {
  const dbFn: any = (table: string) => new FakeDbQuery(table, tables)
  dbFn.transaction = async (cb: (trx: any) => Promise<any>) => cb(dbFn)
  dbFn.raw = (sql: string, bindings?: any[]) => sql
  dbFn.on = vi.fn()
  return dbFn
}

function createMockReq(body: any): IncomingMessage {
  const bodyStr = JSON.stringify(body)
  const req: any = {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'content-length': String(Buffer.byteLength(bodyStr)),
    },
    on: vi.fn((event: string, cb: Function) => {
      if (event === 'data') cb(bodyStr)
      if (event === 'end') cb()
      return req
    }),
    removeListener: vi.fn(),
    [Symbol.asyncIterator]: async function* () {
      yield Buffer.from(bodyStr)
    },
  }
  return req
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

describe('Password Recovery Challenge Lifecycle (#29)', () => {
  const config = { jwtSecret: 'test-secret-123456789012345678901234' }
  let tables: Tables

  beforeEach(async () => {
    tables = {
      vx_user: [
        {
          id: 42,
          email: 'operator@moonwitness.org',
          name: 'Operator Alice',
          password: await bcrypt.hash('OriginalPass123!', 10),
          token_version: 1,
          is_active: true,
        },
      ],
      vx_auth_challenge: [],
      mx_model: [
        { id: 1, model: 'vx.user' },
        { id: 2, model: 'vx.auth.challenge' },
      ],
    }

    setupOrm(makeDb(tables))
  })

  it('generates a hashed challenge in vx.auth.challenge and leaves vx.user without plaintext OTP', async () => {
    const req = createMockReq({ email: 'operator@moonwitness.org' })
    const { res, getResult } = createMockRes()

    await handleForgotPassword(req, res, config)
    const result = getResult()

    expect(result.status).toBe(200)
    expect(result.body.message).toContain('Password reset code')

    // Challenge persisted in vx.auth.challenge
    expect(tables.vx_auth_challenge).toHaveLength(1)
    const challenge = tables.vx_auth_challenge[0]
    expect(challenge.user_id).toBe(42)
    expect(challenge.purpose).toBe('password_recovery')
    expect(challenge.token_hash).toHaveLength(64) // SHA-256 hex string
    expect(challenge.consumed_at).toBeUndefined()
    expect(challenge.attempts).toBe(0)

    // Verify vx.user does NOT have plaintext OTP fields
    const user = tables.vx_user[0]
    expect(user.otp_code).toBeUndefined()
    expect(user.otp_expires).toBeUndefined()
  })

  it('rejects raw DB tokenHash when submitted as OTP code (cannot reuse DB secret)', async () => {
    // 1. Forgot password
    await handleForgotPassword(createMockReq({ email: 'operator@moonwitness.org' }), createMockRes().res, config)
    const challenge = tables.vx_auth_challenge[0]

    // 2. Attacker steals tokenHash from DB dump and attempts to verify with it
    const req = createMockReq({ email: 'operator@moonwitness.org', code: challenge.token_hash })
    const { res, getResult } = createMockRes()

    await handleVerifyOtp(req, res, config)
    const result = getResult()

    expect(result.status).toBe(400)
    expect(result.body.error).toBe('Invalid verification code')
    expect(tables.vx_auth_challenge[0].attempts).toBe(1)
  })

  it('successfully verifies with correct OTP code', async () => {
    const knownOtp = '765432'
    const tokenHash = hashOtpToken(42, knownOtp)

    tables.vx_auth_challenge.push({
      id: 1,
      user_id: 42,
      purpose: 'password_recovery',
      token_hash: tokenHash,
      expires_at: new Date(Date.now() + 15 * 60000).toISOString(),
      attempts: 0,
      max_attempts: 5,
      consumed_at: null,
      created_at: new Date().toISOString(),
      is_active: true,
    })

    const req = createMockReq({ email: 'operator@moonwitness.org', code: knownOtp })
    const { res, getResult } = createMockRes()

    await handleVerifyOtp(req, res, config)
    const result = getResult()

    expect(result.status).toBe(200)
    expect(result.body.success).toBe(true)
  })

  it('resets password, consumes challenge, and advances tokenVersion', async () => {
    const knownOtp = '543210'
    const tokenHash = hashOtpToken(42, knownOtp)

    tables.vx_auth_challenge.push({
      id: 1,
      user_id: 42,
      purpose: 'password_recovery',
      token_hash: tokenHash,
      expires_at: new Date(Date.now() + 15 * 60000).toISOString(),
      attempts: 0,
      max_attempts: 5,
      consumed_at: null,
      created_at: new Date().toISOString(),
      is_active: true,
    })

    const req = createMockReq({
      email: 'operator@moonwitness.org',
      code: knownOtp,
      newPassword: 'NewSecurePassword456!',
    })
    const { res, getResult } = createMockRes()

    await handleResetPassword(req, res, config)
    const result = getResult()

    expect(result.status).toBe(200)
    expect(result.body.message).toContain('Password has been reset successfully')

    // Challenge is marked consumed
    expect(tables.vx_auth_challenge[0].consumed_at).toBeTruthy()

    // User password updated
    const user = tables.vx_user[0]
    const valid = await bcrypt.compare('NewSecurePassword456!', user.password!)
    expect(valid).toBe(true)

    // Token version advanced for session revocation
    expect(user.token_version).toBe(2)
  })

  it('prevents replay attack: reusing already consumed challenge fails', async () => {
    const knownOtp = '543210'
    const tokenHash = hashOtpToken(42, knownOtp)

    tables.vx_auth_challenge.push({
      id: 1,
      user_id: 42,
      purpose: 'password_recovery',
      token_hash: tokenHash,
      expires_at: new Date(Date.now() + 15 * 60000).toISOString(),
      attempts: 0,
      max_attempts: 5,
      consumed_at: new Date().toISOString(), // Already consumed!
      created_at: new Date().toISOString(),
      is_active: true,
    })

    const req = createMockReq({
      email: 'operator@moonwitness.org',
      code: knownOtp,
      newPassword: 'AnotherPassword789!',
    })
    const { res, getResult } = createMockRes()

    await handleResetPassword(req, res, config)
    const result = getResult()

    expect(result.status).toBe(400)
    expect(result.body.error).toContain('already been used')
  })

  it('locks out challenge after 5 failed attempts (brute-force protection)', async () => {
    const knownOtp = '123456'
    const tokenHash = hashOtpToken(42, knownOtp)

    tables.vx_auth_challenge.push({
      id: 1,
      user_id: 42,
      purpose: 'password_recovery',
      token_hash: tokenHash,
      expires_at: new Date(Date.now() + 15 * 60000).toISOString(),
      attempts: 0,
      max_attempts: 5,
      consumed_at: null,
      created_at: new Date().toISOString(),
      is_active: true,
    })

    // 4 failed attempts
    for (let i = 0; i < 4; i++) {
      const { res, getResult } = createMockRes()
      await handleVerifyOtp(createMockReq({ email: 'operator@moonwitness.org', code: '000000' }), res, config)
      expect(getResult().status).toBe(400)
      expect(getResult().body.error).toBe('Invalid verification code')
    }

    // 5th failed attempt reaches max attempts
    const { res: res5, getResult: getResult5 } = createMockRes()
    await handleVerifyOtp(createMockReq({ email: 'operator@moonwitness.org', code: '000000' }), res5, config)
    expect(getResult5().status).toBe(400)
    expect(getResult5().body.error).toContain('Maximum OTP attempts exceeded')

    // 6th attempt with CORRECT code is now locked out
    const { res: res6, getResult: getResult6 } = createMockRes()
    await handleVerifyOtp(createMockReq({ email: 'operator@moonwitness.org', code: knownOtp }), res6, config)
    expect(getResult6().status).toBe(400)
    expect(getResult6().body.error).toContain('Maximum OTP attempts exceeded')
  })

  it('rejects expired challenge', async () => {
    const knownOtp = '123456'
    const tokenHash = hashOtpToken(42, knownOtp)

    tables.vx_auth_challenge.push({
      id: 1,
      user_id: 42,
      purpose: 'password_recovery',
      token_hash: tokenHash,
      expires_at: new Date(Date.now() - 1000).toISOString(), // Expired in past
      attempts: 0,
      max_attempts: 5,
      consumed_at: null,
      created_at: new Date().toISOString(),
      is_active: true,
    })

    const req = createMockReq({ email: 'operator@moonwitness.org', code: knownOtp })
    const { res, getResult } = createMockRes()

    await handleVerifyOtp(req, res, config)
    const result = getResult()

    expect(result.status).toBe(400)
    expect(result.body.error).toContain('expired')
  })

  it('invalidates prior unconsumed challenges when a new forgot password request is made', async () => {
    // First request
    await handleForgotPassword(createMockReq({ email: 'operator@moonwitness.org' }), createMockRes().res, config)
    expect(tables.vx_auth_challenge).toHaveLength(1)
    expect(tables.vx_auth_challenge[0].consumed_at).toBeUndefined()

    // Second request
    await handleForgotPassword(createMockReq({ email: 'operator@moonwitness.org' }), createMockRes().res, config)
    expect(tables.vx_auth_challenge).toHaveLength(2)

    // First challenge was invalidated (consumed)
    expect(tables.vx_auth_challenge[0].consumed_at).toBeTruthy()
    // Second challenge is active
    expect(tables.vx_auth_challenge[1].consumed_at).toBeUndefined()
  })
})
