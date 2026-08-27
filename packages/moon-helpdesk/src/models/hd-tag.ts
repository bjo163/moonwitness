import { Vertex, fields } from '@moon/orm'

export default class HdTag extends Vertex {
  static _name = 'hd.tag'
  static _description = 'Helpdesk Ticket Tag'

  name = fields.Char({ required: true, size: 40, unique: true })
  color = fields.Char({ size: 7, default: '#00F0FF' })
}
