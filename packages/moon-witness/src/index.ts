import WxEntity from './models/wx-entity.js'
import WxEntityAlias from './models/wx-entity-alias.js'
import WxEntityIdentifier from './models/wx-entity-identifier.js'
import WxSource from './models/wx-source.js'
import WxProvenance from './models/wx-provenance.js'
import WxRelationType from './models/wx-relation-type.js'
import WxRelation from './models/wx-relation.js'
import WxReligion from './models/wx-religion.js'
import WxCommunity from './models/wx-community.js'
import WxScripture from './models/wx-scripture.js'
import WxScriptureBook from './models/wx-scripture-book.js'
import WxScriptureVerse from './models/wx-scripture-verse.js'
import WxTradition from './models/wx-tradition.js'
import WxTraditionItem from './models/wx-tradition-item.js'
import WxDevotion from './models/wx-devotion.js'
import WxAsmaulHusna from './models/wx-asmaul-husna.js'
import WxBookmark from './models/wx-bookmark.js'
import WxHistory from './models/wx-history.js'
import WxPassage from './models/wx-passage.js'
import WxTextEdition from './models/wx-text-edition.js'
import WxContent from './models/wx-content.js'
import WxRoot from './models/wx-root.js'
import WxLexeme from './models/wx-lexeme.js'
import WxLexicalOccurrence from './models/wx-lexical-occurrence.js'
import WxRevelationEvent from './models/wx-revelation-event.js'
import WxRevelationEventPassage from './models/wx-revelation-event-passage.js'
import WxFigure from './models/wx-figure.js'
import WxFigureName from './models/wx-figure-name.js'
import WxFigureRole from './models/wx-figure-role.js'
import WxTraditionCorpus from './models/wx-tradition-corpus.js'
import WxTraditionUnit from './models/wx-tradition-unit.js'
import WxTraditionReference from './models/wx-tradition-reference.js'
import WxTraditionAttribution from './models/wx-tradition-attribution.js'
import WxTransmissionChain from './models/wx-transmission-chain.js'
import WxTransmissionLink from './models/wx-transmission-link.js'
import WxTraditionAssessment from './models/wx-tradition-assessment.js'
import WxConcept from './models/wx-concept.js'
import WxAssertion from './models/wx-assertion.js'
import WxEvidence from './models/wx-evidence.js'
import WxDivineExpression from './models/wx-divine-expression.js'
import WxDivineExpressionOccurrence from './models/wx-divine-expression-occurrence.js'
import WxLegacyMapping from './models/wx-legacy-mapping.js'
import WxEngineRun from './models/wx-engine-run.js'
import WxEngineResult from './models/wx-engine-result.js'
import WxResearchHypothesis from './models/wx-research-hypothesis.js'
import WxResearchRun from './models/wx-research-run.js'

// Ingestion Data Plane (#65)
import WxSourcePolicy from './models/wx-source-policy.js'
import WxSourceManifest from './models/wx-source-manifest.js'
import WxSourceArtifact from './models/wx-source-artifact.js'
import WxSourceSnapshot from './models/wx-source-snapshot.js'

// Graph core
export * from './graph/contracts.js'
export * from './graph/identity.js'
export * from './graph/relation-ontology.js'
export { WitnessGraphService } from './graph/service.js'
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
} from './graph/domain-queries.js'
export { seedWitnessGraphCore } from './seed/graph-core.js'

// Astronomy (pure compute — no DB)
export { getMoonData, type MoonData } from './astronomy/moon-phase.js'
export { getIslamicData, getDailyPrayerTimes, type PrayerData, type DailyPrayerTimes } from './astronomy/prayer-times.js'
export { getSunPosition, getDuhaTime, type SunPositionData, type DuhaTimeData, type DuhaStatus } from './astronomy/sun-position.js'

// Routes
export { registerWitnessRoutes } from './routes.js'

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
} from './types/ingestion.js'

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
} from './types/analyze.js'

