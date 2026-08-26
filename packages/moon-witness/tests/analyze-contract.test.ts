import { describe, expect, it } from 'vitest'
import {
  unavailableSemanticObservation,
  validateSemanticObservation,
  WITNESS_SEMANTIC_OBSERVATION_V1
} from '../src/types/analyze.js'

const metadata = {
  provider: 'fixture',
  configurationFingerprint: 'fixture-v1',
  capabilities: ['entity-candidates']
}

describe('Witness Analyze contract (#67)', () => {
  it('represents an unavailable provider explicitly without fabricating a finding', () => {
    expect(unavailableSemanticObservation(metadata, 'provider offline')).toEqual({
      protocol: WITNESS_SEMANTIC_OBSERVATION_V1,
      status: 'UNAVAILABLE',
      metadata,
      candidates: [],
      intentionSignals: ['UNKNOWN'],
      diagnostics: ['provider offline']
    })
  })

  it('rejects provider attempts to assign canonical authority or verdicts', () => {
    expect(() => validateSemanticObservation({
      protocol: WITNESS_SEMANTIC_OBSERVATION_V1,
      status: 'AVAILABLE',
      metadata,
      candidates: [],
      intentionSignals: [],
      diagnostics: [],
      authorityClass: 'PRIMARY_SOURCE'
    })).toThrow(/must not assign authorityClass/)

    expect(() => validateSemanticObservation({
      protocol: WITNESS_SEMANTIC_OBSERVATION_V1,
      status: 'AVAILABLE',
      metadata,
      candidates: [],
      intentionSignals: [],
      diagnostics: [],
      divineVerdict: true
    })).toThrow(/must not assign divineVerdict/)
  })

  it('accepts candidate-only provider output', () => {
    expect(validateSemanticObservation({
      protocol: WITNESS_SEMANTIC_OBSERVATION_V1,
      status: 'AVAILABLE',
      metadata,
      candidates: [{ label: 'Musa', kind: 'ENTITY' }],
      intentionSignals: ['INFERRED'],
      diagnostics: []
    }).candidates).toHaveLength(1)
  })
})
