import type { Ctx } from '@moon/orm'
import WxEntity from '../models/wx-entity.js'
import WxEntityAlias from '../models/wx-entity-alias.js'
import WxProvenance from '../models/wx-provenance.js'
import WxRelation from '../models/wx-relation.js'
import WxRelationType from '../models/wx-relation-type.js'
import WxSource from '../models/wx-source.js'
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

function foreignId(row: Loose, camel: string, snake: string): number {
  const raw = value(row, camel, snake)
  const scalar = Array.isArray(raw) ? raw[0] : raw
  return Number(scalar ?? 0)
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

export interface NeighborResult {
  entity: Loose
  relation: Loose
  direction: 'OUTBOUND' | 'INBOUND'
}

export interface GraphPath {
  nodes: Loose[]
  relations: Loose[]
}

export interface RelationProvenanceBundle {
  relation: Loose
  provenance: Loose | null
  source: Loose | null
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

  static async aliases(env: Ctx, entityId: number): Promise<Loose[]> {
    if (!await this.entity(env, entityId)) return []
    return WxEntityAlias.fetch(WxEntityAlias, env, [
      ['entityId', '=', entityId],
      ['active', '=', true]
    ])
  }

  static async provenance(env: Ctx, provenanceId: number): Promise<Loose | null> {
    const rows = await WxProvenance.fetch(WxProvenance, env, [
      ['id', '=', provenanceId],
      ['active', '=', true],
      ['superseded', '=', false]
    ])
    return rows[0] ?? null
  }

  static async source(env: Ctx, sourceId: number): Promise<Loose | null> {
    const rows = await WxSource.fetch(WxSource, env, [
      ['id', '=', sourceId],
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

    let provenance: Loose | null = null
    if (input.provenanceId != null) {
      provenance = await this.provenance(env, input.provenanceId)
      if (!provenance) throw new Error(`Provenance ${input.provenanceId} does not exist, is superseded, or is inaccessible`)
    }

    const provenanceSourceId = provenance ? foreignId(provenance, 'sourceId', 'source_id') : 0
    if (input.sourceId != null && provenanceSourceId && Number(input.sourceId) !== provenanceSourceId) {
      throw new Error(`sourceId ${input.sourceId} does not match provenance source ${provenanceSourceId}`)
    }
    const resolvedSourceId = Number(input.sourceId ?? provenanceSourceId) || 0
    const source = resolvedSourceId ? await this.source(env, resolvedSourceId) : null
    if (resolvedSourceId && !source) throw new Error(`Source ${resolvedSourceId} does not exist or is inaccessible`)

    const provenanceRevision = provenance ? String(value(provenance, 'sourceRevision', 'source_revision') ?? '').trim() : ''
    const sourceRevision = source ? String(value(source, 'revision') ?? '').trim() : ''
    if (input.sourceRevision && provenanceRevision && input.sourceRevision !== provenanceRevision) {
      throw new Error(`sourceRevision ${input.sourceRevision} does not match provenance revision ${provenanceRevision}`)
    }
    if (input.sourceRevision && sourceRevision && input.sourceRevision !== sourceRevision) {
      throw new Error(`sourceRevision ${input.sourceRevision} does not match source revision ${sourceRevision}`)
    }
    if (provenanceRevision && sourceRevision && provenanceRevision !== sourceRevision) {
      throw new Error(`Provenance revision ${provenanceRevision} does not match source revision ${sourceRevision}`)
    }

    const canonicalSourceClass = source ? String(value(source, 'sourceClass', 'source_class') ?? 'UNKNOWN') : ''
    if (input.sourceClass && canonicalSourceClass && input.sourceClass.toUpperCase() !== canonicalSourceClass.toUpperCase()) {
      throw new Error(`sourceClass ${input.sourceClass} does not match source classification ${canonicalSourceClass}`)
    }
    const canonicalSourceKey = source ? String(value(source, 'stableKey', 'stable_key') ?? '').trim() : ''

    if (input.assertionEntityId != null) {
      const assertion = await this.entity(env, input.assertionEntityId)
      if (!assertion || String(value(assertion, 'kind')).toUpperCase() !== 'ASSERTION') {
        throw new Error(`assertionEntityId ${input.assertionEntityId} must resolve to an accessible ASSERTION entity`)
      }
    }

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

    const resolvedSourceRevision = input.sourceRevision || provenanceRevision || sourceRevision || null

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
      sourceRevision: resolvedSourceRevision,
      validFrom: input.validFrom,
      validTo: input.validTo,
      provenanceId: provenance ? idOf(provenance) : null,
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
      sourceKey: canonicalSourceKey || null,
      sourceRevision: resolvedSourceRevision,
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
      provenanceId: provenance ? idOf(provenance) : undefined,
      sourceId: source ? idOf(source) : undefined,
      sourceClass: canonicalSourceClass || input.sourceClass || 'UNKNOWN',
      epistemicLane: input.epistemicLane ?? 'UNRESOLVED',
      authorityClass: input.authorityClass ?? 'NOT_APPLICABLE',
      operationalStatus: input.operationalStatus ?? 'PROVISIONAL',
      polarity: input.polarity ?? 'AFFIRMED',
      modality: input.modality ?? 'ASSERTED',
      confidenceBp: input.confidenceBp ?? 0,
      sourceRevision: resolvedSourceRevision || undefined,
      ontologyVersion,
      validFrom: input.validFrom ?? undefined,
      validTo: input.validTo ?? undefined,
      qualifier: input.qualifier ?? undefined,
      active: true
    })
  }

  private static async relationTypeId(env: Ctx, relationTypeCode?: string): Promise<number | null | undefined> {
    if (!relationTypeCode) return undefined
    const type = await this.relationType(env, relationTypeCode)
    return type ? idOf(type) : null
  }

  private static async filterVisibleRelations(env: Ctx, rows: Loose[]): Promise<Loose[]> {
    const visible: Loose[] = []
    for (const relation of rows) {
      const fromId = foreignId(relation, 'fromEntityId', 'from_entity_id')
      const toId = foreignId(relation, 'toEntityId', 'to_entity_id')
      const [fromEntity, toEntity] = await Promise.all([
        this.entity(env, fromId),
        this.entity(env, toId)
      ])
      if (fromEntity && toEntity) visible.push(relation)
    }
    return visible
  }

  static async outboundRelations(env: Ctx, entityId: number, relationTypeCode?: string): Promise<Loose[]> {
    if (!await this.entity(env, entityId)) return []
    const relationTypeId = await this.relationTypeId(env, relationTypeCode)
    if (relationTypeId === null) return []
    const domain: any[] = [
      ['fromEntityId', '=', entityId],
      ['active', '=', true]
    ]
    if (relationTypeId !== undefined) domain.push(['relationTypeId', '=', relationTypeId])
    const rows = await WxRelation.fetch(WxRelation, env, domain)
    return this.filterVisibleRelations(env, rows)
  }

  static async inboundRelations(env: Ctx, entityId: number, relationTypeCode?: string): Promise<Loose[]> {
    if (!await this.entity(env, entityId)) return []
    const relationTypeId = await this.relationTypeId(env, relationTypeCode)
    if (relationTypeId === null) return []
    const domain: any[] = [
      ['toEntityId', '=', entityId],
      ['active', '=', true]
    ]
    if (relationTypeId !== undefined) domain.push(['relationTypeId', '=', relationTypeId])
    const rows = await WxRelation.fetch(WxRelation, env, domain)
    return this.filterVisibleRelations(env, rows)
  }

  static async relations(env: Ctx, entityId: number, relationTypeCode?: string): Promise<Loose[]> {
    const [outbound, inbound] = await Promise.all([
      this.outboundRelations(env, entityId, relationTypeCode),
      this.inboundRelations(env, entityId, relationTypeCode)
    ])
    return [...new Map([...outbound, ...inbound].map((row: Loose) => [idOf(row), row])).values()]
  }

  static async neighbors(env: Ctx, entityId: number, relationTypeCode?: string): Promise<NeighborResult[]> {
    if (!await this.entity(env, entityId)) return []
    const [outbound, inbound] = await Promise.all([
      this.outboundRelations(env, entityId, relationTypeCode),
      this.inboundRelations(env, entityId, relationTypeCode)
    ])
    const results: NeighborResult[] = []
    const seen = new Set<string>()

    for (const relation of outbound) {
      const neighborId = foreignId(relation, 'toEntityId', 'to_entity_id')
      const entity = await this.entity(env, neighborId)
      if (!entity) continue
      const key = `${idOf(relation)}:OUTBOUND:${neighborId}`
      if (seen.has(key)) continue
      seen.add(key)
      results.push({ entity, relation, direction: 'OUTBOUND' })
    }

    for (const relation of inbound) {
      const neighborId = foreignId(relation, 'fromEntityId', 'from_entity_id')
      const entity = await this.entity(env, neighborId)
      if (!entity) continue
      const key = `${idOf(relation)}:INBOUND:${neighborId}`
      if (seen.has(key)) continue
      seen.add(key)
      results.push({ entity, relation, direction: 'INBOUND' })
    }

    return results
  }

  static async relationProvenance(env: Ctx, relationId: number): Promise<RelationProvenanceBundle | null> {
    const rows = await WxRelation.fetch(WxRelation, env, [
      ['id', '=', relationId],
      ['active', '=', true]
    ])
    const relation = rows[0]
    if (!relation) return null
    const visible = await this.filterVisibleRelations(env, [relation])
    if (!visible.length) return null

    const provenanceId = foreignId(relation, 'provenanceId', 'provenance_id')
    const sourceId = foreignId(relation, 'sourceId', 'source_id')
    const provenance = provenanceId ? await this.provenance(env, provenanceId) : null
    const resolvedSourceId = sourceId || (provenance ? foreignId(provenance, 'sourceId', 'source_id') : 0)
    const source = resolvedSourceId ? await this.source(env, resolvedSourceId) : null
    return { relation, provenance, source }
  }

  static async traverse(
    env: Ctx,
    startEntityId: number,
    maxDepth = 1,
    relationTypeCode?: string
  ): Promise<TraversalNode[]> {
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
        const neighbors = await this.neighbors(env, currentId, relationTypeCode)
        for (const neighbor of neighbors) {
          const neighborId = idOf(neighbor.entity)
          if (!neighborId || visited.has(neighborId)) continue

          visited.add(neighborId)
          results.push({ entity: neighbor.entity, depth, viaRelationId: idOf(neighbor.relation) })
          next.push(neighborId)
          if (results.length >= MAX_TRAVERSAL_NODES) return results
        }
      }
      frontier = next
    }

    return results
  }

  static async pathBetween(
    env: Ctx,
    startEntityId: number,
    targetEntityId: number,
    maxDepth = MAX_TRAVERSAL_DEPTH,
    relationTypeCode?: string
  ): Promise<GraphPath | null> {
    if (!Number.isInteger(maxDepth) || maxDepth < 0 || maxDepth > MAX_TRAVERSAL_DEPTH) {
      throw new Error(`maxDepth must be an integer between 0 and ${MAX_TRAVERSAL_DEPTH}`)
    }

    const [start, target] = await Promise.all([
      this.entity(env, startEntityId),
      this.entity(env, targetEntityId)
    ])
    if (!start || !target) return null
    if (startEntityId === targetEntityId) return { nodes: [start], relations: [] }
    if (maxDepth === 0) return null

    const visited = new Set<number>([startEntityId])
    const queue: Array<{ entityId: number; nodes: Loose[]; relations: Loose[]; depth: number }> = [
      { entityId: startEntityId, nodes: [start], relations: [], depth: 0 }
    ]
    let discovered = 1

    while (queue.length) {
      const current = queue.shift()!
      if (current.depth >= maxDepth) continue

      const neighbors = await this.neighbors(env, current.entityId, relationTypeCode)
      for (const neighbor of neighbors) {
        const neighborId = idOf(neighbor.entity)
        if (!neighborId || visited.has(neighborId)) continue
        visited.add(neighborId)
        discovered += 1
        if (discovered > MAX_TRAVERSAL_NODES) return null

        const nodes = [...current.nodes, neighbor.entity]
        const relations = [...current.relations, neighbor.relation]
        if (neighborId === targetEntityId) return { nodes, relations }

        queue.push({
          entityId: neighborId,
          nodes,
          relations,
          depth: current.depth + 1
        })
      }
    }

    return null
  }
}
