import { describe, expect, it } from 'vitest'
import {
  unavailableSemanticObservation,
  validateSemanticObservation,
  WITNESS_ANALYZE_RESULT_V1,
  WITNESS_SEMANTIC_OBSERVATION_V1
} from '../src/types/analyze.ts'
import { validateAnalyzeResult } from '../src/services/analyze-contract.ts'
import { analyzeWitness } from '../src/services/analyze.ts'

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

  it('keeps reserved and unverified results behind the review gate', () => {
    const result = {
      protocol: WITNESS_ANALYZE_RESULT_V1,
      run: { id: 'run-1', inputFingerprint: 'fixture' },
      status: 'RESERVED',
      findings: [],
      evidenceSummary: 'INSUFFICIENT',
      sourceGrounding: [],
      reviewGate: {
        decision: 'BLOCK_ADVERSE_ACTION',
        severity: 'HIGH',
        reasonCodes: ['RESERVED_DOMAIN'],
        evidenceRefs: [],
        evidenceGaps: [],
        recommendedActions: []
      },
      diagnostics: []
    } as const

    expect(validateAnalyzeResult(result).status).toBe('RESERVED')
    expect(() => validateAnalyzeResult({ ...result, reviewGate: { ...result.reviewGate, decision: 'ALLOW_ANALYTICAL_DISPLAY' } }))
      .toThrow(/must block adverse action/)
  })

  it('does not let missing score dimensions acquire a midpoint value', () => {
    const result = {
      protocol: WITNESS_ANALYZE_RESULT_V1,
      run: { id: 'run-2', inputFingerprint: 'fixture' },
      status: 'PROVISIONAL',
      findings: [],
      evidenceSummary: 'SUPPORTED_NOT_VERIFIED',
      sourceGrounding: [],
      reviewGate: {
        decision: 'REQUIRE_HUMAN_REVIEW',
        severity: 'WARNING',
        reasonCodes: [],
        evidenceRefs: [],
        evidenceGaps: [],
        recommendedActions: []
      },
      score: {
        profile: { id: 'fixture', version: '1', formulaFingerprint: 'fixture' },
        calibrationStatus: 'UNCALIBRATED',
        dimensions: [{ code: 'evidence', state: 'INSUFFICIENT', value: 0.5, evidenceRefs: [] }]
      },
      diagnostics: []
    }

    expect(() => validateAnalyzeResult(result)).toThrow(/must not have a numeric value/)
  })

  it('does not fabricate a finding when no semantic provider is configured', async () => {
    const result = await analyzeWitness({
      protocol: 'WITNESS_ANALYZE_INPUT_V1',
      text: 'A report without admitted evidence'
    })

    expect(result.status).toBe('INSUFFICIENT_EVIDENCE')
    expect(result.findings).toEqual([])
    expect(result.reviewGate.decision).toBe('REQUIRE_HUMAN_REVIEW')
  })

  it('keeps available semantic candidates separate from canonical findings', async () => {
    const result = await analyzeWitness({
      protocol: 'WITNESS_ANALYZE_INPUT_V1',
      text: 'Mention Musa'
    }, {
      async observe() {
        return {
          protocol: WITNESS_SEMANTIC_OBSERVATION_V1,
          status: 'AVAILABLE',
          metadata,
          candidates: [{ label: 'Musa', kind: 'ENTITY' }],
          intentionSignals: ['UNKNOWN'],
          diagnostics: []
        }
      }
    })

    expect(result.semanticObservation?.candidates).toHaveLength(1)
    expect(result.findings).toEqual([])
    expect(result.status).toBe('INSUFFICIENT_EVIDENCE')
  })
})
