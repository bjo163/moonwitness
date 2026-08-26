import { describe, it, expect } from 'vitest'
import type { IncomingMessage } from 'node:http'
import jwt from 'jsonwebtoken'
import { verifyToken, createOtpChallenge, verifyOtpChallenge } from '../src/utils/auth.js'
import { ANONYMOUS_ID } from '@moon/orm'

const TEST_SECRET = 'super-secret-jwt-key-for-unit-testing-32chars!'

function mockReq(authHeader?: string): IncomingMessage {
  return {
    headers: {
      ...(authHeader !== undefined ? { authorization: authHeader } : {})
    }
  } as any
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
    const token = jwt.sign({ sub: 42, email: 'operator@moonwitness.org' }, TEST_SECRET, { expiresIn: '1h' })
    const payload = verifyToken(mockReq(`Bearer ${token}`), TEST_SECRET)

    expect(payload.sub).toBe(42)
    expect(payload.email).toBe('operator@moonwitness.org')
  })

  it('strictly rejects expired tokens with "Token expired"', () => {
    const expiredToken = jwt.sign(
      { sub: 42, exp: Math.floor(Date.now() / 1000) - 120 },
      TEST_SECRET
    )

    expect(() => verifyToken(mockReq(`Bearer ${expiredToken}`), TEST_SECRET, { clockTolerance: 0 }))
      .toThrow('Token expired')
  })

  it('tolerates small clock skew within configured clockTolerance window', () => {
    const recentlyExpired = jwt.sign(
      { sub: 42, exp: Math.floor(Date.now() / 1000) - 20 },
      TEST_SECRET
    )

    const payload = verifyToken(mockReq(`Bearer ${recentlyExpired}`), TEST_SECRET, { clockTolerance: 60 })
    expect(payload.sub).toBe(42)
  })

  it('rejects tampered or forged signatures', () => {
    const token = jwt.sign({ sub: 42 }, TEST_SECRET, { expiresIn: '1h' })
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
    const tokenZero = jwt.sign({ sub: 0 }, TEST_SECRET, { expiresIn: '1h' })
    expect(() => verifyToken(mockReq(`Bearer ${tokenZero}`), TEST_SECRET)).toThrow('Invalid token subject')

    const tokenString = jwt.sign({ sub: 'admin-user' }, TEST_SECRET, { expiresIn: '1h' })
    expect(() => verifyToken(mockReq(`Bearer ${tokenString}`), TEST_SECRET)).toThrow('Invalid token subject')
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
