import { Vertex, fields } from '@moon/orm'

export default class AccountJournal extends Vertex {
  static override _name = 'account.journal'
  static override _description = 'Financial Journal'

  name = fields.Char({ required: true, size: 80 })
  code = fields.Char({ required: true, size: 10, index: true })
  type = fields.Selection({
    selection: [
      ['sale', 'Sales'],
      ['purchase', 'Purchase'],
      ['cash', 'Cash'],
      ['bank', 'Bank'],
      ['general', 'Miscellaneous']
    ],
    default: 'general'
  })
  companyId = fields.Many2one({ comodel: 'vx.org' })
}
