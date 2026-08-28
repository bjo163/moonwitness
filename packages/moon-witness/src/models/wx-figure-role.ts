import { Vertex, fields } from '@moon/orm'
import { RECORD_STATUS_SELECTION } from '../graph/contracts.ts'

/** Evidence-backed role assignment; role is not inferred from religion membership. */
export default class WxFigureRole extends Vertex {
  static _name = 'wx.figure.role'
  static _description = 'Witness Figure Role Assignment'

  figureId = fields.Many2one({ comodel: 'wx.figure', required: true, index: true })
  roleCode = fields.Char({ required: true, size: 80, index: true })
  sourceId = fields.Many2one({ comodel: 'wx.source', index: true })
  provenanceId = fields.Many2one({ comodel: 'wx.provenance', required: true, index: true })
  religionId = fields.Many2one({ comodel: 'wx.religion', index: true })
  communityId = fields.Many2one({ comodel: 'wx.community', index: true })
  certainty = fields.Selection({
    selection: [['ESTABLISHED', 'Established'], ['PROVISIONAL', 'Provisional'], ['DISPUTED', 'Disputed'], ['UNKNOWN', 'Unknown']],
    default: 'UNKNOWN',
    required: true,
    index: true
  })
  validFrom = fields.DateTime({ index: true })
  validTo = fields.DateTime({ index: true })
  status = fields.Selection({ selection: RECORD_STATUS_SELECTION, default: 'PROVISIONAL', required: true, index: true })
  active = fields.Boolean({ default: true, index: true })
}
