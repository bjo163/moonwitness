import { describe, expect, it } from 'vitest'
import { checksumEngineResult } from '../src/services/engine-evidence.ts'
import { InMemoryEngineRunStore } from '../src/services/engine-store.ts'
import { WitnessEngineRegistry, WitnessEngineRuntime } from '../src/services/engine-runtime.ts'
import type { EngineEvidenceCandidate, WitnessEngineModule } from '../src/types/engine.ts'

const ctx = { actor: 'test-user' }

function evidence(overrides: Partial<EngineEvidenceCandidate> = {}): EngineEvidenceCandidate {
  return {
    evidenceKey: 'evidence:quran:2:255',
    relation: 'SUPPORTS',
    authorityClass: 'PRIMARY_SOURCE',
    sourceFamily: 'QURAN',
    sourceRevision: 'quran-r1',
    provenanceRef: 'provenance:quran:2:255:r1',
    passageId: 255,
    contentId: 1,
    contentType: 'ORIGINAL_TEXT',
    ...overrides
  }
}

function fixtureModule(overrides: Partial<WitnessEngineModule> = {}): WitnessEngineModule {
  return {
    code: 'fixture.witness',
    version: '1.0.0',
    deterministic: true,
    inputSchemaVersion: 'FIXTURE_INPUT_V1',
    outputSchemaVersion: 'FIXTURE_OUTPUT_V1',
    validateInput(input) {
      return input && typeof input === 'object' && (input as { valid?: boolean }).valid !== false
        ? { ok: true }
        : { ok: false, errors: ['fixture input is invalid'] }
    },
    async resolveScope(_ctx, input) {
      const revision = (input as { revision?: string }).revision ?? 'quran-r1'
      return { sourceRevisions: [{ sourceKey: 'corpus:quran', revision, family: 'QURAN', authorityClass: 'PRIMARY_SOURCE' }] }
    },
    async execute(_ctx, input) {
      const revision = (input as { revision?: string }).revision ?? 'quran-r1'
      return {
        summary: 'fixture summary',
        findings: [{
          key: 'fixture:finding',
          statement: 'Fixture statement',
          authorityClass: 'PRIMARY_SOURCE',
          status: 'ESTABLISHED',
          evidence: [evidence({ sourceRevision: revision })]
        }]
      }
    },
    async explain(_ctx, output) {
      const finding = output.findings[0]
      return { findingKey: finding.key, evidence: finding.evidence, provenanceRefs: finding.provenanceRefs, narrative: 'fixture explanation' }
    },
    ...overrides
  }
}

function runtime(module: WitnessEngineModule = fixtureModule(), options: ConstructorParameters<typeof WitnessEngineRuntime>[1] = {}) {
  const registry = new WitnessEngineRegistry()
  registry.register(module)
  return { store: new InMemoryEngineRunStore(), registry, options }
}

function configuredRuntime(module: WitnessEngineModule = fixtureModule(), options: ConstructorParameters<typeof WitnessEngineRuntime>[1] = {}) {
  const setup = runtime(module, options)
  return { ...setup, runtime: new WitnessEngineRuntime(setup.store, { registry: setup.registry, ...options }) }
}

