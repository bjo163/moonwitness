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
    super(maxBytes ? `${message} (max allowed: ${maxBytes} bytes)` : message, 413, 'PAYLOAD_TOO_LARGE')
    this.name = 'PayloadTooLargeError'
  }
}

export class InvalidJsonError extends HttpError {
  constructor(message = 'Invalid JSON body') {
    super(message, 400, 'INVALID_JSON')
    this.name = 'InvalidJsonError'
  }
}

export class UnsupportedMediaTypeError extends HttpError {
  constructor(message = 'Content-Type must be application/json') {
    super(message, 415, 'UNSUPPORTED_MEDIA_TYPE')
    this.name = 'UnsupportedMediaTypeError'
  }
}

export interface ParseBodyOptions {
  maxBytes?: number
}

const DEFAULT_MAX_BODY_BYTES = 1024 * 1024
export const DEFAULT_CORS_METHODS = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'] as const
export const DEFAULT_CORS_HEADERS = ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin', 'Cache-Control', 'Last-Event-ID'] as const
const DEVELOPMENT_ORIGINS = [
  'http://localhost:3000',
  'http://localhost:3001',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:3001'
]

export async function parseBody(req: IncomingMessage, options: ParseBodyOptions = {}): Promise<any> {
  const maxBytes = options.maxBytes ?? DEFAULT_MAX_BODY_BYTES
  const contentType = String(req.headers?.['content-type'] || '').split(';', 1)[0]!.trim().toLowerCase()
  if (contentType && contentType !== 'application/json' && contentType !== 'application/problem+json') {
    throw new UnsupportedMediaTypeError()
  }

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
      if (!body || body.trim() === '') return resolve({})
      try {
        resolve(JSON.parse(body))
      } catch {
        reject(new InvalidJsonError())
      }
    })
    req.on('error', reject)
  })
}

export interface CorsConfig {
  allowedOrigins?: string[] | ((origin: string) => boolean)
  allowedMethods?: string[]
  allowedHeaders?: string[]
  allowCredentials?: boolean
}

function configuredOrigins(config?: CorsConfig): CorsConfig['allowedOrigins'] {
  if (config?.allowedOrigins) return config.allowedOrigins
  return process.env.NODE_ENV === 'production' ? [] : DEVELOPMENT_ORIGINS
}

export function resolveCorsOrigin(origin: string | undefined, config?: CorsConfig): string | null {
  if (!origin) return null
  const allowedOrigins = configuredOrigins(config)
  if (typeof allowedOrigins === 'function') return allowedOrigins(origin) ? origin : null
  if (!allowedOrigins || allowedOrigins.length === 0) return null
  if (allowedOrigins.includes('*')) return '*'
  return allowedOrigins.includes(origin) ? origin : null
}

function requestedHeadersAreAllowed(req: IncomingMessage, config?: CorsConfig): boolean {
  const requested = String(req.headers['access-control-request-headers'] || '')
    .split(',')
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean)
  const allowed = new Set((config?.allowedHeaders || [...DEFAULT_CORS_HEADERS]).map((value) => value.toLowerCase()))
  return requested.every((value) => allowed.has(value))
}

function requestedMethodIsAllowed(req: IncomingMessage, config?: CorsConfig): boolean {
  const requested = String(req.headers['access-control-request-method'] || '').trim().toUpperCase()
  if (!requested) return true
  return (config?.allowedMethods || [...DEFAULT_CORS_METHODS]).map((value) => value.toUpperCase()).includes(requested)
}

function corsHeaders(origin: string, config?: CorsConfig): Record<string, string> {
  const headers: Record<string, string> = {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': (config?.allowedMethods || [...DEFAULT_CORS_METHODS]).join(', '),
    'Access-Control-Allow-Headers': (config?.allowedHeaders || [...DEFAULT_CORS_HEADERS]).join(', ')
  }
  if (origin !== '*') {
    headers['Vary'] = 'Origin'
    if (config?.allowCredentials !== false) headers['Access-Control-Allow-Credentials'] = 'true'
  }
  return headers
}

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
  if (allowedOrigin) Object.assign(headers, corsHeaders(allowedOrigin, corsConfig))
  res.writeHead(statusCode, headers)
  res.end(JSON.stringify(data))
}

export function handleCorsPreflight(req: IncomingMessage, res: ServerResponse, corsConfig?: CorsConfig): boolean {
  if (req.method !== 'OPTIONS') return false

  const allowedOrigin = resolveCorsOrigin(req.headers.origin as string | undefined, corsConfig)
  const baseHeaders: Record<string, string> = {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'SAMEORIGIN',
    'Referrer-Policy': 'strict-origin-when-cross-origin'
  }
  if (process.env.NODE_ENV === 'production') {
    baseHeaders['Strict-Transport-Security'] = 'max-age=31536000; includeSubDomains'
  }

  if (!allowedOrigin || !requestedMethodIsAllowed(req, corsConfig) || !requestedHeadersAreAllowed(req, corsConfig)) {
    res.writeHead(403, baseHeaders)
    res.end()
    return true
  }

  res.writeHead(204, {
    ...baseHeaders,
    ...corsHeaders(allowedOrigin, corsConfig),
    'Access-Control-Max-Age': '86400'
  })
  res.end()
  return true
}

export function parseUrl(req: IncomingMessage): { pathname: string; searchParams: URLSearchParams } {
  const url = new URL(req.url || '', `http://${req.headers.host || 'localhost'}`)
  return { pathname: url.pathname, searchParams: url.searchParams }
}
