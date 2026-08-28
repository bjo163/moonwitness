import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'

const indexSource = readFileSync(new URL('../src/index.js', import.meta.url), 'utf8')
const baseDataSource = readFileSync(new URL('../src/base-data.js', import.meta.url), 'utf8')

describe('bootstrap credential invariants (#29)', () => {
  it('contains no predictable canonical bootstrap passwords', () => {
    expect(indexSource).not.toContain("'admin123'")
    expect(indexSource).not.toContain("'password123'")
    expect(indexSource).not.toContain('Divine Commander')
  })

  it('requires explicit production admin bootstrap input', () => {
    expect(indexSource).toContain('BOOTSTRAP_ADMIN_PASSWORD is required for production installation')
    expect(indexSource).toContain('randomBytes(32)')
  })

  it('does not update password for an existing seeded user', () => {
    const existingBranch = baseDataSource.slice(baseDataSource.indexOf('} else {\n          const existingUser'))
    expect(existingBranch).not.toContain('password: hashedPassword')
    expect(existingBranch).toContain("update({ login: u.email })")
  })
})
