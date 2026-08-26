import type { IncomingMessage } from 'node:http'
import jwt from 'jsonwebtoken'
import { randomInt, createHash } from 'node:crypto'
import { ANONYMOUS_ID, SUPERUSER_ID, createCtx, getModel, authSecurityContext, type Ctx } from '@moon/orm'

export const ALLOWED_JWT_ALGORITHMS = ['HS256', 'HS384', 'HS512'] as const
export type AllowedJwtAlgorithm = (typeof ALLOWED_JWT_ALGORITHMS)[number]

export interface JwtPolicy {
  algorithm: AllowedJwtAlgorithm
  allowedAlgorithms: AllowedJwtAlgorithm[]
  issuer?: string
  audience?: string
  expiresIn: string | number
  clockTolerance: number
}

export const DEFAULT_JWT_ALGORITHM: AllowedJwtAlgorithm = 'HS256'
export const DEFAULT_JWT_EXPIRES_IN = '7d'
export const DEFAULT_JWT_CLOCK_TOLERANCE_SECONDS = 60

/**
 * Resolve and validate canonical JWT policy from environment variables.
 * Fails closed with 500 AuthError if algorithm, clock tolerance, or TTL configuration is invalid.
 */
export function resolveJwtPolicy(env: Record<string, string | undefined> = process.env): JwtPolicy {
  const rawAlg = env.JWT_ALGORITHM?.trim() || DEFAULT_JWT_ALGORITHM
  if (!ALLOWED_JWT_ALGORITHMS.includes(rawAlg as any)) {
    throw new AuthError(
      'AUTH_INVALID',
      `Invalid JWT_ALGORITHM configuration: "${rawAlg}". Allowed algorithms: ${ALLOWED_JWT_ALGORITHMS.join(', ')}`,
      500
    )
  }
  const algorithm = rawAlg as AllowedJwtAlgorithm

  const rawTtl = env.JWT_ACCESS_TOKEN_TTL?.trim()
  if (rawTtl !== undefined && rawTtl === '') {
    throw new AuthError('AUTH_INVALID', 'Invalid JWT_ACCESS_TOKEN_TTL configuration: cannot be empty', 500)
  }
  const expiresIn = rawTtl || DEFAULT_JWT_EXPIRES_IN

  let clockTolerance = DEFAULT_JWT_CLOCK_TOLERANCE_SECONDS
  if (env.JWT_CLOCK_TOLERANCE_SECONDS !== undefined && env.JWT_CLOCK_TOLERANCE_SECONDS.trim() !== '') {
    const parsed = parseInt(env.JWT_CLOCK_TOLERANCE_SECONDS, 10)
    if (isNaN(parsed) || parsed < 0) {
      throw new AuthError(
        'AUTH_INVALID',
        `Invalid JWT_CLOCK_TOLERANCE_SECONDS configuration: must be a non-negative integer, received "${env.JWT_CLOCK_TOLERANCE_SECONDS}"`,
        500
      )
    }
    clockTolerance = parsed
  }

  const issuer = env.JWT_ISSUER?.trim() || undefined
  const audience = env.JWT_AUDIENCE?.trim() || undefined

  return {
    algorithm,
    allowedAlgorithms: [algorithm],
    issuer,
    audience,
    expiresIn,
    clockTolerance
  }
}

export let CANONICAL_JWT_POLICY: JwtPolicy = resolveJwtPolicy()

export function reloadCanonicalJwtPolicy(env: Record<string, string | undefined> = process.env): JwtPolicy {
  CANONICAL_JWT_POLICY = resolveJwtPolicy(env)
  return CANONICAL_JWT_POLICY
}

export type AuthErrorCode =
  | 'AUTH_REQUIRED'
  | 'AUTH_MISSING'
  | 'AUTH_MALFORMED'
  | 'AUTH_EXPIRED'
  | 'AUTH_INVALID'
  | 'AUTH_NOT_ACTIVE'
  | 'AUTH_SUBJECT_INVALID'
  | 'AUTH_ISSUER_INVALID'
  | 'AUTH_AUDIENCE_INVALID'
  | 'AUTH_SESSION_REVOKED'
  | 'AUTH_USER_INACTIVE'
  | 'AUTH_USER_NOT_FOUND'

export class AuthError extends Error {
  code: AuthErrorCode
  statusCode: number

  constructor(code: AuthErrorCode, message: string, statusCode: number = 401) {
    super(message)
    this.name = 'AuthError'
    this.code = code
    this.statusCode = statusCode
  }
}

