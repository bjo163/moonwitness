import { Vertex, fields } from '@moon/orm'

export default class CabTask extends Vertex {
  static _name = 'cab.task'
  static _description = 'CAB Implementation Task'

  title = fields.Char({ required: true, size: 180, index: true })
  description = fields.Text()
  projectId = fields.Many2one({ comodel: 'cab.project', required: true, index: true })
  changeId = fields.Many2one({ comodel: 'cab.change', index: true })
  assigneeId = fields.Many2one({ comodel: 'vx.user', index: true })
  priority = fields.Selection({
    selection: [['low', 'Low'], ['normal', 'Normal'], ['high', 'High'], ['critical', 'Critical']],
    default: 'normal',
    index: true
  })
  status = fields.Selection({
    selection: [['backlog', 'Backlog'], ['in_progress', 'In Progress'], ['blocked', 'Blocked'], ['done', 'Done']],
    default: 'backlog',
    index: true
  })
  dueDate = fields.Date({ index: true })
}