import { Vertex, fields } from '@moon/orm'

export default class KhMessage extends Vertex {
  static _name = 'kh.message'
  static _description = 'Khidra Conversation Message'
  static _public = false

  conversationId = fields.Many2one({ comodel: 'kh.conversation', required: true, index: true })
  role = fields.Selection({
    required: true,
    selection: [['user', 'User'], ['model', 'Model'], ['system', 'System'], ['function', 'Function']]
  })
  content = fields.Text()
  toolName = fields.Char({ size: 128 })
  toolResult = fields.Text()
  tokenCount = fields.Integer()
}
