import { Vertex, fields } from '@moon/orm'

export default class CabProject extends Vertex {
  static _name = 'cab.project'
  static _description = 'CAB Project Portfolio'

  name = fields.Char({ required: true, size: 180, index: true })
  code = fields.Char({ required: true, size: 32, unique: true, index: true })
  summary = fields.Text()
  ownerId = fields.Many2one({ comodel: 'vx.user', index: true })
  status = fields.Selection({
    selection: [['planned', 'Planned'], ['active', 'Active'], ['on_hold', 'On Hold'], ['completed', 'Completed']],
    default: 'planned',
    index: true
  })
  taskIds = fields.One2many({ comodel: 'cab.task', inverse: 'projectId' })
  changeIds = fields.One2many({ comodel: 'cab.change', inverse: 'projectId' })
}