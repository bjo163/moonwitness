import { sha256String, stableSerialize } from './hash.js'

export type LegacyResearchSource = 'COSMIC' | 'PROPETIC' | 'DIVINE_TEXT' | 'CRAYON_RGBL'
export type LegacyMappingKind = 'ONTOLOGY_EVIDENCE' | 'FIGURE_PROJECTION' | 'TEXTUAL_WITNESS' | 'UNKNOWN'

export interface LegacyResearchRecord {
  id: string
  payload: Record<string, unknown>
  source: LegacyResearchSource
  originRepo: string
  originCommit: string
  originPath: string
  adapterVersion: string
}

/** Provenance required to audit a legacy item without trusting its semantics. */
export interface LegacyResearchProvenance {
  originRepo: string
  originCommit: string
  originPath: string
  originChecksum: string
  adapterVersion: string
}

export interface WitnessLegacyCandidate extends LegacyResearchRecord {
  /** Exact legacy payload, retained for audit/replay and never treated as canonical data. */
  rawPayload: Record<string, unknown>
  provenance: LegacyResearchProvenance
  originChecksum: string
  targetLane: 'DERIVED' | 'UNRESOLVED'
  canonicalPromotion: 'NEVER_AUTOMATIC'
  mappingKind: LegacyMappingKind
  evidenceEligible: boolean
  /** Legacy score/status/relations stay metadata; they are not Witness score results. */
  legacyMetadata: Record<string, unknown>
  warnings: string[]
}

export interface LegacyResearchAdapter {
  source: LegacyResearchSource
  mappingKind: LegacyMappingKind
  describe(record: LegacyResearchRecord): string
  warnings(record: LegacyResearchRecord): string[]
}

const SOURCE_ADAPTERS: Record<LegacyResearchSource, LegacyResearchAdapter> = {
  COSMIC: {
    source: 'COSMIC',
    mappingKind: 'ONTOLOGY_EVIDENCE',
    describe: () => 'Cosmic ontology/evidence/source-policy fixture',
    warnings: () => ['Cosmic relations and derived evidence remain source-lane metadata; they are not canonical truth.']
  },
  PROPETIC: {
    source: 'PROPETIC',
    mappingKind: 'FIGURE_PROJECTION',
    describe: () => 'Propetic figure/name/role projection',
    warnings: () => ['Propetic identity-stack records remain versioned projections; no automatic canonical figure merge is performed.']
  },
  DIVINE_TEXT: {
    source: 'DIVINE_TEXT',
    mappingKind: 'TEXTUAL_WITNESS',
    describe: () => 'Divine Text source manifest or textual-witness fixture',
    warnings: (record) => {
      const warnings = ['Divine Text corpus identity is preserved; a modern witness is never promoted to an original revelation family.']
      if (!hasAny(record.payload, ['license', 'licenseStatus', 'license_status'])) {
        warnings.push('Divine Text item has no explicit license metadata; verify licensing before copying corpus bytes.')
      }
      return warnings
    }
  },
  CRAYON_RGBL: {
    source: 'CRAYON_RGBL',
    mappingKind: 'ONTOLOGY_EVIDENCE',
    describe: () => 'CRAYON RGBL relation/ontology fixture',
    warnings: () => ['CRAYON RGBL relations remain derived research evidence and do not create canonical semantic edges automatically.']
  }
}

function hasAny(payload: Record<string, unknown>, keys: string[]): boolean {
  return keys.some((key) => {
    const value = payload[key]
    return value !== undefined && value !== null && String(value).trim() !== ''
  })
}

function collectStrings(value: unknown, output: string[] = []): string[] {
  if (typeof value === 'string') output.push(value.toLowerCase())
  else if (Array.isArray(value)) value.forEach((item) => collectStrings(item, output))
  else if (value && typeof value === 'object') Object.values(value).forEach((item) => collectStrings(item, output))
  return output
}

