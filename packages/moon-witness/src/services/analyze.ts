import { sha256String, stableSerialize } from './hash.js'
import { validateAnalyzeResult } from './analyze-contract.js'
import {
  unavailableSemanticObservation,
  validateSemanticObservation,
  WITNESS_ANALYZE_RESULT_V1,
  type WitnessAnalyzeInputV1,
  type WitnessAnalyzeResultV1,
  type WitnessSemanticProvider
} from '../types/analyze.js'

function validateInput(input: WitnessAnalyzeInputV1): void {
  if (!input || input.protocol !== 'WITNESS_ANALYZE_INPUT_V1') {
    throw new Error('Analyze input protocol is invalid')
  }
  const hasNarrative = Boolean(input.query?.trim() || input.text?.trim())
  if (!hasNarrative && !input.declaredFacts?.length && !input.evidenceRefs?.length) {
    throw new Error('Analyze input requires a query, text, declared fact, or evidence reference')
  }
}

/**
 * Deterministic first stage for #67. This intentionally stops before canonical
 * resolution, evidence verification, or scoring. It is therefore safe to use
 * while those graph capabilities are still being implemented.
 */
export async function analyzeWitness(
  input: WitnessAnalyzeInputV1,
  provider?: WitnessSemanticProvider
): Promise<WitnessAnalyzeResultV1> {
  validateInput(input)

  const inputFingerprint = sha256String(stableSerialize(input))
  const run = { id: `analysis:${inputFingerprint.slice(0, 16)}`, inputFingerprint }
  const diagnostics: string[] = []
  let semanticObservation

  if (provider && input.options?.allowSemanticProvider !== false) {
    try {
      semanticObservation = validateSemanticObservation(await provider.observe(input))
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Semantic provider failed'
      semanticObservation = unavailableSemanticObservation({
        provider: 'unknown',
        configurationFingerprint: 'unavailable',
        capabilities: []
      }, message)
      diagnostics.push(`Semantic provider unavailable: ${message}`)
    }
  } else {
    diagnostics.push('Semantic provider was not configured')
  }

  if (semanticObservation?.status === 'AVAILABLE') {
    diagnostics.push('Semantic candidates require canonical resolution and evidence verification')
  }

  return validateAnalyzeResult({
    protocol: WITNESS_ANALYZE_RESULT_V1,
    run,
    status: 'INSUFFICIENT_EVIDENCE',
    semanticObservation,
    findings: [],
    evidenceSummary: 'INSUFFICIENT',
    sourceGrounding: [],
    reviewGate: {
      decision: 'REQUIRE_HUMAN_REVIEW',
      severity: 'WARNING',
      reasonCodes: ['CANONICAL_RESOLUTION_REQUIRED', 'EVIDENCE_VERIFICATION_REQUIRED'],
      evidenceRefs: input.evidenceRefs?.map((reference) => reference.id) ?? [],
      evidenceGaps: ['No canonical evidence resolution was performed'],
      recommendedActions: ['Resolve candidate identities and verify cited evidence before evaluation']
    },
    diagnostics
  })
}
