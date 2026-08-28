import { describe, expect, it } from 'vitest'
import { getLegacyResearchAdapter, legacyIdempotencyKey, mapLegacyResearchRecord } from '../src/services/legacy-research-adapters.js'
import { distribution } from '../src/services/research-patterns.js'

describe('research and legacy adapter contracts (#61/#66)', () => {
  it('preserves origin identity and never promotes legacy AI output', () => {
    const record = { id: 'musa-1', payload: { score: 99, aiMock: true }, source: 'PROPETIC' as const, originRepo: 'bjo163/propetic', originCommit: 'abc123', originPath: 'data/musa.json', adapterVersion: '1.0.0' }
    const mapped = mapLegacyResearchRecord(record)
    expect(mapped.targetLane).toBe('DERIVED')
    expect(mapped.canonicalPromotion).toBe('NEVER_AUTOMATIC')
    expect(mapped.mappingKind).toBe('FIGURE_PROJECTION')
    expect(mapped.evidenceEligible).toBe(false)
    expect(mapped.warnings).toContain('AI/mock legacy output is retained as non-evidence candidate only.')
    expect(legacyIdempotencyKey(record)).toBe(legacyIdempotencyKey({ ...record }))
  })

  it('classifies Cosmic, Propetic, and Divine Text imports without changing their source identity', () => {
    const cases = [
      ['COSMIC', 'ONTOLOGY_EVIDENCE', 'bjo163/cosmic'],
      ['PROPETIC', 'FIGURE_PROJECTION', 'bjo163/propetic'],
      ['DIVINE_TEXT', 'TEXTUAL_WITNESS', 'bjo163/divine-text']
    ] as const
    for (const [source, mappingKind, originRepo] of cases) {
      const mapped = mapLegacyResearchRecord({ id: source, payload: { status: 'READY' }, source, originRepo, originCommit: 'r1', originPath: 'fixture.json', adapterVersion: '1.0.0' })
      expect(mapped.mappingKind).toBe(mappingKind)
      expect(mapped.originRepo).toBe(originRepo)
      expect(mapped.targetLane).toBe('DERIVED')
      expect(mapped.evidenceEligible).toBe(true)
    }
  })

  it('classifies CRAYON RGBL as derived ontology evidence with preserved provenance', () => {
    const mapped = mapLegacyResearchRecord({
      id: 'rgbl-1',
      payload: { relation: 'RELATED_TO', score: 0.9 },
      source: 'CRAYON_RGBL',
      originRepo: 'bjo163/crayon-rgbl',
      originCommit: 'r1',
      originPath: 'fixtures/relations.json',
      adapterVersion: '1.0.0'
    })
    expect(mapped.mappingKind).toBe('ONTOLOGY_EVIDENCE')
    expect(mapped.targetLane).toBe('DERIVED')
    expect(mapped.evidenceEligible).toBe(true)
    expect(mapped.originChecksum).toMatch(/^[a-f0-9]{64}$/)
  })

  it('keeps unresolved legacy status out of derived evidence', () => {
    const mapped = mapLegacyResearchRecord({ id: 'pending-crosswalk', payload: { status: 'PENDING', legacyScore: 0 }, source: 'DIVINE_TEXT', originRepo: 'bjo163/divine-text', originCommit: 'r1', originPath: 'crosswalk.json', adapterVersion: '1.0.0' })
    expect(mapped.targetLane).toBe('UNRESOLVED')
    expect(mapped.evidenceEligible).toBe(false)
    expect(mapped.warnings).toContain('Legacy item has unresolved status and requires review before research use.')
  })

  it('returns deterministic denominator-explicit research distributions', () => {
    const input = [{ category: 'FAITH', evidence: true }, { category: 'FAITH', evidence: false, disputed: true }, { category: 'LAW', evidence: true }]
    expect(distribution(input)).toEqual([{ category: 'FAITH', numerator: 1, denominator: 2, proportion: 0.5, evidenceCoverage: 0.5, disputed: 1 }, { category: 'LAW', numerator: 1, denominator: 1, proportion: 1, evidenceCoverage: 1, disputed: 0 }])
    expect(distribution([...input].reverse())).toEqual(distribution(input))
  })

  it('marks records with incomplete provenance unresolved', () => {
    const mapped = mapLegacyResearchRecord({ id: 'missing-origin', payload: { status: 'READY' }, source: 'COSMIC', originRepo: '', originCommit: '', originPath: '', adapterVersion: '' })
    expect(mapped.targetLane).toBe('UNRESOLVED')
    expect(mapped.evidenceEligible).toBe(false)
    expect(mapped.warnings).toContain('Legacy item is missing required provenance: originRepo, originCommit, originPath, adapterVersion.')
  })

  it('retains the complete raw payload and separates legacy metadata from canonical semantics', () => {
    const payload = { legacyScore: 0.8, status: 'READY', relation: 'supports', nested: { source: 'fixture' } }
    const mapped = mapLegacyResearchRecord({ id: 'cosmic-1', payload, source: 'COSMIC', originRepo: 'bjo163/cosmic', originCommit: 'r1', originPath: 'evidence/1.json', adapterVersion: '1.1.0' })
    expect(mapped.rawPayload).toBe(payload)
    expect(mapped.provenance.originChecksum).toBe(mapped.originChecksum)
    expect(mapped.legacyMetadata).toEqual({ legacyScore: 0.8, status: 'READY', relation: 'supports' })
    expect(mapped.canonicalPromotion).toBe('NEVER_AUTOMATIC')
    expect(mapped.evidenceEligible).toBe(true)
  })

  it('detects AI/mock markers without rejecting ordinary words containing the letters ai', () => {
    const ordinary = mapLegacyResearchRecord({ id: 'ordinary', payload: { title: 'Maid record' }, source: 'PROPETIC', originRepo: 'bjo163/propetic', originCommit: 'r1', originPath: 'data/1.json', adapterVersion: '1.0.0' })
    const generated = mapLegacyResearchRecord({ id: 'generated', payload: { generated_by: 'ai', result: 'fallback' }, source: 'PROPETIC', originRepo: 'bjo163/propetic', originCommit: 'r1', originPath: 'data/2.json', adapterVersion: '1.0.0' })
    expect(ordinary.evidenceEligible).toBe(true)
    expect(generated.evidenceEligible).toBe(false)
  })

  it('exposes source-specific adapter policy and preserves Divine Text licensing caution', () => {
    expect(getLegacyResearchAdapter('PROPETIC').mappingKind).toBe('FIGURE_PROJECTION')
    const mapped = mapLegacyResearchRecord({ id: 'quran-manifest', payload: { corpus: 'local-quran' }, source: 'DIVINE_TEXT', originRepo: 'bjo163/divine-text', originCommit: 'r1', originPath: 'manifest.json', adapterVersion: '1.0.0' })
    expect(mapped.mappingKind).toBe('TEXTUAL_WITNESS')
    expect(mapped.warnings).toContain('Divine Text item has no explicit license metadata; verify licensing before copying corpus bytes.')
  })
})
