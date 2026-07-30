import { BaseModel } from '../../base.js'
import { fields } from '../../fields.js'

export default class Currency extends BaseModel {
  static _name = 'res.currency'
  static _description = 'Currency'

  name = fields.Char({ required: true, size: 80 })
  symbol = fields.Char({ required: true, size: 10 })
  code = fields.Char({ required: true, size: 3, unique: true })
}
