import { sha256String, stableSerialize } from './hash.js'
import {
  WITNESS_ENGINE_RESULT_V1,
  type EngineConflict,
  type EngineEvidenceCandidate,
  type EngineEvidenceReference,
  type EngineFinding,
  type EngineFindingCandidate,
  type EngineFindingStatus,
  type EngineResultDraft,
  type EngineResultEnvelope,
  type EngineScope,
  type EngineUnresolved
} from '../types/engine.js'

interface FinalizeOptions {
  runId: string
  module: { code: string; version: string }
  scope: EngineScope
  aiAssisted: boolean
}

function stableKey(candidate: EngineFindingCandidate): string {
  if (candidate.key?.trim()) return candidate.key.trim()
  const payload = {
    statement: candidate.statement.trim(),
    subjectEntityId: candidate.subjectEntityId,
    predicate: candidate.predicate?.trim(),
    objectEntityId: candidate.objectEntityId,
    objectValue: candidate.objectValue?.trim()
  }
  return `finding:${sha256String(stableSerialize(payload)).slice(0, 20)}`
}

function evidenceAuthority(candidate: EngineEvidenceCandidate): EngineEvidenceReference['authorityClass'] {
  if (candidate.aiAssisted) return 'AI_ASSISTED'
  if (candidate.contentType === 'TRANSLATION' && candidate.authorityClass === 'PRIMARY_SOURCE') return 'TRANSLATION'
  if (candidate.reportId && candidate.authorityClass === 'PRIMARY_SOURCE') return 'TRANSMISSION_REPORT'
  return candidate.authorityClass
}

function plannedEvidence(
  findingKey: string,
  candidates: EngineEvidenceCandidate[] | undefined,
  unresolved: EngineUnresolved[],
  conflicts: EngineConflict[]
): EngineEvidenceReference[] {
  const evidence: EngineEvidenceReference[] = []
  const seen = new Set<string>()
  if (!candidates?.length) {
    unresolved.push({
      findingKey,
      code: 'EVIDENCE_MISSING',
      detail: 'Finding has no reproducible evidence candidates'
    })
    return evidence
  }
  for (const candidate of candidates ?? []) {
    const evidenceKey = candidate.evidenceKey?.trim()
    if (!evidenceKey || !candidate.sourceRevision?.trim() || !candidate.provenanceRef?.trim()) {
      unresolved.push({
        findingKey,
        code: 'EVIDENCE_NOT_REPRODUCIBLE',
        detail: 'Evidence requires an evidence key, source revision, and provenance reference'
      })
      continue
    }
    if (!candidate.passageId && !candidate.reportId && !candidate.entityId && !candidate.contentId) {
      unresolved.push({
        findingKey,
        code: 'EVIDENCE_TARGET_MISSING',
        detail: `Evidence ${evidenceKey} has no canonical passage, report, entity, or content target`
      })
      continue
    }
    if (seen.has(evidenceKey)) continue
    seen.add(evidenceKey)
    const normalized = { ...candidate, evidenceKey, sourceRevision: candidate.sourceRevision.trim(), provenanceRef: candidate.provenanceRef.trim(), authorityClass: evidenceAuthority(candidate) }
    evidence.push(normalized)
    if (normalized.relation === 'CONTRADICTS') {
      conflicts.push({ findingKey, evidenceKey, reason: 'CONTRADICTORY_EVIDENCE' })
    }
  }
  return evidence.sort((left, right) => left.evidenceKey.localeCompare(right.evidenceKey))
}

function authorityFor(
  requested: EngineFindingCandidate['authorityClass'],
  evidence: EngineEvidenceReference[],
  aiAssisted: boolean
): EngineFinding['authorityClass'] {
  if (aiAssisted || evidence.some((item) => item.authorityClass === 'AI_ASSISTED')) return 'AI_ASSISTED'
  if (requested !== 'PRIMARY_SOURCE') return requested ?? 'DERIVED'
  if (evidence.length && evidence.every((item) => item.authorityClass === 'PRIMARY_SOURCE')) return 'PRIMARY_SOURCE'
  if (evidence.length && evidence.every((item) => item.authorityClass === 'TRANSLATION')) return 'TRANSLATION'
  if (evidence.length && evidence.every((item) => item.authorityClass === 'TRANSMISSION_REPORT')) return 'TRANSMISSION_REPORT'
  return 'DERIVED'
}

