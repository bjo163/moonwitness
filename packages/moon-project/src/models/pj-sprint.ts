import { Vertex, fields } from '@moon/orm'
import { enforceExistingCompanyScope } from './project-scope.js'

export default class PjSprint extends Vertex {
  static _name = 'pj.sprint'
  static _description = 'Project Sprint / Iteration'

  name = fields.Char({ required: true, size: 80 })
  projectId = fields.Many2one({ comodel: 'pj.project', required: true, index: true })
  startDate = fields.Date()
  endDate = fields.Date()
  status = fields.Selection({
    selection: [
      ['draft', 'Draft'],
      ['active', 'Active'],
      ['completed', 'Completed']
    ],
    default: 'draft',
    index: true
  })
  companyId = fields.Many2one({ comodel: 'vx.org', index: true })
  static async beforeSave(_: any, env: any, vals: Record<string, any>, id?: number) { await enforceExistingCompanyScope(env, 'pj_sprint', id, vals, 'pj_project') }
}
