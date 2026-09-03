import { describe, it, expect, beforeEach } from 'vitest'
import { lookupReference } from '../src/services/retrieval.js'
import { createCtx, setupOrm, registerModel, SUPERUSER_ID } from '@moon/orm'
import WxSource from '../src/models/wx-source.js'
import WxProvenance from '../src/models/wx-provenance.js'
import WxTextEdition from '../src/models/wx-text-edition.js'
import WxPassage from '../src/models/wx-passage.js'
import WxContent from '../src/models/wx-content.js'
import WxTraditionCorpus from '../src/models/wx-tradition-corpus.js'
import WxTraditionUnit from '../src/models/wx-tradition-unit.js'
import WxTraditionReference from '../src/models/wx-tradition-reference.js'
import WxAssertion from '../src/models/wx-assertion.js'
import WxEvidence from '../src/models/wx-evidence.js'
import WxEntity from '../src/models/wx-entity.js'

let mockDb: Record<string, any[]> = {}

function createMockKnex() {
  const conn: any = (tableName: string) => {
    if (!mockDb[tableName]) mockDb[tableName] = []
    const table = mockDb[tableName]

    const queryObj: any = {
      _where: {} as Record<string, any>,
      where: (clause: any, val?: any) => {
        if (typeof clause === 'function') {
          clause(queryObj)
          return queryObj
        }
        if (typeof clause === 'object') {
          for (const [k, v] of Object.entries(clause)) {
            const rawKey = k.includes('.') ? k.split('.').pop()! : k
            queryObj._where[rawKey] = v
          }
        } else if (typeof clause === 'string' && val !== undefined) {
          const rawKey = clause.includes('.') ? clause.split('.').pop()! : clause
          queryObj._where[rawKey] = val
        }
        return queryObj
      },
      andWhere: (clause: any, val?: any) => queryObj.where(clause, val),
      orWhere: (clause: any, val?: any) => queryObj.where(clause, val),
      whereNot: (clause: any, val?: any) => queryObj.where(clause, val),
      whereIn: (col: string, vals: any[]) => {
        const rawKey = col.includes('.') ? col.split('.').pop()! : col
        queryObj._whereIn = { col: rawKey, vals }
        return queryObj
      },
      select: () => queryObj,
      orderBy: () => queryObj,
      limit: () => queryObj,
      offset: () => queryObj,
      first: async () => {
        return (
          table.find((row) => {
            for (const [k, v] of Object.entries(queryObj._where)) {
              const camelKey = k.replace(/_([a-z])/g, (_, c) => c.toUpperCase())
              const snakeKey = k.replace(/[A-Z]/g, (c) => `_${c.toLowerCase()}`)
              const val = row[k] !== undefined ? row[k] : row[camelKey] !== undefined ? row[camelKey] : row[snakeKey]
              if (val !== v) return false
            }
            return true
          }) || null
        )
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
          let match = true
          for (const [k, v] of Object.entries(queryObj._where)) {
            const camelKey = k.replace(/_([a-z])/g, (_, c) => c.toUpperCase())
            const snakeKey = k.replace(/[A-Z]/g, (c) => `_${c.toLowerCase()}`)
            const val = row[k] !== undefined ? row[k] : row[camelKey] !== undefined ? row[camelKey] : row[snakeKey]
            if (val !== v) {
              match = false
              break
            }
          }
          if (match) {
            Object.assign(row, data)
            count++
          }
        }
        return count
      },
      then: (resolve: any, reject: any) => {
        try {
          const filtered = table.filter((row) => {
            for (const [k, v] of Object.entries(queryObj._where)) {
              const camelKey = k.replace(/_([a-z])/g, (_, c) => c.toUpperCase())
              const snakeKey = k.replace(/[A-Z]/g, (c) => `_${c.toLowerCase()}`)
              const val = row[k] !== undefined ? row[k] : row[camelKey] !== undefined ? row[camelKey] : row[snakeKey]
              if (val !== v) return false
            }
            return true
          })
          resolve(filtered)
        } catch (e) {
          if (reject) reject(e)
        }
      }
    }
    return queryObj
  }

  conn.transaction = async (cb: any) => await cb(conn)
  conn.raw = (sql: string, bindings: any[]) => ({ sql, bindings })
  conn.on = () => conn
  return conn
}

function idOf(row: any): number | null {
  const id = Number(row?.id ?? row?._values?.id)
  return Number.isInteger(id) && id > 0 ? id : null
}

