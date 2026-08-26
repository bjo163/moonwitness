import { Vertex, fields } from '@moon/orm'

export default class MailActivityType extends Vertex {
  static override _name = 'mail.activity.type'
  static override _description = 'Activity Type'

  name = fields.Char({ required: true, size: 80 })
  summary = fields.Char({ size: 120 })
  icon = fields.Char({ size: 40 })
  delayCount = fields.Integer({ default: 0 })
  delayUnit = fields.Selection({
    selection: [
      ['days', 'Days'],
      ['weeks', 'Weeks'],
      ['months', 'Months']
    ],
    default: 'days'
  })
  resModel = fields.Char({ size: 80 })
}
