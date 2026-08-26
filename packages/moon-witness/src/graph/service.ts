import type { Ctx } from '@moon/orm'
import WxEntity from '../models/wx-entity.js'
import WxRelation from '../models/wx-relation.js'
import WxRelationType from '../models/wx-relation-type.js'
import {
  canonicalRelationKey,
  canonicalizeSymmetricEntities,
  validateRelationCandidate
} from './identity.js'

const MAX_TRAVERSAL_DEPTH = 4
const MAX_TRAVERSAL_NODES = 500

type Loose = Record<string, any>

function idOf(row: Loose): number {
  return Number(row.id)
}

function value(row: Loose, camel: string, snake: string = camel): any {
  return row[camel] ?? row[snake]
}

function canonicalKeyOf(row: Loose): string {
  const key = String(value(row, 'canonicalKey', 'canonical_key') ?? '').trim()
  if (!key) throw new Error(`wx.entity ${idOf(row)} has no canonicalKey`)
  return key
}

export interface CreateRelationInput {
  fromEntityId: number
  relationTypeCode: string
  toEntityId: number
  provenanceId?: number | null
  sourceId?: number | null
  assertionEntityId?: number | null
  sourceClass?: string
  epistemicLane?: string
  authorityClass?: string
  operationalStatus?: string
  polarity?: string
  modality?: string
  confidenceBp?: number
  sourceRevision?: string | null
  validFrom?: string | null
  validTo?: string | null
  qualifier?: string | null
}

export interface TraversalNode {
  entity: Loose
  depth: number
  viaRelationId?: number
}

export class WitnessGraphService {
  static async relationType(env: Ctx, code: string): Promise<Loose | null> {
    const rows = await WxRelationType.fetch(WxRelationType, env, [
      ['code', '=', code.trim().toUpperCase()],
      ['active', '=', true]
    ])
    return rows[0] ?? null
  }

  static async entity(env: Ctx, entityId: number): Promise<Loose | null> {
    const rows = await WxEntity.fetch(WxEntity, env, [
      ['id', '=', entityId],
      ['active', '=', true]
    ])
    return rows[0] ?? null
  }

  static async createRelation(env: Ctx, input: CreateRelationInput): Promise<Loose> {
    const relationType = await this.relationType(env, input.relationTypeCode)
    if (!relationType) throw new Error(`Unknown or inactive Witness relation type: ${input.relationTypeCode}`)

    const originalFrom = await this.entity(env, input.fromEntityId)
    const originalTo = await this.entity(env, input.toEntityId)
    if (!originalFrom || !originalTo) throw new Error('Relation endpoints must be accessible active wx.entity records')

    let fromEntityId = input.fromEntityId
    let toEntityId = input.toEntityId
    let fromEntity = originalFrom
    let toEntity = originalTo

    if (Boolean(value(relationType, 'symmetric'))) {
      const [left, right] = canonicalizeSymmetricEntities(
        { id: fromEntityId, key: canonicalKeyOf(fromEntity), value: fromEntity },
        { id: toEntityId, key: canonicalKeyOf(toEntity), value: toEntity }
      )
      fromEntityId = left.id
      toEntityId = right.id
      fromEntity = left.value
      toEntity = right.value
    }

    const validation = validateRelationCandidate({
      fromEntityId,
      fromKind: String(value(fromEntity, 'kind') ?? ''),
      relationType: {
        code: String(value(relationType, 'code') ?? ''),
        symmetric: Boolean(value(relationType, 'symmetric')),
        transitive: Boolean(value(relationType, 'transitive')),
        selfLoopAllowed: Boolean(value(relationType, 'selfLoopAllowed', 'self_loop_allowed')),
        provenanceRequired: Boolean(value(relationType, 'provenanceRequired', 'provenance_required')),
        reviewRequired: Boolean(value(relationType, 'reviewRequired', 'review_required')),
        allowedSourceKinds: value(relationType, 'allowedSourceKinds', 'allowed_source_kinds'),
        allowedTargetKinds: value(relationType, 'allowedTargetKinds', 'allowed_target_kinds')
      },
      toEntityId,
      toKind: String(value(toEntity, 'kind') ?? ''),
      sourceRevision: input.sourceRevision,
      validFrom: input.validFrom,
      validTo: input.validTo,
      provenanceId: input.provenanceId,
      status: input.operationalStatus ?? 'PROVISIONAL',
      confidenceBp: input.confidenceBp ?? 0
    })

    if (!validation.ok) throw new Error(`Invalid Witness relation: ${validation.issues.join('; ')}`)

    const relationTypeCode = String(value(relationType, 'code'))
    const ontologyVersion = String(value(relationType, 'ontologyVersion', 'ontology_version') ?? 'WITNESS_RELATION_V1')
    const edgeKey = canonicalRelationKey({
      fromEntityKey: canonicalKeyOf(fromEntity),
      relationTypeCode,
      toEntityKey: canonicalKeyOf(toEntity),
      ontologyVersion,
      sourceRevision: input.sourceRevision,
      validFrom: input.validFrom,
      validTo: input.validTo
    })

    const existing = await WxRelation.fetch(WxRelation, env, [
      ['edgeKey', '=', edgeKey],
      ['active', '=', true]
    ])
    if (existing.length) return existing[0]

    return WxRelation.spawn(WxRelation, env, {
      edgeKey,
      fromEntityId,
      relationTypeId: idOf(relationType),
      toEntityId,
      assertionEntityId: input.assertionEntityId ?? undefined,
      provenanceId: input.provenanceId ?? undefined,
      sourceId: input.sourceId ?? undefined,
      sourceClass: input.sourceClass ?? 'UNKNOWN',
      epistemicLane: input.epistemicLane ?? 'UNRESOLVED',
      authorityClass: input.authorityClass ?? 'NOT_APPLICABLE',
      operationalStatus: input.operationalStatus ?? 'PROVISIONAL',
      polarity: input.polarity ?? 'AFFIRMED',
      modality: input.modality ?? 'ASSERTED',
      confidenceBp: input.confidenceBp ?? 0,
      sourceRevision: input.sourceRevision ?? undefined,
      ontologyVersion,
      validFrom: input.validFrom ?? undefined,
      validTo: input.validTo ?? undefined,
      qualifier: input.qualifier ?? undefined,
      active: true
    })
  }

