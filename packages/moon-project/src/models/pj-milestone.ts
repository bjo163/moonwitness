import { Vertex, fields } from '@moon/orm'
import { enforceExistingCompanyScope } from './project-scope.js'

export default class PjMilestone extends Vertex {
  static _name = 'pj.milestone'
  static _description = 'Project Milestone'

  name = fields.Char({ required: true, size: 120 })
  projectId = fields.Many2one({ comodel: 'pj.project', required: true, index: true })
  deadline = fields.Date({ index: true })
  isReached = fields.Boolean({ default: false })
  companyId = fields.Many2one({ comodel: 'vx.org', index: true })
  static async beforeSave(_: any, env: any, vals: Record<string, any>, id?: number) { await enforceExistingCompanyScope(env, 'pj_milestone', id, vals, 'pj_project') }
}
