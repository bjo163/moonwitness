import { Vertex, fields, subtractDecimal, type Ctx } from '@moon/orm'
import { guardLineMutation } from './account-write-guards.js'

const amount = { precision: 38, scale: 12 }

export default class AccountMoveLine extends Vertex {
  static override beforeSave(_model: typeof Vertex, env: Ctx, vals: Record<string, unknown>, id?: number) {
    return guardLineMutation(env, vals, id)
  }
  static override beforeDelete(_model: typeof Vertex, env: Ctx, id: number) {
    return guardLineMutation(env, {}, id)
  }
  static override _name = 'account.move.line'
  static override _description = 'Journal Item'

  moveId = fields.Many2one({ comodel: 'account.move', required: true, index: true })
  accountId = fields.Many2one({ comodel: 'account.account', required: true, index: true })
  partnerId = fields.Many2one({ comodel: 'vx.node' })
  name = fields.Char({ size: 255 })
  debit = fields.Decimal({ ...amount, default: '0' })
  credit = fields.Decimal({ ...amount, default: '0' })
  balance = fields.Decimal({ ...amount, default: '0', compute: (row: any) => subtractDecimal(row.debit ?? '0', row.credit ?? '0', amount), store: true })
  companyId = fields.Many2one({ comodel: 'vx.org' })
}
