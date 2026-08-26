import { describe, expect, it } from 'vitest'
import {
  canonicalRelationKey,
  canonicalizeSymmetricEndpoints,
  validateRelationCandidate
} from '../src/graph/identity.js'

const policy = {
  code: 'MENTIONS',
  provenanceRequired: true,
  selfLoopAllowed: false,
  allowedSourceKinds: 'CONTENT_WITNESS,PASSAGE,TRADITION_UNIT',
  allowedTargetKinds: 'CONCEPT,PERSON'
}

describe('Witness graph core contracts', () => {
  it('produces a deterministic relation identity', () => {
    const a = canonicalRelationKey({
      fromEntityId: 10,
      relationTypeCode: 'mentions',
      toEntityId: 20,
      sourceRevision: 'rev-1'
    })
    const b = canonicalRelationKey({
      fromEntityId: 10,
      relationTypeCode: 'MENTIONS',
      toEntityId: 20,
      sourceRevision: 'rev-1'
    })
    expect(a).toBe(b)
    expect(a).toMatch(/^wxrel:[a-f0-9]{64}$/)
  })

  it('canonicalizes symmetric endpoints', () => {
    expect(canonicalizeSymmetricEndpoints(9, 3)).toEqual([3, 9])
    expect(canonicalizeSymmetricEndpoints(3, 9)).toEqual([3, 9])
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

  it('rejects midpoint-like invalid confidence ranges instead of silently clamping', () => {
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
