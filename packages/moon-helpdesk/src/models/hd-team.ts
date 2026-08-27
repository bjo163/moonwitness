import { Vertex, fields } from '@moon/orm'

export default class HdTeam extends Vertex {
  static _name = 'hd.team'
  static _description = 'Helpdesk Support Team'

  name = fields.Char({ required: true, size: 120, index: true })
  code = fields.Char({ required: true, size: 32, unique: true, index: true })
  leaderId = fields.Many2one({ comodel: 'vx.user', index: true })
  description = fields.Text()
  memberIds = fields.Many2many({ comodel: 'vx.user', relation: 'hd_team_member_rel' })
}
