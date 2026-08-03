import type { IncomingMessage } from 'node:http'
import jwt from 'jsonwebtoken'
import { ANONYMOUS_ID } from '@moon/orm'

/**
 * Verify JWT token from Authorization header
 * Returns decoded token payload or ANONYMOUS_ID if invalid/missing
 */
export function verifyToken(req: IncomingMessage, jwtSecret: string): any {
  const authHeader = req.headers.authorization
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { sub: ANONYMOUS_ID }
  }

  const token = authHeader.split(' ')[1]
  if (!token) {
    return { sub: ANONYMOUS_ID }
  }

  try {
    return jwt.verify(token, jwtSecret)
  } catch (e: any) {
    if (e.name === 'TokenExpiredError') {
      throw new Error('Token expired')
    }
    throw new Error('Invalid token')
  }
}
