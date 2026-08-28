import type { Ctx } from '@moon/orm'
import WxContent from '../models/wx-content.ts'
import WxLexicalOccurrence from '../models/wx-lexical-occurrence.ts'
import WxPassage from '../models/wx-passage.ts'
import WxProvenance from '../models/wx-provenance.ts'
import WxRevelationEvent from '../models/wx-revelation-event.ts'
import WxRevelationEventPassage from '../models/wx-revelation-event-passage.ts'
import WxScripture from '../models/wx-scripture.ts'
import WxSource from '../models/wx-source.ts'
import WxTextEdition from '../models/wx-text-edition.ts'
import { passageByReference } from '../graph/domain-queries.ts'
import type { Loose } from '../graph/service.ts'
import type {
  EngineEvidenceCandidate,
  EngineEvidenceExplanation,
  EngineOutputAuthorityClass,
  EngineResultDraft,
  EngineResultEnvelope,
  EngineScope,
  EngineScopeInput,
  EngineSourceRevision,
  EngineValidationResult,
  RevelationFamily,
  WitnessEngineModule
} from '../types/engine.ts'

export const REVELATION_FAMILIES: RevelationFamily[] = ['QURAN', 'TAWRAT', 'ZABUR', 'INJIL']

export interface RevelationQueryInput {
  reference?: string
  passageId?: number
  entityId?: number
  family?: RevelationFamily
  languages?: string[]
  editionId?: number
  revision?: string
  includeTranslations?: boolean
  includeTransliterations?: boolean
  includeLexical?: boolean
  includeEvents?: boolean
  includeHadith?: boolean
  includeDerivedAssertions?: boolean
}

export interface RevelationContentWitness {
  content: Loose
  edition: Loose | null
  provenance: Loose | null
  source: Loose | null
  authorityClass: EngineOutputAuthorityClass
}

export interface RevelationPassageContext {
  passage: Loose
  scripture: Loose
  family: RevelationFamily
  contents: RevelationContentWitness[]
  lexicalOccurrences: Loose[]
  revelationEvents: Array<{ event: Loose; link: Loose; provenance: Loose | null; source: Loose | null }>
}

function value(row: Loose | null | undefined, camel: string, snake = camel): any {
  return row?.[camel] ?? row?.[snake]
}

function idOf(row: Loose | null | undefined): number {
  return Number(value(row, 'id') ?? 0)
}

function foreignId(row: Loose | null | undefined, camel: string, snake: string): number {
  const raw = value(row, camel, snake)
  return Number(Array.isArray(raw) ? raw[0] : raw ?? 0)
}

function normalizedText(value: unknown): string {
  return typeof value === 'string' ? value.trim() : ''
}

function familyOf(scripture: Loose): RevelationFamily | null {
  const code = normalizedText(value(scripture, 'canonicalCode', 'canonical_code')).toUpperCase()
  const aliases: Record<string, RevelationFamily> = {
    QURAN: 'QURAN',
    QURANIC: 'QURAN',
    TAWRAT: 'TAWRAT',
    TORAH: 'TAWRAT',
    ZABUR: 'ZABUR',
    PSALMS: 'ZABUR',
    INJIL: 'INJIL',
    GOSPEL: 'INJIL'
  }
  return aliases[code] ?? null
}

function contentAuthority(contentType: unknown): EngineOutputAuthorityClass {
  switch (normalizedText(contentType).toUpperCase()) {
    case 'ORIGINAL_TEXT':
    case 'TEXTUAL_WITNESS':
      return 'PRIMARY_SOURCE'
    case 'TRANSLATION':
    case 'TRANSLITERATION':
      return 'TRANSLATION'
    case 'MATN':
      return 'TRANSMISSION_REPORT'
    case 'COMMENTARY':
    case 'TAFSIR':
    case 'SUMMARY':
    case 'FOOTNOTE':
    case 'LEXICAL_GLOSS':
      return 'SOURCE_SUMMARY'
    default:
      return 'DERIVED'
  }
}

