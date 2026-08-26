import type { Ctx } from '@moon/orm'
import WxAssertion from '../models/wx-assertion.js'
import WxConcept from '../models/wx-concept.js'
import WxEntityAlias from '../models/wx-entity-alias.js'
import WxEvidence from '../models/wx-evidence.js'
import WxProvenance from '../models/wx-provenance.js'
import WxSource from '../models/wx-source.js'
import type { Loose } from '../graph/service.js'
import type { EngineEvidenceCandidate, EngineEvidenceExplanation, EngineOutputAuthorityClass, EngineResultDraft, EngineScopeInput, EngineValidationResult, WitnessEngineModule } from '../types/engine.js'

export interface ConceptEvidenceInput { conceptId?: number; entityId?: number; query?: string; assertionClasses?: string[] }

function value(row: Loose | null | undefined, camel: string, snake = camel): any { return row?.[camel] ?? row?.[snake] }
function idOf(row: Loose | null | undefined): number { return Number(value(row, 'id') ?? 0) }
function foreignId(row: Loose | null | undefined, camel: string, snake: string): number { const raw = value(row, camel, snake); return Number(Array.isArray(raw) ? raw[0] : raw ?? 0) }
function text(raw: unknown): string { return typeof raw === 'string' ? raw.trim() : '' }
function authority(assertion: Loose): EngineOutputAuthorityClass { const valueClass = text(value(assertion, 'assertionClass', 'assertion_class')).toUpperCase(); return valueClass === 'EXPLICIT_SOURCE' ? 'PRIMARY_SOURCE' : valueClass === 'SOURCE_SUMMARY' ? 'SOURCE_SUMMARY' : valueClass === 'SCHOLARLY_INTERPRETATION' ? 'SCHOLARLY_INTERPRETATION' : valueClass === 'HYPOTHESIS' ? 'HYPOTHESIS' : 'DERIVED' }

export function validateConceptEvidenceInput(input: ConceptEvidenceInput): EngineValidationResult {
  if (!input || typeof input !== 'object') return { ok: false, errors: ['Input must be an object'] }
  if (![input.conceptId, input.entityId, input.query].some((item) => item !== undefined && item !== '')) return { ok: false, errors: ['Provide conceptId, entityId, or query'] }
  if ([input.conceptId, input.entityId].some((item) => item !== undefined && (!Number.isSafeInteger(item) || Number(item) < 1))) return { ok: false, errors: ['IDs must be positive integers'] }
  if (input.query !== undefined && !text(input.query)) return { ok: false, errors: ['query must not be blank'] }
  return { ok: true }
}

async function resolveConcepts(env: Ctx, input: ConceptEvidenceInput): Promise<Loose[]> {
  if (input.conceptId) return WxConcept.fetch(WxConcept, env, [['id', '=', input.conceptId], ['active', '=', true]])
  if (input.entityId) return WxConcept.fetch(WxConcept, env, [['entityId', '=', input.entityId], ['active', '=', true]])
  const query = text(input.query).toLocaleLowerCase()
  const concepts = await WxConcept.fetch(WxConcept, env, [['active', '=', true]], undefined, { limit: 500, order: 'id ASC' })
  return concepts.filter((concept) => [value(concept, 'name'), value(concept, 'stableKey', 'stable_key'), value(concept, 'description')].some((item) => text(item).toLocaleLowerCase().includes(query)))
}

async function evidenceForAssertion(env: Ctx, assertion: Loose): Promise<EngineEvidenceCandidate[]> {
  const evidenceRows = await WxEvidence.fetch(WxEvidence, env, [['assertionId', '=', idOf(assertion)], ['active', '=', true]], undefined, { limit: 100, order: 'id ASC' })
  const results: EngineEvidenceCandidate[] = []
  for (const evidence of evidenceRows) {
    const provenance = (await WxProvenance.fetch(WxProvenance, env, [['id', '=', foreignId(evidence, 'provenanceId', 'provenance_id')], ['active', '=', true], ['superseded', '=', false]]))[0] ?? null
    const sourceId = foreignId(assertion, 'sourceId', 'source_id') || foreignId(provenance, 'sourceId', 'source_id')
    const source = sourceId ? (await WxSource.fetch(WxSource, env, [['id', '=', sourceId], ['active', '=', true]]))[0] ?? null : null
    const revision = text(value(provenance, 'sourceRevision', 'source_revision')) || text(value(source, 'revision'))
    if (!provenance || !source || !revision) continue
    results.push({ evidenceKey: `assertion-evidence:${idOf(evidence)}`, relation: text(value(evidence, 'relation')).toUpperCase() as EngineEvidenceCandidate['relation'], authorityClass: authority(assertion), sourceRevision: revision, provenanceRef: text(value(provenance, 'stableKey', 'stable_key')) || `provenance:${idOf(provenance)}`, entityId: foreignId(evidence, 'evidenceEntityId', 'evidence_entity_id') || undefined, contentId: foreignId(evidence, 'contentId', 'content_id') || undefined, sourceReference: text(value(evidence, 'sourceReference', 'source_reference')) || undefined })
  }
  return results
}

