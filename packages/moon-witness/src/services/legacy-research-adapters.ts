import { sha256String, stableSerialize } from './hash.js'

export type LegacyResearchSource = 'COSMIC' | 'PROPETIC' | 'DIVINE_TEXT' | 'CRAYON_RGBL'
export interface LegacyResearchRecord { id: string; payload: Record<string, unknown>; source: LegacyResearchSource; originRepo: string; originCommit: string; originPath: string; adapterVersion: string }
export interface WitnessLegacyCandidate extends LegacyResearchRecord { originChecksum: string; targetLane: 'DERIVED' | 'UNRESOLVED'; canonicalPromotion: 'NEVER_AUTOMATIC'; warnings: string[] }

/** Maps legacy research payloads without importing their scores, status, or authority. */
export function mapLegacyResearchRecord(record: LegacyResearchRecord): WitnessLegacyCandidate {
  const originChecksum = sha256String(stableSerialize(record.payload))
  const serialized = stableSerialize(record.payload).toLocaleLowerCase()
  const warnings = ['Legacy scores/status/relations are not canonical Witness semantics.']
  if (serialized.includes('ai') || serialized.includes('mock')) warnings.push('AI/mock legacy output is retained as non-evidence candidate only.')
  return { ...record, originChecksum, targetLane: 'DERIVED', canonicalPromotion: 'NEVER_AUTOMATIC', warnings }
}

export function legacyIdempotencyKey(record: LegacyResearchRecord): string {
  return `legacy:${record.source}:${record.originRepo}:${record.originCommit}:${record.originPath}:${sha256String(stableSerialize(record.payload))}:${record.adapterVersion}`
}