  private static async rawRelations(env: Ctx, entityId: number, relationTypeCode?: string): Promise<Loose[]> {
    let relationTypeId: number | null = null
    if (relationTypeCode) {
      const type = await this.relationType(env, relationTypeCode)
      if (!type) return []
      relationTypeId = idOf(type)
    }

    const extra = relationTypeId ? [['relationTypeId', '=', relationTypeId]] : []
    const outbound = await WxRelation.fetch(WxRelation, env, [
      ['fromEntityId', '=', entityId],
      ['active', '=', true],
      ...extra
    ] as any)
    const inbound = await WxRelation.fetch(WxRelation, env, [
      ['toEntityId', '=', entityId],
      ['active', '=', true],
      ...extra
    ] as any)

    return [...new Map([...outbound, ...inbound].map((row: Loose) => [idOf(row), row])).values()]
  }

  static async relations(env: Ctx, entityId: number, relationTypeCode?: string): Promise<Loose[]> {
    const rows = await this.rawRelations(env, entityId, relationTypeCode)
    const visible: Loose[] = []
    for (const relation of rows) {
      const fromId = Number(value(relation, 'fromEntityId', 'from_entity_id'))
      const toId = Number(value(relation, 'toEntityId', 'to_entity_id'))
      const [fromEntity, toEntity] = await Promise.all([
        this.entity(env, fromId),
        this.entity(env, toId)
      ])
      // Never return an edge when either endpoint is inaccessible; this avoids
      // leaking hidden target IDs through counts or relation metadata.
      if (fromEntity && toEntity) visible.push(relation)
    }
    return visible
  }

  static async traverse(env: Ctx, startEntityId: number, maxDepth = 1): Promise<TraversalNode[]> {
    if (!Number.isInteger(maxDepth) || maxDepth < 0 || maxDepth > MAX_TRAVERSAL_DEPTH) {
      throw new Error(`maxDepth must be an integer between 0 and ${MAX_TRAVERSAL_DEPTH}`)
    }

    const start = await this.entity(env, startEntityId)
    if (!start) return []

    const results: TraversalNode[] = [{ entity: start, depth: 0 }]
    const visited = new Set<number>([startEntityId])
    let frontier = [startEntityId]

    for (let depth = 1; depth <= maxDepth && frontier.length; depth++) {
      const next: number[] = []
      for (const currentId of frontier) {
        const relations = await this.relations(env, currentId)
        for (const relation of relations) {
          const fromId = Number(value(relation, 'fromEntityId', 'from_entity_id'))
          const toId = Number(value(relation, 'toEntityId', 'to_entity_id'))
          const neighborId = fromId === currentId ? toId : fromId
          if (!neighborId || visited.has(neighborId)) continue

          const entity = await this.entity(env, neighborId)
          if (!entity) continue

          visited.add(neighborId)
          results.push({ entity, depth, viaRelationId: idOf(relation) })
          next.push(neighborId)
          if (results.length >= MAX_TRAVERSAL_NODES) return results
        }
      }
      frontier = next
    }

    return results
  }
}
