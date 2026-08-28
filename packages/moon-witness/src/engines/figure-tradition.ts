import type { Ctx } from '@moon/orm'
import WxEntity from '../models/wx-entity.js'
import WxFigure from '../models/wx-figure.js'
import WxFigureName from '../models/wx-figure-name.js'
import WxFigureRole from '../models/wx-figure-role.js'
import WxProvenance from '../models/wx-provenance.js'
import WxSource from '../models/wx-source.js'
import WxTraditionAssessment from '../models/wx-tradition-assessment.js'
import WxTraditionAttribution from '../models/wx-tradition-attribution.js'
import WxTraditionCorpus from '../models/wx-tradition-corpus.js'
import WxTraditionReference from '../models/wx-tradition-reference.js'
import WxTraditionUnit from '../models/wx-tradition-unit.js'
import WxTransmissionChain from '../models/wx-transmission-chain.js'
import WxTransmissionLink from '../models/wx-transmission-link.js'
import { figureMentions } from '../graph/domain-queries.js'
import type { Loose } from '../graph/service.js'
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
  WitnessEngineModule
} from '../types/engine.js'

export interface FigureAnalysisInput { figureId?: number; entityId?: number }
export interface TraditionAnalysisInput { unitId?: number; entityId?: number; reference?: string; figureId?: number }

function value(row: Loose | null | undefined, camel: string, snake = camel): any { return row?.[camel] ?? row?.[snake] }
function idOf(row: Loose | null | undefined): number { return Number(value(row, 'id') ?? 0) }
function foreignId(row: Loose | null | undefined, camel: string, snake: string): number {
  const raw = value(row, camel, snake); return Number(Array.isArray(raw) ? raw[0] : raw ?? 0)
}
function text(raw: unknown): string { return typeof raw === 'string' ? raw.trim() : '' }
function validId(raw: unknown): boolean { return Number.isSafeInteger(raw) && Number(raw) > 0 }
type Lineage = { provenance: Loose | null; source: Loose | null; revision: string }

function validation(input: Record<string, unknown>, keys: string[]): EngineValidationResult {
  const selected = keys.filter((key) => input[key] !== undefined && input[key] !== '')
  if (selected.length !== 1) return { ok: false, errors: [`Provide exactly one of ${keys.join(', ')}`] }
  for (const key of selected.filter((key) => key.endsWith('Id'))) if (!validId(input[key])) return { ok: false, errors: [`${key} must be a positive integer`] }
  if (input.reference !== undefined && !text(input.reference)) return { ok: false, errors: ['reference must not be blank'] }
  return { ok: true }
}

async function lineage(env: Ctx, row: Loose): Promise<Lineage> {
  const provenanceId = foreignId(row, 'provenanceId', 'provenance_id')
  const provenance = provenanceId ? (await WxProvenance.fetch(WxProvenance, env, [['id', '=', provenanceId], ['active', '=', true], ['superseded', '=', false]]))[0] ?? null : null
  const sourceId = foreignId(row, 'sourceId', 'source_id') || foreignId(row, 'authoritySourceId', 'authority_source_id') || foreignId(provenance, 'sourceId', 'source_id')
  const source = sourceId ? (await WxSource.fetch(WxSource, env, [['id', '=', sourceId], ['active', '=', true]]))[0] ?? null : null
  return { provenance, source, revision: text(value(provenance, 'sourceRevision', 'source_revision')) || text(value(source, 'revision')) }
}

function evidence(row: Loose, lineage: Lineage, target: { entityId?: number; reportId?: number }, authorityClass: EngineOutputAuthorityClass, relation: EngineEvidenceCandidate['relation'] = 'SUPPORTS'): EngineEvidenceCandidate | null {
  if (!lineage.provenance || !lineage.source || !lineage.revision) return null
  return {
    evidenceKey: `${text(value(row, 'stableKey', 'stable_key')) || row.constructor?.name || 'record'}:${idOf(row)}`,
    relation,
    authorityClass,
    sourceRevision: lineage.revision,
    provenanceRef: text(value(lineage.provenance, 'stableKey', 'stable_key')) || `provenance:${idOf(lineage.provenance)}`,
    ...target,
    sourceReference: text(value(row, 'sourceReference', 'source_reference')) || undefined
  }
}

