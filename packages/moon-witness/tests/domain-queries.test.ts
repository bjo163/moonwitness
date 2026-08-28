import { beforeEach, describe, expect, it } from 'vitest'
import { createCtx, setupOrm, SUPERUSER_ID } from '@moon/orm'
import {
  entityProfile,
  figureMentions,
  findEntities,
  passageByReference,
  passageContent,
  passageTree
} from '../src/graph/domain-queries.ts'

type Row = Record<string, any>
let mockDb: Record<string, Row[]> = {}

function createMockKnex() {
  const conn: any = (tableName: string) => {
    if (!mockDb[tableName]) mockDb[tableName] = []
    const table = mockDb[tableName]
    const predicates: Array<(row: Row) => boolean> = []
    let limitValue: number | undefined
    let offsetValue = 0
    const keyOf = (column: string) => column.split('.').pop()!

    const query: any = {
      where(column: any, opOrValue?: any, maybeValue?: any) {
        if (typeof column === 'function') {
          column(query)
          return query
        }
        const key = keyOf(String(column))
        const operator = maybeValue === undefined ? '=' : String(opOrValue).toLowerCase()
        const expected = maybeValue === undefined ? opOrValue : maybeValue
        predicates.push((row) => {
          const actual = row[key]
          if (operator === 'ilike') return String(actual ?? '').toLowerCase().includes(String(expected).toLowerCase().replaceAll('%', ''))
          if (operator === 'like') return String(actual ?? '').includes(String(expected).replaceAll('%', ''))
          if (operator === '>=') return actual >= expected
          if (operator === '<=') return actual <= expected
          if (operator === '>') return actual > expected
          if (operator === '<') return actual < expected
          return actual === expected
        })
        return query
      },
      andWhere: (...args: any[]) => query.where(...args),
      orWhere: (...args: any[]) => query.where(...args),
      whereNot(column: any, value?: any) {
        const key = keyOf(String(column))
        predicates.push((row) => row[key] !== value)
        return query
      },
      whereIn(column: string, values: any[]) {
        const key = keyOf(column)
        predicates.push((row) => values.includes(row[key]))
        return query
      },
      select: () => query,
      orderBy: () => query,
      limit: (value: number) => { limitValue = value; return query },
      offset: (value: number) => { offsetValue = value; return query },
      async first() {
        return table.find((row) => predicates.every((predicate) => predicate(row))) ?? null
      },
      then(resolve: (rows: Row[]) => void, reject?: (error: unknown) => void) {
        try {
          const rows = table
            .filter((row) => predicates.every((predicate) => predicate(row)))
            .slice(offsetValue, limitValue === undefined ? undefined : offsetValue + limitValue)
          resolve(rows.map((row) => ({ ...row })))
        } catch (error) {
          reject?.(error)
        }
      }
    }
    return query
  }

  conn.transaction = async (callback: any) => callback(conn)
  conn.raw = () => ({})
  conn.on = () => conn
  return conn
}

function seed() {
  mockDb = {
    wx_entity: [
      { id: 1, canonical_key: 'passage:quran:2', kind: 'PASSAGE', name: 'Surah 2', label: 'Surah 2', active: true, is_active: true },
      { id: 2, canonical_key: 'passage:quran:2:255', kind: 'PASSAGE', name: 'Quran 2:255', label: 'Quran 2:255', active: true, is_active: true },
      { id: 3, canonical_key: 'passage:quran:2:255:1', kind: 'PASSAGE', name: 'Quran 2:255 span', label: 'Quran 2:255 span', active: true, is_active: true },
      { id: 10, canonical_key: 'figure:musa', kind: 'PERSON', name: 'Musa', label: 'Musa', active: true, is_active: true }
    ],
    wx_entity_alias: [{ id: 1, entity_id: 10, label: 'Moses', active: true, is_active: true }],
    wx_figure: [{ id: 20, entity_id: 10, stable_key: 'figure:musa', name: 'Musa', active: true, is_active: true }],
    wx_figure_name: [{ id: 21, figure_id: 20, name: 'Moses', name_type: 'TRANSLITERATION', active: true, is_active: true }],
    wx_figure_role: [{ id: 22, figure_id: 20, role_code: 'PROPHET', certainty: 'ESTABLISHED', active: true, is_active: true }],
    wx_scripture: [{ id: 30, entity_id: 1, name: 'Quran', active: true, is_active: true }],
    wx_passage: [
      { id: 40, entity_id: 1, scripture_id: 30, parent_id: null, passage_type: 'SURAH', sequence: 2, canonical_reference: 'QURAN:2', active: true, is_active: true },
      { id: 41, entity_id: 2, scripture_id: 30, parent_id: 40, passage_type: 'AYAH', sequence: 255, canonical_reference: 'QURAN:2:255', active: true, is_active: true },
      { id: 42, entity_id: 3, scripture_id: 30, parent_id: 41, passage_type: 'SECTION', sequence: 1, canonical_reference: 'QURAN:2:255:1', active: true, is_active: true }
    ],
    wx_content: [{ id: 50, passage_id: 41, content_type: 'ORIGINAL_TEXT', text: 'source text', active: true, is_active: true }],
    wx_relation_type: [{ id: 60, code: 'MENTIONS', active: true, is_active: true }],
    wx_relation: [{ id: 61, from_entity_id: 2, relation_type_id: 60, to_entity_id: 10, active: true, is_active: true }]
  }
}

describe('Witness bounded domain query contract (#55)', () => {
  beforeEach(() => {
    seed()
    setupOrm(createMockKnex())
  })

  const env = () => createCtx(SUPERUSER_ID, {}, () => null)

  it('finds entities by label and canonical identity with a bounded limit', async () => {
    const rows = await findEntities(env(), { query: 'Moses', kind: 'PERSON', limit: 500 })
    expect(rows).toHaveLength(1)
    expect(rows[0].canonical_key).toBe('figure:musa')
    await expect(findEntities(env(), { stableKey: 'figure:musa' })).resolves.toHaveLength(1)
  })

  it('returns a profile with aliases, figure names, roles, and passage content', async () => {
    const person = await entityProfile(env(), 10)
    expect(person?.aliases).toHaveLength(1)
    expect(person?.names?.[0].name).toBe('Moses')
    expect(person?.roles?.[0].role_code).toBe('PROPHET')

    const passage = await entityProfile(env(), 2)
    expect(passage?.content?.[0].text).toBe('source text')
  })

  it('resolves passage references and returns bounded hierarchy/content views', async () => {
    const passage = await passageByReference(env(), 'QURAN:2:255')
    expect(passage?.id).toBe(41)
    expect(await passageContent(env(), 41)).toHaveLength(1)
    const tree = await passageTree(env(), 41, 10, 500)
    expect(tree?.ancestors.map((row) => row.id)).toEqual([40])
    expect(tree?.descendants.map((row) => row.id)).toEqual([42])
  })

  it('returns only accessible passage sources for a figure mention query', async () => {
    const result = await figureMentions(env(), 10)
    expect(result?.mentions).toHaveLength(1)
    expect(result?.mentions[0].passage.canonical_reference).toBe('QURAN:2:255')
    expect(result?.mentions[0].scripture?.name).toBe('Quran')
  })
})
