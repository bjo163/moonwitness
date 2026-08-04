import { Vertex, fields } from '@moon/orm'

/**
 * wx.asmaul.husna — 99 Nama Allah SWT
 * 
 * Model khusus untuk Asmaul Husna karena memiliki
 * struktur unik yang tidak cocok digabung ke model lain.
 */
export default class WxAsmaulHusna extends Vertex {
  static _name = 'wx.asmaul.husna'
  static _description = '99 Nama Allah SWT (Asmaul Husna)'
  static _public = true

  number = fields.Integer({ required: true, unique: true, index: true })
  nameArabic = fields.Char({ required: true, size: 100 })
  nameLatin = fields.Char({ required: true, size: 100 })
  translationId = fields.Char({ required: true, size: 255 })
  translationEn = fields.Char({ size: 255 })
  quranReference = fields.Char({ size: 200 })
  meaning = fields.Text()
}
