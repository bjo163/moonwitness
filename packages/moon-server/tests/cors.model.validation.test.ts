import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

vi.mock('jsonwebtoken', () => ({
  default: {
    sign: vi.fn(() => 'mock-token'),
    verify: vi.fn(() => { throw new Error('not implemented') }),
  }
}))

vi.mock('knex', () => ({
  default: vi.fn(() => ({
    raw: vi.fn(),
    on: vi.fn(),
    transaction: vi.fn(),
    destroy: vi.fn(),
  }))
}))

import type { IncomingMessage, ServerResponse } from 'node:http'
import {
  setCorsConfig,
  getCorsConfig,
  getSecurityHeaders,
  SECURITY_HEADERS
} from '../src/utils/http.ts'

function createMockReq(method: string, url: string, headers: Record<string, string> = {}): IncomingMessage {
  const listeners: Record<string, Function[]> = {}
  const req: any = {
    method,
    url,
    headers,
    on: (event: string, cb: Function) => {
      if (!listeners[event]) listeners[event] = []
      listeners[event].push(cb)
      return req
    },
    removeListener: vi.fn(),
    destroy: vi.fn(),
    _emit: (event: string, ...args: any[]) => {
      (listeners[event] || []).forEach(cb => cb(...args))
    }
  }
  return req
}

function createMockRes(): { res: ServerResponse; getHeaders: () => Record<string, any>; getBody: () => string; getStatus: () => number } {
  let statusCode = 200
  const headers: Record<string, any> = {}
  let body = ''

  const res = {
    headersSent: false,
    writableEnded: false,
    setHeader: (name: string, value: string) => {
      headers[name] = value
    },
    writeHead: (code: number, hdrs?: any) => {
      statusCode = code
      if (hdrs) Object.assign(headers, hdrs)
    },
    end: (data: string) => {
      if (data) body += data
      res.writableEnded = true
    }
  } as any

  return {
    res,
    getStatus: () => statusCode,
    getHeaders: () => headers,
    getBody: () => (body ? JSON.parse(body) : null)
  }
}

describe('CORS Configuration & Security Headers (#16)', () => {
  afterEach(() => {
    setCorsConfig({})
    delete process.env.NODE_ENV
  })

  describe('getSecurityHeaders', () => {
    it('returns base security headers without HSTS', () => {
      delete process.env.NODE_ENV
      const headers = getSecurityHeaders()
      expect(headers['X-Content-Type-Options']).toBe('nosniff')
      expect(headers['X-Frame-Options']).toBe('SAMEORIGIN')
      expect(headers['Referrer-Policy']).toBe('strict-origin-when-cross-origin')
      expect(headers['Strict-Transport-Security']).toBeUndefined()
    })

    it('includes HSTS header when NODE_ENV is production', () => {
      process.env.NODE_ENV = 'production'
      const headers = getSecurityHeaders()
      expect(headers['Strict-Transport-Security']).toBe('max-age=31536000; includeSubDomains')
    })
  })

  describe('setCorsConfig / getCorsConfig', () => {
    it('defaults to empty config', () => {
      expect(getCorsConfig()).toEqual({})
    })

    it('stores and retrieves CORS config', () => {
      const config = { allowedOrigins: ['https://example.com'] }
      setCorsConfig(config)
      expect(getCorsConfig()).toEqual(config)
    })
  })
})

