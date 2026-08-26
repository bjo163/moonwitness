import { Vertex, fields } from '@moon/orm'

/**
 * wx.relation.type — versioned predicate registry.
 *
 * allowedSourceKinds / allowedTargetKinds use canonical sorted CSV strings so
 * the schema remains portable on the current Moon ORM. Validation is performed
 * by graph services before relation creation.
 */
export default class WxRelationType extends Vertex {
  static _name = 'wx.relation.type'
  static _description = 'Witness Relation Predicate Type'

  code = fields.Char({ required: true, unique: true, index: true, size: 100 })
  name = fields.Char({ required: true, size: 180, index: true })
  inverseTypeId = fields.Many2one({ comodel: 'wx.relation.type', index: true })
  symmetric = fields.Boolean({ default: false, index: true })
  transitive = fields.Boolean({ default: false })
  selfLoopAllowed = fields.Boolean({ default: false })
  provenanceRequired = fields.Boolean({ default: true })
  reviewRequired = fields.Boolean({ default: false })
  allowedSourceKinds = fields.Text()
  allowedTargetKinds = fields.Text()
  ontologyVersion = fields.Char({ required: true, default: 'WITNESS_RELATION_V1', size: 80, index: true })
  semantics = fields.Text()
  active = fields.Boolean({ default: true, index: true })
}
