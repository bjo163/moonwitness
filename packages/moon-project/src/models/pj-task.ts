import { Vertex, fields } from '@moon/orm'
import { enforceExistingCompanyScope } from './project-scope.js'

export default class PjTask extends Vertex {
  static _name = 'pj.task'
  static _description = 'Project Task / Work Item'
  static _rec_name = 'title'

  title = fields.Char({ required: true, size: 180, index: true })
  description = fields.Text()
  projectId = fields.Many2one({ comodel: 'pj.project', required: true, index: true })
  companyId = fields.Many2one({ comodel: 'vx.org', index: true })
  stageId = fields.Many2one({ comodel: 'pj.stage', index: true })
  assigneeId = fields.Many2one({ comodel: 'vx.user', index: true })
  priority = fields.Selection({
    selection: [
      ['low', 'Low'],
      ['normal', 'Normal'],
      ['high', 'High'],
      ['critical', 'Critical']
    ],
    default: 'normal',
    index: true
  })
  sprintId = fields.Many2one({ comodel: 'pj.sprint', index: true })
  milestoneId = fields.Many2one({ comodel: 'pj.milestone', index: true })
  ticketId = fields.Many2one({ comodel: 'hd.ticket', index: true })
  estimatedHours = fields.Float({ default: 0 })
  dueDate = fields.Date({ index: true })
  tagIds = fields.Many2many({ comodel: 'pj.tag', relation: 'pj_task_tag_rel' })

  static async beforeSave(_: any, env: any, vals: Record<string, any>, id?: number) { await enforceExistingCompanyScope(env, 'pj_task', id, vals, 'pj_project') }
}