async function sourceRevisions(env: Ctx, rows: Loose[]): Promise<EngineSourceRevision[]> {
  const result = new Map<string, EngineSourceRevision>()
  for (const row of rows) {
    const lineage = await lineageFor(row)
    if (!lineage.source || !lineage.revision) continue
    const sourceKey = text(value(lineage.source, 'stableKey', 'stable_key')) || `source:${idOf(lineage.source)}`
    result.set(`${sourceKey}\u0000${lineage.revision}`, { sourceKey, revision: lineage.revision })
  }
  return [...result.values()].sort((a, b) => JSON.stringify(a).localeCompare(JSON.stringify(b)))

  async function lineageFor(row: Loose): Promise<Lineage> { return lineage(env, row) }
}

export function validateFigureAnalysisInput(input: FigureAnalysisInput): EngineValidationResult {
  return input && typeof input === 'object' ? validation(input as Record<string, unknown>, ['figureId', 'entityId']) : { ok: false, errors: ['Input must be an object'] }
}

export function validateTraditionAnalysisInput(input: TraditionAnalysisInput): EngineValidationResult {
  return input && typeof input === 'object' ? validation(input as Record<string, unknown>, ['unitId', 'entityId', 'reference', 'figureId']) : { ok: false, errors: ['Input must be an object'] }
}

async function resolveFigure(env: Ctx, input: FigureAnalysisInput): Promise<Loose | null> {
  if (input.figureId) return (await WxFigure.fetch(WxFigure, env, [['id', '=', input.figureId], ['active', '=', true]]))[0] ?? null
  return (await WxFigure.fetch(WxFigure, env, [['entityId', '=', input.entityId], ['active', '=', true]]))[0] ?? null
}

export function createFigureAnalysisModule(): WitnessEngineModule<FigureAnalysisInput> {
  return {
    code: 'figure.analysis', version: '1.0.0', deterministic: true,
    inputSchemaVersion: 'FIGURE_ANALYSIS_INPUT_V1', outputSchemaVersion: 'WITNESS_ENGINE_RESULT_V1', validateInput: validateFigureAnalysisInput,
    async resolveScope(ctx, input) {
      const env = ctx as Ctx; const figure = await resolveFigure(env, input)
      const figureId = idOf(figure)
      const rows = figureId ? [
        ...await WxFigureName.fetch(WxFigureName, env, [['figureId', '=', figureId], ['active', '=', true]], undefined, { limit: 100 }),
        ...await WxFigureRole.fetch(WxFigureRole, env, [['figureId', '=', figureId], ['active', '=', true]], undefined, { limit: 100 })
      ] : []
      return { figureIds: figure ? [figureId] : [], sourceRevisions: await sourceRevisions(env, rows) } satisfies EngineScopeInput
    },
    async execute(ctx, input) {
      const env = ctx as Ctx; const figure = await resolveFigure(env, input)
      if (!figure) return { summary: 'No accessible canonical figure matched the requested target.', findings: [{ key: 'figure:unresolved', statement: 'Requested figure could not be resolved.', authorityClass: 'HYPOTHESIS', unresolvedReasonCodes: ['FIGURE_NOT_FOUND'] }] }
      const figureId = idOf(figure); const entityId = foreignId(figure, 'entityId', 'entity_id')
      const [names, roles, mentions] = await Promise.all([
        WxFigureName.fetch(WxFigureName, env, [['figureId', '=', figureId], ['active', '=', true]], undefined, { limit: 100, order: 'id ASC' }),
        WxFigureRole.fetch(WxFigureRole, env, [['figureId', '=', figureId], ['active', '=', true]], undefined, { limit: 100, order: 'id ASC' }),
        figureMentions(env, entityId, 100)
      ])
      const findings: EngineResultDraft['findings'] = []
      for (const name of names) {
        const source = await lineage(env, name); const item = evidence(name, source, { entityId }, 'SOURCE_SUMMARY')
        findings.push({ key: `figure:${figureId}:name:${idOf(name)}`, statement: `Name form for ${text(value(figure, 'name'))}`, objectValue: text(value(name, 'name')), authorityClass: 'SOURCE_SUMMARY', evidence: item ? [item] : [], unresolvedReasonCodes: item ? [] : ['NAME_PROVENANCE_INCOMPLETE'] })
      }
      for (const role of roles) {
        const source = await lineage(env, role); const item = evidence(role, source, { entityId }, 'SOURCE_SUMMARY')
        findings.push({ key: `figure:${figureId}:role:${idOf(role)}`, statement: `${text(value(figure, 'name'))} has sourced role ${text(value(role, 'roleCode', 'role_code'))}.`, authorityClass: 'SOURCE_SUMMARY', evidence: item ? [item] : [], unresolvedReasonCodes: item ? [] : ['ROLE_PROVENANCE_INCOMPLETE'] })
      }
      for (const mention of mentions?.mentions ?? []) {
        const source = await lineage(env, mention.relation); const item = evidence(mention.relation, source, { entityId }, 'PRIMARY_SOURCE')
        findings.push({ key: `figure:${figureId}:mention:${idOf(mention.relation)}`, statement: `${text(value(mention.passage, 'canonicalReference', 'canonical_reference'))} records a figure mention.`, authorityClass: 'PRIMARY_SOURCE', evidence: item ? [item] : [], unresolvedReasonCodes: item ? [] : ['MENTION_PROVENANCE_INCOMPLETE'] })
      }
      if (!findings.length) findings.push({ key: `figure:${figureId}:unresolved`, statement: `${text(value(figure, 'name'))} has no accessible sourced profile records.`, authorityClass: 'HYPOTHESIS', unresolvedReasonCodes: ['FIGURE_CONTEXT_MISSING'] })
      return { summary: `Figure profile for ${text(value(figure, 'name'))}; names, roles, and scripture mentions remain individually sourced.`, findings }
    },
    async explain(_ctx, output) { const finding = output.findings[0]; if (!finding) throw new Error('Figure output has no findings'); return { findingKey: finding.key, evidence: finding.evidence, provenanceRefs: finding.provenanceRefs } satisfies EngineEvidenceExplanation }
  }
}

