import { beforeEach, describe, expect, it } from 'vitest'
import { createCtx, setupOrm, SUPERUSER_ID } from '@moon/orm'
import { WitnessGraphService } from '../src/graph/service.js'
import { canonicalRelationKey } from '../src/graph/identity.js'

type Row = Record<string, any>
let mockDb: Record<string, Row[]> = {}

const rawKey = (column: string) => column.includes('.') ? column.split('.').pop()! : column

function createMockKnex() {
  const conn: any = (tableName: string) => {
    if (!mockDb[tableName]) mockDb[tableName] = []
    const table = mockDb[tableName]
    const predicates: Array<(row: Row) => boolean> = []
    let limitValue: number | undefined
    let offsetValue = 0

    const query: any = {
      where(column: any, opOrValue?: any, maybeValue?: any) {
        if (typeof column === 'function') {
          column(query)
          return query
        }
        const key = rawKey(String(column))
        const op = maybeValue === undefined ? '=' : String(opOrValue)
        const expected = maybeValue === undefined ? opOrValue : maybeValue
        predicates.push((row) => {
          const actual = row[key]
          if (op === '=') return actual === expected
          if (op === '!=') return actual !== expected
          if (op === '>') return actual > expected
          if (op === '<') return actual < expected
          if (op === '>=') return actual >= expected
          if (op === '<=') return actual <= expected
          return false
        })
        return query
      },
      andWhere(column: any, opOrValue?: any, maybeValue?: any) {
        return query.where(column, opOrValue, maybeValue)
      },
      orWhere(column: any, opOrValue?: any, maybeValue?: any) {
        return query.where(column, opOrValue, maybeValue)
      },
      whereNot(column: any, value?: any) {
        if (typeof column === 'function') {
          column(query)
          return query
        }
        const key = rawKey(String(column))
        predicates.push((row) => row[key] !== value)
        return query
      },
      whereIn(column: string, values: any[]) {
        const key = rawKey(column)
        predicates.push((row) => values.includes(row[key]))
        return query
      },
      whereNotIn(column: string, values: any[]) {
        const key = rawKey(column)
        predicates.push((row) => !values.includes(row[key]))
        return query
      },
      select() { return query },
      orderBy() { return query },
      join() { return query },
      limit(value: number) { limitValue = value; return query },
      offset(value: number) { offsetValue = value; return query },
      insert(data: Row | Row[]) {
        const items = Array.isArray(data) ? data : [data]
        const inserted = items.map((item) => {
          const id = item.id ?? (table.reduce((max, row) => Math.max(max, Number(row.id) || 0), 0) + 1)
          const row = { id, ...item }
          table.push(row)
          return row
        })
        return { returning: async () => inserted }
      },
      async update(data: Row) {
        let count = 0
        for (const row of table.filter((candidate) => predicates.every((predicate) => predicate(candidate)))) {
          Object.assign(row, data)
          count += 1
        }
        return count
      },
      async first() {
        return table.find((row) => predicates.every((predicate) => predicate(row))) ?? null
      },
      then(resolve: (rows: Row[]) => void, reject?: (error: unknown) => void) {
        try {
          let rows = table.filter((row) => predicates.every((predicate) => predicate(row)))
          rows = rows.slice(offsetValue, limitValue === undefined ? undefined : offsetValue + limitValue)
          resolve(rows.map((row) => ({ ...row })))
        } catch (error) {
          reject?.(error)
        }
      }
    }
    return query
  }

  conn.transaction = async (callback: any) => callback(conn)
  conn.raw = (sql: string, bindings?: any[]) => ({ sql, bindings })
  conn.on = () => conn
  return conn
}

function seedMockGraph() {
  mockDb = {
    wx_relation_type: [
      {
        id: 1,
        code: 'MENTIONS',
        name: 'Mentions',
        symmetric: false,
        transitive: false,
        self_loop_allowed: false,
        provenance_required: true,
        review_required: false,
        allowed_source_kinds: 'PASSAGE',
        allowed_target_kinds: 'PERSON',
        ontology_version: 'WITNESS_RELATION_V1',
        active: true,
        is_active: true
      },
      {
        id: 2,
        code: 'PARALLELS',
        name: 'Parallels',
        symmetric: true,
        transitive: false,
        self_loop_allowed: false,
        provenance_required: true,
        review_required: true,
        allowed_source_kinds: 'PERSON',
        allowed_target_kinds: 'PERSON',
        ontology_version: 'WITNESS_RELATION_V1',
        active: true,
        is_active: true
      }
    ],
    wx_entity: [
      { id: 10, canonical_key: 'passage:quran:2:255', kind: 'PASSAGE', active: true, is_active: true },
      { id: 99, canonical_key: 'figure:musa', kind: 'PERSON', active: true, is_active: true },
      { id: 2, canonical_key: 'figure:isa', kind: 'PERSON', active: true, is_active: true }
    ],
    wx_entity_alias: [
      {
        id: 31,
        entity_id: 99,
        label: 'Moses',
        normalized_label: 'moses',
        alias_type: 'ALTERNATE',
        epistemic_lane: 'CORE',
        active: true,
        is_active: true
      }
    ],
    wx_source: [
      { id: 4, stable_key: 'quran:test:r1', source_class: 'REVELATION', revision: 'quran-r1', active: true, is_active: true },
      { id: 5, stable_key: 'other:test:r1', source_class: 'TEXTUAL_WITNESS', revision: 'other-r1', active: true, is_active: true }
    ],
    wx_provenance: [
      { id: 7, stable_key: 'prov:quran:2:255', source_id: 4, source_revision: 'quran-r1', superseded: false, active: true, is_active: true }
    ],
    wx_relation: []
  }
}

