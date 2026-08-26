import { Vertex, fields } from '@moon/orm'

/** Edition/source-specific address; never the universal identity of a unit. */
export default class WxTraditionReference extends Vertex {
  static _name = 'wx.tradition.reference'
  static _description = 'Witness Tradition Source Reference'

  unitId = fields.Many2one({ comodel: 'wx.tradition.unit', required: true, index: true })
  corpusId = fields.Many2one({ comodel: 'wx.tradition.corpus', required: true, index: true })
  editionId = fields.Many2one({ comodel: 'wx.text.edition', index: true })
  sourceId = fields.Many2one({ comodel: 'wx.source', required: true, index: true })
  localPath = fields.Char({ size: 240, index: true })
  localNumber = fields.Char({ size: 120, index: true })
  referenceScheme = fields.Char({ size: 120 })
  stableKey = fields.Char({ required: true, unique: true, size: 240, index: true })
  provenanceId = fields.Many2one({ comodel: 'wx.provenance', required: true, index: true })
  active = fields.Boolean({ default: true, index: true })
}
