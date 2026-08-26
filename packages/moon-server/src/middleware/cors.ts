import type { IncomingMessage, ServerResponse } from 'node:http'
import { resolveCorsOrigin, type CorsConfig } from '../utils/http.js'

/**
 * CORS middleware supporting origin whitelisting and safe credentials
 */
export function corsMiddleware(
  config?: CorsConfig
): (req: IncomingMessage, res: ServerResponse, next: () => Promise<void>) => Promise<void> | void {
  return (req: IncomingMessage, res: ServerResponse, next: () => Promise<void>) => {
    const reqOrigin = req.headers.origin as string | undefined
    const allowedOrigin = resolveCorsOrigin(reqOrigin, config)

    if (allowedOrigin) {
      res.setHeader('Access-Control-Allow-Origin', allowedOrigin)
      if (allowedOrigin !== '*') {
        res.setHeader('Vary', 'Origin')
        if (config?.allowCredentials !== false) {
          res.setHeader('Access-Control-Allow-Credentials', 'true')
        }
      }
      const reqHeaders =
        (req.headers['access-control-request-headers'] as string) ||
        'Content-Type, Authorization, X-Requested-With, Accept, Origin, Cache-Control, Last-Event-ID'
      res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, POST, GET, PUT, DELETE, PATCH')
      res.setHeader('Access-Control-Allow-Headers', reqHeaders)
      res.setHeader('Access-Control-Max-Age', '86400')
    }

    res.setHeader('X-Content-Type-Options', 'nosniff')
    res.setHeader('X-Frame-Options', 'SAMEORIGIN')
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin')
    if (process.env.NODE_ENV === 'production') {
      res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains')
    }

    // Handle preflight
    if (req.method === 'OPTIONS') {
      res.writeHead(204)
      res.end()
      return
    }

    return next()
  }
}

