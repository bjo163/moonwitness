import { Vertex, fields } from '@moon/orm'

export default class HdStage extends Vertex {
  static _name = 'hd.stage'
  static _description = 'Helpdesk Ticket Stage'

  name = fields.Char({ required: true, size: 80 })
  sequence = fields.Integer({ default: 1 })
  teamId = fields.Many2one({ comodel: 'hd.team', required: true, index: true })
  fold = fields.Boolean({ default: false })
  isClosing = fields.Boolean({ default: false })
}