export function createConceptEvidenceModule(): WitnessEngineModule<ConceptEvidenceInput> {
  return {
    code: 'concept.evidence', version: '1.0.0', deterministic: true,
    inputSchemaVersion: 'CONCEPT_EVIDENCE_INPUT_V1', outputSchemaVersion: 'WITNESS_ENGINE_RESULT_V1', validateInput: validateConceptEvidenceInput,
    async resolveScope(ctx, input) { const concepts = await resolveConcepts(ctx as Ctx, input); return { conceptIds: concepts.map(idOf) } satisfies EngineScopeInput },
    async execute(ctx, input) {
      const env = ctx as Ctx; const concepts = await resolveConcepts(env, input); const findings: EngineResultDraft['findings'] = []
      for (const concept of concepts) {
        const entityId = foreignId(concept, 'entityId', 'entity_id')
        const aliases = await WxEntityAlias.fetch(WxEntityAlias, env, [['entityId', '=', entityId], ['active', '=', true]], undefined, { limit: 100, order: 'id ASC' })
        for (const alias of aliases) findings.push({ key: `concept:${idOf(concept)}:label:${idOf(alias)}`, statement: `Multilingual concept label for ${text(value(concept, 'name'))}.`, subjectEntityId: entityId, predicate: 'HAS_LABEL', objectValue: text(value(alias, 'label')) || text(value(alias, 'normalizedLabel', 'normalized_label')), authorityClass: 'SOURCE_SUMMARY' })
        const assertions = await WxAssertion.fetch(WxAssertion, env, [['active', '=', true]], undefined, { limit: 500, order: 'id ASC' })
        for (const assertion of assertions.filter((item) => [foreignId(item, 'subjectEntityId', 'subject_entity_id'), foreignId(item, 'objectEntityId', 'object_entity_id'), foreignId(item, 'entityId', 'entity_id')].includes(entityId) && (!input.assertionClasses?.length || input.assertionClasses.includes(text(value(item, 'assertionClass', 'assertion_class')))))) {
          const evidence = await evidenceForAssertion(env, assertion); const cls = authority(assertion)
          findings.push({ key: `concept:${idOf(concept)}:assertion:${idOf(assertion)}`, statement: `${text(value(assertion, 'predicate'))}: ${text(value(assertion, 'objectValue', 'object_value')) || 'linked entity'}`, subjectEntityId: foreignId(assertion, 'subjectEntityId', 'subject_entity_id'), predicate: text(value(assertion, 'predicate')), objectEntityId: foreignId(assertion, 'objectEntityId', 'object_entity_id') || undefined, objectValue: text(value(assertion, 'objectValue', 'object_value')) || undefined, authorityClass: cls, evidence, unresolvedReasonCodes: evidence.length ? [] : ['ASSERTION_EVIDENCE_MISSING'] })
        }
      }
      if (!findings.length) findings.push({ key: 'concept:unresolved', statement: 'No accessible concept labels or evidence-backed assertions matched the query.', authorityClass: 'SOURCE_SUMMARY', unresolvedReasonCodes: ['CONCEPT_NOT_FOUND'] })
      return { summary: `Concept query retained ${findings.length} label or assertion witness(es); contradictory evidence remains separate.`, findings }
    },
    async explain(_ctx, output) { const finding = output.findings[0]; if (!finding) throw new Error('Concept output has no findings'); return { findingKey: finding.key, evidence: finding.evidence, provenanceRefs: finding.provenanceRefs, narrative: 'Concept labels and claims are returned as separate records; the engine never collapses conflicting evidence into a single truth value.' } satisfies EngineEvidenceExplanation }
  }
}
