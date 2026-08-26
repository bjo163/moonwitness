import { describe, it, expect, vi } from 'vitest'
import { EventEmitter } from 'node:events'
import type { IncomingMessage, ServerResponse } from 'node:http'
import {
  parseBody,
  sendJson,
  resolveCorsOrigin,
  handleCorsPreflight,
  PayloadTooLargeError,
  InvalidJsonError
} from '../src/utils/http.js'
import { corsMiddleware } from '../src/middleware/cors.js'

function createMockReq(dataChunks: (string | Buffer)[], headers: Record<string, string> = {}): IncomingMessage {
  const emitter = new EventEmitter() as any
  emitter.headers = headers
  emitter.destroy = () => {}

  process.nextTick(() => {
    for (const chunk of dataChunks) {
      emitter.emit('data', chunk)
    }
    emitter.emit('end')
  })

  return emitter
}

function createMockRes(): { res: ServerResponse; getHeaders: () => Record<string, any>; getBody: () => string; getStatus: () => number } {
  let statusCode = 200
  const headers: Record<string, any> = {}
  let body = ''

  const res = {
    headersSent: false,
    setHeader: (name: string, value: string) => {
      headers[name] = value
    },
    writeHead: (code: number, hdrs?: any) => {
      statusCode = code
      if (hdrs) Object.assign(headers, hdrs)
    },
    end: (data: string) => {
      if (data) body += data
    }
  } as any

  return {
    res,
    getStatus: () => statusCode,
    getHeaders: () => headers,
    getBody: () => body
  }
}

describe('HTTP Security & Request Boundaries (#16)', () => {
  describe('JSON Body Parsing & Size Limits', () => {
    it('parses valid small JSON body successfully', async () => {
      const req = createMockReq(['{"name": "MoonWitness", "active": true}'])
      const parsed = await parseBody(req)
      expect(parsed).toEqual({ name: 'MoonWitness', active: true })
    })

    it('rejects payloads exceeding maxBytes with PayloadTooLargeError (413)', async () => {
      const largeString = 'a'.repeat(200)
      const req = createMockReq([JSON.stringify({ text: largeString })])

      await expect(parseBody(req, { maxBytes: 50 }))
        .rejects
        .toThrow(PayloadTooLargeError)
    })

    it('rejects malformed JSON with InvalidJsonError (400)', async () => {
      const req = createMockReq(['{ invalid json payload ... '])

      await expect(parseBody(req))
        .rejects
        .toThrow(InvalidJsonError)
    })
  })

  describe('CORS Resolution & Security Headers', () => {
    it('applies standard security headers (X-Content-Type-Options, X-Frame-Options, Referrer-Policy)', () => {
      const { res, getHeaders, getStatus } = createMockRes()
      sendJson(res, 200, { ok: true })

      expect(getStatus()).toBe(200)
      expect(getHeaders()['X-Content-Type-Options']).toBe('nosniff')
      expect(getHeaders()['X-Frame-Options']).toBe('SAMEORIGIN')
      expect(getHeaders()['Referrer-Policy']).toBe('strict-origin-when-cross-origin')
    })

    it('whitelists allowed origins and omits disallowed origins', () => {
      const allowed = resolveCorsOrigin('https://app.moonwitness.org', {
        allowedOrigins: ['https://app.moonwitness.org', 'http://localhost:3000']
      })
      expect(allowed).toBe('https://app.moonwitness.org')

      const disallowed = resolveCorsOrigin('https://evil-attacker.com', {
        allowedOrigins: ['https://app.moonwitness.org']
      })
      expect(disallowed).toBeNull()
    })

    it('handles CORS OPTIONS preflight with 204 No Content and credentials for specific origin', () => {
      const { res, getHeaders, getStatus } = createMockRes()
      const req = {
        method: 'OPTIONS',
        headers: {
          origin: 'https://app.moonwitness.org',
          'access-control-request-headers': 'Authorization, Content-Type'
        }
      } as any

      const handled = handleCorsPreflight(req, res, {
        allowedOrigins: ['https://app.moonwitness.org']
      })

      expect(handled).toBe(true)
      expect(getStatus()).toBe(204)
      expect(getHeaders()['Access-Control-Allow-Origin']).toBe('https://app.moonwitness.org')
      expect(getHeaders()['Access-Control-Allow-Credentials']).toBe('true')
      expect(getHeaders()['Vary']).toBe('Origin')
    })

    it('does not set Access-Control-Allow-Credentials when wildcard origin * is used', () => {
      const { res, getHeaders, getStatus } = createMockRes()
      const req = {
        method: 'OPTIONS',
        headers: {
          origin: 'https://any-domain.com',
        }
      } as any

      const handled = handleCorsPreflight(req, res, {
        allowedOrigins: ['*']
      })

      expect(handled).toBe(true)
      expect(getStatus()).toBe(204)
      expect(getHeaders()['Access-Control-Allow-Origin']).toBe('*')
      expect(getHeaders()['Access-Control-Allow-Credentials']).toBeUndefined()
    })

    it('includes HSTS header when NODE_ENV is production', () => {
      const originalEnv = process.env.NODE_ENV
      process.env.NODE_ENV = 'production'
      try {
        const { res, getHeaders } = createMockRes()
        sendJson(res, 200, { ok: true })
        expect(getHeaders()['Strict-Transport-Security']).toBe('max-age=31536000; includeSubDomains')
      } finally {
        process.env.NODE_ENV = originalEnv
      }
    })
  })

  describe('CORS Middleware Integration', () => {
    it('sets CORS and security headers and calls next() on standard requests', async () => {
      const { res, getHeaders } = createMockRes()
      const req: any = {
        method: 'GET',
        headers: { origin: 'https://app.moonwitness.org' }
      }
      const next = vi.fn().mockResolvedValue(undefined)

      const mw = corsMiddleware({ allowedOrigins: ['https://app.moonwitness.org'] })
      await mw(req, res, next)

      expect(getHeaders()['Access-Control-Allow-Origin']).toBe('https://app.moonwitness.org')
      expect(getHeaders()['Access-Control-Allow-Credentials']).toBe('true')
      expect(getHeaders()['X-Content-Type-Options']).toBe('nosniff')
      expect(next).toHaveBeenCalledTimes(1)
    })

    it('handles OPTIONS preflight in corsMiddleware directly with 204 and ends response', async () => {
      const { res, getHeaders, getStatus } = createMockRes()
      const req: any = {
        method: 'OPTIONS',
        headers: {
          origin: 'https://app.moonwitness.org',
          'access-control-request-headers': 'Authorization'
        }
      }
      const next = vi.fn()

      const mw = corsMiddleware({ allowedOrigins: ['https://app.moonwitness.org'] })
      await mw(req, res, next)

      expect(getStatus()).toBe(204)
      expect(getHeaders()['Access-Control-Allow-Origin']).toBe('https://app.moonwitness.org')
      expect(next).not.toHaveBeenCalled()
    })
  })
})
