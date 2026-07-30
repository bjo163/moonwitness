import { Vertex, fields } from '@moon/orm'

export default class FxSession extends Vertex {
  static _name = 'fx.session'
  static _description = 'Visitor Session Analytics'

  clientId = fields.Char({ required: true, index: true })
  ipAddress = fields.Char({ index: true })
  userAgent = fields.Text()
  country = fields.Char({ index: true })
  connectedAt = fields.DateTime({ autoNowAdd: true, index: true })
  disconnectedAt = fields.DateTime({ index: true })
}
