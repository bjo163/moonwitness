import type { IncomingMessage, ServerResponse } from 'node:http'
import { createCtx, getModel } from '@moon/orm'
import { verifyToken } from '@moon/server'
import { globalRoutes } from '@moon/server/dist/router.ts'
import {
  entityProfile,
  figureMentions,
  findEntities,
  passageByReference,
  passageContent,
  passageTree
} from './domain-queries.ts'

const HEADERS = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*'
}

let registered = false

function query(req: IncomingMessage): URLSearchParams {
  return new URL(req.url ?? '/', 'http://moonwitness.local').searchParams
}

function integer(value: string | null | undefined): number | undefined {
  if (!value?.trim()) return undefined
  const parsed = Number(value)
  return Number.isInteger(parsed) ? parsed : undefined
}

function send(res: ServerResponse, status: number, payload: unknown): void {
  res.writeHead(status, HEADERS)
  res.end(JSON.stringify(payload))
}

function requestEnv(req: IncomingMessage, jwtSecret: string) {
  const decoded = verifyToken(req, jwtSecret)
  return createCtx(decoded.sub, {}, getModel as any)
}

function guard(handler: (req: IncomingMessage, res: ServerResponse) => Promise<void>, jwtSecret: string) {
  return async (req: IncomingMessage, res: ServerResponse) => {
    try {
      await handler(req, res)
    } catch (error: any) {
      const status = error?.statusCode === 401 || error?.message?.includes('token') ? 401 : 403
      send(res, status, { error: status === 401 ? 'Authentication required' : 'Graph query denied' })
    }
  }
}

/** Register read-only, authenticated, bounded graph/domain query endpoints. */
export function registerWitnessGraphRoutes(jwtSecret: string): void {
  if (registered) return
  registered = true

  globalRoutes.push({
    method: 'GET',
    path: '/api/witness/graph/entities',
    handler: guard(async (req, res) => {
      const params = query(req)
      const entities = await findEntities(requestEnv(req, jwtSecret), {
        stableKey: params.get('stableKey') ?? undefined,
        query: params.get('q') ?? undefined,
        kind: params.get('kind') ?? undefined,
        limit: integer(params.get('limit'))
      })
      send(res, 200, { count: entities.length, entities })
    }, jwtSecret)
  })

  globalRoutes.push({
    method: 'GET',
    path: '/api/witness/graph/entities/:entityId/profile',
    handler: guard(async (req, res) => {
      const entityId = integer((req as any).params?.entityId)
      if (!entityId || entityId < 1) return send(res, 400, { error: 'entityId must be a positive integer' })
      const profile = await entityProfile(requestEnv(req, jwtSecret), entityId)
      if (!profile) return send(res, 404, { error: 'Entity not found' })
      send(res, 200, profile)
    }, jwtSecret)
  })

  globalRoutes.push({
    method: 'GET',
    path: '/api/witness/graph/passages',
    handler: guard(async (req, res) => {
      const params = query(req)
      const passage = await passageByReference(requestEnv(req, jwtSecret), params.get('reference') ?? '', integer(params.get('scriptureId')))
      if (!passage) return send(res, 404, { error: 'Passage not found' })
      send(res, 200, { passage })
    }, jwtSecret)
  })

  globalRoutes.push({
    method: 'GET',
    path: '/api/witness/graph/passages/:passageId/content',
    handler: guard(async (req, res) => {
      const passageId = integer((req as any).params?.passageId)
      if (!passageId || passageId < 1) return send(res, 400, { error: 'passageId must be a positive integer' })
      const content = await passageContent(requestEnv(req, jwtSecret), passageId, integer(query(req).get('limit')))
      send(res, 200, { passageId, count: content.length, content })
    }, jwtSecret)
  })

  globalRoutes.push({
    method: 'GET',
    path: '/api/witness/graph/passages/:passageId/tree',
    handler: guard(async (req, res) => {
      const passageId = integer((req as any).params?.passageId)
      if (!passageId || passageId < 1) return send(res, 400, { error: 'passageId must be a positive integer' })
      const params = query(req)
      const tree = await passageTree(requestEnv(req, jwtSecret), passageId, integer(params.get('depth')), integer(params.get('limit')))
      if (!tree) return send(res, 404, { error: 'Passage not found' })
      send(res, 200, tree)
    }, jwtSecret)
  })

  globalRoutes.push({
    method: 'GET',
    path: '/api/witness/graph/figures/:entityId/mentions',
    handler: guard(async (req, res) => {
      const entityId = integer((req as any).params?.entityId)
      if (!entityId || entityId < 1) return send(res, 400, { error: 'entityId must be a positive integer' })
      const result = await figureMentions(requestEnv(req, jwtSecret), entityId, integer(query(req).get('limit')))
      if (!result) return send(res, 404, { error: 'Person entity not found' })
      send(res, 200, { ...result, count: result.mentions.length })
    }, jwtSecret)
  })
}
