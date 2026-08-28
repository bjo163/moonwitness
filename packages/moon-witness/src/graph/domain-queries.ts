import type { Ctx } from '@moon/orm'
import WxContent from '../models/wx-content.ts'
import WxEntity from '../models/wx-entity.ts'
import WxEntityAlias from '../models/wx-entity-alias.ts'
import WxFigure from '../models/wx-figure.ts'
import WxFigureName from '../models/wx-figure-name.ts'
import WxFigureRole from '../models/wx-figure-role.ts'
import WxPassage from '../models/wx-passage.ts'
import WxScripture from '../models/wx-scripture.ts'
import { WitnessGraphService, type Loose } from './service.ts'

const MAX_QUERY_LIMIT = 100
const DEFAULT_QUERY_LIMIT = 20
const MAX_HIERARCHY_DEPTH = 4

export interface EntityLookup {
  stableKey?: string
  query?: string
  kind?: string
  limit?: number
}

export interface EntityProfile {
  entity: Loose
  aliases: Loose[]
  figure?: Loose | null
  names?: Loose[]
  roles?: Loose[]
  scripture?: Loose | null
  passage?: Loose | null
  content?: Loose[]
}

export interface PassageTree {
  passage: Loose
  ancestors: Loose[]
  descendants: Loose[]
}

export interface FigureMentionResult {
  figure: Loose
  mentions: Array<{ relation: Loose; passage: Loose; scripture: Loose | null }>
}

function idOf(row: Loose): number {
  return Number(row.id)
}

function relationId(row: Loose, camel: string, snake: string = camel): number {
  const value = row[camel] ?? row[snake]
  return Number(Array.isArray(value) ? value[0] : value ?? 0)
}

function boundedLimit(value: number | undefined): number {
  if (!Number.isInteger(value)) return DEFAULT_QUERY_LIMIT
  return Math.min(Math.max(value!, 1), MAX_QUERY_LIMIT)
}

function boundedDepth(value: number | undefined): number {
  if (!Number.isInteger(value)) return 1
  return Math.min(Math.max(value!, 0), MAX_HIERARCHY_DEPTH)
}

async function fetchEntityByKey(env: Ctx, stableKey: string): Promise<Loose | null> {
  const rows = await WxEntity.fetch(WxEntity, env, [
    ['canonicalKey', '=', stableKey.trim()],
    ['active', '=', true]
  ])
  return rows[0] ?? null
}

/** Search canonical entities without accepting arbitrary domains or unbounded pages. */
export async function findEntities(env: Ctx, options: EntityLookup = {}): Promise<Loose[]> {
  const limit = boundedLimit(options.limit)
  const kind = options.kind?.trim().toUpperCase()
  const base = kind ? [['kind', '=', kind], ['active', '=', true]] : [['active', '=', true]]
  if (options.stableKey?.trim()) {
    const exact = await fetchEntityByKey(env, options.stableKey)
    return exact && (!kind || String(exact.kind).toUpperCase() === kind) ? [exact] : []
  }

  const term = options.query?.trim()
  if (!term) {
    return WxEntity.fetch(WxEntity, env, base, undefined, { limit, order: 'id ASC' })
  }

  const domains = [
    [...base, ['canonicalKey', 'ilike', term]],
    [...base, ['label', 'ilike', term]],
    [...base, ['name', 'ilike', term]]
  ]
  const [entityRows, aliasRows] = await Promise.all([
    Promise.all(domains.map((domain) => WxEntity.fetch(WxEntity, env, domain, undefined, { limit, order: 'id ASC' }))),
    WxEntityAlias.fetch(WxEntityAlias, env, [['label', 'ilike', term], ['active', '=', true]], undefined, { limit, order: 'id ASC' })
  ])
  const aliasEntityIds = aliasRows.map((row: Loose) => relationId(row, 'entityId', 'entity_id')).filter((id) => id > 0)
  const aliasEntities = aliasEntityIds.length
    ? await WxEntity.fetch(WxEntity, env, [['id', 'in', aliasEntityIds], ['active', '=', true]], undefined, { limit, order: 'id ASC' })
    : []
  const rows = [...entityRows.flat(), ...aliasEntities].filter((row: Loose) => !kind || String(row.kind).toUpperCase() === kind)
  return [...new Map(rows.map((row: Loose) => [idOf(row), row])).values()].slice(0, limit)
}

