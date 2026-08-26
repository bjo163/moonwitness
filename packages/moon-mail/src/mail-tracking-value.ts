import { Vertex, fields } from '@moon/orm'

export class MailTrackingValue extends Vertex {
  static override _name = 'mail.tracking.value'
  static override _description = 'Mail Tracking Value'

  messageId = fields.Many2one({ comodel: 'mail.message', required: true })
  fieldName = fields.Char({ required: true, size: 80 })
  oldValue = fields.Text()
  newValue = fields.Text()
}

export class FxTrackAlias extends MailTrackingValue {
  static override _name = 'fx.track'
  static override _description = 'Legacy Chatter Track Alias'
}
