import { createHash } from 'node:crypto'
import type { HttpHandler } from './router.js'
import { sendJson, resolveCorsOrigin, getCorsConfig, getSecurityHeaders } from './utils/http.js'

export interface ProxyOptions {
  targetUrl: string
  method?: string
  cache?: string
  query?: string[]
  headers?: Record<string, string>
  apiKey?: string
  timeoutMs?: number
}

function parseCacheMs(cache?: string): number {
  if (!cache) return 0
  const match = cache.match(/^(\d+)([smhd])$/)
  if (!match) return 0
  const value = parseInt(match[1] as string)
  const unit = match[2] as string
  const multipliers: Record<string, number> = { s: 1000, m: 60000, h: 3600000, d: 86400000 }
  return value * (multipliers[unit] ?? 60000)
}

function buildTargetUrl(base: string, reqUrl: string, query?: string[], apiKey?: string): string {
  try {
    const url = new URL(base)
    if (apiKey && !url.searchParams.has('api_key')) {
      url.searchParams.set('api_key', apiKey)
    }
    const reqParsed = new URL(reqUrl, 'http://localhost')
    if (query && query.length > 0) {
      for (const key of query) {
        const value = reqParsed.searchParams.get(key)
        if (value) {
          url.searchParams.set(key, value)
        }
      }
    }
    return url.toString()
  } catch {
    return base
  }
}

export class ExternalCache {
  private store = new Map<string, { data: any; contentType?: string; expiresAt: number }>()

  get(key: string) {
    const entry = this.store.get(key)
    if (!entry) return null
    if (Date.now() > entry.expiresAt) {
      this.store.delete(key)
      return null
    }
    return entry
  }

  set(key: string, data: any, ttlMs: number, contentType?: string) {
    this.store.set(key, { data, contentType, expiresAt: Date.now() + ttlMs })
  }

  getStale(key: string) {
    const entry = this.store.get(key)
    if (!entry) return null
    return entry
  }

  keys() {
    return Array.from(this.store.keys())
  }
}

