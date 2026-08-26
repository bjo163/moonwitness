import { sha256String, stableSerialize } from './hash.js'
import { checksumEngineResult, finalizeEngineResult } from './engine-evidence.js'
import { checksumEngineScope, resolveEngineScope } from './engine-scope.js'
import WxScoreResult from '../models/wx-score-result.js'
import {
  WITNESS_ENGINE_RUNTIME_VERSION,
  type EngineEvidenceExplanation,
  type EngineReplayAvailability,
  type EngineResultEnvelope,
  type EngineRunRecord,
  type EngineRunRequest,
  type EngineRunStore,
  type EngineScope,
  type EngineScopeInput,
  type EngineSourceRevision,
  type WitnessEngineModule
} from '../types/engine.js'

const SEMVER = /^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?(?:\+[0-9A-Za-z.-]+)?$/
const CODE = /^[a-z][a-z0-9._-]{1,79}$/

function moduleKey(code: string, version: string): string {
  return `${code}@${version}`
}

function requireText(value: string, label: string): void {
  if (!value?.trim()) throw new Error(`Witness Engine module ${label} is required`)
}

function sanitizeFailure(error: unknown): { code: string; diagnostics: string } {
  const raw = error instanceof Error ? error.message : 'Unknown engine execution failure'
  const diagnostics = raw
    .replace(/\b(?:authorization|bearer|token|password|secret|api[-_]?key)\s*[:=]\s*[^\s,;]+/gi, '$1=[redacted]')
    .replace(/[\r\n\t]+/g, ' ')
    .slice(0, 1000)
  return { code: 'ENGINE_EXECUTION_FAILED', diagnostics }
}

export class WitnessEngineRegistry {
  private readonly modules = new Map<string, WitnessEngineModule>()

  register(module: WitnessEngineModule): void {
    requireText(module.code, 'code')
    requireText(module.version, 'version')
    requireText(module.inputSchemaVersion, 'inputSchemaVersion')
    requireText(module.outputSchemaVersion, 'outputSchemaVersion')
    if (!CODE.test(module.code)) throw new Error(`Witness Engine module code is invalid: ${module.code}`)
    if (!SEMVER.test(module.version)) throw new Error(`Witness Engine module version must be semantic: ${module.version}`)
    if (module.aiAssisted === true && module.deterministic) throw new Error(`AI-assisted module ${module.code} must be non-deterministic`)
    if (module.deterministic === false && module.aiAssisted !== true) throw new Error(`Non-deterministic module ${module.code} must declare aiAssisted`)
    const key = moduleKey(module.code, module.version)
    if (this.modules.has(key)) throw new Error(`Witness Engine module already registered: ${key}`)
    this.modules.set(key, module)
  }

  get(code: string, version: string): WitnessEngineModule | null {
    return this.modules.get(moduleKey(code, version)) ?? null
  }

  require(code: string, version: string): WitnessEngineModule {
    const module = this.get(code, version)
    if (!module) throw new Error(`Witness Engine module is not registered: ${moduleKey(code, version)}`)
    return module
  }

  list(): Array<Pick<WitnessEngineModule, 'code' | 'version' | 'deterministic' | 'aiAssisted' | 'inputSchemaVersion' | 'outputSchemaVersion'>> {
    return [...this.modules.values()]
      .map(({ code, version, deterministic, aiAssisted, inputSchemaVersion, outputSchemaVersion }) => ({ code, version, deterministic, aiAssisted, inputSchemaVersion, outputSchemaVersion }))
      .sort((left, right) => moduleKey(left.code, left.version).localeCompare(moduleKey(right.code, right.version)))
  }
}

export interface WitnessEngineRuntimeOptions {
  registry?: WitnessEngineRegistry
  revisionResolver?: { verify(ctx: unknown, required: EngineSourceRevision[]): Promise<EngineReplayAvailability> }
  runtimeVersion?: string
  ontologyVersion?: string
}

interface RunLineage {
  parentRunId?: string
  rerunOfId?: string
}

/**
 * Runtime-owned domain API. Callers supply a normal Moon ORM context through
 * their persistence adapter; this class never creates a SUPERUSER context.
 */
