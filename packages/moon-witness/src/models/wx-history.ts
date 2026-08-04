import { Vertex, fields } from '@moon/orm'

export default class WxHistory extends Vertex {
  static _name = 'wx.history'
  static _description = 'User Reading History'

  userId = fields.Many2one({ comodel: 'vx.user', required: true, index: true })
  bookId = fields.Many2one({ comodel: 'wx.scripture.book', required: true, index: true })
  lastVerseId = fields.Many2one({ comodel: 'wx.scripture.verse', index: true })
  duration = fields.Integer({ default: 0, help: 'Reading duration in seconds' })
}
