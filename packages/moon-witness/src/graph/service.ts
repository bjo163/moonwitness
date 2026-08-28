import type { Ctx } from '@moon/orm'
import WxEntity from '../models/wx-entity.ts'
import WxEntityAlias from '../models/wx-entity-alias.ts'
import WxProvenance from '../models/wx-provenance.ts'
import WxRelation from '../models/wx-relation.ts'
import WxRelationType from '../models/wx-relation-type.ts'
import WxSource from '../models/wx-source.ts'
import { canonicalRelationKey, canonicalizeSymmetricEntities, validateRelationCandidate } from './identity.ts'
import * as queries from './queries.ts'

type Loose = Record<string, any>
export type { Loose }
function idOf(row: Loose): number { return Number(row.id) }
function value(row: Loose, camel: string, snake: string = camel): any { return row[camel] ?? row[snake] }
function foreignId(row: Loose, camel: string, snake: string): number {
  const raw = value(row, camel, snake); return Number(Array.isArray(raw) ? raw[0] : raw ?? 0)
}
function canonicalKeyOf(row: Loose): string {
  const key = String(value(row, 'canonicalKey', 'canonical_key') ?? '').trim()
  if (!key) throw new Error(`wx.entity ${idOf(row)} has no canonicalKey`)
  return key
}

export interface CreateRelationInput {
  fromEntityId: number; relationTypeCode: string; toEntityId: number
  provenanceId?: number | null; sourceId?: number | null; assertionEntityId?: number | null
  sourceClass?: string; epistemicLane?: string; authorityClass?: string; operationalStatus?: string
  polarity?: string; modality?: string; confidenceBp?: number; sourceRevision?: string | null
  validFrom?: string | null; validTo?: string | null; qualifier?: string | null
}
export interface TraversalNode { entity: Loose; depth: number; viaRelationId?: number }
export interface NeighborResult { entity: Loose; relation: Loose; direction: 'OUTBOUND' | 'INBOUND' }
export interface GraphPath { nodes: Loose[]; relations: Loose[] }
export interface RelationProvenanceBundle { relation: Loose; provenance: Loose | null; source: Loose | null }

