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
  authenticateRequest,
  resolveJwtPolicy,
  reloadCanonicalJwtPolicy,
  AuthError,
} from '../src/utils/auth.js'
import { handleLogout, handleGetSession, handleResetPassword } from '../src/handlers/auth.js'
import { handleRest } from '../src/handlers/rest.js'
import { handleRpc } from '../src/handlers/rpc.js'
import { registerModel, setupOrm, Vertex, fields, ANONYMOUS_ID, SUPERUSER_ID, createCtx, getModel } from '@moon/orm'

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

  it('rejects tokens with non-positive, non-integer, or malformed subject', () => {
    const tokenZero = jwt.sign({ sub: 0 }, TEST_SECRET, { algorithm: 'HS256', expiresIn: '1h' })
    expect(() => verifyToken(mockReq(`Bearer ${tokenZero}`), TEST_SECRET)).toThrow('Invalid token subject')

    const tokenNegative = jwt.sign({ sub: -5 }, TEST_SECRET, { algorithm: 'HS256', expiresIn: '1h' })
    expect(() => verifyToken(mockReq(`Bearer ${tokenNegative}`), TEST_SECRET)).toThrow('Invalid token subject')

    const tokenFloat = jwt.sign({ sub: 42.7 }, TEST_SECRET, { algorithm: 'HS256', expiresIn: '1h' })
    expect(() => verifyToken(mockReq(`Bearer ${tokenFloat}`), TEST_SECRET)).toThrow('Invalid token subject')

    const tokenAlpha = jwt.sign({ sub: '1abc' }, TEST_SECRET, { algorithm: 'HS256', expiresIn: '1h' })
    expect(() => verifyToken(mockReq(`Bearer ${tokenAlpha}`), TEST_SECRET)).toThrow('Invalid token subject')

    const tokenString = jwt.sign({ sub: 'admin-user' }, TEST_SECRET, { algorithm: 'HS256', expiresIn: '1h' })
    expect(() => verifyToken(mockReq(`Bearer ${tokenString}`), TEST_SECRET)).toThrow('Invalid token subject')

    // Valid string of digits is safely parsed
    const tokenStringDigits = jwt.sign({ sub: '42' }, TEST_SECRET, { algorithm: 'HS256', expiresIn: '1h' })
    const verified = verifyToken(mockReq(`Bearer ${tokenStringDigits}`), TEST_SECRET)
    expect(verified.sub).toBe(42)
  })

  it('enforces issuer and audience validation when configured', () => {
    const validToken = issueJwt(
      { sub: 42 },
      TEST_SECRET,
      { expiresIn: '1h', issuer: 'moonwitness', audience: 'moonwitness-api' }
    )

    // Matching issuer and audience succeeds
    const verified = verifyToken(mockReq(`Bearer ${validToken}`), TEST_SECRET, {
      issuer: 'moonwitness',
      audience: 'moonwitness-api',
    })
    expect(verified.sub).toBe(42)

    // Mismatched issuer is rejected
    expect(() =>
      verifyToken(mockReq(`Bearer ${validToken}`), TEST_SECRET, {
        issuer: 'rogue-issuer',
        audience: 'moonwitness-api',
      })
    ).toThrow('Invalid token issuer')

    // Mismatched audience is rejected
    expect(() =>
      verifyToken(mockReq(`Bearer ${validToken}`), TEST_SECRET, {
        issuer: 'moonwitness',
        audience: 'wrong-audience',
      })
    ).toThrow('Invalid token audience')
  })

  it('distinguishes missing authorization from malformed Bearer credentials', () => {
    // Missing / empty -> ANONYMOUS_ID
    expect(verifyToken(mockReq(), TEST_SECRET)).toEqual({ sub: ANONYMOUS_ID })
    expect(verifyToken(mockReq(''), TEST_SECRET)).toEqual({ sub: ANONYMOUS_ID })
    expect(verifyToken(mockReq('   '), TEST_SECRET)).toEqual({ sub: ANONYMOUS_ID })

    // Malformed Bearer -> throws AUTH_MALFORMED
    expect(() => verifyToken(mockReq('Bearer '), TEST_SECRET)).toThrow('Malformed Bearer token')
    expect(() => verifyToken(mockReq('Bearer    '), TEST_SECRET)).toThrow('Malformed Bearer token')
    expect(() => verifyToken(mockReq('Basic YWRtaW46cGFzcw=='), TEST_SECRET)).toThrow('Invalid authorization format')
    expect(() => verifyToken(mockReq('Bearer not-a-valid-jwt'), TEST_SECRET)).toThrow('Invalid token')
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

    // 3. Subsequent request with old token is rejected with AUTH_SESSION_REVOKED
    const req2 = mockReq(`Bearer ${token}`)
    const { res: res2, getResult: getResult2 } = createMockRes()
    await handleGetSession(req2, res2, config)
    expect(getResult2().status).toBe(401)
    expect(getResult2().body.code).toBe('AUTH_SESSION_REVOKED')
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

describe('Transport Auth Boundary: REST & RPC Integration (#15)', () => {
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
      mx_model: [{ id: 1, model: 'vx.user' }],
    }
    setupOrm(makeDb(tables))
  })

  it('handleRest returns 401 with AUTH_MALFORMED for malformed Bearer header', async () => {
    const req = mockReq('Bearer ')
    req.method = 'GET'
    req.url = '/api/vx.user'
    const { res, getResult } = createMockRes()
    const match = ['/api/vx.user', 'vx.user'] as RegExpMatchArray

    await handleRest(req, res, match, TEST_SECRET)
    const result = getResult()

    expect(result.status).toBe(401)
    expect(result.body.code).toBe('AUTH_MALFORMED')
  })

  it('handleRest returns 401 with AUTH_EXPIRED for expired JWT', async () => {
    const expiredToken = jwt.sign(
      { sub: 42, exp: Math.floor(Date.now() / 1000) - 120 },
      TEST_SECRET,
      { algorithm: 'HS256' }
    )
    const req = mockReq(`Bearer ${expiredToken}`)
    req.method = 'GET'
    req.url = '/api/vx.user'
    const { res, getResult } = createMockRes()
    const match = ['/api/vx.user', 'vx.user'] as RegExpMatchArray

    await handleRest(req, res, match, TEST_SECRET)
    const result = getResult()

    expect(result.status).toBe(401)
    expect(result.body.code).toBe('AUTH_EXPIRED')
  })

  it('handleRpc returns 401 with AUTH_REQUIRED when no authorization header is present', async () => {
    const req = mockReq()
    req.method = 'POST'
    req.url = '/rpc'
    ;(req as any).body = { model: 'vx.user', method: 'fetch' }
    const { res, getResult } = createMockRes()

    await handleRpc(req, res, TEST_SECRET)
    const result = getResult()

    expect(result.status).toBe(401)
    expect(result.body.code).toBe('AUTH_REQUIRED')
  })

  it('handleRpc returns 401 with AUTH_MALFORMED for invalid authorization header scheme', async () => {
    const req = mockReq('Basic 12345')
    req.method = 'POST'
    req.url = '/rpc'
    ;(req as any).body = { model: 'vx.user', method: 'fetch' }
    const { res, getResult } = createMockRes()

    await handleRpc(req, res, TEST_SECRET)
    const result = getResult()

    expect(result.status).toBe(401)
    expect(result.body.code).toBe('AUTH_MALFORMED')
  })

  it('handleRpc returns 401 with AUTH_EXPIRED for expired token', async () => {
    const expiredToken = jwt.sign(
      { sub: 42, exp: Math.floor(Date.now() / 1000) - 120 },
      TEST_SECRET,
      { algorithm: 'HS256' }
    )
    const req = mockReq(`Bearer ${expiredToken}`)
    req.method = 'POST'
    req.url = '/rpc'
    ;(req as any).body = { model: 'vx.user', method: 'fetch' }
    const { res, getResult } = createMockRes()

    await handleRpc(req, res, TEST_SECRET)
    const result = getResult()

    expect(result.status).toBe(401)
    expect(result.body.code).toBe('AUTH_EXPIRED')
  })

  it('handleRest and handleRpc reject revoked token with 401 AUTH_SESSION_REVOKED after user session revocation', async () => {
    const token = issueJwt({ sub: 42, email: 'operator@moonwitness.org', tokenVersion: 1 }, TEST_SECRET)

    // 1. Initially valid REST and RPC requests succeed (or reach business validation)
    const reqRest1 = mockReq(`Bearer ${token}`)
    reqRest1.method = 'GET'
    reqRest1.url = '/api/vx.user'
    const { res: resRest1, getResult: getRest1 } = createMockRes()
    await handleRest(reqRest1, resRest1, ['/api/vx.user', 'vx.user'] as RegExpMatchArray, TEST_SECRET)
    expect(getRest1().status).toBe(200)

    // 2. Revoke user sessions
    await revokeUserSessions(42)
    expect(tables.vx_user[0].token_version).toBe(2)

    // 3. Subsequent REST request with old token (tokenVersion 1) is rejected
    const reqRest2 = mockReq(`Bearer ${token}`)
    reqRest2.method = 'GET'
    reqRest2.url = '/api/vx.user'
    const { res: resRest2, getResult: getRest2 } = createMockRes()
    await handleRest(reqRest2, resRest2, ['/api/vx.user', 'vx.user'] as RegExpMatchArray, TEST_SECRET)
    expect(getRest2().status).toBe(401)
    expect(getRest2().body.code).toBe('AUTH_SESSION_REVOKED')

    // 4. Subsequent RPC request with old token (tokenVersion 1) is rejected
    const reqRpc = mockReq(`Bearer ${token}`)
    reqRpc.method = 'POST'
    reqRpc.url = '/rpc'
    ;(reqRpc as any).body = { model: 'vx.user', method: 'fetch' }
    const { res: resRpc, getResult: getRpc } = createMockRes()
    await handleRpc(reqRpc, resRpc, TEST_SECRET)
    expect(getRpc().status).toBe(401)
    expect(getRpc().body.code).toBe('AUTH_SESSION_REVOKED')
  })

  it('handleLogout validates current session and blocks repeated revocation calls with stale JWT', async () => {
    const token = issueJwt({ sub: 42, email: 'operator@moonwitness.org', tokenVersion: 1 }, TEST_SECRET)

    // 1. First logout succeeds and advances version to 2
    const req1 = mockReq(`Bearer ${token}`)
    const { res: res1, getResult: getResult1 } = createMockRes()
    await handleLogout(req1, res1, config)
    expect(getResult1().status).toBe(200)
    expect(tables.vx_user[0].token_version).toBe(2)

    // 2. Second logout with same stale token fails with AUTH_SESSION_REVOKED and does NOT advance DB version
    const req2 = mockReq(`Bearer ${token}`)
    const { res: res2, getResult: getResult2 } = createMockRes()
    await handleLogout(req2, res2, config)
    expect(getResult2().status).toBe(401)
    expect(getResult2().body.code).toBe('AUTH_SESSION_REVOKED')
    expect(tables.vx_user[0].token_version).toBe(2)
  })

  it('password reset invalidates active sessions across REST and RPC', async () => {
    const oldToken = issueJwt({ sub: 42, email: 'operator@moonwitness.org', tokenVersion: 1 }, TEST_SECRET)

    // Simulate password reset advancing tokenVersion to 2
    tables.vx_user[0].token_version = 2

    // REST with old token fails
    const reqRest = mockReq(`Bearer ${oldToken}`)
    reqRest.method = 'GET'
    reqRest.url = '/api/vx.user'
    const { res: resRest, getResult: getRest } = createMockRes()
    await handleRest(reqRest, resRest, ['/api/vx.user', 'vx.user'] as RegExpMatchArray, TEST_SECRET)
    expect(getRest().status).toBe(401)
    expect(getRest().body.code).toBe('AUTH_SESSION_REVOKED')

    // RPC with old token fails
    const reqRpc = mockReq(`Bearer ${oldToken}`)
    reqRpc.method = 'POST'
    reqRpc.url = '/rpc'
    ;(reqRpc as any).body = { model: 'vx.user', method: 'fetch' }
    const { res: resRpc, getResult: getRpc } = createMockRes()
    await handleRpc(reqRpc, resRpc, TEST_SECRET)
    expect(getRpc().status).toBe(401)
    expect(getRpc().body.code).toBe('AUTH_SESSION_REVOKED')

    // New token issued with tokenVersion 2 succeeds
    const newToken = issueJwt({ sub: 42, email: 'operator@moonwitness.org', tokenVersion: 2 }, TEST_SECRET)
    const reqRestNew = mockReq(`Bearer ${newToken}`)
    reqRestNew.method = 'GET'
    reqRestNew.url = '/api/vx.user'
    const { res: resRestNew, getResult: getRestNew } = createMockRes()
    await handleRest(reqRestNew, resRestNew, ['/api/vx.user', 'vx.user'] as RegExpMatchArray, TEST_SECRET)
    expect(getRestNew().status).toBe(200)
  })

  it('REST and RPC reject inactive user with 401 AUTH_USER_INACTIVE', async () => {
    const token = issueJwt({ sub: 42, email: 'operator@moonwitness.org', tokenVersion: 1 }, TEST_SECRET)
    tables.vx_user[0].is_active = false

    const reqRest = mockReq(`Bearer ${token}`)
    reqRest.method = 'GET'
    reqRest.url = '/api/vx.user'
    const { res: resRest, getResult: getRest } = createMockRes()
    await handleRest(reqRest, resRest, ['/api/vx.user', 'vx.user'] as RegExpMatchArray, TEST_SECRET)
    expect(getRest().status).toBe(401)
    expect(getRest().body.code).toBe('AUTH_USER_INACTIVE')

    const reqRpc = mockReq(`Bearer ${token}`)
    reqRpc.method = 'POST'
    reqRpc.url = '/rpc'
    ;(reqRpc as any).body = { model: 'vx.user', method: 'fetch' }
    const { res: resRpc, getResult: getRpc } = createMockRes()
    await handleRpc(reqRpc, resRpc, TEST_SECRET)
    expect(getRpc().status).toBe(401)
    expect(getRpc().body.code).toBe('AUTH_USER_INACTIVE')
  })

  it('REST and RPC reject nonexistent user with 401 AUTH_USER_NOT_FOUND', async () => {
    const token = issueJwt({ sub: 9999, email: 'ghost@moonwitness.org', tokenVersion: 1 }, TEST_SECRET)

    const reqRest = mockReq(`Bearer ${token}`)
    reqRest.method = 'GET'
    reqRest.url = '/api/vx.user'
    const { res: resRest, getResult: getRest } = createMockRes()
    await handleRest(reqRest, resRest, ['/api/vx.user', 'vx.user'] as RegExpMatchArray, TEST_SECRET)
    expect(getRest().status).toBe(401)
    expect(getRest().body.code).toBe('AUTH_USER_NOT_FOUND')

    const reqRpc = mockReq(`Bearer ${token}`)
    reqRpc.method = 'POST'
    reqRpc.url = '/rpc'
    ;(reqRpc as any).body = { model: 'vx.user', method: 'fetch' }
    const { res: resRpc, getResult: getRpc } = createMockRes()
    await handleRpc(reqRpc, resRpc, TEST_SECRET)
    expect(getRpc().status).toBe(401)
    expect(getRpc().body.code).toBe('AUTH_USER_NOT_FOUND')
  })

  it('REST allows anonymous access for public paths while RPC requires authenticated user', async () => {
    // REST without Authorization header
    const reqRest = mockReq()
    reqRest.method = 'GET'
    reqRest.url = '/api/vx.user'
    const { res: resRest, getResult: getRest } = createMockRes()
    await handleRest(reqRest, resRest, ['/api/vx.user', 'vx.user'] as RegExpMatchArray, TEST_SECRET)
    expect(getRest().status).toBe(200)

    // RPC without Authorization header
    const reqRpc = mockReq()
    reqRpc.method = 'POST'
    reqRpc.url = '/rpc'
    ;(reqRpc as any).body = { model: 'vx.user', method: 'fetch' }
    const { res: resRpc, getResult: getRpc } = createMockRes()
    await handleRpc(reqRpc, resRpc, TEST_SECRET)
    expect(getRpc().status).toBe(401)
    expect(getRpc().body.code).toBe('AUTH_REQUIRED')
  })

  it('canonical TTL configuration controls issued access-token lifetime', () => {
    reloadCanonicalJwtPolicy({ JWT_ACCESS_TOKEN_TTL: '2h' })
    const token = issueJwt({ sub: 42, tokenVersion: 1 }, TEST_SECRET)
    const decoded = jwt.decode(token) as any
    expect(decoded.exp - decoded.iat).toBe(7200)

    // Reset policy back to default
    reloadCanonicalJwtPolicy({})
  })

  it('algorithm configuration fails closed on unsupported or invalid configuration', () => {
    expect(() => resolveJwtPolicy({ JWT_ALGORITHM: 'RS256' })).toThrow('Invalid JWT_ALGORITHM configuration')
    expect(() => resolveJwtPolicy({ JWT_ALGORITHM: 'none' })).toThrow('Invalid JWT_ALGORITHM configuration')
    expect(() => resolveJwtPolicy({ JWT_CLOCK_TOLERANCE_SECONDS: '-10' })).toThrow('Invalid JWT_CLOCK_TOLERANCE_SECONDS configuration')
    expect(() => resolveJwtPolicy({ JWT_CLOCK_TOLERANCE_SECONDS: 'abc' })).toThrow('Invalid JWT_CLOCK_TOLERANCE_SECONDS configuration')
    expect(() => resolveJwtPolicy({ JWT_ACCESS_TOKEN_TTL: '' })).toThrow('Invalid JWT_ACCESS_TOKEN_TTL configuration')
  })
})
