import { sha256String, stableSerialize } from './hash.js'

export type LegacyResearchSource = 'COSMIC' | 'PROPETIC' | 'DIVINE_TEXT' | 'CRAYON_RGBL'
export type LegacyMappingKind = 'ONTOLOGY_EVIDENCE' | 'FIGURE_PROJECTION' | 'TEXTUAL_WITNESS' | 'UNKNOWN'
export interface LegacyResearchRecord { id: string; payload: Record<string, unknown>; source: LegacyResearchSource; originRepo: string; originCommit: string; originPath: string; adapterVersion: string }
export interface WitnessLegacyCandidate extends LegacyResearchRecord { originChecksum: string; targetLane: 'DERIVED' | 'UNRESOLVED'; canonicalPromotion: 'NEVER_AUTOMATIC'; mappingKind: LegacyMappingKind; evidenceEligible: boolean; warnings: string[] }

/** Maps legacy research payloads without importing their scores, status, or authority. */
export function mapLegacyResearchRecord(record: LegacyResearchRecord): WitnessLegacyCandidate {
  const originChecksum = sha256String(stableSerialize(record.payload))
  const serialized = stableSerialize(record.payload).toLocaleLowerCase()
  const warnings = ['Legacy scores/status/relations are not canonical Witness semantics.']
  const aiOrMock = serialized.includes('ai') || serialized.includes('mock')
  const unresolved = ['pending', 'unknown', 'unresolved'].includes(String(record.payload.status ?? record.payload.state ?? '').toLowerCase())
  if (aiOrMock) warnings.push('AI/mock legacy output is retained as non-evidence candidate only.')
  if (unresolved) warnings.push('Legacy item has unresolved status and requires review before research use.')
  const mappingKind: LegacyMappingKind = record.source === 'COSMIC'
    ? 'ONTOLOGY_EVIDENCE'
    : record.source === 'PROPETIC'
      ? 'FIGURE_PROJECTION'
      : record.source === 'DIVINE_TEXT'
        ? 'TEXTUAL_WITNESS'
        : 'UNKNOWN'
  return { ...record, originChecksum, targetLane: unresolved ? 'UNRESOLVED' : 'DERIVED', canonicalPromotion: 'NEVER_AUTOMATIC', mappingKind, evidenceEligible: !aiOrMock && !unresolved, warnings }
}

export function legacyIdempotencyKey(record: LegacyResearchRecord): string {
  return `legacy:${record.source}:${record.originRepo}:${record.originCommit}:${record.originPath}:${sha256String(stableSerialize(record.payload))}:${record.adapterVersion}`
}