function includeContent(input: RevelationQueryInput, content: Loose): boolean {
  const type = normalizedText(value(content, 'contentType', 'content_type')).toUpperCase()
  if (type === 'TRANSLATION') return input.includeTranslations !== false
  if (type === 'TRANSLITERATION') return input.includeTransliterations === true
  if (type === 'MATN') return input.includeHadith === true
  return ['ORIGINAL_TEXT', 'TEXTUAL_WITNESS'].includes(type)
}

function matchesLanguage(input: RevelationQueryInput, content: Loose): boolean {
  const languages = [...new Set((input.languages ?? []).map((item) => item.trim().toLowerCase()).filter(Boolean))]
  if (!languages.length) return true
  const type = normalizedText(value(content, 'contentType', 'content_type')).toUpperCase()
  if (['ORIGINAL_TEXT', 'TEXTUAL_WITNESS'].includes(type)) return true
  return languages.includes(normalizedText(value(content, 'languageCode', 'language_code')).toLowerCase())
}

function sourceRevision(source: Loose | null, provenance: Loose | null, fallback: unknown): string {
  return normalizedText(value(provenance, 'sourceRevision', 'source_revision'))
    || normalizedText(value(source, 'revision'))
    || normalizedText(fallback)
}

function sourceKey(source: Loose | null): string {
  return normalizedText(value(source, 'stableKey', 'stable_key')) || `source:${idOf(source)}`
}

function provenanceRef(provenance: Loose | null): string {
  return normalizedText(value(provenance, 'stableKey', 'stable_key')) || `provenance:${idOf(provenance)}`
}

function evidenceForContent(context: RevelationPassageContext, witness: RevelationContentWitness): EngineEvidenceCandidate | null {
  if (!witness.provenance || !witness.source) return null
  const revision = sourceRevision(witness.source, witness.provenance, value(witness.content, 'revision'))
  if (!revision) return null
  const contentId = idOf(witness.content)
  return {
    evidenceKey: `content:${contentId}`,
    relation: 'SUPPORTS',
    authorityClass: witness.authorityClass,
    sourceFamily: context.family,
    sourceRevision: revision,
    provenanceRef: provenanceRef(witness.provenance),
    passageId: idOf(context.passage),
    contentId,
    sourceReference: normalizedText(value(context.passage, 'canonicalReference', 'canonical_reference')) || undefined,
    contentType: normalizedText(value(witness.content, 'contentType', 'content_type')).toUpperCase() as EngineEvidenceCandidate['contentType']
  }
}

function revisionForWitness(context: RevelationPassageContext, witness: RevelationContentWitness): EngineSourceRevision | null {
  if (!witness.provenance || !witness.source) return null
  const revision = sourceRevision(witness.source, witness.provenance, value(witness.content, 'revision'))
  if (!revision) return null
  const editionKey = witness.edition
    ? normalizedText(value(witness.edition, 'edition')) || normalizedText(value(witness.edition, 'title')) || `edition:${idOf(witness.edition)}`
    : undefined
  return {
    sourceKey: sourceKey(witness.source),
    revision,
    editionKey,
    family: context.family,
    authorityClass: witness.authorityClass
  }
}

function uniqueRevisions(values: Array<EngineSourceRevision | null>): EngineSourceRevision[] {
  const keyed = new Map<string, EngineSourceRevision>()
  for (const revision of values) {
    if (!revision) continue
    keyed.set(`${revision.sourceKey}\u0000${revision.editionKey ?? ''}\u0000${revision.revision}`, revision)
  }
  return [...keyed.values()].sort((left, right) => JSON.stringify(left).localeCompare(JSON.stringify(right)))
}

function inputTargetCount(input: RevelationQueryInput): number {
  return [input.reference, input.passageId, input.entityId].filter((value) => value !== undefined && value !== '').length
}

export function validateRevelationQueryInput(input: RevelationQueryInput): EngineValidationResult {
  if (!input || typeof input !== 'object') return { ok: false, errors: ['Input must be an object'] }
  if (inputTargetCount(input) !== 1) return { ok: false, errors: ['Provide exactly one of reference, passageId, or entityId'] }
  if (input.reference !== undefined && !normalizedText(input.reference)) return { ok: false, errors: ['reference must not be blank'] }
  for (const [name, candidate] of [['passageId', input.passageId], ['entityId', input.entityId], ['editionId', input.editionId]] as const) {
    if (candidate !== undefined && (!Number.isSafeInteger(candidate) || candidate < 1)) return { ok: false, errors: [`${name} must be a positive integer`] }
  }
  if (input.family && !REVELATION_FAMILIES.includes(input.family)) return { ok: false, errors: ['family must be QURAN, TAWRAT, ZABUR, or INJIL'] }
  if (input.languages?.some((item) => !normalizedText(item))) return { ok: false, errors: ['languages must not contain blank values'] }
  return { ok: true }
}

