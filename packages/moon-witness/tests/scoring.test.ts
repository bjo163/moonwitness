import { describe, expect, it } from 'vitest'
import { SCORE_PROFILES, score, toEngineScore } from '../src/services/scoring.js'

describe('Witness scoring kernel (#63)', () => {
  it('keeps not-applicable dimensions distinct from zero and is deterministic', () => {
    const dimensions = [
      { code: 'SOURCE_AUTHORITY', state: 'AVAILABLE' as const, value: 100, evidenceRefs: ['a'], reasonCodes: ['PRIMARY'] },
      { code: 'TEXTUAL_INTEGRITY', state: 'NOT_APPLICABLE' as const, evidenceRefs: [], reasonCodes: ['NO_TEXT'] }
    ]
    const first = score(SCORE_PROFILES.source_reliability_v1, dimensions)
    const second = score(SCORE_PROFILES.source_reliability_v1, [...dimensions].reverse())
    expect(first.composite).toBe(100)
    expect(first.dimensions[1].value).toBeUndefined()
    expect(first.formulaFingerprint).toBe(second.formulaFingerprint)
  })

  it('reports missing coverage and exposes conflict separately', () => {
    const result = score(SCORE_PROFILES.relation_confidence_v1, [
      { code: 'SOURCE_AUTHORITY', state: 'AVAILABLE', value: 95, evidenceRefs: ['e1'], reasonCodes: [] },
      { code: 'PROVENANCE_QUALITY', state: 'INSUFFICIENT', evidenceRefs: [], reasonCodes: ['REVISION_MISSING'] },
      { code: 'CONFLICT_PENALTY', state: 'AVAILABLE', value: 10, evidenceRefs: ['e2'], reasonCodes: ['CONTRADICTION'] }
    ])
    expect(result.status).toBe('CONFLICTED')
    expect(result.coverage).toBeCloseTo(2 / 3)
  })

  it('exports a profile-bound engine score without losing vector semantics', () => {
    const result = score(SCORE_PROFILES.research_hypothesis_v1, [{ code: 'COVERAGE', state: 'AVAILABLE', value: 75, evidenceRefs: ['e1'], reasonCodes: [] }])
    expect(toEngineScore(result)).toMatchObject({ profileCode: 'research_hypothesis', profileVersion: '1.0.0', compositeBp: 7500, coverageBp: 10000 })
  })
})
