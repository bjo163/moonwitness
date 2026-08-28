import { Vertex, fields, type Ctx } from '@moon/orm'
import { AUTHORITY_CLASS_SELECTION, normalizeRevelationFamilyCode, RECORD_STATUS_SELECTION, SOURCE_CLASS_SELECTION } from '../graph/contracts.js'

/**
 * wx.scripture — Universal Divine Scripture
 * 
 * Represents a Revelation family identity. Textual witnesses and later sacred
 * or historical works remain separate source/content records.
 */
export default class WxScripture extends Vertex {
  static _name = 'wx.scripture'
  static _description = 'Divine Scripture / Holy Book'
  static _public = false

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

  static async beforeSave(
    _modelClass: typeof Vertex,
    _env: Ctx,
    values: Record<string, unknown>
  ): Promise<void> {
    const sourceClass = String(values.sourceClass ?? '').trim().toUpperCase()
    const scriptureType = String(values.type ?? '').trim().toLowerCase()
    const canonicalCode = String(values.canonicalCode ?? values.canonical_code ?? '').trim()
    const normative = sourceClass === 'REVELATION' || scriptureType === 'canonical'

    if (normative && !canonicalCode) {
      throw new Error('Normative scripture requires one of the four Revelation family codes')
    }
    if (normative && !normalizeRevelationFamilyCode(canonicalCode)) {
      throw new Error('Normative scripture must be QURAN, TAWRAT, ZABUR, or INJIL')
    }
    if ((scriptureType === 'additional' || scriptureType === 'philosophy') && sourceClass === 'REVELATION') {
      throw new Error('Additional or philosophy texts cannot claim the REVELATION source class')
    }
  }
}