describe('Witness Engine runtime (#57)', () => {
  it('requires a stable module code, semantic version, and explicit schema metadata', () => {
    const registry = new WitnessEngineRegistry()
    expect(() => registry.register(fixtureModule({ version: 'current' }))).toThrow(/semantic/)
    expect(() => registry.register(fixtureModule({ code: 'Bad Module' }))).toThrow(/code is invalid/)
    expect(() => registry.register(fixtureModule({ inputSchemaVersion: '' }))).toThrow(/inputSchemaVersion/)
    expect(() => registry.register(fixtureModule({ deterministic: false }))).toThrow(/must declare aiAssisted/)
  })

  it('rejects invalid input before a module executes', async () => {
    const { runtime } = configuredRuntime()
    await expect(runtime.runModule(ctx, {
      moduleCode: 'fixture.witness', moduleVersion: '1.0.0', input: { valid: false }
    })).rejects.toThrow(/input rejected/)
  })

  it('uses the fixed normative Revelation-family scope and bounded traversal defaults', () => {
    const { runtime } = configuredRuntime()
    expect(runtime.validateScope({})).toMatchObject({
      scriptureFamilies: ['QURAN', 'TAWRAT', 'ZABUR', 'INJIL'],
      authorityClasses: ['PRIMARY_SOURCE'],
      includeHadith: false,
      includeDerivedAssertions: false,
      traversal: { maxDepth: 2, maxNodes: 100 }
    })
    expect(() => runtime.validateScope({ traversal: { maxNodes: 501 } })).toThrow(/maxNodes/)
  })

  it('does not permit a translation to be emitted as a primary source', async () => {
    const module = fixtureModule({
      async execute() {
        return {
          summary: 'translation',
          findings: [{ statement: 'Translated text', authorityClass: 'PRIMARY_SOURCE', evidence: [evidence({ contentType: 'TRANSLATION' })] }]
        }
      }
    })
    const { runtime } = configuredRuntime(module)
    const result = await runtime.runModule(ctx, { moduleCode: module.code, moduleVersion: module.version, input: {} })
    expect(result.findings[0].authorityClass).toBe('TRANSLATION')
  })

  it('does not permit a transmission report to be emitted as a Revelation primary source', async () => {
    const module = fixtureModule({
      async execute() {
        return {
          summary: 'report',
          findings: [{ statement: 'Reported wording', authorityClass: 'PRIMARY_SOURCE', evidence: [evidence({ reportId: 90 })] }]
        }
      }
    })
    const { runtime } = configuredRuntime(module)
    const result = await runtime.runModule(ctx, { moduleCode: module.code, moduleVersion: module.version, input: {} })
    expect(result.findings[0].authorityClass).toBe('TRANSMISSION_REPORT')
  })

  it('returns missing evidence as unresolved instead of accepting the finding', async () => {
    const module = fixtureModule({
      async execute() {
        return { summary: 'unresolved', findings: [{ statement: 'Unsupported claim', authorityClass: 'PRIMARY_SOURCE' }] }
      }
    })
    const { runtime } = configuredRuntime(module)
    const result = await runtime.runModule(ctx, { moduleCode: module.code, moduleVersion: module.version, input: {} })
    expect(result.findings[0].status).toBe('INSUFFICIENT_EVIDENCE')
    expect(result.unresolved).toContainEqual(expect.objectContaining({ code: 'EVIDENCE_MISSING' }))
  })

  it('retains contradictory evidence as a conflict', async () => {
    const module = fixtureModule({
      async execute() {
        return {
          summary: 'conflict',
          findings: [{ statement: 'Disputed claim', evidence: [evidence(), evidence({ evidenceKey: 'evidence:counter', relation: 'CONTRADICTS' })] }]
        }
      }
    })
    const { runtime } = configuredRuntime(module)
    const result = await runtime.runModule(ctx, { moduleCode: module.code, moduleVersion: module.version, input: {} })
    expect(result.findings[0].status).toBe('CONFLICTED')
    expect(result.conflicts).toEqual([expect.objectContaining({ reason: 'CONTRADICTORY_EVIDENCE' })])
  })

  it('makes deterministic checksums reproducible and changes run identity when corpus revision changes', async () => {
    const { runtime } = configuredRuntime()
    const first = await runtime.runModule(ctx, { moduleCode: 'fixture.witness', moduleVersion: '1.0.0', input: {} })
    const second = await runtime.runModule(ctx, { moduleCode: 'fixture.witness', moduleVersion: '1.0.0', input: {} })
    const changed = await runtime.runModule(ctx, { moduleCode: 'fixture.witness', moduleVersion: '1.0.0', input: { revision: 'quran-r2' } })
    expect(checksumEngineResult(first)).toBe(checksumEngineResult(second))
    expect(checksumEngineResult(first)).not.toBe(checksumEngineResult(changed))
    const [firstRun, changedRun] = await Promise.all([runtime.getRun(ctx, first.runId), runtime.getRun(ctx, changed.runId)])
    expect(firstRun?.identityChecksum).not.toBe(changedRun?.identityChecksum)
  })

  it('keeps historical results immutable and replays only against verified revisions', async () => {
    const verified: string[][] = []
    const { runtime, store } = configuredRuntime(fixtureModule(), {
      revisionResolver: {
        async verify(_ctx, required) {
          verified.push(required.map((item) => `${item.sourceKey}@${item.revision}`))
          return { missing: [] }
        }
      }
    })
    const original = await runtime.runModule(ctx, { moduleCode: 'fixture.witness', moduleVersion: '1.0.0', input: {} })
    await expect(store.complete(ctx, original.runId, original, checksumEngineResult(original))).rejects.toThrow(/immutable/)
    const replay = await runtime.replayRun(ctx, original.runId)
    const replayRun = await runtime.getRun(ctx, replay.runId)
    expect(verified).toEqual([['corpus:quran@quran-r1']])
    expect(replayRun).toMatchObject({ parentRunId: original.runId, rerunOfId: original.runId })
    expect(checksumEngineResult(replay)).toBe(checksumEngineResult(original))
  })

  it('forces every AI-assisted module finding to remain AI-assisted and provides its evidence explanation', async () => {
    const module = fixtureModule({
      code: 'fixture.ai',
      deterministic: false,
      aiAssisted: true,
      async execute() {
        return { summary: 'ai candidate', findings: [{ statement: 'AI proposal', authorityClass: 'PRIMARY_SOURCE', status: 'ESTABLISHED', evidence: [evidence()] }] }
      }
    })
    const { runtime } = configuredRuntime(module)
    const result = await runtime.runModule(ctx, {
      moduleCode: module.code,
      moduleVersion: module.version,
      input: {},
      ai: { provider: 'fixture-ai', model: 'test', configurationFingerprint: 'fixture-config-v1' }
    })
    expect(result.findings[0]).toMatchObject({ authorityClass: 'AI_ASSISTED', status: 'PROVISIONAL' })
    await expect(runtime.explainFinding(ctx, result.runId, result.findings[0].key)).resolves.toMatchObject({
      findingKey: result.findings[0].key,
      provenanceRefs: ['provenance:quran:2:255:r1']
    })
  })
})
