import { Vertex, fields } from '@moon/orm'
import { RECORD_STATUS_SELECTION } from '../graph/contracts.ts'

/** Canonical person/figure identity shared by Scripture, tradition, and research. */
export default class WxFigure extends Vertex {
  static _name = 'wx.figure'
  static _description = 'Witness Canonical Figure / Person'

  entityId = fields.Many2one({ comodel: 'wx.entity', required: true, index: true })
  stableKey = fields.Char({ required: true, unique: true, size: 180, index: true })
  name = fields.Char({ required: true, size: 240, index: true })
  lifeStart = fields.Date()
  lifeEnd = fields.Date()
  notes = fields.Text()
  provenanceId = fields.Many2one({ comodel: 'wx.provenance', index: true })
  status = fields.Selection({ selection: RECORD_STATUS_SELECTION, default: 'PROVISIONAL', required: true, index: true })
  active = fields.Boolean({ default: true, index: true })
}
