import WxEntity from './models/wx-entity.ts'
import WxEntityAlias from './models/wx-entity-alias.ts'
import WxEntityIdentifier from './models/wx-entity-identifier.ts'
import WxSource from './models/wx-source.ts'
import WxProvenance from './models/wx-provenance.ts'
import WxRelationType from './models/wx-relation-type.ts'
import WxRelation from './models/wx-relation.ts'
import WxReligion from './models/wx-religion.ts'
import WxCommunity from './models/wx-community.ts'
import WxScripture from './models/wx-scripture.ts'
import WxScriptureBook from './models/wx-scripture-book.ts'
import WxScriptureVerse from './models/wx-scripture-verse.ts'
import WxTradition from './models/wx-tradition.ts'
import WxTraditionItem from './models/wx-tradition-item.ts'
import WxDevotion from './models/wx-devotion.ts'
import WxAsmaulHusna from './models/wx-asmaul-husna.ts'
import WxBookmark from './models/wx-bookmark.ts'
import WxHistory from './models/wx-history.ts'
import WxPassage from './models/wx-passage.ts'
import WxTextEdition from './models/wx-text-edition.ts'
import WxContent from './models/wx-content.ts'
import WxRoot from './models/wx-root.ts'
import WxLexeme from './models/wx-lexeme.ts'
import WxLexicalOccurrence from './models/wx-lexical-occurrence.ts'
import WxRevelationEvent from './models/wx-revelation-event.ts'
import WxRevelationEventPassage from './models/wx-revelation-event-passage.ts'
import WxFigure from './models/wx-figure.ts'
import WxFigureName from './models/wx-figure-name.ts'
import WxFigureRole from './models/wx-figure-role.ts'
import WxTraditionCorpus from './models/wx-tradition-corpus.ts'
import WxTraditionUnit from './models/wx-tradition-unit.ts'
import WxTraditionReference from './models/wx-tradition-reference.ts'
import WxTraditionAttribution from './models/wx-tradition-attribution.ts'
import WxTransmissionChain from './models/wx-transmission-chain.ts'
import WxTransmissionLink from './models/wx-transmission-link.ts'
import WxTraditionAssessment from './models/wx-tradition-assessment.ts'
import WxConcept from './models/wx-concept.ts'
import WxAssertion from './models/wx-assertion.ts'
import WxEvidence from './models/wx-evidence.ts'
import WxDivineExpression from './models/wx-divine-expression.ts'
import WxDivineExpressionOccurrence from './models/wx-divine-expression-occurrence.ts'
import WxLegacyMapping from './models/wx-legacy-mapping.ts'
import WxEngineRun from './models/wx-engine-run.ts'
import WxEngineResult from './models/wx-engine-result.ts'
import WxResearchHypothesis from './models/wx-research-hypothesis.ts'
import WxResearchRun from './models/wx-research-run.ts'
import WxScoreResult from './models/wx-score-result.ts'

// Ingestion Data Plane (#65)
import WxSourcePolicy from './models/wx-source-policy.ts'
import WxSourceManifest from './models/wx-source-manifest.ts'
import WxSourceArtifact from './models/wx-source-artifact.ts'
import WxSourceSnapshot from './models/wx-source-snapshot.ts'

// Graph core
export * from './graph/contracts.ts'
export * from './graph/identity.ts'
export * from './graph/relation-ontology.ts'
export { WitnessGraphService } from './graph/service.ts'
export {
  findEntities,
  entityProfile,
  passageByReference,
  passageContent,
  passageTree,
  figureMentions,
  DOMAIN_QUERY_LIMITS,
  type EntityLookup,
  type EntityProfile,
  type PassageTree,
  type FigureMentionResult
} from './graph/domain-queries.ts'
export { seedWitnessGraphCore } from './seed/graph-core.ts'
export { loadDemoData } from './demo-data.ts'
export { views } from './views.ts'

// Astronomy (pure compute — no DB)
export { getMoonData, type MoonData } from './astronomy/moon-phase.ts'
export { getIslamicData, getDailyPrayerTimes, type PrayerData, type DailyPrayerTimes } from './astronomy/prayer-times.ts'
export { getSunPosition, getDuhaTime, type SunPositionData, type DuhaTimeData, type DuhaStatus } from './astronomy/sun-position.ts'

// Routes
export { registerWitnessRoutes } from './routes.ts'
export { registerWitnessEngineRoutes } from './engine-routes.ts'

// Ingestion pipeline exports (#65)
export type {
  WitnessSourceAdapter,
  ImportContext,
  NormalizedArtifact,
  NormalizedRecord,
  ValidationReport,
  ValidationFinding,
  ImportResult,
  ArtifactVerification,
  SourceKind,
  AuthorityClass,
  AllowedEngineUse,
  RevelationFamily,
  SourceLineage
} from './types/ingestion.ts'

