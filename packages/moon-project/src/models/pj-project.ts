import { Vertex, fields } from '@moon/orm'

export default class PjProject extends Vertex {
  static _name = 'pj.project'
  static _description = 'Project Portfolio'

  name = fields.Char({ required: true, size: 180, index: true })
  code = fields.Char({ required: true, size: 32, unique: true, index: true })
  summary = fields.Text()
  ownerId = fields.Many2one({ comodel: 'vx.user', index: true })
  status = fields.Selection({
    selection: [
      ['planned', 'Planned'],
      ['active', 'Active'],
      ['on_hold', 'On Hold'],
      ['completed', 'Completed'],
      ['archived', 'Archived']
    ],
    default: 'planned',
    index: true
  })
  startDate = fields.Date()
  endDate = fields.Date()
  taskIds = fields.One2many({ comodel: 'pj.task', inverse: 'projectId' })
  milestoneIds = fields.One2many({ comodel: 'pj.milestone', inverse: 'projectId' })
  sprintIds = fields.One2many({ comodel: 'pj.sprint', inverse: 'projectId' })
}
