import { Vertex, fields } from '@moon/orm'

export default class AccountMoveLine extends Vertex {
  static override _name = 'account.move.line'
  static override _description = 'Journal Item'

  moveId = fields.Many2one({ comodel: 'account.move', required: true, index: true })
  accountId = fields.Many2one({ comodel: 'account.account', required: true, index: true })
  partnerId = fields.Many2one({ comodel: 'vx.node' })
  name = fields.Char({ size: 255 })
  debit = fields.Float({ default: 0.0 })
  credit = fields.Float({ default: 0.0 })
  balance = fields.Float({ default: 0.0, compute: (row: any) => (Number(row.debit) || 0) - (Number(row.credit) || 0), store: true })
  companyId = fields.Many2one({ comodel: 'vx.org' })
}
