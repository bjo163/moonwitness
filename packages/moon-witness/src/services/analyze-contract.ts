import {
  WITNESS_ANALYZE_RESULT_V1,
  type EvidenceSummaryStatus,
  type ReviewDecision,
  type ScoreDimensionState,
  type WitnessAnalyzeResultV1
} from '../types/analyze.ts'

const ANALYSIS_STATUSES = new Set([
  'ESTABLISHED',
  'PROVISIONAL',
  'INSUFFICIENT_EVIDENCE',
  'CONFLICTED',
  'RESERVED'
])

const EVIDENCE_STATUSES = new Set<EvidenceSummaryStatus>([
  'VERIFIED',
  'SUPPORTED_NOT_VERIFIED',
  'UNVERIFIED_REPORT',
  'INSUFFICIENT',
  'CONFLICTED'
])

const REVIEW_DECISIONS = new Set<ReviewDecision>([
  'ALLOW_ANALYTICAL_DISPLAY',
  'REQUIRE_HUMAN_REVIEW',
  'BLOCK_ADVERSE_ACTION'
])

const SCORE_STATES = new Set<ScoreDimensionState>([
  'AVAILABLE',
  'INSUFFICIENT',
  'NOT_APPLICABLE'
])

/**
 * Runtime guard for data crossing transport boundaries.
 *
 * This guard does not decide theology or factual truth. It only guarantees that
 * result data preserves the contract's uncertainty and human-review boundaries.
 */
export function validateAnalyzeResult(value: unknown): WitnessAnalyzeResultV1 {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new Error('Analyze result must be an object')
  }

  const result = value as WitnessAnalyzeResultV1
  if (result.protocol !== WITNESS_ANALYZE_RESULT_V1) {
    throw new Error(`Analyze result protocol must be ${WITNESS_ANALYZE_RESULT_V1}`)
  }
  if (!ANALYSIS_STATUSES.has(result.status)) {
    throw new Error('Analyze result status is invalid')
  }
  if (!EVIDENCE_STATUSES.has(result.evidenceSummary)) {
    throw new Error('Analyze result evidenceSummary is invalid')
  }
  if (!result.reviewGate || !REVIEW_DECISIONS.has(result.reviewGate.decision)) {
    throw new Error('Analyze result reviewGate decision is invalid')
  }
  if (!Array.isArray(result.findings) || !Array.isArray(result.sourceGrounding) || !Array.isArray(result.diagnostics)) {
    throw new Error('Analyze result findings, sourceGrounding, and diagnostics must be arrays')
  }

  if (result.status === 'RESERVED' && result.reviewGate.decision !== 'BLOCK_ADVERSE_ACTION') {
    throw new Error('RESERVED analysis results must block adverse action')
  }
  if (result.status === 'ESTABLISHED' && result.evidenceSummary !== 'VERIFIED') {
    throw new Error('ESTABLISHED analysis results require VERIFIED evidence')
  }
  if (result.evidenceSummary === 'UNVERIFIED_REPORT' && result.reviewGate.decision === 'ALLOW_ANALYTICAL_DISPLAY') {
    throw new Error('Unverified reports require human review before analytical display')
  }

  for (const finding of result.findings) {
    if ((finding as { epistemicLane?: unknown }).epistemicLane === 'AI_ASSISTED') {
      throw new Error('AI-assisted observations must not be promoted to canonical findings')
    }
  }

  if (result.score) {
    for (const dimension of result.score.dimensions) {
      if (!SCORE_STATES.has(dimension.state)) {
        throw new Error(`Score dimension ${dimension.code} has an invalid state`)
      }
      if (dimension.state === 'AVAILABLE' && typeof dimension.value !== 'number') {
        throw new Error(`Available score dimension ${dimension.code} requires a numeric value`)
      }
      if (dimension.state !== 'AVAILABLE' && dimension.value !== undefined) {
        throw new Error(`Unavailable score dimension ${dimension.code} must not have a numeric value`)
      }
    }
  }

  if (result.mizan && result.mizan.innerStateKnown !== false) {
    throw new Error('Mizan projections must state that inner state is unknown')
  }

  return result
}
