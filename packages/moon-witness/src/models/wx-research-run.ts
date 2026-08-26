import { Vertex, fields } from '@moon/orm'

/** Immutable research-specific lineage linked to the shared Witness Engine run. */
export default class WxResearchRun extends Vertex {
  static _name = 'wx.research.run'
  static _description = 'Witness Research Run'
  runKey = fields.Char({ required: true, unique: true, size: 300, index: true })
  hypothesisId = fields.Many2one({ comodel: 'wx.research.hypothesis', required: true, index: true })
  engineRunId = fields.Many2one({ comodel: 'wx.engine.run', required: true, index: true })
  corpusRevisions = fields.Text({ required: true })
  selectionCriteria = fields.Text({ required: true })
  methodParameters = fields.Text({ required: true })
  algorithmVersion = fields.Char({ required: true, size: 120 })
  deterministic = fields.Boolean({ required: true, default: true, index: true })
  aiConfigurationFingerprint = fields.Char({ size: 128 })
  evidenceIdentity = fields.Text({ required: true })
  conflictCount = fields.Integer({ required: true, default: 0 })
  unresolvedCount = fields.Integer({ required: true, default: 0 })
  outputChecksum = fields.Char({ required: true, size: 64, index: true })
  createdAt = fields.DateTime({ required: true, index: true })
  active = fields.Boolean({ default: true, index: true })
}
