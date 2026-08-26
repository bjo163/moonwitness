import WxScripture from './models/wx-scripture.js'
import WxScriptureBook from './models/wx-scripture-book.js'
import WxScriptureVerse from './models/wx-scripture-verse.js'
import WxTradition from './models/wx-tradition.js'
import WxTraditionItem from './models/wx-tradition-item.js'
import WxDevotion from './models/wx-devotion.js'
import WxAsmaulHusna from './models/wx-asmaul-husna.js'
import WxBookmark from './models/wx-bookmark.js'
import WxHistory from './models/wx-history.js'

// Ingestion Data Plane (#65)
import WxSourcePolicy from './models/wx-source-policy.js'
import WxSourceManifest from './models/wx-source-manifest.js'
import WxSourceArtifact from './models/wx-source-artifact.js'
import WxSourceSnapshot from './models/wx-source-snapshot.js'

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
  WxScripture,
  WxScriptureBook,
  WxScriptureVerse,
  WxTradition,
  WxTraditionItem,
  WxDevotion,
  WxAsmaulHusna,
  WxBookmark,
  WxHistory,

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
    WxScripture,
    WxScriptureBook,
    WxScriptureVerse,
    WxTradition,
    WxTraditionItem,
    WxDevotion,
    WxAsmaulHusna,
    WxBookmark,
    WxHistory,

    // Ingestion data plane (#65)
    WxSourcePolicy,
    WxSourceManifest,
    WxSourceArtifact,
    WxSourceSnapshot
  ]
}