describe('defineRoute CORS Integration (#16)', () => {
  afterEach(async () => {
    setCorsConfig({})
    const { globalRoutes } = await import('../src/router.ts')
    globalRoutes.length = 0
  })

  it('respects configured CORS whitelist - allows matching origin', async () => {
    setCorsConfig({ allowedOrigins: ['https://app.moonwitness.org'] })
    const { defineRoute } = await import('../src/route-builder.ts')

    defineRoute({
      method: 'GET',
      path: '/test/allowed',
      handler: async () => ({ success: true })
    })

    const { globalRoutes } = await import('../src/router.ts')
    const route = globalRoutes.find(r => r.path === '/test/allowed')
    expect(route).toBeDefined()

    const req = createMockReq('GET', '/test/allowed', { origin: 'https://app.moonwitness.org' })
    const { res, getHeaders, getBody } = createMockRes()

    await route!.handler(req, res)

    expect(getHeaders()['Access-Control-Allow-Origin']).toBe('https://app.moonwitness.org')
    expect(getHeaders()['Vary']).toBe('Origin')
    expect(getHeaders()['Access-Control-Allow-Credentials']).toBe('true')
    expect(getBody()).toEqual({ success: true })
  })

  it('respects configured CORS whitelist - blocks non-matching origin', async () => {
    setCorsConfig({ allowedOrigins: ['https://app.moonwitness.org'] })
    const { defineRoute } = await import('../src/route-builder.ts')

    defineRoute({
      method: 'GET',
      path: '/test/blocked',
      handler: async () => ({ success: true })
    })

    const { globalRoutes } = await import('../src/router.ts')
    const route = globalRoutes.find(r => r.path === '/test/blocked')

    const req = createMockReq('GET', '/test/blocked', { origin: 'https://evil.com' })
    const { res, getHeaders } = createMockRes()

    await route!.handler(req, res)

    expect(getHeaders()['Access-Control-Allow-Origin']).toBeUndefined()
  })

  it('supports wildcard CORS origin', async () => {
    setCorsConfig({ allowedOrigins: ['*'] })
    const { defineRoute } = await import('../src/route-builder.ts')

    defineRoute({
      method: 'GET',
      path: '/test/wildcard',
      handler: async () => ({ success: true })
    })

    const { globalRoutes } = await import('../src/router.ts')
    const route = globalRoutes.find(r => r.path === '/test/wildcard')

    const req = createMockReq('GET', '/test/wildcard', { origin: 'https://any-origin.com' })
    const { res, getHeaders } = createMockRes()

    await route!.handler(req, res)

    expect(getHeaders()['Access-Control-Allow-Origin']).toBe('*')
    expect(getHeaders()['Vary']).toBeUndefined()
    expect(getHeaders()['Access-Control-Allow-Credentials']).toBeUndefined()
  })

  it('applies security headers on all response paths', async () => {
    setCorsConfig({ allowedOrigins: ['https://app.moonwitness.org'] })
    const { defineRoute } = await import('../src/route-builder.ts')

    defineRoute({
      method: 'GET',
      path: '/test/security',
      handler: async () => ({ success: true })
    })

    const { globalRoutes } = await import('../src/router.ts')
    const route = globalRoutes.find(r => r.path === '/test/security')

    const req = createMockReq('GET', '/test/security', { origin: 'https://app.moonwitness.org' })
    const { res, getHeaders } = createMockRes()

    await route!.handler(req, res)

    expect(getHeaders()['X-Content-Type-Options']).toBe('nosniff')
    expect(getHeaders()['X-Frame-Options']).toBe('SAMEORIGIN')
    expect(getHeaders()['Referrer-Policy']).toBe('strict-origin-when-cross-origin')
    expect(getHeaders()['Content-Type']).toBe('application/json')
  })

  it('applies security headers on error responses', async () => {
    setCorsConfig({ allowedOrigins: ['https://app.moonwitness.org'] })
    const { defineRoute } = await import('../src/route-builder.ts')

    defineRoute({
      method: 'GET',
      path: '/test/error',
      handler: async () => { throw new Error('Test error') }
    })

    const { globalRoutes } = await import('../src/router.ts')
    const route = globalRoutes.find(r => r.path === '/test/error')

    const req = createMockReq('GET', '/test/error', { origin: 'https://app.moonwitness.org' })
    const { res, getHeaders, getStatus, getBody } = createMockRes()

    await route!.handler(req, res)

    expect(getStatus()).toBe(500)
    expect(getHeaders()['X-Content-Type-Options']).toBe('nosniff')
    expect(getHeaders()['Access-Control-Allow-Origin']).toBe('https://app.moonwitness.org')
    expect(getBody().code).toBe('INTERNAL_ERROR')
  })

})

describe('REST Handler Model Name Validation (#16)', () => {
  it('rejects invalid model names with 400 INVALID_MODEL', async () => {
    const { handleRest } = await import('../src/handlers/rest.ts')
    const { setupOrm } = await import('@moon/orm')

    setupOrm({
      transaction: async (cb: any) => cb({
        raw: (s: string) => s,
        on: vi.fn()
      }),
      raw: (s: string) => s,
      on: vi.fn()
    } as any)

    const testCases = [
      { model: 'UPPERCASE', desc: 'uppercase letters' },
      { model: '123starts-with-number', desc: 'starts with number' },
      { model: 'has spaces', desc: 'contains spaces' },
      { model: 'has;semicolon', desc: 'contains semicolon' },
      { model: 'has--double-dash', desc: 'contains double dash' },
      { model: '_starts_with_underscore', desc: 'starts with underscore' },
    ]

    for (const { model, desc } of testCases) {
      const req = createMockReq('GET', `/api/${model}`)
      const { res, getStatus, getBody } = createMockRes()

      await handleRest(
        req,
        res,
        [`/api/${model}`, model, undefined] as any,
        'test-secret-key-at-least-32-chars-long!'
      )

      expect(getStatus()).toBe(400)
      expect(getBody().code).toBe('INVALID_MODEL')
    }
  })

  it('accepts valid model names', async () => {
    const { handleRest } = await import('../src/handlers/rest.ts')
    const { setupOrm, registerModel, Vertex, fields } = await import('@moon/orm')

    const validModels = [
      'user',
      'vx.user',
      'sample.item',
      'mx.metric',
      'a',
      'abc123',
      'my.model.name'
    ]

    for (const modelName of validModels) {
      class TestModel extends Vertex {
        static override _name = modelName
        static override _public = true
        name = fields.Char()
      }
      registerModel(TestModel)
    }

    setupOrm({
      transaction: async (cb: any) => cb({
        raw: (s: string) => s,
        on: vi.fn()
      }),
      raw: (s: string) => s,
      on: vi.fn()
    } as any)

    for (const modelName of validModels) {
      const req = createMockReq('GET', `/api/${modelName}`)
      const { res, getStatus } = createMockRes()

      await handleRest(
        req,
        res,
        [`/api/${modelName}`, modelName, undefined] as any,
        'test-secret-key-at-least-32-chars-long!'
      )

      expect(getStatus()).not.toBe(400)
    }
  })
})