export type {
  AnalysisFindingStatus,
  AnalysisFindingV1,
  EvidenceRef,
  EvidenceSummaryStatus,
  MizanProjectionV1,
  ReviewGateV1,
  ScoreResultV1,
  SemanticProviderMetadata,
  SourceGroundingV1,
  WitnessAnalyzeInputV1,
  WitnessAnalyzeResultV1,
  WitnessSemanticProvider,
  WitnessSemanticObservationV1
} from './types/analyze.ts'

export {
  unavailableSemanticObservation,
  validateSemanticObservation,
  WITNESS_ANALYZE_INPUT_V1,
  WITNESS_ANALYZE_RESULT_V1,
  WITNESS_SEMANTIC_OBSERVATION_V1
} from './types/analyze.ts'

export { validateAnalyzeResult } from './services/analyze-contract.ts'
export { analyzeWitness } from './services/analyze.ts'

// Reusable engine kernel (#57)
export type {
  EngineAiMetadata,
  EngineEvidenceCandidate,
  EngineEvidenceExplanation,
  EngineEvidenceReference,
  EngineFinding,
  EngineFindingCandidate,
  EngineFindingStatus,
  EngineOutputAuthorityClass,
  EngineResultDraft,
  EngineResultEnvelope,
  EngineRunRecord,
  EngineRunRequest,
  EngineRunStore,
  EngineScope,
  EngineScopeInput,
  EngineSourceRevision,
  WitnessEngineModule
} from './types/engine.ts'
export { WITNESS_ENGINE_RESULT_V1, WITNESS_ENGINE_RUNTIME_VERSION } from './types/engine.ts'
export { resolveEngineScope, checksumEngineScope } from './services/engine-scope.ts'
export { finalizeEngineResult, checksumEngineResult } from './services/engine-evidence.ts'
export { SCORE_PROFILES, getScoreProfile, score, scoreEntity, scoreRelation, scoreAssertion, scoreEvidence, scoreFinding, toEngineScore, independentEvidence, type EvidenceIndependenceInput, type WitnessScoreDimension, type WitnessScoreProfile, type WitnessScoreResult } from './services/scoring.ts'
export { persistScoreResult, type PersistScoreInput } from './services/score-store.ts'
export {
  mapLegacyResearchRecord,
  adaptLegacyResearchRecord,
  getLegacyResearchAdapter,
  legacyIdempotencyKey,
  type LegacyResearchAdapter,
  type LegacyResearchProvenance,
  type LegacyResearchRecord,
  type LegacyResearchSource,
  type WitnessLegacyCandidate
} from './services/legacy-research-adapters.ts'
export { distribution, type ResearchDistribution, type ResearchObservation } from './services/research-patterns.ts'
export { InMemoryEngineRunStore, MoonOrmEngineRunStore } from './services/engine-store.ts'
export { WitnessEngineRegistry, WitnessEngineRuntime } from './services/engine-runtime.ts'
export {
  REVELATION_FAMILIES,
  createRevelationQueryModule,
  resolveRevelationPassageContext,
  validateRevelationQueryInput,
  type RevelationContentWitness,
  type RevelationPassageContext,
  type RevelationQueryInput
} from './engines/revelation-query.ts'
export {
  buildCrossScriptureEvidenceMatrix,
  createCrossScriptureComparisonModule,
  validateCrossScriptureComparisonInput,
  type CrossScriptureComparisonInput,
  type CrossScriptureEvidenceClass,
  type CrossScriptureEvidenceEntry,
  type CrossScriptureEvidenceMatrix
} from './engines/cross-scripture.ts'
export {
  createFigureAnalysisModule,
  createTraditionTransmissionModule,
  validateFigureAnalysisInput,
  validateTraditionAnalysisInput,
  type FigureAnalysisInput,
  type TraditionAnalysisInput
} from './engines/figure-tradition.ts'
export {
  createLexicalAnalysisModule,
  validateLexicalAnalysisInput,
  type LexicalAnalysisInput
} from './engines/lexical-analysis.ts'
export {
  createConceptEvidenceModule,
  validateConceptEvidenceInput,
  type ConceptEvidenceInput
} from './engines/concept-evidence.ts'
export {
  createDivineExpressionModule,
  validateDivineExpressionInput,
  type DivineExpressionInput
} from './engines/divine-expression.ts'
export {
  createResearchHypothesisModule,
  createAiResearchSynthesisModule,
  validateResearchHypothesisInput,
  type ResearchHypothesisInput
} from './engines/research-hypothesis.ts'

export {
  planLegacyMigration,
  DEFAULT_ADAPTER_VERSION
} from './services/legacy-migration.ts'
export {
  executeLegacyMigration,
  type LegacyMigrationExecution,
  type LegacyMigrationExecutionOptions
} from './services/legacy-migration-executor.ts'

export type {
  LegacyWitnessModel,
  LegacyRecord,
  LegacyRecordBatch,
  LegacyMigrationCursor,
  LegacyMigrationOperation,
  LegacyMigrationPlan,
  MigrationOperationStatus
} from './types/migration.ts'

