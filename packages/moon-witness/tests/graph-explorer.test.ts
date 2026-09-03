import { describe, it, expect, beforeEach } from 'vitest'
import { createCtx, setupOrm, registerModel, SUPERUSER_ID } from '@moon/orm'
import { exploreRelationships, exploreEvidence } from '../src/graph/domain-queries.js'
import WxEntity from '../src/models/wx-entity.js'
import WxRelation from '../src/models/wx-relation.js'
import WxRelationType from '../src/models/wx-relation-type.js'
import WxProvenance from '../src/models/wx-provenance.js'
import WxSource from '../src/models/wx-source.js'
import WxContent from '../src/models/wx-content.js'
import WxAssertion from '../src/models/wx-assertion.js'
import WxEvidence from '../src/models/wx-evidence.js'

type Row = Record<string, any>
let mockDb: Record<string, Row[]> = {}

const rawKey = (column: string) => (column.includes('.') ? column.split('.').pop()! : column)

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
          const snakeKey = key.replace(/[A-Z]/g, (c) => `_${c.toLowerCase()}`)
          const camelKey = key.replace(/_([a-z])/g, (_, c) => c.toUpperCase())
          const actual =
            row[key] !== undefined
              ? row[key]
              : row[snakeKey] !== undefined
              ? row[snakeKey]
              : row[camelKey] !== undefined
              ? row[camelKey]
              : key === 'is_active'
              ? row['active']
              : key === 'active'
              ? row['is_active']
              : undefined
          if (op === '=') return actual === expected
          if (op === '!=') return actual !== expected
          if (op === 'in') return Array.isArray(expected) && expected.includes(actual)
          return actual === expected
        })
        return query
      },
      andWhere(column: any, opOrValue?: any, maybeValue?: any) {
        return query.where(column, opOrValue, maybeValue)
      },
      orWhere(column: any, opOrValue?: any, maybeValue?: any) {
        return query.where(column, opOrValue, maybeValue)
      },
      whereIn(column: string, values: any[]) {
        const key = rawKey(column)
        predicates.push((row) => {
          const snakeKey = key.replace(/[A-Z]/g, (c) => `_${c.toLowerCase()}`)
          const camelKey = key.replace(/_([a-z])/g, (_, c) => c.toUpperCase())
          const actual = row[key] !== undefined ? row[key] : row[snakeKey] !== undefined ? row[snakeKey] : row[camelKey]
          return values.includes(actual)
        })
        return query
      },
      select: () => query,
      orderBy: () => query,
      limit: (value: number) => {
        limitValue = value
        return query
      },
      offset: (value: number) => {
        offsetValue = value
        return query
      },
      first: async () => {
        const rows = table.filter((row) => predicates.every((p) => p(row)))
        return rows[0] ? { ...rows[0] } : null
      },
      insert: (data: any | any[]) => {
        const items = Array.isArray(data) ? data.flat() : [data]
        const inserted: any[] = []
        for (const item of items) {
          const id = item.id || table.length + 1
          const row = { id, is_active: true, active: true, ...item }
          table.push(row)
          inserted.push(row)
        }
        const resPromise: any = Promise.resolve(inserted)
        resPromise.returning = async () => inserted
        return resPromise
      },
      update: async (data: any) => {
        let count = 0
        for (const row of table) {
          if (predicates.every((p) => p(row))) {
            Object.assign(row, data)
            count++
          }
        }
        return count
      },
      then(resolve: (rows: Row[]) => void, reject?: (error: unknown) => void) {
        try {
          const rows = table
            .filter((row) => predicates.every((p) => p(row)))
            .slice(offsetValue, limitValue === undefined ? undefined : offsetValue + limitValue)
          resolve(rows.map((row) => ({ ...row })))
        } catch (error) {
          reject?.(error)
        }
      }
    }
    return query
  }

  conn.transaction = async (cb: any) => await cb(conn)
  conn.raw = (sql: string, bindings: any[]) => ({ sql, bindings })
  conn.on = () => conn
  return conn
}

registerModel(WxEntity)
registerModel(WxRelation)
registerModel(WxRelationType)
registerModel(WxProvenance)
registerModel(WxSource)
registerModel(WxContent)
registerModel(WxAssertion)
registerModel(WxEvidence)

