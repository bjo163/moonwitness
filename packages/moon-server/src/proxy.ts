import { createHash } from 'node:crypto'
import type { HttpHandler } from './router.js'
import { sendJson, resolveCorsOrigin, getCorsConfig, getSecurityHeaders } from './utils/http.js'

export interface UpstreamCredential {
  headerName?: string
  scheme?: string
  queryParam?: string
  value: string
}

export interface ProxyOptions {
  targetUrl: string
  method?: string
  cache?: string
  query?: string[]
  headers?: Record<string, string>
  apiKey?: string
  timeoutMs?: number
  upstream?: string
  credential?: UpstreamCredential
  cacheMaxEntries?: number
  cacheSweepIntervalMs?: number
}

const upstreamCredentialRegistry = new Map<string, UpstreamCredential>()

export function setUpstreamCredential(upstream: string, credential: UpstreamCredential | null): void {
  if (credential === null) upstreamCredentialRegistry.delete(upstream)
  else upstreamCredentialRegistry.set(upstream, credential)
}

export function getUpstreamCredential(upstream: string): UpstreamCredential | undefined {
  return upstreamCredentialRegistry.get(upstream)
}

export function configureUpstreamCredentials(credentials: Record<string, UpstreamCredential>): void {
  for (const [name, credential] of Object.entries(credentials)) {
    upstreamCredentialRegistry.set(name, credential)
  }
}

export function clearUpstreamCredentials(): void {
  upstreamCredentialRegistry.clear()
}

