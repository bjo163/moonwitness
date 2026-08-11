import { Vertex, fields } from '@moon/orm'

export default class MzReference extends Vertex {
  static _name = 'mz.reference'
  static _description = 'Mizan Internal Reference'

  assessmentId = fields.Many2one({ comodel: 'mz.assessment', required: true, index: true })
  verseId = fields.Many2one({ comodel: 'wx.scripture.verse', index: true })
  referenceCode = fields.Char({ required: true, size: 120, index: true })
  summary = fields.Text({ required: true })
  isVerified = fields.Boolean({ default: false, index: true })
}
