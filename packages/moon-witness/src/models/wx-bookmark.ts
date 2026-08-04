import { Vertex, fields } from '@moon/orm'

export default class WxBookmark extends Vertex {
  static _name = 'wx.bookmark'
  static _description = 'User Bookmark for Scripture Verses'

  userId = fields.Many2one({ comodel: 'vx.user', required: true, index: true })
  surahId = fields.Many2one({ comodel: 'wx.surah', index: true })
  ayahNumber = fields.Integer()
  note = fields.Text()
}