async function resolveUnit(env: Ctx, input: TraditionAnalysisInput): Promise<Loose | null> {
  if (input.unitId) return (await WxTraditionUnit.fetch(WxTraditionUnit, env, [['id', '=', input.unitId], ['active', '=', true]]))[0] ?? null
  if (input.entityId) return (await WxTraditionUnit.fetch(WxTraditionUnit, env, [['entityId', '=', input.entityId], ['active', '=', true]]))[0] ?? null
  if (input.reference) {
    const reference = (await WxTraditionReference.fetch(WxTraditionReference, env, [['stableKey', '=', input.reference], ['active', '=', true]]))[0] ?? null
    const unitId = foreignId(reference, 'unitId', 'unit_id')
    return unitId ? (await WxTraditionUnit.fetch(WxTraditionUnit, env, [['id', '=', unitId], ['active', '=', true]]))[0] ?? null : null
  }
  const units = await WxTraditionAttribution.fetch(WxTraditionAttribution, env, [['figureId', '=', input.figureId], ['active', '=', true]], undefined, { limit: 2, order: 'id ASC' })
  return units.length === 1 ? (await WxTraditionUnit.fetch(WxTraditionUnit, env, [['id', '=', foreignId(units[0], 'unitId', 'unit_id')], ['active', '=', true]]))[0] ?? null : null
}

