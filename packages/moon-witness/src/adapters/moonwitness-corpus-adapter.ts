/**
 * Witness Ingestion — Moonwitness Corpus Release Adapter
 *
 * Dedicated adapter for parsing and normalizing immutable release artifacts
 * from the `moonwitness-corpus` repository.
 *
 * Key invariants:
 *   - Byte-for-byte deterministic normalized output given same input
 *   - Verbatim preservation of source-local IDs and canonical text
 *   - Separation of canonical text from search projections and translations
 *   - Strict preservation of source lineage and provenance
 */
import type {
  WitnessSourceAdapter,
  ImportContext,
  NormalizedArtifact,
  NormalizedRecord,
  ValidationReport,
  ValidationFinding,
  SourceKind,
  SourceLineage
} from '../types/ingestion.js'
import { computeRecordsChecksum } from '../services/hash.js'
import { createReport, addFinding, finalizeReport } from '../services/validation.js'

export interface CorpusReleaseMetadata {
  corpus: string
  version: string
  commit?: string
  schemaVersion: string
  license?: string
  publisher?: string
  source: {
    code: string
    name: string
    sourceClass?: string
    authorityClass?: string
    scriptureFamily?: string
    language: string
    script?: string
  }
  edition?: {
    code: string
    name: string
    editionType?: 'original' | 'edition' | 'translation' | 'commentary'
    translator?: string
    year?: number | string
  }
}

export interface CorpusEntryRecord {
  id: string
  hierarchy: string[]
  text: string
  searchNormalizedText?: string
  language?: string
  script?: string
  fields?: Record<string, unknown>
  lineage?: SourceLineage
  translations?: Array<{
    language: string
    text: string
    translator?: string
    editionCode?: string
  }>
}

export interface CorpusReleasePayload {
  release: CorpusReleaseMetadata
  records: CorpusEntryRecord[]
}

