import { Vertex, fields } from '@moon/orm'
import { SOURCE_POLICY_ROLE_SELECTION } from '../graph/contracts.js'

/**
 * wx.source.policy — versioned policy describing how a pinned source revision
 * may participate in a named analysis profile.
 *
 * Policy never lives as a mutable authority field on wx.source. This permits
 * historical replay against the exact policy/version used by an engine run.
 */
export default class WxSourcePolicy extends Vertex {
  static _name = 'wx.source.policy'
  static _description = 'Witness Versioned Source Policy'

  stableKey = fields.Char({ required: true, unique: true, index: true, size: 220 })
  policyCode = fields.Char({ required: true, size: 120, index: true })
  policyVersion = fields.Char({ required: true, size: 80, index: true })
  sourceId = fields.Many2one({ comodel: 'wx.source', required: true, index: true })
  sourceRevision = fields.Char({ size: 160, index: true })
  role = fields.Selection({ selection: SOURCE_POLICY_ROLE_SELECTION, required: true, index: true })
  originalRevelationEquated = fields.Boolean({ default: false })
  corroborationRole = fields.Char({ size: 120, index: true })
  allowedEngineUses = fields.Text()
  policyNote = fields.Text()
  validFrom = fields.DateTime({ index: true })
  validTo = fields.DateTime({ index: true })
  active = fields.Boolean({ default: true, index: true })
}
