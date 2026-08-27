import { Vertex, fields } from '@moon/orm'

export default class HdTicket extends Vertex {
  static _name = 'hd.ticket'
  static _description = 'Helpdesk Support Ticket'
  static _rec_name = 'title'

  reference = fields.Char({ required: true, size: 32, unique: true, index: true })
  title = fields.Char({ required: true, size: 180, index: true })
  description = fields.Text()
  teamId = fields.Many2one({ comodel: 'hd.team', required: true, index: true })
  stageId = fields.Many2one({ comodel: 'hd.stage', index: true })
  assigneeId = fields.Many2one({ comodel: 'vx.user', index: true })
  partnerId = fields.Many2one({ comodel: 'vx.node', index: true })
  projectId = fields.Many2one({ comodel: 'pj.project', index: true })
  priority = fields.Selection({
    selection: [
      ['low', 'Low'],
      ['normal', 'Normal'],
      ['high', 'High'],
      ['urgent', 'Urgent']
    ],
    default: 'normal',
    index: true
  })
  slaId = fields.Many2one({ comodel: 'hd.sla', index: true })
  slaDeadline = fields.DateTime({ index: true })
  slaStatus = fields.Selection({
    selection: [
      ['on_track', 'On Track'],
      ['at_risk', 'At Risk'],
      ['breached', 'Breached']
    ],
    default: 'on_track',
    index: true
  })
  changeId = fields.Many2one({ comodel: 'cab.change', index: true })
  tagIds = fields.Many2many({ comodel: 'hd.tag', relation: 'hd_ticket_tag_rel' })
}
