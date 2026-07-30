import { BaseModel } from '../../base.js'
import { fields } from '../../fields.js'

export default class Country extends BaseModel {
  static _name = 'res.country'
  static _description = 'Country'

  name = fields.Char({ required: true, size: 80 })
  code = fields.Char({ size: 10, unique: true })
}
