import { Vertex, fields } from '@moon/orm'

export default class PjStage extends Vertex {
  static _name = 'pj.stage'
  static _description = 'Project Kanban Stage'

  name = fields.Char({ required: true, size: 80 })
  sequence = fields.Integer({ default: 1 })
  projectId = fields.Many2one({ comodel: 'pj.project', required: true, index: true })
  fold = fields.Boolean({ default: false })
  isClosing = fields.Boolean({ default: false })
}
