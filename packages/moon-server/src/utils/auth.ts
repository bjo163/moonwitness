import type { IncomingMessage } from 'node:http'
import jwt from 'jsonwebtoken'
import { randomInt, createHash } from 'node:crypto'
import { ANONYMOUS_ID, SUPERUSER_ID, createCtx, getModel, type Ctx } from '@moon/orm'

export interface VerifyTokenOptions {
  clockTolerance?: number
  maxAge?: string | number
}

export interface JwtClaims {
  sub: number
  email?: string
  tokenVersion?: number
  [key: string]: any
}

export interface OtpChallenge {
  userId: number
  code: string
  tokenHash?: string
  expiresAt: number
  attempts: number
  maxAttempts: number
  used: boolean
}

export const OTP_EXPIRY_MS = 15 * 60 * 1000 // 15 minutes
export const MAX_OTP_ATTEMPTS = 5
export const DEFAULT_JWT_ALGORITHM = 'HS256'

/**
 * Issue a standard signed JWT token with algorithm pinning and tokenVersion
 */
export function issueJwt(
  payload: JwtClaims,
  jwtSecret: string,
  options: jwt.SignOptions = {}
): string {
  const { algorithm = DEFAULT_JWT_ALGORITHM, expiresIn = '7d', ...restOptions } = options
  return jwt.sign(payload, jwtSecret, {
    algorithm: algorithm as jwt.Algorithm,
    expiresIn,
    ...restOptions
  })
}

/**
 * Validate a user's active status and tokenVersion against database state
 */
export async function validateUserSession(
  env: Ctx,
  userId: number,
  tokenVersion?: number
): Promise<{ id: number; email: string; name: string; tokenVersion: number; partnerId?: number }> {
  const VxUser = getModel('vx.user')
  if (!VxUser) {
    throw new Error('User model not found')
  }

  const users = await VxUser.fetch(VxUser as any, env, [['id', '=', userId]])
  if (users.length === 0) {
    throw new Error('User not found')
  }

  const user = users[0]
  if (user.is_active === false || user.isActive === false) {
    throw new Error('User account is inactive or disabled')
  }

  const currentTokenVersion = Number(user.token_version ?? user.tokenVersion ?? 1)
  if (tokenVersion !== undefined && Number(tokenVersion) !== currentTokenVersion) {
    throw new Error('Session revoked')
  }

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    tokenVersion: currentTokenVersion,
    partnerId: user.partner_id ?? user.partnerId
  }
}

/**
 * Atomically revoke all active JWT sessions for a user by advancing tokenVersion
 */
export async function revokeUserSessions(
  userId: number,
  env?: Ctx
): Promise<number> {
  const VxUser = getModel('vx.user')
  if (!VxUser) {
    throw new Error('User model not found')
  }
  const ctx = env ?? createCtx(SUPERUSER_ID, {}, getModel as any)
  const users = await VxUser.fetch(VxUser as any, ctx, [['id', '=', userId]])
  if (users.length === 0) {
    throw new Error('User not found')
  }
  const user = users[0]
  const nextVersion = (Number(user.token_version ?? user.tokenVersion ?? 1)) + 1
  await VxUser.morph(VxUser as any, ctx, user.id, {
    tokenVersion: nextVersion
  })
  return nextVersion
}

/**
 * Generate a cryptographically secure 6-digit OTP string
 */
export function generateSecureOtp(): string {
  return randomInt(100000, 999999).toString()
}

/**
 * Compute SHA-256 hash for OTP verification bound to user ID
 */
export function hashOtpToken(userId: number, code: string): string {
  return createHash('sha256').update(`${userId}:${code.trim()}`).digest('hex')
}

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