function findingStatus(
  candidate: EngineFindingCandidate,
  evidence: EngineEvidenceReference[],
  conflict: boolean,
  unresolved: EngineUnresolved[],
  aiAssisted: boolean
): EngineFindingStatus {
  if (aiAssisted) return 'PROVISIONAL'
  if (conflict) return 'CONFLICTED'
  if (!evidence.length || unresolved.length) return 'INSUFFICIENT_EVIDENCE'
  return candidate.status ?? 'PROVISIONAL'
}

function validateScore(candidate: EngineFindingCandidate): void {
  for (const component of candidate.score?.components ?? []) {
    if (!component.code.trim() || !component.algorithmVersion.trim()) throw new Error('Score components require code and algorithmVersion')
    if (component.state === 'AVAILABLE' && (!Number.isInteger(component.valueBp) || component.valueBp! < 0 || component.valueBp! > 10000)) {
      throw new Error(`Available score component ${component.code} requires a 0..10000 basis-point value`)
    }
    if (component.state !== 'AVAILABLE' && component.valueBp !== undefined) {
      throw new Error(`Unavailable score component ${component.code} must not contain a numeric value`)
    }
  }
}

/** Plan reproducible evidence and constrain the resulting authority class. */
export function finalizeEngineResult(draft: EngineResultDraft, options: FinalizeOptions): EngineResultEnvelope {
  const conflicts: EngineConflict[] = []
  const unresolved: EngineUnresolved[] = []
  const usedKeys = new Set<string>()
  const findings = draft.findings.map((candidate) => {
    const key = stableKey(candidate)
    if (usedKeys.has(key)) throw new Error(`Duplicate engine finding key: ${key}`)
    usedKeys.add(key)
    if (!candidate.statement?.trim()) throw new Error(`Finding ${key} requires a statement`)
    validateScore(candidate)
    const localUnresolved: EngineUnresolved[] = []
    const evidence = plannedEvidence(key, candidate.evidence, localUnresolved, conflicts)
    unresolved.push(...localUnresolved)
    const conflict = conflicts.some((item) => item.findingKey === key)
    const status = findingStatus(candidate, evidence, conflict, localUnresolved, options.aiAssisted)
    const reasonCodes = [...new Set([...(candidate.unresolvedReasonCodes ?? []), ...localUnresolved.map((item) => item.code)])].sort()
    return {
      key,
      statement: candidate.statement.trim(),
      displayText: candidate.displayText?.trim() || candidate.statement.trim(),
      subjectEntityId: candidate.subjectEntityId,
      predicate: candidate.predicate?.trim(),
      objectEntityId: candidate.objectEntityId,
      objectValue: candidate.objectValue?.trim(),
      authorityClass: authorityFor(candidate.authorityClass, evidence, options.aiAssisted),
      status,
      confidenceBp: candidate.confidenceBp,
      module: { code: options.module.code, version: options.module.version, methodVersion: options.module.version },
      evidence,
      provenanceRefs: [...new Set(evidence.map((item) => item.provenanceRef))].sort(),
      unresolvedReasonCodes: reasonCodes,
      score: candidate.score
    } satisfies EngineFinding
  }).sort((left, right) => left.key.localeCompare(right.key))

  const provenanceRefs = [...new Set(findings.flatMap((finding) => finding.provenanceRefs))].sort()
  return {
    protocol: WITNESS_ENGINE_RESULT_V1,
    runId: options.runId,
    summary: draft.summary.trim(),
    findings,
    conflicts: conflicts.sort((left, right) => stableSerialize(left).localeCompare(stableSerialize(right))),
    unresolved: unresolved.sort((left, right) => stableSerialize(left).localeCompare(stableSerialize(right))),
    sourceRevisions: options.scope.sourceRevisions,
    provenanceSummary: { evidenceCount: findings.reduce((count, finding) => count + finding.evidence.length, 0), provenanceRefs },
    diagnostics: [...new Set(draft.diagnostics ?? [])].sort()
  }
}

/** Run IDs are execution metadata; they never influence a deterministic result checksum. */
export function checksumEngineResult(result: EngineResultEnvelope): string {
  const { runId: _runId, ...checksumPayload } = result
  return sha256String(stableSerialize(checksumPayload))
}
