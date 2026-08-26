/**
 * Versioned public contract for the Witness analysis pipeline (#67).
 *
 * Semantic providers may propose candidates only. Canonical resolvers and
 * source-policy evaluation own authority, evidence status, and final findings.
 */

export const WITNESS_ANALYZE_INPUT_V1 = 'WITNESS_ANALYZE_INPUT_V1' as const
export const WITNESS_ANALYZE_RESULT_V1 = 'WITNESS_ANALYZE_RESULT_V1' as const
export const WITNESS_SEMANTIC_OBSERVATION_V1 = 'WITNESS_SEMANTIC_OBSERVATION_V1' as const

export type AnalysisFindingStatus =
  | 'ESTABLISHED'
  | 'PROVISIONAL'
  | 'INSUFFICIENT_EVIDENCE'
  | 'CONFLICTED'
  | 'RESERVED'

export type EvidenceSummaryStatus =
  | 'VERIFIED'
  | 'SUPPORTED_NOT_VERIFIED'
  | 'UNVERIFIED_REPORT'
  | 'INSUFFICIENT'
  | 'CONFLICTED'

export type EpistemicLane = 'CORE' | 'DERIVED' | 'UNRESOLVED' | 'AI_ASSISTED'
export type SourceAuthority = 'PRIMARY_SOURCE' | 'COMPLEMENTARY_SOURCE' | 'CONTEXTUAL' | 'NOT_APPLICABLE'
export type SemanticProviderStatus = 'AVAILABLE' | 'UNAVAILABLE' | 'FAILED'
export type IntentionSignal = 'DECLARED_INTENT_SIGNAL' | 'MISTAKE_SIGNAL' | 'COERCION_SIGNAL' | 'INFERRED' | 'UNKNOWN'
export type ReviewDecision = 'ALLOW_ANALYTICAL_DISPLAY' | 'REQUIRE_HUMAN_REVIEW' | 'BLOCK_ADVERSE_ACTION'
export type ReviewSeverity = 'INFO' | 'WARNING' | 'HIGH'
export type SourceCoverage = 'DIRECT' | 'MIXED' | 'INDIRECT' | 'NONE'
export type ScoreDimensionState = 'AVAILABLE' | 'INSUFFICIENT' | 'NOT_APPLICABLE'

export interface EntityRef {
  id?: string
  stableKey?: string
  label?: string
}

export interface EvidenceRef {
  id: string
  sourceRevision?: string
  span?: string
}

export interface DeclaredFactInput {
  statement: string
  evidenceRefs?: EvidenceRef[]
}

export interface WitnessAnalyzeInputV1 {
  protocol: typeof WITNESS_ANALYZE_INPUT_V1
  query?: string
  text?: string
  subject?: EntityRef
  caseId?: string
  declaredFacts?: DeclaredFactInput[]
  evidenceRefs?: EvidenceRef[]
  profile?: { id: string; version: string }
  options?: { allowSemanticProvider?: boolean }
}

export interface SemanticCandidate {
  label: string
  kind: 'ENTITY' | 'EVENT' | 'ACTION' | 'CLAIM' | 'SOURCE_HINT'
  confidence?: number
  evidenceHints?: string[]
}

export interface SemanticProviderMetadata {
  provider: string
  model?: string
  configurationFingerprint: string
  capabilities: string[]
}

/** Candidate-only output. It deliberately has no authority/evidence/finding fields. */
export interface WitnessSemanticObservationV1 {
  protocol: typeof WITNESS_SEMANTIC_OBSERVATION_V1
  status: SemanticProviderStatus
  metadata: SemanticProviderMetadata
  candidates: SemanticCandidate[]
  intentionSignals: IntentionSignal[]
  language?: string
  diagnostics: string[]
}

export interface WitnessSemanticProvider {
  observe(input: WitnessAnalyzeInputV1): Promise<unknown>
}