async function resolvePassage(env: Ctx, input: RevelationQueryInput): Promise<Loose | null> {
  if (input.passageId) return (await WxPassage.fetch(WxPassage, env, [['id', '=', input.passageId], ['active', '=', true]]))[0] ?? null
  if (input.entityId) return (await WxPassage.fetch(WxPassage, env, [['entityId', '=', input.entityId], ['active', '=', true]]))[0] ?? null
  return passageByReference(env, input.reference ?? '')
}

async function relatedSource(env: Ctx, provenanceId: number, directSourceId: number): Promise<{ provenance: Loose | null; source: Loose | null }> {
  const provenance = provenanceId
    ? (await WxProvenance.fetch(WxProvenance, env, [['id', '=', provenanceId], ['active', '=', true], ['superseded', '=', false]]))[0] ?? null
    : null
  const sourceId = directSourceId || foreignId(provenance, 'sourceId', 'source_id')
  const source = sourceId
    ? (await WxSource.fetch(WxSource, env, [['id', '=', sourceId], ['active', '=', true]]))[0] ?? null
    : null
  return { provenance, source }
}

/** Read a bounded source-preserving passage context through the caller's normal ACL-aware ORM context. */
export async function resolveRevelationPassageContext(env: Ctx, input: RevelationQueryInput): Promise<RevelationPassageContext | null> {
  const passage = await resolvePassage(env, input)
  if (!passage) return null
  const scriptureId = foreignId(passage, 'scriptureId', 'scripture_id')
  const scripture = scriptureId
    ? (await WxScripture.fetch(WxScripture, env, [['id', '=', scriptureId], ['active', '=', true]]))[0] ?? null
    : null
  if (!scripture) return null
  const family = familyOf(scripture)
  if (!family || (input.family && family !== input.family)) return null

  const allContents = await WxContent.fetch(WxContent, env, [['passageId', '=', idOf(passage)], ['active', '=', true]], undefined, { limit: 100, order: 'id ASC' })
  const contents: RevelationContentWitness[] = []
  for (const content of allContents) {
    if (!includeContent(input, content) || !matchesLanguage(input, content)) continue
    if (input.editionId && foreignId(content, 'editionId', 'edition_id') !== input.editionId) continue
    if (input.revision && normalizedText(value(content, 'revision')) !== input.revision.trim()) continue
    const editionId = foreignId(content, 'editionId', 'edition_id')
    const edition = editionId
      ? (await WxTextEdition.fetch(WxTextEdition, env, [['id', '=', editionId], ['active', '=', true]]))[0] ?? null
      : null
    const { provenance, source } = await relatedSource(env, foreignId(content, 'provenanceId', 'provenance_id'), foreignId(content, 'sourceId', 'source_id'))
    contents.push({ content, edition, provenance, source, authorityClass: contentAuthority(value(content, 'contentType', 'content_type')) })
  }

  const lexicalOccurrences = input.includeLexical
    ? await WxLexicalOccurrence.fetch(WxLexicalOccurrence, env, [['passageId', '=', idOf(passage)], ['active', '=', true]], undefined, { limit: 100, order: 'id ASC' })
    : []
  const revelationEvents: RevelationPassageContext['revelationEvents'] = []
  if (input.includeEvents) {
    const links = await WxRevelationEventPassage.fetch(WxRevelationEventPassage, env, [['passageId', '=', idOf(passage)], ['active', '=', true]], undefined, { limit: 100, order: 'id ASC' })
    for (const link of links) {
      const eventId = foreignId(link, 'eventId', 'event_id')
      const event = eventId
        ? (await WxRevelationEvent.fetch(WxRevelationEvent, env, [['id', '=', eventId], ['active', '=', true]]))[0] ?? null
        : null
      if (!event) continue
      const lineage = await relatedSource(env, foreignId(link, 'provenanceId', 'provenance_id'), foreignId(event, 'sourceId', 'source_id'))
      revelationEvents.push({ event, link, ...lineage })
    }
  }
  return { passage, scripture, family, contents, lexicalOccurrences, revelationEvents }
}

