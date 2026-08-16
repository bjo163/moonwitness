import { createCtx, getModel, SUPERUSER_ID } from '@moon/orm'
// @ts-ignore -- server package does not expose this runtime module in its type map
import { globalRoutes } from '@moon/server/dist/router.js'

const headers = { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }

function sendJson(res: any, status: number, data: unknown) {
  res.writeHead(status, headers)
  res.end(JSON.stringify(data))
}

globalRoutes.push({
  method: 'GET',
  path: '/api/cab/summary',
  handler: async (_req: any, res: any) => {
    try {
      const env = createCtx(SUPERUSER_ID, {}, getModel as any)
      const Project = getModel('cab.project')
      const Task = getModel('cab.task')
      const Change = getModel('cab.change')
      const Meeting = getModel('cab.meeting')

      if (!Project || !Task || !Change || !Meeting) {
        return sendJson(res, 500, { error: 'CAB models are not registered' })
      }

      const [projects, tasks, changes, meetings] = await Promise.all([
        (Project as any).search(Project, env, [], { limit: 8, order: 'updated_at DESC' }),
        (Task as any).search(Task, env, [], { limit: 8, order: 'due_date ASC' }),
        (Change as any).search(Change, env, [], { limit: 8, order: 'scheduled_for ASC' }),
        (Meeting as any).search(Meeting, env, [['status', '=', 'scheduled']], { limit: 3, order: 'scheduled_for ASC' })
      ])

      const submitted = await Change.searchCount(Change, env, [['status', 'in', ['submitted', 'in_review']]])
      const approved = await Change.searchCount(Change, env, [['status', '=', 'approved']])
      const blocked = await Task.searchCount(Task, env, [['status', '=', 'blocked']])

      return sendJson(res, 200, {
        success: true,
        data: { projects, tasks, changes, meetings, metrics: { submitted, approved, blocked } }
      })
    } catch (error: any) {
      return sendJson(res, 500, { error: error.message })
    }
  }
})

export function registerCabRoutes() {
  console.log('[moon-cab] API routes registered')
}