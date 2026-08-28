import { describe, expect, it } from 'vitest'
import {
  canonicalRelationKey,
  canonicalizeSymmetricEntities,
  validateRelationCandidate
} from '../src/graph/identity.ts'

const policy = {
  code: 'MENTIONS',
  provenanceRequired: true,
  selfLoopAllowed: false,
  allowedSourceKinds: 'CONTENT_WITNESS,PASSAGE,TRADITION_UNIT',
  allowedTargetKinds: 'CONCEPT,PERSON'
}

describe('Witness graph core contracts', () => {
  it('produces a deterministic cross-install relation identity from canonical keys', () => {
    const a = canonicalRelationKey({
      fromEntityKey: 'passage:quran:2:255',
      relationTypeCode: 'mentions',
      toEntityKey: 'concept:mercy',
      ontologyVersion: 'WITNESS_RELATION_V1',
      sourceRevision: 'rev-1'
    })
    const b = canonicalRelationKey({
      fromEntityKey: 'PASSAGE:QURAN:2:255',
      relationTypeCode: 'MENTIONS',
      toEntityKey: 'CONCEPT:MERCY',
      ontologyVersion: 'WITNESS_RELATION_V1',
      sourceRevision: 'rev-1'
    })
    expect(a).toBe(b)
    expect(a).toMatch(/^wxrel:[a-f0-9]{64}$/)
  })

  it('canonicalizes symmetric endpoints by semantic key rather than database id', () => {
    const [left, right] = canonicalizeSymmetricEntities(
      { id: 99, key: 'figure:musa', value: 'musa' },
      { id: 2, key: 'figure:isa', value: 'isa' }
    )
    expect(left.key).toBe('figure:isa')
    expect(left.id).toBe(2)
    expect(right.key).toBe('figure:musa')
    expect(right.id).toBe(99)
  })

  it('does not let database id allocation affect the relation hash', () => {
    const installationA = canonicalRelationKey({
      fromEntityKey: 'figure:musa',
      relationTypeCode: 'PARALLELS',
      toEntityKey: 'figure:isa',
      ontologyVersion: 'WITNESS_RELATION_V1'
    })
    const installationB = canonicalRelationKey({
      fromEntityKey: 'figure:musa',
      relationTypeCode: 'PARALLELS',
      toEntityKey: 'figure:isa',
      ontologyVersion: 'WITNESS_RELATION_V1'
    })
    expect(installationA).toBe(installationB)
  })

  it('rejects a relation without required provenance', () => {
    const result = validateRelationCandidate({
      fromEntityId: 1,
      fromKind: 'PASSAGE',
      relationType: policy,
      toEntityId: 2,
      toKind: 'PERSON',
      confidenceBp: 9000,
      status: 'PROVISIONAL'
    })
    expect(result.ok).toBe(false)
    expect(result.issues).toContain('relation MENTIONS requires provenance')
  })

  it('rejects incompatible entity kinds', () => {
    const result = validateRelationCandidate({
      fromEntityId: 1,
      fromKind: 'PERSON',
      relationType: policy,
      toEntityId: 2,
      toKind: 'PLACE',
      provenanceId: 7,
      confidenceBp: 7000,
      status: 'PROVISIONAL'
    })
    expect(result.ok).toBe(false)
    expect(result.issues).toContain('source kind PERSON is not allowed for MENTIONS')
    expect(result.issues).toContain('target kind PLACE is not allowed for MENTIONS')
  })

  it('does not allow review-only SAME_AS to be directly established', () => {
    const result = validateRelationCandidate({
      fromEntityId: 1,
      fromKind: 'PERSON',
      relationType: {
        code: 'SAME_AS',
        symmetric: true,
        reviewRequired: true,
        provenanceRequired: true
      },
      toEntityId: 2,
      toKind: 'PERSON',
      provenanceId: 7,
      confidenceBp: 9999,
      status: 'ESTABLISHED'
    })
    expect(result.ok).toBe(false)
    expect(result.issues).toContain('relation SAME_AS requires review before ESTABLISHED status')
  })

  it('rejects confidence outside basis-point bounds instead of silently clamping', () => {
    const result = validateRelationCandidate({
      fromEntityId: 1,
      fromKind: 'PASSAGE',
      relationType: policy,
      toEntityId: 2,
      toKind: 'CONCEPT',
      provenanceId: 7,
      confidenceBp: 12000,
      status: 'PROVISIONAL'
    })
    expect(result.ok).toBe(false)
    expect(result.issues).toContain('confidenceBp must be an integer between 0 and 10000')
  })
})
