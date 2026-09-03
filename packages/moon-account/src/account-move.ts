import { Vertex, fields, type Ctx } from '@moon/orm'
import { guardEntryMutation } from './account-write-guards.js'

export default class AccountMove extends Vertex {
  static override beforeSave(_model: typeof Vertex, env: Ctx, vals: Record<string, unknown>, id?: number) {
    return guardEntryMutation(env, vals, id)
  }
  static override beforeDelete(_model: typeof Vertex, env: Ctx, id: number) {
    return guardEntryMutation(env, {}, id)
  }
  static override _name = 'account.move'
  static override _description = 'Journal Entry'

  name = fields.Char({ required: true, default: '/', size: 80, index: true })
  date = fields.Date({ required: true, index: true })
  journalId = fields.Many2one({ comodel: 'account.journal', required: true })
  companyId = fields.Many2one({ comodel: 'vx.org' })
  state = fields.Selection({
    selection: [
      ['draft', 'Draft'],
      ['posted', 'Posted'],
      ['cancel', 'Cancelled']
    ],
    default: 'draft'
  })
  lineIds = fields.One2many({ comodel: 'account.move.line', inverse: 'moveId' })
  currencyCode = fields.Char({ size: 3 })
  decimalPrecision = fields.Integer({ default: 28, min: 1, max: 38 })
  decimalScale = fields.Integer({ default: 2, min: 0, max: 12 })
  idempotencyKey = fields.Char({ size: 128 })
  fingerprint = fields.Char({ size: 64 })
  postedAt = fields.DateTime()
  postedBy = fields.Many2one({ comodel: 'vx.user' })
  reversalOf = fields.Many2one({ comodel: 'account.move' })
  reversalReason = fields.Text()
}
