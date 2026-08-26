import type { Ctx } from '@moon/orm'
import WxContent from '../models/wx-content.js'
import WxDivineExpression from '../models/wx-divine-expression.js'
import WxEntity from '../models/wx-entity.js'
import WxLegacyMapping from '../models/wx-legacy-mapping.js'
import WxPassage from '../models/wx-passage.js'
import WxScripture from '../models/wx-scripture.js'
import WxTraditionAssessment from '../models/wx-tradition-assessment.js'
import WxTraditionAttribution from '../models/wx-tradition-attribution.js'
import WxTraditionCorpus from '../models/wx-tradition-corpus.js'
import WxTraditionUnit from '../models/wx-tradition-unit.js'
import type { LegacyMigrationOperation, LegacyMigrationPlan } from '../types/migration.js'

type Loose = Record<string, any>

export interface LegacyMigrationExecutionOptions {
  sourceId?: number
  provenanceId?: number
  dryRun?: boolean
  maxOperations?: number
}

export interface LegacyMigrationExecution {
  processed: number
  mapped: number
  skipped: number
  unresolved: number
  failed: number
  stale: number
  cursor: LegacyMigrationPlan['cursor']
}

class UnresolvedMigrationError extends Error {}

function idOf(row: Loose | null | undefined): number | null {
  const id = Number(row?.id)
  return Number.isInteger(id) && id > 0 ? id : null
}

function relationId(row: Loose | null | undefined, camel: string, snake: string = camel): number | null {
  const value = row?.[camel] ?? row?.[snake]
  const scalar = Array.isArray(value) ? value[0] : value
  const id = Number(scalar)
  return Number.isInteger(id) && id > 0 ? id : null
}

function fieldsOf(operation: LegacyMigrationOperation): Loose {
  return operation.fields as Loose
}

async function first(model: any, env: Ctx, domain: unknown[]): Promise<Loose | null> {
  const rows = await model.fetch(model, env, domain)
  return rows[0] ?? null
}

async function ensureEntity(env: Ctx, operation: LegacyMigrationOperation): Promise<number> {
  const values = fieldsOf(operation).entity as Loose | undefined
  if (!operation.targetCanonicalKey || !values) throw new Error(`Operation ${operation.operationKey} has no canonical entity payload`)
  const existing = await first(WxEntity, env, [['canonicalKey', '=', operation.targetCanonicalKey]])
  const entityValues = { ...values, canonicalKey: operation.targetCanonicalKey, active: true }
  if (existing) {
    await WxEntity.morph(WxEntity, env, idOf(existing)!, entityValues)
    return idOf(existing)!
  }
  const created = await WxEntity.spawn(WxEntity, env, entityValues)
  const entityId = idOf(created)
  if (!entityId) throw new Error(`Failed to create canonical entity ${operation.targetCanonicalKey}`)
  return entityId
}

async function targetIdForCanonical(env: Ctx, canonicalKey: string, targetModel: string): Promise<number | null> {
  const entity = await first(WxEntity, env, [['canonicalKey', '=', canonicalKey], ['active', '=', true]])
  const entityId = idOf(entity)
  if (!entityId) return null
  const model = targetModel === 'wx.passage'
    ? WxPassage
    : targetModel === 'wx.tradition.corpus'
      ? WxTraditionCorpus
      : targetModel === 'wx.tradition.unit'
        ? WxTraditionUnit
        : targetModel === 'wx.scripture'
          ? WxScripture
          : null
  if (!model) return entityId
  const row = await first(model, env, [['entityId', '=', entityId], ['active', '=', true]])
  return idOf(row)
}

async function resolveDependency(env: Ctx, operation: LegacyMigrationOperation, model: string): Promise<number> {
  if (!operation.parentCanonicalKey) throw new UnresolvedMigrationError(`Operation ${operation.operationKey} has no parent identity`)
  const targetId = await targetIdForCanonical(env, operation.parentCanonicalKey, model)
  if (!targetId) throw new UnresolvedMigrationError(`Parent ${operation.parentCanonicalKey} is not migrated yet`)
  return targetId
}

