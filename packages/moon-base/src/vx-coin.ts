import { Vertex } from '@moon/orm'
import { fields } from '@moon/orm'

export default class VxCoin extends Vertex {
  static _name = 'vx.coin'
  static _description = 'Currency'

  name = fields.Char({ required: true, size: 80 })
  symbol = fields.Char({ required: true, size: 10 })
  code = fields.Char({ required: true, size: 3, unique: true })
}
