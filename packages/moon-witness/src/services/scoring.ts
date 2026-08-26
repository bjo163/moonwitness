import { sha256String, stableSerialize } from './hash.js'
import type { EngineScoreBreakdown } from '../types/engine.js'

export type WitnessScoreState = 'AVAILABLE' | 'INSUFFICIENT' | 'NOT_APPLICABLE'
export interface WitnessScoreDimension { code: string; state: WitnessScoreState; value?: number; weight?: number; evidenceRefs: string[]; reasonCodes: string[] }
export interface WitnessScoreProfile { code: string; version: string; weights: Record<string, number>; minimumCoverage: number }
export interface WitnessScoreResult { profileCode: string; profileVersion: string; dimensions: WitnessScoreDimension[]; composite?: number; coverage: number; status: 'COMPLETE' | 'PARTIAL' | 'INSUFFICIENT' | 'CONFLICTED'; formulaFingerprint: string }
export interface EvidenceIndependenceInput { evidenceKey: string; sourceKey: string; provenanceRef: string; canonicalContentId?: number; derivedFromContentId?: number }

/** Deduplicates editions/translations that descend from one canonical witness. */
export function independentEvidence<T extends EvidenceIndependenceInput>(evidence: T[]): T[] {
  const seen = new Set<string>()
  return [...evidence].sort((a, b) => a.evidenceKey.localeCompare(b.evidenceKey)).filter((item) => {
    const lineage = item.derivedFromContentId ?? item.canonicalContentId ?? item.provenanceRef
    const key = `${item.sourceKey}\u0000${lineage}`
    if (seen.has(key)) return false
    seen.add(key); return true
  })
}

export const SCORE_PROFILES: Record<string, WitnessScoreProfile> = {
  source_reliability_v1: { code: 'source_reliability', version: '1.0.0', weights: { SOURCE_AUTHORITY: 30, PROVENANCE_QUALITY: 40, TEXTUAL_INTEGRITY: 30 }, minimumCoverage: 0.6 },
  relation_confidence_v1: { code: 'relation_confidence', version: '1.0.0', weights: { SOURCE_AUTHORITY: 25, PROVENANCE_QUALITY: 25, EVIDENCE_DIRECTNESS: 30, RELATION_CONFIDENCE: 20 }, minimumCoverage: 0.6 },
  research_hypothesis_v1: { code: 'research_hypothesis', version: '1.0.0', weights: { COVERAGE: 50, AGREEMENT: 50 }, minimumCoverage: 0.5 },
  figure_identity_v1: { code: 'figure_identity', version: '1.0.0', weights: { IDENTITY_CONFIDENCE: 40, PROVENANCE_QUALITY: 30, ATTRIBUTION_CONFIDENCE: 30 }, minimumCoverage: 0.6 },
  tradition_transmission_v1: { code: 'tradition_transmission', version: '1.0.0', weights: { TRANSMISSION_SUPPORT: 40, PROVENANCE_QUALITY: 30, COVERAGE: 30 }, minimumCoverage: 0.6 },
  hadith_analysis_v1: { code: 'hadith_analysis', version: '1.0.0', weights: { TRANSMISSION_SUPPORT: 40, AGREEMENT: 30, COVERAGE: 30 }, minimumCoverage: 0.6 },
  lexical_match_v1: { code: 'lexical_match', version: '1.0.0', weights: { LEXICAL_CONFIDENCE: 60, PROVENANCE_QUALITY: 40 }, minimumCoverage: 0.6 },
  concept_evidence_v1: { code: 'concept_evidence', version: '1.0.0', weights: { SEMANTIC_CONFIDENCE: 40, EVIDENCE_DIRECTNESS: 30, AGREEMENT: 30 }, minimumCoverage: 0.6 },
  cross_scripture_v1: { code: 'cross_scripture', version: '1.0.0', weights: { CROSS_SOURCE_SUPPORT: 40, EVIDENCE_DIRECTNESS: 30, AGREEMENT: 30 }, minimumCoverage: 0.6 }
}

export function getScoreProfile(key: string): WitnessScoreProfile {
  const profile = SCORE_PROFILES[key]
  if (!profile) throw new Error(`Unknown scoring profile: ${key}`)
  return { ...profile, weights: { ...profile.weights } }
}

