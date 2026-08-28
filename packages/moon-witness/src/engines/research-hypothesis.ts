import type { Ctx } from '@moon/orm'
import WxAssertion from '../models/wx-assertion.js'
import WxEvidence from '../models/wx-evidence.js'
import WxProvenance from '../models/wx-provenance.js'
import WxResearchHypothesis from '../models/wx-research-hypothesis.js'
import WxResearchRun from '../models/wx-research-run.js'
import WxSource from '../models/wx-source.js'
import { stableSerialize } from '../services/hash.js'
import type { Loose } from '../graph/service.js'
import type { EngineEvidenceExplanation, EngineResultDraft, EngineRunRecord, EngineScopeInput, EngineValidationResult, RevelationFamily, WitnessEngineModule } from '../types/engine.js'

export interface ResearchHypothesisInput { hypothesisId: number; predicate?: string; assertionClass?: string; algorithmVersion: string; filters?: Record<string, string> }
const REVISION_FAMILIES = new Set(['QURAN', 'TAWRAT', 'ZABUR', 'INJIL'])
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
    async resolveScope(ctx, input) {
      const sources = await WxSource.fetch(WxSource, ctx as Ctx, [['active', '=', true]], undefined, { limit: 500, order: 'id ASC' })
      const sourceRevisions = sources
        .map((source) => {
          const sourceKey = text(value(source, 'stableKey', 'stable_key'))
          const revision = text(value(source, 'revision'))
          if (!sourceKey || !revision) return null
          const family = text(value(source, 'scriptureFamily', 'scripture_family')).toUpperCase()
          return { sourceKey, revision, ...(REVISION_FAMILIES.has(family) ? { family } : {}) }
        })
        .filter((item): item is { sourceKey: string; revision: string; family?: RevelationFamily } => Boolean(item))
      return { relationCodes: input.predicate ? [input.predicate] : [], sourceRevisions } satisfies EngineScopeInput
    },
    async execute(ctx, input) {
      const env = ctx as Ctx
      const hypothesis = (await WxResearchHypothesis.fetch(WxResearchHypothesis, env, [['id', '=', input.hypothesisId], ['active', '=', true]]))[0] ?? null
      if (!hypothesis) return { summary: 'No accessible research hypothesis matched the request.', findings: [{ key: 'research:unresolved', statement: 'Research hypothesis was not found.', authorityClass: 'HYPOTHESIS', unresolvedReasonCodes: ['HYPOTHESIS_NOT_FOUND'] }] }
      const assertions = (await WxAssertion.fetch(WxAssertion, env, [['active', '=', true]], undefined, { limit: 500, order: 'id ASC' })).filter((item) => {
        if (input.predicate && text(value(item, 'predicate')) !== input.predicate) return false
        if (input.assertionClass && text(value(item, 'assertionClass', 'assertion_class')) !== input.assertionClass) return false
        return Object.entries(input.filters ?? {}).every(([key, expected]) => text(value(item, key, key.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`))) === text(expected))
      })
      let supports = 0; let contradicts = 0; let ambiguous = 0; const findings: EngineResultDraft['findings'] = []; const evidenceCandidates: any[] = []
      for (const assertion of assertions) {
        const assertionEvidence: any[] = []
        const evidence = await WxEvidence.fetch(WxEvidence, env, [['assertionId', '=', idOf(assertion)], ['active', '=', true]], undefined, { limit: 100, order: 'id ASC' })
        for (const item of evidence) {
          const relation = text(value(item, 'relation')).toUpperCase(); if (relation === 'SUPPORTS') supports++; else if (relation === 'CONTRADICTS') contradicts++; else ambiguous++
          const provenance = (await WxProvenance.fetch(WxProvenance, env, [['id', '=', foreignId(item, 'provenanceId', 'provenance_id')], ['active', '=', true], ['superseded', '=', false]]))[0] ?? null
          const sourceId = foreignId(assertion, 'sourceId', 'source_id') || foreignId(provenance, 'sourceId', 'source_id')
          const source = sourceId ? (await WxSource.fetch(WxSource, env, [['id', '=', sourceId], ['active', '=', true]]))[0] ?? null : null
          const revision = text(value(provenance, 'sourceRevision', 'source_revision')) || text(value(source, 'revision'))
          if (provenance && source && revision) {
            const candidate = { evidenceKey: `research-evidence:${idOf(item)}`, relation, authorityClass: 'SOURCE_SUMMARY' as const, sourceRevision: revision, provenanceRef: text(value(provenance, 'stableKey', 'stable_key')) || `provenance:${idOf(provenance)}`, entityId: foreignId(item, 'evidenceEntityId', 'evidence_entity_id') || foreignId(assertion, 'subjectEntityId', 'subject_entity_id') }
            evidenceCandidates.push(candidate)
            assertionEvidence.push(candidate)
          }
        }
        findings.push({ key: `research:${input.hypothesisId}:assertion:${idOf(assertion)}`, statement: `Research observation: ${text(value(assertion, 'predicate'))}.`, authorityClass: 'DERIVED', predicate: text(value(assertion, 'predicate')), objectValue: text(value(assertion, 'objectValue', 'object_value')) || undefined, evidence: assertionEvidence, unresolvedReasonCodes: evidence.length ? [] : ['ASSERTION_EVIDENCE_MISSING'] })
      }
      const denominator = supports + contradicts + ambiguous
      const status = !denominator ? 'INSUFFICIENT_EVIDENCE' : supports && contradicts ? 'CONFLICTED' : 'PROVISIONAL'
      findings.unshift({ key: `research:${input.hypothesisId}:summary`, statement: `${text(value(hypothesis, 'title'))}: supports=${supports}, contradicts=${contradicts}, ambiguous=${ambiguous}, denominator=${denominator}.`, authorityClass: 'HYPOTHESIS', status, evidence: evidenceCandidates, score: { algorithmVersion: input.algorithmVersion, components: [{ code: 'EVIDENCE_COVERAGE', algorithmVersion: input.algorithmVersion, valueBp: denominator ? Math.round(((supports + contradicts + ambiguous) / denominator) * 10000) : undefined, evidenceRefs: evidenceCandidates.map((item) => item.evidenceKey), state: denominator ? 'AVAILABLE' : 'INSUFFICIENT' }] }, unresolvedReasonCodes: denominator ? [] : ['RESEARCH_EVIDENCE_INSUFFICIENT'] })
      return { summary: `Research hypothesis ${text(value(hypothesis, 'stableKey', 'stable_key'))} used transparent evidence counts; conclusions remain non-canonical.`, findings, diagnostics: [`supports:${supports}`, `contradicts:${contradicts}`, `ambiguous:${ambiguous}`, `denominator:${denominator}`] }
    },
    async explain(_ctx, output) { const finding = output.findings[0]; if (!finding) throw new Error('Research output has no findings'); return { findingKey: finding.key, evidence: finding.evidence, provenanceRefs: finding.provenanceRefs, narrative: 'Research results are derived or hypothesis-class findings; they never promote conclusions to Revelation authority.' } satisfies EngineEvidenceExplanation },
    async afterComplete(ctx, input, run: EngineRunRecord, output, outputChecksum) {
      const report = [
        `Research hypothesis run: ${run.runKey}`,
        `Question: ${input.predicate ?? 'all supported observations'}`,
        `Method: ${input.algorithmVersion}`,
        `Source revisions: ${stableSerialize(run.sourceRevisions)}`,
        `Summary: ${output.summary}`,
        `Findings: ${output.findings.length}`,
        `Conflicts: ${output.conflicts.length}`,
        `Unresolved: ${output.unresolved.length}`,
        'Authority: conclusions remain DERIVED/HYPOTHESIS and are never canonical Revelation.'
      ].join('\n')
      await WxResearchRun.spawn(WxResearchRun, ctx as Ctx, {
        runKey: `research:${run.runKey}`, hypothesisId: input.hypothesisId, engineRunId: Number(run.id), corpusRevisions: stableSerialize(run.sourceRevisions), selectionCriteria: stableSerialize(input.filters ?? {}), methodParameters: stableSerialize({ predicate: input.predicate, assertionClass: input.assertionClass }), algorithmVersion: input.algorithmVersion, deterministic: run.deterministic, aiConfigurationFingerprint: run.ai?.configurationFingerprint, evidenceIdentity: stableSerialize(output.findings.flatMap((finding) => finding.evidence.map((item) => item.evidenceKey)).sort()), conflictCount: output.conflicts.length, unresolvedCount: output.unresolved.length, outputChecksum, researchReport: report, createdAt: new Date().toISOString(), active: true
      })
    }
  }
}

/** AI may synthesize candidate research prose only; it cannot create canonical graph facts. */
export function createAiResearchSynthesisModule(): WitnessEngineModule<ResearchHypothesisInput> {
  const deterministic = createResearchHypothesisModule()
  return {
    ...deterministic,
    code: 'research.hypothesis.ai', version: '1.0.0', deterministic: false, aiAssisted: true,
    async execute(ctx, input, scope) {
      const draft = await deterministic.execute(ctx, input, scope)
      return { ...draft, summary: `${draft.summary} AI synthesis remains a candidate research artifact.`, findings: draft.findings.map((finding) => ({ ...finding, authorityClass: 'AI_ASSISTED', status: 'PROVISIONAL' })) }
    },
    async afterComplete(ctx, input, run, output, checksum) {
      await deterministic.afterComplete?.(ctx, input, run, output, checksum)
    }
  }
}
