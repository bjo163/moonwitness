import { Vertex, fields } from '@moon/orm'
import { RECORD_STATUS_SELECTION } from '../graph/contracts.js'

/** Independent source-aware assessment; raw values and disagreements are preserved. */
export default class WxTraditionAssessment extends Vertex {
  static _name = 'wx.tradition.assessment'
  static _description = 'Witness Tradition Source Assessment'

  traditionUnitId = fields.Many2one({ comodel: 'wx.tradition.unit', required: true, index: true })
  assessmentScheme = fields.Char({ required: true, size: 120, index: true })
  assessorFigureId = fields.Many2one({ comodel: 'wx.figure', index: true })
  authoritySourceId = fields.Many2one({ comodel: 'wx.source', index: true })
  rawValue = fields.Char({ required: true, size: 160, index: true })
  normalizedCategory = fields.Char({ size: 120, index: true })
  rationale = fields.Text()
  sourceReference = fields.Char({ size: 240 })
  provenanceId = fields.Many2one({ comodel: 'wx.provenance', required: true, index: true })
  status = fields.Selection({ selection: RECORD_STATUS_SELECTION, default: 'PROVISIONAL', required: true, index: true })
  active = fields.Boolean({ default: true, index: true })
}