export function scoreEntity(input: { identity?: number; provenance?: number; coverage?: number }, profile = SCORE_PROFILES.figure_identity_v1): WitnessScoreResult {
  return score(profile, [
    { code: 'IDENTITY_CONFIDENCE', state: input.identity === undefined ? 'INSUFFICIENT' : 'AVAILABLE', value: input.identity, evidenceRefs: [], reasonCodes: input.identity === undefined ? ['IDENTITY_MISSING'] : [] },
    { code: 'PROVENANCE_QUALITY', state: input.provenance === undefined ? 'INSUFFICIENT' : 'AVAILABLE', value: input.provenance, evidenceRefs: [], reasonCodes: input.provenance === undefined ? ['PROVENANCE_MISSING'] : [] },
    { code: 'COVERAGE', state: input.coverage === undefined ? 'NOT_APPLICABLE' : 'AVAILABLE', value: input.coverage, evidenceRefs: [], reasonCodes: [] }
  ])
}

export function scoreRelation(input: { authority?: number; provenance?: number; directness?: number; confidence?: number }, profile = SCORE_PROFILES.relation_confidence_v1): WitnessScoreResult {
  return score(profile, [['SOURCE_AUTHORITY', input.authority], ['PROVENANCE_QUALITY', input.provenance], ['EVIDENCE_DIRECTNESS', input.directness], ['RELATION_CONFIDENCE', input.confidence]].map(([code, value]) => ({ code, state: value === undefined ? 'INSUFFICIENT' : 'AVAILABLE', value, evidenceRefs: [], reasonCodes: value === undefined ? [`${code}_MISSING`] : [] })) as WitnessScoreDimension[])
}

export function score(profile: WitnessScoreProfile, dimensions: WitnessScoreDimension[]): WitnessScoreResult {
  const normalized = [...dimensions].sort((a, b) => a.code.localeCompare(b.code))
  for (const item of normalized) {
    if (!item.code.trim() || !Array.isArray(item.evidenceRefs) || !Array.isArray(item.reasonCodes)) throw new Error('Score dimensions require code, evidenceRefs, and reasonCodes')
    if (item.state === 'AVAILABLE' && (!Number.isFinite(item.value) || item.value! < 0 || item.value! > 100)) throw new Error(`Available score ${item.code} requires 0..100 value`)
    if (item.state !== 'AVAILABLE' && item.value !== undefined) throw new Error(`Unavailable score ${item.code} must not have a value`)
  }
  const applicable = normalized.filter((item) => item.state !== 'NOT_APPLICABLE')
  const available = applicable.filter((item) => item.state === 'AVAILABLE')
  const coverage = applicable.length ? available.length / applicable.length : 0
  const totalWeight = available.reduce((sum, item) => sum + (item.weight ?? profile.weights[item.code] ?? 0), 0)
  const composite = totalWeight ? available.reduce((sum, item) => sum + item.value! * (item.weight ?? profile.weights[item.code] ?? 0), 0) / totalWeight : undefined
  const conflicted = normalized.some((item) => item.code === 'CONFLICT_PENALTY' && item.state === 'AVAILABLE' && item.value! > 0)
  const status = conflicted ? 'CONFLICTED' : coverage < profile.minimumCoverage ? 'INSUFFICIENT' : available.length < applicable.length ? 'PARTIAL' : 'COMPLETE'
  return { profileCode: profile.code, profileVersion: profile.version, dimensions: normalized, composite, coverage, status, formulaFingerprint: sha256String(stableSerialize({ profile, dimensions: normalized.map(({ evidenceRefs, reasonCodes, ...item }) => item) })) }
}

/** Converts the universal 0..100 vector to the engine's lossless basis-point contract. */
export function toEngineScore(result: WitnessScoreResult): EngineScoreBreakdown {
  return { algorithmVersion: result.profileVersion, profileCode: result.profileCode, profileVersion: result.profileVersion, compositeBp: result.composite === undefined ? undefined : Math.round(result.composite * 100), coverageBp: Math.round(result.coverage * 10000), formulaFingerprint: result.formulaFingerprint, components: result.dimensions.map((item) => ({ code: item.code, algorithmVersion: result.profileVersion, valueBp: item.value === undefined ? undefined : Math.round(item.value * 100), evidenceRefs: item.evidenceRefs, state: item.state })) }
}
