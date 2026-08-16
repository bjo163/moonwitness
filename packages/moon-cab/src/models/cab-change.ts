import { Vertex, fields } from '@moon/orm'

export default class CabChange extends Vertex {
  static _name = 'cab.change'
  static _description = 'CAB Change Request'

  reference = fields.Char({ required: true, size: 32, unique: true, index: true })
  title = fields.Char({ required: true, size: 180, index: true })
  description = fields.Text({ required: true })
  projectId = fields.Many2one({ comodel: 'cab.project', required: true, index: true })
  requesterId = fields.Many2one({ comodel: 'vx.user', index: true })
  ownerId = fields.Many2one({ comodel: 'vx.user', index: true })
  risk = fields.Selection({
    selection: [['low', 'Low'], ['medium', 'Medium'], ['high', 'High'], ['critical', 'Critical']],
    default: 'medium',
    index: true
  })
  status = fields.Selection({
    selection: [['draft', 'Draft'], ['submitted', 'Submitted'], ['in_review', 'In Review'], ['approved', 'Approved'], ['rejected', 'Rejected'], ['implemented', 'Implemented']],
    default: 'draft',
    index: true
  })
  scheduledFor = fields.DateTime({ index: true })
  taskIds = fields.One2many({ comodel: 'cab.task', inverse: 'changeId' })
  decisionIds = fields.One2many({ comodel: 'cab.decision', inverse: 'changeId' })
}