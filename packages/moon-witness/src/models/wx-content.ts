import { Vertex, fields } from '@moon/orm'
import { CONTENT_TYPE_SELECTION, RECORD_STATUS_SELECTION } from '../graph/contracts.js'
import { sha256String } from '../services/hash.js'

/** Source-preserving text/content attached to a passage or another entity. */
export default class WxContent extends Vertex {
  static _name = 'wx.content'
  static _description = 'Witness Source Content / Translation'

  targetEntityId = fields.Many2one({ comodel: 'wx.entity', index: true })
  passageId = fields.Many2one({ comodel: 'wx.passage', index: true })
  contentType = fields.Selection({ selection: CONTENT_TYPE_SELECTION, required: true, index: true })
  languageId = fields.Many2one({ comodel: 'ix.lang', index: true })
  languageCode = fields.Char({ size: 12, index: true })
  script = fields.Char({ size: 40, index: true })
  text = fields.Text({ required: true })
  editionId = fields.Many2one({ comodel: 'wx.text.edition', index: true })
  sourceId = fields.Many2one({ comodel: 'wx.source', index: true })
  translatorFigureId = fields.Many2one({ comodel: 'wx.figure', index: true })
  authorFigureId = fields.Many2one({ comodel: 'wx.figure', index: true })
  derivedFromContentId = fields.Many2one({ comodel: 'wx.content', index: true })
  checksum = fields.Char({ size: 64, index: true })
  provenanceId = fields.Many2one({ comodel: 'wx.provenance', index: true })
  status = fields.Selection({ selection: RECORD_STATUS_SELECTION, default: 'PROVISIONAL', required: true, index: true })
  revision = fields.Char({ required: true, size: 160, default: '1', index: true })
  active = fields.Boolean({ default: true, index: true })

  static async beforeSave(
    _modelClass: typeof Vertex,
    _env: unknown,
    values: Record<string, unknown>
  ): Promise<void> {
    if (!values.targetEntityId && !values.passageId) {
      throw new Error('Content must target an entity or passage')
    }
    if (!values.checksum && typeof values.text === 'string') {
      values.checksum = sha256String(values.text)
    }
  }
}
