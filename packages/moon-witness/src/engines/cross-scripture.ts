import type { Ctx } from '@moon/orm'
import WxAssertion from '../models/wx-assertion.js'
import WxConcept from '../models/wx-concept.js'
import WxEntity from '../models/wx-entity.js'
import WxFigure from '../models/wx-figure.js'
import WxPassage from '../models/wx-passage.js'
import WxProvenance from '../models/wx-provenance.js'
import WxRevelationEvent from '../models/wx-revelation-event.js'
import WxRelationType from '../models/wx-relation-type.js'
import WxScripture from '../models/wx-scripture.js'
import WxSource from '../models/wx-source.js'
import { WitnessGraphService, type Loose } from '../graph/service.js'
import type {
  EngineEvidenceCandidate,
  EngineEvidenceExplanation,
  EngineEvidenceRelation,
  EngineOutputAuthorityClass,
  EngineResultDraft,
  EngineResultEnvelope,
  EngineScope,
  EngineScopeInput,
  EngineSourceRevision,
  EngineValidationResult,
  RevelationFamily,
  WitnessEngineModule
} from '../types/engine.js'
import { REVELATION_FAMILIES } from './revelation-query.js'

export interface CrossScriptureComparisonInput {
  entityId?: number
  figureId?: number
  conceptId?: number
  eventId?: number
  relationCode?: string
  includeDerivedAssertions?: boolean
}

export type CrossScriptureEvidenceClass =
  | 'EXPLICIT_SOURCE_MENTION'
  | 'CURATED_SOURCED_RELATION'
  | 'ACCEPTED_ASSERTION'
  | 'DERIVED_ASSERTION'
  | 'HYPOTHESIS'

export interface CrossScriptureEvidenceEntry {
  family: RevelationFamily
  passage: Loose
  relation: Loose
  assertion: Loose | null
  classification: CrossScriptureEvidenceClass
  evidence: EngineEvidenceCandidate | null
}

