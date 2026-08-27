import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'

const source = readFileSync(
  new URL('../../../apps/command-center/views/users-view.tsx', import.meta.url),
  'utf8'
)

describe('Command Center authoritative user telemetry (#91)', () => {
  it('does not fabricate roles, status, teams, activity, or dashboard counts', () => {
    expect(source).not.toContain('Math.random')
    expect(source).not.toContain('generateRandom')
    expect(source).not.toContain('Rezza Fahlevi')
    expect(source).not.toContain('Aisyah Rahma')
    expect(source).not.toContain('Fadly Maulana')
    expect(source).not.toContain('1,248')
    expect(source).not.toContain('982')
    expect(source).not.toContain('Pending Approval')
  })

  it('derives supported metrics and filters from canonical vx.user fields', () => {
    expect(source).toContain('countUsers([["isActive", "in", [true, false]]])')
    expect(source).toContain('countUsers([["isActive", "=", true]])')
    expect(source).toContain('countUsers([["isActive", "=", false]])')
    expect(source).toContain('isActive:')
    expect(source).toContain('companyId: organizationFilter')
    expect(source).toContain('filters={tableFilters}')
  })

  it('renders unavailable states when no authoritative contract exists', () => {
    expect(source).toContain('Role filter unavailable')
    expect(source).toContain('Recent Login Activity')
    expect(source).toContain('does not infer or fabricate per-user login history')
    expect(source).toContain('No authoritative aggregate contract yet')
  })
})