export function createProxyHandler(opts: ProxyOptions): HttpHandler {
  const cacheMs = parseCacheMs(opts.cache)
  const cache = new ExternalCache()
  const timeoutMs = opts.timeoutMs ?? 12000

  return async (req, res) => {
    const corsConfig = getCorsConfig()
    const reqOrigin = req.headers.origin as string | undefined
    const allowedOrigin = resolveCorsOrigin(reqOrigin, corsConfig)

    const corsHeaders: Record<string, string> = {
      ...getSecurityHeaders(),
    }
    if (allowedOrigin) {
      corsHeaders['Access-Control-Allow-Origin'] = allowedOrigin
      if (allowedOrigin !== '*') {
        corsHeaders['Vary'] = 'Origin'
        if (corsConfig?.allowCredentials !== false) {
          corsHeaders['Access-Control-Allow-Credentials'] = 'true'
        }
      }
      corsHeaders['Access-Control-Allow-Methods'] = 'OPTIONS, POST, GET, PUT, DELETE, PATCH'
      corsHeaders['Access-Control-Allow-Headers'] =
        (req.headers['access-control-request-headers'] as string) ||
        'Content-Type, Authorization, X-Requested-With, Accept, Origin'
    }

    // Handle preflight
    if (req.method === 'OPTIONS') {
      res.writeHead(204, corsHeaders)
      res.end()
      return
    }

    const method = (req.method || opts.method || 'GET').toUpperCase()
    const rawBody = (req as any).__moonBody ?? (req as any).body
    let bodyPayload: string | undefined

    if (rawBody !== undefined && rawBody !== null && ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
      bodyPayload = typeof rawBody === 'string' ? rawBody : JSON.stringify(rawBody)
    }

    // Build unique cache key (for POST/PUT, factor in body hash)
    let cacheKey = `${method}:${req.url}`
    if (bodyPayload) {
      const hash = createHash('sha256').update(bodyPayload).digest('hex').slice(0, 16)
      cacheKey += `:${hash}`
    }

    if (cacheMs > 0) {
      const cached = cache.get(cacheKey)
      if (cached) {
        const ct = cached.contentType || 'application/json'
        res.writeHead(200, { 'Content-Type': ct, 'X-Cache': 'HIT', ...corsHeaders })
        res.end(typeof cached.data === 'string' ? cached.data : JSON.stringify(cached.data))
        return
      }
    }

    const targetUrl = buildTargetUrl(opts.targetUrl, req.url as string, opts.query, opts.apiKey)

    const headers: Record<string, string> = {
      'Accept': 'application/json, text/xml, application/xml, text/plain, */*',
      'User-Agent': 'Moonwitness-Proxy/1.0',
      ...(opts.headers || {}),
    }

    if (bodyPayload && !headers['Content-Type'] && !headers['content-type']) {
      headers['Content-Type'] = 'application/json'
    }

    // Forward incoming Authorization header if present
    if (req.headers.authorization && !headers['Authorization'] && !headers['authorization']) {
      headers['Authorization'] = req.headers.authorization
    }

    try {
      const controller = new AbortController()
      const timer = setTimeout(() => controller.abort(), timeoutMs)

      let upstream: Response
      try {
        upstream = await fetch(targetUrl, {
          method,
          headers,
          body: bodyPayload,
          signal: controller.signal,
        })
      } finally {
        clearTimeout(timer)
      }

      if (upstream.status === 429) {
        if (cacheMs > 0) {
          const stale = cache.getStale(cacheKey)
          if (stale) {
            const ct = stale.contentType || 'application/json'
            res.writeHead(200, { 'Content-Type': ct, 'X-Cache': 'STALE', ...corsHeaders })
            res.end(typeof stale.data === 'string' ? stale.data : JSON.stringify(stale.data))
            return
          }
        }
        res.writeHead(429, { 'Content-Type': 'application/json', ...corsHeaders })
        res.end(JSON.stringify({ error: 'Upstream rate limited', upstreamStatus: 429 }))
        return
      }

      if (!upstream.ok) {
        const text = await upstream.text()
        res.writeHead(upstream.status, { 'Content-Type': 'application/json', ...corsHeaders })
        res.end(JSON.stringify({ error: 'Upstream error', status: upstream.status, body: text }))
        return
      }

      const responseContentType = upstream.headers.get('content-type') || ''
      const isJson = responseContentType.includes('application/json')

      if (isJson) {
        const data = await upstream.json()
        if (cacheMs > 0) {
          cache.set(cacheKey, data, cacheMs, 'application/json')
        }
        res.writeHead(200, { 'Content-Type': 'application/json', 'X-Cache': 'MISS', ...corsHeaders })
        res.end(JSON.stringify(data))
      } else {
        // Handle XML/RSS/Plaintext safely (e.g. Google Trends RSS feed)
        const textData = await upstream.text()
        if (cacheMs > 0) {
          cache.set(cacheKey, textData, cacheMs, responseContentType || 'text/plain')
        }
        res.writeHead(200, { 'Content-Type': responseContentType || 'text/plain', 'X-Cache': 'MISS', ...corsHeaders })
        res.end(textData)
      }
    } catch (err: any) {
      if (cacheMs > 0) {
        const stale = cache.getStale(cacheKey)
        if (stale) {
          const ct = stale.contentType || 'application/json'
          res.writeHead(200, { 'Content-Type': ct, 'X-Cache': 'STALE', ...corsHeaders })
          res.end(typeof stale.data === 'string' ? stale.data : JSON.stringify(stale.data))
          return
        }
      }
      const isAbort = err?.name === 'AbortError'
      const statusCode = isAbort ? 504 : 502
      const errorLabel = isAbort ? 'Proxy upstream timed out' : 'Proxy fetch failed'

      res.writeHead(statusCode, { 'Content-Type': 'application/json', ...corsHeaders })
      res.end(JSON.stringify({ error: errorLabel, message: err?.message || String(err), statusCode }))
    }
  }
}
