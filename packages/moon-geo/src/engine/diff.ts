export type CandidatePolicy = 'AUTO_SAFE' | 'REVIEW_REQUIRED' | 'BLOCKED'

export interface GeoDiffCandidate {
  model: string
  action: 'create' | 'update' | 'split' | 'merge' | 'deprecate'
  policy: CandidatePolicy
  reason: string
  payload: Record<string, any>
}

export interface DiffResult {
  snapshotChecksum: string
  totalCandidates: number
  autoSafeCount: number
  reviewRequiredCount: number
  blockedCount: number
  candidates: GeoDiffCandidate[]
}

/**
 * Compute deterministic semantic diff between existing records and incoming source snapshot
 */
export function computeGeoSemanticDiff(
  existingProvinces: Array<{ kemendagriCode: string; name: string }>,
  incomingProvinces: Array<{ kemendagriCode: string; name: string; [k: string]: any }>
): DiffResult {
  const existingMap = new Map(existingProvinces.map((p) => [p.kemendagriCode, p]))
  const incomingMap = new Map(incomingProvinces.map((p) => [p.kemendagriCode, p]))

  const candidates: GeoDiffCandidate[] = []

  // Check new and updated provinces
  for (const [code, incoming] of incomingMap) {
    if (!existingMap.has(code)) {
      candidates.push({
        model: 'geo.province',
        action: 'create',
        policy: 'AUTO_SAFE',
        reason: `New province discovered in source: ${incoming.name} (${code})`,
        payload: incoming
      })
    } else {
      const existing = existingMap.get(code)!
      if (existing.name !== incoming.name) {
        candidates.push({
          model: 'geo.province',
          action: 'update',
          policy: 'REVIEW_REQUIRED',
          reason: `Province name change detected: ${existing.name} -> ${incoming.name}`,
          payload: incoming
        })
      }
    }
  }

  // Check missing/disappeared provinces (Circuit breaker: never auto-delete!)
  for (const [code, existing] of existingMap) {
    if (!incomingMap.has(code)) {
      candidates.push({
        model: 'geo.province',
        action: 'deprecate',
        policy: 'BLOCKED',
        reason: `Province ${existing.name} (${code}) missing from incoming source. Guard circuit breaker prevents automatic deletion.`,
        payload: existing
      })
    }
  }

  const autoSafeCount = candidates.filter((c) => c.policy === 'AUTO_SAFE').length
  const reviewRequiredCount = candidates.filter((c) => c.policy === 'REVIEW_REQUIRED').length
  const blockedCount = candidates.filter((c) => c.policy === 'BLOCKED').length

  return {
    snapshotChecksum: '',
    totalCandidates: candidates.length,
    autoSafeCount,
    reviewRequiredCount,
    blockedCount,
    candidates
  }
}