export class WitnessGraphService {
  static async relationType(env: Ctx, code: string): Promise<Loose | null> {
    const rows = await WxRelationType.fetch(WxRelationType, env, [['code', '=', code.trim().toUpperCase()], ['active', '=', true]])
    return rows[0] ?? null
  }
  static async entity(env: Ctx, entityId: number): Promise<Loose | null> {
    const rows = await WxEntity.fetch(WxEntity, env, [['id', '=', entityId], ['active', '=', true]])
    return rows[0] ?? null
  }
  static async aliases(env: Ctx, entityId: number): Promise<Loose[]> {
    if (!await this.entity(env, entityId)) return []
    return WxEntityAlias.fetch(WxEntityAlias, env, [['entityId', '=', entityId], ['active', '=', true]])
  }
  static async provenance(env: Ctx, provenanceId: number): Promise<Loose | null> {
    const rows = await WxProvenance.fetch(WxProvenance, env, [['id', '=', provenanceId], ['active', '=', true], ['superseded', '=', false]])
    return rows[0] ?? null
  }
  static async source(env: Ctx, sourceId: number): Promise<Loose | null> {
    const rows = await WxSource.fetch(WxSource, env, [['id', '=', sourceId], ['active', '=', true]])
    return rows[0] ?? null
  }
  static async createRelation(env: Ctx, input: CreateRelationInput): Promise<Loose> {
    const relationType = await this.relationType(env, input.relationTypeCode)
    if (!relationType) throw new Error(`Unknown or inactive Witness relation type: ${input.relationTypeCode}`)
    const originalFrom = await this.entity(env, input.fromEntityId); const originalTo = await this.entity(env, input.toEntityId)
    if (!originalFrom || !originalTo) throw new Error('Relation endpoints must be accessible active wx.entity records')
    let provenance: Loose | null = null
    if (input.provenanceId != null) {
      provenance = await this.provenance(env, input.provenanceId)
      if (!provenance) throw new Error(`Provenance ${input.provenanceId} does not exist, is superseded, or is inaccessible`)
    }
    const provenanceSourceId = provenance ? foreignId(provenance, 'sourceId', 'source_id') : 0
    if (input.sourceId != null && provenanceSourceId && Number(input.sourceId) !== provenanceSourceId) throw new Error(`sourceId ${input.sourceId} does not match provenance source ${provenanceSourceId}`)
    const resolvedSourceId = Number(input.sourceId ?? provenanceSourceId) || 0; const source = resolvedSourceId ? await this.source(env, resolvedSourceId) : null
    if (resolvedSourceId && !source) throw new Error(`Source ${resolvedSourceId} does not exist or is inaccessible`)
    const provenanceRevision = provenance ? String(value(provenance, 'sourceRevision', 'source_revision') ?? '').trim() : ''
    const sourceRevision = source ? String(value(source, 'revision') ?? '').trim() : ''
    if (input.sourceRevision && provenanceRevision && input.sourceRevision !== provenanceRevision) throw new Error(`sourceRevision ${input.sourceRevision} does not match provenance revision ${provenanceRevision}`)
    if (input.sourceRevision && sourceRevision && input.sourceRevision !== sourceRevision) throw new Error(`sourceRevision ${input.sourceRevision} does not match source revision ${sourceRevision}`)
    if (provenanceRevision && sourceRevision && provenanceRevision !== sourceRevision) throw new Error(`Provenance revision ${provenanceRevision} does not match source revision ${sourceRevision}`)
    const canonicalSourceClass = source ? String(value(source, 'sourceClass', 'source_class') ?? 'UNKNOWN') : ''
    if (input.sourceClass && canonicalSourceClass && input.sourceClass.toUpperCase() !== canonicalSourceClass.toUpperCase()) throw new Error(`sourceClass ${input.sourceClass} does not match source classification ${canonicalSourceClass}`)
    const canonicalSourceKey = source ? String(value(source, 'stableKey', 'stable_key') ?? '').trim() : ''
    if (input.assertionEntityId != null) {
      const assertion = await this.entity(env, input.assertionEntityId)
      if (!assertion || String(value(assertion, 'kind')).toUpperCase() !== 'ASSERTION') throw new Error(`assertionEntityId ${input.assertionEntityId} must resolve to an accessible ASSERTION entity`)
    }
    let fromEntityId = input.fromEntityId; let toEntityId = input.toEntityId; let fromEntity = originalFrom; let toEntity = originalTo
    if (Boolean(value(relationType, 'symmetric', 'is_symmetric'))) {
      const [left, right] = canonicalizeSymmetricEntities({ id: fromEntityId, key: canonicalKeyOf(fromEntity), value: fromEntity }, { id: toEntityId, key: canonicalKeyOf(toEntity), value: toEntity })
      fromEntityId = left.id; toEntityId = right.id; fromEntity = left.value; toEntity = right.value
    }
    const resolvedSourceRevision = input.sourceRevision || provenanceRevision || sourceRevision || null
    const validation = validateRelationCandidate({
      fromEntityId, fromKind: String(value(fromEntity, 'kind') ?? ''),
      relationType: { code: String(value(relationType, 'code') ?? ''), symmetric: Boolean(value(relationType, 'symmetric', 'is_symmetric')), transitive: Boolean(value(relationType, 'transitive')), selfLoopAllowed: Boolean(value(relationType, 'selfLoopAllowed', 'self_loop_allowed')), provenanceRequired: Boolean(value(relationType, 'provenanceRequired', 'provenance_required')), reviewRequired: Boolean(value(relationType, 'reviewRequired', 'review_required')), allowedSourceKinds: value(relationType, 'allowedSourceKinds', 'allowed_source_kinds'), allowedTargetKinds: value(relationType, 'allowedTargetKinds', 'allowed_target_kinds') },
      toEntityId, toKind: String(value(toEntity, 'kind') ?? ''), sourceRevision: resolvedSourceRevision, validFrom: input.validFrom, validTo: input.validTo, provenanceId: provenance ? idOf(provenance) : null, status: input.operationalStatus ?? 'PROVISIONAL', confidenceBp: input.confidenceBp ?? 0
    })
    if (!validation.ok) throw new Error(`Invalid Witness relation: ${validation.issues.join('; ')}`)
    const relationTypeCode = String(value(relationType, 'code')); const ontologyVersion = String(value(relationType, 'ontologyVersion', 'ontology_version') ?? 'WITNESS_RELATION_V1')
    const edgeKey = canonicalRelationKey({ fromEntityKey: canonicalKeyOf(fromEntity), relationTypeCode, toEntityKey: canonicalKeyOf(toEntity), ontologyVersion, sourceKey: canonicalSourceKey || null, sourceRevision: resolvedSourceRevision, validFrom: input.validFrom, validTo: input.validTo })
    const existing = await WxRelation.fetch(WxRelation, env, [['edgeKey', '=', edgeKey], ['active', '=', true]])
    if (existing.length) return existing[0]
    return WxRelation.spawn(WxRelation, env, { edgeKey, fromEntityId, relationTypeId: idOf(relationType), toEntityId, assertionEntityId: input.assertionEntityId ?? undefined, provenanceId: provenance ? idOf(provenance) : undefined, sourceId: source ? idOf(source) : undefined, sourceClass: canonicalSourceClass || input.sourceClass || 'UNKNOWN', epistemicLane: input.epistemicLane ?? 'UNRESOLVED', authorityClass: input.authorityClass ?? 'NOT_APPLICABLE', operationalStatus: input.operationalStatus ?? 'PROVISIONAL', polarity: input.polarity ?? 'AFFIRMED', modality: input.modality ?? 'ASSERTED', confidenceBp: input.confidenceBp ?? 0, sourceRevision: resolvedSourceRevision || undefined, ontologyVersion, validFrom: input.validFrom ?? undefined, validTo: input.validTo ?? undefined, qualifier: input.qualifier ?? undefined, active: true })
  }
  static outboundRelations(env: Ctx, entityId: number, code?: string) { return queries.outboundRelations(this, env, entityId, code) }
  static inboundRelations(env: Ctx, entityId: number, code?: string) { return queries.inboundRelations(this, env, entityId, code) }
  static relations(env: Ctx, entityId: number, code?: string) { return queries.relations(this, env, entityId, code) }
  static neighbors(env: Ctx, entityId: number, code?: string) { return queries.neighbors(this, env, entityId, code) }
  static relationProvenance(env: Ctx, relationId: number) { return queries.relationProvenance(this, env, relationId) }
  static traverse(env: Ctx, entityId: number, depth = 1, code?: string) { return queries.traverse(this, env, entityId, depth, code) }
  static pathBetween(env: Ctx, startId: number, targetId: number, depth = 4, code?: string) { return queries.pathBetween(this, env, startId, targetId, depth, code) }
}