describe('WitnessGraphService integration contract', () => {
  beforeEach(() => {
    seedMockGraph()
    setupOrm(createMockKnex())
  })

  const env = () => createCtx(SUPERUSER_ID, {}, () => null)

  async function createMention() {
    return WitnessGraphService.createRelation(env(), {
      fromEntityId: 10,
      relationTypeCode: 'MENTIONS',
      toEntityId: 99,
      provenanceId: 7,
      confidenceBp: 9300
    })
  }

  async function createParallel() {
    return WitnessGraphService.createRelation(env(), {
      fromEntityId: 99,
      relationTypeCode: 'PARALLELS',
      toEntityId: 2,
      provenanceId: 7,
      operationalStatus: 'PROVISIONAL'
    })
  }

  it('creates an idempotent relation with resolved provenance/source inheritance', async () => {
    const first = await createMention()
    const second = await createMention()

    expect(mockDb.wx_relation).toHaveLength(1)
    expect(first.id).toBe(second.id)
    expect(first.source_id).toBe(4)
    expect(first.source_class).toBe('REVELATION')
    expect(first.source_revision).toBe('quran-r1')
    expect(first.edge_key).toBe(canonicalRelationKey({
      fromEntityKey: 'passage:quran:2:255',
      relationTypeCode: 'MENTIONS',
      toEntityKey: 'figure:musa',
      ontologyVersion: 'WITNESS_RELATION_V1',
      sourceKey: 'quran:test:r1',
      sourceRevision: 'quran-r1'
    }))
  })

  it('orders symmetric relation endpoints by canonical semantic key, not DB id', async () => {
    const relation = await createParallel()
    expect(relation.from_entity_id).toBe(2)
    expect(relation.to_entity_id).toBe(99)
  })

  it('rejects nonexistent provenance rather than accepting an arbitrary numeric id', async () => {
    await expect(WitnessGraphService.createRelation(env(), {
      fromEntityId: 10,
      relationTypeCode: 'MENTIONS',
      toEntityId: 99,
      provenanceId: 999
    })).rejects.toThrow(/Provenance 999/)
  })

  it('rejects a source that contradicts the resolved provenance lineage', async () => {
    await expect(WitnessGraphService.createRelation(env(), {
      fromEntityId: 10,
      relationTypeCode: 'MENTIONS',
      toEntityId: 99,
      provenanceId: 7,
      sourceId: 5
    })).rejects.toThrow(/does not match provenance source/)
  })

  it('rejects source-class or revision overrides that contradict canonical provenance', async () => {
    await expect(WitnessGraphService.createRelation(env(), {
      fromEntityId: 10,
      relationTypeCode: 'MENTIONS',
      toEntityId: 99,
      provenanceId: 7,
      sourceClass: 'TEXTUAL_WITNESS'
    })).rejects.toThrow(/does not match source classification/)

    await expect(WitnessGraphService.createRelation(env(), {
      fromEntityId: 10,
      relationTypeCode: 'MENTIONS',
      toEntityId: 99,
      provenanceId: 7,
      sourceRevision: 'invented-r9'
    })).rejects.toThrow(/does not match provenance revision/)
  })

  it('exposes explicit inbound/outbound neighbors and aliases without duplicating identity', async () => {
    const mention = await createMention()
    await createParallel()

    const outbound = await WitnessGraphService.outboundRelations(env(), 10, 'MENTIONS')
    const inbound = await WitnessGraphService.inboundRelations(env(), 99, 'MENTIONS')
    const neighbors = await WitnessGraphService.neighbors(env(), 10)
    const aliases = await WitnessGraphService.aliases(env(), 99)

    expect(outbound.map((row) => row.id)).toEqual([mention.id])
    expect(inbound.map((row) => row.id)).toEqual([mention.id])
    expect(neighbors).toHaveLength(1)
    expect(neighbors[0].entity.id).toBe(99)
    expect(neighbors[0].direction).toBe('OUTBOUND')
    expect(aliases.map((row) => row.label)).toEqual(['Moses'])
  })

  it('finds a bounded shortest path and supports predicate-scoped traversal', async () => {
    await createMention()
    await createParallel()

    const path = await WitnessGraphService.pathBetween(env(), 10, 2, 2)
    expect(path?.nodes.map((node) => node.id)).toEqual([10, 99, 2])
    expect(path?.relations).toHaveLength(2)

    const mentionsOnly = await WitnessGraphService.traverse(env(), 10, 2, 'MENTIONS')
    expect(mentionsOnly.map((node) => node.entity.id)).toEqual([10, 99])

    await expect(WitnessGraphService.pathBetween(env(), 10, 2, 5)).rejects.toThrow(/maxDepth/)
  })

  it('expands relation provenance without losing source identity', async () => {
    const relation = await createMention()
    const bundle = await WitnessGraphService.relationProvenance(env(), relation.id)

    expect(bundle?.relation.id).toBe(relation.id)
    expect(bundle?.provenance?.id).toBe(7)
    expect(bundle?.source?.id).toBe(4)
    expect(bundle?.source?.source_class).toBe('REVELATION')
  })
})