export interface SourceGroundingV1 {
  policyId: string
  policyVersion: string
  family?: 'QURAN' | 'TAWRAT' | 'ZABUR' | 'INJIL' | string
  coverage: SourceCoverage
  evidenceRefs: string[]
  sourceRevisionRefs: string[]
  empiricalOrExternalBridgeRequired: boolean
  admittedForNormativeDirection: boolean
}

export interface AnalysisFindingV1 {
  id: string
  status: AnalysisFindingStatus
  statement: string
  epistemicLane: Exclude<EpistemicLane, 'AI_ASSISTED'>
  evidenceRefs: string[]
  unresolvedReasonCodes: string[]
}

export interface ScoreDimensionV1 {
  code: string
  state: ScoreDimensionState
  value?: number
  evidenceRefs: string[]
}

export interface ScoreResultV1 {
  profile: { id: string; version: string; formulaFingerprint: string }
  dimensions: ScoreDimensionV1[]
  calibrationStatus: 'CALIBRATED' | 'UNCALIBRATED' | 'NOT_APPLICABLE'
}

export interface MizanProjectionV1 {
  harmSignal: ScoreDimensionV1
  benefitSignal: ScoreDimensionV1
  restorationSignal: ScoreDimensionV1
  responsibilityContext: string[]
  innerStateKnown: false
}

export interface ReviewGateV1 {
  decision: ReviewDecision
  severity: ReviewSeverity
  reasonCodes: string[]
  evidenceRefs: string[]
  evidenceGaps: string[]
  recommendedActions: string[]
}

export interface WitnessAnalyzeResultV1 {
  protocol: typeof WITNESS_ANALYZE_RESULT_V1
  run: { id: string; inputFingerprint: string }
  status: AnalysisFindingStatus
  semanticObservation?: WitnessSemanticObservationV1
  findings: AnalysisFindingV1[]
  evidenceSummary: EvidenceSummaryStatus
  sourceGrounding: SourceGroundingV1[]
  score?: ScoreResultV1
  mizan?: MizanProjectionV1
  reviewGate: ReviewGateV1
  diagnostics: string[]
}

const FORBIDDEN_PROVIDER_FIELDS = new Set([
  'authorityClass',
  'authority',
  'evidenceStatus',
  'findingStatus',
  'status',
  'epistemicLane',
  'score',
  'reviewGate',
  'divineVerdict',
  'canonicalEntityId'
])

export function validateSemanticObservation(value: unknown): WitnessSemanticObservationV1 {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new Error('Semantic observation must be an object')
  }

  const candidate = value as Record<string, unknown>
  for (const field of FORBIDDEN_PROVIDER_FIELDS) {
    if (field !== 'status' && field in candidate) {
      throw new Error(`Semantic provider output must not assign ${field}`)
    }
  }

  if (candidate.protocol !== WITNESS_SEMANTIC_OBSERVATION_V1) {
    throw new Error(`Semantic observation protocol must be ${WITNESS_SEMANTIC_OBSERVATION_V1}`)
  }
  if (!['AVAILABLE', 'UNAVAILABLE', 'FAILED'].includes(String(candidate.status))) {
    throw new Error('Semantic provider status is invalid')
  }
  if (!Array.isArray(candidate.candidates) || !Array.isArray(candidate.intentionSignals) || !Array.isArray(candidate.diagnostics)) {
    throw new Error('Semantic observation candidates, intentionSignals, and diagnostics must be arrays')
  }
  if (!candidate.metadata || typeof candidate.metadata !== 'object' || Array.isArray(candidate.metadata)) {
    throw new Error('Semantic provider metadata is required')
  }

  return candidate as unknown as WitnessSemanticObservationV1
}

export function unavailableSemanticObservation(
  metadata: SemanticProviderMetadata,
  diagnostic: string
): WitnessSemanticObservationV1 {
  return {
    protocol: WITNESS_SEMANTIC_OBSERVATION_V1,
    status: 'UNAVAILABLE',
    metadata,
    candidates: [],
    intentionSignals: ['UNKNOWN'],
    diagnostics: [diagnostic]
  }
}
