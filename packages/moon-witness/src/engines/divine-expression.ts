import type { Ctx } from '@moon/orm'
import WxContent from '../models/wx-content.js'
import WxDivineExpression from '../models/wx-divine-expression.js'
import WxDivineExpressionOccurrence from '../models/wx-divine-expression-occurrence.js'
import WxPassage from '../models/wx-passage.js'
import WxProvenance from '../models/wx-provenance.js'
import WxRoot from '../models/wx-root.js'
import WxSource from '../models/wx-source.js'
import { sha256String } from '../services/hash.js'
import type { Loose } from '../graph/service.js'
import type { EngineEvidenceCandidate, EngineEvidenceExplanation, EngineResultDraft, EngineScopeInput, EngineValidationResult, WitnessEngineModule } from '../types/engine.js'

export interface DivineExpressionInput { languageCode?: string; lexicalForm?: string; lemma?: string; root?: string; expressionType?: 'NAME' | 'ATTRIBUTE' | 'PREDICATE' | 'ACTION' | 'RELATION' }

function value(row: Loose | null | undefined, camel: string, snake = camel): any { return row?.[camel] ?? row?.[snake] }
function idOf(row: Loose | null | undefined): number { return Number(value(row, 'id') ?? 0) }
function foreignId(row: Loose | null | undefined, camel: string, snake: string): number { const raw = value(row, camel, snake); return Number(Array.isArray(raw) ? raw[0] : raw ?? 0) }
function text(raw: unknown): string { return typeof raw === 'string' ? raw.trim() : '' }
function span(body: string, scheme: string, start: number, end: number): string { return scheme === 'UNICODE_CODEPOINT' ? Array.from(body).slice(start, end).join('') : body.slice(start, end) }

export function validateDivineExpressionInput(input: DivineExpressionInput): EngineValidationResult {
  if (!input || typeof input !== 'object') return { ok: false, errors: ['Input must be an object'] }
  if ([input.languageCode, input.lexicalForm, input.lemma, input.root].some((item) => item !== undefined && !text(item))) return { ok: false, errors: ['Text filters must not be blank'] }
  if (input.expressionType && !['NAME', 'ATTRIBUTE', 'PREDICATE', 'ACTION', 'RELATION'].includes(input.expressionType)) return { ok: false, errors: ['expressionType is invalid'] }
  return { ok: true }
}

