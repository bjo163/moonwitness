import type { Ctx } from '@moon/orm'
import WxContent from '../models/wx-content.js'
import WxLexeme from '../models/wx-lexeme.js'
import WxLexicalOccurrence from '../models/wx-lexical-occurrence.js'
import WxPassage from '../models/wx-passage.js'
import WxProvenance from '../models/wx-provenance.js'
import WxRoot from '../models/wx-root.js'
import WxSource from '../models/wx-source.js'
import { sha256String } from '../services/hash.js'
import type { Loose } from '../graph/service.js'
import type { EngineEvidenceCandidate, EngineEvidenceExplanation, EngineResultDraft, EngineScopeInput, EngineValidationResult, WitnessEngineModule } from '../types/engine.js'

export interface LexicalAnalysisInput {
  languageCode?: string
  lemma?: string
  lexeme?: string
  root?: string
  occurrenceId?: number
  includeCrossLanguageDerived?: boolean
}

function value(row: Loose | null | undefined, camel: string, snake = camel): any { return row?.[camel] ?? row?.[snake] }
function idOf(row: Loose | null | undefined): number { return Number(value(row, 'id') ?? 0) }
function foreignId(row: Loose | null | undefined, camel: string, snake: string): number { const raw = value(row, camel, snake); return Number(Array.isArray(raw) ? raw[0] : raw ?? 0) }
function text(raw: unknown): string { return typeof raw === 'string' ? raw.trim() : '' }
function span(textValue: string, scheme: string, start: number, end: number): string { return scheme === 'UNICODE_CODEPOINT' ? Array.from(textValue).slice(start, end).join('') : textValue.slice(start, end) }
function lineageEvidence(occurrence: Loose, provenance: Loose | null, source: Loose | null, content: Loose, passage: Loose, fragment: string): EngineEvidenceCandidate | null {
  const revision = text(value(provenance, 'sourceRevision', 'source_revision')) || text(value(source, 'revision'))
  if (!provenance || !source || !revision) return null
  return {
    evidenceKey: `lexical-occurrence:${idOf(occurrence)}`,
    relation: 'MENTIONS', authorityClass: 'PRIMARY_SOURCE', sourceRevision: revision,
    provenanceRef: text(value(provenance, 'stableKey', 'stable_key')) || `provenance:${idOf(provenance)}`,
    passageId: idOf(passage), contentId: idOf(content), sourceReference: text(value(passage, 'canonicalReference', 'canonical_reference')) || undefined,
    span: fragment, contentType: text(value(content, 'contentType', 'content_type')).toUpperCase() as EngineEvidenceCandidate['contentType']
  }
}

export function validateLexicalAnalysisInput(input: LexicalAnalysisInput): EngineValidationResult {
  if (!input || typeof input !== 'object') return { ok: false, errors: ['Input must be an object'] }
  if (![input.lemma, input.lexeme, input.root, input.occurrenceId].some((item) => item !== undefined && item !== '')) return { ok: false, errors: ['Provide lemma, lexeme, root, or occurrenceId'] }
  if (input.occurrenceId !== undefined && (!Number.isSafeInteger(input.occurrenceId) || input.occurrenceId < 1)) return { ok: false, errors: ['occurrenceId must be a positive integer'] }
  if ([input.languageCode, input.lemma, input.lexeme, input.root].some((item) => item !== undefined && !text(item))) return { ok: false, errors: ['Text filters must not be blank'] }
  return { ok: true }
}

async function matchingLexemes(env: Ctx, input: LexicalAnalysisInput): Promise<Loose[]> {
  if (input.occurrenceId) {
    const occurrence = (await WxLexicalOccurrence.fetch(WxLexicalOccurrence, env, [['id', '=', input.occurrenceId], ['active', '=', true]]))[0]
    return occurrence ? WxLexeme.fetch(WxLexeme, env, [['id', '=', foreignId(occurrence, 'lexemeId', 'lexeme_id')], ['active', '=', true]]) : []
  }
  const all = await WxLexeme.fetch(WxLexeme, env, [['active', '=', true]], undefined, { limit: 500, order: 'id ASC' })
  const wanted = (raw: unknown) => text(raw).toLocaleLowerCase()
  const rootRows = input.root ? await WxRoot.fetch(WxRoot, env, [['active', '=', true]], undefined, { limit: 500 }) : []
  const rootIds = new Set(rootRows.filter((root) => [value(root, 'writtenForm', 'written_form'), value(root, 'transliteration'), value(root, 'stableKey', 'stable_key')].some((item) => wanted(item) === wanted(input.root))).map(idOf))
  return all.filter((lexeme) => (!input.languageCode || wanted(value(lexeme, 'languageCode', 'language_code')) === wanted(input.languageCode)) && (!input.lemma || wanted(value(lexeme, 'lemma')) === wanted(input.lemma)) && (!input.lexeme || [value(lexeme, 'lemma'), value(lexeme, 'transliteration'), value(lexeme, 'stableKey', 'stable_key')].some((item) => wanted(item) === wanted(input.lexeme))) && (!input.root || rootIds.has(foreignId(lexeme, 'rootId', 'root_id'))))
}

