import { Vertex, fields } from '@moon/orm'
import { ALIAS_TYPE_SELECTION, EPISTEMIC_LANE_SELECTION } from '../graph/contracts.ts'

export default class WxEntityAlias extends Vertex {
  static _name = 'wx.entity.alias'
  static _description = 'Witness Entity Alias / Name Form'

  entityId = fields.Many2one({ comodel: 'wx.entity', required: true, index: true })
  label = fields.Char({ required: true, size: 240, index: true })
  normalizedLabel = fields.Char({ required: true, size: 240, index: true })
  aliasType = fields.Selection({ selection: ALIAS_TYPE_SELECTION, default: 'ALTERNATE', required: true, index: true })
  languageId = fields.Many2one({ comodel: 'ix.lang', index: true })
  script = fields.Char({ size: 40, index: true })
  sourceLocalId = fields.Char({ size: 180, index: true })
  sourceId = fields.Many2one({ comodel: 'wx.source', index: true })
  provenanceId = fields.Many2one({ comodel: 'wx.provenance', index: true })
  epistemicLane = fields.Selection({ selection: EPISTEMIC_LANE_SELECTION, default: 'UNRESOLVED', required: true, index: true })
  validFrom = fields.DateTime({ index: true })
  validTo = fields.DateTime({ index: true })
  active = fields.Boolean({ default: true, index: true })
}
