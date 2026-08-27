import { afterEach, describe, expect, it } from 'vitest'
import { EventEmitter } from 'node:events'
import type { IncomingMessage, ServerResponse } from 'node:http'
import {
  defineRoute,
  getSystemMutationCapabilityName,
  isProductionSystemMutationAllowed,
  resolveRouteAuthLevel,
} from '../src/route-builder.js'
import { globalRoutes } from '../src/router.js'

function createAnonymousRequest(path: string): IncomingMessage {
  const req = new EventEmitter() as IncomingMessage
  ;(req as any).method = 'POST'
  ;(req as any).url = path
  ;(req as any).headers = {}
  return req
}

function createResponse() {
  let statusCode = 200
  let body = ''
  const res = {
    writableEnded: false,
    writeHead(code: number) {
      statusCode = code
      return this
    },
    end(data?: string) {
      if (data) body += data
      this.writableEnded = true
      return this
    },
  } as unknown as ServerResponse
  return { res, status: () => statusCode, body: () => body }
}

afterEach(() => {
  globalRoutes.splice(0, globalRoutes.length)
})

describe('privileged custom route policy (#98)', () => {
  it('defaults mutating system routes to administrator auth', () => {
    expect(resolveRouteAuthLevel({ method: 'POST', path: '/api/system/demo-seed' })).toBe('admin')
    expect(resolveRouteAuthLevel({ method: 'DELETE', path: '/api/system/cache' })).toBe('admin')
    expect(resolveRouteAuthLevel({ method: 'GET', path: '/api/system/status' })).toBe('none')
    expect(resolveRouteAuthLevel({ method: 'POST', path: '/api/public/action', auth: 'user' })).toBe('user')
  })

  it('derives a per-route production capability and denies by default', () => {
    const route = { method: 'POST' as const, path: '/api/system/demo-seed' }
    expect(getSystemMutationCapabilityName(route)).toBe('MOON_ENABLE_DEMO_SEED')
    expect(isProductionSystemMutationAllowed(route, { NODE_ENV: 'production' })).toBe(false)
    expect(isProductionSystemMutationAllowed(route, {
      NODE_ENV: 'production',
      MOON_ENABLE_DEMO_SEED: 'true',
    })).toBe(true)
    expect(isProductionSystemMutationAllowed(route, { NODE_ENV: 'development' })).toBe(true)
  })

  it('rejects an anonymous system mutation before its handler can run', async () => {
    let executed = false
    defineRoute({
      method: 'POST',
      path: '/api/system/demo-seed',
      handler: async () => {
        executed = true
        return { ok: true }
      },
    })

    const route = globalRoutes.find((candidate) => candidate.path === '/api/system/demo-seed')
    expect(route).toBeDefined()

    const req = createAnonymousRequest('/api/system/demo-seed')
    const { res, status, body } = createResponse()
    await route!.handler(req, res)

    expect(status()).toBe(401)
    expect(body()).toContain('AUTH_')
    expect(executed).toBe(false)
  })
})
