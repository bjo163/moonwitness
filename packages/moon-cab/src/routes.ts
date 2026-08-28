import { getModel } from '@moon/orm'
import { defineRoute } from '@moon/server'

defineRoute({
  method: 'GET',
  path: '/api/cab/summary',
  handler: async ({ env }) => {
    const Project = getModel('pj.project')
    const Task = getModel('pj.task')
    const Change = getModel('cab.change')
    const Meeting = getModel('cab.meeting')

    if (!Project || !Task || !Change || !Meeting) {
      throw new Error('CAB/Project models are not registered')
    }

    const [projects, tasks, changes, meetings] = await Promise.all([
      (Project as any).search(Project, env, [], { limit: 8, order: 'updated_at DESC' }),
      (Task as any).search(Task, env, [], { limit: 8, order: 'due_date ASC' }),
      (Change as any).search(Change, env, [], { limit: 8, order: 'scheduled_for ASC' }),
      (Meeting as any).search(Meeting, env, [['status', '=', 'scheduled']], { limit: 3, order: 'scheduled_for ASC' })
    ])

    const submitted = await Change.searchCount(Change, env, [['status', 'in', ['submitted', 'in_review']]])
    const approved = await Change.searchCount(Change, env, [['status', '=', 'approved']])
    const blocked = Task.searchCount ? await Task.searchCount(Task, env, [['priority', '=', 'critical']]) : 0

    return {
      success: true,
      data: { projects, tasks, changes, meetings, metrics: { submitted, approved, blocked } }
    }
  }
})

export function registerCabRoutes() {
  console.log('[moon-cab] API routes registered')
}
