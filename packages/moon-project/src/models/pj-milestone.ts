import { Vertex, fields } from '@moon/orm'

export default class PjMilestone extends Vertex {
  static _name = 'pj.milestone'
  static _description = 'Project Milestone'

  name = fields.Char({ required: true, size: 120 })
  projectId = fields.Many2one({ comodel: 'pj.project', required: true, index: true })
  deadline = fields.Date({ index: true })
  isReached = fields.Boolean({ default: false })
}
