import { Vertex, fields } from '@moon/orm'
import { RECORD_STATUS_SELECTION } from '../graph/contracts.ts'

/** Sourced revelation event; event identity is distinct from passage identity. */
export default class WxRevelationEvent extends Vertex {
  static _name = 'wx.revelation.event'
  static _description = 'Witness Revelation Event'

  entityId = fields.Many2one({ comodel: 'wx.entity', required: true, index: true })
  recipientFigureId = fields.Many2one({ comodel: 'wx.figure', index: true })
  placeEntityId = fields.Many2one({ comodel: 'wx.entity', index: true })
  sequence = fields.Integer({ index: true })
  dateFrom = fields.Date()
  dateTo = fields.Date()
  certainty = fields.Selection({
    selection: [['ESTABLISHED', 'Established'], ['PROVISIONAL', 'Provisional'], ['DISPUTED', 'Disputed'], ['UNKNOWN', 'Unknown']],
    default: 'UNKNOWN',
    required: true,
    index: true
  })
  sourceId = fields.Many2one({ comodel: 'wx.source', index: true })
  provenanceId = fields.Many2one({ comodel: 'wx.provenance', index: true })
  status = fields.Selection({ selection: RECORD_STATUS_SELECTION, default: 'PROVISIONAL', required: true, index: true })
  active = fields.Boolean({ default: true, index: true })
}
