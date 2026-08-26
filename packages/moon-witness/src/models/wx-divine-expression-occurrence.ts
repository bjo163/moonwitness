import { Vertex, fields } from '@moon/orm'

/** Exact allowed-corpus occurrence for a divine expression. */
export default class WxDivineExpressionOccurrence extends Vertex {
  static _name = 'wx.divine.expression.occurrence'
  static _description = 'Witness Divine Expression Occurrence'

  expressionId = fields.Many2one({ comodel: 'wx.divine.expression', required: true, index: true })
  passageId = fields.Many2one({ comodel: 'wx.passage', required: true, index: true })
  contentId = fields.Many2one({ comodel: 'wx.content', index: true })
  offsetScheme = fields.Char({ required: true, size: 80 })
  startOffset = fields.Integer({ required: true, min: 0 })
  endOffset = fields.Integer({ required: true, min: 0 })
  fragmentChecksum = fields.Char({ required: true, size: 64, index: true })
  sourceId = fields.Many2one({ comodel: 'wx.source', required: true, index: true })
  provenanceId = fields.Many2one({ comodel: 'wx.provenance', required: true, index: true })
  active = fields.Boolean({ default: true, index: true })
}
