import { Vertex, fields } from '@moon/orm'

export default class CrmTeam extends Vertex {
  static override _name = 'crm.team'
  static override _description = 'Sales Team'

  name = fields.Char({ required: true, size: 80 })
  userId = fields.Many2one({ comodel: 'vx.user' })
  companyId = fields.Many2one({ comodel: 'vx.org' })
}
