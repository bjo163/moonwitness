import { Vertex, fields, type Ctx } from '@moon/orm'

/** Immutable historical score result; composites are never stored without their vector. */
export default class WxScoreResult extends Vertex {
  static _name = 'wx.score.result'
  static _description = 'Witness Versioned Score Result'
  resultKey = fields.Char({ required: true, unique: true, size: 300, index: true })
  profileCode = fields.Char({ required: true, size: 160, index: true })
  profileVersion = fields.Char({ required: true, size: 80, index: true })
  targetEntityId = fields.Many2one({ comodel: 'wx.entity', index: true })
  targetRelationId = fields.Many2one({ comodel: 'wx.relation', index: true })
  targetAssertionId = fields.Many2one({ comodel: 'wx.assertion', index: true })
  findingKey = fields.Char({ size: 240, index: true })
  dimensionsJson = fields.Text({ required: true })
  compositeBp = fields.Integer({ min: 0, max: 10000 })
  coverageBp = fields.Integer({ required: true, min: 0, max: 10000 })
  status = fields.Char({ required: true, size: 40, index: true })
  evidenceIdsJson = fields.Text({ required: true })
  sourceRevisionFingerprint = fields.Char({ required: true, size: 64, index: true })
  formulaFingerprint = fields.Char({ required: true, size: 64, index: true })
  createdAt = fields.DateTime({ required: true, index: true })
  active = fields.Boolean({ default: true, index: true })

  static async beforeSave(_model: typeof Vertex, _env: Ctx, _values: Record<string, unknown>, id?: number): Promise<void> {
    if (id) throw new Error(`Score result ${id} is immutable; create a new profile/version result`)
  }
}
