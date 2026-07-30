import { Vertex } from '@moon/orm'
import { fields } from '@moon/orm'

export default class VxOrg extends Vertex {
  static _name = 'vx.org'
  static _description = 'Company'

  partnerId = fields.Many2one({ comodel: 'vx.node' })
  name = fields.Char({ required: true, size: 120 })
  email = fields.Char()
  phone = fields.Char({ size: 40 })
  website = fields.Char({ size: 120 })
  currencyId = fields.Many2one({ comodel: 'vx.coin' })
}