function isAiOrMock(record: LegacyResearchRecord): boolean {
  const keyNames = collectStrings(Object.keys(record.payload))
  const values = collectStrings(record.payload)
  const markers = ['mock', 'fallback', 'ai-generated', 'ai_generated', 'generated-by-ai', 'generated_by_ai']
  const explicitMarker = [...keyNames, ...values].some((value) => markers.some((marker) => value.includes(marker)))
  const aiKey = keyNames.some((key) => /(^|[_-])(ai|model|generated|generator)([_-]|$)/.test(key))
  const aiValue = values.some((value) => value === 'ai' || value === 'artificial intelligence')
  return explicitMarker || (aiKey && aiValue)
}

function isUnresolved(record: LegacyResearchRecord): boolean {
  const status = String(record.payload.status ?? record.payload.state ?? '').trim().toLowerCase()
  return ['pending', 'unknown', 'unresolved', 'incomplete'].includes(status)
}

function missingProvenance(record: LegacyResearchRecord): string[] {
  return [
    ['originRepo', record.originRepo],
    ['originCommit', record.originCommit],
    ['originPath', record.originPath],
    ['adapterVersion', record.adapterVersion]
  ].filter(([, value]) => !String(value ?? '').trim()).map(([field]) => String(field))
}

function legacyMetadata(payload: Record<string, unknown>): Record<string, unknown> {
  const metadata: Record<string, unknown> = {}
  for (const key of ['score', 'legacyScore', 'status', 'state', 'relations', 'relation', 'evidenceClass', 'evidence_class', 'grade']) {
    if (payload[key] !== undefined) metadata[key] = payload[key]
  }
  return metadata
}

/**
 * Map one legacy item into an auditable candidate. This is deliberately a
 * pure boundary: it never writes canonical models or interprets legacy scores.
 */
export function mapLegacyResearchRecord(record: LegacyResearchRecord): WitnessLegacyCandidate {
  const adapter = SOURCE_ADAPTERS[record.source]
  const originChecksum = sha256String(stableSerialize(record.payload))
  const provenance: LegacyResearchProvenance = {
    originRepo: record.originRepo,
    originCommit: record.originCommit,
    originPath: record.originPath,
    originChecksum,
    adapterVersion: record.adapterVersion
  }
  const unresolved = isUnresolved(record)
  const aiOrMock = isAiOrMock(record)
  const missing = missingProvenance(record)
  const warnings = [
    'Legacy scores/status/relations are retained as metadata and are not canonical Witness semantics.',
    adapter.describe(record),
    ...adapter.warnings(record)
  ]

  if (aiOrMock) warnings.push('AI/mock legacy output is retained as non-evidence candidate only.')
  if (unresolved) warnings.push('Legacy item has unresolved status and requires review before research use.')
  if (missing.length) warnings.push(`Legacy item is missing required provenance: ${missing.join(', ')}.`)

  return {
    ...record,
    rawPayload: record.payload,
    provenance,
    originChecksum,
    targetLane: unresolved || missing.length ? 'UNRESOLVED' : 'DERIVED',
    canonicalPromotion: 'NEVER_AUTOMATIC',
    mappingKind: adapter.mappingKind,
    evidenceEligible: !aiOrMock && !unresolved && !missing.length,
    legacyMetadata: legacyMetadata(record.payload),
    warnings
  }
}

/** Explicit alias for callers processing a source-specific import batch. */
export const adaptLegacyResearchRecord = mapLegacyResearchRecord

export function getLegacyResearchAdapter(source: LegacyResearchSource): LegacyResearchAdapter {
  return SOURCE_ADAPTERS[source]
}

export function legacyIdempotencyKey(record: LegacyResearchRecord): string {
  return `legacy:${record.source}:${record.originRepo}:${record.originCommit}:${record.originPath}:${sha256String(stableSerialize(record.payload))}:${record.adapterVersion}`
}
