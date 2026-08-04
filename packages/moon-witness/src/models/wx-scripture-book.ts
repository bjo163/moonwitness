import { Vertex, fields } from '@moon/orm'

/**
 * wx.scripture.book — Division within a Scripture
 * 
 * For Al-Quran: each Surah (1-114) is a "book".
 * For Taurat: Genesis, Exodus, Leviticus, etc.
 * For Zabur: Psalms 1-150 (groups).
 * For Injil: Matthew, Mark, Luke, John.
 * 
 * All share the same unified structure.
 */
export default class WxScriptureBook extends Vertex {
  static _name = 'wx.scripture.book'
  static _description = 'Book / Surah / Division within a Scripture'
  static _public = true

  scriptureId = fields.Many2one({ comodel: 'wx.scripture', required: true, index: true })
  bookNumber = fields.Integer({ required: true, index: true })
  name = fields.Char({ required: true, size: 150 })
  nameOriginal = fields.Char({ size: 150 })
  slug = fields.Char({ size: 80, index: true })
  chaptersCount = fields.Integer({ default: 0 })
  versesCount = fields.Integer({ default: 0 })
  description = fields.Text()
  summary = fields.Text()
  audioUrl = fields.Text()

  // Quran-specific metadata (null for other scriptures)
  revelationType = fields.Selection({
    selection: [
      ['MAKKIYAH', 'Makkiyah'],
      ['MADANIYAH', 'Madaniyah']
    ]
  })
}
