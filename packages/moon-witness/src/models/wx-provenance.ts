import { Vertex, fields } from '@moon/orm'

/**
 * wx.provenance — immutable semantic provenance pointer.
 *
 * Relations and aliases point to provenance. Entity-bound provenance can point
 * to an entity directly. We intentionally avoid reverse FKs back to relation
 * or alias so schema creation does not create unnecessary circular constraints.
 */
export default class WxProvenance extends Vertex {
  static _name = 'wx.provenance'
  static _description = 'Witness Provenance Record'

  stableKey = fields.Char({ required: true, unique: true, index: true, size: 220 })
  sourceId = fields.Many2one({ comodel: 'wx.source', required: true, index: true })
  entityId = fields.Many2one({ comodel: 'wx.entity', index: true })
  sourceReference = fields.Text()
  sourceRevision = fields.Char({ size: 160, index: true })
  artifactChecksum = fields.Char({ size: 128, index: true })
  parserVersion = fields.Char({ size: 80 })
  importerVersion = fields.Char({ size: 80 })
  license = fields.Char({ size: 160 })
  evidenceNote = fields.Text()
  superseded = fields.Boolean({ default: false, index: true })
  active = fields.Boolean({ default: true, index: true })
}
