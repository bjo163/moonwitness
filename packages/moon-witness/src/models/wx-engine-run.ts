import { Vertex, fields, type Ctx } from '@moon/orm'

const ENGINE_RUN_STATUS_SELECTION: Array<[string, string]> = [
  ['RUNNING', 'Running'],
  ['COMPLETED', 'Completed'],
  ['FAILED', 'Failed']
]

/** Immutable execution lineage; only operational completion metadata may change. */
export default class WxEngineRun extends Vertex {
  static _name = 'wx.engine.run'
  static _description = 'Witness Engine Versioned Run'

  runKey = fields.Char({ required: true, unique: true, size: 300, index: true })
  // Moon ORM relation hydration uses this display field for self-references.
  name = fields.Char({ required: true, size: 240, index: true })
  moduleCode = fields.Char({ required: true, size: 160, index: true })
  moduleVersion = fields.Char({ required: true, size: 80, index: true })
  runtimeVersion = fields.Char({ required: true, size: 80, index: true })
  inputSchemaVersion = fields.Char({ required: true, size: 120 })
  outputSchemaVersion = fields.Char({ required: true, size: 120 })
  deterministic = fields.Boolean({ required: true, default: true, index: true })
  aiProvider = fields.Char({ size: 160 })
  aiModel = fields.Char({ size: 160 })
  aiVersion = fields.Char({ size: 120 })
  aiConfigurationFingerprint = fields.Char({ size: 128 })
  normalizedInput = fields.Text({ required: true })
  inputChecksum = fields.Char({ required: true, size: 64, index: true })
  normalizedScope = fields.Text({ required: true })
  scopeChecksum = fields.Char({ required: true, size: 64, index: true })
  sourceRevisions = fields.Text({ required: true })
  ontologyVersion = fields.Char({ required: true, size: 120, index: true })
  identityChecksum = fields.Char({ required: true, size: 64, index: true })
  status = fields.Selection({ selection: ENGINE_RUN_STATUS_SELECTION, required: true, default: 'RUNNING', index: true })
  outputChecksum = fields.Char({ size: 64, index: true })
  parentRunId = fields.Many2one({ comodel: 'wx.engine.run', index: true })
  rerunOfId = fields.Many2one({ comodel: 'wx.engine.run', index: true })
  startedAt = fields.DateTime({ required: true, index: true })
  completedAt = fields.DateTime({ index: true })
  failureCode = fields.Char({ size: 120, index: true })
  failureDiagnostics = fields.Text()
  active = fields.Boolean({ default: true, index: true })

  static async beforeSave(
    _modelClass: typeof Vertex,
    env: Ctx,
    values: Record<string, unknown>,
    id?: number
  ): Promise<void> {
    if (!id) {
      if (values.status && values.status !== 'RUNNING') throw new Error('Witness Engine runs must begin in RUNNING status')
      return
    }
    const operationalFields = new Set(['status', 'completedAt', 'outputChecksum', 'failureCode', 'failureDiagnostics', 'updatedAt'])
    const changedImmutableField = Object.keys(values).find((field) => !operationalFields.has(field))
    if (changedImmutableField) throw new Error(`Witness Engine run ${id} is immutable: ${changedImmutableField}`)
    const [current] = await WxEngineRun.fetch(WxEngineRun, env, [['id', '=', id], ['active', '=', true]])
    if (!current || String(current.status) !== 'RUNNING') throw new Error(`Witness Engine run ${id} is immutable after completion`)
    const nextStatus = String(values.status ?? '')
    if (!['COMPLETED', 'FAILED'].includes(nextStatus)) {
      throw new Error('Witness Engine run status can only transition from RUNNING to COMPLETED or FAILED')
    }
    if (nextStatus === 'COMPLETED' && (!values.outputChecksum || !values.completedAt)) {
      throw new Error('Completed Witness Engine runs require outputChecksum and completedAt')
    }
    if (nextStatus === 'FAILED' && (!values.failureCode || !values.failureDiagnostics || !values.completedAt)) {
      throw new Error('Failed Witness Engine runs require sanitized failure diagnostics and completedAt')
    }
  }
}
