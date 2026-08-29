import { describe, it, expect, beforeEach } from 'vitest'
import {
  normalizeArabic,
  lookupReference,
  searchWitnessGraph,
  getSearchIndexDiagnostics
} from '../src/services/retrieval.js'
import { createCtx, setupOrm, registerModel, SUPERUSER_ID } from '@moon/orm'
import WxPassage from '../src/models/wx-passage.js'
import WxContent from '../src/models/wx-content.js'
import WxTextEdition from '../src/models/wx-text-edition.js'
import WxTraditionCorpus from '../src/models/wx-tradition-corpus.js'
import WxTraditionUnit from '../src/models/wx-tradition-unit.js'
import WxTraditionReference from '../src/models/wx-tradition-reference.js'
import WxRoot from '../src/models/wx-root.js'
import WxLexeme from '../src/models/wx-lexeme.js'
import WxEntity from '../src/models/wx-entity.js'
import WxSourceSnapshot from '../src/models/wx-source-snapshot.js'

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
      update: (data: any) => {
        let updatedCount = 0
        for (const row of table) {
          let matches = true
          for (const [k, v] of Object.entries(queryObj._where)) {
            const camelKey = k.replace(/_([a-z])/g, (_, c) => c.toUpperCase())
            const snakeKey = k.replace(/[A-Z]/g, (c) => `_${c.toLowerCase()}`)
            const val = row[k] !== undefined ? row[k] : row[camelKey] !== undefined ? row[camelKey] : row[snakeKey]
            if (val !== v) {
              matches = false
              break
            }
          }
          if (matches) {
            Object.assign(row, data)
            updatedCount++
          }
        }
        const resPromise: any = Promise.resolve(updatedCount)
        resPromise.returning = async () => table
        return resPromise
      },
      del: () => {
        let deletedCount = 0
        for (let i = table.length - 1; i >= 0; i--) {
          const row = table[i]
          let matches = true
          for (const [k, v] of Object.entries(queryObj._where)) {
            const camelKey = k.replace(/_([a-z])/g, (_, c) => c.toUpperCase())
            const snakeKey = k.replace(/[A-Z]/g, (c) => `_${c.toLowerCase()}`)
            const val = row[k] !== undefined ? row[k] : row[camelKey] !== undefined ? row[camelKey] : row[snakeKey]
            if (val !== v) {
              matches = false
              break
            }
          }
          if (matches) {
            table.splice(i, 1)
            deletedCount++
          }
        }
        return Promise.resolve(deletedCount)
      },
      then: (resolve: any, reject: any) => {
        try {
          const res = table.filter((row) => {
            for (const [k, v] of Object.entries(queryObj._where)) {
              const camelKey = k.replace(/_([a-z])/g, (_, c) => c.toUpperCase())
              const snakeKey = k.replace(/[A-Z]/g, (c) => `_${c.toLowerCase()}`)
              const val = row[k] !== undefined ? row[k] : row[camelKey] !== undefined ? row[camelKey] : row[snakeKey]
              if (val !== v) return false
            }
            return true
          })
          resolve(res)
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

registerModel(WxPassage)
registerModel(WxContent)
registerModel(WxTextEdition)
registerModel(WxTraditionCorpus)
registerModel(WxTraditionUnit)
registerModel(WxTraditionReference)
registerModel(WxRoot)
registerModel(WxLexeme)
registerModel(WxEntity)
registerModel(WxSourceSnapshot)

describe('Phase 12 — Knowledge Retrieval & Search Architecture', () => {
  let env: any

  beforeEach(async () => {
    mockDb = {}
    setupOrm(createMockKnex())

    const modelMap: Record<string, any> = {
      'wx.passage': WxPassage,
      'wx.content': WxContent,
      'wx.text.edition': WxTextEdition,
      'wx.tradition.corpus': WxTraditionCorpus,
      'wx.tradition.unit': WxTraditionUnit,
      'wx.tradition.reference': WxTraditionReference,
      'wx.root': WxRoot,
      'wx.lexeme': WxLexeme,
      'wx.entity': WxEntity,
      'wx.source.snapshot': WxSourceSnapshot
    }

    env = createCtx(SUPERUSER_ID, {}, (name) => modelMap[name] || null)

    // Seed test data across domains
    const p1 = await WxPassage.spawn(WxPassage, env, {
      canonicalReference: 'quran:1:1',
      sourceRevision: '1.0.0',
      active: true
    })
    const p1Id = idOf(p1)!

    await WxContent.spawn(WxContent, env, {
      stableKey: 'content:1:1:orig',
      passageId: p1Id,
      contentType: 'ORIGINAL_TEXT',
      language: 'ar',
      text: 'بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ',
      active: true
    })

    await WxContent.spawn(WxContent, env, {
      stableKey: 'content:1:1:tr:id',
      passageId: p1Id,
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

    await WxRoot.spawn(WxRoot, env, {
      stableKey: 'root:ar:ktb',
      languageCode: 'ar',
      writtenForm: 'ك-ت-ب',
      active: true
    })

    await WxLexeme.spawn(WxLexeme, env, {
      stableKey: 'lexeme:ar:kitab',
      languageCode: 'ar',
      lemma: 'كِتَاب',
      active: true
    })

    await WxSourceSnapshot.spawn(WxSourceSnapshot, env, {
      sourceRevision: '1.0.0',
      status: 'completed',
      active: true
    })
  })

  describe('Arabic Normalization', () => {
    it('strips tashkeel and normalizes alif, ta marbuta, and alif maqsurah', () => {
      const diacriticText = 'بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ'
      const normalized = normalizeArabic(diacriticText)
      expect(normalized).toBe('بسم الله الرحمن الرحيم')

      expect(normalizeArabic('إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ')).toBe('اياك نعبد واياك نستعين')
      expect(normalizeArabic('رَحْمَة')).toBe('رحمه')
      expect(normalizeArabic('هُدًى')).toBe('هدي')
    })
  })

  describe('Exact Reference Lookup', () => {
    it('resolves Quran references deterministically across multiple notations', async () => {
      const res1 = await lookupReference(env, 'quran:1:1')
      expect(res1.resolved).toBe(true)
      expect(res1.type).toBe('SCRIPTURE')
      expect(res1.content?.length).toBe(1)
      expect(res1.translations?.length).toBe(1)

      const res2 = await lookupReference(env, 'Q:1:1')
      expect(res2.resolved).toBe(true)

      const res3 = await lookupReference(env, '1:1')
      expect(res3.resolved).toBe(true)
    })

    it('resolves Hadith references deterministically', async () => {
      const res = await lookupReference(env, 'bukhari:1')
      expect(res.resolved).toBe(true)
      expect(res.type).toBe('HADITH')
      expect(res.tradition).toBeDefined()
    })

    it('resolves Lexical root and lexeme references', async () => {
      const rootRes = await lookupReference(env, 'root:ar:ktb')
      expect(rootRes.resolved).toBe(true)
      expect(rootRes.type).toBe('LEXICAL')
      expect(rootRes.root).toBeDefined()

      const lexRes = await lookupReference(env, 'lexeme:ar:kitab')
      expect(lexRes.resolved).toBe(true)
      expect(lexRes.type).toBe('LEXICAL')
      expect(lexRes.lexeme).toBeDefined()
    })

    it('returns unresolved for unknown reference', async () => {
      const res = await lookupReference(env, 'unknown:999:999')
      expect(res.resolved).toBe(false)
    })
  })

  describe('Unified Multi-Domain Full-Text Search', () => {
    it('searches across Scripture original text and translations with diacritic-insensitivity', async () => {
      // Search with plain Arabic (no diacritics)
      const resAr = await searchWitnessGraph(env, { query: 'الرحمن' })
      expect(resAr.total).toBeGreaterThanOrEqual(1)
      expect(resAr.results[0]?.type).toBe('SCRIPTURE')

      // Search translation text
      const resId = await searchWitnessGraph(env, { query: 'Pengasih' })
      expect(resId.total).toBeGreaterThanOrEqual(1)
      expect(resId.results[0]?.snippet).toContain('Pengasih')
    })

    it('filters by domain properly', async () => {
      const resHadith = await searchWitnessGraph(env, { query: 'bukhari', filter: 'HADITH' })
      expect(resHadith.total).toBeGreaterThanOrEqual(1)
      expect(resHadith.results.every((r) => r.type === 'HADITH')).toBe(true)

      const resLexical = await searchWitnessGraph(env, { query: 'ك-ت-ب', filter: 'LEXICAL' })
      expect(resLexical.total).toBeGreaterThanOrEqual(1)
      expect(resLexical.results.every((r) => r.type === 'LEXICAL')).toBe(true)
    })
  })

  describe('Index Diagnostics', () => {
    it('returns healthy status and complete counts', async () => {
      const diag = await getSearchIndexDiagnostics(env)
      expect(diag.indexStatus).toBe('HEALTHY')
      expect(diag.totalIndexedRecords).toBeGreaterThan(0)
      expect(diag.countsByDomain.scripturePassages).toBe(1)
      expect(diag.countsByDomain.scriptureContents).toBe(2)
      expect(diag.countsByDomain.traditionUnits).toBe(1)
      expect(diag.countsByDomain.lexicalRoots).toBe(1)
    })
  })
})
