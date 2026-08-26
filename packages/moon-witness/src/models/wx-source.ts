import { Vertex, fields } from '@moon/orm'
import {
  SOURCE_CAPABILITY_SELECTION,
  SOURCE_CLASS_SELECTION
} from '../graph/contracts.js'

/**
 * wx.source — provenance/source registry for Witness graph records.
 *
 * Authority/admissibility is intentionally NOT stored here as one mutable
 * policy field. Versioned engine/source policy belongs to wx.source.policy.
 * Raw artifact immutability and ingestion snapshots are owned by #65.
 */
export default class WxSource extends Vertex {
  static _name = 'wx.source'
  static _description = 'Witness Source / Edition / Dataset'

  entityId = fields.Many2one({ comodel: 'wx.entity', index: true })
  stableKey = fields.Char({ required: true, unique: true, index: true, size: 180 })
  name = fields.Char({ required: true, size: 240, index: true })
  sourceClass = fields.Selection({ selection: SOURCE_CLASS_SELECTION, default: 'UNKNOWN', required: true, index: true })
  capability = fields.Selection({ selection: SOURCE_CAPABILITY_SELECTION, default: 'REFERENCE_ONLY', required: true, index: true })
  scriptureFamily = fields.Char({ size: 40, index: true })
  publisher = fields.Char({ size: 240 })
  publisherEntityId = fields.Many2one({ comodel: 'wx.entity', index: true })
  corpus = fields.Char({ size: 180, index: true })
  edition = fields.Char({ size: 180, index: true })
  revision = fields.Char({ size: 160, index: true })
  artifactChecksum = fields.Char({ size: 128, index: true })
  sourceUrl = fields.Text()
  languageId = fields.Many2one({ comodel: 'ix.lang', index: true })
  license = fields.Char({ size: 160 })
  parserVersion = fields.Char({ size: 80 })
  importerVersion = fields.Char({ size: 80 })
  notes = fields.Text()
  active = fields.Boolean({ default: true, index: true })
}
