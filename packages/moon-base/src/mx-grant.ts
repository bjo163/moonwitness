import { Vertex } from '@moon/orm'
import { fields } from '@moon/orm'

export default class MxGrant extends Vertex {
  static _name = 'mx.grant'
  static _description = 'Model Access'

  name = fields.Char({ required: true })
  modelId = fields.Many2one({ comodel: 'mx.model', required: true })
  groupId = fields.Many2one({ comodel: 'vx.role', required: true })

  permRead = fields.Boolean({ default: false })
  permWrite = fields.Boolean({ default: false })
  permCreate = fields.Boolean({ default: false })
  permUnlink = fields.Boolean({ default: false })
}
