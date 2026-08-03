import { HttpHandler } from './router.js'

export interface ProxyOptions {
  targetUrl: string
  cache?: string
  query?: string[]
  headers?: Record<string, string>
  apiKey?: string
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
  private store = new Map<string, { data: any; expiresAt: number }>()

  get(key: string) {
    const entry = this.store.get(key)
    if (!entry) return null
    if (Date.now() > entry.expiresAt) {
      this.store.delete(key)
      return null
    }
    return entry.data
  }

  set(key: string, data: any, ttlMs: number) {
    this.store.set(key, { data, expiresAt: Date.now() + ttlMs })
  }

  getStale(key: string) {
    const entry = this.store.get(key)
    if (!entry) return null
    return entry.data
  }

  keys() {
    return Array.from(this.store.keys())
  }
}

export function createProxyHandler(opts: ProxyOptions): HttpHandler {
  const cacheMs = parseCacheMs(opts.cache)
  const cache = new ExternalCache()

  return async (req, res) => {
    // Add CORS headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    }

    // Handle preflight
    if (req.method === 'OPTIONS') {
      res.writeHead(204, corsHeaders)
      res.end()
      return
    }

    const cacheKey = req.url as string
    if (cacheMs > 0) {
      const cached = cache.get(cacheKey)
      if (cached) {
        res.writeHead(200, { 'Content-Type': 'application/json', 'X-Cache': 'HIT', ...corsHeaders })
        res.end(JSON.stringify(cached))
        return
      }
    }

    const targetUrl = buildTargetUrl(opts.targetUrl, req.url as string, opts.query, opts.apiKey)

    try {
      const upstream = await fetch(targetUrl, {
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'Moonwitness-Proxy/1.0',
          ...(opts.headers || {})
        }
      })

      if (upstream.status === 429) {
        if (cacheMs > 0) {
          const stale = cache.getStale(cacheKey)
          if (stale) {
            res.writeHead(200, { 'Content-Type': 'application/json', 'X-Cache': 'STALE', ...corsHeaders })
            res.end(JSON.stringify(stale))
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

      const data = await upstream.json()
      if (cacheMs > 0) {
        cache.set(cacheKey, data, cacheMs)
      }
      res.writeHead(200, { 'Content-Type': 'application/json', 'X-Cache': 'MISS', ...corsHeaders })
      res.end(JSON.stringify(data))
    } catch (err: any) {
      if (cacheMs > 0) {
        const stale = cache.getStale(cacheKey)
        if (stale) {
          res.writeHead(200, { 'Content-Type': 'application/json', 'X-Cache': 'STALE', ...corsHeaders })
          res.end(JSON.stringify(stale))
          return
        }
      }
      res.writeHead(502, { 'Content-Type': 'application/json', ...corsHeaders })
      res.end(JSON.stringify({ error: 'Proxy fetch failed', message: err.message }))
    }
  }
}
