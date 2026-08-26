import { Vertex, fields } from '@moon/orm'

export default class AccountAccount extends Vertex {
  static override _name = 'account.account'
  static override _description = 'Chart of Accounts'

  code = fields.Char({ required: true, size: 64, index: true })
  name = fields.Char({ required: true, size: 120 })
  accountType = fields.Selection({
    selection: [
      ['asset_receivable', 'Receivable'],
      ['asset_cash', 'Bank and Cash'],
      ['asset_current', 'Current Assets'],
      ['asset_non_current', 'Non-current Assets'],
      ['liability_payable', 'Payable'],
      ['liability_current', 'Current Liabilities'],
      ['liability_non_current', 'Non-current Liabilities'],
      ['equity', 'Equity'],
      ['income', 'Income'],
      ['expense', 'Expense']
    ],
    default: 'income'
  })
  currencyId = fields.Many2one({ comodel: 'vx.coin' })
  companyId = fields.Many2one({ comodel: 'vx.org' })
}
