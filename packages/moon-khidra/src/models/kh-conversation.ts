import { Vertex, fields } from '@moon/orm'

export default class KhConversation extends Vertex {
  static _name = 'kh.conversation'
  static _description = 'Khidra Conversation Session'
  static _rec_name = 'title'
  static _public = false

  userId = fields.Many2one({ comodel: 'vx.user', index: true })
  sessionId = fields.Char({ size: 64, required: true, index: true, unique: true })
  title = fields.Char({ size: 255 })
  geminiInteractionId = fields.Char({ size: 128 })
  messageCount = fields.Integer({ default: 0 })
  lastActivityAt = fields.DateTime()
}
