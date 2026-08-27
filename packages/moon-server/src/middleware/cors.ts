import type { IncomingMessage, ServerResponse } from 'node:http'
import {
  DEFAULT_CORS_HEADERS,
  DEFAULT_CORS_METHODS,
  handleCorsPreflight,
  resolveCorsOrigin,
  type CorsConfig
} from '../utils/http.js'

/** CORS middleware using the same fail-closed policy as NativeServer. */
export function corsMiddleware(
  config?: CorsConfig
): (req: IncomingMessage, res: ServerResponse, next: () => Promise<void>) => Promise<void> | void {
  return (req: IncomingMessage, res: ServerResponse, next: () => Promise<void>) => {
    if (req.method === 'OPTIONS') {
      handleCorsPreflight(req, res, config)
      return
    }

    const allowedOrigin = resolveCorsOrigin(req.headers.origin as string | undefined, config)
    if (allowedOrigin) {
      res.setHeader('Access-Control-Allow-Origin', allowedOrigin)
      res.setHeader('Access-Control-Allow-Methods', (config?.allowedMethods || [...DEFAULT_CORS_METHODS]).join(', '))
      res.setHeader('Access-Control-Allow-Headers', (config?.allowedHeaders || [...DEFAULT_CORS_HEADERS]).join(', '))
      if (allowedOrigin !== '*') {
        res.setHeader('Vary', 'Origin')
        if (config?.allowCredentials !== false) {
          res.setHeader('Access-Control-Allow-Credentials', 'true')
        }
      }
    }

    res.setHeader('X-Content-Type-Options', 'nosniff')
    res.setHeader('X-Frame-Options', 'SAMEORIGIN')
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin')
    if (process.env.NODE_ENV === 'production') {
      res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains')
    }

    return next()
  }
}
