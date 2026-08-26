import { Vertex, fields } from '@moon/orm'

/** Community/tradition context. It never upgrades source or Revelation authority. */
export default class WxCommunity extends Vertex {
  static _name = 'wx.community'
  static _description = 'Witness Community / Tradition Context'

  entityId = fields.Many2one({ comodel: 'wx.entity', required: true, index: true })
  code = fields.Char({ required: true, unique: true, index: true, size: 100 })
  name = fields.Char({ required: true, size: 200, index: true })
  religionId = fields.Many2one({ comodel: 'wx.religion', index: true })
  communityType = fields.Char({ size: 100, index: true })
  description = fields.Text()
  active = fields.Boolean({ default: true, index: true })
}
