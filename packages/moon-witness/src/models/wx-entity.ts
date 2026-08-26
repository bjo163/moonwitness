import { Vertex, fields } from '@moon/orm'
import {
  AUTHORITY_CLASS_SELECTION,
  ENTITY_KIND_SELECTION,
  EPISTEMIC_LANE_SELECTION,
  OPERATIONAL_STATUS_SELECTION,
  SOURCE_CLASS_SELECTION
} from '../graph/contracts.js'

/**
 * wx.entity — canonical graph anchor.
 *
 * Domain models own their domain fields. This model only provides a stable,
 * cross-domain identity for graph traversal and authority/epistemic metadata.
 * Base `ir.model.data` remains the external-ID mechanism; `canonicalKey` is the
 * immutable semantic key used inside Witness.
 */
export default class WxEntity extends Vertex {
  static _name = 'wx.entity'
  static _description = 'Witness Canonical Entity Anchor'

  canonicalKey = fields.Char({ required: true, unique: true, index: true, size: 180 })
  kind = fields.Selection({ selection: ENTITY_KIND_SELECTION, required: true, index: true })
  label = fields.Char({ size: 240, index: true })
  sourceClass = fields.Selection({ selection: SOURCE_CLASS_SELECTION, default: 'UNKNOWN', required: true, index: true })
  epistemicLane = fields.Selection({ selection: EPISTEMIC_LANE_SELECTION, default: 'UNRESOLVED', required: true, index: true })
  authorityClass = fields.Selection({ selection: AUTHORITY_CLASS_SELECTION, default: 'NOT_APPLICABLE', required: true, index: true })
  operationalStatus = fields.Selection({ selection: OPERATIONAL_STATUS_SELECTION, default: 'PROVISIONAL', required: true, index: true })
  sourceRevision = fields.Char({ size: 160, index: true })
  description = fields.Text()
  active = fields.Boolean({ default: true, index: true })
}
