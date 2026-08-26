import type { IncomingMessage, ServerResponse } from 'node:http'

export class HttpError extends Error {
  statusCode: number
  code?: string

  constructor(message: string, statusCode: number = 500, code?: string) {
    super(message)
    this.name = 'HttpError'
    this.statusCode = statusCode
    this.code = code
  }
}

export class PayloadTooLargeError extends HttpError {
  constructor(message = 'Payload too large', maxBytes?: number) {
    super(
      maxBytes ? `${message} (max allowed: ${maxBytes} bytes)` : message,
      413,
      'PAYLOAD_TOO_LARGE'
    )
    this.name = 'PayloadTooLargeError'
  }
}

export class InvalidJsonError extends HttpError {
  constructor(message = 'Invalid JSON body') {
    super(message, 400, 'INVALID_JSON')
    this.name = 'InvalidJsonError'
  }
}

export interface ParseBodyOptions {
  maxBytes?: number
}

const DEFAULT_MAX_BODY_BYTES = 1024 * 1024 // 1MB

/**
 * Parse JSON body from incoming HTTP request with size bounding
 */
export async function parseBody(
  req: IncomingMessage,
  options: ParseBodyOptions = {}
): Promise<any> {
  const maxBytes = options.maxBytes ?? DEFAULT_MAX_BODY_BYTES

  return new Promise((resolve, reject) => {
    let body = ''
    let bytesReceived = 0

    const onData = (chunk: Buffer | string) => {
      const chunkSize = Buffer.isBuffer(chunk) ? chunk.length : Buffer.byteLength(chunk)
      bytesReceived += chunkSize

      if (bytesReceived > maxBytes) {
        req.removeListener('data', onData)
        req.destroy()
        return reject(new PayloadTooLargeError('Request body exceeds limit', maxBytes))
      }

      body += chunk.toString()
    }

    req.on('data', onData)
    req.on('end', () => {
      if (!body || body.trim() === '') {
        return resolve({})
      }
      try {
        resolve(JSON.parse(body))
      } catch (err: any) {
        reject(new InvalidJsonError('Malformed JSON payload: ' + err.message))
      }
    })
    req.on('error', reject)
  })
}

export interface CorsConfig {
  allowedOrigins?: string[] | ((origin: string) => boolean)
  allowCredentials?: boolean
}

/**
 * Resolve allowed origin based on whitelist
 */
export function resolveCorsOrigin(origin: string | undefined, config?: CorsConfig): string | null {
  if (!origin) return null
  if (!config || !config.allowedOrigins || config.allowedOrigins.length === 0) {
    return origin
  }

  if (typeof config.allowedOrigins === 'function') {
    return config.allowedOrigins(origin) ? origin : null
  }

  if (config.allowedOrigins.includes('*')) {
    return '*'
  }

  return config.allowedOrigins.includes(origin) ? origin : null
}

/**
 * Send JSON response with secure CORS and HTTP security headers
 */
export function sendJson(
  res: ServerResponse,
  statusCode: number,
  data: any,
  req?: IncomingMessage,
  corsConfig?: CorsConfig
) {
  if (res.headersSent) return

  const reqOrigin = req?.headers.origin as string | undefined
  const allowedOrigin = resolveCorsOrigin(reqOrigin, corsConfig)

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'SAMEORIGIN',
    'Referrer-Policy': 'strict-origin-when-cross-origin'
  }

  if (process.env.NODE_ENV === 'production') {
    headers['Strict-Transport-Security'] = 'max-age=31536000; includeSubDomains'
  }

  if (allowedOrigin) {
    headers['Access-Control-Allow-Origin'] = allowedOrigin
    if (allowedOrigin !== '*') {
      headers['Vary'] = 'Origin'
      if (corsConfig?.allowCredentials !== false) {
        headers['Access-Control-Allow-Credentials'] = 'true'
      }
    }
    headers['Access-Control-Allow-Methods'] = 'OPTIONS, POST, GET, PUT, DELETE, PATCH'
    headers['Access-Control-Allow-Headers'] =
      (req?.headers['access-control-request-headers'] as string) ||
      'Content-Type, Authorization, X-Requested-With, Accept, Origin, Cache-Control, Last-Event-ID'
  }

  res.writeHead(statusCode, headers)
  res.end(JSON.stringify(data))
}

/**
 * Handle CORS preflight OPTIONS request
 */
export function handleCorsPreflight(
  req: IncomingMessage,
  res: ServerResponse,
  corsConfig?: CorsConfig
): boolean {
  if (req.method === 'OPTIONS') {
    const reqOrigin = req.headers.origin as string | undefined
    const allowedOrigin = resolveCorsOrigin(reqOrigin, corsConfig)

    const headers: Record<string, string> = {
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'SAMEORIGIN',
      'Referrer-Policy': 'strict-origin-when-cross-origin'
    }

    if (process.env.NODE_ENV === 'production') {
      headers['Strict-Transport-Security'] = 'max-age=31536000; includeSubDomains'
    }

    if (allowedOrigin) {
      headers['Access-Control-Allow-Origin'] = allowedOrigin
      if (allowedOrigin !== '*') {
        headers['Vary'] = 'Origin'
        if (corsConfig?.allowCredentials !== false) {
          headers['Access-Control-Allow-Credentials'] = 'true'
        }
      }
      headers['Access-Control-Allow-Methods'] = 'OPTIONS, POST, GET, PUT, DELETE, PATCH'
      headers['Access-Control-Allow-Headers'] =
        (req.headers['access-control-request-headers'] as string) ||
        'Content-Type, Authorization, X-Requested-With, Accept, Origin, Cache-Control, Last-Event-ID'
      headers['Access-Control-Max-Age'] = '86400'
    }

    res.writeHead(204, headers)
    res.end()
    return true
  }
  return false
}

/**
 * Parse URL and query parameters
 */
export function parseUrl(req: IncomingMessage): { pathname: string; searchParams: URLSearchParams } {
  const url = new URL(req.url || '', `http://${req.headers.host || 'localhost'}`)
  return {
    pathname: url.pathname,
    searchParams: url.searchParams
  }
}