export class WitnessEngineRuntime {
  readonly registry: WitnessEngineRegistry
  private readonly revisionResolver?: WitnessEngineRuntimeOptions['revisionResolver']
  private readonly runtimeVersion: string
  private readonly ontologyVersion: string
  private runSequence = 0

  constructor(private readonly store: EngineRunStore, options: WitnessEngineRuntimeOptions = {}) {
    this.registry = options.registry ?? new WitnessEngineRegistry()
    this.revisionResolver = options.revisionResolver
    this.runtimeVersion = options.runtimeVersion ?? WITNESS_ENGINE_RUNTIME_VERSION
    this.ontologyVersion = options.ontologyVersion ?? 'WITNESS_RELATION_V1'
  }

  listModules() {
    return this.registry.list()
  }

  validateScope(input: EngineScopeInput): EngineScope {
    return resolveEngineScope(input)
  }

  async runModule(ctx: unknown, request: EngineRunRequest): Promise<EngineResultEnvelope> {
    const module = this.registry.require(request.moduleCode, request.moduleVersion)
    this.validateRequest(module, request)
    const validation = module.validateInput(request.input)
    if (!validation?.ok) throw new Error(`Engine input rejected: ${(validation?.errors ?? ['module validation failed']).join('; ')}`)
    const scope = resolveEngineScope(await module.resolveScope(ctx, request.input))
    return this.execute(ctx, module, request, scope, {})
  }

  async getRun(ctx: unknown, runId: string): Promise<EngineRunRecord | null> {
    return this.store.getRun(ctx, runId)
  }

  async replayRun(ctx: unknown, runId: string): Promise<EngineResultEnvelope> {
    const historicalRun = await this.store.getRun(ctx, runId)
    if (!historicalRun) throw new Error(`Engine run ${runId} was not found or is inaccessible`)
    if (!historicalRun.deterministic) throw new Error(`REPRODUCIBILITY_NONDETERMINISTIC_RUN: ${runId}`)
    const module = this.registry.get(historicalRun.moduleCode, historicalRun.moduleVersion)
    if (!module) throw new Error(`REPRODUCIBILITY_MODULE_UNAVAILABLE: ${historicalRun.moduleCode}@${historicalRun.moduleVersion}`)
    if (!this.revisionResolver) throw new Error('REPRODUCIBILITY_REVISION_RESOLVER_REQUIRED')
    const availability = await this.revisionResolver.verify(ctx, historicalRun.sourceRevisions)
    if (availability.missing.length) {
      const missing = availability.missing.map((item) => `${item.sourceKey}@${item.revision}`).join(', ')
      throw new Error(`REPRODUCIBILITY_MISSING_REVISIONS: ${missing}`)
    }
    return this.execute(ctx, module, {
      moduleCode: historicalRun.moduleCode,
      moduleVersion: historicalRun.moduleVersion,
      input: historicalRun.input
    }, historicalRun.scope, { parentRunId: historicalRun.id, rerunOfId: historicalRun.id })
  }

  async explainFinding(ctx: unknown, runId: string, findingKey: string): Promise<EngineEvidenceExplanation> {
    const [run, result] = await Promise.all([this.store.getRun(ctx, runId), this.store.getResult(ctx, runId)])
    if (!run || !result) throw new Error(`Engine result ${runId} was not found or is inaccessible`)
    if (!result.findings.some((finding) => finding.key === findingKey)) throw new Error(`Engine finding ${findingKey} was not found in run ${runId}`)
    const module = this.registry.get(run.moduleCode, run.moduleVersion)
    if (!module) throw new Error(`Engine module unavailable for explanation: ${moduleKey(run.moduleCode, run.moduleVersion)}`)
    const explanation = await module.explain(ctx, result, run.scope)
    if (explanation.findingKey !== findingKey) throw new Error(`Module explanation did not return requested finding ${findingKey}`)
    return explanation
  }

