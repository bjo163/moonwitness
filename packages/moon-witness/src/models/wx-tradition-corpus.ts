import { Vertex, fields } from '@moon/orm'
import { RECORD_STATUS_SELECTION } from '../graph/contracts.ts'

const TRADITION_TYPE_SELECTION: Array<[string, string]> = [
  ['HADITH', 'Hadith'],
  ['RABBINIC', 'Rabbinic'],
  ['PATRISTIC', 'Patristic'],
  ['COMMENTARY', 'Commentary'],
  ['ORAL_REPORT', 'Oral Report'],
  ['HISTORICAL_REPORT', 'Historical Report'],
  ['OTHER', 'Other']
]

/** Universal non-Revelation tradition/corpus identity layer. */
export default class WxTraditionCorpus extends Vertex {
  static _name = 'wx.tradition.corpus'
  static _description = 'Witness Tradition / Transmission Corpus'

  entityId = fields.Many2one({ comodel: 'wx.entity', required: true, index: true })
  stableKey = fields.Char({ required: true, unique: true, size: 220, index: true })
  name = fields.Char({ required: true, size: 240, index: true })
  originalName = fields.Char({ size: 240 })
  traditionType = fields.Selection({ selection: TRADITION_TYPE_SELECTION, required: true, index: true })
  religionId = fields.Many2one({ comodel: 'wx.religion', index: true })
  communityId = fields.Many2one({ comodel: 'wx.community', index: true })
  sourceId = fields.Many2one({ comodel: 'wx.source', index: true })
  compilerFigureId = fields.Many2one({ comodel: 'wx.figure', index: true })
  provenanceId = fields.Many2one({ comodel: 'wx.provenance', index: true })
  status = fields.Selection({ selection: RECORD_STATUS_SELECTION, default: 'PROVISIONAL', required: true, index: true })
  active = fields.Boolean({ default: true, index: true })
}
