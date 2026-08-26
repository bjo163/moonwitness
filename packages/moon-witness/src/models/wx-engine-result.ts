import { Vertex, fields, type Ctx } from '@moon/orm'

/** One immutable normalized result envelope per Witness Engine execution. */
export default class WxEngineResult extends Vertex {
  static _name = 'wx.engine.result'
  static _description = 'Witness Engine Immutable Result'

  resultKey = fields.Char({ required: true, unique: true, size: 180, index: true })
  runId = fields.Many2one({ comodel: 'wx.engine.run', required: true, index: true })
  runKey = fields.Char({ required: true, unique: true, size: 300, index: true })
  outputChecksum = fields.Char({ required: true, size: 64, index: true })
  summary = fields.Text({ required: true })
  normalizedResult = fields.Text({ required: true })
  findingsJson = fields.Text({ required: true })
  conflictsJson = fields.Text({ required: true })
  unresolvedJson = fields.Text({ required: true })
  provenanceSummaryJson = fields.Text({ required: true })
  active = fields.Boolean({ default: true, index: true })

  static async beforeSave(
    _modelClass: typeof Vertex,
    env: Ctx,
    values: Record<string, unknown>,
    id?: number
  ): Promise<void> {
    if (id) throw new Error(`Witness Engine result ${id} is immutable`)
    const runId = Number(values.runId)
    if (!Number.isSafeInteger(runId) || runId < 1) throw new Error('Witness Engine result requires a valid runId')
    const existing = await WxEngineResult.fetch(WxEngineResult, env, [['runId', '=', runId], ['active', '=', true]])
    if (existing.length) throw new Error(`Witness Engine run ${runId} already has an immutable result`)
  }
}
