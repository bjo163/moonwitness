import { Vertex, fields } from '@moon/orm'

export class MailMessage extends Vertex {
  static override _name = 'mail.message'
  static override _description = 'Message and Notification'

  body = fields.Text()
  resModel = fields.Char({ size: 80, index: true })
  resId = fields.Integer({ index: true })
  messageType = fields.Selection({
    selection: [
      ['email', 'Email'],
      ['comment', 'Comment'],
      ['notification', 'System Notification'],
      ['user_notification', 'User Notification']
    ],
    default: 'notification'
  })
  authorId = fields.Many2one({ comodel: 'vx.user' })
  parentMessageId = fields.Many2one({ comodel: 'mail.message' })
  trackingValueIds = fields.One2many({ comodel: 'mail.tracking.value', inverse: 'messageId' })
}

export class FxMsgAlias extends MailMessage {
  static override _name = 'fx.msg'
  static override _description = 'Legacy Chatter Message Alias'
}
