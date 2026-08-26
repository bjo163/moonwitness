/**
 * Witness Ingestion Pipeline — TypeScript Contracts
 *
 * Defines the adapter contract and supporting types for the
 * deterministic corpus ingestion pipeline per #65 §Source adapters
 * and #64 v1.4 architecture contract.
 *
 * Key invariants:
 *   - Same raw artifact + same parser version + same normalization schema
 *     MUST produce byte-for-byte identical normalized output
 *   - Parser/normalizer never decides theological/source equivalence
 *   - No fuzzy person merge, no semantic similarity edges
 *   - Source-local identifiers preserved verbatim
 */
import type { Ctx } from '@moon/orm'

// ═══════════════════════════════════════════
// SOURCE POLICY
// ═══════════════════════════════════════════

/** Source kinds that a manifest can declare */
export type SourceKind =
  | 'revelation_corpus'
  | 'textual_witness'
  | 'tradition'
  | 'translation'
  | 'lexical'
  | 'metadata'
  | 'research'

/** Authority classification for source policy */
export type AuthorityClass =
  | 'REVELATION'
  | 'TRADITION'
  | 'INTERPRETIVE'
  | 'RESEARCH'
  | 'EXCLUDED'

/** Allowed engine use modes */
export type AllowedEngineUse =
  | 'NORMATIVE_CORE'
  | 'COMPLEMENTARY_REFERENCE'
  | 'CONTEXTUAL'
  | 'RESEARCH_ONLY'
  | 'EXCLUDED'

/** Revelation family identifiers */
export type RevelationFamily = 'QURAN' | 'TAWRAT' | 'ZABUR' | 'INJIL'

// ═══════════════════════════════════════════
// IMPORT CONTEXT
// ═══════════════════════════════════════════

/** Context passed to adapter methods during import execution */
export interface ImportContext {
  /** Database environment / ORM context */
  env: Ctx
  /** Manifest database ID */
  manifestId: number
  /** Snapshot database ID (created at import start) */
  snapshotId: number
  /** Manifest code for logging */
  manifestCode: string
  /** Source kind classification */
  sourceKind: SourceKind
  /** Revelation family context if applicable */
  revelationFamily?: RevelationFamily
  /** Policy authority class */
  authorityClass: AuthorityClass
  /** Parser version string */
  parserVersion: string
  /** Normalization schema version */
  normalizationVersion: string
}

// ═══════════════════════════════════════════
// NORMALIZED RECORDS
// ═══════════════════════════════════════════

/**
 * A single normalized record from the source corpus.
 *
 * Per #65 §Normalized record law:
 *   - UTF-8
 *   - Deterministic key/row ordering
 *   - Source-local identifier preserved verbatim
 *   - Source hierarchy preserved
 *   - Original text preserved separately from search-normalized forms
 */
export interface NormalizedRecord {
  /** Source-local identifier preserved verbatim (e.g. 'surah:2:ayah:255') */
  sourceLocalId: string

  /** Source hierarchy path (e.g. ['quran', 'surah_2', 'ayah_255']) */
  hierarchy: string[]

  /** Original source text — never destructively normalized */
  sourceText: string

  /**
   * Derived search-normalized text for indexing.
   * Algorithm/version tracked separately; never replaces sourceText.
   */
  searchNormalizedText?: string

  /** ISO language code of the source text */
  language: string

  /** ISO script code (e.g. 'Arab', 'Latn') */
  script?: string

  /** Extended structured fields specific to the source kind */
  fields: Record<string, unknown>

  /**
   * Source derivation/lineage metadata.
   * Captures: derived from edition X, translation of content Y, etc.
   * Per #65 §Source-lineage / independence metadata.
   */
  lineage?: SourceLineage
}

/** Source derivation chain for independence/dedup */
export interface SourceLineage {
  /** Type of derivation relationship */
  derivationType: 'original' | 'edition' | 'translation' | 'reprint' | 'mirror' | 'excerpt'

  /** Identifier of the upstream source this was derived from */
  derivedFromId?: string

  /** Stable lineage/independence key for cross-source dedup */
  independenceKey?: string
}

/**
 * Deterministic normalized artifact — the output of normalization.
 *
 * Same raw + same parser version + same norm schema = identical checksum.
 */
export interface NormalizedArtifact {
  /** SHA-256 of the normalized output bytes */
  checksum: string

