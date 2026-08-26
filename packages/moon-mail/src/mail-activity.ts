import { Vertex, fields } from '@moon/orm'

export default class MailActivity extends Vertex {
  static override _name = 'mail.activity'
  static override _description = 'Activity'

  resModel = fields.Char({ required: true, size: 80, index: true })
  resId = fields.Integer({ required: true, index: true })
  activityTypeId = fields.Many2one({ comodel: 'mail.activity.type', required: true })
  summary = fields.Char({ size: 120 })
  note = fields.Text()
  dateDeadline = fields.Date({ required: true, index: true })
  userId = fields.Many2one({ comodel: 'vx.user', required: true })
  state = fields.Selection({
    selection: [
      ['overdue', 'Overdue'],
      ['today', 'Today'],
      ['planned', 'Planned'],
      ['done', 'Done'],
      ['cancelled', 'Cancelled']
    ],
    default: 'planned'
  })
}