export function createDivineExpressionModule(): WitnessEngineModule<DivineExpressionInput> {
  return {
    code: 'divine-expression.query', version: '1.0.0', deterministic: true,
    inputSchemaVersion: 'DIVINE_EXPRESSION_INPUT_V1', outputSchemaVersion: 'WITNESS_ENGINE_RESULT_V1', validateInput: validateDivineExpressionInput,
    async resolveScope(ctx, input) { return { languagePreferences: input.languageCode ? [input.languageCode] : [] } satisfies EngineScopeInput },
    async execute(ctx, input) {
      const env = ctx as Ctx; const expressions = await WxDivineExpression.fetch(WxDivineExpression, env, [['active', '=', true]], undefined, { limit: 500, order: 'id ASC' })
      const norm = (raw: unknown) => text(raw).toLocaleLowerCase()
      const roots = input.root ? await WxRoot.fetch(WxRoot, env, [['active', '=', true]], undefined, { limit: 500 }) : []
      const rootIds = new Set(roots.filter((root) => [value(root, 'writtenForm', 'written_form'), value(root, 'transliteration'), value(root, 'stableKey', 'stable_key')].some((item) => norm(item) === norm(input.root))).map(idOf))
      const selected = expressions.filter((expression) => (!input.languageCode || norm(value(expression, 'languageCode', 'language_code')) === norm(input.languageCode)) && (!input.lexicalForm || norm(value(expression, 'lexicalForm', 'lexical_form')) === norm(input.lexicalForm)) && (!input.lemma || norm(value(expression, 'lemma')) === norm(input.lemma)) && (!input.root || rootIds.has(foreignId(expression, 'rootId', 'root_id'))) && (!input.expressionType || text(value(expression, 'expressionType', 'expression_type')) === input.expressionType))
      const findings: EngineResultDraft['findings'] = []
      for (const expression of selected) {
        const occurrences = await WxDivineExpressionOccurrence.fetch(WxDivineExpressionOccurrence, env, [['expressionId', '=', idOf(expression)], ['active', '=', true]], undefined, { limit: 500, order: 'id ASC' })
        for (const occurrence of occurrences) {
          const [content, passage, provenance] = await Promise.all([
            WxContent.fetch(WxContent, env, [['id', '=', foreignId(occurrence, 'contentId', 'content_id')], ['active', '=', true]]),
            WxPassage.fetch(WxPassage, env, [['id', '=', foreignId(occurrence, 'passageId', 'passage_id')], ['active', '=', true]]),
            WxProvenance.fetch(WxProvenance, env, [['id', '=', foreignId(occurrence, 'provenanceId', 'provenance_id')], ['active', '=', true], ['superseded', '=', false]])
          ])
          const body = text(value(content[0], 'text')); const fragment = span(body, text(value(occurrence, 'offsetScheme', 'offset_scheme')), Number(value(occurrence, 'startOffset', 'start_offset')), Number(value(occurrence, 'endOffset', 'end_offset')))
          const sourceId = foreignId(occurrence, 'sourceId', 'source_id') || foreignId(provenance[0], 'sourceId', 'source_id'); const source = sourceId ? (await WxSource.fetch(WxSource, env, [['id', '=', sourceId], ['active', '=', true]]))[0] ?? null : null
          const revision = text(value(provenance[0], 'sourceRevision', 'source_revision')) || text(value(source, 'revision')); const exact = Boolean(content[0] && passage[0] && provenance[0] && source && revision && fragment && sha256String(fragment) === text(value(occurrence, 'fragmentChecksum', 'fragment_checksum')))
          const evidence: EngineEvidenceCandidate[] = exact ? [{ evidenceKey: `divine-expression-occurrence:${idOf(occurrence)}`, relation: 'MENTIONS', authorityClass: 'PRIMARY_SOURCE', sourceRevision: revision, provenanceRef: text(value(provenance[0], 'stableKey', 'stable_key')) || `provenance:${idOf(provenance[0])}`, passageId: idOf(passage[0]), contentId: idOf(content[0]), sourceReference: text(value(passage[0], 'canonicalReference', 'canonical_reference')) || undefined, span: fragment, contentType: text(value(content[0], 'contentType', 'content_type')).toUpperCase() as EngineEvidenceCandidate['contentType'] }] : []
          findings.push({ key: `divine-expression:${idOf(expression)}:occurrence:${idOf(occurrence)}`, statement: exact ? `${text(value(expression, 'lexicalForm', 'lexical_form'))} is attested in an allowed Revelation occurrence.` : `${text(value(expression, 'lexicalForm', 'lexical_form'))} has an invalid or incomplete occurrence witness.`, subjectEntityId: foreignId(expression, 'entityId', 'entity_id'), predicate: 'HAS_DIVINE_EXPRESSION_OCCURRENCE', objectValue: fragment || undefined, authorityClass: 'PRIMARY_SOURCE', evidence, unresolvedReasonCodes: exact ? [] : ['DIVINE_EXPRESSION_OCCURRENCE_INVALID'] })
        }
      }
      if (!findings.length) findings.push({ key: 'divine-expression:unresolved', statement: 'No accessible corpus-mined divine-expression occurrence matched the query.', authorityClass: 'PRIMARY_SOURCE', unresolvedReasonCodes: ['DIVINE_EXPRESSION_NOT_FOUND'] })
      return { summary: `Divine-expression query returned ${findings.length} exact allowed-corpus occurrence(s); it does not assume any fixed count.`, findings }
    },
    async explain(_ctx, output) { const finding = output.findings[0]; if (!finding) throw new Error('Divine-expression output has no findings'); return { findingKey: finding.key, evidence: finding.evidence, provenanceRefs: finding.provenanceRefs, narrative: 'This engine queries corpus-mined expressions and exact allowed Revelation occurrences; it has no fixed 99-item list.' } satisfies EngineEvidenceExplanation }
  }
}
