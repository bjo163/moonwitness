import { Vertex, fields } from '@moon/orm'

/** Linguistic root where the source language supports a root analysis. */
export default class WxRoot extends Vertex {
  static _name = 'wx.root'
  static _description = 'Witness Lexical Root'

  entityId = fields.Many2one({ comodel: 'wx.entity', required: true, index: true })
  stableKey = fields.Char({ required: true, unique: true, size: 180, index: true })
  languageCode = fields.Char({ required: true, size: 12, index: true })
  script = fields.Char({ size: 40, index: true })
  writtenForm = fields.Char({ required: true, size: 180, index: true })
  transliteration = fields.Char({ size: 180 })
  sourceId = fields.Many2one({ comodel: 'wx.source', index: true })
  provenanceId = fields.Many2one({ comodel: 'wx.provenance', index: true })
  active = fields.Boolean({ default: true, index: true })
}
