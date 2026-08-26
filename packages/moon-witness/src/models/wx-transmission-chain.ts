import { Vertex, fields } from '@moon/orm'
import { RECORD_STATUS_SELECTION } from '../graph/contracts.js'

/** Optional source-supplied transmission chain; zero or many per unit are valid. */
export default class WxTransmissionChain extends Vertex {
  static _name = 'wx.transmission.chain'
  static _description = 'Witness Transmission Chain / Isnad'

  entityId = fields.Many2one({ comodel: 'wx.entity', index: true })
  traditionUnitId = fields.Many2one({ comodel: 'wx.tradition.unit', required: true, index: true })
  chainType = fields.Char({ required: true, size: 80, index: true })
  sourceReference = fields.Char({ size: 240 })
  sourceId = fields.Many2one({ comodel: 'wx.source', index: true })
  provenanceId = fields.Many2one({ comodel: 'wx.provenance', required: true, index: true })
  status = fields.Selection({ selection: RECORD_STATUS_SELECTION, default: 'PROVISIONAL', required: true, index: true })
  active = fields.Boolean({ default: true, index: true })
}
