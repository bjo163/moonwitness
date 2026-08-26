import { Vertex, fields } from '@moon/orm'
import { AUTHORITY_CLASS_SELECTION, RECORD_STATUS_SELECTION, SOURCE_CLASS_SELECTION } from '../graph/contracts.js'

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

  /** Canonical graph anchor; legacy rows may be backfilled during migration. */
  entityId = fields.Many2one({ comodel: 'wx.entity', index: true })
  canonicalCode = fields.Char({ size: 80, unique: true, index: true })
  sourceClass = fields.Selection({ selection: SOURCE_CLASS_SELECTION, default: 'REVELATION', index: true })
  authorityClass = fields.Selection({ selection: AUTHORITY_CLASS_SELECTION, default: 'PRIMARY_SOURCE', index: true })
  status = fields.Selection({ selection: RECORD_STATUS_SELECTION, default: 'APPROVED', index: true })
  active = fields.Boolean({ default: true, index: true })
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