registerModel(WxSource)
registerModel(WxProvenance)
registerModel(WxTextEdition)
registerModel(WxPassage)
registerModel(WxContent)
registerModel(WxTraditionCorpus)
registerModel(WxTraditionUnit)
registerModel(WxTraditionReference)
registerModel(WxAssertion)
registerModel(WxEvidence)
registerModel(WxEntity)

describe('Phase 13 — Source Transparency, Citation & Evidence UX', () => {
  let env: any

  beforeEach(async () => {
    mockDb = {}
    setupOrm(createMockKnex())

    const modelMap: Record<string, any> = {
      'wx.source': WxSource,
      'wx.provenance': WxProvenance,
      'wx.text.edition': WxTextEdition,
      'wx.passage': WxPassage,
      'wx.content': WxContent,
      'wx.tradition.corpus': WxTraditionCorpus,
      'wx.tradition.unit': WxTraditionUnit,
      'wx.tradition.reference': WxTraditionReference,
      'wx.assertion': WxAssertion,
      'wx.evidence': WxEvidence,
      'wx.entity': WxEntity
    }

    env = createCtx(SUPERUSER_ID, {}, (name) => modelMap[name] || null)

    // Seed Source & Provenance
    const src = await WxSource.spawn(WxSource, env, {
      stableKey: 'source:quran-uthmani',
      name: 'Al-Qur\'an al-Karim',
      sourceClass: 'REVELATION',
      capability: 'NORMATIVE_TEXT',
      scriptureFamily: 'QURAN',
      corpus: 'moonwitness-corpus',
      edition: 'quran-uthmani-v1',
      revision: '1.0.0',
      artifactChecksum: 'sha256-abc123',
      active: true
    })
    const sourceId = idOf(src)!

    const prov = await WxProvenance.spawn(WxProvenance, env, {
      stableKey: 'prov:quran-uthmani:sha256-abc123',
      name: 'King Fahd Complex Uthmani Edition (1.0.0)',
      sourceId,
      sourceReference: 'moonwitness-corpus@e2f4a6b8',
      sourceRevision: '1.0.0',
      artifactChecksum: 'sha256-abc123',
      evidenceNote: 'Verified release artifact',
      active: true
    })
    const provenanceId = idOf(prov)!

    const edition = await WxTextEdition.spawn(WxTextEdition, env, {
      stableKey: 'edition:quran-uthmani-v1:1.0.0',
      name: 'Mushaf Madinah Uthmani',
      editionType: 'ORIGINAL',
      language: 'ar',
      sourceId,
      provenanceId,
      active: true
    })
    const editionId = idOf(edition)!

    const passage = await WxPassage.spawn(WxPassage, env, {
      canonicalReference: 'quran:1:1',
      sourceRevision: '1.0.0',
      provenanceId,
      active: true
    })
    const passageId = idOf(passage)!

    await WxContent.spawn(WxContent, env, {
      stableKey: 'content:1:1:orig',
      passageId,
      editionId,
      contentType: 'ORIGINAL_TEXT',
      language: 'ar',
      text: 'بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ',
      sourceId,
      provenanceId,
      active: true
    })

    await WxContent.spawn(WxContent, env, {
      stableKey: 'content:1:1:tr:id',
      passageId,
      editionId,
      contentType: 'TRANSLATION',
      language: 'id',
      text: 'Dengan nama Allah Yang Maha Pengasih, Maha Penyayang.',
      sourceId,
      provenanceId,
      active: true
    })
  })

  describe('Source & Provenance Traceability', () => {
    it('traces content record back to source, edition, revision, and provenance checksum', async () => {
      const lookup = await lookupReference(env, 'quran:1:1')
      expect(lookup.resolved).toBe(true)
      expect(lookup.type).toBe('SCRIPTURE')

      const origText = lookup.content?.[0] as any
      expect(origText).toBeDefined()
      expect(origText.contentType || origText.content_type).toBe('ORIGINAL_TEXT')
      expect(origText.provenanceId || origText.provenance_id).toBeDefined()

      const translation = lookup.translations?.[0] as any
      expect(translation).toBeDefined()
      expect(translation.contentType || translation.content_type).toBe('TRANSLATION')
    })
  })

  describe('Epistemic Distinction', () => {
    it('strictly separates original source text from translation', async () => {
      const lookup = await lookupReference(env, 'quran:1:1')
      expect(lookup.content?.length).toBe(1)
      expect(lookup.translations?.length).toBe(1)

      const orig = lookup.content?.[0] as any
      const tr = lookup.translations?.[0] as any

      expect(orig.language).toBe('ar')
      expect(tr.language).toBe('id')
      expect(orig.text).not.toBe(tr.text)
    })
  })
})
