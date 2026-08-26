/**
 * Versioned contracts for the reusable Witness Engine runtime (#57).
 *
 * Module code may propose analysis. The runtime owns execution lineage,
 * authority constraints, evidence planning, and reproducibility metadata.
 */
export const WITNESS_ENGINE_RESULT_V1 = 'WITNESS_ENGINE_RESULT_V1' as const
export const WITNESS_ENGINE_RUNTIME_VERSION = '1.0.0' as const

export type EngineOutputAuthorityClass =
  | 'PRIMARY_SOURCE'
  | 'TRANSLATION'
  | 'TRANSMISSION_REPORT'
  | 'SOURCE_SUMMARY'
  | 'SCHOLARLY_INTERPRETATION'
  | 'DERIVED'
  | 'HYPOTHESIS'
  | 'AI_ASSISTED'

export type EngineFindingStatus =
  | 'ESTABLISHED'
  | 'PROVISIONAL'
  | 'INSUFFICIENT_EVIDENCE'
  | 'CONFLICTED'
  | 'RESERVED'

export type EngineEvidenceRelation = 'SUPPORTS' | 'CONTRADICTS' | 'CONTEXTUALIZES' | 'QUALIFIES' | 'MENTIONS'
export type EngineRunStatus = 'RUNNING' | 'COMPLETED' | 'FAILED'
export type RevelationFamily = 'QURAN' | 'TAWRAT' | 'ZABUR' | 'INJIL'

export interface EngineValidationResult {
  ok: boolean
  errors?: string[]
}

export interface EngineSourceRevision {
  sourceKey: string
  revision: string
  editionKey?: string
  family?: RevelationFamily
  authorityClass?: EngineOutputAuthorityClass
}

export interface EngineScopeInput {
  scriptureFamilies?: RevelationFamily[]
  sourceRevisions?: EngineSourceRevision[]
  languagePreferences?: string[]
  authorityClasses?: EngineOutputAuthorityClass[]
  includeHadith?: boolean
  includeDerivedAssertions?: boolean
  figureIds?: number[]
  conceptIds?: number[]
  relationCodes?: string[]
  eventIds?: number[]
  placeIds?: number[]
  traversal?: { maxDepth?: number; maxNodes?: number }
}

export interface EngineScope {
  scriptureFamilies: RevelationFamily[]
  sourceRevisions: EngineSourceRevision[]
  languagePreferences: string[]
  authorityClasses: EngineOutputAuthorityClass[]
  includeHadith: boolean
  includeDerivedAssertions: boolean
  figureIds: number[]
  conceptIds: number[]
  relationCodes: string[]
  eventIds: number[]
  placeIds: number[]
  traversal: { maxDepth: number; maxNodes: number }
}

export interface EngineAiMetadata {
  provider: string
  model?: string
  version?: string
  configurationFingerprint: string
}

export interface EngineEvidenceCandidate {
  evidenceKey: string
  relation: EngineEvidenceRelation
  authorityClass: EngineOutputAuthorityClass
  sourceFamily?: RevelationFamily
  sourceRevision: string
  provenanceRef: string
  passageId?: number
  reportId?: number
  entityId?: number
  contentId?: number
  sourceReference?: string
  span?: string
  contentType?: 'ORIGINAL_TEXT' | 'TEXTUAL_WITNESS' | 'TRANSLATION' | 'COMMENTARY' | 'SUMMARY' | 'MATN'
  aiAssisted?: boolean
}

export interface EngineScoreComponent {
  code: string
  algorithmVersion: string
  valueBp?: number
  evidenceRefs: string[]
  state: 'AVAILABLE' | 'INSUFFICIENT' | 'NOT_APPLICABLE'
}

export interface EngineScoreBreakdown {
  algorithmVersion: string
  components: EngineScoreComponent[]
}

export interface EngineFindingCandidate {
  key?: string
  statement: string
  displayText?: string
  subjectEntityId?: number
  predicate?: string
  objectEntityId?: number
  objectValue?: string
  authorityClass?: EngineOutputAuthorityClass
  status?: EngineFindingStatus
  confidenceBp?: number
  evidence?: EngineEvidenceCandidate[]
  score?: EngineScoreBreakdown
  unresolvedReasonCodes?: string[]
}

