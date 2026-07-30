import { Vertex } from '@moon/orm'
import { fields } from '@moon/orm'

export default class VxRole extends Vertex {
  static _name = 'vx.role'
  static _description = 'Access Groups'

  name = fields.Char({ required: true })
  users = fields.Many2many({ comodel: 'vx.user' })
}