async function applyOperation(env: Ctx, operation: LegacyMigrationOperation, options: LegacyMigrationExecutionOptions): Promise<{ targetRecordId?: number; targetEntityId?: number }> {
  const fields = fieldsOf(operation)
  if (operation.targetModel === 'legacy.retained') return {}

  if (operation.targetModel === 'wx.scripture') {
    const entityId = await ensureEntity(env, operation)
    const recordId = Number(operation.sourceRecordId)
    if (!Number.isInteger(recordId) || recordId < 1) throw new Error('Legacy scripture id must be a positive integer')
    const legacy = await first(WxScripture, env, [['id', '=', recordId]])
    if (!legacy) throw new Error(`Legacy scripture ${recordId} no longer exists`)
    await WxScripture.morph(WxScripture, env, recordId, { entityId, canonicalCode: fields.canonicalCode, active: true })
    return { targetRecordId: recordId, targetEntityId: entityId }
  }

  if (operation.targetModel === 'wx.passage') {
    const entityId = await ensureEntity(env, operation)
    const scriptureId = Number(fields.scriptureLegacyId)
    if (!Number.isInteger(scriptureId) || scriptureId < 1) throw new UnresolvedMigrationError('Passage has no valid legacy scripture parent')
    const isBook = fields.passageType === 'BOOK'
    if (isBook && operation.parentCanonicalKey) await resolveDependency(env, operation, 'wx.scripture')
    const parentId = operation.parentCanonicalKey && !isBook ? await resolveDependency(env, operation, 'wx.passage') : null
    const values = {
      entityId,
      scriptureId,
      parentId: parentId ?? undefined,
      passageType: fields.passageType,
      sequence: fields.sequence,
      localNumber: fields.localNumber,
      canonicalReference: fields.canonicalReference,
      sourceRevision: operation.sourceChecksum.slice(0, 16),
      active: true
    }
    const existing = await first(WxPassage, env, [['entityId', '=', entityId], ['active', '=', true]])
    if (existing) {
      await WxPassage.morph(WxPassage, env, idOf(existing)!, values)
      return { targetRecordId: idOf(existing)!, targetEntityId: entityId }
    }
    const created = await WxPassage.spawn(WxPassage, env, values)
    return { targetRecordId: idOf(created)!, targetEntityId: entityId }
  }

  if (operation.targetModel === 'wx.content') {
    const passageId = await resolveDependency(env, operation, 'wx.passage')
    const created = await WxContent.spawn(WxContent, env, {
      passageId,
      contentType: fields.contentType,
      languageCode: fields.languageCode,
      text: fields.text,
      revision: fields.revision,
      status: fields.status,
      active: true
    })
    return { targetRecordId: idOf(created)! }
  }

  if (operation.targetModel === 'wx.tradition.corpus') {
    const entityId = await ensureEntity(env, operation)
    const values = { ...fields, entity: undefined, active: true }
    delete values.entity
    const existing = await first(WxTraditionCorpus, env, [['entityId', '=', entityId], ['active', '=', true]])
    if (existing) {
      await WxTraditionCorpus.morph(WxTraditionCorpus, env, idOf(existing)!, { ...values, entityId })
      return { targetRecordId: idOf(existing)!, targetEntityId: entityId }
    }
    const created = await WxTraditionCorpus.spawn(WxTraditionCorpus, env, { ...values, entityId })
    return { targetRecordId: idOf(created)!, targetEntityId: entityId }
  }

  if (operation.targetModel === 'wx.tradition.unit') {
    const entityId = await ensureEntity(env, operation)
    const corpusId = await resolveDependency(env, operation, 'wx.tradition.corpus')
    const values = {
      entityId,
      corpusId,
      unitType: fields.unitType,
      stableKey: fields.stableKey,
      sequence: fields.sequence,
      status: 'PROVISIONAL',
      active: true
    }
    const existing = await first(WxTraditionUnit, env, [['entityId', '=', entityId], ['active', '=', true]])
    if (existing) {
      await WxTraditionUnit.morph(WxTraditionUnit, env, idOf(existing)!, values)
      return { targetRecordId: idOf(existing)!, targetEntityId: entityId }
    }
    const created = await WxTraditionUnit.spawn(WxTraditionUnit, env, values)
    return { targetRecordId: idOf(created)!, targetEntityId: entityId }
  }

  if (operation.targetModel === 'wx.tradition.attribution' || operation.targetModel === 'wx.tradition.assessment') {
    if (!options.provenanceId) throw new UnresolvedMigrationError('Legacy attribution/assessment requires explicit provenanceId')
    const unitId = await resolveDependency(env, operation, 'wx.tradition.unit')
    if (operation.targetModel === 'wx.tradition.attribution') {
      const created = await WxTraditionAttribution.spawn(WxTraditionAttribution, env, {
        unitId,
        rawFigureName: fields.rawFigureName,
        roleCode: fields.roleCode,
        sourceId: options.sourceId,
        provenanceId: options.provenanceId,
        status: 'UNRESOLVED',
        active: true
      })
      return { targetRecordId: idOf(created)! }
    }
    const created = await WxTraditionAssessment.spawn(WxTraditionAssessment, env, {
      traditionUnitId: unitId,
      assessmentScheme: fields.assessmentScheme,
      rawValue: fields.rawValue,
      normalizedCategory: fields.normalizedCategory,
      sourceReference: fields.sourceReference,
      authoritySourceId: options.sourceId,
      provenanceId: options.provenanceId,
      status: 'PROVISIONAL',
      active: true
    })
    return { targetRecordId: idOf(created)! }
  }

  if (operation.targetModel === 'wx.divine.expression') {
    if (!options.sourceId || !options.provenanceId) throw new UnresolvedMigrationError('Legacy expression requires explicit sourceId and provenanceId')
    const entityId = await ensureEntity(env, operation)
    const created = await WxDivineExpression.spawn(WxDivineExpression, env, {
      entityId,
      languageCode: fields.languageCode,
      lexicalForm: fields.lexicalForm,
      expressionType: fields.expressionType,
      sourceId: options.sourceId,
      provenanceId: options.provenanceId,
      status: 'PROVISIONAL',
      active: true
    })
    return { targetRecordId: idOf(created)!, targetEntityId: entityId }
  }

  throw new Error(`Unsupported legacy migration target ${operation.targetModel}`)
}