export interface EngineResultDraft {
  summary: string
  findings: EngineFindingCandidate[]
  diagnostics?: string[]
}

export interface EngineEvidenceReference extends EngineEvidenceCandidate {
  authorityClass: EngineOutputAuthorityClass
}

export interface EngineFinding {
  key: string
  statement: string
  displayText: string
  subjectEntityId?: number
  predicate?: string
  objectEntityId?: number
  objectValue?: string
  authorityClass: EngineOutputAuthorityClass
  status: EngineFindingStatus
  confidenceBp?: number
  module: { code: string; version: string; methodVersion: string }
  evidence: EngineEvidenceReference[]
  provenanceRefs: string[]
  unresolvedReasonCodes: string[]
  score?: EngineScoreBreakdown
}

export interface EngineConflict {
  findingKey: string
  evidenceKey: string
  reason: 'CONTRADICTORY_EVIDENCE'
}

export interface EngineUnresolved {
  findingKey: string
  code: string
  detail: string
}

export interface EngineResultEnvelope {
  protocol: typeof WITNESS_ENGINE_RESULT_V1
  runId: string
  summary: string
  findings: EngineFinding[]
  conflicts: EngineConflict[]
  unresolved: EngineUnresolved[]
  sourceRevisions: EngineSourceRevision[]
  provenanceSummary: { evidenceCount: number; provenanceRefs: string[] }
  diagnostics: string[]
}

export interface EngineEvidenceExplanation {
  findingKey: string
  evidence: EngineEvidenceReference[]
  provenanceRefs: string[]
  narrative?: string
}

export interface WitnessEngineModule<I = unknown> {
  code: string
  version: string
  deterministic: boolean
  aiAssisted?: boolean
  inputSchemaVersion: string
  outputSchemaVersion: string
  validateInput(input: I): EngineValidationResult
  resolveScope(ctx: unknown, input: I): Promise<EngineScopeInput>
  execute(ctx: unknown, input: I, scope: EngineScope): Promise<EngineResultDraft>
  explain(ctx: unknown, output: EngineResultEnvelope, scope: EngineScope): Promise<EngineEvidenceExplanation>
  afterComplete?(ctx: unknown, input: I, run: EngineRunRecord, output: EngineResultEnvelope, outputChecksum: string): Promise<void>
}

export interface EngineRunRecord {
  id: string
  runKey: string
  moduleCode: string
  moduleVersion: string
  runtimeVersion: string
  inputSchemaVersion: string
  outputSchemaVersion: string
  deterministic: boolean
  ai?: EngineAiMetadata
  input: unknown
  inputChecksum: string
  scope: EngineScope
  scopeChecksum: string
  sourceRevisions: EngineSourceRevision[]
  ontologyVersion: string
  identityChecksum: string
  status: EngineRunStatus
  startedAt: string
  completedAt?: string
  outputChecksum?: string
  parentRunId?: string
  rerunOfId?: string
  failureCode?: string
  failureDiagnostics?: string
}

export interface EngineRunRequest {
  moduleCode: string
  moduleVersion: string
  input: unknown
  ai?: EngineAiMetadata
}

export interface EngineReplayAvailability {
  missing: EngineSourceRevision[]
}

export interface EngineRevisionResolver {
  verify(ctx: unknown, required: EngineSourceRevision[]): Promise<EngineReplayAvailability>
}

export interface EngineRunStore {
  persistent?: boolean
  create(ctx: unknown, record: Omit<EngineRunRecord, 'id'>): Promise<EngineRunRecord>
  complete(ctx: unknown, runId: string, result: EngineResultEnvelope, outputChecksum: string): Promise<void>
  fail(ctx: unknown, runId: string, code: string, diagnostics: string): Promise<void>
  getRun(ctx: unknown, runId: string): Promise<EngineRunRecord | null>
  getResult(ctx: unknown, runId: string): Promise<EngineResultEnvelope | null>
}
