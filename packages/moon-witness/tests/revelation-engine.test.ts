import { beforeEach, describe, expect, it } from 'vitest'
import { createCtx, setupOrm, SUPERUSER_ID } from '@moon/orm'
import { checksumEngineResult } from '../src/services/engine-evidence.js'
import { sha256String } from '../src/services/hash.js'
import { InMemoryEngineRunStore } from '../src/services/engine-store.js'
import { WitnessEngineRegistry, WitnessEngineRuntime } from '../src/services/engine-runtime.js'
import {
  buildCrossScriptureEvidenceMatrix,
  createCrossScriptureComparisonModule
} from '../src/engines/cross-scripture.ts'
import {
  createRevelationQueryModule,
  resolveRevelationPassageContext
} from '../src/engines/revelation-query.ts'
import { createLexicalAnalysisModule } from '../src/engines/lexical-analysis.js'
import { createConceptEvidenceModule } from '../src/engines/concept-evidence.js'
import { createDivineExpressionModule } from '../src/engines/divine-expression.js'
import { createAiResearchSynthesisModule, createResearchHypothesisModule } from '../src/engines/research-hypothesis.js'
import type { WitnessEngineModule } from '../src/types/engine.js'

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
      row(101, 'passage:quran:2:255', 'PASSAGE', 'Quran 2:255'),
      row(102, 'passage:tawrat:deut:6:4', 'PASSAGE', 'Tawrat Deut 6:4'),
      row(103, 'passage:zabur:23:1', 'PASSAGE', 'Zabur 23:1'),
      row(104, 'passage:injil:mark:12:29', 'PASSAGE', 'Injil Mark 12:29'),
      row(201, 'figure:musa', 'PERSON', 'Musa'),
      row(202, 'concept:mercy', 'CONCEPT', 'Mercy'),
      row(301, 'assertion:derived:musa', 'ASSERTION', 'Derived Musa assertion')
    ],
    wx_scripture: [
      { id: 11, canonical_code: 'QURAN', name: 'Quran', active: true, is_active: true },
      { id: 12, canonical_code: 'TAWRAT', name: 'Tawrat', active: true, is_active: true },
      { id: 13, canonical_code: 'ZABUR', name: 'Zabur', active: true, is_active: true },
      { id: 14, canonical_code: 'INJIL', name: 'Injil', active: true, is_active: true }
    ],
    wx_passage: [
      { id: 21, entity_id: 101, scripture_id: 11, canonical_reference: 'QURAN:2:255', active: true, is_active: true },
      { id: 22, entity_id: 102, scripture_id: 12, canonical_reference: 'TAWRAT:DEUT:6:4', active: true, is_active: true },
      { id: 23, entity_id: 103, scripture_id: 13, canonical_reference: 'ZABUR:23:1', active: true, is_active: true },
      { id: 24, entity_id: 104, scripture_id: 14, canonical_reference: 'INJIL:MARK:12:29', active: true, is_active: true }
    ],
    wx_source: [
      source(501, 'corpus:quran:original', 'quran-r1'),
      source(502, 'corpus:quran:en', 'quran-en-r1'),
      source(503, 'corpus:tawrat', 'tawrat-r1'),
      source(504, 'corpus:zabur', 'zabur-r1'),
      source(505, 'corpus:injil', 'injil-r1')
    ],
    wx_provenance: [
      provenance(401, 'prov:quran:original', 501, 'quran-r1'),
      provenance(402, 'prov:quran:en', 502, 'quran-en-r1'),
      provenance(403, 'prov:tawrat', 503, 'tawrat-r1'),
      provenance(404, 'prov:zabur', 504, 'zabur-r1'),
      provenance(405, 'prov:injil', 505, 'injil-r1')
    ],
    wx_text_edition: [{ id: 601, title: 'Quran English', edition: 'quran-en', active: true, is_active: true }],
    wx_content: [
      { id: 701, passage_id: 21, content_type: 'ORIGINAL_TEXT', text: 'Allahu la ilaha illa huwa', revision: 'quran-r1', source_id: 501, provenance_id: 401, active: true, is_active: true },
      { id: 702, passage_id: 21, content_type: 'TRANSLATION', text: 'God—there is no deity except Him.', language_code: 'en', revision: 'quran-en-r1', edition_id: 601, source_id: 502, provenance_id: 402, active: true, is_active: true }
    ],
    wx_root: [{ id: 610, entity_id: 202, stable_key: 'root:ar:alh', language_code: 'ar', written_form: 'اله', transliteration: 'alh', active: true, is_active: true }],
    wx_lexeme: [
      { id: 611, entity_id: 202, stable_key: 'lexeme:ar:allahu', language_code: 'ar', lemma: 'الله', transliteration: 'allahu', root_id: 610, active: true, is_active: true },
      { id: 612, entity_id: 202, stable_key: 'lexeme:en:god', language_code: 'en', lemma: 'god', transliteration: 'allahu', active: true, is_active: true }
    ],
    wx_lexical_occurrence: [{ id: 613, lexeme_id: 611, content_id: 701, passage_id: 21, offset_scheme: 'UNICODE_CODEPOINT', start_offset: 0, end_offset: 6, fragment_checksum: sha256String('Allahu'), source_id: 501, provenance_id: 401, active: true, is_active: true }],
    wx_revelation_event_passage: [],
    wx_revelation_event: [],
    wx_relation_type: [{ id: 801, code: 'MENTIONS', name: 'Mentions', active: true, is_active: true }],
    wx_relation: [
      { id: 901, from_entity_id: 101, relation_type_id: 801, to_entity_id: 201, provenance_id: 401, source_id: 501, source_revision: 'quran-r1', source_class: 'REVELATION', authority_class: 'PRIMARY_SOURCE', polarity: 'AFFIRMED', active: true, is_active: true },
      { id: 902, from_entity_id: 102, relation_type_id: 801, to_entity_id: 201, provenance_id: 403, source_id: 503, source_revision: 'tawrat-r1', source_class: 'REVELATION', authority_class: 'PRIMARY_SOURCE', polarity: 'AFFIRMED', active: true, is_active: true },
      { id: 903, from_entity_id: 103, relation_type_id: 801, to_entity_id: 201, provenance_id: 404, source_id: 504, source_revision: 'zabur-r1', source_class: 'REVELATION', authority_class: 'PRIMARY_SOURCE', polarity: 'AFFIRMED', active: true, is_active: true },
      { id: 904, from_entity_id: 104, relation_type_id: 801, to_entity_id: 201, provenance_id: 405, source_id: 505, source_revision: 'injil-r1', source_class: 'REVELATION', authority_class: 'PRIMARY_SOURCE', polarity: 'NEGATED', active: true, is_active: true },
      { id: 905, from_entity_id: 101, relation_type_id: 801, to_entity_id: 201, assertion_entity_id: 301, provenance_id: 401, source_id: 501, source_revision: 'quran-r1', source_class: 'ENGINE_DERIVED', authority_class: 'DERIVED', polarity: 'AFFIRMED', active: true, is_active: true }
    ],
    wx_assertion: [
      { id: 1001, entity_id: 301, assertion_class: 'DERIVED', active: true, is_active: true },
      { id: 1002, entity_id: 202, subject_entity_id: 202, predicate: 'HAS_QUALITY', object_value: 'Mercy', assertion_class: 'SOURCE_SUMMARY', source_id: 501, provenance_id: 401, active: true, is_active: true }
    ],
    wx_entity_alias: [{ id: 1101, entity_id: 202, label: 'Rahmah', normalized_label: 'rahmah', active: true, is_active: true }],
    wx_evidence: [
      { id: 1102, assertion_id: 1002, evidence_entity_id: 202, relation: 'SUPPORTS', provenance_id: 401, active: true, is_active: true },
      { id: 1103, assertion_id: 1002, evidence_entity_id: 202, relation: 'CONTRADICTS', provenance_id: 401, active: true, is_active: true }
    ],
    wx_divine_expression: [{ id: 1201, entity_id: 202, language_code: 'ar', lexical_form: 'Allahu', lemma: 'الله', root_id: 610, expression_type: 'NAME', source_id: 501, provenance_id: 401, active: true, is_active: true }],
    wx_divine_expression_occurrence: [{ id: 1202, expression_id: 1201, passage_id: 21, content_id: 701, offset_scheme: 'UNICODE_CODEPOINT', start_offset: 0, end_offset: 6, fragment_checksum: sha256String('Allahu'), source_id: 501, provenance_id: 401, active: true, is_active: true }],
    wx_research_hypothesis: [{ id: 1301, stable_key: 'research:mercy', title: 'Mercy distribution', statement: 'Mercy evidence is present.', hypothesis_class: 'CONCEPT_DISTRIBUTION', method_version: '1', scope_definition: '{}', created_at: '2026-01-01T00:00:00.000Z', active: true, is_active: true }],
    wx_figure: [],
    wx_concept: [{ id: 1, entity_id: 202, stable_key: 'concept:mercy', name: 'Mercy', language_code: 'en', active: true, is_active: true }]
  }
}

