import { Vertex } from '@moon/orm'
import { fields } from '@moon/orm'

export default class VxNode extends Vertex {
  static _name = 'vx.node'
  static _description = 'Partner'

  name = fields.Char({ required: true, size: 120 })
  email = fields.Char({ unique: true })
  phone = fields.Char({ size: 40 })
  mobile = fields.Char({ size: 40 })
  street = fields.Char({ size: 120 })
  street2 = fields.Char({ size: 120 })
  city = fields.Char({ size: 80 })
  zip = fields.Char({ size: 20 })
  countryId = fields.Many2one({ comodel: 'vx.zone' })
  companyId = fields.Many2one({ comodel: 'vx.org' })
  parentId = fields.Many2one({ comodel: 'vx.node' })
  isCompany = fields.Boolean({ default: false })
}