export interface CrossScriptureEvidenceMatrix {
  target: Loose
  groups: Record<RevelationFamily, CrossScriptureEvidenceEntry[]>
  sourceRevisions: EngineSourceRevision[]
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

function text(value: unknown): string {
  return typeof value === 'string' ? value.trim() : ''
}

function familyOf(scripture: Loose): RevelationFamily | null {
  const code = text(value(scripture, 'canonicalCode', 'canonical_code')).toUpperCase()
  const aliases: Record<string, RevelationFamily> = {
    QURAN: 'QURAN', QURANIC: 'QURAN',
    TAWRAT: 'TAWRAT', TORAH: 'TAWRAT',
    ZABUR: 'ZABUR', PSALMS: 'ZABUR',
    INJIL: 'INJIL', GOSPEL: 'INJIL'
  }
  return aliases[code] ?? null
}

function relationAuthority(relation: Loose, assertion: Loose | null): EngineOutputAuthorityClass {
  const assertionClass = text(value(assertion, 'assertionClass', 'assertion_class')).toUpperCase()
  if (assertionClass === 'EXPLICIT_SOURCE') return 'PRIMARY_SOURCE'
  if (assertionClass === 'SOURCE_SUMMARY') return 'SOURCE_SUMMARY'
  if (assertionClass === 'SCHOLARLY_INTERPRETATION') return 'SCHOLARLY_INTERPRETATION'
  if (assertionClass === 'DERIVED') return 'DERIVED'
  if (assertionClass === 'HYPOTHESIS') return 'HYPOTHESIS'
  const authority = text(value(relation, 'authorityClass', 'authority_class')).toUpperCase()
  return authority === 'NOT_APPLICABLE' || !authority ? 'DERIVED' : authority as EngineOutputAuthorityClass
}

function classificationFor(relation: Loose, assertion: Loose | null, relationCode: string): CrossScriptureEvidenceClass {
  const assertionClass = text(value(assertion, 'assertionClass', 'assertion_class')).toUpperCase()
  if (assertionClass === 'DERIVED') return 'DERIVED_ASSERTION'
  if (assertionClass === 'HYPOTHESIS') return 'HYPOTHESIS'
  if (assertion) return 'ACCEPTED_ASSERTION'
  if (relationCode === 'MENTIONS' && text(value(relation, 'sourceClass', 'source_class')).toUpperCase() === 'REVELATION') {
    return 'EXPLICIT_SOURCE_MENTION'
  }
  return 'CURATED_SOURCED_RELATION'
}

function shouldInclude(relation: Loose, assertion: Loose | null, input: CrossScriptureComparisonInput): boolean {
  const assertionClass = text(value(assertion, 'assertionClass', 'assertion_class')).toUpperCase()
  const relationAuthorityValue = text(value(relation, 'authorityClass', 'authority_class')).toUpperCase()
  return input.includeDerivedAssertions === true
    || (assertionClass !== 'DERIVED' && relationAuthorityValue !== 'DERIVED')
}

function evidenceRelation(relation: Loose): EngineEvidenceRelation {
  return text(value(relation, 'polarity')).toUpperCase() === 'NEGATED' ? 'CONTRADICTS' : 'SUPPORTS'
}

function groups(): Record<RevelationFamily, CrossScriptureEvidenceEntry[]> {
  return { QURAN: [], TAWRAT: [], ZABUR: [], INJIL: [] }
}

function targetCount(input: CrossScriptureComparisonInput): number {
  return [input.entityId, input.figureId, input.conceptId, input.eventId].filter((value) => value !== undefined).length
}

export function validateCrossScriptureComparisonInput(input: CrossScriptureComparisonInput): EngineValidationResult {
  if (!input || typeof input !== 'object') return { ok: false, errors: ['Input must be an object'] }
  if (targetCount(input) !== 1) return { ok: false, errors: ['Provide exactly one of entityId, figureId, conceptId, or eventId'] }
  for (const [name, candidate] of Object.entries(input)) {
    if (name.endsWith('Id') && candidate !== undefined && (!Number.isSafeInteger(candidate) || Number(candidate) < 1)) {
      return { ok: false, errors: [`${name} must be a positive integer`] }
    }
  }
  if (input.relationCode !== undefined && !text(input.relationCode)) return { ok: false, errors: ['relationCode must not be blank'] }
  return { ok: true }
}

async function resolveTarget(env: Ctx, input: CrossScriptureComparisonInput): Promise<Loose | null> {
  if (input.entityId) return (await WxEntity.fetch(WxEntity, env, [['id', '=', input.entityId], ['active', '=', true]]))[0] ?? null
  const Model = input.figureId ? WxFigure : input.conceptId ? WxConcept : WxRevelationEvent
  const recordId = input.figureId ?? input.conceptId ?? input.eventId
  const row = recordId ? (await Model.fetch(Model, env, [['id', '=', recordId], ['active', '=', true]]))[0] ?? null : null
  const entityId = foreignId(row, 'entityId', 'entity_id')
  return entityId ? WitnessGraphService.entity(env, entityId) : null
}

async function lineage(env: Ctx, relation: Loose): Promise<{ provenance: Loose | null; source: Loose | null }> {
  const provenanceId = foreignId(relation, 'provenanceId', 'provenance_id')
  const provenance = provenanceId
    ? (await WxProvenance.fetch(WxProvenance, env, [['id', '=', provenanceId], ['active', '=', true], ['superseded', '=', false]]))[0] ?? null
    : null
  const sourceId = foreignId(relation, 'sourceId', 'source_id') || foreignId(provenance, 'sourceId', 'source_id')
  const source = sourceId
    ? (await WxSource.fetch(WxSource, env, [['id', '=', sourceId], ['active', '=', true]]))[0] ?? null
    : null
  return { provenance, source }
}

function sourceRevision(relation: Loose, provenance: Loose | null, source: Loose | null): string {
  return text(value(relation, 'sourceRevision', 'source_revision'))
    || text(value(provenance, 'sourceRevision', 'source_revision'))
    || text(value(source, 'revision'))
}

function sourceKey(source: Loose): string {
  return text(value(source, 'stableKey', 'stable_key')) || `source:${idOf(source)}`
}

function provenanceRef(provenance: Loose): string {
  return text(value(provenance, 'stableKey', 'stable_key')) || `provenance:${idOf(provenance)}`
}

async function passageForEndpoint(env: Ctx, targetEntityId: number, relation: Loose): Promise<Loose | null> {
  const from = foreignId(relation, 'fromEntityId', 'from_entity_id')
  const to = foreignId(relation, 'toEntityId', 'to_entity_id')
  const candidate = from === targetEntityId ? to : from
  if (!candidate || candidate === targetEntityId) return null
  return (await WxPassage.fetch(WxPassage, env, [['entityId', '=', candidate], ['active', '=', true]]))[0] ?? null
}

async function relationTypeCode(env: Ctx, relation: Loose): Promise<string> {
  const typeId = foreignId(relation, 'relationTypeId', 'relation_type_id')
  if (!typeId) return ''
  const type = (await WxRelationType.fetch(WxRelationType, env, [['id', '=', typeId], ['active', '=', true]]))[0] ?? null
  return text(value(type, 'code')).toUpperCase()
}

/**
 * Build an evidence matrix only from recorded canonical relations. It never
 * creates a parallel from lexical similarity, labels, or an inferred fulfilment.
 */
export async function buildCrossScriptureEvidenceMatrix(env: Ctx, input: CrossScriptureComparisonInput): Promise<CrossScriptureEvidenceMatrix | null> {
  const target = await resolveTarget(env, input)
  if (!target) return null
  const targetId = idOf(target)
  const relationCode = text(input.relationCode).toUpperCase() || undefined
  const matrix = groups()
  const revisions: EngineSourceRevision[] = []
  const relations = await WitnessGraphService.relations(env, targetId, relationCode)
  for (const relation of relations.slice(0, 500)) {
    const assertionId = foreignId(relation, 'assertionEntityId', 'assertion_entity_id')
    const assertion = assertionId
      ? (await WxAssertion.fetch(WxAssertion, env, [['entityId', '=', assertionId], ['active', '=', true]]))[0] ?? null
      : null
    if (!shouldInclude(relation, assertion, input)) continue
    const passage = await passageForEndpoint(env, targetId, relation)
    if (!passage) continue
    const scriptureId = foreignId(passage, 'scriptureId', 'scripture_id')
    const scripture = scriptureId
      ? (await WxScripture.fetch(WxScripture, env, [['id', '=', scriptureId], ['active', '=', true]]))[0] ?? null
      : null
    const family = scripture ? familyOf(scripture) : null
    if (!family) continue
    const resolvedCode = relationCode ?? await relationTypeCode(env, relation)
    const classification = classificationFor(relation, assertion, resolvedCode)
    const authorityClass = relationAuthority(relation, assertion)
    const { provenance, source } = await lineage(env, relation)
    const revision = sourceRevision(relation, provenance, source)
    const evidence = provenance && source && revision
      ? {
          evidenceKey: `relation:${idOf(relation)}`,
          relation: evidenceRelation(relation),
          authorityClass,
          sourceFamily: family,
          sourceRevision: revision,
          provenanceRef: provenanceRef(provenance),
          passageId: idOf(passage),
          entityId: targetId,
          sourceReference: text(value(passage, 'canonicalReference', 'canonical_reference')) || undefined
        } satisfies EngineEvidenceCandidate
      : null
    matrix[family].push({ family, passage, relation, assertion, classification, evidence })
    if (evidence && source) revisions.push({ sourceKey: sourceKey(source), revision, family, authorityClass })
  }
  for (const family of REVELATION_FAMILIES) {
    matrix[family].sort((left, right) => `${idOf(left.passage)}:${idOf(left.relation)}`.localeCompare(`${idOf(right.passage)}:${idOf(right.relation)}`))
  }
  const unique = new Map<string, EngineSourceRevision>()
  for (const revision of revisions) unique.set(`${revision.sourceKey}\u0000${revision.revision}`, revision)
  return { target, groups: matrix, sourceRevisions: [...unique.values()].sort((left, right) => JSON.stringify(left).localeCompare(JSON.stringify(right))) }
}

export function createCrossScriptureComparisonModule(): WitnessEngineModule<CrossScriptureComparisonInput> {
  return {
    code: 'revelation.cross-scripture',
    version: '1.0.0',
    deterministic: true,
    inputSchemaVersion: 'CROSS_SCRIPTURE_COMPARISON_INPUT_V1',
    outputSchemaVersion: 'WITNESS_ENGINE_RESULT_V1',
    validateInput: validateCrossScriptureComparisonInput,
    async resolveScope(ctx, input) {
      const matrix = await buildCrossScriptureEvidenceMatrix(ctx as Ctx, input)
      return {
        scriptureFamilies: REVELATION_FAMILIES,
        includeDerivedAssertions: input.includeDerivedAssertions === true,
        sourceRevisions: matrix?.sourceRevisions ?? []
      } satisfies EngineScopeInput
    },
    async execute(ctx, input, _scope) {
      const matrix = await buildCrossScriptureEvidenceMatrix(ctx as Ctx, input)
      if (!matrix) {
        return {
          summary: 'No accessible canonical target matched the comparison request.',
          findings: REVELATION_FAMILIES.map((family) => ({
            key: `comparison:${family}:unresolved`,
            statement: `No safe ${family} comparison can be established for the requested target.`,
            authorityClass: 'HYPOTHESIS' as const,
            unresolvedReasonCodes: ['TARGET_NOT_FOUND', 'NO_SAFE_PARALLEL']
          }))
        } satisfies EngineResultDraft
      }
      const targetId = idOf(matrix.target)
      const targetName = text(value(matrix.target, 'name', 'label')) || `entity ${targetId}`
      const findings = REVELATION_FAMILIES.map((family) => {
        const entries = matrix.groups[family]
        const evidence = entries.flatMap((entry) => entry.evidence ? [entry.evidence] : [])
        const classifications = [...new Set(entries.map((entry) => entry.classification))].sort()
        return {
          key: `comparison:${targetId}:${family}`,
          statement: `${family} source context for ${targetName}`,
          displayText: `${family} · ${targetName} · ${classifications.join(', ') || 'NO_SAFE_PARALLEL'}`,
          subjectEntityId: targetId,
          predicate: 'CROSS_SCRIPTURE_CONTEXT',
          authorityClass: evidence.length ? evidence[0]!.authorityClass : 'HYPOTHESIS' as const,
          evidence,
          unresolvedReasonCodes: !entries.length
            ? ['NO_SAFE_PARALLEL']
            : evidence.length < entries.length ? ['RELATION_PROVENANCE_INCOMPLETE'] : []
        }
      })
      return {
        summary: `Cross-Scripture evidence matrix for ${targetName}; each normative family remains separate.`,
        findings,
        diagnostics: REVELATION_FAMILIES.map((family) => `matrix:${family}:${matrix.groups[family].length}`)
      } satisfies EngineResultDraft
    },
    async explain(_ctx, output, _scope) {
      const finding = output.findings[0]
      if (!finding) throw new Error('Cross-Scripture output has no findings to explain')
      return {
        findingKey: finding.key,
        evidence: finding.evidence,
        provenanceRefs: finding.provenanceRefs,
        narrative: 'The matrix contains only explicit source mentions, curated sourced relations, or stored assertions. It does not infer primary-source parallels or fulfilments.'
      } satisfies EngineEvidenceExplanation
    }
  }
}

export type { EngineResultEnvelope, EngineScope }
