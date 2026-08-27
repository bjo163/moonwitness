import { Vertex, fields } from '@moon/orm'

export default class HdSla extends Vertex {
  static _name = 'hd.sla'
  static _description = 'Helpdesk SLA Policy'

  name = fields.Char({ required: true, size: 80 })
  teamId = fields.Many2one({ comodel: 'hd.team', required: true, index: true })
  priority = fields.Selection({
    selection: [
      ['low', 'Low'],
      ['normal', 'Normal'],
      ['high', 'High'],
      ['urgent', 'Urgent']
    ],
    required: true,
    index: true
  })
  responseHours = fields.Float({ required: true })
  resolutionHours = fields.Float({ required: true })
}
