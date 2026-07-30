import { Vertex } from '@moon/orm'
import { fields } from '@moon/orm'

export default class VxZone extends Vertex {
  static _name = 'vx.zone'
  static _description = 'Country'

  name = fields.Char({ required: true, size: 80 })
  code = fields.Char({ size: 10, unique: true })
}
