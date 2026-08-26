import { Vertex, fields } from '@moon/orm'

const LEGACY_MAPPING_STATUS_SELECTION: Array<[string, string]> = [
  ['MAPPED', 'Mapped'],
  ['UNRESOLVED', 'Unresolved'],
  ['STALE', 'Stale Source Revision'],
  ['FAILED', 'Failed'],
  ['SKIPPED', 'Skipped']
]

/** Durable source-to-canonical mapping used by resumable legacy migration. */
export default class WxLegacyMapping extends Vertex {
  static _name = 'wx.legacy.mapping'
  static _description = 'Witness Legacy Migration Mapping'

  mappingKey = fields.Char({ required: true, unique: true, size: 320, index: true })
  sourceModel = fields.Char({ required: true, size: 160, index: true })
  sourceRecordId = fields.Char({ required: true, size: 120, index: true })
  sourceChecksum = fields.Char({ required: true, size: 64, index: true })
  adapterVersion = fields.Char({ required: true, size: 120, index: true })
  targetModel = fields.Char({ required: true, size: 160, index: true })
  targetRecordId = fields.Integer({ index: true })
  targetEntityId = fields.Many2one({ comodel: 'wx.entity', index: true })
  status = fields.Selection({ selection: LEGACY_MAPPING_STATUS_SELECTION, required: true, default: 'MAPPED', index: true })
  warning = fields.Text()
  processedAt = fields.DateTime({ index: true })
  active = fields.Boolean({ default: true, index: true })
}