export {
  registerAdapter,
  getAdapter,
  listAdapters,
  clearAdapters,
  verifyArtifact,
  normalizeArtifact,
  validateNormalized,
  executeImport
} from './services/ingestion.ts'

export {
  sha256Buffer,
  sha256String,
  sha256File,
  computeFingerprint,
  computeRecordsChecksum,
  stableSerialize,
  validateArtifactPath
} from './services/hash.ts'

export {
  runBuiltinValidation,
  createReport,
  addFinding
} from './services/validation.ts'

export { FixtureAdapter, fixtureAdapter } from './adapters/fixture-adapter.ts'

// Models export
export {
  // Legacy scripture/tradition models
  WxEntity,
  WxEntityAlias,
  WxEntityIdentifier,
  WxSource,
  WxProvenance,
  WxRelationType,
  WxRelation,
  WxReligion,
  WxCommunity,
  WxScripture,
  WxScriptureBook,
  WxScriptureVerse,
  WxTradition,
  WxTraditionItem,
  WxDevotion,
  WxAsmaulHusna,
  WxBookmark,
  WxHistory,

  // Canonical Scripture / Revelation graph (#51)
  WxPassage,
  WxTextEdition,
  WxContent,
  WxRoot,
  WxLexeme,
  WxLexicalOccurrence,
  WxRevelationEvent,
  WxRevelationEventPassage,

  // Canonical Figure / Person graph (#52)
  WxFigure,
  WxFigureName,
  WxFigureRole,

  // Universal Tradition / Transmission graph (#53)
  WxTraditionCorpus,
  WxTraditionUnit,
  WxTraditionReference,
  WxTraditionAttribution,
  WxTransmissionChain,
  WxTransmissionLink,
  WxTraditionAssessment,

  // Concepts, assertions, evidence, and corpus-mined expressions (#54)
  WxConcept,
  WxAssertion,
  WxEvidence,
  WxDivineExpression,
  WxDivineExpressionOccurrence,
  WxLegacyMapping,
  WxEngineRun,
  WxEngineResult,
  WxResearchHypothesis,
  WxResearchRun,
  WxScoreResult,

  // Ingestion data plane models (#65)
  WxSourcePolicy,
  WxSourceManifest,
  WxSourceArtifact,
  WxSourceSnapshot
}

/**
 * @moon/witness — Divine Knowledge Addon
 * 
 * 📖 Scripture:  wx.scripture → wx.scripture.book → wx.scripture.verse
 * 📜 Tradition:  wx.tradition → wx.tradition.item
 * 🤲 Devotion:   wx.devotion (Adhkar, Doa, Hymns)
 * ✨ Asmaul Husna: wx.asmaul.husna (99 Names of Allah)
 * 🔖 User:       wx.bookmark, wx.history
 * 🌙 Astronomy:  getMoonData(), getIslamicData(), getDailyPrayerTimes()
 * 
 * 🔬 Ingestion (#65):
 *   wx.source.policy → wx.source.manifest → wx.source.artifact → wx.source.snapshot
 *   WitnessSourceAdapter contract, FixtureAdapter, hash/validation services
 */
export default {
  name: 'witness',
  description: 'Divine Knowledge, Scriptures, Traditions, Astronomy & Corpus Ingestion',
  depends: ['base'],
  models: [
    // Legacy models
    WxEntity,
    WxEntityAlias,
    WxEntityIdentifier,
    WxSource,
    WxProvenance,
    WxRelationType,
    WxRelation,
    WxReligion,
    WxCommunity,
    WxScripture,
    WxScriptureBook,
    WxScriptureVerse,
    WxTradition,
    WxTraditionItem,
    WxDevotion,
    WxAsmaulHusna,
    WxBookmark,
    WxHistory,

    // Canonical Scripture / Revelation graph (#51)
    WxPassage,
    WxTextEdition,
    WxContent,
    WxRoot,
    WxLexeme,
    WxLexicalOccurrence,
    WxRevelationEvent,
    WxRevelationEventPassage,

    // Canonical Figure / Person graph (#52)
    WxFigure,
    WxFigureName,
    WxFigureRole,

    // Universal Tradition / Transmission graph (#53)
    WxTraditionCorpus,
    WxTraditionUnit,
    WxTraditionReference,
    WxTraditionAttribution,
    WxTransmissionChain,
    WxTransmissionLink,
    WxTraditionAssessment,

    // Concepts, assertions, evidence, and corpus-mined expressions (#54)
    WxConcept,
    WxAssertion,
    WxEvidence,
    WxDivineExpression,
    WxDivineExpressionOccurrence,
    WxLegacyMapping,
  WxEngineRun,
  WxEngineResult,
  WxResearchHypothesis,
  WxResearchRun,
  WxScoreResult,

    // Ingestion data plane (#65)
    WxSourcePolicy,
    WxSourceManifest,
    WxSourceArtifact,
    WxSourceSnapshot
  ]
}
