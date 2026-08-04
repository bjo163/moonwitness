import { Vertex, fields } from '@moon/orm'

/**
 * wx.tradition.item — Individual Tradition Record
 * 
 * For Islam: Individual Hadith
 * For Judaism: Individual Mishna passage
 * For Christianity: Individual Didache teaching
 * 
 * Universal structure for any traditional saying/teaching.
 */
export default class WxTraditionItem extends Vertex {
  static _name = 'wx.tradition.item'
  static _description = 'Individual Tradition / Hadith / Teaching'
  static _public = true

  collectionId = fields.Many2one({ comodel: 'wx.tradition', required: true, index: true })
  number = fields.Integer({ required: true, index: true })
  chapterNumber = fields.Integer({ default: 1 })
  title = fields.Char({ size: 255 })
  textOriginal = fields.Text()
  textTransliteration = fields.Text()
  translationId = fields.Text({ required: true })
  translationEn = fields.Text()
  grade = fields.Selection({
    selection: [
      ['SHAHIH', 'Shahih / Authentic'],
      ['HASAN', 'Hasan / Good'],
      ['DHAIF', "Dha'if / Weak"],
      ['MAUDHU', "Maudhu' / Fabricated"]
    ],
    default: 'SHAHIH'
  })
  narrator = fields.Text()
  notes = fields.Text()
}
