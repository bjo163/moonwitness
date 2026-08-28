import { describe, it, expect } from 'vitest'
import { defineRoute } from '../src/route-builder.js'

describe('System Mutation Authorization (#98)', () => {
  it('throws when registering a non-GET /api/system/* route without admin auth', () => {
    expect(() => {
      defineRoute({
        method: 'POST',
        path: '/api/system/demo-seed',
        handler: async () => ({ ok: true }),
      })
    }).toThrow('System mutation routes must explicitly require admin authorization')
  })

  it('allows GET /api/system/* routes without explicit admin auth', () => {
    expect(() => {
      defineRoute({
        method: 'GET',
        path: '/api/system/status',
        handler: async () => ({ ok: true }),
      })
    }).not.toThrow()
  })

  it('allows non-system mutation routes without admin auth', () => {
    expect(() => {
      defineRoute({
        method: 'POST',
        path: '/api/public/feedback',
        handler: async () => ({ ok: true }),
      })
    }).not.toThrow()
  })

  it('allows /api/system/* routes with explicit admin auth', () => {
    expect(() => {
      defineRoute({
        method: 'POST',
        path: '/api/system/demo-seed',
        auth: 'admin',
        handler: async () => ({ ok: true }),
      })
    }).not.toThrow()
  })
})
