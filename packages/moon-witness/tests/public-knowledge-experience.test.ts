import { describe, it, expect, beforeEach } from 'vitest'
import { lookupReference, searchWitnessGraph } from '../src/services/retrieval.js'
import { createCtx, setupOrm, registerModel, SUPERUSER_ID } from '@moon/orm'
import WxSource from '../src/models/wx-source.js'
import WxProvenance from '../src/models/wx-provenance.js'
import WxTextEdition from '../src/models/wx-text-edition.js'
import WxPassage from '../src/models/wx-passage.js'
import WxContent from '../src/models/wx-content.js'
import WxTraditionCorpus from '../src/models/wx-tradition-corpus.js'
import WxTraditionUnit from '../src/models/wx-tradition-unit.js'
import WxTraditionReference from '../src/models/wx-tradition-reference.js'
import WxRoot from '../src/models/wx-root.js'
import WxLexeme from '../src/models/wx-lexeme.js'
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
registerModel(WxRoot)
registerModel(WxLexeme)
registerModel(WxEntity)

describe('Phase 14 — Public Knowledge Experience & Reading Architecture', () => {
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
      'wx.root': WxRoot,
      'wx.lexeme': WxLexeme,
      'wx.entity': WxEntity
    }

    env = createCtx(SUPERUSER_ID, {}, (name) => modelMap[name] || null)

    // Seed Scripture & Hadith datasets
    const src = await WxSource.spawn(WxSource, env, {
      stableKey: 'source:quran-uthmani',
      name: 'Al-Qur\'an al-Karim',
      sourceClass: 'REVELATION',
      capability: 'NORMATIVE_TEXT',
      corpus: 'moonwitness-corpus',
      revision: '1.0.0',
      active: true
    })
    const sourceId = idOf(src)!

    const p = await WxPassage.spawn(WxPassage, env, {
      canonicalReference: 'quran:1:1',
      sourceRevision: '1.0.0',
      active: true
    })
    const passageId = idOf(p)!

    await WxContent.spawn(WxContent, env, {
      stableKey: 'content:1:1:orig',
      passageId,
      sourceId,
      contentType: 'ORIGINAL_TEXT',
      language: 'ar',
      text: 'بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ',
      active: true
    })

    await WxContent.spawn(WxContent, env, {
      stableKey: 'content:1:1:tr:id',
      passageId,
      sourceId,
      contentType: 'TRANSLATION',
      language: 'id',
      text: 'Dengan nama Allah Yang Maha Pengasih, Maha Penyayang.',
      active: true
    })

    const unit = await WxTraditionUnit.spawn(WxTraditionUnit, env, {
      stableKey: 'tradition:unit:bukhari:1',
      sequence: 1,
      active: true
    })
    const unitId = idOf(unit)!

    await WxTraditionReference.spawn(WxTraditionReference, env, {
      unitId,
      stableKey: 'tradition:ref:bukhari:1',
      localNumber: 'bukhari:1',
      active: true
    })
  })

  describe('Scripture Reader Flow', () => {
    it('retrieves passage with Arabic original text and translations', async () => {
      const res = await lookupReference(env, 'Q:1:1')
      expect(res.resolved).toBe(true)
      expect(res.type).toBe('SCRIPTURE')
      expect(res.content?.length).toBe(1)
      expect(res.translations?.length).toBe(1)

      const orig = res.content?.[0] as any
      expect(orig.language).toBe('ar')
      expect(orig.text).toBe('بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ')
    })
  })

  describe('Search to Content Deep Linking', () => {
    it('finds passage by translation text and returns deep-link URL', async () => {
      const searchRes = await searchWitnessGraph(env, {
        query: 'Pengasih',
        filter: 'SCRIPTURE'
      })
      expect(searchRes.total).toBeGreaterThanOrEqual(1)
      const first = searchRes.results[0]!
      expect(first.type).toBe('SCRIPTURE')
      expect(first.link).toContain('/scripture/1')
      expect(first.snippet).toContain('Pengasih')
    })
  })
})
