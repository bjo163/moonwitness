import { beforeEach, describe, expect, it } from 'vitest'
import { createCtx, setupOrm, SUPERUSER_ID } from '@moon/orm'
import { checksumEngineResult } from '../src/services/engine-evidence.js'
import { InMemoryEngineRunStore } from '../src/services/engine-store.js'
import { WitnessEngineRegistry, WitnessEngineRuntime } from '../src/services/engine-runtime.js'
import {
  createFigureAnalysisModule,
  createTraditionTransmissionModule,
  validateFigureAnalysisInput,
  validateTraditionAnalysisInput
} from '../src/engines/figure-tradition.ts'

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

function row(id: number, canonicalKey: string, kind: string, name: string) {
  return { id, canonical_key: canonicalKey, kind, name, label: name, active: true, is_active: true }
}

function source(id: number, stableKey: string, revision: string) {
  return { id, stable_key: stableKey, name: stableKey, revision, active: true, is_active: true }
}

function provenance(id: number, stableKey: string, sourceId: number, revision: string) {
  return { id, stable_key: stableKey, name: stableKey, source_id: sourceId, source_revision: revision, active: true, is_active: true, superseded: false }
}

function seed() {
  mockDb = {
    wx_entity: [
      row(101, 'passage:quran:2:255', 'PASSAGE', 'Qur’an 2:255'),
      row(201, 'figure:musa', 'PERSON', 'Musa'),
      row(202, 'tradition:unit:1', 'TRADITION_UNIT', 'Hadith Unit 1')
    ],
    wx_source: [
      source(501, 'corpus:quran:original', 'quran-r1'),
      source(502, 'corpus:hadith:bukhari', 'bukhari-r1')
    ],
    wx_provenance: [
      provenance(401, 'prov:quran:original', 501, 'quran-r1'),
      provenance(402, 'prov:hadith:bukhari', 502, 'bukhari-r1')
    ],
    wx_passage: [
      { id: 21, entity_id: 101, canonical_reference: 'QURAN:2:255', active: true, is_active: true }
    ],
    wx_relation_type: [
      { id: 801, code: 'MENTIONS', name: 'Mentions', active: true, is_active: true }
    ],
    wx_relation: [
      {
        id: 901,
        from_entity_id: 101,
        relation_type_id: 801,
        to_entity_id: 201,
        provenance_id: 401,
        source_id: 501,
        source_revision: 'quran-r1',
        source_class: 'REVELATION',
        authority_class: 'PRIMARY_SOURCE',
        polarity: 'AFFIRMED',
        active: true,
        is_active: true
      }
    ],
    wx_figure: [
      { id: 1, entity_id: 201, name: 'Musa', canonical_key: 'fig:musa', active: true, is_active: true }
    ],
    wx_figure_name: [
      { id: 11, figure_id: 1, name: 'Musa ibn Imran', provenance_id: 401, active: true, is_active: true }
    ],
    wx_figure_role: [
      { id: 12, figure_id: 1, role_code: 'PROPHET', provenance_id: 401, active: true, is_active: true }
    ],
    wx_tradition_corpus: [
      { id: 1, title: 'Sahih al-Bukhari', tradition_type: 'HADITH', authority_source_id: 502, active: true, is_active: true }
    ],
    wx_tradition_unit: [
      { id: 1, entity_id: 202, corpus_id: 1, stable_key: 'hadith:bukhari:1', active: true, is_active: true }
    ],
    wx_tradition_reference: [
      { id: 31, unit_id: 1, stable_key: 'bukhari:1', provenance_id: 402, active: true, is_active: true }
    ],
    wx_tradition_attribution: [
      { id: 32, unit_id: 1, figure_id: 1, role_code: 'PRIMARY_TRANSMITTER', provenance_id: 402, active: true, is_active: true }
    ],
    wx_tradition_assessment: [
      { id: 33, tradition_unit_id: 1, assessment_scheme: 'HADITH_AUTHENTICITY', raw_value: 'SAHIH', provenance_id: 402, active: true, is_active: true }
    ],
    wx_transmission_chain: [
      { id: 41, tradition_unit_id: 1, chain_type: 'ISNAD_CONTINUOUS', provenance_id: 402, active: true, is_active: true }
    ],
    wx_transmission_link: [
      { id: 51, chain_id: 41, sequence: 1, person_entity_id: 201, transmission_mode: 'DIRECT_HEARING', active: true, is_active: true },
      { id: 52, chain_id: 41, sequence: 2, person_entity_id: 201, transmission_mode: 'DIRECT_HEARING', active: true, is_active: true }
    ]
  }
}

