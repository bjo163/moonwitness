import { describe, it, expect, beforeEach } from 'vitest'
import { createCtx, setupOrm, registerModel, SUPERUSER_ID } from '@moon/orm'
import { WitnessEngineRegistry, WitnessEngineRuntime } from '../src/services/engine-runtime.js'
import { InMemoryEngineRunStore } from '../src/services/engine-store.js'
import { checksumEngineResult } from '../src/services/engine-evidence.js'
import { createRevelationQueryModule } from '../src/engines/revelation-query.js'
import { createCrossScriptureComparisonModule } from '../src/engines/cross-scripture.js'
import { createLexicalAnalysisModule } from '../src/engines/lexical-analysis.js'
import { createResearchHypothesisModule } from '../src/engines/research-hypothesis.js'
import WxSource from '../src/models/wx-source.js'
import WxSourcePolicy from '../src/models/wx-source-policy.js'
import WxProvenance from '../src/models/wx-provenance.js'
import WxPassage from '../src/models/wx-passage.js'
import WxContent from '../src/models/wx-content.js'
import WxEntity from '../src/models/wx-entity.js'
import WxAssertion from '../src/models/wx-assertion.js'
import WxEvidence from '../src/models/wx-evidence.js'
import WxResearchHypothesis from '../src/models/wx-research-hypothesis.js'
import WxResearchRun from '../src/models/wx-research-run.js'

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
          if (operator === 'in') return Array.isArray(expected) && expected.includes(actual)
          if (operator === 'ilike') return String(actual ?? '').toLowerCase().includes(String(expected).toLowerCase().replaceAll('%', ''))
          return actual === expected
        })
        return query
      },
      andWhere: (...args: any[]) => query.where(...args),
      orWhere: (...args: any[]) => query.where(...args),
      whereIn(column: string, values: any[]) {
        const key = keyOf(column)
        predicates.push((row) => values.includes(row[key]))
        return query
      },
      select: () => query,
      orderBy: () => query,
      limit: (value: number) => { limitValue = value; return query },
      offset: (value: number) => { offsetValue = value; return query },
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

registerModel(WxSource)
registerModel(WxSourcePolicy)
registerModel(WxProvenance)
registerModel(WxPassage)
registerModel(WxContent)
registerModel(WxEntity)
registerModel(WxAssertion)
registerModel(WxEvidence)
registerModel(WxResearchHypothesis)
registerModel(WxResearchRun)

describe('Phase 16 — Knowledge Graph → Engine Runtime → Research Result', () => {
  let env: any
  let registry: WitnessEngineRegistry
  let runtime: WitnessEngineRuntime

  beforeEach(() => {
    mockDb = {
      wx_source: [
        {
          id: 101,
          name: 'Al-Qur\'an al-Karim',
          stable_key: 'source:quran-uthmani',
          source_class: 'REVELATION',
          capability: 'NORMATIVE_TEXT',
          corpus: 'moonwitness-corpus',
          revision: '1.0.0',
          active: true
        }
      ],
      wx_provenance: [
        {
          id: 301,
          stable_key: 'prov:quran:1:1',
          source_id: 101,
          source_revision: '1.0.0',
          derivation_kind: 'SOURCE_NORM',
          evidence_class: 'REVELATION',
          active: true
        }
      ],
      wx_passage: [
        {
          id: 1,
          canonical_reference: 'quran:1:1',
          source_revision: '1.0.0',
          active: true
        }
      ],
      wx_content: [
        {
          id: 501,
          passage_id: 1,
          source_id: 101,
          provenance_id: 301,
          content_type: 'ORIGINAL_TEXT',
          language: 'ar',
          text: 'بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ',
          active: true
        }
      ],
      wx_entity: [
        {
          id: 701,
          stable_key: 'entity:allah',
          canonical_name: 'Allah',
          entity_kind: 'DIVINE_NAME',
          active: true
        }
      ],
      wx_research_hypothesis: [
        {
          id: 901,
          stable_key: 'hypo:divine-unity:1',
          title: 'Divine Unity and Primordial Monotheism',
          status: 'PROVISIONAL',
          active: true
        }
      ]
    }

    setupOrm(createMockKnex())

    const modelMap: Record<string, any> = {
      'wx.source': WxSource,
      'wx.source.policy': WxSourcePolicy,
      'wx.provenance': WxProvenance,
      'wx.passage': WxPassage,
      'wx.content': WxContent,
      'wx.entity': WxEntity,
      'wx.assertion': WxAssertion,
      'wx.evidence': WxEvidence,
      'wx.research.hypothesis': WxResearchHypothesis,
      'wx.research.run': WxResearchRun
    }

    env = createCtx(SUPERUSER_ID, {}, (name) => modelMap[name] || null)

    registry = new WitnessEngineRegistry()
    registry.register(createRevelationQueryModule())
    registry.register(createCrossScriptureComparisonModule())
    registry.register(createLexicalAnalysisModule())
    registry.register(createResearchHypothesisModule())

    runtime = new WitnessEngineRuntime(new InMemoryEngineRunStore(), { registry })
  })

  describe('Engine Ingestion & Runtime Flow', () => {
    it('executes revelation query engine deterministically', async () => {
      const module = createRevelationQueryModule()
      const req = {
        moduleCode: module.code,
        moduleVersion: module.version,
        input: { reference: 'quran:1:1' }
      }

      const res1 = await runtime.runModule(env, req)
      const res2 = await runtime.runModule(env, req)

      expect(res1.summary).toBeDefined()
      expect(res1.sourceRevisions).toBeDefined()
      expect(checksumEngineResult(res1)).toBe(checksumEngineResult(res2))
    })

    it('preserves canonical source content immutability during engine run', async () => {
      const originalText = mockDb.wx_content[0]!.text
      const module = createRevelationQueryModule()

      await runtime.runModule(env, {
        moduleCode: module.code,
        moduleVersion: module.version,
        input: { reference: 'quran:1:1' }
      })

      expect(mockDb.wx_content[0]!.text).toBe(originalText)
      expect(mockDb.wx_content.length).toBe(1)
    })
  })

  describe('Evidence Linkage and Explanation', () => {
    it('allows explaining findings with lineage back to provenance references', async () => {
      const module = createRevelationQueryModule()
      const result = await runtime.runModule(env, {
        moduleCode: module.code,
        moduleVersion: module.version,
        input: { reference: 'quran:1:1' }
      })

      if (result.findings.length > 0) {
        const finding = result.findings[0]!
        const explanation = await runtime.explainFinding(env, result.runId, finding.key)
        expect(explanation.findingKey).toBe(finding.key)
      }
    })
  })
})
