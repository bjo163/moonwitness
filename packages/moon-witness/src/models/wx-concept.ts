import { Vertex, fields } from '@moon/orm'
import { RECORD_STATUS_SELECTION } from '../graph/contracts.ts'

/** Corpus-independent semantic concept with multilingual labels kept separately. */
export default class WxConcept extends Vertex {
  static _name = 'wx.concept'
  static _description = 'Witness Semantic Concept'

  entityId = fields.Many2one({ comodel: 'wx.entity', required: true, index: true })
  stableKey = fields.Char({ required: true, unique: true, size: 220, index: true })
  name = fields.Char({ required: true, size: 240, index: true })
  languageCode = fields.Char({ size: 12, index: true })
  description = fields.Text()
  sourceId = fields.Many2one({ comodel: 'wx.source', index: true })
  provenanceId = fields.Many2one({ comodel: 'wx.provenance', index: true })
  status = fields.Selection({ selection: RECORD_STATUS_SELECTION, default: 'PROVISIONAL', required: true, index: true })
  active = fields.Boolean({ default: true, index: true })
}
