import { Vertex, fields } from '@moon/orm'

export default class WxHistory extends Vertex {
  static _name = 'wx.history'
  static _description = 'User Reading History'

  userId = fields.Many2one({ comodel: 'vx.user', required: true, index: true })
  surahId = fields.Many2one({ comodel: 'wx.surah', required: true, index: true })
  lastAyah = fields.Integer()
  duration = fields.Integer({ default: 0, help: 'Reading duration in seconds' })
}
