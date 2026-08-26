import { Vertex, fields } from '@moon/orm'

export default class VxZone extends Vertex {
  static override _name = 'vx.zone'
  static override _description = 'Country'

  name = fields.Char({ required: true, size: 120 })
  nativeName = fields.Char({ size: 120 })
  code = fields.Char({ required: true, size: 2, unique: true, index: true })
  code3 = fields.Char({ size: 3, unique: true, index: true })
  numberCode = fields.Char({ size: 3 })
  continent = fields.Char({ size: 40 })
  capital = fields.Char({ size: 80 })
  dialCode = fields.Char({ size: 20 })
  flagEmoji = fields.Char({ size: 10 })
  currencyCode = fields.Char({ size: 3 })
  lat = fields.Float()
  lng = fields.Float()
  active = fields.Boolean({ default: true, index: true })
}
