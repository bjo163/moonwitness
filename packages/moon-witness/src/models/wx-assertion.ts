import { Vertex, fields } from '@moon/orm'
import { OPERATIONAL_STATUS_SELECTION, SOURCE_CLASS_SELECTION } from '../graph/contracts.ts'

const ASSERTION_CLASS_SELECTION: Array<[string, string]> = [
  ['EXPLICIT_SOURCE', 'Explicit Source'],
  ['SOURCE_SUMMARY', 'Source Summary'],
  ['SCHOLARLY_INTERPRETATION', 'Scholarly Interpretation'],
  ['DERIVED', 'Derived'],
  ['HYPOTHESIS', 'Hypothesis']
]

/** Claim record that keeps source statement, interpretation, and hypothesis distinct. */
export default class WxAssertion extends Vertex {
  static _name = 'wx.assertion'
  static _description = 'Witness Claim / Assertion'

  entityId = fields.Many2one({ comodel: 'wx.entity', required: true, index: true })
  subjectEntityId = fields.Many2one({ comodel: 'wx.entity', required: true, index: true })
  predicate = fields.Char({ required: true, size: 160, index: true })
  objectEntityId = fields.Many2one({ comodel: 'wx.entity', index: true })
  objectValue = fields.Text()
  assertionClass = fields.Selection({ selection: ASSERTION_CLASS_SELECTION, required: true, index: true })
  sourceClass = fields.Selection({ selection: SOURCE_CLASS_SELECTION, default: 'UNKNOWN', required: true, index: true })
  methodVersion = fields.Char({ size: 120, index: true })
  status = fields.Selection({ selection: OPERATIONAL_STATUS_SELECTION, default: 'PROVISIONAL', required: true, index: true })
  confidenceBp = fields.Integer({ default: 0, min: 0, max: 10000 })
  sourceId = fields.Many2one({ comodel: 'wx.source', index: true })
  provenanceId = fields.Many2one({ comodel: 'wx.provenance', index: true })
  active = fields.Boolean({ default: true, index: true })
}
