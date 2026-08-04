import { Vertex, fields } from '@moon/orm'

/**
 * wx.scripture — Universal Divine Scripture
 * 
 * Represents any holy scripture: Al-Quran, Taurat (Torah), Zabur (Psalms), Injil (Gospel),
 * or any other sacred text. All scriptures share the same structure.
 */
export default class WxScripture extends Vertex {
  static _name = 'wx.scripture'
  static _description = 'Divine Scripture / Holy Book'
  static _public = true

  name = fields.Char({ required: true, size: 120, index: true })
  originalName = fields.Char({ size: 120 })
  slug = fields.Char({ size: 50, unique: true, index: true })
  religion = fields.Char({ size: 80 })
  type = fields.Selection({
    selection: [
      ['canonical', 'Canonical'],
      ['additional', 'Additional'],
      ['philosophy', 'Philosophy']
    ],
    default: 'canonical'
  })
  booksCount = fields.Integer({ default: 0 })
  chaptersCount = fields.Integer({ default: 0 })
  versesCount = fields.Integer({ default: 0 })
  authenticityStatus = fields.Char({ size: 120 })
  revelationEra = fields.Char({ size: 120 })
  prophet = fields.Char({ size: 120 })
  description = fields.Text()
  coverImageUrl = fields.Text()
  themeColor = fields.Char({ size: 20 })
}