export class MoonwitnessCorpusAdapter
  implements WitnessSourceAdapter<Buffer, CorpusReleasePayload> {
  readonly code = 'moonwitness-corpus'
  readonly version = '1.0.0'
  readonly sourceKinds: SourceKind[] = [
    'revelation_corpus',
    'textual_witness',
    'tradition',
    'translation',
    'lexical',
    'metadata',
    'research'
  ]

  /**
   * Parse raw JSON buffer into CorpusReleasePayload.
   * Does not perform normalization or domain decisions.
   */
  async parse(raw: Buffer, _ctx: ImportContext): Promise<CorpusReleasePayload> {
    let rawText: string
    try {
      rawText = raw.toString('utf8')
    } catch {
      throw new Error('Failed to decode raw artifact buffer as UTF-8')
    }

    let parsed: unknown
    try {
      parsed = JSON.parse(rawText)
    } catch (err: any) {
      throw new Error(`Corpus artifact is not valid JSON: ${err.message}`)
    }

    if (!parsed || typeof parsed !== 'object') {
      throw new Error('Corpus artifact root must be a JSON object')
    }

    const payload = parsed as Record<string, unknown>
    if (!payload.release || typeof payload.release !== 'object') {
      throw new Error('Corpus artifact missing required "release" metadata object')
    }
    if (!Array.isArray(payload.records)) {
      throw new Error('Corpus artifact missing required "records" array')
    }

    return payload as unknown as CorpusReleasePayload
  }

  /**
   * Normalize parsed corpus entries into deterministic NormalizedArtifact.
   */
  async normalize(
    parsed: CorpusReleasePayload,
    ctx: ImportContext
  ): Promise<NormalizedArtifact> {
    const defaultLang = parsed.release.source.language || 'ar'
    const defaultScript = parsed.release.source.script || undefined

    const normalizedRecords: NormalizedRecord[] = parsed.records.map((entry) => {
      const rec: NormalizedRecord = {
        sourceLocalId: String(entry.id).trim(),
        hierarchy: Array.isArray(entry.hierarchy)
          ? entry.hierarchy.map(String)
          : [String(entry.id)],
        sourceText: String(entry.text || ''),
        language: entry.language || defaultLang,
        script: entry.script || defaultScript,
        fields: {
          ...(entry.fields || {}),
          corpusCode: parsed.release.corpus,
          corpusVersion: parsed.release.version,
          corpusCommit: parsed.release.commit || '',
          sourceCode: parsed.release.source.code,
          sourceName: parsed.release.source.name,
          editionCode: parsed.release.edition?.code || parsed.release.source.code,
          editionName: parsed.release.edition?.name || parsed.release.source.name,
          editionType: parsed.release.edition?.editionType || 'original',
          translator: parsed.release.edition?.translator || null,
          translations: entry.translations || []
        },
        lineage: entry.lineage || {
          derivationType: parsed.release.edition?.editionType === 'translation'
            ? 'translation'
            : 'original',
          derivedFromId: parsed.release.source.code
        }
      }

      if (entry.searchNormalizedText) {
        rec.searchNormalizedText = String(entry.searchNormalizedText)
      }

      return rec
    })

    // Sort records deterministically by sourceLocalId
    normalizedRecords.sort((a, b) =>
      a.sourceLocalId.localeCompare(b.sourceLocalId, 'en', { numeric: true })
    )

    const checksum = computeRecordsChecksum(
      normalizedRecords as unknown as Record<string, unknown>[]
    )

    return {
      checksum,
      parserVersion: this.version,
      normalizationVersion: ctx.normalizationVersion || '1.0',
      records: normalizedRecords,
      recordCount: normalizedRecords.length
    }
  }

  /**
   * Validate normalized records before any database mutation.
   */
  async validate(
    normalized: NormalizedArtifact,
    _ctx: ImportContext
  ): Promise<ValidationReport> {
    const report = createReport()
    const seenIds = new Set<string>()
    const invalidIds = new Set<string>()

    if (normalized.recordCount === 0) {
      addFinding(report, {
        severity: 'error',
        code: 'CORPUS_EMPTY',
        message: 'Normalized artifact contains 0 records'
      })
    }

    for (let i = 0; i < normalized.records.length; i++) {
      const rec = normalized.records[i]!

      // 1. Validate ID
      if (!rec.sourceLocalId || rec.sourceLocalId.trim() === '') {
        addFinding(report, {
          severity: 'error',
          code: 'MISSING_RECORD_ID',
          message: `Record at index ${i} has empty sourceLocalId`,
          recordId: `[index:${i}]`
        })
        invalidIds.add(`[index:${i}]`)
      } else if (seenIds.has(rec.sourceLocalId)) {
        addFinding(report, {
          severity: 'error',
          code: 'DUPLICATE_LOCAL_ID',
          message: `Duplicate sourceLocalId '${rec.sourceLocalId}' found`,
          recordId: rec.sourceLocalId
        })
        invalidIds.add(rec.sourceLocalId)
      } else {
        seenIds.add(rec.sourceLocalId)
      }

      // 2. Validate source text
      if (!rec.sourceText || rec.sourceText.trim() === '') {
        addFinding(report, {
          severity: 'error',
          code: 'EMPTY_SOURCE_TEXT',
          message: `Record '${rec.sourceLocalId}' has empty sourceText`,
          recordId: rec.sourceLocalId,
          field: 'sourceText'
        })
        invalidIds.add(rec.sourceLocalId)
      }

      // 3. Validate language code
      if (!rec.language || rec.language.length < 2) {
        addFinding(report, {
          severity: 'error',
          code: 'INVALID_LANGUAGE',
          message: `Record '${rec.sourceLocalId}' has invalid language code '${rec.language}'`,
          recordId: rec.sourceLocalId,
          field: 'language'
        })
        invalidIds.add(rec.sourceLocalId)
      }

      // 4. Validate hierarchy
      if (!rec.hierarchy || rec.hierarchy.length === 0) {
        addFinding(report, {
          severity: 'warning',
          code: 'EMPTY_HIERARCHY',
          message: `Record '${rec.sourceLocalId}' has empty hierarchy path`,
          recordId: rec.sourceLocalId,
          field: 'hierarchy'
        })
      }
    }

    return finalizeReport(report, normalized.recordCount, invalidIds)
  }
}

export const moonwitnessCorpusAdapter = new MoonwitnessCorpusAdapter()
