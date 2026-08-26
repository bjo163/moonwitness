import { Vertex, fields, type Ctx } from '@moon/orm'

const HYPOTHESIS_STATUS: Array<[string, string]> = [['DRAFT', 'Draft'], ['TESTING', 'Testing'], ['SUPPORTED', 'Supported'], ['MIXED', 'Mixed'], ['INSUFFICIENT', 'Insufficient'], ['REJECTED', 'Rejected'], ['SUPERSEDED', 'Superseded']]

/** Immutable identity and versioned scope for a non-canonical research hypothesis. */
export default class WxResearchHypothesis extends Vertex {
  static _name = 'wx.research.hypothesis'
  static _description = 'Witness Research Hypothesis'
  stableKey = fields.Char({ required: true, unique: true, size: 220, index: true })
  title = fields.Char({ required: true, size: 240, index: true })
  statement = fields.Text({ required: true })
  hypothesisClass = fields.Char({ required: true, size: 120, index: true })
  owner = fields.Char({ size: 180, index: true })
  status = fields.Selection({ selection: HYPOTHESIS_STATUS, required: true, default: 'DRAFT', index: true })
  methodVersion = fields.Char({ required: true, size: 120, index: true })
  scopeDefinition = fields.Text({ required: true })
  supersedesId = fields.Many2one({ comodel: 'wx.research.hypothesis', index: true })
  createdAt = fields.DateTime({ required: true, index: true })
  active = fields.Boolean({ default: true, index: true })

  static async beforeSave(_model: typeof Vertex, _env: Ctx, _values: Record<string, unknown>, id?: number): Promise<void> {
    if (id) throw new Error(`Research hypothesis ${id} is immutable; create a superseding hypothesis version instead`)
  }
}
