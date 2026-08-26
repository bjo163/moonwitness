import type { IncomingMessage } from 'node:http'
import jwt from 'jsonwebtoken'
import { randomInt } from 'node:crypto'
import { ANONYMOUS_ID } from '@moon/orm'

export interface VerifyTokenOptions {
  clockTolerance?: number
  maxAge?: string | number
}

export interface OtpChallenge {
  userId: number
  code: string
  expiresAt: number
  attempts: number
  maxAttempts: number
  used: boolean
}

const OTP_EXPIRY_MS = 15 * 60 * 1000 // 15 minutes
const MAX_OTP_ATTEMPTS = 5

/**
 * Generate a single-use OTP challenge with 15-minute expiration
 */
export function createOtpChallenge(userId: number): OtpChallenge {
  const code = randomInt(100000, 999999).toString()
  return {
    userId,
    code,
    expiresAt: Date.now() + OTP_EXPIRY_MS,
    attempts: 0,
    maxAttempts: MAX_OTP_ATTEMPTS,
    used: false
  }
}

/**
 * Verify OTP challenge with single-use invalidation, expiration check, and attempt rate-limiting
 */
export function verifyOtpChallenge(
  challenge: OtpChallenge,
  inputCode: string
): { valid: boolean; error?: string } {
  if (challenge.attempts >= challenge.maxAttempts) {
    return { valid: false, error: 'Maximum OTP attempts exceeded' }
  }

  if (challenge.used) {
    return { valid: false, error: 'OTP challenge has already been used' }
  }

  if (Date.now() > challenge.expiresAt) {
    challenge.used = true
    return { valid: false, error: 'OTP challenge has expired' }
  }

  challenge.attempts++

  if (challenge.code !== inputCode.trim()) {
    if (challenge.attempts >= challenge.maxAttempts) {
      challenge.used = true
    }
    return { valid: false, error: 'Invalid OTP code' }
  }

  // Single-use: immediately mark as used upon successful verification
  challenge.used = true
  return { valid: true }
}

/**
 * Verify JWT token from Authorization header
 * Returns decoded token payload with valid `sub` or { sub: ANONYMOUS_ID } if no auth header present.
 * Throws explicit Error if token is expired, tampered, or invalid.
 */
export function verifyToken(
  req: IncomingMessage,
  jwtSecret: string,
  options: VerifyTokenOptions = {}
): any {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.trim()) {
    return { sub: ANONYMOUS_ID }
  }

  if (!authHeader.startsWith('Bearer ')) {
    throw new Error('Invalid authorization format')
  }

  const token = authHeader.substring(7).trim()
  if (!token) {
    return { sub: ANONYMOUS_ID }
  }

  try {
    const decoded: any = jwt.verify(token, jwtSecret, {
      algorithms: ['HS256', 'HS384', 'HS512'],
      clockTolerance: options.clockTolerance ?? 60,
      maxAge: options.maxAge
    })

    if (decoded && typeof decoded === 'object') {
      const sub = Number(decoded.sub)
      if (isNaN(sub) || sub <= 0) {
        throw new Error('Invalid token subject')
      }
      return { ...decoded, sub }
    }

    throw new Error('Invalid token payload')
  } catch (err: any) {
    if (err instanceof jwt.TokenExpiredError) {
      throw new Error('Token expired')
    }
    if (err instanceof jwt.NotBeforeError) {
      throw new Error('Token not active yet')
    }
    if (err instanceof jwt.JsonWebTokenError) {
      throw new Error('Invalid token')
    }
    throw err
  }
}
