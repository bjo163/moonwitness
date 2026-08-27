import { Vertex, fields } from '@moon/orm'

export default class IrVersion extends Vertex {
  static override _name = 'ir.version'
  static override _description = 'Record Mutation Diff & Audit Trail'
  static override _rec_name = 'summary'

  resModel = fields.Char({ required: true, size: 120, index: true })
  resId = fields.Integer({ required: true, index: true })
  userId = fields.Many2one({ comodel: 'vx.user', help: 'Operator who performed mutation' })
  summary = fields.Char({ size: 250, default: 'Record updated' })
  changedFields = fields.Text({ help: 'Comma-separated list of modified field names' })
  oldValues = fields.Text({ help: 'JSON snapshot of previous field values' })
  newValues = fields.Text({ help: 'JSON snapshot of updated field values' })
}