describe('Phase 17 — Relationship Navigation & Evidence Explorer', () => {
  let env: any

  beforeEach(() => {
    mockDb = {
      wx_entity: [
        { id: 1, canonical_key: 'entity:quran:1:1', kind: 'PASSAGE', canonical_name: 'Al-Fatihah 1', active: true, is_active: true },
        { id: 2, canonical_key: 'entity:divine:allah', kind: 'DIVINE_NAME', canonical_name: 'Allah', active: true, is_active: true },
        { id: 3, canonical_key: 'entity:divine:rahman', kind: 'ATTRIBUTE', canonical_name: 'Ar-Rahman', active: true, is_active: true }
      ],
      wx_relation_type: [
        { id: 10, code: 'CONTAINS', name: 'Contains', symmetric: false, active: true, is_active: true },
        { id: 20, code: 'REFERENCES', name: 'References', symmetric: false, active: true, is_active: true }
      ],
      wx_relation: [
        {
          id: 100,
          edge_key: 'edge:quran:1:1-contains-allah',
          from_entity_id: 1,
          fromEntityId: 1,
          relation_type_id: 10,
          relationTypeId: 10,
          to_entity_id: 2,
          toEntityId: 2,
          authority_class: 'PRIMARY_SOURCE',
          polarity: 'AFFIRMED',
          modality: 'ASSERTED',
          active: true,
          is_active: true
        },
        {
          id: 200,
          edge_key: 'edge:quran:1:1-contains-rahman',
          from_entity_id: 1,
          fromEntityId: 1,
          relation_type_id: 10,
          relationTypeId: 10,
          to_entity_id: 3,
          toEntityId: 3,
          authority_class: 'PRIMARY_SOURCE',
          polarity: 'AFFIRMED',
          modality: 'ASSERTED',
          active: true,
          is_active: true
        }
      ],
      wx_provenance: [
        {
          id: 301,
          stable_key: 'prov:quran:uthmani:1:1',
          source_revision: '1.0.0',
          derivation_kind: 'SOURCE_NORM',
          active: true,
          is_active: true
        }
      ],
      wx_content: [
        {
          id: 501,
          passage_id: 1,
          passageId: 1,
          language: 'ar',
          text: 'بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ',
          active: true,
          is_active: true
        }
      ],
      wx_assertion: [
        {
          id: 701,
          entity_id: 1,
          entityId: 1,
          subject_entity_id: 1,
          subjectEntityId: 1,
          predicate: 'CONTAINS_DIVINE_NAME',
          object_entity_id: 2,
          objectEntityId: 2,
          assertion_class: 'EXPLICIT_SOURCE',
          status: 'ESTABLISHED',
          active: true,
          is_active: true
        }
      ],
      wx_evidence: [
        {
          id: 801,
          assertion_id: 701,
          assertionId: 701,
          content_id: 501,
          contentId: 501,
          provenance_id: 301,
          provenanceId: 301,
          relation: 'SUPPORTS',
          polarity: 'AFFIRMED',
          weight_bp: 10000,
          weightBp: 10000,
          source_reference: 'Q.S Al-Fatihah (1:1)',
          sourceReference: 'Q.S Al-Fatihah (1:1)',
          active: true,
          is_active: true
        }
      ]
    }

    setupOrm(createMockKnex())

    const modelMap: Record<string, any> = {
      'wx.entity': WxEntity,
      'wx.relation': WxRelation,
      'wx.relation.type': WxRelationType,
      'wx.provenance': WxProvenance,
      'wx.source': WxSource,
      'wx.content': WxContent,
      'wx.assertion': WxAssertion,
      'wx.evidence': WxEvidence
    }

    env = createCtx(SUPERUSER_ID, {}, (name) => modelMap[name] || null)
  })

  describe('Relationship Explorer', () => {
    it('explores outbound relationships and returns target entities with relation types', async () => {
      const result = await exploreRelationships(env, 1, { limit: 10 })
      expect(result).not.toBeNull()
      expect(result!.centerEntity).toBeDefined()
      expect(result!.outbound.length).toBe(2)
      expect(result!.inbound.length).toBe(0)
      expect(result!.totalCount).toBe(2)

      const first = result!.outbound[0]!
      expect(first.targetEntity?.id).toBe(2)
      expect(first.relationType?.code).toBe('CONTAINS')
    })

    it('returns null when center entity is not found', async () => {
      const result = await exploreRelationships(env, 9999)
      expect(result).toBeNull()
    })
  })

  describe('Evidence Explorer', () => {
    it('retrieves evidence linked to an assertion with provenance and content', async () => {
      const result = await exploreEvidence(env, { assertionId: 701 })
      expect(result.targetId).toBe(701)
      expect(result.targetType).toBe('ASSERTION')
      expect(result.totalCount).toBe(1)

      const ev = result.evidence[0]!
      expect(ev.relation).toBe('SUPPORTS')
      expect(ev.polarity).toBe('AFFIRMED')
      expect(ev.sourceReference).toBe('Q.S Al-Fatihah (1:1)')
      expect(ev.content?.text).toContain('بِسْمِ اللَّهِ')
      expect(ev.provenance?.stable_key).toBe('prov:quran:uthmani:1:1')
    })
  })
})
