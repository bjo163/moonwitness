import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'

const authSource = readFileSync(new URL('../src/auth.ts', import.meta.url), 'utf8')
const apiSource = readFileSync(new URL('../src/api-client.ts', import.meta.url), 'utf8')

describe('browser session authority (#89)', () => {
  it('does not fabricate browser JWTs or fallback privileged users', () => {
    expect(authSource).not.toContain('mw_jwt_')
    expect(authSource).not.toContain('DIVINE COMMANDER')
    expect(authSource).not.toContain('response?.user ||')
  })

  it('does not persist or read bearer credentials from browser storage', () => {
    expect(authSource).not.toContain('localStorage.')
    expect(authSource).not.toContain('document.cookie')
    expect(apiSource).not.toContain('localStorage.')
    expect(apiSource).not.toContain('mw_session')
    expect(apiSource).not.toContain('Authorization =')
  })

  it('rehydrates only from the same-origin server session endpoint', () => {
    expect(authSource).toContain('apiGet<{ user?: UserProfile | null }>("/api/auth/session")')
    expect(authSource).toContain('token: null')
  })
})
