import { Vertex, fields } from '@moon/orm'

/**
 * wx.scripture.verse — Verse / Ayah from any Scripture
 * 
 * For Al-Quran: each Ayah (1-6236).
 * For Taurat/Zabur/Injil: each verse.
 * 
 * Fields are designed to be universal — Quran-specific fields
 * (textArabic, textTajweed, juz, page) are simply null for other scriptures.
 */
export default class WxScriptureVerse extends Vertex {
  static _name = 'wx.scripture.verse'
  static _description = 'Verse / Ayah from any Scripture'
  static _public = true

  scriptureId = fields.Many2one({ comodel: 'wx.scripture', required: true, index: true })
  bookId = fields.Many2one({ comodel: 'wx.scripture.book', required: true, index: true })
  chapterNumber = fields.Integer({ default: 1 })
  verseNumber = fields.Integer({ required: true, index: true })

  // Universal text fields
  textOriginal = fields.Text({ required: true })
  textTransliteration = fields.Text()
  translationId = fields.Text()
  translationEn = fields.Text()
  tafsir = fields.Text()
  footnote = fields.Text()
  audioUrl = fields.Text()

  // Quran-specific (null for other scriptures)
  textTajweed = fields.Text()
  juz = fields.Integer({ index: true })
  page = fields.Integer()
}
