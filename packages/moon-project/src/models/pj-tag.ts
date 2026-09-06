import { Vertex, fields } from '@moon/orm'
import { enforceExistingCompanyScope } from './project-scope.js'

export default class PjTag extends Vertex {
  static _name = 'pj.tag'
  static _description = 'Project Tag'

  name = fields.Char({ required: true, size: 40, unique: true })
  color = fields.Char({ size: 7, default: '#00F0FF' })
  companyId = fields.Many2one({ comodel: 'vx.org', index: true })
  static async beforeSave(_: any, env: any, vals: Record<string, any>, id?: number) { await enforceExistingCompanyScope(env, 'pj_tag', id, vals) }
}
