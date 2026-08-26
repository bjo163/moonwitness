import type { IncomingMessage } from 'node:http'
import jwt from 'jsonwebtoken'
import { ANONYMOUS_ID } from '@moon/orm'

export interface VerifyTokenOptions {
  clockTolerance?: number
  maxAge?: string | number
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
