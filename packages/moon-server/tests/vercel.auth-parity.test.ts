import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'

const source = readFileSync(new URL('../src/vercel.ts', import.meta.url), 'utf8')

describe('Vercel auth adapter parity (#15)', () => {
  it('does not implement a parallel jwt.verify policy', () => {
    expect(source).not.toContain('jwt.verify(')
    expect(source).not.toContain("algorithms: ['HS256', 'HS384', 'HS512']")
  })

  it('uses the canonical request/session authenticator', () => {
    expect(source).toContain('authenticateRequest(')
    expect(source).toContain('allowAnonymous: false')
  })

  it('preserves stable typed auth errors', () => {
    expect(source).toContain('err instanceof AuthError')
    expect(source).toContain('err.statusCode')
    expect(source).toContain('err.code')
  })
})
