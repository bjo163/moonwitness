import { getModel } from '@moon/orm'
import { defineRoute } from '@moon/server'
import { chooseMethod, type MethodInput } from './engine.ts'

function parseBoolean(value: string | undefined): boolean {
  if (value === 'true') return true
  return false
}

defineRoute({
  method: 'GET',
  path: '/api/mizan/decision',
  handler: async ({ query }) => {
    const input: MethodInput = {
      generalSufficient: parseBoolean(query.generalSufficient),
      balanceSatisfied: parseBoolean(query.balanceSatisfied),
      internalReferenceVerified: parseBoolean(query.internalReferenceVerified),
    }

    return { decision: chooseMethod(input) }
  },
})

defineRoute({
  method: 'GET',
  path: '/api/mizan/summary',
  handler: async ({ env }) => {
    const MzCase = getModel('mz.case')
    if (!MzCase) {
      throw new Error('Model mz.case not found')
    }

    const [total, assessed, needsReference] = await Promise.all([
      MzCase.searchCount(MzCase, env),
      MzCase.searchCount(MzCase, env, [['status', '=', 'assessed']]),
      MzCase.searchCount(MzCase, env, [['status', '=', 'needs_reference']]),
    ])

    return { total, assessed, needsReference }
  },
})

export function registerMizanRoutes() {
  console.log('[moon-mizan] API routes registered')
}
