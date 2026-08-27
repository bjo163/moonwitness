import { describe, expect, it } from 'vitest'
import { EventEmitter } from 'node:events'
import type { IncomingMessage, ServerResponse } from 'node:http'
import {
  handleCorsPreflight,
  parseBody,
  resolveCorsOrigin,
  UnsupportedMediaTypeError,
} from '../src/utils/http.js'

function mockReq(method = 'POST', headers: Record<string, string> = {}, chunks: string[] = []): IncomingMessage {
  const req = new EventEmitter() as any
  req.method = method
  req.headers = headers
  req.destroy = () => {}
  req.removeListener = EventEmitter.prototype.removeListener.bind(req)
  process.nextTick(() => {
    for (const chunk of chunks) req.emit('data', chunk)
    req.emit('end')
  })
  return req
}

function mockRes(): { res: ServerResponse; status: () => number; headers: () => Record<string, string> } {
  let statusCode = 200
  const values: Record<string, string> = {}
  const res = {
    headersSent: false,
    writeHead(code: number, headers?: Record<string, string>) {
      statusCode = code
      Object.assign(values, headers || {})
    },
    end() {},
  } as any
  return { res, status: () => statusCode, headers: () => values }
}

describe('HTTP boundary regression (#16)', () => {
  it('fails closed for unconfigured production origins', () => {
    const previous = process.env.NODE_ENV
    process.env.NODE_ENV = 'production'
    try {
      expect(resolveCorsOrigin('https://attacker.example')).toBeNull()
    } finally {
      process.env.NODE_ENV = previous
    }
  })

  it('never reflects unapproved preflight headers', () => {
    const req = mockReq('OPTIONS', {
      origin: 'https://app.moonwitness.org',
      'access-control-request-method': 'POST',
      'access-control-request-headers': 'Authorization, X-Attacker-Controlled',
    })
    const { res, status, headers } = mockRes()
    handleCorsPreflight(req, res, { allowedOrigins: ['https://app.moonwitness.org'] })
    expect(status()).toBe(403)
    expect(headers()['Access-Control-Allow-Headers']).toBeUndefined()
  })

  it('returns a typed 415 boundary error for unsupported media types', async () => {
    const req = mockReq('POST', { 'content-type': 'text/plain' }, ['hello'])
    await expect(parseBody(req)).rejects.toBeInstanceOf(UnsupportedMediaTypeError)
  })

  it('allows wildcard origin without credential authority', () => {
    const req = mockReq('OPTIONS', {
      origin: 'https://any.example',
      'access-control-request-method': 'GET',
    })
    const { res, status, headers } = mockRes()
    handleCorsPreflight(req, res, { allowedOrigins: ['*'], allowCredentials: true })
    expect(status()).toBe(204)
    expect(headers()['Access-Control-Allow-Origin']).toBe('*')
    expect(headers()['Access-Control-Allow-Credentials']).toBeUndefined()
  })
})