  /** Parser version that produced this normalization */
  parserVersion: string

  /** Normalization schema version */
  normalizationVersion: string

  /** Ordered normalized records */
  records: NormalizedRecord[]

  /** Total record count */
  recordCount: number
}

// ═══════════════════════════════════════════
// VALIDATION
// ═══════════════════════════════════════════

/** Severity levels for validation findings */
export type ValidationSeverity = 'error' | 'warning' | 'info'

/** A single validation finding */
export interface ValidationFinding {
  /** Severity level */
  severity: ValidationSeverity

  /** Machine-readable error code */
  code: string

  /** Human-readable message */
  message: string

  /** Source-local ID of the affected record, if applicable */
  recordId?: string

  /** Field name, if applicable */
  field?: string
}

/**
 * Validation report — produced by adapter.validate() before
 * any canonical domain mutation.
 *
 * Per #65 §Validation:
 *   - Invalid import must not partially mutate canonical Witness graph
 */
export interface ValidationReport {
  /** Overall validity — false blocks import */
  valid: boolean

  /** All findings (errors, warnings, info) */
  findings: ValidationFinding[]

  /** Count summaries */
  errorCount: number
  warningCount: number
  infoCount: number

  /** Records that passed validation */
  validRecordCount: number

  /** Records that failed validation */
  invalidRecordCount: number
}

// ═══════════════════════════════════════════
// SOURCE ADAPTER CONTRACT
// ═══════════════════════════════════════════

/**
 * WitnessSourceAdapter — the core adapter contract.
 *
 * Per #65 §Source adapters:
 *   - Adapters are source-specific
 *   - Do not create one parser full of corpus-name conditionals
 *   - Each adapter declares its code, version, and supported source kinds
 *
 * @template Raw - The raw input type (Buffer, string, ReadableStream, etc.)
 * @template Parsed - The intermediate parsed representation
 */
export interface WitnessSourceAdapter<Raw = Buffer, Parsed = unknown> {
  /** Unique adapter code (e.g. 'quran-uthmani', 'bukhari-hadith') */
  code: string

  /** Adapter version string — version change → different normalized identity */
  version: string

  /** Source kinds this adapter can handle */
  sourceKinds: SourceKind[]

  /**
   * Parse raw artifact bytes into an intermediate representation.
   * Must not perform any normalization or domain-level decisions.
   */
  parse(raw: Raw, ctx: ImportContext): Promise<Parsed>

  /**
   * Normalize parsed data into deterministic NormalizedArtifact.
   *
   * MUST produce byte-for-byte identical output given same input +
   * same parser version + same normalization schema version.
   *
   * MUST NOT:
   *   - Use locale-dependent sorting
   *   - Embed current timestamp or random UUIDs in checksum payload
   *   - Decide theological/source equivalence
   *   - Perform fuzzy person merge
   *   - Create semantic similarity edges
   */
  normalize(parsed: Parsed, ctx: ImportContext): Promise<NormalizedArtifact>

  /**
   * Validate normalized artifact BEFORE any canonical domain mutation.
   * Returns a report; if report.valid === false, import is blocked.
   */
  validate(
    normalized: NormalizedArtifact,
    ctx: ImportContext
  ): Promise<ValidationReport>
}

// ═══════════════════════════════════════════
// INGESTION SERVICE TYPES
// ═══════════════════════════════════════════

/** Artifact verification result */
export interface ArtifactVerification {
  /** Whether the artifact SHA-256 matches the manifest declaration */
  valid: boolean
  /** Computed SHA-256 of the raw artifact */
  computedSha256: string
  /** Expected SHA-256 from manifest */
  expectedSha256: string
  /** File size in bytes */
  fileSize: number
  /** MIME type detected */
  mimeType: string
}

/** Import execution result */
export interface ImportResult {
  /** Snapshot database ID */
  snapshotId: number
  /** Import status */
  status: 'completed' | 'failed' | 'rolled_back'
  /** Composite fingerprint */
  fingerprint: string
  /** Normalized artifact checksum */
  normalizedChecksum: string
  /** Record count summaries */
  recordsProcessed: number
  recordsCreated: number
  recordsUpdated: number
  recordsSkipped: number
  recordsRejected: number
  /** Validation report */
  validation: ValidationReport
  /** Diagnostics messages */
  diagnostics: string[]
}
