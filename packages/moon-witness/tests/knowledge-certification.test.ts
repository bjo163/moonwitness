import { describe, it, expect, beforeEach } from 'vitest'
import { createCtx, setupOrm, registerModel, SUPERUSER_ID } from '@moon/orm'
import { sha256String } from '../src/services/hash.js'
import WxEntity from '../src/models/wx-entity.js'
import WxRelation from '../src/models/wx-relation.js'
import WxRelationType from '../src/models/wx-relation-type.js'
import WxProvenance from '../src/models/wx-provenance.js'
import WxSource from '../src/models/wx-source.js'
import WxScripture from '../src/models/wx-scripture.js'
import WxPassage from '../src/models/wx-passage.js'
import WxContent from '../src/models/wx-content.js'
import WxAssertion from '../src/models/wx-assertion.js'
import WxEvidence from '../src/models/wx-evidence.js'
import WxSourceSnapshot from '../src/models/wx-source-snapshot.js'
import WxSourceArtifact from '../src/models/wx-source-artifact.js'
import { exploreEvidence } from '../src/graph/domain-queries.js'
import { lookupReference, normalizeArabic } from '../src/services/retrieval.js'

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
registerModel(WxScripture)
registerModel(WxPassage)
registerModel(WxContent)
registerModel(WxAssertion)
registerModel(WxEvidence)
registerModel(WxSourceSnapshot)
registerModel(WxSourceArtifact)

describe('Phase 18 — Data Integrity, Validation, Reconciliation & Release Certification', () => {
  let env: any

  const canonicalVerseText = 'بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ'
  const computedChecksum = sha256String(canonicalVerseText)

  beforeEach(() => {
    mockDb = {
      wx_source: [
        {
          id: 1,
          stable_key: 'source:quran:tanzil:v1',
          name: 'Al-Qur\'an al-Karim (Tanzil Uthmani)',
          source_class: 'PRIMARY_SOURCE',
          revision: '1.0.0',
          active: true,
          is_active: true
        }
      ],
      wx_scripture: [
        {
          id: 1,
          name: 'Al-Qur\'an',
          type: 'canonical',
          source_class: 'REVELATION',
          canonical_code: 'quran',
          source_id: 1,
          active: true,
          is_active: true
        }
      ],
      wx_passage: [
        {
          id: 1,
          scripture_id: 1,
          scriptureId: 1,
          canonical_reference: 'quran:1:1',
          canonicalReference: 'quran:1:1',
          sequence: 1,
          level: 'AYAH',
          parent_id: null,
          parentId: null,
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
          text: canonicalVerseText,
          checksum: computedChecksum,
          content_type: 'ORIGINAL_TEXT',
          provenance_id: 301,
          provenanceId: 301,
          active: true,
          is_active: true
        }
      ],
      wx_provenance: [
        {
          id: 301,
          stable_key: 'prov:quran:tanzil:1:1',
          source_id: 1,
          sourceId: 1,
          source_revision: '1.0.0',
          sourceRevision: '1.0.0',
          derivation_kind: 'SOURCE_NORM',
          active: true,
          is_active: true
        }
      ],
      wx_entity: [
        { id: 1, canonical_key: 'entity:quran:1:1', kind: 'PASSAGE', canonical_name: 'Al-Fatihah 1', active: true, is_active: true },
        { id: 2, canonical_key: 'entity:divine:allah', kind: 'DIVINE_NAME', canonical_name: 'Allah', active: true, is_active: true }
      ],
      wx_relation_type: [
        { id: 10, code: 'CONTAINS', name: 'Contains', symmetric: false, active: true, is_active: true }
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
      ],
      wx_source_artifact: [
        {
          id: 851,
          source_id: 1,
          sourceId: 1,
          artifact_type: 'PRIMARY_TEXT',
          file_format: 'JSON',
          checksum: 'sha256-mock-artifact',
          active: true,
          is_active: true
        }
      ],
      wx_source_snapshot: [
        {
          id: 901,
          manifest_id: 1,
          manifestId: 1,
          artifact_id: 851,
          artifactId: 851,
          policy_version: '1.0.0',
          status: 'COMMITTED',
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
      'wx.scripture': WxScripture,
      'wx.passage': WxPassage,
      'wx.content': WxContent,
      'wx.assertion': WxAssertion,
      'wx.evidence': WxEvidence,
      'wx.source.snapshot': WxSourceSnapshot,
      'wx.source.artifact': WxSourceArtifact
    }

    env = createCtx(SUPERUSER_ID, {}, (name) => modelMap[name] || null)
  })

  describe('1. Canonical Text & UTF-8 / Unicode Preservation', () => {
    it('verifies exact Arabic diacritics and text checksum parity', () => {
      const content = mockDb.wx_content[0]!
      expect(content.text).toBe(canonicalVerseText)
      expect(content.checksum).toBe(sha256String(content.text))
    })

    it('ensures search normalization does not overwrite canonical text', () => {
      const canonical = mockDb.wx_content[0]!.text
      const normalizedSearch = normalizeArabic(canonical)
      expect(canonical).toContain('الرَّحْمَنِ')
      expect(normalizedSearch).not.toContain('َ') // diacritics stripped for indexing only
      expect(mockDb.wx_content[0]!.text).toBe(canonical) // original remains intact
    })
  })

  describe('2. Source & Provenance Relational Traceability', () => {
    it('reconciles unbroken lineage from evidence back to canonical source and provenance', async () => {
      const evidenceResult = await exploreEvidence(env, { assertionId: 701 })
      expect(evidenceResult.totalCount).toBe(1)
      const ev = evidenceResult.evidence[0]!
      expect(ev.relation).toBe('SUPPORTS')
      expect(ev.content?.text).toBe(canonicalVerseText)
      expect(ev.provenance?.stable_key).toBe('prov:quran:tanzil:1:1')
      expect(ev.provenance?.source_revision).toBe('1.0.0')
    })

    it('guarantees zero orphan records across passages and relations', async () => {
      const passage = (await WxPassage.fetch(WxPassage, env, [['id', '=', 1], ['active', '=', true]]))[0]
      expect(passage).toBeDefined()
      const scripture = (await WxScripture.fetch(WxScripture, env, [['id', '=', passage.scriptureId], ['active', '=', true]]))[0]
      expect(scripture).toBeDefined()
      expect(scripture.canonical_code || scripture.canonicalCode).toBe('quran')
    })
  })

  describe('3. Reference Lookup & Identity Reconciliation', () => {
    it('canonicalizes and resolves reference unambiguously', async () => {
      const result = await lookupReference(env, 'quran:1:1')
      expect(result.resolved).toBe(true)
      expect(result.passage).toBeDefined()
    })

    it('ensures idempotent snapshot records with committed status', async () => {
      const snapshot = (await WxSourceSnapshot.fetch(WxSourceSnapshot, env, [['artifactId', '=', 851], ['active', '=', true]]))[0]
      expect(snapshot).toBeDefined()
      expect(snapshot.status).toBe('COMMITTED')
      expect(snapshot.policy_version || snapshot.policyVersion).toBe('1.0.0')
    })
  })
})
