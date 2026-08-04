import { Vertex, fields } from '@moon/orm'

/**
 * wx.tradition — Collection of Oral/Written Traditions
 * 
 * For Islam: Hadith collections (Bukhari, Muslim, Tirmidzi, etc.)
 * For Judaism: Mishna, Talmud, Pirkei Avot
 * For Christianity: Didache, Church Fathers
 * For others: any traditional wisdom collection
 * 
 * All share the same structure — one model for all traditions.
 */
export default class WxTradition extends Vertex {
  static _name = 'wx.tradition'
  static _description = 'Tradition / Hadith Collection'
  static _public = true

  scriptureId = fields.Many2one({ comodel: 'wx.scripture', index: true })
  slug = fields.Char({ required: true, unique: true, size: 80, index: true })
  name = fields.Char({ required: true, size: 150 })
  originalName = fields.Char({ size: 150 })
  totalItems = fields.Integer({ default: 0 })
  gradeLevel = fields.Selection({
    selection: [
      ['SHAHIH', 'Shahih / Authentic'],
      ['HASAN', 'Hasan / Good'],
      ['DHAIF', "Dha'if / Weak"],
      ['MIXED', 'Mixed Grades']
    ],
    default: 'SHAHIH'
  })
  category = fields.Char({ size: 80, index: true })
  author = fields.Char({ size: 200 })
  description = fields.Text()
}
