import { Vertex, fields } from '@moon/orm'

export default class PjSprint extends Vertex {
  static _name = 'pj.sprint'
  static _description = 'Project Sprint / Iteration'

  name = fields.Char({ required: true, size: 80 })
  projectId = fields.Many2one({ comodel: 'pj.project', required: true, index: true })
  startDate = fields.Date()
  endDate = fields.Date()
  status = fields.Selection({
    selection: [
      ['draft', 'Draft'],
      ['active', 'Active'],
      ['completed', 'Completed']
    ],
    default: 'draft',
    index: true
  })
}
