import { describe, it, expect, beforeEach, vi } from 'vitest'
import type { IncomingMessage, ServerResponse } from 'node:http'
import jwt from 'jsonwebtoken'
import {
  verifyToken,
  createOtpChallenge,
  verifyOtpChallenge,
  issueJwt,
  validateUserSession,
  revokeUserSessions,
} from '../src/utils/auth.js'
import { handleLogout, handleGetSession } from '../src/handlers/auth.js'
import { registerModel, setupOrm, Vertex, fields, ANONYMOUS_ID, SUPERUSER_ID, createCtx, getModel } from '@moon/orm'

const TEST_SECRET = 'super-secret-jwt-key-for-unit-testing-32chars!'

class VxUser extends Vertex {
  static override _name = 'vx.user'
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
    if (!this.tables[tableName]) {
      this.tables[tableName] = []
    }
  }

  where(columnOrFn: string | Record<string, any> | ((qb: any) => void), opOrVal?: any, val?: any): this {
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

function mockReq(authHeader?: string): IncomingMessage {
  return {
    headers: {
      ...(authHeader !== undefined ? { authorization: authHeader } : {}),
    },
  } as any
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

describe('JWT Verification & Expiry Enforcement (#15)', () => {
  it('returns ANONYMOUS_ID when authorization header is missing or empty', () => {
    expect(verifyToken(mockReq(), TEST_SECRET)).toEqual({ sub: ANONYMOUS_ID })
    expect(verifyToken(mockReq(''), TEST_SECRET)).toEqual({ sub: ANONYMOUS_ID })
  })

  it('rejects invalid authorization formats', () => {
    expect(() => verifyToken(mockReq('Basic 12345'), TEST_SECRET)).toThrow('Invalid authorization format')
    expect(() => verifyToken(mockReq('Token 12345'), TEST_SECRET)).toThrow('Invalid authorization format')
  })

  it('successfully verifies a valid JWT with sub', () => {
    const token = issueJwt({ sub: 42, email: 'operator@moonwitness.org', tokenVersion: 1 }, TEST_SECRET, { expiresIn: '1h' })
    const payload = verifyToken(mockReq(`Bearer ${token}`), TEST_SECRET)

    expect(payload.sub).toBe(42)
    expect(payload.email).toBe('operator@moonwitness.org')
    expect(payload.tokenVersion).toBe(1)
  })

  it('strictly rejects expired tokens with "Token expired"', () => {
    const expiredToken = jwt.sign(
      { sub: 42, exp: Math.floor(Date.now() / 1000) - 120 },
      TEST_SECRET,
      { algorithm: 'HS256' }
    )

    expect(() => verifyToken(mockReq(`Bearer ${expiredToken}`), TEST_SECRET, { clockTolerance: 0 }))
      .toThrow('Token expired')
  })

  it('tolerates small clock skew within configured clockTolerance window', () => {
    const recentlyExpired = jwt.sign(
      { sub: 42, exp: Math.floor(Date.now() / 1000) - 20 },
      TEST_SECRET,
      { algorithm: 'HS256' }
    )

    const payload = verifyToken(mockReq(`Bearer ${recentlyExpired}`), TEST_SECRET, { clockTolerance: 60 })
    expect(payload.sub).toBe(42)
  })

  it('rejects tampered or forged signatures', () => {
    const token = issueJwt({ sub: 42 }, TEST_SECRET, { expiresIn: '1h' })
    const wrongSecret = 'wrong-secret-key-that-does-not-match-at-all'

    expect(() => verifyToken(mockReq(`Bearer ${token}`), wrongSecret)).toThrow('Invalid token')
  })

  it('rejects the insecure "none" algorithm', () => {
    const header = Buffer.from(JSON.stringify({ alg: 'none', typ: 'JWT' })).toString('base64url')
    const body = Buffer.from(JSON.stringify({ sub: 42, exp: Math.floor(Date.now() / 1000) + 3600 })).toString('base64url')
    const noneToken = `${header}.${body}.`

    expect(() => verifyToken(mockReq(`Bearer ${noneToken}`), TEST_SECRET)).toThrow()
  })

  it('rejects tokens with non-positive or non-numeric subject', () => {
    const tokenZero = jwt.sign({ sub: 0 }, TEST_SECRET, { algorithm: 'HS256', expiresIn: '1h' })
    expect(() => verifyToken(mockReq(`Bearer ${tokenZero}`), TEST_SECRET)).toThrow('Invalid token subject')

    const tokenString = jwt.sign({ sub: 'admin-user' }, TEST_SECRET, { algorithm: 'HS256', expiresIn: '1h' })
    expect(() => verifyToken(mockReq(`Bearer ${tokenString}`), TEST_SECRET)).toThrow('Invalid token subject')
  })
})

describe('JWT Session Revocation & Lifecycle (#15)', () => {
  let tables: Tables
  const config = { jwtSecret: TEST_SECRET }

  beforeEach(() => {
    tables = {
      vx_user: [
        {
          id: 42,
          email: 'operator@moonwitness.org',
          name: 'Operator Alice',
          password: 'hashed-password',
          token_version: 1,
          is_active: true,
        },
      ],
      mx_model: [
        { id: 1, model: 'vx.user' },
      ],
    }
    setupOrm(makeDb(tables))
  })

  it('validates active session matching current tokenVersion', async () => {
    const env = createCtx(SUPERUSER_ID, {}, getModel as any)
    const session = await validateUserSession(env, 42, 1)

    expect(session.id).toBe(42)
    expect(session.email).toBe('operator@moonwitness.org')
    expect(session.tokenVersion).toBe(1)
  })

  it('rejects session if tokenVersion is stale (session revoked)', async () => {
    const env = createCtx(SUPERUSER_ID, {}, getModel as any)
    // token has version 1, but user in DB has advanced to version 2
    tables.vx_user[0].token_version = 2

    await expect(validateUserSession(env, 42, 1)).rejects.toThrow('Session revoked')
  })

  it('rejects session if user account is deactivated', async () => {
    const env = createCtx(SUPERUSER_ID, {}, getModel as any)
    tables.vx_user[0].is_active = false

    await expect(validateUserSession(env, 42, 1)).rejects.toThrow('User account is inactive or disabled')
  })

  it('revokes user sessions by incrementing tokenVersion', async () => {
    const newVersion = await revokeUserSessions(42)

    expect(newVersion).toBe(2)
    expect(tables.vx_user[0].token_version).toBe(2)
  })

  it('handles /auth/logout by revoking user sessions', async () => {
    const token = issueJwt({ sub: 42, email: 'operator@moonwitness.org', tokenVersion: 1 }, TEST_SECRET)
    const req = mockReq(`Bearer ${token}`)
    const { res, getResult } = createMockRes()

    await handleLogout(req, res, config)
    const result = getResult()

    expect(result.status).toBe(200)
    expect(result.body.message).toContain('Logged out successfully')
    expect(tables.vx_user[0].token_version).toBe(2)
  })

  it('handles /auth/me to return current user session and rejects after revocation', async () => {
    const token = issueJwt({ sub: 42, email: 'operator@moonwitness.org', tokenVersion: 1 }, TEST_SECRET)

    // 1. Initial request with valid token succeeds
    const req1 = mockReq(`Bearer ${token}`)
    const { res: res1, getResult: getResult1 } = createMockRes()
    await handleGetSession(req1, res1, config)
    expect(getResult1().status).toBe(200)
    expect(getResult1().body.user.email).toBe('operator@moonwitness.org')

    // 2. User logs out / session is revoked
    await handleLogout(mockReq(`Bearer ${token}`), createMockRes().res, config)

    // 3. Subsequent request with old token is rejected with SESSION_REVOKED
    const req2 = mockReq(`Bearer ${token}`)
    const { res: res2, getResult: getResult2 } = createMockRes()
    await handleGetSession(req2, res2, config)
    expect(getResult2().status).toBe(401)
    expect(getResult2().body.code).toBe('SESSION_REVOKED')
  })
})

describe('OTP Challenge Hardening & Expiration (#29)', () => {
  it('creates a 6-digit OTP challenge expiring in 15 minutes', () => {
    const challenge = createOtpChallenge(42)
    expect(challenge.userId).toBe(42)
    expect(challenge.code).toHaveLength(6)
    expect(challenge.used).toBe(false)
    expect(challenge.expiresAt).toBeGreaterThan(Date.now())
  })

  it('verifies valid code and enforces single-use invalidation', () => {
    const challenge = createOtpChallenge(42)
    const result1 = verifyOtpChallenge(challenge, challenge.code)
    expect(result1.valid).toBe(true)
    expect(challenge.used).toBe(true)

    // Second attempt fails because challenge is now used
    const result2 = verifyOtpChallenge(challenge, challenge.code)
    expect(result2.valid).toBe(false)
    expect(result2.error).toContain('already been used')
  })

  it('rejects invalid codes and limits attempts to maxAttempts', () => {
    const challenge = createOtpChallenge(42)
    for (let i = 0; i < 4; i++) {
      const res = verifyOtpChallenge(challenge, '000000')
      expect(res.valid).toBe(false)
      expect(res.error).toBe('Invalid OTP code')
    }

    // 5th failed attempt exhausts maxAttempts and invalidates
    const res5 = verifyOtpChallenge(challenge, '000000')
    expect(res5.valid).toBe(false)

    // Further attempt blocked by rate limit
    const res6 = verifyOtpChallenge(challenge, challenge.code)
    expect(res6.valid).toBe(false)
    expect(res6.error).toContain('Maximum OTP attempts exceeded')
  })

  it('rejects expired OTP challenges', () => {
    const challenge = createOtpChallenge(42)
    challenge.expiresAt = Date.now() - 1000 // Expired

    const res = verifyOtpChallenge(challenge, challenge.code)
    expect(res.valid).toBe(false)
    expect(res.error).toContain('expired')
  })
})
