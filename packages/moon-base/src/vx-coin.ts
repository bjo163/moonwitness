import { Vertex, fields } from '@moon/orm'

export default class VxCoin extends Vertex {
  static override _name = 'vx.coin'
  static override _description = 'Currency'

  name = fields.Char({ required: true, size: 80 })
  symbol = fields.Char({ required: true, size: 10 })
  code = fields.Char({ required: true, size: 3, unique: true, index: true })
  numberCode = fields.Char({ size: 3 })
  decimals = fields.Integer({ default: 2 })
  rounding = fields.Float({ default: 0.01 })
  active = fields.Boolean({ default: true, index: true })
}