async function saveMapping(env: Ctx, operation: LegacyMigrationOperation, status: string, target: { targetRecordId?: number; targetEntityId?: number } = {}, warning?: string): Promise<void> {
  const values = {
    mappingKey: operation.mappingKey,
    sourceModel: operation.sourceModel,
    sourceRecordId: operation.sourceRecordId,
    sourceChecksum: operation.sourceChecksum,
    adapterVersion: operation.adapterVersion,
    targetModel: operation.targetModel,
    targetRecordId: target.targetRecordId,
    targetEntityId: target.targetEntityId,
    status,
    warning: warning ?? operation.warning,
    processedAt: new Date().toISOString(),
    active: true
  }
  const existing = await first(WxLegacyMapping, env, [['mappingKey', '=', operation.mappingKey]])
  if (existing) await WxLegacyMapping.morph(WxLegacyMapping, env, idOf(existing)!, values)
  else await WxLegacyMapping.spawn(WxLegacyMapping, env, values)
}

async function markSourceDrift(env: Ctx, operation: LegacyMigrationOperation): Promise<number> {
  const rows = await WxLegacyMapping.fetch(WxLegacyMapping, env, [
    ['sourceModel', '=', operation.sourceModel],
    ['sourceRecordId', '=', operation.sourceRecordId],
    ['adapterVersion', '=', operation.adapterVersion],
    ['active', '=', true]
  ])
  let count = 0
  for (const row of rows) {
    if (row.mapping_key === operation.mappingKey || row.source_checksum === operation.sourceChecksum) continue
    if (String(row.status ?? row.status) === 'STALE') continue
    await WxLegacyMapping.morph(WxLegacyMapping, env, idOf(row)!, { status: 'STALE', warning: 'A newer legacy source checksum superseded this mapping.' })
    count += 1
  }
  return count
}

/** Apply a plan one operation at a time so a failed record is resumable and auditable. */
export async function executeLegacyMigration(
  env: Ctx,
  plan: LegacyMigrationPlan,
  options: LegacyMigrationExecutionOptions = {}
): Promise<LegacyMigrationExecution> {
  const operations = options.maxOperations && options.maxOperations > 0
    ? plan.operations.slice(0, Math.floor(options.maxOperations))
    : plan.operations
  const result: LegacyMigrationExecution = { processed: 0, mapped: 0, skipped: 0, unresolved: 0, failed: 0, stale: 0, cursor: null }

  if (options.dryRun) {
    for (const operation of operations) {
      result.processed += 1
      if (operation.status === 'READY') result.mapped += 1
      if (operation.status === 'SKIPPED') result.skipped += 1
      if (operation.status === 'UNRESOLVED') result.unresolved += 1
      result.cursor = { model: operation.sourceModel, sourceRecordId: operation.sourceRecordId }
    }
    return result
  }

  for (const operation of operations) {
    result.processed += 1
    result.cursor = { model: operation.sourceModel, sourceRecordId: operation.sourceRecordId }
    result.stale += await markSourceDrift(env, operation)
    const existing = await first(WxLegacyMapping, env, [['mappingKey', '=', operation.mappingKey]])
    const existingStatus = String(existing?.status ?? existing?.status ?? '')
    if (existing && (existingStatus === 'MAPPED' || existingStatus === 'SKIPPED')) {
      result.skipped += 1
      continue
    }
    if (operation.status === 'SKIPPED') {
      await saveMapping(env, operation, 'SKIPPED')
      result.skipped += 1
      continue
    }
    try {
      const target = await WxLegacyMapping.transaction(env, async (transactionEnv) => {
        const created = await applyOperation(transactionEnv, operation, options)
        await saveMapping(transactionEnv, operation, 'MAPPED', created)
        return created
      })
      void target
      result.mapped += 1
    } catch (error: any) {
      const message = error instanceof Error ? error.message : String(error)
      const unresolved = error instanceof UnresolvedMigrationError
      await saveMapping(env, operation, unresolved ? 'UNRESOLVED' : 'FAILED', {}, message)
      if (unresolved) result.unresolved += 1
      else result.failed += 1
    }
  }
  return result
}
