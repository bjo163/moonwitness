import { Vertex } from '@moon/orm'
import { fields } from '@moon/orm'

export default class MxModel extends Vertex {
  static _name = 'mx.model'
  static _description = 'Models'

  model = fields.Char({ required: true, unique: true })
  name = fields.Char({ required: true })
}
