import { BaseModel } from '../../base.js'
import { fields } from '../../fields.js'

export default class User extends BaseModel {
  static _name = 'res.user'
  static _description = 'App User'

  name = fields.Char({ required: true, size: 120 })
  email = fields.Char({ unique: true })
  password = fields.Char({ required: true, size: 255 })
  partnerId = fields.Many2one({ comodel: 'res.partner' })
}
