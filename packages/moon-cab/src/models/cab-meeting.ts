import { Vertex, fields } from '@moon/orm'

export default class CabMeeting extends Vertex {
  static _name = 'cab.meeting'
  static _description = 'CAB Review Meeting'
  static _rec_name = 'title'

  title = fields.Char({ required: true, size: 180, index: true })
  scheduledFor = fields.DateTime({ required: true, index: true })
  facilitatorId = fields.Many2one({ comodel: 'vx.user', index: true })
  attendeeIds = fields.Many2many({ comodel: 'vx.user', relation: 'cab_meeting_attendee_rel' })
  status = fields.Selection({
    selection: [['scheduled', 'Scheduled'], ['in_progress', 'In Progress'], ['completed', 'Completed'], ['cancelled', 'Cancelled']],
    default: 'scheduled',
    index: true
  })
  notes = fields.Text()
  decisionIds = fields.One2many({ comodel: 'cab.decision', inverse: 'meetingId' })
}