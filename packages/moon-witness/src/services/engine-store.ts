import { getDb, type Ctx } from '@moon/orm'
import { stableSerialize } from './hash.ts'
import WxEngineResult from '../models/wx-engine-result.ts'
import WxEngineRun from '../models/wx-engine-run.ts'
import type { EngineResultEnvelope, EngineRunRecord, EngineRunStore } from '../types/engine.ts'

function copy<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T
}

function stringValue(row: Record<string, unknown>, camel: string): string | undefined {
  const snake = camel.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`)
  const value = row[camel] ?? row[snake]
  return value == null ? undefined : String(value)
}

function parseJson<T>(value: string | undefined, field: string): T {
  if (!value) throw new Error(`Persisted engine record has no ${field}`)
  try {
    return JSON.parse(value) as T
  } catch {
    throw new Error(`Persisted engine record has invalid ${field}`)
  }
}

function recordFromRow(row: Record<string, unknown>): EngineRunRecord {
  const aiProvider = stringValue(row, 'aiProvider')
  return {
    id: String(row.id),
    runKey: stringValue(row, 'runKey')!,
    moduleCode: stringValue(row, 'moduleCode')!,
    moduleVersion: stringValue(row, 'moduleVersion')!,
    runtimeVersion: stringValue(row, 'runtimeVersion')!,
    inputSchemaVersion: stringValue(row, 'inputSchemaVersion')!,
    outputSchemaVersion: stringValue(row, 'outputSchemaVersion')!,
    deterministic: Boolean(row.deterministic),
    ai: aiProvider ? {
      provider: aiProvider,
      model: stringValue(row, 'aiModel'),
      version: stringValue(row, 'aiVersion'),
      configurationFingerprint: stringValue(row, 'aiConfigurationFingerprint')!
    } : undefined,
    input: parseJson(stringValue(row, 'normalizedInput'), 'normalizedInput'),
    inputChecksum: stringValue(row, 'inputChecksum')!,
    scope: parseJson(stringValue(row, 'normalizedScope'), 'normalizedScope'),
    scopeChecksum: stringValue(row, 'scopeChecksum')!,
    sourceRevisions: parseJson(stringValue(row, 'sourceRevisions'), 'sourceRevisions'),
    ontologyVersion: stringValue(row, 'ontologyVersion')!,
    identityChecksum: stringValue(row, 'identityChecksum')!,
    status: stringValue(row, 'status') as EngineRunRecord['status'],
    startedAt: stringValue(row, 'startedAt')!,
    completedAt: stringValue(row, 'completedAt'),
    outputChecksum: stringValue(row, 'outputChecksum'),
    parentRunId: stringValue(row, 'parentRunId'),
    rerunOfId: stringValue(row, 'rerunOfId'),
    failureCode: stringValue(row, 'failureCode'),
    failureDiagnostics: stringValue(row, 'failureDiagnostics')
  }
}

/** ORM-backed engine persistence. It intentionally accepts a normal Ctx, never a privileged read path. */
export class MoonOrmEngineRunStore implements EngineRunStore {
  readonly persistent = true
  async create(ctx: unknown, record: Omit<EngineRunRecord, 'id'>): Promise<EngineRunRecord> {
    const row = await WxEngineRun.spawn(WxEngineRun, ctx as Ctx, {
      runKey: record.runKey,
      name: `${record.moduleCode}@${record.moduleVersion}`,
      moduleCode: record.moduleCode,
      moduleVersion: record.moduleVersion,
      runtimeVersion: record.runtimeVersion,
      inputSchemaVersion: record.inputSchemaVersion,
      outputSchemaVersion: record.outputSchemaVersion,
      deterministic: record.deterministic,
      aiProvider: record.ai?.provider,
      aiModel: record.ai?.model,
      aiVersion: record.ai?.version,
      aiConfigurationFingerprint: record.ai?.configurationFingerprint,
      normalizedInput: stableSerialize(record.input),
      inputChecksum: record.inputChecksum,
      normalizedScope: stableSerialize(record.scope),
      scopeChecksum: record.scopeChecksum,
      sourceRevisions: stableSerialize(record.sourceRevisions),
      ontologyVersion: record.ontologyVersion,
      identityChecksum: record.identityChecksum,
      status: 'RUNNING',
      parentRunId: record.parentRunId ? Number(record.parentRunId) : undefined,
      rerunOfId: record.rerunOfId ? Number(record.rerunOfId) : undefined,
      startedAt: record.startedAt,
      active: true
    })
    return recordFromRow(row)
  }

  async complete(ctx: unknown, runId: string, result: EngineResultEnvelope, outputChecksum: string): Promise<void> {
    await this.inTransaction(ctx, async (transactionalCtx) => {
      const run = await this.getRun(transactionalCtx, runId)
      if (!run) throw new Error(`Engine run ${runId} was not found or is inaccessible`)
      if (run.status !== 'RUNNING') throw new Error(`Engine run ${runId} is immutable after ${run.status}`)
      const existing = await WxEngineResult.fetch(WxEngineResult, transactionalCtx, [['runId', '=', Number(runId)], ['active', '=', true]])
      if (existing.length) throw new Error(`Engine run ${runId} already has an immutable result`)
      await WxEngineResult.spawn(WxEngineResult, transactionalCtx, {
        resultKey: `result:${runId}`,
        runId: Number(runId),
        runKey: run.runKey,
        outputChecksum,
        summary: result.summary,
        normalizedResult: stableSerialize(result),
        findingsJson: stableSerialize(result.findings),
        conflictsJson: stableSerialize(result.conflicts),
        unresolvedJson: stableSerialize(result.unresolved),
        provenanceSummaryJson: stableSerialize(result.provenanceSummary),
        active: true
      })
      await WxEngineRun.morph(WxEngineRun, transactionalCtx, Number(runId), {
        status: 'COMPLETED',
        completedAt: new Date().toISOString(),
        outputChecksum
      })
    })
  }

  async fail(ctx: unknown, runId: string, code: string, diagnostics: string): Promise<void> {
    const run = await this.getRun(ctx, runId)
    if (!run) throw new Error(`Engine run ${runId} was not found or is inaccessible`)
    if (run.status !== 'RUNNING') return
    await WxEngineRun.morph(WxEngineRun, ctx as Ctx, Number(runId), {
      status: 'FAILED',
      completedAt: new Date().toISOString(),
      failureCode: code,
      failureDiagnostics: diagnostics
    })
  }

  async getRun(ctx: unknown, runId: string): Promise<EngineRunRecord | null> {
    const rows = await WxEngineRun.fetch(WxEngineRun, ctx as Ctx, [['id', '=', Number(runId)], ['active', '=', true]])
    return rows[0] ? recordFromRow(rows[0]) : null
  }

  async getResult(ctx: unknown, runId: string): Promise<EngineResultEnvelope | null> {
    const rows = await WxEngineResult.fetch(WxEngineResult, ctx as Ctx, [['runId', '=', Number(runId)], ['active', '=', true]])
    return rows[0] ? parseJson(stringValue(rows[0], 'normalizedResult'), 'normalizedResult') : null
  }

  private async inTransaction<T>(ctx: unknown, callback: (transactionalCtx: Ctx) => Promise<T>): Promise<T> {
    const current = ctx as Ctx
    if (current.trx) return callback(current)
    return getDb().transaction((trx) => callback({ ...current, trx }))
  }
}

/** Test and local fixture store. Production wiring must use MoonOrmEngineRunStore. */
export class InMemoryEngineRunStore implements EngineRunStore {
  readonly persistent = false
  private nextId = 1
  private readonly runs = new Map<string, EngineRunRecord>()
  private readonly results = new Map<string, EngineResultEnvelope>()

  async create(_ctx: unknown, record: Omit<EngineRunRecord, 'id'>): Promise<EngineRunRecord> {
    const id = String(this.nextId++)
    const created = copy({ ...record, id })
    this.runs.set(id, created)
    return copy(created)
  }

  async complete(_ctx: unknown, runId: string, result: EngineResultEnvelope, outputChecksum: string): Promise<void> {
    const run = this.runs.get(runId)
    if (!run) throw new Error(`Engine run ${runId} was not found`)
    if (run.status !== 'RUNNING' || this.results.has(runId)) throw new Error(`Engine run ${runId} is immutable after completion`)
    this.results.set(runId, copy(result))
    this.runs.set(runId, { ...run, status: 'COMPLETED', completedAt: new Date().toISOString(), outputChecksum })
  }

  async fail(_ctx: unknown, runId: string, code: string, diagnostics: string): Promise<void> {
    const run = this.runs.get(runId)
    if (!run) throw new Error(`Engine run ${runId} was not found`)
    if (run.status !== 'RUNNING') return
    this.runs.set(runId, { ...run, status: 'FAILED', completedAt: new Date().toISOString(), failureCode: code, failureDiagnostics: diagnostics })
  }

  async getRun(_ctx: unknown, runId: string): Promise<EngineRunRecord | null> {
    const run = this.runs.get(runId)
    return run ? copy(run) : null
  }

  async getResult(_ctx: unknown, runId: string): Promise<EngineResultEnvelope | null> {
    const result = this.results.get(runId)
    return result ? copy(result) : null
  }
}
