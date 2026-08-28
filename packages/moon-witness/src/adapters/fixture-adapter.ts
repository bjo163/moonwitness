/**
 * Witness Ingestion — CI Test Fixture Adapter
 *
 * A minimal WitnessSourceAdapter implementation that parses a
 * simple JSON fixture format into normalized records. This adapter
 * proves the adapter contract works end-to-end without requiring
 * live external datasets.
 *
 * Fixture JSON format:
 * ```json
 * {
 *   "metadata": {
 *     "sourceCode": "test-fixture-v1",
 *     "sourceKind": "revelation_corpus",
 *     "language": "ar",
 *     "script": "Arab"
 *   },
 *   "records": [
 *     {
 *       "id": "surah:1:ayah:1",
 *       "hierarchy": ["surah_1", "ayah_1"],
 *       "text": "بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ",
 *       "fields": { "surahNumber": 1, "ayahNumber": 1 }
 *     }
 *   ]
 * }
 * ```
 *
 * Per #65: CI uses pinned legal fixtures.
 */
import type {
  WitnessSourceAdapter,
  ImportContext,
  NormalizedArtifact,
  NormalizedRecord,
  ValidationReport,
  ValidationFinding,
  SourceLineage
} from '../types/ingestion.js'
import { computeRecordsChecksum } from '../services/hash.js'

// ═══════════════════════════════════════════
// FIXTURE DATA TYPES
// ═══════════════════════════════════════════

/** Metadata section of a fixture JSON file */
interface FixtureMetadata {
  sourceCode: string
  sourceKind: string
  language: string
  script?: string
}

/** A single record in the fixture JSON */
interface FixtureRecord {
  id: string
  hierarchy: string[]
  text: string
  fields?: Record<string, unknown>
  lineage?: {
    derivationType: string
    derivedFromId?: string
    independenceKey?: string
  }
}

/** Root structure of a fixture JSON file */
interface FixtureData {
  metadata: FixtureMetadata
  records: FixtureRecord[]
}

// ═══════════════════════════════════════════
// FIXTURE ADAPTER
// ═══════════════════════════════════════════

/**
 * FixtureAdapter — CI test adapter for simple JSON fixtures.
 *
 * Implements WitnessSourceAdapter<Buffer, FixtureData> contract.
 */
export class FixtureAdapter implements WitnessSourceAdapter<Buffer, FixtureData> {
  readonly code = 'fixture-json'
  readonly version = '1.0.0'
  readonly sourceKinds = [
    'revelation_corpus' as const,
    'textual_witness' as const,
    'tradition' as const,
    'translation' as const,
    'lexical' as const,
    'metadata' as const,
    'research' as const
  ]

  /**
   * Parse raw JSON bytes into FixtureData.
   * Validates basic structure without making any domain decisions.
   */
  async parse(raw: Buffer, _ctx: ImportContext): Promise<FixtureData> {
    let text: string
    try {
      text = raw.toString('utf8')
    } catch {
      throw new Error('PARSE_ERROR: Unable to decode artifact as UTF-8')
    }

    let data: FixtureData
    try {
      data = JSON.parse(text)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err)
      throw new Error(`PARSE_ERROR: Invalid JSON — ${msg}`)
    }

    // Basic structure validation
    if (!data.metadata || typeof data.metadata !== 'object') {
      throw new Error('PARSE_ERROR: Missing or invalid "metadata" section')
    }
    if (!Array.isArray(data.records)) {
      throw new Error('PARSE_ERROR: Missing or invalid "records" array')
    }

    return data
  }

  /**
   * Normalize parsed FixtureData into deterministic NormalizedArtifact.
   *
   * Per #65 §Normalized record law:
   *   - UTF-8
   *   - Deterministic key/row ordering
   *   - Source-local identifier preserved verbatim
   *   - No locale-dependent sorting
   *   - No current timestamp/random UUID in checksum payload
   */
  async normalize(
    parsed: FixtureData,
    _ctx: ImportContext
  ): Promise<NormalizedArtifact> {
    const records: NormalizedRecord[] = parsed.records.map((r) => ({
      sourceLocalId: r.id,
      hierarchy: r.hierarchy || [],
      sourceText: r.text,
      language: parsed.metadata.language,
      script: parsed.metadata.script,
      fields: r.fields || {},
      lineage: r.lineage
        ? {
            derivationType: r.lineage.derivationType as SourceLineage['derivationType'],
            derivedFromId: r.lineage.derivedFromId,
            independenceKey: r.lineage.independenceKey
          }
        : undefined
    }))

    // Sort records by sourceLocalId for deterministic ordering
    records.sort((a, b) => a.sourceLocalId.localeCompare(b.sourceLocalId))

    const checksum = computeRecordsChecksum(
      records as unknown as Array<Record<string, unknown>>
    )

    return {
      checksum,
      parserVersion: this.version,
      normalizationVersion: '1.0',
      records,
      recordCount: records.length
    }
  }

  /**
   * Validate normalized fixture artifact.
   * Adapter-specific validation for the fixture format.
   */
  async validate(
    normalized: NormalizedArtifact,
    _ctx: ImportContext
  ): Promise<ValidationReport> {
    const findings: ValidationFinding[] = []

    // Check for empty text in records
    for (const r of normalized.records) {
      if (r.sourceText.trim() === '') {
        findings.push({
          severity: 'warning',
          code: 'FIXTURE_EMPTY_TEXT',
          message: `Fixture record '${r.sourceLocalId}' has empty text`,
          recordId: r.sourceLocalId,
          field: 'sourceText'
        })
      }
    }

    const errorCount = findings.filter((f) => f.severity === 'error').length
    const warningCount = findings.filter((f) => f.severity === 'warning').length
    const infoCount = findings.filter((f) => f.severity === 'info').length

    return {
      valid: errorCount === 0,
      findings,
      errorCount,
      warningCount,
      infoCount,
      validRecordCount: normalized.recordCount,
      invalidRecordCount: 0
    }
  }
}

/** Default singleton fixture adapter instance */
export const fixtureAdapter = new FixtureAdapter()