export function createRevelationQueryModule(): WitnessEngineModule<RevelationQueryInput> {
  return {
    code: 'revelation.query',
    version: '1.0.0',
    deterministic: true,
    inputSchemaVersion: 'REVELATION_QUERY_INPUT_V1',
    outputSchemaVersion: 'WITNESS_ENGINE_RESULT_V1',
    validateInput: validateRevelationQueryInput,
    async resolveScope(ctx, input) {
      const context = await resolveRevelationPassageContext(ctx as Ctx, input)
      if (!context) return { scriptureFamilies: input.family ? [input.family] : undefined }
      return {
        scriptureFamilies: [context.family],
        languagePreferences: input.languages,
        includeHadith: input.includeHadith === true,
        includeDerivedAssertions: input.includeDerivedAssertions === true,
        sourceRevisions: uniqueRevisions(context.contents.map((witness) => revisionForWitness(context, witness)))
      } satisfies EngineScopeInput
    },
    async execute(ctx, input, _scope) {
      const context = await resolveRevelationPassageContext(ctx as Ctx, input)
      if (!context) {
        return {
          summary: 'No accessible canonical Revelation passage matched the requested target.',
          findings: [{ key: 'revelation:unresolved', statement: 'Requested Revelation passage could not be resolved.', authorityClass: 'PRIMARY_SOURCE', unresolvedReasonCodes: ['PASSAGE_NOT_FOUND'] }]
        } satisfies EngineResultDraft
      }
      const reference = normalizedText(value(context.passage, 'canonicalReference', 'canonical_reference'))
      const findings: EngineResultDraft['findings'] = context.contents.map((witness) => {
        const content = witness.content
        const type = normalizedText(value(content, 'contentType', 'content_type')).toUpperCase()
        const evidence = evidenceForContent(context, witness)
        return {
          key: `passage:${idOf(context.passage)}:content:${idOf(content)}`,
          statement: `${reference} ${type.toLowerCase().replaceAll('_', ' ')} witness`,
          displayText: `${context.family} · ${reference} · ${type}`,
          subjectEntityId: foreignId(context.passage, 'entityId', 'entity_id'),
          predicate: 'HAS_CONTENT_WITNESS',
          objectValue: normalizedText(value(content, 'text')),
          authorityClass: witness.authorityClass,
          evidence: evidence ? [evidence] : [],
          unresolvedReasonCodes: evidence ? [] : ['CONTENT_PROVENANCE_INCOMPLETE']
        }
      })
      if (!findings.length) {
        findings.push({
          key: `passage:${idOf(context.passage)}:unresolved`,
          statement: `${reference} has no reproducible selected source content.`,
          subjectEntityId: foreignId(context.passage, 'entityId', 'entity_id'),
          predicate: 'HAS_CONTENT_WITNESS',
          authorityClass: 'PRIMARY_SOURCE' as const,
          unresolvedReasonCodes: ['SOURCE_CONTENT_MISSING']
        })
      }
      return {
        summary: `${reference} returned ${context.contents.length} source-preserving content witness(es) from ${context.family}.`,
        findings,
        diagnostics: [
          `family:${context.family}`,
          `lexicalOccurrences:${context.lexicalOccurrences.length}`,
          `revelationEvents:${context.revelationEvents.length}`,
          `hadithIncluded:${input.includeHadith === true}`
        ]
      } satisfies EngineResultDraft
    },
    async explain(_ctx, output, _scope) {
      const finding = output.findings[0]
      if (!finding) throw new Error('Revelation Query output has no findings to explain')
      return {
        findingKey: finding.key,
        evidence: finding.evidence,
        provenanceRefs: finding.provenanceRefs,
        narrative: 'The query returns source content as separate witnesses; translations remain translations and content without complete provenance remains unresolved.'
      } satisfies EngineEvidenceExplanation
    }
  }
}

export type { EngineResultEnvelope, EngineScope }
