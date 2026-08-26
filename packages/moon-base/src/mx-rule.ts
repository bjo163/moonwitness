import { Vertex, fields } from '@moon/orm'

export default class MxRule extends Vertex {
  static override _name = 'mx.rule'
  static override _description = 'Record Rules'

  name = fields.Char({ required: true, size: 120 })
  modelId = fields.Many2one({ comodel: 'mx.model', required: true, index: true })
  domainForce = fields.Text({ required: true }) // stringified domain e.g. "[['company_id', '=', user.company_id]]"
  roleIds = fields.Many2many({ comodel: 'vx.role', relation: 'mx_rule_vx_role_rel' })
  active = fields.Boolean({ default: true, index: true })
  permRead = fields.Boolean({ default: true })
  permWrite = fields.Boolean({ default: true })
  permCreate = fields.Boolean({ default: true })
  permUnlink = fields.Boolean({ default: true })
}
