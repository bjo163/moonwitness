import { BaseModel } from '../../base.js'
import { fields } from '../../fields.js'

export default class Partner extends BaseModel {
  static _name = 'res.partner'
  static _description = 'Partner'

  name = fields.Char({ required: true, size: 120 })
  email = fields.Char({ unique: true })
  phone = fields.Char({ size: 40 })
  mobile = fields.Char({ size: 40 })
  street = fields.Char({ size: 120 })
  street2 = fields.Char({ size: 120 })
  city = fields.Char({ size: 80 })
  zip = fields.Char({ size: 20 })
  countryId = fields.Many2one({ comodel: 'res.country' })
  companyId = fields.Many2one({ comodel: 'res.company' })
  parentId = fields.Many2one({ comodel: 'res.partner' })
  isCompany = fields.Boolean({ default: false })
}