export interface VerifyTokenOptions {
  clockTolerance?: number
  maxAge?: string | number
  issuer?: string
  audience?: string
  algorithms?: AllowedJwtAlgorithm[]
}

export interface AuthenticateRequestOptions {
  allowAnonymous?: boolean
  env?: Ctx
  verifyOptions?: VerifyTokenOptions
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

/**
 * Issue a standard signed JWT token with algorithm pinning, canonical TTL, and tokenVersion
 */
export function issueJwt(
  payload: JwtClaims,
  jwtSecret: string,
  options: jwt.SignOptions = {}
): string {
  if (!jwtSecret || typeof jwtSecret !== 'string') {
    throw new AuthError('AUTH_INVALID', 'JWT secret is missing or invalid', 500)
  }

  const algorithm = (options.algorithm as AllowedJwtAlgorithm) || CANONICAL_JWT_POLICY.algorithm
  if (!ALLOWED_JWT_ALGORITHMS.includes(algorithm)) {
    throw new AuthError('AUTH_INVALID', `Unsupported JWT algorithm: ${algorithm}`, 500)
  }

  const expiresIn = options.expiresIn ?? CANONICAL_JWT_POLICY.expiresIn
  const issuer = options.issuer ?? CANONICAL_JWT_POLICY.issuer
  const audience = options.audience ?? CANONICAL_JWT_POLICY.audience

  const signOpts: jwt.SignOptions = {
    algorithm: algorithm as jwt.Algorithm,
    expiresIn: expiresIn as any,
    ...(issuer ? { issuer } : {}),
    ...(audience ? { audience } : {}),
    ...options
  }

  return jwt.sign(payload, jwtSecret, signOpts)
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
    throw new AuthError('AUTH_INVALID', 'User model not found', 500)
  }

  const queryEnv = env?.withContext
    ? env.withContext({ active_test: false })
    : createCtx(env?.uid ?? ANONYMOUS_ID, { ...(env?.context ?? {}), active_test: false }, getModel as any)

  const users = await VxUser.fetch(VxUser as any, queryEnv, [['id', '=', userId]])
  if (users.length === 0) {
    throw new AuthError('AUTH_USER_NOT_FOUND', 'User not found', 401)
  }

  const user = users[0]
  if (user.is_active === false || user.isActive === false) {
    throw new AuthError('AUTH_USER_INACTIVE', 'User account is inactive or disabled', 401)
  }

  const currentTokenVersion = Number(user.token_version ?? user.tokenVersion ?? 1)
  if (tokenVersion !== undefined && Number(tokenVersion) !== currentTokenVersion) {
    throw new AuthError('AUTH_SESSION_REVOKED', 'Session revoked', 401)
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
    throw new AuthError('AUTH_INVALID', 'User model not found', 500)
  }
  const ctx = env ?? createCtx(SUPERUSER_ID, {}, getModel as any)
  const users = await VxUser.fetch(VxUser as any, ctx, [['id', '=', userId]])
  if (users.length === 0) {
    throw new AuthError('AUTH_USER_NOT_FOUND', 'User not found', 401)
  }
  const user = users[0]
  const nextVersion = (Number(user.token_version ?? user.tokenVersion ?? 1)) + 1
  await VxUser.morph(VxUser as any, ctx, user.id, {
    tokenVersion: nextVersion
  })
  return nextVersion
}

/**
 * Authenticate incoming HTTP request with full session validation.
 * - Missing / empty Authorization header returns { uid: ANONYMOUS_ID } (if allowed) or throws AUTH_REQUIRED.
 * - Malformed Bearer header throws AUTH_MALFORMED.
 * - Valid Bearer token verifies JWT signature and validates active user and tokenVersion against database.
 */
