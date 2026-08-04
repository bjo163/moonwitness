import { Vertex, fields } from '@moon/orm'

/**
 * wx.devotion — Universal Devotional Content
 * 
 * Unified model for all devotional/spiritual content:
 * - Asmaul Husna (99 Names of Allah)
 * - Adhkar (Daily Dzikir & Doa)
 * - Psalms / Hymns
 * - Mantras / Meditation texts
 * - Any spiritual practice text
 * 
 * Categorized by `type` and `category` for flexible grouping.
 */
export default class WxDevotion extends Vertex {
  static _name = 'wx.devotion'
  static _description = 'Devotional Content (Asmaul Husna, Adhkar, Prayers, etc.)'
  static _public = true

  scriptureId = fields.Many2one({ comodel: 'wx.scripture', index: true })
  type = fields.Selection({
    required: true,
    selection: [
      ['dhikr', 'Dhikr / Remembrance'],
      ['dua', 'Dua / Supplication'],
      ['hymn', 'Hymn / Psalm'],
      ['meditation', 'Meditation / Contemplation'],
      ['ritual', 'Ritual / Practice']
    ],
    index: true
  })
  number = fields.Integer({ index: true })
  title = fields.Char({ required: true, size: 255 })
  textOriginal = fields.Text()
  textTransliteration = fields.Text()
  translationId = fields.Text({ required: true })
  translationEn = fields.Text()
  category = fields.Char({ size: 80, index: true })
  timing = fields.Char({ size: 80 })
  source = fields.Char({ size: 200 })
  benefit = fields.Text()
  reference = fields.Char({ size: 200 })
}
