import { Vertex, fields } from '@moon/orm'
import { RELATION_POLARITY_SELECTION } from '../graph/contracts.js'

const EVIDENCE_RELATION_SELECTION: Array<[string, string]> = [
  ['SUPPORTS', 'Supports'],
  ['CONTRADICTS', 'Contradicts'],
  ['CONTEXTUALIZES', 'Contextualizes'],
  ['QUALIFIES', 'Qualifies'],
  ['MENTIONS', 'Mentions']
]

/** Evidence link between a claim and an exact source/entity/content reference. */
export default class WxEvidence extends Vertex {
  static _name = 'wx.evidence'
  static _description = 'Witness Assertion Evidence'

  assertionId = fields.Many2one({ comodel: 'wx.assertion', required: true, index: true })
  evidenceEntityId = fields.Many2one({ comodel: 'wx.entity', index: true })
  contentId = fields.Many2one({ comodel: 'wx.content', index: true })
  relation = fields.Selection({ selection: EVIDENCE_RELATION_SELECTION, required: true, index: true })
  polarity = fields.Selection({ selection: RELATION_POLARITY_SELECTION, default: 'AFFIRMED', required: true, index: true })
  weightBp = fields.Integer({ default: 0, min: 0, max: 10000 })
  sourceReference = fields.Char({ size: 240 })
  provenanceId = fields.Many2one({ comodel: 'wx.provenance', required: true, index: true })
  active = fields.Boolean({ default: true, index: true })
}
