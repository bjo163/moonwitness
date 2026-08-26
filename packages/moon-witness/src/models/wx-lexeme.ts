import { Vertex, fields } from '@moon/orm'

/** Sourced lexical lemma; cross-language equivalence remains a relation/assertion. */
export default class WxLexeme extends Vertex {
  static _name = 'wx.lexeme'
  static _description = 'Witness Lexeme / Linguistic Form'

  entityId = fields.Many2one({ comodel: 'wx.entity', required: true, index: true })
  stableKey = fields.Char({ required: true, unique: true, size: 220, index: true })
  languageCode = fields.Char({ required: true, size: 12, index: true })
  script = fields.Char({ size: 40, index: true })
  lemma = fields.Char({ required: true, size: 240, index: true })
  transliteration = fields.Char({ size: 240 })
  rootId = fields.Many2one({ comodel: 'wx.root', index: true })
  morphology = fields.Text()
  sourceId = fields.Many2one({ comodel: 'wx.source', index: true })
  provenanceId = fields.Many2one({ comodel: 'wx.provenance', index: true })
  active = fields.Boolean({ default: true, index: true })
}
