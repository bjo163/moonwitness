import { createHash } from 'node:crypto'
import { parseKindList } from './contracts.js'

export interface RelationTypePolicy {
  code: string
  symmetric?: boolean
  transitive?: boolean
  selfLoopAllowed?: boolean
  provenanceRequired?: boolean
  reviewRequired?: boolean
  allowedSourceKinds?: string | string[]
  allowedTargetKinds?: string | string[]
}

export interface RelationCandidate {
  fromEntityId: number
  fromKind: string
  relationType: RelationTypePolicy
  toEntityId: number
  toKind: string
  sourceRevision?: string | null
  validFrom?: string | null
  validTo?: string | null
  provenanceId?: number | null
  status?: string | null
  confidenceBp?: number | null
}

export interface RelationValidationResult {
  ok: boolean
  issues: string[]
}

function normalizedKinds(value: string | string[] | undefined): string[] {
  if (Array.isArray(value)) return [...new Set(value.map((item) => item.trim().toUpperCase()).filter(Boolean))].sort()
  return parseKindList(value)
}

/**
 * Cross-install stable semantic relation key.
 * Never hash database primary keys: they are allocation artifacts, not identity.
 */
export function canonicalRelationKey(input: {
  fromEntityKey: string
  relationTypeCode: string
  toEntityKey: string
  ontologyVersion?: string | null
  sourceRevision?: string | null
  validFrom?: string | null
  validTo?: string | null
}): string {
  const fromKey = input.fromEntityKey.trim().toLowerCase()
  const toKey = input.toEntityKey.trim().toLowerCase()
  if (!fromKey || !toKey) throw new Error('canonical relation endpoints require non-empty entity keys')

  const payload = [
    fromKey,
    input.relationTypeCode.trim().toUpperCase(),
    toKey,
    input.ontologyVersion?.trim() ?? 'WITNESS_RELATION_V1',
    input.sourceRevision?.trim() ?? '',
    input.validFrom?.trim() ?? '',
    input.validTo?.trim() ?? ''
  ].join('|')
  return `wxrel:${createHash('sha256').update(payload).digest('hex')}`
}

export function validateRelationCandidate(candidate: RelationCandidate): RelationValidationResult {
  const issues: string[] = []
  const policy = candidate.relationType
  const sourceKind = candidate.fromKind.trim().toUpperCase()
  const targetKind = candidate.toKind.trim().toUpperCase()
  const allowedSourceKinds = normalizedKinds(policy.allowedSourceKinds)
  const allowedTargetKinds = normalizedKinds(policy.allowedTargetKinds)

  if (!Number.isInteger(candidate.fromEntityId) || candidate.fromEntityId <= 0) issues.push('fromEntityId must be a positive integer')
  if (!Number.isInteger(candidate.toEntityId) || candidate.toEntityId <= 0) issues.push('toEntityId must be a positive integer')
  if (!policy.code?.trim()) issues.push('relation type code is required')
  if (!sourceKind) issues.push('fromKind is required')
  if (!targetKind) issues.push('toKind is required')

  if (candidate.fromEntityId === candidate.toEntityId && policy.selfLoopAllowed !== true) {
    issues.push(`relation ${policy.code} does not allow self loops`)
  }

  if (allowedSourceKinds.length && !allowedSourceKinds.includes(sourceKind)) {
    issues.push(`source kind ${sourceKind} is not allowed for ${policy.code}`)
  }
  if (allowedTargetKinds.length && !allowedTargetKinds.includes(targetKind)) {
    issues.push(`target kind ${targetKind} is not allowed for ${policy.code}`)
  }

  if (policy.provenanceRequired && !candidate.provenanceId) {
    issues.push(`relation ${policy.code} requires provenance`)
  }
  if (policy.reviewRequired && candidate.status === 'ESTABLISHED') {
    issues.push(`relation ${policy.code} requires review before ESTABLISHED status`)
  }

  if (candidate.confidenceBp != null) {
    if (!Number.isInteger(candidate.confidenceBp) || candidate.confidenceBp < 0 || candidate.confidenceBp > 10000) {
      issues.push('confidenceBp must be an integer between 0 and 10000')
    }
  }

  if (candidate.validFrom && candidate.validTo && candidate.validFrom > candidate.validTo) {
    issues.push('validFrom must not be after validTo')
  }

  return { ok: issues.length === 0, issues }
}

export interface CanonicalEndpoint<T = unknown> {
  id: number
  key: string
  value: T
}

/** Canonical ordering for symmetric edges uses stable semantic keys, never IDs. */
export function canonicalizeSymmetricEntities<T>(
  left: CanonicalEndpoint<T>,
  right: CanonicalEndpoint<T>
): [CanonicalEndpoint<T>, CanonicalEndpoint<T>] {
  return left.key.localeCompare(right.key) <= 0 ? [left, right] : [right, left]
}
