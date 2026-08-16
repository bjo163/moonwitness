import { createCtx, getModel, SUPERUSER_ID } from '@moon/orm'
// @ts-ignore — deep import works at runtime; server pkg lacks exports map for TS resolution
import { globalRoutes } from '@moon/server/dist/router.js'
import { chooseMethod, type MethodInput } from './engine.js'

const HEADERS = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*'
}

function sendJson(res: any, status: number, data: unknown) {
  res.writeHead(status, HEADERS)
  res.end(JSON.stringify(data))
}

function parseBoolean(value: string | null): boolean | null {
  if (value === 'true') return true
  if (value === 'false') return false
  return null
}

globalRoutes.push({
  method: 'GET',
  path: '/api/mizan/decision',
  handler: (req: any, res: any) => {
    const url = new URL(req.url || '', 'http://localhost')
    const input: MethodInput = {
      generalSufficient: parseBoolean(url.searchParams.get('generalSufficient')) ?? false,
      balanceSatisfied: parseBoolean(url.searchParams.get('balanceSatisfied')) ?? false,
      internalReferenceVerified: parseBoolean(url.searchParams.get('internalReferenceVerified')) ?? false
    }

    sendJson(res, 200, { decision: chooseMethod(input) })
  }
})

globalRoutes.push({
  method: 'GET',
  path: '/api/mizan/summary',
  handler: async (_req: any, res: any) => {
    try {
      const MzCase = getModel('mz.case')
      if (!MzCase) {
        return sendJson(res, 500, { error: 'Model mz.case not found' })
      }

      const env = createCtx(SUPERUSER_ID, {}, getModel as any)
      const [total, assessed, needsReference] = await Promise.all([
        MzCase.searchCount(MzCase, env),
        MzCase.searchCount(MzCase, env, [['status', '=', 'assessed']]),
        MzCase.searchCount(MzCase, env, [['status', '=', 'needs_reference']])
      ])

      return sendJson(res, 200, { total, assessed, needsReference })
    } catch (error: any) {
      return sendJson(res, 500, { error: error.message })
    }
  }
})

export function registerMizanRoutes() {
  console.log('[moon-mizan] API routes registered')
}