/** Return the canonical profile while keeping domain-specific records behind ORM access checks. */
export async function entityProfile(env: Ctx, entityId: number): Promise<EntityProfile | null> {
  const entity = await WitnessGraphService.entity(env, entityId)
  if (!entity) return null
  const profile: EntityProfile = {
    entity,
    aliases: await WxEntityAlias.fetch(WxEntityAlias, env, [['entityId', '=', entityId], ['active', '=', true]])
  }
  const kind = String(entity.kind ?? '').toUpperCase()

  if (kind === 'PERSON') {
    const figure = (await WxFigure.fetch(WxFigure, env, [['entityId', '=', entityId], ['active', '=', true]]))[0] ?? null
    profile.figure = figure
    if (figure) {
      profile.names = await WxFigureName.fetch(WxFigureName, env, [['figureId', '=', idOf(figure)], ['active', '=', true]], undefined, { order: 'id ASC' })
      profile.roles = await WxFigureRole.fetch(WxFigureRole, env, [['figureId', '=', idOf(figure)], ['active', '=', true]], undefined, { order: 'id ASC' })
    } else {
      profile.names = []
      profile.roles = []
    }
  }

  if (kind === 'SCRIPTURE_FAMILY') {
    profile.scripture = (await WxScripture.fetch(WxScripture, env, [['entityId', '=', entityId], ['active', '=', true]]))[0] ?? null
  }

  if (kind === 'PASSAGE') {
    profile.passage = (await WxPassage.fetch(WxPassage, env, [['entityId', '=', entityId], ['active', '=', true]]))[0] ?? null
    profile.content = profile.passage
      ? await WxContent.fetch(WxContent, env, [['passageId', '=', idOf(profile.passage)], ['active', '=', true]], undefined, { limit: MAX_QUERY_LIMIT, order: 'id ASC' })
      : []
  }
  return profile
}

export async function passageByReference(env: Ctx, reference: string, scriptureId?: number): Promise<Loose | null> {
  const trimmed = reference.trim()
  if (!trimmed) return null
  const domain: any[] = [['canonicalReference', '=', trimmed], ['active', '=', true]]
  if (Number.isInteger(scriptureId) && scriptureId! > 0) domain.push(['scriptureId', '=', scriptureId])
  return (await WxPassage.fetch(WxPassage, env, domain))[0] ?? null
}

export async function passageContent(env: Ctx, passageId: number, limit?: number): Promise<Loose[]> {
  if (!(await WxPassage.fetch(WxPassage, env, [['id', '=', passageId], ['active', '=', true]])).length) return []
  return WxContent.fetch(WxContent, env, [['passageId', '=', passageId], ['active', '=', true]], undefined, {
    limit: boundedLimit(limit),
    order: 'id ASC'
  })
}

export async function passageTree(env: Ctx, passageId: number, depth?: number, limit?: number): Promise<PassageTree | null> {
  const passage = (await WxPassage.fetch(WxPassage, env, [['id', '=', passageId], ['active', '=', true]]))[0]
  if (!passage) return null
  const maxDepth = boundedDepth(depth)
  const maxRows = boundedLimit(limit)
  const ancestors: Loose[] = []
  const seenAncestors = new Set<number>([passageId])
  let parentId = relationId(passage, 'parentId', 'parent_id')
  while (parentId && ancestors.length < maxRows && !seenAncestors.has(parentId)) {
    const parent = (await WxPassage.fetch(WxPassage, env, [['id', '=', parentId], ['active', '=', true]]))[0]
    if (!parent) break
    ancestors.push(parent)
    seenAncestors.add(parentId)
    parentId = relationId(parent, 'parentId', 'parent_id')
  }

  const descendants: Loose[] = []
  let frontier = [passageId]
  const seen = new Set<number>([passageId])
  for (let currentDepth = 0; currentDepth < maxDepth && frontier.length && descendants.length < maxRows; currentDepth++) {
    const next: number[] = []
    for (const parent of frontier) {
      const children = await WxPassage.fetch(WxPassage, env, [['parentId', '=', parent], ['active', '=', true]], undefined, { limit: maxRows, order: 'sequence ASC' })
      for (const child of children) {
        const childId = idOf(child)
        if (!childId || seen.has(childId)) continue
        seen.add(childId)
        descendants.push(child)
        next.push(childId)
        if (descendants.length >= maxRows) break
      }
      if (descendants.length >= maxRows) break
    }
    frontier = next
  }
  return { passage, ancestors, descendants }
}

export async function figureMentions(env: Ctx, figureEntityId: number, limit?: number): Promise<FigureMentionResult | null> {
  const figure = await WitnessGraphService.entity(env, figureEntityId)
  if (!figure || String(figure.kind ?? '').toUpperCase() !== 'PERSON') return null
  const mentions = [] as FigureMentionResult['mentions']
  for (const relation of await WitnessGraphService.inboundRelations(env, figureEntityId, 'MENTIONS')) {
    const passageEntityId = relationId(relation, 'fromEntityId', 'from_entity_id')
    const passageEntity = await WitnessGraphService.entity(env, passageEntityId)
    if (!passageEntity || String(passageEntity.kind ?? '').toUpperCase() !== 'PASSAGE') continue
    const passage = (await WxPassage.fetch(WxPassage, env, [['entityId', '=', passageEntityId], ['active', '=', true]]))[0]
    if (!passage) continue
    const scripture = (await WxScripture.fetch(WxScripture, env, [['id', '=', relationId(passage, 'scriptureId', 'scripture_id')], ['active', '=', true]]))[0] ?? null
    mentions.push({ relation, passage, scripture })
    if (mentions.length >= boundedLimit(limit)) break
  }
  return { figure, mentions }
}

export const DOMAIN_QUERY_LIMITS = {
  max: MAX_QUERY_LIMIT,
  default: DEFAULT_QUERY_LIMIT,
  maxDepth: MAX_HIERARCHY_DEPTH
} as const