describe('Figure and Tradition engine contracts (#59)', () => {
  beforeEach(() => {
    seed()
    setupOrm(createMockKnex())
  })

  it('requires one canonical Figure target', () => {
    expect(validateFigureAnalysisInput({ figureId: 1 }).ok).toBe(true)
    expect(validateFigureAnalysisInput({ entityId: 2 }).ok).toBe(true)
    expect(validateFigureAnalysisInput({}).ok).toBe(false)
    expect(validateFigureAnalysisInput({ figureId: 1, entityId: 2 }).ok).toBe(false)
  })

  it('requires one Tradition target without assuming it is Hadith', () => {
    expect(validateTraditionAnalysisInput({ unitId: 1 }).ok).toBe(true)
    expect(validateTraditionAnalysisInput({ reference: 'rabbinic:berakhot:1' }).ok).toBe(true)
    expect(validateTraditionAnalysisInput({ figureId: 0 }).ok).toBe(false)
    expect(validateTraditionAnalysisInput({ unitId: 1, reference: 'duplicate' }).ok).toBe(false)
  })

  it('registers deterministic versioned modules', () => {
    expect(createFigureAnalysisModule()).toMatchObject({ code: 'figure.analysis', version: '1.0.0', deterministic: true })
    expect(createTraditionTransmissionModule()).toMatchObject({ code: 'tradition.transmission', version: '1.0.0', deterministic: true })
  })

  it('executes Figure Analysis Engine and produces names, roles, and scripture mentions', async () => {
    const env = createCtx(SUPERUSER_ID, {}, () => null)
    const registry = new WitnessEngineRegistry()
    registry.register(createFigureAnalysisModule())
    const store = new InMemoryEngineRunStore()
    const runtime = new WitnessEngineRuntime(store, { registry })

    const result = await runtime.runModule(env, {
      moduleCode: 'figure.analysis',
      moduleVersion: '1.0.0',
      input: { figureId: 1 }
    })

    expect(result.protocol).toBe('WITNESS_ENGINE_RESULT_V1')
    expect(result.findings.length).toBeGreaterThanOrEqual(3)

    const nameFinding = result.findings.find((f) => f.key.includes(':name:'))
    expect(nameFinding).toBeDefined()
    expect(nameFinding?.authorityClass).toBe('SOURCE_SUMMARY')
    expect(nameFinding?.evidence.length).toBe(1)

    const roleFinding = result.findings.find((f) => f.key.includes(':role:'))
    expect(roleFinding).toBeDefined()
    expect(roleFinding?.authorityClass).toBe('SOURCE_SUMMARY')

    const mentionFinding = result.findings.find((f) => f.key.includes(':mention:'))
    expect(mentionFinding).toBeDefined()
    expect(mentionFinding?.authorityClass).toBe('PRIMARY_SOURCE')
  })

  it('executes Tradition Transmission Engine and produces references, attributions, chains, and assessments', async () => {
    const env = createCtx(SUPERUSER_ID, {}, () => null)
    const registry = new WitnessEngineRegistry()
    registry.register(createTraditionTransmissionModule())
    const store = new InMemoryEngineRunStore()
    const runtime = new WitnessEngineRuntime(store, { registry })

    const result = await runtime.runModule(env, {
      moduleCode: 'tradition.transmission',
      moduleVersion: '1.0.0',
      input: { unitId: 1 }
    })

    expect(result.protocol).toBe('WITNESS_ENGINE_RESULT_V1')
    expect(result.findings.length).toBeGreaterThanOrEqual(4)

    const refFinding = result.findings.find((f) => f.key.includes(':reference:'))
    expect(refFinding?.authorityClass).toBe('TRANSMISSION_REPORT')

    const attrFinding = result.findings.find((f) => f.key.includes(':attribution:'))
    expect(attrFinding?.authorityClass).toBe('TRANSMISSION_REPORT')

    const assessFinding = result.findings.find((f) => f.key.includes(':assessment:'))
    expect(assessFinding?.authorityClass).toBe('SCHOLARLY_INTERPRETATION')

    const chainFinding = result.findings.find((f) => f.key.includes(':chain:'))
    expect(chainFinding?.statement).toContain('2 ordered link(s)')
  })

  it('replays Figure and Tradition runs deterministically with matching checksums', async () => {
    const env = createCtx(SUPERUSER_ID, {}, () => null)
    const registry = new WitnessEngineRegistry()
    registry.register(createFigureAnalysisModule())
    registry.register(createTraditionTransmissionModule())
    const store = new InMemoryEngineRunStore()
    const runtime = new WitnessEngineRuntime(store, {
      registry,
      revisionResolver: {
        async verify() {
          return { missing: [] }
        }
      }
    })

    const figureResult = await runtime.runModule(env, {
      moduleCode: 'figure.analysis',
      moduleVersion: '1.0.0',
      input: { figureId: 1 }
    })
    const replayedFigure = await runtime.replayRun(env, figureResult.runId)
    expect(checksumEngineResult(figureResult)).toBe(checksumEngineResult(replayedFigure))

    const traditionResult = await runtime.runModule(env, {
      moduleCode: 'tradition.transmission',
      moduleVersion: '1.0.0',
      input: { unitId: 1 }
    })
    const replayedTradition = await runtime.replayRun(env, traditionResult.runId)
    expect(checksumEngineResult(traditionResult)).toBe(checksumEngineResult(replayedTradition))
  })

  it('handles missing figure or tradition unit gracefully with unresolved findings', async () => {
    const env = createCtx(SUPERUSER_ID, {}, () => null)
    const registry = new WitnessEngineRegistry()
    registry.register(createFigureAnalysisModule())
    registry.register(createTraditionTransmissionModule())
    const store = new InMemoryEngineRunStore()
    const runtime = new WitnessEngineRuntime(store, { registry })

    const figureResult = await runtime.runModule(env, {
      moduleCode: 'figure.analysis',
      moduleVersion: '1.0.0',
      input: { figureId: 99999 }
    })
    expect(figureResult.findings[0]?.unresolvedReasonCodes).toContain('FIGURE_NOT_FOUND')

    const traditionResult = await runtime.runModule(env, {
      moduleCode: 'tradition.transmission',
      moduleVersion: '1.0.0',
      input: { unitId: 99999 }
    })
    expect(traditionResult.findings[0]?.unresolvedReasonCodes).toContain('TRADITION_UNIT_NOT_FOUND')
  })
})
