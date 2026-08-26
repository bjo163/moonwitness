import { Vertex, fields } from '@moon/orm'

/** Source-backed attribution of a unit to a figure and contextual role. */
export default class WxTraditionAttribution extends Vertex {
  static _name = 'wx.tradition.attribution'
  static _description = 'Witness Tradition Figure Attribution'

  unitId = fields.Many2one({ comodel: 'wx.tradition.unit', required: true, index: true })
  figureId = fields.Many2one({ comodel: 'wx.figure', index: true })
  rawFigureName = fields.Char({ size: 240, index: true })
  roleCode = fields.Char({ required: true, size: 80, index: true })
  sourceId = fields.Many2one({ comodel: 'wx.source', index: true })
  provenanceId = fields.Many2one({ comodel: 'wx.provenance', required: true, index: true })
  status = fields.Selection({
    selection: [['RESOLVED', 'Resolved'], ['UNRESOLVED', 'Unresolved'], ['DISPUTED', 'Disputed']],
    default: 'UNRESOLVED',
    required: true,
    index: true
  })
  active = fields.Boolean({ default: true, index: true })
}
