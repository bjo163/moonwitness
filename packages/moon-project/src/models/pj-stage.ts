import { Vertex, fields } from '@moon/orm'
import { enforceExistingCompanyScope } from './project-scope.js'

export default class PjStage extends Vertex {
  static _name = 'pj.stage'
  static _description = 'Project Kanban Stage'

  name = fields.Char({ required: true, size: 80 })
  sequence = fields.Integer({ default: 1 })
  projectId = fields.Many2one({ comodel: 'pj.project', required: true, index: true })
  fold = fields.Boolean({ default: false })
  isClosing = fields.Boolean({ default: false })
  companyId = fields.Many2one({ comodel: 'vx.org', index: true })
  static async beforeSave(_: any, env: any, vals: Record<string, any>, id?: number) { await enforceExistingCompanyScope(env, 'pj_stage', id, vals, 'pj_project') }
}
