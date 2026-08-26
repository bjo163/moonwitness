import { describe, expect, it } from 'vitest'
import { legacyIdempotencyKey, mapLegacyResearchRecord } from '../src/services/legacy-research-adapters.js'
import { distribution } from '../src/services/research-patterns.js'

describe('research and legacy adapter contracts (#61/#66)', () => {
  it('preserves origin identity and never promotes legacy AI output', () => {
    const record = { id: 'musa-1', payload: { score: 99, aiMock: true }, source: 'PROPETIC' as const, originRepo: 'bjo163/propetic', originCommit: 'abc123', originPath: 'data/musa.json', adapterVersion: '1.0.0' }
    const mapped = mapLegacyResearchRecord(record)
    expect(mapped.targetLane).toBe('DERIVED')
    expect(mapped.canonicalPromotion).toBe('NEVER_AUTOMATIC')
    expect(mapped.warnings).toContain('AI/mock legacy output is retained as non-evidence candidate only.')
    expect(legacyIdempotencyKey(record)).toBe(legacyIdempotencyKey({ ...record }))
  })

  it('returns deterministic denominator-explicit research distributions', () => {
    const input = [{ category: 'FAITH', evidence: true }, { category: 'FAITH', evidence: false, disputed: true }, { category: 'LAW', evidence: true }]
    expect(distribution(input)).toEqual([{ category: 'FAITH', numerator: 1, denominator: 2, proportion: 0.5, evidenceCoverage: 0.5, disputed: 1 }, { category: 'LAW', numerator: 1, denominator: 1, proportion: 1, evidenceCoverage: 1, disputed: 0 }])
    expect(distribution([...input].reverse())).toEqual(distribution(input))
  })
})
