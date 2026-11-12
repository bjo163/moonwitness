import { getModel } from '@moon/orm'
import { defineRoute } from '@moon/server'
import {
  MizanMethodPreviewQuerySchema,
  MizanMethodPreviewResponseSchema,
} from '@moon/protocol'
import { chooseMethod, type MethodInput } from './engine.js'

function parseBoolean(value: string | undefined): boolean {
  if (value === 'true') return true
  return false
}

defineRoute({
  method: 'GET',
  path: '/api/mizan/decision',
  schema: {
    query: MizanMethodPreviewQuerySchema,
  },
  response: MizanMethodPreviewResponseSchema,
  handler: async ({ query }) => {
    const input: MethodInput = {
      generalSufficient: parseBoolean(query.generalSufficient),
      balanceSatisfied: parseBoolean(query.balanceSatisfied),
      internalReferenceVerified: parseBoolean(query.internalReferenceVerified),
    }

    const preview = chooseMethod(input)
    return {
      decision: {
        method: preview.method,
        phase: preview.phase,
        eligible_for_prophetic: preview.eligibleForProphetic,
        limitation: preview.limitation,
      },
    }
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
