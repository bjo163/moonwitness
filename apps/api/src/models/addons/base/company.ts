import { BaseModel } from '../../base.js'
import { fields } from '../../fields.js'

export default class Company extends BaseModel {
  static _name = 'res.company'
  static _description = 'Company'

  partnerId = fields.Many2one({ comodel: 'res.partner' })
  name = fields.Char({ required: true, size: 120 })
  email = fields.Char()
  phone = fields.Char({ size: 40 })
  website = fields.Char({ size: 120 })
  currencyId = fields.Many2one({ comodel: 'res.currency' })
}
