import { Vertex, fields } from '@moon/orm'

export default class WxBookmark extends Vertex {
  static _name = 'wx.bookmark'
  static _description = 'User Bookmark for Scripture Verses'

  userId = fields.Many2one({ comodel: 'vx.user', required: true, index: true })
  bookId = fields.Many2one({ comodel: 'wx.scripture.book', index: true })
  verseId = fields.Many2one({ comodel: 'wx.scripture.verse', index: true })
  note = fields.Text()
}
