import type { Ctx } from '@moon/orm'
import WxRelation from '../models/wx-relation.js'
import type { Loose, NeighborResult, TraversalNode, GraphPath, RelationProvenanceBundle } from './service.js'
import type { WitnessGraphService } from './service.js'

const MAX_TRAVERSAL_DEPTH = 4
const MAX_TRAVERSAL_NODES = 500

type Service = typeof WitnessGraphService

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

async function relationTypeId(service: Service, env: Ctx, code?: string): Promise<number | null | undefined> {
  if (!code) return undefined
  const type = await service.relationType(env, code)
  return type ? idOf(type) : null
}

async function filterVisibleRelations(service: Service, env: Ctx, rows: Loose[]): Promise<Loose[]> {
  const visible: Loose[] = []
  for (const relation of rows) {
    const fromId = foreignId(relation, 'fromEntityId', 'from_entity_id')
    const toId = foreignId(relation, 'toEntityId', 'to_entity_id')
    const [fromEntity, toEntity] = await Promise.all([service.entity(env, fromId), service.entity(env, toId)])
    if (fromEntity && toEntity) visible.push(relation)
  }
  return visible
}

export async function outboundRelations(service: Service, env: Ctx, entityId: number, code?: string): Promise<Loose[]> {
  if (!await service.entity(env, entityId)) return []
  const typeId = await relationTypeId(service, env, code)
  if (typeId === null) return []
  const domain: any[] = [['fromEntityId', '=', entityId], ['active', '=', true]]
  if (typeId !== undefined) domain.push(['relationTypeId', '=', typeId])
  return filterVisibleRelations(service, env, await WxRelation.fetch(WxRelation, env, domain))
}

export async function inboundRelations(service: Service, env: Ctx, entityId: number, code?: string): Promise<Loose[]> {
  if (!await service.entity(env, entityId)) return []
  const typeId = await relationTypeId(service, env, code)
  if (typeId === null) return []
  const domain: any[] = [['toEntityId', '=', entityId], ['active', '=', true]]
  if (typeId !== undefined) domain.push(['relationTypeId', '=', typeId])
  return filterVisibleRelations(service, env, await WxRelation.fetch(WxRelation, env, domain))
}

export async function relations(service: Service, env: Ctx, entityId: number, code?: string): Promise<Loose[]> {
  const [outbound, inbound] = await Promise.all([outboundRelations(service, env, entityId, code), inboundRelations(service, env, entityId, code)])
  return [...new Map([...outbound, ...inbound].map((row: Loose) => [idOf(row), row])).values()]
}

export async function neighbors(service: Service, env: Ctx, entityId: number, code?: string): Promise<NeighborResult[]> {
  if (!await service.entity(env, entityId)) return []
  const [outbound, inbound] = await Promise.all([outboundRelations(service, env, entityId, code), inboundRelations(service, env, entityId, code)])
  const results: NeighborResult[] = []
  const seen = new Set<string>()
  for (const [rows, direction] of [[outbound, 'OUTBOUND'], [inbound, 'INBOUND']] as const) {
    for (const relation of rows) {
      const field: [string, string] = direction === 'OUTBOUND' ? ['toEntityId', 'to_entity_id'] : ['fromEntityId', 'from_entity_id']
      const neighborId = foreignId(relation, field[0], field[1])
      const entity = await service.entity(env, neighborId)
      if (!entity) continue
      const key = `${idOf(relation)}:${direction}:${neighborId}`
      if (seen.has(key)) continue
      seen.add(key)
      results.push({ entity, relation, direction })
    }
  }
  return results
}

export async function relationProvenance(service: Service, env: Ctx, relationId: number): Promise<RelationProvenanceBundle | null> {
  const relation = (await WxRelation.fetch(WxRelation, env, [['id', '=', relationId], ['active', '=', true]]))[0]
  if (!relation || !await filterVisibleRelations(service, env, [relation]).then(rows => rows.length > 0)) return null
  const provenanceId = foreignId(relation, 'provenanceId', 'provenance_id')
  const sourceId = foreignId(relation, 'sourceId', 'source_id')
  const provenance = provenanceId ? await service.provenance(env, provenanceId) : null
  const resolvedSourceId = sourceId || (provenance ? foreignId(provenance, 'sourceId', 'source_id') : 0)
  const source = resolvedSourceId ? await service.source(env, resolvedSourceId) : null
  return { relation, provenance, source }
}

export async function traverse(service: Service, env: Ctx, startId: number, maxDepth = 1, code?: string): Promise<TraversalNode[]> {
  if (!Number.isInteger(maxDepth) || maxDepth < 0 || maxDepth > MAX_TRAVERSAL_DEPTH) throw new Error(`maxDepth must be an integer between 0 and ${MAX_TRAVERSAL_DEPTH}`)
  const start = await service.entity(env, startId)
  if (!start) return []
  const results: TraversalNode[] = [{ entity: start, depth: 0 }]
  const visited = new Set<number>([startId])
  let frontier = [startId]
  for (let depth = 1; depth <= maxDepth && frontier.length; depth++) {
    const next: number[] = []
    for (const currentId of frontier) {
      for (const neighbor of await neighbors(service, env, currentId, code)) {
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

export async function pathBetween(service: Service, env: Ctx, startId: number, targetId: number, maxDepth = MAX_TRAVERSAL_DEPTH, code?: string): Promise<GraphPath | null> {
  if (!Number.isInteger(maxDepth) || maxDepth < 0 || maxDepth > MAX_TRAVERSAL_DEPTH) throw new Error(`maxDepth must be an integer between 0 and ${MAX_TRAVERSAL_DEPTH}`)
  const [start, target] = await Promise.all([service.entity(env, startId), service.entity(env, targetId)])
  if (!start || !target) return null
  if (startId === targetId) return { nodes: [start], relations: [] }
  if (maxDepth === 0) return null
  const visited = new Set<number>([startId])
  const queue: Array<{ entityId: number; nodes: Loose[]; relations: Loose[]; depth: number }> = [{ entityId: startId, nodes: [start], relations: [], depth: 0 }]
  let discovered = 1
  while (queue.length) {
    const current = queue.shift()!
    if (current.depth >= maxDepth) continue
    for (const neighbor of await neighbors(service, env, current.entityId, code)) {
      const neighborId = idOf(neighbor.entity)
      if (!neighborId || visited.has(neighborId)) continue
      visited.add(neighborId)
      discovered += 1
      if (discovered > MAX_TRAVERSAL_NODES) return null
      const nodes = [...current.nodes, neighbor.entity]
      const relations = [...current.relations, neighbor.relation]
      if (neighborId === targetId) return { nodes, relations }
      queue.push({ entityId: neighborId, nodes, relations, depth: current.depth + 1 })
    }
  }
  return null
}