export function createTraditionTransmissionModule(): WitnessEngineModule<TraditionAnalysisInput> {
  return {
    code: 'tradition.transmission', version: '1.0.0', deterministic: true,
    inputSchemaVersion: 'TRADITION_TRANSMISSION_INPUT_V1', outputSchemaVersion: 'WITNESS_ENGINE_RESULT_V1', validateInput: validateTraditionAnalysisInput,
    async resolveScope(ctx, input) {
      const env = ctx as Ctx; const unit = await resolveUnit(env, input); const unitId = idOf(unit)
      const rows = unitId ? [
        ...await WxTraditionReference.fetch(WxTraditionReference, env, [['unitId', '=', unitId], ['active', '=', true]], undefined, { limit: 100 }),
        ...await WxTraditionAttribution.fetch(WxTraditionAttribution, env, [['unitId', '=', unitId], ['active', '=', true]], undefined, { limit: 100 }),
        ...await WxTraditionAssessment.fetch(WxTraditionAssessment, env, [['traditionUnitId', '=', unitId], ['active', '=', true]], undefined, { limit: 100 }),
        ...await WxTransmissionChain.fetch(WxTransmissionChain, env, [['traditionUnitId', '=', unitId], ['active', '=', true]], undefined, { limit: 100 })
      ] : []
      return { sourceRevisions: await sourceRevisions(env, rows), relationCodes: unit ? [text(value(unit, 'stableKey', 'stable_key')).toUpperCase()] : [] } satisfies EngineScopeInput
    },
    async execute(ctx, input) {
      const env = ctx as Ctx; const unit = await resolveUnit(env, input)
      if (!unit) return { summary: 'No accessible tradition unit matched the requested target.', findings: [{ key: 'tradition:unresolved', statement: 'Requested tradition unit could not be resolved.', authorityClass: 'HYPOTHESIS', unresolvedReasonCodes: ['TRADITION_UNIT_NOT_FOUND'] }] }
      const unitId = idOf(unit); const entityId = foreignId(unit, 'entityId', 'entity_id'); const corpus = (await WxTraditionCorpus.fetch(WxTraditionCorpus, env, [['id', '=', foreignId(unit, 'corpusId', 'corpus_id')], ['active', '=', true]]))[0] ?? null
      const [references, attributions, assessments, chains] = await Promise.all([
        WxTraditionReference.fetch(WxTraditionReference, env, [['unitId', '=', unitId], ['active', '=', true]], undefined, { limit: 100, order: 'id ASC' }),
        WxTraditionAttribution.fetch(WxTraditionAttribution, env, [['unitId', '=', unitId], ['active', '=', true]], undefined, { limit: 100, order: 'id ASC' }),
        WxTraditionAssessment.fetch(WxTraditionAssessment, env, [['traditionUnitId', '=', unitId], ['active', '=', true]], undefined, { limit: 100, order: 'id ASC' }),
        WxTransmissionChain.fetch(WxTransmissionChain, env, [['traditionUnitId', '=', unitId], ['active', '=', true]], undefined, { limit: 100, order: 'id ASC' })
      ])
      const findings: EngineResultDraft['findings'] = []
      for (const ref of references) { const source = await lineage(env, ref); const item = evidence(ref, source, { reportId: unitId, entityId }, 'TRANSMISSION_REPORT'); findings.push({ key: `tradition:${unitId}:reference:${idOf(ref)}`, statement: `Source reference ${text(value(ref, 'stableKey', 'stable_key'))}`, authorityClass: 'TRANSMISSION_REPORT', evidence: item ? [item] : [], unresolvedReasonCodes: item ? [] : ['REFERENCE_PROVENANCE_INCOMPLETE'] }) }
      for (const attribution of attributions) { const source = await lineage(env, attribution); const item = evidence(attribution, source, { reportId: unitId, entityId }, 'TRANSMISSION_REPORT'); findings.push({ key: `tradition:${unitId}:attribution:${idOf(attribution)}`, statement: `Source attribution ${text(value(attribution, 'roleCode', 'role_code'))}`, authorityClass: 'TRANSMISSION_REPORT', evidence: item ? [item] : [], unresolvedReasonCodes: item ? [] : ['ATTRIBUTION_PROVENANCE_INCOMPLETE'] }) }
      for (const assessment of assessments) { const source = await lineage(env, assessment); const item = evidence(assessment, source, { reportId: unitId, entityId }, 'SCHOLARLY_INTERPRETATION'); findings.push({ key: `tradition:${unitId}:assessment:${idOf(assessment)}`, statement: `${text(value(assessment, 'assessmentScheme', 'assessment_scheme'))}: ${text(value(assessment, 'rawValue', 'raw_value'))}`, authorityClass: 'SCHOLARLY_INTERPRETATION', evidence: item ? [item] : [], unresolvedReasonCodes: item ? [] : ['ASSESSMENT_PROVENANCE_INCOMPLETE'] }) }
      for (const chain of chains) { const links = await WxTransmissionLink.fetch(WxTransmissionLink, env, [['chainId', '=', idOf(chain)], ['active', '=', true]], undefined, { limit: 500, order: 'sequence ASC' }); const source = await lineage(env, chain); const item = evidence(chain, source, { reportId: unitId, entityId }, 'TRANSMISSION_REPORT'); findings.push({ key: `tradition:${unitId}:chain:${idOf(chain)}`, statement: `${text(value(chain, 'chainType', 'chain_type'))} chain with ${links.length} ordered link(s).`, authorityClass: 'TRANSMISSION_REPORT', evidence: item ? [item] : [], unresolvedReasonCodes: item ? [] : ['CHAIN_PROVENANCE_INCOMPLETE'] }) }
      if (!findings.length) findings.push({ key: `tradition:${unitId}:context`, statement: `${text(value(corpus, 'traditionType', 'tradition_type')) || 'Tradition'} unit has no required chain or assessment; absence is preserved.`, authorityClass: 'TRANSMISSION_REPORT', unresolvedReasonCodes: ['NO_OPTIONAL_TRANSMISSION_DATA'] })
      return { summary: `${text(value(corpus, 'traditionType', 'tradition_type')) || 'Tradition'} unit ${text(value(unit, 'stableKey', 'stable_key'))} retained source-specific references, attributions, chains, and assessments.`, findings }
    },
    async explain(_ctx, output) { const finding = output.findings[0]; if (!finding) throw new Error('Tradition output has no findings'); return { findingKey: finding.key, evidence: finding.evidence, provenanceRefs: finding.provenanceRefs } satisfies EngineEvidenceExplanation }
  }
}

export type { EngineResultEnvelope, EngineScope }
