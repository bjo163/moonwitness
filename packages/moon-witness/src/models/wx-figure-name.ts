import { Vertex, fields } from '@moon/orm'
import { ALIAS_TYPE_SELECTION } from '../graph/contracts.ts'

const FIGURE_NAME_TYPE_SELECTION: Array<[string, string]> = [
  ['CANONICAL', 'Canonical'],
  ['ORIGINAL', 'Original'],
  ['ALIAS', 'Alias'],
  ['TITLE', 'Title'],
  ['TRANSLITERATION', 'Transliteration'],
  ['HISTORICAL', 'Historical']
]

/** Multilingual and source-aware name form for a canonical figure. */
export default class WxFigureName extends Vertex {
  static _name = 'wx.figure.name'
  static _description = 'Witness Figure Name / Alias'

  figureId = fields.Many2one({ comodel: 'wx.figure', required: true, index: true })
  name = fields.Char({ required: true, size: 240, index: true })
  normalizedName = fields.Char({ size: 240, index: true })
  nameType = fields.Selection({ selection: FIGURE_NAME_TYPE_SELECTION, required: true, index: true })
  languageId = fields.Many2one({ comodel: 'ix.lang', index: true })
  script = fields.Char({ size: 40, index: true })
  sourceLocalId = fields.Char({ size: 180, index: true })
  sourceId = fields.Many2one({ comodel: 'wx.source', index: true })
  provenanceId = fields.Many2one({ comodel: 'wx.provenance', index: true })
  aliasType = fields.Selection({ selection: ALIAS_TYPE_SELECTION, default: 'ALTERNATE', index: true })
  validFrom = fields.DateTime({ index: true })
  validTo = fields.DateTime({ index: true })
  active = fields.Boolean({ default: true, index: true })
}