  private validateRequest(module: WitnessEngineModule, request: EngineRunRequest): void {
    if (module.aiAssisted && !request.ai) throw new Error(`AI-assisted module ${module.code} requires provider metadata`)
    if (!module.aiAssisted && request.ai) throw new Error(`Deterministic module ${module.code} cannot receive AI provider metadata`)
    if (request.ai) {
      requireText(request.ai.provider, 'AI provider')
      requireText(request.ai.configurationFingerprint, 'AI configurationFingerprint')
    }
  }

  private async execute(
    ctx: unknown,
    module: WitnessEngineModule,
    request: EngineRunRequest,
    scope: EngineScope,
    lineage: RunLineage
  ): Promise<EngineResultEnvelope> {
    const inputChecksum = sha256String(stableSerialize(request.input))
    const scopeChecksum = checksumEngineScope(scope)
    const identityChecksum = sha256String(stableSerialize({
      moduleCode: module.code,
      moduleVersion: module.version,
      runtimeVersion: this.runtimeVersion,
      inputSchemaVersion: module.inputSchemaVersion,
      outputSchemaVersion: module.outputSchemaVersion,
      inputChecksum,
      scopeChecksum,
      sourceRevisions: scope.sourceRevisions,
      ontologyVersion: this.ontologyVersion,
      deterministic: module.deterministic,
      aiConfigurationFingerprint: request.ai?.configurationFingerprint
    }))
    const startedAt = new Date().toISOString()
    const run = await this.store.create(ctx, {
      runKey: `${module.code}:${identityChecksum.slice(0, 24)}:${startedAt.replace(/[^0-9]/g, '')}:${++this.runSequence}`,
      moduleCode: module.code,
      moduleVersion: module.version,
      runtimeVersion: this.runtimeVersion,
      inputSchemaVersion: module.inputSchemaVersion,
      outputSchemaVersion: module.outputSchemaVersion,
      deterministic: module.deterministic,
      ai: request.ai,
      input: request.input,
      inputChecksum,
      scope,
      scopeChecksum,
      sourceRevisions: scope.sourceRevisions,
      ontologyVersion: this.ontologyVersion,
      identityChecksum,
      status: 'RUNNING',
      startedAt,
      ...lineage
    })

    try {
      const draft = await module.execute(ctx, request.input, scope)
      const result = finalizeEngineResult(draft, {
        runId: run.id,
        module: { code: module.code, version: module.version },
        scope,
        aiAssisted: module.aiAssisted === true
      })
      const outputChecksum = checksumEngineResult(result)
      await this.store.complete(ctx, run.id, result, outputChecksum)
      if (this.store.persistent) await this.persistFindingScores(ctx, run, result, outputChecksum)
      if (this.store.persistent) await module.afterComplete?.(ctx, request.input, run, result, outputChecksum)
      return result
    } catch (error) {
      const failure = sanitizeFailure(error)
      await this.store.fail(ctx, run.id, failure.code, failure.diagnostics)
      throw error
    }
  }

  private async persistFindingScores(ctx: unknown, run: EngineRunRecord, result: EngineResultEnvelope, outputChecksum: string): Promise<void> {
    const sourceRevisionFingerprint = sha256String(stableSerialize(result.sourceRevisions))
    for (const finding of result.findings) {
      if (!finding.score) continue
      const score = finding.score
      await WxScoreResult.spawn(WxScoreResult, ctx as any, {
        resultKey: `score:finding:${sha256String(stableSerialize({ run: run.id, finding: finding.key, score }))}`,
        profileCode: score.profileCode ?? run.moduleCode,
        profileVersion: score.profileVersion ?? score.algorithmVersion,
        targetEntityId: finding.subjectEntityId,
        findingKey: finding.key,
        dimensionsJson: stableSerialize(score.components),
        compositeBp: score.compositeBp,
        coverageBp: score.coverageBp ?? 0,
        status: finding.status,
        evidenceIdsJson: stableSerialize(finding.evidence.map((item) => item.evidenceKey)),
        sourceRevisionFingerprint,
        formulaFingerprint: score.formulaFingerprint ?? outputChecksum,
        createdAt: new Date().toISOString(),
        active: true
      })
    }
  }
}
