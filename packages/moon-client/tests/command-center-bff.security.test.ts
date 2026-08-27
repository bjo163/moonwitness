import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'

const sessionSource = readFileSync(
  new URL('../../../apps/command-center/lib/auth-session.ts', import.meta.url),
  'utf8'
)
const loginSource = readFileSync(
  new URL('../../../apps/command-center/app/api/auth/session/login/route.ts', import.meta.url),
  'utf8'
)
const registerSource = readFileSync(
  new URL('../../../apps/command-center/app/api/auth/session/register/route.ts', import.meta.url),
  'utf8'
)
const logoutSource = readFileSync(
  new URL('../../../apps/command-center/app/api/auth/session/logout/route.ts', import.meta.url),
  'utf8'
)
const sessionRouteSource = readFileSync(
  new URL('../../../apps/command-center/app/api/auth/session/route.ts', import.meta.url),
  'utf8'
)
const proxySource = readFileSync(
  new URL('../../../apps/command-center/app/api/backend/[...path]/route.ts', import.meta.url),
  'utf8'
)

describe('Command Center canonical BFF boundary (#90)', () => {
  it('keeps the session bearer server-only in an HttpOnly strict cookie', () => {
    expect(sessionSource).toContain('SESSION_COOKIE = "moon_session"')
    expect(sessionSource).toContain('httpOnly: true')
    expect(sessionSource).toContain('sameSite: "strict"')
    expect(sessionSource).not.toContain('httpOnly: false')
    expect(loginSource).not.toContain('token: payload.token')
    expect(registerSource).not.toContain('token: payload.token')
  })

  it('fails closed on cross-origin unsafe session and model mutations', () => {
    expect(loginSource).toContain('isTrustedSameOrigin(request)')
    expect(registerSource).toContain('isTrustedSameOrigin(request)')
    expect(logoutSource).toContain('isTrustedSameOrigin(request)')
    expect(proxySource).toContain('unsafeMethods.has(request.method)')
    expect(proxySource).toContain('isTrustedSameOrigin(request)')
  })

  it('rehydrates and proxies through the canonical backend using the server cookie', () => {
    expect(sessionRouteSource).toContain('requestApi("/auth/session"')
    expect(sessionRouteSource).toContain('Authorization: `Bearer ${token}`')
    expect(proxySource).toContain('SESSION_COOKIE')
    expect(proxySource).toContain('authorization')
    expect(proxySource).toContain('UPSTREAM_UNAVAILABLE')
  })
})
