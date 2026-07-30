import { Vertex } from '@moon/orm'
import { fields } from '@moon/orm'

export default class VxUser extends Vertex {
  static _name = 'vx.user'
  static _description = 'App User'
  static _inherits = { 'vx.node': 'partnerId' }

  partnerId = fields.Many2one({ comodel: 'vx.node', required: true })
  password = fields.Char({ required: true })
  companyId = fields.Many2one({ comodel: 'vx.org' })
  groupsId = fields.Many2many({ comodel: 'vx.role' })
}