function env() {
  return createCtx(SUPERUSER_ID, {}, () => null)
}

function runtime(module: WitnessEngineModule) {
  const registry = new WitnessEngineRegistry()
  registry.register(module)
  return new WitnessEngineRuntime(new InMemoryEngineRunStore(), { registry })
}

describe('Revelation Query and Cross-Scripture engines (#58)', () => {
  beforeEach(() => {
    seed()
    setupOrm(createMockKnex())
  })

  it('returns Quran 2:255 with separate original and translation provenance', async () => {
    const module = createRevelationQueryModule()
    const result = await runtime(module).runModule(env(), {
      moduleCode: module.code,
      moduleVersion: module.version,
      input: { reference: 'QURAN:2:255', languages: ['en'] }
    })
    expect(result.findings).toHaveLength(2)
    expect(result.findings.find((finding) => finding.key === 'passage:21:content:701')).toMatchObject({
      authorityClass: 'PRIMARY_SOURCE', objectValue: 'Allahu la ilaha illa huwa', provenanceRefs: ['prov:quran:original']
    })
    expect(result.findings.find((finding) => finding.key === 'passage:21:content:702')).toMatchObject({
      authorityClass: 'TRANSLATION', objectValue: 'God—there is no deity except Him.', provenanceRefs: ['prov:quran:en']
    })
    expect(result.sourceRevisions.map((revision) => revision.sourceKey)).toEqual(expect.arrayContaining(['corpus:quran:en', 'corpus:quran:original']))
  })

  it('rejects a fifth scripture family and keeps query access scoped to the canonical family', async () => {
    const module = createRevelationQueryModule()
    await expect(runtime(module).runModule(env(), {
      moduleCode: module.code,
      moduleVersion: module.version,
      input: { reference: 'QURAN:2:255', family: 'OTHER' as any }
    })).rejects.toThrow(/family must be/)
    await expect(resolveRevelationPassageContext(env(), { reference: 'QURAN:2:255', family: 'TAWRAT' })).resolves.toBeNull()
  })

  it('changes deterministic engine output when a source revision changes', async () => {
    const module = createRevelationQueryModule()
    const engine = runtime(module)
    const request = { moduleCode: module.code, moduleVersion: module.version, input: { reference: 'QURAN:2:255' } }
    const first = await engine.runModule(env(), request)
    mockDb.wx_provenance[0].source_revision = 'quran-r2'
    const changed = await engine.runModule(env(), request)
    expect(checksumEngineResult(first)).not.toBe(checksumEngineResult(changed))
  })

  it('builds a four-family evidence matrix and retains conflicts separately', async () => {
    const matrix = await buildCrossScriptureEvidenceMatrix(env(), { entityId: 201 })
    expect(matrix).not.toBeNull()
    expect(Object.keys(matrix!.groups)).toEqual(['QURAN', 'TAWRAT', 'ZABUR', 'INJIL'])
    expect(matrix!.groups.QURAN[0].classification).toBe('EXPLICIT_SOURCE_MENTION')
    expect(matrix!.groups.QURAN).toHaveLength(1)

    const module = createCrossScriptureComparisonModule()
    const result = await runtime(module).runModule(env(), { moduleCode: module.code, moduleVersion: module.version, input: { entityId: 201 } })
    expect(result.findings).toHaveLength(4)
    expect(result.findings.find((finding) => finding.key === 'comparison:201:INJIL')).toMatchObject({ status: 'CONFLICTED' })
    expect(result.conflicts).toContainEqual(expect.objectContaining({ findingKey: 'comparison:201:INJIL' }))
  })

  it('does not invent a safe parallel and only includes stored derived assertions when requested', async () => {
    const module = createCrossScriptureComparisonModule()
    const noParallel = await runtime(module).runModule(env(), { moduleCode: module.code, moduleVersion: module.version, input: { entityId: 202 } })
    expect(noParallel.findings.every((finding) => finding.status === 'INSUFFICIENT_EVIDENCE')).toBe(true)
    expect(noParallel.unresolved.every((item) => item.code === 'EVIDENCE_MISSING')).toBe(true)

    const excluded = await buildCrossScriptureEvidenceMatrix(env(), { entityId: 201 })
    const included = await buildCrossScriptureEvidenceMatrix(env(), { entityId: 201, includeDerivedAssertions: true })
    expect(excluded!.groups.QURAN).toHaveLength(1)
    expect(included!.groups.QURAN.map((entry) => entry.classification)).toContain('DERIVED_ASSERTION')
  })

  it('keeps exact lexical spans source-backed and labels cross-language comparison derived', async () => {
    const module = createLexicalAnalysisModule()
    const result = await runtime(module).runModule(env(), { moduleCode: module.code, moduleVersion: module.version, input: { lexeme: 'allahu', includeCrossLanguageDerived: true } })
    expect(result.findings.find((finding) => finding.key === 'lexical:613')).toMatchObject({ objectValue: 'Allahu', authorityClass: 'PRIMARY_SOURCE', provenanceRefs: ['prov:quran:original'] })
    expect(result.findings.find((finding) => finding.authorityClass === 'DERIVED')).toMatchObject({ predicate: 'CROSS_LANGUAGE_LEXICAL_COMPARISON' })
  })

  it('keeps concept evidence grouped by assertion and preserves contradictions', async () => {
    const module = createConceptEvidenceModule()
    const result = await runtime(module).runModule(env(), { moduleCode: module.code, moduleVersion: module.version, input: { query: 'mercy' } })
    expect(result.findings.find((finding) => finding.key === 'concept:1:label:1101')).toMatchObject({ objectValue: 'Rahmah' })
    expect(result.findings.find((finding) => finding.key === 'concept:1:assertion:1002')).toMatchObject({ status: 'CONFLICTED' })
    expect(result.conflicts).toContainEqual(expect.objectContaining({ findingKey: 'concept:1:assertion:1002' }))
  })

  it('returns corpus-mined divine expressions from exact allowed occurrences without a fixed count', async () => {
    const module = createDivineExpressionModule()
    const result = await runtime(module).runModule(env(), { moduleCode: module.code, moduleVersion: module.version, input: { expressionType: 'NAME' } })
    expect(result.findings).toHaveLength(1)
    expect(result.findings[0]).toMatchObject({ objectValue: 'Allahu', authorityClass: 'PRIMARY_SOURCE', provenanceRefs: ['prov:quran:original'] })
    expect(result.summary).toMatch(/does not assume any fixed count/)
  })

  it('returns transparent, non-canonical research findings with contrary evidence visible', async () => {
    const module = createResearchHypothesisModule()
    const result = await runtime(module).runModule(env(), { moduleCode: module.code, moduleVersion: module.version, input: { hypothesisId: 1301, predicate: 'HAS_QUALITY', algorithmVersion: 'distribution-v1' } })
    expect(result.findings.find((finding) => finding.key === 'research:1301:summary')).toMatchObject({ authorityClass: 'HYPOTHESIS', status: 'CONFLICTED' })
    expect(result.summary).toMatch(/non-canonical/)
    expect(result.diagnostics).toEqual(expect.arrayContaining(['supports:1', 'contradicts:1', 'denominator:2']))
  })

  it('captures active source revisions in the research checksum lineage', async () => {
    const module = createResearchHypothesisModule()
    const request = { moduleCode: module.code, moduleVersion: module.version, input: { hypothesisId: 1301, predicate: 'HAS_QUALITY', algorithmVersion: 'distribution-v1' } }
    const first = await runtime(module).runModule(env(), request)
    expect(first.sourceRevisions).toEqual(expect.arrayContaining([
      expect.objectContaining({ sourceKey: 'corpus:quran:original', revision: 'quran-r1' })
    ]))
    mockDb.wx_source[0].revision = 'quran-r2'
    const changed = await runtime(module).runModule(env(), request)
    expect(checksumEngineResult(first)).not.toBe(checksumEngineResult(changed))
  })

  it('applies research filters before calculating the evidence denominator', async () => {
    const module = createResearchHypothesisModule()
    const result = await runtime(module).runModule(env(), {
      moduleCode: module.code,
      moduleVersion: module.version,
      input: { hypothesisId: 1301, predicate: 'HAS_QUALITY', algorithmVersion: 'distribution-v1', filters: { assertionClass: 'DERIVED' } }
    })
    expect(result.findings.find((finding) => finding.key === 'research:1301:summary')).toMatchObject({ status: 'INSUFFICIENT_EVIDENCE' })
    expect(result.diagnostics).toEqual(expect.arrayContaining(['denominator:0']))
  })

  it('requires provider metadata for AI research and retains AI_ASSISTED authority', async () => {
    const module = createAiResearchSynthesisModule()
    const request = { moduleCode: module.code, moduleVersion: module.version, input: { hypothesisId: 1301, predicate: 'HAS_QUALITY', algorithmVersion: 'distribution-v1' } }
    await expect(runtime(module).runModule(env(), request)).rejects.toThrow(/requires provider metadata/)
    const result = await runtime(module).runModule(env(), { ...request, ai: { provider: 'test', configurationFingerprint: 'cfg-v1' } })
    expect(result.findings.every((finding) => finding.authorityClass === 'AI_ASSISTED')).toBe(true)
  })
})
