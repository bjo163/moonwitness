import { Vertex, fields } from '@moon/orm'

export default class CabDecision extends Vertex {
  static _name = 'cab.decision'
  static _description = 'CAB Decision Record'

  changeId = fields.Many2one({ comodel: 'cab.change', required: true, index: true })
  meetingId = fields.Many2one({ comodel: 'cab.meeting', index: true })
  decidedById = fields.Many2one({ comodel: 'vx.user', index: true })
  outcome = fields.Selection({
    selection: [['approved', 'Approved'], ['approved_with_conditions', 'Approved with Conditions'], ['deferred', 'Deferred'], ['rejected', 'Rejected']],
    required: true,
    index: true
  })
  rationale = fields.Text({ required: true })
  decidedAt = fields.DateTime({ autoNowAdd: true, index: true })
}