export function createLexicalAnalysisModule(): WitnessEngineModule<LexicalAnalysisInput> {
  return {
    code: 'lexical.analysis', version: '1.0.0', deterministic: true,
    inputSchemaVersion: 'LEXICAL_ANALYSIS_INPUT_V1', outputSchemaVersion: 'WITNESS_ENGINE_RESULT_V1', validateInput: validateLexicalAnalysisInput,
    async resolveScope(ctx, input) { return { languagePreferences: input.languageCode ? [input.languageCode] : [] } satisfies EngineScopeInput },
    async execute(ctx, input) {
      const env = ctx as Ctx; const lexemes = await matchingLexemes(env, input); const findings: EngineResultDraft['findings'] = []
      for (const lexeme of lexemes) {
        const occurrences = await WxLexicalOccurrence.fetch(WxLexicalOccurrence, env, [['lexemeId', '=', idOf(lexeme)], ['active', '=', true]], undefined, { limit: 500, order: 'id ASC' })
        for (const occurrence of occurrences) {
          const [content, passage, provenance] = await Promise.all([
            WxContent.fetch(WxContent, env, [['id', '=', foreignId(occurrence, 'contentId', 'content_id')], ['active', '=', true]]),
            WxPassage.fetch(WxPassage, env, [['id', '=', foreignId(occurrence, 'passageId', 'passage_id')], ['active', '=', true]]),
            WxProvenance.fetch(WxProvenance, env, [['id', '=', foreignId(occurrence, 'provenanceId', 'provenance_id')], ['active', '=', true], ['superseded', '=', false]])
          ])
          const sourceId = foreignId(occurrence, 'sourceId', 'source_id') || foreignId(provenance[0], 'sourceId', 'source_id')
          const source = sourceId ? (await WxSource.fetch(WxSource, env, [['id', '=', sourceId], ['active', '=', true]]))[0] ?? null : null
          const body = text(value(content[0], 'text')); const start = Number(value(occurrence, 'startOffset', 'start_offset')); const end = Number(value(occurrence, 'endOffset', 'end_offset'))
          const fragment = span(body, text(value(occurrence, 'offsetScheme', 'offset_scheme')), start, end)
          const exact = Boolean(body) && Number.isInteger(start) && Number.isInteger(end) && start >= 0 && end >= start && sha256String(fragment) === text(value(occurrence, 'fragmentChecksum', 'fragment_checksum'))
          const evidence = exact && content[0] && passage[0] ? lineageEvidence(occurrence, provenance[0] ?? null, source, content[0], passage[0], fragment) : null
          findings.push({ key: `lexical:${idOf(occurrence)}`, statement: exact ? `${text(value(lexeme, 'lemma'))} occurs as exact source span ${fragment}.` : `${text(value(lexeme, 'lemma'))} has an unverifiable lexical span.`, subjectEntityId: foreignId(lexeme, 'entityId', 'entity_id'), predicate: 'HAS_LEXICAL_OCCURRENCE', objectValue: fragment || undefined, authorityClass: 'PRIMARY_SOURCE', evidence: evidence ? [evidence] : [], unresolvedReasonCodes: evidence ? [] : ['LEXICAL_SPAN_OR_PROVENANCE_INVALID'] })
        }
      }
      if (input.includeCrossLanguageDerived && lexemes.length > 1 && new Set(lexemes.map((item) => text(value(item, 'languageCode', 'language_code')))).size > 1) findings.push({ key: `lexical:derived:${lexemes.map(idOf).join('-')}`, statement: 'Cross-language lexical comparison is a derived analytical grouping, not a source assertion.', authorityClass: 'DERIVED', predicate: 'CROSS_LANGUAGE_LEXICAL_COMPARISON' })
      if (!findings.length) findings.push({ key: 'lexical:unresolved', statement: 'No accessible sourced lexical occurrence matched the query.', authorityClass: 'PRIMARY_SOURCE', unresolvedReasonCodes: ['LEXICAL_OCCURRENCE_NOT_FOUND'] })
      return { summary: `Lexical query returned ${findings.length} source-bounded finding(s).`, findings }
    },
    async explain(_ctx, output) { const finding = output.findings[0]; if (!finding) throw new Error('Lexical output has no findings'); return { findingKey: finding.key, evidence: finding.evidence, provenanceRefs: finding.provenanceRefs, narrative: 'Exact occurrences are emitted only after their stored span checksum and provenance lineage verify.' } satisfies EngineEvidenceExplanation }
  }
}