function resolveCredential(opts: ProxyOptions): UpstreamCredential | undefined {
  if (opts.credential) return opts.credential
  if (opts.upstream) return getUpstreamCredential(opts.upstream)
  return undefined
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

function buildTargetUrl(
  base: string,
  reqUrl: string,
  query?: string[],
  apiKey?: string,
  credential?: UpstreamCredential
): string {
  try {
    const url = new URL(base)
    if (credential?.queryParam) {
      if (!url.searchParams.has(credential.queryParam)) {
        url.searchParams.set(credential.queryParam, credential.value)
      }
    } else if (apiKey && !url.searchParams.has('api_key')) {
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

function buildCacheKey(method: string, reqUrl: string, query?: string[], bodyPayload?: string): string {
  let pathname = reqUrl
  let normalizedQuery = ''
  try {
    const parsed = new URL(reqUrl, 'http://localhost')
    pathname = parsed.pathname
    const params = new URLSearchParams()
    for (const key of [...(query ?? [])].sort()) {
      const value = parsed.searchParams.get(key)
      if (value !== null) params.set(key, value)
    }
    normalizedQuery = params.toString()
  } catch {
    pathname = reqUrl
  }
  let key = `${method}:${pathname}${normalizedQuery ? `?${normalizedQuery}` : ''}`
  if (bodyPayload) {
    const hash = createHash('sha256').update(bodyPayload).digest('hex').slice(0, 16)
    key += `:${hash}`
  }
  return key
}

const ALLOWED_RESPONSE_CONTENT_TYPES = new Set(['application/json', 'text/xml', 'text/plain'])

function normalizeResponseContentType(raw: string): string {
  const mediaType = (raw.split(';')[0] ?? '').trim().toLowerCase()
  return ALLOWED_RESPONSE_CONTENT_TYPES.has(mediaType) ? mediaType : 'text/plain'
}

export interface ExternalCacheOptions {
  maxEntries?: number
  sweepIntervalMs?: number
}

const DEFAULT_MAX_ENTRIES = 1000
const DEFAULT_SWEEP_INTERVAL_MS = 60000

interface CacheEntry {
  data: any
  contentType?: string
  expiresAt: number
}

export class ExternalCache {
  private store = new Map<string, CacheEntry>()
  private maxEntries: number
  private sweepTimer?: ReturnType<typeof setInterval>

  constructor(options: ExternalCacheOptions = {}) {
    this.maxEntries = Math.max(1, options.maxEntries ?? DEFAULT_MAX_ENTRIES)
    const interval = options.sweepIntervalMs ?? DEFAULT_SWEEP_INTERVAL_MS
    if (interval > 0) {
      this.sweepTimer = setInterval(() => this.sweep(), interval)
      this.sweepTimer.unref()
    }
  }

  get size(): number {
    return this.store.size
  }

  get(key: string) {
    const entry = this.store.get(key)
    if (!entry) return null
    if (Date.now() > entry.expiresAt) {
      this.store.delete(key)
      return null
    }
    this.store.delete(key)
    this.store.set(key, entry)
    return entry
  }

  set(key: string, data: any, ttlMs: number, contentType?: string) {
    if (this.store.has(key)) this.store.delete(key)
    this.store.set(key, { data, contentType, expiresAt: Date.now() + ttlMs })
    while (this.store.size > this.maxEntries) {
      const oldest = this.store.keys().next().value
      if (oldest === undefined) break
      this.store.delete(oldest)
    }
  }

  getStale(key: string) {
    return this.store.get(key) ?? null
  }

  sweep(): number {
    const now = Date.now()
    let removed = 0
    for (const [key, entry] of this.store) {
      if (now > entry.expiresAt) {
        this.store.delete(key)
        removed++
      }
    }
    return removed
  }

  keys() {
    return Array.from(this.store.keys())
  }

  dispose(): void {
    if (this.sweepTimer) {
      clearInterval(this.sweepTimer)
      this.sweepTimer = undefined
    }
  }
}

export function createProxyHandler(opts: ProxyOptions): HttpHandler {
  const cacheMs = parseCacheMs(opts.cache)
  const cache = new ExternalCache({
    maxEntries: opts.cacheMaxEntries,
    sweepIntervalMs: opts.cacheSweepIntervalMs,
  })
  const timeoutMs = opts.timeoutMs ?? 12000
  const credential = resolveCredential(opts)

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

    const cacheKey = buildCacheKey(method, req.url as string, opts.query, bodyPayload)

    if (cacheMs > 0) {
      const cached = cache.get(cacheKey)
      if (cached) {
        const ct = cached.contentType || 'application/json'
        res.writeHead(200, { 'Content-Type': ct, 'X-Cache': 'HIT', ...corsHeaders })
        res.end(typeof cached.data === 'string' ? cached.data : JSON.stringify(cached.data))
        return
      }
    }

    const targetUrl = buildTargetUrl(opts.targetUrl, req.url as string, opts.query, opts.apiKey, credential)

    // Outbound headers are built solely from server-side configuration; client
    // credentials (Authorization, Cookie, Proxy-Authorization) must never reach
    // a third-party upstream, so no client header is merged here.
    const headers: Record<string, string> = {
      'Accept': 'application/json, text/xml, application/xml, text/plain, */*',
      'User-Agent': 'Moonwitness-Proxy/1.0',
      ...(opts.headers || {}),
    }

    if (credential?.headerName) {
      headers[credential.headerName] = credential.scheme
        ? `${credential.scheme} ${credential.value}`
        : credential.value
    }

    if (bodyPayload && !headers['Content-Type'] && !headers['content-type']) {
      headers['Content-Type'] = 'application/json'
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
      const mediaType = (responseContentType.split(';')[0] ?? '').trim().toLowerCase()
      const safeContentType = normalizeResponseContentType(responseContentType)

      if (mediaType === 'application/json') {
        const data = await upstream.json()
        if (cacheMs > 0) {
          cache.set(cacheKey, data, cacheMs, 'application/json')
        }
        res.writeHead(200, { 'Content-Type': 'application/json', 'X-Cache': 'MISS', ...corsHeaders })
        res.end(JSON.stringify(data))
      } else {
        const textData = await upstream.text()
        if (cacheMs > 0) {
          cache.set(cacheKey, textData, cacheMs, safeContentType)
        }
        res.writeHead(200, { 'Content-Type': safeContentType, 'X-Cache': 'MISS', ...corsHeaders })
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
