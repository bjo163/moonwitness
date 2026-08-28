import { Vertex, fields } from '@moon/orm'
import { RECORD_STATUS_SELECTION } from '../graph/contracts.ts'

const DIVINE_EXPRESSION_TYPE_SELECTION: Array<[string, string]> = [
  ['NAME', 'Name'],
  ['ATTRIBUTE', 'Attribute'],
  ['PREDICATE', 'Predicate'],
  ['ACTION', 'Action'],
  ['RELATION', 'Relation']
]

/** Corpus-mined divine expression; not a fixed-count authoritative list. */
export default class WxDivineExpression extends Vertex {
  static _name = 'wx.divine.expression'
  static _description = 'Witness Corpus-Mined Divine Expression'

  entityId = fields.Many2one({ comodel: 'wx.entity', required: true, index: true })
  languageCode = fields.Char({ required: true, size: 12, index: true })
  lexicalForm = fields.Char({ required: true, size: 240, index: true })
  lemma = fields.Char({ size: 240, index: true })
  rootId = fields.Many2one({ comodel: 'wx.root', index: true })
  expressionType = fields.Selection({ selection: DIVINE_EXPRESSION_TYPE_SELECTION, required: true, index: true })
  sourceId = fields.Many2one({ comodel: 'wx.source', required: true, index: true })
  provenanceId = fields.Many2one({ comodel: 'wx.provenance', required: true, index: true })
  status = fields.Selection({ selection: RECORD_STATUS_SELECTION, default: 'PROVISIONAL', required: true, index: true })
  active = fields.Boolean({ default: true, index: true })
}
