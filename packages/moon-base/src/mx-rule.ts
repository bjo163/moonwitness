import { Vertex } from '@moon/orm'
import { fields } from '@moon/orm'

export default class MxRule extends Vertex {
  static _name = 'mx.rule'
  static _description = 'Record Rules'

  name = fields.Char({ required: true })
  modelId = fields.Many2one({ comodel: 'mx.model', required: true })
  domainForce = fields.Text({ required: true }) // array stringified e.g. "[['company_id', '=', user.company_id]]"
  groups = fields.Many2many({ comodel: 'vx.role' })
}
