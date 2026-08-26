import type { Ctx } from '@moon/orm'
import WxAssertion from '../models/wx-assertion.js'
import WxEvidence from '../models/wx-evidence.js'
import WxProvenance from '../models/wx-provenance.js'
import WxResearchHypothesis from '../models/wx-research-hypothesis.js'
import WxSource from '../models/wx-source.js'
import type { Loose } from '../graph/service.js'
import type { EngineEvidenceExplanation, EngineResultDraft, EngineScopeInput, EngineValidationResult, WitnessEngineModule } from '../types/engine.js'

export interface ResearchHypothesisInput { hypothesisId: number; predicate?: string; assertionClass?: string; algorithmVersion: string; filters?: Record<string, string> }
function value(row: Loose | null | undefined, camel: string, snake = camel): any { return row?.[camel] ?? row?.[snake] }
function idOf(row: Loose | null | undefined): number { return Number(value(row, 'id') ?? 0) }
function text(raw: unknown): string { return typeof raw === 'string' ? raw.trim() : '' }
function foreignId(row: Loose | null | undefined, camel: string, snake: string): number { const raw = value(row, camel, snake); return Number(Array.isArray(raw) ? raw[0] : raw ?? 0) }

export function validateResearchHypothesisInput(input: ResearchHypothesisInput): EngineValidationResult {
  if (!input || typeof input !== 'object' || !Number.isSafeInteger(input.hypothesisId) || input.hypothesisId < 1) return { ok: false, errors: ['hypothesisId must be a positive integer'] }
  if (!text(input.algorithmVersion)) return { ok: false, errors: ['algorithmVersion is required'] }
  return { ok: true }
}

export function createResearchHypothesisModule(): WitnessEngineModule<ResearchHypothesisInput> {
  return {
    code: 'research.hypothesis', version: '1.0.0', deterministic: true, inputSchemaVersion: 'RESEARCH_HYPOTHESIS_INPUT_V1', outputSchemaVersion: 'WITNESS_ENGINE_RESULT_V1', validateInput: validateResearchHypothesisInput,
    async resolveScope(ctx, input) { return { relationCodes: input.predicate ? [input.predicate] : [] } satisfies EngineScopeInput },
    async execute(ctx, input) {
      const env = ctx as Ctx
      const hypothesis = (await WxResearchHypothesis.fetch(WxResearchHypothesis, env, [['id', '=', input.hypothesisId], ['active', '=', true]]))[0] ?? null
      if (!hypothesis) return { summary: 'No accessible research hypothesis matched the request.', findings: [{ key: 'research:unresolved', statement: 'Research hypothesis was not found.', authorityClass: 'HYPOTHESIS', unresolvedReasonCodes: ['HYPOTHESIS_NOT_FOUND'] }] }
      const assertions = (await WxAssertion.fetch(WxAssertion, env, [['active', '=', true]], undefined, { limit: 500, order: 'id ASC' })).filter((item) => (!input.predicate || text(value(item, 'predicate')) === input.predicate) && (!input.assertionClass || text(value(item, 'assertionClass', 'assertion_class')) === input.assertionClass))
      let supports = 0; let contradicts = 0; let ambiguous = 0; const findings: EngineResultDraft['findings'] = []; const evidenceCandidates: any[] = []
      for (const assertion of assertions) {
        const evidence = await WxEvidence.fetch(WxEvidence, env, [['assertionId', '=', idOf(assertion)], ['active', '=', true]], undefined, { limit: 100, order: 'id ASC' })
        for (const item of evidence) {
          const relation = text(value(item, 'relation')).toUpperCase(); if (relation === 'SUPPORTS') supports++; else if (relation === 'CONTRADICTS') contradicts++; else ambiguous++
          const provenance = (await WxProvenance.fetch(WxProvenance, env, [['id', '=', foreignId(item, 'provenanceId', 'provenance_id')], ['active', '=', true], ['superseded', '=', false]]))[0] ?? null
          const sourceId = foreignId(assertion, 'sourceId', 'source_id') || foreignId(provenance, 'sourceId', 'source_id')
          const source = sourceId ? (await WxSource.fetch(WxSource, env, [['id', '=', sourceId], ['active', '=', true]]))[0] ?? null : null
          const revision = text(value(provenance, 'sourceRevision', 'source_revision')) || text(value(source, 'revision'))
          if (provenance && source && revision) evidenceCandidates.push({ evidenceKey: `research-evidence:${idOf(item)}`, relation, authorityClass: 'SOURCE_SUMMARY', sourceRevision: revision, provenanceRef: text(value(provenance, 'stableKey', 'stable_key')) || `provenance:${idOf(provenance)}`, entityId: foreignId(item, 'evidenceEntityId', 'evidence_entity_id') || foreignId(assertion, 'subjectEntityId', 'subject_entity_id') })
        }
        findings.push({ key: `research:${input.hypothesisId}:assertion:${idOf(assertion)}`, statement: `Research observation: ${text(value(assertion, 'predicate'))}.`, authorityClass: 'DERIVED', predicate: text(value(assertion, 'predicate')), objectValue: text(value(assertion, 'objectValue', 'object_value')) || undefined, evidence: evidenceCandidates.filter((candidate) => candidate.evidenceKey.startsWith(`research-evidence:`)), unresolvedReasonCodes: evidence.length ? [] : ['ASSERTION_EVIDENCE_MISSING'] })
      }
      const denominator = supports + contradicts + ambiguous
      const status = !denominator ? 'INSUFFICIENT_EVIDENCE' : supports && contradicts ? 'CONFLICTED' : 'PROVISIONAL'
      findings.unshift({ key: `research:${input.hypothesisId}:summary`, statement: `${text(value(hypothesis, 'title'))}: supports=${supports}, contradicts=${contradicts}, ambiguous=${ambiguous}, denominator=${denominator}.`, authorityClass: 'HYPOTHESIS', status, evidence: evidenceCandidates, score: { algorithmVersion: input.algorithmVersion, components: [{ code: 'EVIDENCE_COVERAGE', algorithmVersion: input.algorithmVersion, valueBp: denominator ? Math.round(((supports + contradicts + ambiguous) / denominator) * 10000) : undefined, evidenceRefs: evidenceCandidates.map((item) => item.evidenceKey), state: denominator ? 'AVAILABLE' : 'INSUFFICIENT' }] }, unresolvedReasonCodes: denominator ? [] : ['RESEARCH_EVIDENCE_INSUFFICIENT'] })
      return { summary: `Research hypothesis ${text(value(hypothesis, 'stableKey', 'stable_key'))} used transparent evidence counts; conclusions remain non-canonical.`, findings, diagnostics: [`supports:${supports}`, `contradicts:${contradicts}`, `ambiguous:${ambiguous}`, `denominator:${denominator}`] }
    },
    async explain(_ctx, output) { const finding = output.findings[0]; if (!finding) throw new Error('Research output has no findings'); return { findingKey: finding.key, evidence: finding.evidence, provenanceRefs: finding.provenanceRefs, narrative: 'Research results are derived or hypothesis-class findings; they never promote conclusions to Revelation authority.' } satisfies EngineEvidenceExplanation }
  }
}
