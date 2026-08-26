import { Vertex, fields } from '@moon/orm'

/** Context/taxonomy only. Religion does not confer Revelation authority. */
export default class WxReligion extends Vertex {
  static _name = 'wx.religion'
  static _description = 'Witness Religion Context'

  entityId = fields.Many2one({ comodel: 'wx.entity', required: true, index: true })
  code = fields.Char({ required: true, unique: true, index: true, size: 80 })
  name = fields.Char({ required: true, size: 180, index: true })
  description = fields.Text()
  active = fields.Boolean({ default: true, index: true })
}
