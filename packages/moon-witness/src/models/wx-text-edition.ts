import { Vertex, fields } from '@moon/orm'
import { RECORD_STATUS_SELECTION, TEXT_EDITION_TYPE_SELECTION } from '../graph/contracts.ts'

/** Concrete textual witness, edition, manuscript, translation, or dataset. */
export default class WxTextEdition extends Vertex {
  static _name = 'wx.text.edition'
  static _description = 'Witness Text Edition / Textual Witness'

  entityId = fields.Many2one({ comodel: 'wx.entity', required: true, index: true })
  scriptureId = fields.Many2one({ comodel: 'wx.scripture', index: true })
  sourceId = fields.Many2one({ comodel: 'wx.source', required: true, index: true })
  title = fields.Char({ required: true, size: 240, index: true })
  languageId = fields.Many2one({ comodel: 'ix.lang', index: true })
  languageCode = fields.Char({ size: 12, index: true })
  publisher = fields.Char({ size: 240 })
  edition = fields.Char({ size: 180 })
  revision = fields.Char({ required: true, size: 160, index: true })
  editionType = fields.Selection({ selection: TEXT_EDITION_TYPE_SELECTION, required: true, index: true })
  artifactId = fields.Many2one({ comodel: 'wx.source.artifact', index: true })
  provenanceId = fields.Many2one({ comodel: 'wx.provenance', index: true })
  status = fields.Selection({ selection: RECORD_STATUS_SELECTION, default: 'PROVISIONAL', required: true, index: true })
  active = fields.Boolean({ default: true, index: true })
}