export async function authenticateRequest(
  req: IncomingMessage,
  jwtSecret: string,
  options: AuthenticateRequestOptions = {}
): Promise<{ uid: number; email?: string; name?: string; tokenVersion?: number; partnerId?: number }> {
  const decoded = verifyToken(req, jwtSecret, options.verifyOptions)
  const uid = decoded.sub as number

  if (!uid || uid === ANONYMOUS_ID) {
    if (options.allowAnonymous) {
      return { uid: ANONYMOUS_ID }
    }
    throw new AuthError('AUTH_REQUIRED', 'Authentication required', 401)
  }

  const authCtx = options.env ?? createCtx(ANONYMOUS_ID, authSecurityContext('login'), getModel as any)
  const session = await validateUserSession(authCtx, uid, decoded.tokenVersion)

  return {
    uid: session.id,
    email: session.email,
    name: session.name,
    tokenVersion: session.tokenVersion,
    partnerId: session.partnerId
  }
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
 * Verify JWT token from Authorization header.
 * Returns decoded token payload with valid positive numeric `sub` or { sub: ANONYMOUS_ID } if no auth header present.
 * Throws explicit typed AuthError if token is expired, tampered, malformed, or invalid.
 */
export function verifyToken(
  req: IncomingMessage,
  jwtSecret: string,
  options: VerifyTokenOptions = {}
): any {
  if (!jwtSecret || typeof jwtSecret !== 'string') {
    throw new AuthError('AUTH_INVALID', 'JWT secret is missing or invalid', 500)
  }

  const authHeader = req.headers.authorization

  // 1. Missing or completely empty header => intentional Anonymous request
  if (!authHeader || !authHeader.trim()) {
    return { sub: ANONYMOUS_ID }
  }

  // 2. Header present but not starting with 'Bearer ' => Malformed
  if (!authHeader.startsWith('Bearer ')) {
    throw new AuthError('AUTH_MALFORMED', 'Invalid authorization format', 401)
  }

  // 3. 'Bearer ' present but token content is empty/whitespace => Malformed
  const token = authHeader.substring(7).trim()
  if (!token) {
    throw new AuthError('AUTH_MALFORMED', 'Malformed Bearer token', 401)
  }

  // 4. Verify token with canonical algorithms, clockTolerance, issuer, and audience
  try {
    const algorithms = options.algorithms || CANONICAL_JWT_POLICY.allowedAlgorithms
    const clockTolerance = options.clockTolerance ?? CANONICAL_JWT_POLICY.clockTolerance
    const expectedIssuer = options.issuer ?? CANONICAL_JWT_POLICY.issuer
    const expectedAudience = options.audience ?? CANONICAL_JWT_POLICY.audience

    const verifyOpts: jwt.VerifyOptions = {
      algorithms: algorithms as jwt.Algorithm[],
      clockTolerance,
      ...(options.maxAge ? { maxAge: options.maxAge } : {}),
      ...(expectedIssuer ? { issuer: expectedIssuer } : {}),
      ...(expectedAudience ? { audience: expectedAudience } : {}),
    }

    const decoded: any = jwt.verify(token, jwtSecret, verifyOpts)

    if (!decoded || typeof decoded !== 'object') {
      throw new AuthError('AUTH_INVALID', 'Invalid token payload', 401)
    }

    // 5. Strict Subject Validation: must be a positive safe integer
    const rawSub = decoded.sub
    if (rawSub === undefined || rawSub === null || typeof rawSub === 'boolean' || Array.isArray(rawSub) || typeof rawSub === 'object') {
      throw new AuthError('AUTH_SUBJECT_INVALID', 'Invalid token subject', 401)
    }

    let sub: number
    if (typeof rawSub === 'number') {
      sub = rawSub
    } else if (typeof rawSub === 'string' && /^\d+$/.test(rawSub.trim())) {
      sub = parseInt(rawSub.trim(), 10)
    } else {
      throw new AuthError('AUTH_SUBJECT_INVALID', 'Invalid token subject', 401)
    }

    if (!Number.isInteger(sub) || !Number.isSafeInteger(sub) || sub <= 0) {
      throw new AuthError('AUTH_SUBJECT_INVALID', 'Invalid token subject', 401)
    }

    return { ...decoded, sub }
  } catch (err: any) {
    if (err instanceof AuthError) {
      throw err
    }
    if (err instanceof jwt.TokenExpiredError) {
      throw new AuthError('AUTH_EXPIRED', 'Token expired', 401)
    }
    if (err instanceof jwt.NotBeforeError) {
      throw new AuthError('AUTH_NOT_ACTIVE', 'Token not active yet', 401)
    }
    if (err instanceof jwt.JsonWebTokenError) {
      const msg = err.message.toLowerCase()
      if (msg.includes('jwt issuer invalid') || msg.includes('issuer')) {
        throw new AuthError('AUTH_ISSUER_INVALID', 'Invalid token issuer', 401)
      }
      if (msg.includes('jwt audience invalid') || msg.includes('audience')) {
        throw new AuthError('AUTH_AUDIENCE_INVALID', 'Invalid token audience', 401)
      }
      if (msg.includes('invalid algorithm') || msg.includes('algorithm')) {
        throw new AuthError('AUTH_INVALID', 'Invalid token algorithm', 401)
      }
      throw new AuthError('AUTH_INVALID', 'Invalid token', 401)
    }
    throw new AuthError('AUTH_INVALID', err?.message || 'Invalid token', 401)
  }
}
