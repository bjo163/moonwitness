import { Vertex, fields } from '@moon/orm'

export default class AccountMove extends Vertex {
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
}
