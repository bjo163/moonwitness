import { Vertex, fields } from '@moon/orm'

export class FxMsg extends Vertex {
  static _name = 'fx.msg'
  static _description = 'Message'
  static _public = true

  resModel = fields.Char({ required: true, index: true })
  resId = fields.Integer({ required: true, index: true })
  messageType = fields.Selection({
    selection: [
      ['comment', 'Comment'],
      ['notification', 'System Notification']
    ],
    default: 'notification'
  })
  body = fields.Text()
  authorId = fields.Many2one({ comodel: 'vx.user' })
}

export class FxTrack extends Vertex {
  static _name = 'fx.track'
  static _description = 'Mail Tracking Value'

  messageId = fields.Many2one({ comodel: 'fx.msg', required: true, index: true })
  fieldName = fields.Char({ required: true })
  oldValue = fields.Text()
  newValue = fields.Text()
}