export {
  unavailableSemanticObservation,
  validateSemanticObservation,
  WITNESS_ANALYZE_INPUT_V1,
  WITNESS_ANALYZE_RESULT_V1,
  WITNESS_SEMANTIC_OBSERVATION_V1
} from './types/analyze.js'

export { validateAnalyzeResult } from './services/analyze-contract.js'
export { analyzeWitness } from './services/analyze.js'

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
} from './types/engine.js'
export { WITNESS_ENGINE_RESULT_V1, WITNESS_ENGINE_RUNTIME_VERSION } from './types/engine.js'
export { resolveEngineScope, checksumEngineScope } from './services/engine-scope.js'
export { finalizeEngineResult, checksumEngineResult } from './services/engine-evidence.js'
export { SCORE_PROFILES, score, toEngineScore, type WitnessScoreDimension, type WitnessScoreProfile, type WitnessScoreResult } from './services/scoring.js'
export { InMemoryEngineRunStore, MoonOrmEngineRunStore } from './services/engine-store.js'
export { WitnessEngineRegistry, WitnessEngineRuntime } from './services/engine-runtime.js'
export {
  REVELATION_FAMILIES,
  createRevelationQueryModule,
  resolveRevelationPassageContext,
  validateRevelationQueryInput,
  type RevelationContentWitness,
  type RevelationPassageContext,
  type RevelationQueryInput
} from './engines/revelation-query.js'
export {
  buildCrossScriptureEvidenceMatrix,
  createCrossScriptureComparisonModule,
  validateCrossScriptureComparisonInput,
  type CrossScriptureComparisonInput,
  type CrossScriptureEvidenceClass,
  type CrossScriptureEvidenceEntry,
  type CrossScriptureEvidenceMatrix
} from './engines/cross-scripture.js'
export {
  createFigureAnalysisModule,
  createTraditionTransmissionModule,
  validateFigureAnalysisInput,
  validateTraditionAnalysisInput,
  type FigureAnalysisInput,
  type TraditionAnalysisInput
} from './engines/figure-tradition.js'
export {
  createLexicalAnalysisModule,
  validateLexicalAnalysisInput,
  type LexicalAnalysisInput
} from './engines/lexical-analysis.js'
export {
  createConceptEvidenceModule,
  validateConceptEvidenceInput,
  type ConceptEvidenceInput
} from './engines/concept-evidence.js'
export {
  createDivineExpressionModule,
  validateDivineExpressionInput,
  type DivineExpressionInput
} from './engines/divine-expression.js'
export {
  createResearchHypothesisModule,
  createAiResearchSynthesisModule,
  validateResearchHypothesisInput,
  type ResearchHypothesisInput
} from './engines/research-hypothesis.js'

export {
  planLegacyMigration,
  DEFAULT_ADAPTER_VERSION
} from './services/legacy-migration.js'
export {
  executeLegacyMigration,
  type LegacyMigrationExecution,
  type LegacyMigrationExecutionOptions
} from './services/legacy-migration-executor.js'

export type {
  LegacyWitnessModel,
  LegacyRecord,
  LegacyRecordBatch,
  LegacyMigrationCursor,
  LegacyMigrationOperation,
  LegacyMigrationPlan,
  MigrationOperationStatus
} from './types/migration.js'

export {
  registerAdapter,
  getAdapter,
  listAdapters,
  clearAdapters,
  verifyArtifact,
  normalizeArtifact,
  validateNormalized,
  executeImport
} from './services/ingestion.js'

export {
  sha256Buffer,
  sha256String,
  sha256File,
  computeFingerprint,
  computeRecordsChecksum,
  stableSerialize,
  validateArtifactPath
} from './services/hash.js'

export {
  runBuiltinValidation,
  createReport,
  addFinding
} from './services/validation.js'

export { FixtureAdapter, fixtureAdapter } from './adapters/fixture-adapter.js'

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

    // Ingestion data plane (#65)
    WxSourcePolicy,
    WxSourceManifest,
    WxSourceArtifact,
    WxSourceSnapshot
  ]
}
