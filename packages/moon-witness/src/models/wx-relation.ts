import { Vertex, fields } from '@moon/orm'
import {
  AUTHORITY_CLASS_SELECTION,
  EPISTEMIC_LANE_SELECTION,
  OPERATIONAL_STATUS_SELECTION,
  RELATION_MODALITY_SELECTION,
  RELATION_POLARITY_SELECTION,
  SOURCE_CLASS_SELECTION
} from '../graph/contracts.js'

/**
 * wx.relation — provenance-aware semantic edge between canonical entities.
 * Domain structural relations remain strong FKs in their own models.
 */
export default class WxRelation extends Vertex {
  static _name = 'wx.relation'
  static _description = 'Witness Semantic Relation'

  edgeKey = fields.Char({ required: true, unique: true, index: true, size: 220 })
  fromEntityId = fields.Many2one({ comodel: 'wx.entity', required: true, index: true })
  relationTypeId = fields.Many2one({ comodel: 'wx.relation.type', required: true, index: true })
  toEntityId = fields.Many2one({ comodel: 'wx.entity', required: true, index: true })
  assertionEntityId = fields.Many2one({ comodel: 'wx.entity', index: true })
  provenanceId = fields.Many2one({ comodel: 'wx.provenance', index: true })
  sourceId = fields.Many2one({ comodel: 'wx.source', index: true })
  sourceClass = fields.Selection({ selection: SOURCE_CLASS_SELECTION, default: 'UNKNOWN', required: true, index: true })
  epistemicLane = fields.Selection({ selection: EPISTEMIC_LANE_SELECTION, default: 'UNRESOLVED', required: true, index: true })
  authorityClass = fields.Selection({ selection: AUTHORITY_CLASS_SELECTION, default: 'NOT_APPLICABLE', required: true, index: true })
  operationalStatus = fields.Selection({ selection: OPERATIONAL_STATUS_SELECTION, default: 'PROVISIONAL', required: true, index: true })
  polarity = fields.Selection({ selection: RELATION_POLARITY_SELECTION, default: 'AFFIRMED', required: true, index: true })
  modality = fields.Selection({ selection: RELATION_MODALITY_SELECTION, default: 'ASSERTED', required: true, index: true })
  confidenceBp = fields.Integer({ default: 0, min: 0, max: 10000 })
  sourceRevision = fields.Char({ size: 160, index: true })
  ontologyVersion = fields.Char({ required: true, default: 'WITNESS_RELATION_V1', size: 80, index: true })
  validFrom = fields.DateTime({ index: true })
  validTo = fields.DateTime({ index: true })
  qualifier = fields.Text()
  active = fields.Boolean({ default: true, index: true })
}
