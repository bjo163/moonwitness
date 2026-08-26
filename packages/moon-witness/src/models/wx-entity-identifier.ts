import { Vertex, fields } from '@moon/orm'
import { EPISTEMIC_LANE_SELECTION } from '../graph/contracts.js'

/**
 * wx.entity.identifier — source/local/external identifier distinct from aliases.
 *
 * Identifiers resolve records. Aliases label records. Similar-looking values do
 * not imply canonical identity and may remain UNRESOLVED until reconciled.
 */
export default class WxEntityIdentifier extends Vertex {
  static _name = 'wx.entity.identifier'
  static _description = 'Witness Entity Identifier'

  entityId = fields.Many2one({ comodel: 'wx.entity', required: true, index: true })
  namespace = fields.Char({ required: true, size: 120, index: true })
  scheme = fields.Char({ required: true, size: 120, index: true })
  value = fields.Char({ required: true, size: 240, index: true })
  sourceId = fields.Many2one({ comodel: 'wx.source', index: true })
  provenanceId = fields.Many2one({ comodel: 'wx.provenance', index: true })
  epistemicLane = fields.Selection({
    selection: EPISTEMIC_LANE_SELECTION,
    default: 'UNRESOLVED',
    required: true,
    index: true
  })
  validFrom = fields.DateTime({ index: true })
  validTo = fields.DateTime({ index: true })
  active = fields.Boolean({ default: true, index: true })
}
