import type { IncomingMessage, ServerResponse } from 'node:http'
import { createHash } from 'node:crypto'
import { getModel, createCtx, AuthorizationError } from '@moon/orm'
import { parseBody, sendJson, parseUrl } from '../utils/http.js'
import { logger } from '../logger.js'
import { authenticateRequest, AuthError } from '../utils/auth.js'
import { getOdooSession, OdooClient } from '@moon/odoo-bridge'
import { isMutationRateLimited } from './mutation-rate-limit.js'
import {
  MAX_LIMIT,
  DEFAULT_LIMIT,
  MAX_RELATIONS,
  ORDER_REGEX,
  DOMAIN_OPERATOR_SET,
  RESERVED_REST_PARAMS,
  MizanEvaluateRequestSchema,
} from '@moon/protocol'

const VALID_PARAM_KEY_REGEX = /^[a-zA-Z0-9_]+$/
const VALID_MODEL_REGEX = /^[a-z][a-z0-9._]*$/
const RESERVED_PARAMS = new Set<string>(RESERVED_REST_PARAMS)
const VALID_ORDER_REGEX = ORDER_REGEX
const VALID_DOMAIN_OPERATORS = DOMAIN_OPERATOR_SET
const ODOO_MODEL_MAP: Record<string, string> = {
  'vx.user': 'res.users',
  'vx.company': 'res.company',
  'pj.project': 'project.project',
  'pj.task': 'project.task',
  'pj.stage': 'project.task.type',
  'pj.milestone': 'project.milestone',
  'wx.source': 'moon.witness.source',
  'wx.source.artifact': 'moon.witness.artifact',
  'wx.source.snapshot': 'moon.witness.snapshot',
  'wx.passage': 'moon.witness.passage',
  'wx.evidence': 'moon.witness.evidence',
  'wx.provenance': 'moon.witness.provenance',
  'wx.scripture': 'moon.witness.scripture',
  'wx.scripture.book': 'moon.witness.scripture.book',
  'wx.scripture.verse': 'moon.witness.scripture.verse',
  'wx.tradition': 'moon.witness.tradition',
  'wx.tradition.item': 'moon.witness.tradition.item',
  'wx.asmaul.husna': 'moon.witness.asmaul.husna',
  'wx.devotion': 'moon.witness.devotion',
  'wx.bookmark': 'moon.witness.bookmark',
  'wx.history': 'moon.witness.history',
  'wx.entity': 'moon.witness.entity',
  'wx.content': 'moon.witness.content',
  'wx.assertion': 'moon.witness.assertion',
  'wx.relation': 'moon.witness.relation',
  'wx.research.run': 'moon.witness.research.run',
  'wx.research.hypothesis': 'moon.witness.research.hypothesis',
  'wx.engine.run': 'moon.witness.engine.run',
  'wx.engine.result': 'moon.witness.engine.result',
  'wx.text.edition': 'moon.witness.text.edition',
  'wx.tradition.corpus': 'moon.witness.tradition.corpus',
  'wx.tradition.unit': 'moon.witness.tradition.unit',
  'wx.tradition.reference': 'moon.witness.tradition.reference',
  'wx.root': 'moon.witness.root',
  'wx.lexeme': 'moon.witness.lexeme',
  'wx.source.manifest': 'moon.witness.source.manifest',
  'wx.source.policy': 'moon.witness.source.policy',
  'mz.category': 'moon.mizan.category',
  'mz.jurisdiction': 'moon.mizan.jurisdiction',
  'mz.method.profile': 'moon.mizan.method.profile',
  'mz.criterion': 'moon.mizan.criterion',
  'mz.regulation': 'moon.mizan.regulation',
  'mz.article': 'moon.mizan.article',
  'mz.case': 'moon.mizan.case',
  'mz.assessment': 'moon.mizan.assessment',
  'mz.claim': 'moon.mizan.claim',
  'mz.assessment.line': 'moon.mizan.assessment.line',
  'mz.review': 'moon.mizan.review',
  'mz.reference': 'moon.mizan.reference',
  'mz.engine.run': 'moon.mizan.engine.run',
  'mz.engine.result': 'moon.mizan.engine.result',
}

const ODOO_READ_FIELDS: Record<string, string[]> = {
  'res.users': ['id', 'name', 'display_name', 'login', 'email', 'active', 'company_id', 'write_date'],
  'res.company': ['id', 'name', 'active', 'currency_id', 'write_date'],
  'project.project': ['id', 'name', 'description', 'active', 'company_id', 'write_date'],
  'project.task': ['id', 'name', 'description', 'active', 'project_id', 'user_ids', 'date_deadline', 'priority', 'write_date'],
  'project.task.type': ['id', 'name', 'sequence', 'fold', 'active', 'write_date'],
  'project.milestone': ['id', 'name', 'project_id', 'deadline', 'reached', 'write_date'],
  'moon.witness.text.edition': ['id', 'name', 'source_id', 'language', 'revision', 'checksum', 'active', 'write_date'],
  'moon.witness.tradition.corpus': ['id', 'name', 'slug', 'source_id', 'edition_id', 'language', 'active', 'write_date'],
  'moon.witness.tradition.unit': ['id', 'name', 'corpus_id', 'stable_key', 'sequence', 'text', 'provenance_id', 'active', 'write_date'],
  'moon.witness.tradition.reference': ['id', 'name', 'unit_id', 'corpus_id', 'edition_id', 'source_id', 'local_number', 'stable_key', 'provenance_id', 'active', 'write_date'],
  'moon.witness.root': ['id', 'name', 'entity_id', 'stable_key', 'language_code', 'script', 'written_form', 'transliteration', 'source_id', 'provenance_id', 'active', 'write_date'],
  'moon.witness.lexeme': ['id', 'name', 'entity_id', 'stable_key', 'language_code', 'script', 'lemma', 'transliteration', 'root_id', 'morphology', 'source_id', 'provenance_id', 'active', 'write_date'],
  'moon.witness.source.manifest': ['id', 'name', 'code', 'source_id', 'source_kind', 'parser_version', 'normalization_version', 'policy_version', 'manifest_checksum', 'active', 'write_date'],
  'moon.witness.source.policy': ['id', 'name', 'version', 'authority_class', 'allowed_engine_use', 'source_kind', 'rules', 'active', 'write_date'],
}

function odooReadKwargs(model: string, extra: Record<string, unknown> = {}): Record<string, unknown> {
  const fields = ODOO_READ_FIELDS[model]
  return fields ? { fields, ...extra } : extra
}

function normalizeOdooRecord(model: string, row: Record<string, unknown>): Record<string, unknown> {
  if (model === 'vx.user') return { ...row, email: row.email ?? row.login, is_active: row.active, isActive: row.active, companyId: Array.isArray(row.company_id) ? row.company_id[0] : row.company_id }
  if (model === 'pj.project') return { ...row, status: row.active === false ? 'archived' : 'active', summary: row.description, updatedAt: row.write_date, companyId: Array.isArray(row.company_id) ? row.company_id[0] : row.company_id }
  if (model === 'pj.task') return { ...row, title: row.name, description: row.description, status: rowstate(row), priority: row.priority, dueDate: row.date_deadline, updatedAt: row.write_date, projectId: Array.isArray(row.project_id) ? row.project_id[0] : row.project_id, stageId: Array.isArray(row.stage_id) ? row.stage_id[0] : row.stage_id }
  return row
}

function rowstate(row: Record<string, unknown>): string {
  if (row.active === false) return 'archived'
  return Array.isArray(row.stage_id) && String(row.stage_id[1] ?? '').toLowerCase().includes('done') ? 'done' : 'open'
}

function denormalizeOdooValues(model: string, body: unknown): unknown {
  if (!body || typeof body !== 'object' || Array.isArray(body)) return body
  const values = { ...(body as Record<string, unknown>) }
  if (model === 'pj.task') {
    if (values.title !== undefined && values.name === undefined) values.name = values.title
    if (values.dueDate !== undefined && values.date_deadline === undefined) values.date_deadline = values.dueDate
    if (values.projectId !== undefined && values.project_id === undefined) values.project_id = values.projectId
    if (values.stageId !== undefined && values.stage_id === undefined) values.stage_id = values.stageId
    delete values.title; delete values.dueDate; delete values.projectId; delete values.stageId; delete values.status
  }
  if (model === 'pj.project') { if (values.summary !== undefined && values.description === undefined) values.description = values.summary; delete values.summary; delete values.status; delete values.updatedAt }
  if (model === 'vx.user') { if (values.is_active !== undefined && values.active === undefined) values.active = values.is_active; delete values.is_active; delete values.isActive }
  return values
}
export async function handleMizanEvaluate(req: IncomingMessage, res: ServerResponse, assessmentId: string, jwtSecret: string, odoo?: { baseUrl: string; database: string; username: string; password: string }): Promise<void> {
  try {
    const auth = await authenticateRequest(req, jwtSecret, { allowAnonymous: false })
    if (!odoo) return sendJson(res, 503, { error: 'Odoo integration is not configured', code: 'ODOO_UNAVAILABLE' }, req)
    const odooSessionKey = (auth as { odooSessionKey?: string }).odooSessionKey
    if (!odooSessionKey) return sendJson(res, 401, { error: 'Odoo session required', code: 'AUTH_REQUIRED' }, req)
    const session = getOdooSession(odooSessionKey)
    if (!session) return sendJson(res, 401, { error: 'Odoo session expired', code: 'AUTH_SESSION_EXPIRED' }, req)
    const id = Number(assessmentId)
    if (!Number.isSafeInteger(id) || id <= 0) return sendJson(res, 400, { error: 'Assessment ID must be a positive integer', code: 'INVALID_RECORD_ID' }, req)
    const parsed = MizanEvaluateRequestSchema.safeParse(await parseBody(req))
    if (!parsed.success) return sendJson(res, 400, { error: 'Invalid Mizan evaluate payload', code: 'INVALID_MIZAN_REQUEST', details: parsed.error.flatten() }, req)
    const client = new OdooClient(odoo)
    const body = parsed.data
    const inputHash = createHash('sha256').update(JSON.stringify(body)).digest('hex')
    const existingRuns = await client.callWithSession<Record<string, unknown>[]>(session.sessionId, { model: 'moon.mizan.engine.run', method: 'search_read', args: [[['request_key', '=', body.request_key]]], kwargs: { fields: ['id', 'request_key', 'input_hash', 'state', 'result_ids'], limit: 1 } })
    if (existingRuns.length) {
      const existing = existingRuns[0]!
      if (existing.input_hash !== inputHash) return sendJson(res, 409, { error: 'Request key already exists for different input', code: 'IDEMPOTENCY_CONFLICT' }, req)
      return sendJson(res, 200, { data: { request_key: body.request_key, state: existing.state, replay: true } }, req)
    }
    const rows = await client.callWithSession<Record<string, unknown>[]>(session.sessionId, { model: 'moon.mizan.assessment', method: 'read', args: [[id]], kwargs: { fields: ['id', 'profile_id', 'source_revision', 'state', 'method', 'general_weight', 'reference_weight', 'total_weight', 'score_max', 'score_available', 'limitation'] } })
    if (!rows.length) return sendJson(res, 404, { error: 'Assessment not found', code: 'RECORD_NOT_FOUND' }, req)
    const current = rows[0]!
    const profile = Array.isArray(current.profile_id) ? current.profile_id[0] : current.profile_id
    if (String(id) !== body.assessment_id) return sendJson(res, 409, { error: 'Payload assessment does not match route', code: 'ASSESSMENT_MISMATCH' }, req)
    const profileRows = await client.callWithSession<Record<string, unknown>[]>(session.sessionId, { model: 'moon.mizan.method.profile', method: 'read', args: [[profile]], kwargs: { fields: ['code', 'version', 'state', 'engine_version', 'contract_version'] } })
    const activeProfile = profileRows[0]
    if (!activeProfile || activeProfile.state !== 'published' || activeProfile.code !== body.profile_code || activeProfile.version !== body.profile_version) {
      return sendJson(res, 409, { error: 'Assessment profile is stale or does not match the published profile', code: 'STALE_PROFILE' }, req)
    }
    if (activeProfile.contract_version !== 'MIZAN_WEIGHTED_V1') return sendJson(res, 409, { error: 'Unsupported profile contract version', code: 'STALE_CONTRACT' }, req)
    if (String(current.source_revision || 'unresolved') !== body.source_revision) return sendJson(res, 409, { error: 'Assessment source revision is stale or does not match request', code: 'STALE_SOURCE_REVISION' }, req)
    const runId = await client.callWithSession<number>(session.sessionId, { model: 'moon.mizan.engine.run', method: 'create', args: [{ request_key: body.request_key, input_hash: inputHash, profile_hash: `${body.profile_code}@${body.profile_version}`, contract_version: 'MIZAN_WEIGHTED_V1', engine_version: 'odoo-native-1.0.0', source_revision: body.source_revision, assessment_id: id, state: 'running' }] })
    await client.callWithSession(session.sessionId, { model: 'moon.mizan.assessment', method: 'action_evaluate', args: [[id]] })
    const resultRows = await client.callWithSession<Record<string, unknown>[]>(session.sessionId, { model: 'moon.mizan.assessment', method: 'read', args: [[id]], kwargs: { fields: ['state', 'method', 'total_weight', 'score_max', 'score_available', 'limitation'] } })
    const result = resultRows[0] ?? {}
    const response = { request_key: body.request_key, state: result.state, method: result.method ?? null, score_available: Boolean(result.score_available), total_weight: result.total_weight ?? null, score_max: result.score_max ?? null, limitation: result.limitation ?? null, engine_version: 'odoo-native-1.0.0', contract_version: 'MIZAN_WEIGHTED_V1' }
    const outputHash = createHash('sha256').update(JSON.stringify(response)).digest('hex')
    await client.callWithSession(session.sessionId, { model: 'moon.mizan.engine.result', method: 'create', args: [{ run_id: runId, output_hash: outputHash, result_json: response, score_available: response.score_available, method: response.method }] })
    await client.callWithSession(session.sessionId, { model: 'moon.mizan.engine.run', method: 'write', args: [[runId], { state: 'succeeded' }] })
    return sendJson(res, 200, { data: response }, req)
  } catch (err: any) {
    if (err instanceof AuthError || err instanceof AuthorizationError) return sendJson(res, err.statusCode, { error: err.message, code: err.code }, req)
    return sendJson(res, err?.statusCode || 500, { error: err?.message || 'Mizan evaluation failed', code: err?.code || 'MIZAN_EVALUATION_FAILED' }, req)
  }
}

function parsePositiveInteger(value: string | null, fallback?: number): number | null {
  if (value === null) return fallback ?? null
  if (!/^\d+$/.test(value)) return null
  const parsed = Number(value)
  if (!Number.isSafeInteger(parsed) || parsed <= 0) return null
  return parsed
}

function getFieldDefs(ModelClass: any): Record<string, any> {
  return typeof ModelClass.getFieldDefs === 'function' ? ModelClass.getFieldDefs(ModelClass) || {} : {}
}

function resolveField(fieldDefs: Record<string, any>, name: string): string | null {
  if (!VALID_PARAM_KEY_REGEX.test(name)) return null
  if (Object.prototype.hasOwnProperty.call(fieldDefs, name)) return name
  const found = Object.keys(fieldDefs).find((key) => key.toLowerCase() === name.toLowerCase())
  return found || null
}

function validateWriteBody(body: unknown, fieldDefs: Record<string, any>): { ok: true; data: Record<string, unknown> } | { ok: false; field?: string } {
  if (!body || typeof body !== 'object' || Array.isArray(body)) return { ok: false }
  const data = body as Record<string, unknown>
  for (const key of Object.keys(data)) {
    if (!resolveField(fieldDefs, key)) return { ok: false, field: key }
  }
  return { ok: true, data }
}

function applyRelations(query: any, rawWith: string | null, fieldDefs: Record<string, any>): { ok: true } | { ok: false; error: string } {
  if (!rawWith) return { ok: true }
  const relations = rawWith.split(',').map((value) => value.trim()).filter(Boolean)
  if (relations.length > MAX_RELATIONS) {
    return { ok: false, error: `A maximum of ${MAX_RELATIONS} relations may be expanded` }
  }
  for (const requested of relations) {
    if (requested.includes('.')) return { ok: false, error: `Nested relation expansion is not supported: ${requested}` }
    const field = resolveField(fieldDefs, requested)
    if (!field) return { ok: false, error: `Unknown relation field: ${requested}` }
    const fieldDef = fieldDefs[field]
    if (!fieldDef || !['many2one', 'one2many', 'many2many'].includes(fieldDef.type)) {
      return { ok: false, error: `Field '${requested}' is not a relation` }
    }
    query.with(field)
  }
  return { ok: true }
}

async function handleOdooModelRequest(
  req: IncomingMessage,
  res: ServerResponse,
  model: string,
  odooModel: string,
  session: { sessionId: string },
  client: OdooClient,
  id: number | undefined,
): Promise<void> {
  const { searchParams } = parseUrl(req)
  let domain: unknown[] = []
  const rawDomain = searchParams.get('domain')
  if (rawDomain) {
    try {
      const parsed = JSON.parse(rawDomain)
      if (!Array.isArray(parsed)) throw new Error()
      domain = parsed
    } catch {
      return sendJson(res, 400, { error: 'Invalid JSON domain syntax', code: 'INVALID_DOMAIN' }, req)
    }
  }

  if (req.method === 'GET') {
    const rows = id === undefined
      ? await client.callWithSession<Record<string, unknown>[]>(session.sessionId, {
        model: odooModel,
        method: 'search_read',
        args: [domain],
        kwargs: odooReadKwargs(odooModel, { limit: Number(searchParams.get('limit') || 100), offset: Number(searchParams.get('offset') || 0) }),
      })
      : await client.callWithSession<Record<string, unknown>[]>(session.sessionId, {
        model: odooModel,
        method: 'read',
        args: [[id]],
        kwargs: odooReadKwargs(odooModel),
      })
    const normalized = rows.map((row) => normalizeOdooRecord(model, row))
    if (id !== undefined && normalized.length === 0) return sendJson(res, 404, { error: 'Record not found', code: 'RECORD_NOT_FOUND' }, req)
    return sendJson(res, 200, id === undefined
      ? { data: normalized, pagination: { page: 1, limit: normalized.length, total: normalized.length } }
      : { data: normalized[0] }, req)
  }

  const body = denormalizeOdooValues(model, await parseBody(req))
  if (req.method === 'POST') {
    const created = await client.callWithSession<number>(session.sessionId, { model: odooModel, method: 'create', args: [body] })
    const rows = await client.callWithSession<Record<string, unknown>[]>(session.sessionId, { model: odooModel, method: 'read', args: [[created]], kwargs: odooReadKwargs(odooModel) })
    return sendJson(res, 201, { data: normalizeOdooRecord(model, rows[0] ?? { id: created }) }, req)
  }
  if ((req.method === 'PUT' || req.method === 'PATCH') && id !== undefined) {
    await client.callWithSession(session.sessionId, { model: odooModel, method: 'write', args: [[id], body] })
    const rows = await client.callWithSession<Record<string, unknown>[]>(session.sessionId, { model: odooModel, method: 'read', args: [[id]], kwargs: odooReadKwargs(odooModel) })
    return sendJson(res, 200, { data: normalizeOdooRecord(model, rows[0] ?? {}) }, req)
  }
  if (req.method === 'DELETE' && id !== undefined) {
    await client.callWithSession(session.sessionId, { model: odooModel, method: 'unlink', args: [[id]] })
    return sendJson(res, 200, { success: true }, req)
  }
  return sendJson(res, 405, { error: 'Method not allowed', code: 'METHOD_NOT_ALLOWED' }, req)
}

export async function handleRest(
  req: IncomingMessage,
  res: ServerResponse,
  match: RegExpMatchArray,
  jwtSecret: string,
  odoo?: { baseUrl: string; database: string; username: string; password: string }
): Promise<void> {
  try {
    if (isMutationRateLimited(req.socket?.remoteAddress, req.method)) {
      return sendJson(res, 429, { error: 'Mutation rate limit exceeded', code: 'RATE_LIMITED' }, req)
    }
    const auth = await authenticateRequest(req, jwtSecret, { allowAnonymous: true })
    const uid = auth.uid
    const model = match[1] as string

    if (!VALID_MODEL_REGEX.test(model)) {
      return sendJson(res, 400, { error: `Invalid model name: ${model}`, code: 'INVALID_MODEL' }, req)
    }

    const odooModel = ODOO_MODEL_MAP[model]
    const odooSessionKey = (auth as { odooSessionKey?: string }).odooSessionKey
    if (odoo && model.startsWith('wx.') && !odooModel && req.method !== 'GET') {
      return sendJson(res, 409, {
        error: `Model '${model}' is not writable during Odoo migration`,
        code: 'MIGRATION_PENDING',
      }, req)
    }
    if (odoo && odooModel && !odooSessionKey) {
      return sendJson(res, 401, { error: 'Odoo session required', code: 'AUTH_REQUIRED' }, req)
    }
    if (odoo && odooModel && odooSessionKey) {
      const session = getOdooSession(odooSessionKey)
      if (!session) return sendJson(res, 401, { error: 'Odoo session expired', code: 'AUTH_SESSION_EXPIRED' }, req)
      const client = new OdooClient(odoo)
      const idStr = match[2]
      const id = idStr ? Number(idStr) : undefined
      if (idStr && (!Number.isSafeInteger(id) || (id as number) <= 0)) return sendJson(res, 400, { error: 'Record ID must be a positive integer', code: 'INVALID_RECORD_ID' }, req)
      return handleOdooModelRequest(req, res, model, odooModel, session, client, id)
    }

    const ModelClass = getModel(model) as any
    if (!ModelClass) {
      return sendJson(res, 404, { error: `Model ${model} not found`, code: 'MODEL_NOT_FOUND' }, req)
    }

    const idStr = match[2]
    let id: number | undefined
    if (idStr !== undefined) {
      const parsedId = parsePositiveInteger(idStr)
      if (parsedId === null) {
        return sendJson(res, 400, { error: 'Record ID must be a positive integer', code: 'INVALID_RECORD_ID' }, req)
      }
      id = parsedId
    }

    const { searchParams } = parseUrl(req)
    const env = createCtx(uid, {}, getModel)
    const fieldDefs = getFieldDefs(ModelClass)

    if (req.method === 'GET' && id === undefined) {
      const query = ModelClass.query(env)
      const page = parsePositiveInteger(searchParams.get('page'), 1)
      const requestedLimit = parsePositiveInteger(searchParams.get('limit'), DEFAULT_LIMIT)
      if (page === null || requestedLimit === null) {
        return sendJson(res, 400, { error: 'page and limit must be positive integers', code: 'INVALID_PAGINATION' }, req)
      }
      const limit = Math.min(requestedLimit, MAX_LIMIT)

      const rawOrder = searchParams.get('order') || searchParams.get('sort')
      if (rawOrder) {
        const orderParts = rawOrder.split(',').map((part) => part.trim()).filter(Boolean)
        if (orderParts.length === 0) {
          return sendJson(res, 400, { error: 'Invalid order specification', code: 'INVALID_ORDER' }, req)
        }
        for (const part of orderParts) {
          const matchOrder = part.match(/^([a-zA-Z0-9_]+)(?:\s+(asc|desc))?$/i)
          if (!matchOrder) return sendJson(res, 400, { error: 'Invalid order specification', code: 'INVALID_ORDER' }, req)
          const field = resolveField(fieldDefs, matchOrder[1]!)
          if (!field) return sendJson(res, 400, { error: `Unknown order field: ${matchOrder[1]}`, code: 'INVALID_ORDER_FIELD' }, req)
          query.orderBy(field, (matchOrder[2]?.toLowerCase() as 'asc' | 'desc') || 'asc')
        }
      }

      const rawDomain = searchParams.get('domain')
      if (rawDomain) {
        let parsedDomain: unknown
        try {
          parsedDomain = JSON.parse(rawDomain)
        } catch {
          return sendJson(res, 400, { error: 'Invalid JSON domain syntax', code: 'INVALID_DOMAIN' }, req)
        }
        if (!Array.isArray(parsedDomain)) {
          return sendJson(res, 400, { error: 'Domain must be a JSON array', code: 'INVALID_DOMAIN' }, req)
        }
        for (const item of parsedDomain) {
          if (!Array.isArray(item) || item.length !== 3 || typeof item[0] !== 'string' || typeof item[1] !== 'string') {
            return sendJson(res, 400, { error: 'Every domain clause must be [field, operator, value]', code: 'INVALID_DOMAIN' }, req)
          }
          const field = resolveField(fieldDefs, item[0])
          const op = item[1].toLowerCase()
          if (!field) return sendJson(res, 400, { error: `Unknown domain field: ${item[0]}`, code: 'INVALID_DOMAIN_FIELD' }, req)
          if (!VALID_DOMAIN_OPERATORS.has(op)) return sendJson(res, 400, { error: `Unsupported domain operator: ${item[1]}`, code: 'INVALID_DOMAIN_OPERATOR' }, req)
          query.where(field, op, item[2])
        }
      }

      const relationResult = applyRelations(query, searchParams.get('with'), fieldDefs)
      if (!relationResult.ok) {
        return sendJson(res, 400, { error: relationResult.error, code: 'INVALID_RELATION' }, req)
      }

      for (const [key, value] of searchParams.entries()) {
        if (RESERVED_PARAMS.has(key)) continue
        const field = resolveField(fieldDefs, key)
        if (!field) return sendJson(res, 400, { error: `Unknown query field: ${key}`, code: 'INVALID_QUERY_FIELD' }, req)
        query.where(field, value)
      }

      return sendJson(res, 200, await query.paginate(page, limit), req)
    }

    if (req.method === 'GET' && id !== undefined) {
      const query = ModelClass.query(env).where('id', id)
      const relationResult = applyRelations(query, searchParams.get('with'), fieldDefs)
      if (!relationResult.ok) {
        return sendJson(res, 400, { error: relationResult.error, code: 'INVALID_RELATION' }, req)
      }
      const record = await query.first()
      if (!record) return sendJson(res, 404, { error: 'Record not found', code: 'RECORD_NOT_FOUND' }, req)
      return sendJson(res, 200, { data: record }, req)
    }

    if (req.method === 'POST') {
      const validated = validateWriteBody(await parseBody(req), fieldDefs)
      if (!validated.ok) {
        return sendJson(res, 400, {
          error: validated.field ? `Unknown write field: ${validated.field}` : 'JSON object body required',
          code: validated.field ? 'INVALID_WRITE_FIELD' : 'INVALID_REQUEST_BODY'
        }, req)
      }
      if (Object.keys(validated.data).length === 0) {
        return sendJson(res, 400, { error: 'Non-empty JSON object body required', code: 'INVALID_REQUEST_BODY' }, req)
      }
      const record = await ModelClass.transaction(env, async (txEnv: any) => ModelClass.spawn(ModelClass, txEnv, validated.data))
      logger.info('moon.rest.audit', 'REST record created', { uid, model, recordId: record?.id })
      return sendJson(res, 201, { data: record }, req)
    }

    if (req.method === 'PUT' || req.method === 'PATCH') {
      if (id === undefined) return sendJson(res, 400, { error: 'ID required for update', code: 'INVALID_REQUEST' }, req)
      const validated = validateWriteBody(await parseBody(req), fieldDefs)
      if (!validated.ok) {
        return sendJson(res, 400, {
          error: validated.field ? `Unknown write field: ${validated.field}` : 'JSON object body required',
          code: validated.field ? 'INVALID_WRITE_FIELD' : 'INVALID_REQUEST_BODY'
        }, req)
      }
      await ModelClass.transaction(env, async (txEnv: any) => ModelClass.morph(ModelClass, txEnv, id, validated.data))
      logger.info('moon.rest.audit', 'REST record updated', { uid, model, recordId: id })
      const record = await ModelClass.query(env).where('id', id).first()
      return sendJson(res, 200, { data: record }, req)
    }

    if (req.method === 'DELETE') {
      if (id === undefined) return sendJson(res, 400, { error: 'ID required for delete', code: 'INVALID_REQUEST' }, req)
      await ModelClass.transaction(env, async (txEnv: any) => ModelClass.purge(ModelClass, txEnv, id))
      logger.warn('moon.rest.audit', 'REST record deleted', { uid, model, recordId: id })
      return sendJson(res, 200, { success: true }, req)
    }

    return sendJson(res, 405, { error: 'Method not allowed', code: 'METHOD_NOT_ALLOWED' }, req)
  } catch (err: any) {
    if (err?.name === 'OdooError') {
      logger.error('moon.rest.odoo', 'Odoo REST request failed', { status: err.status, error: err.message })
    }
    if (err instanceof AuthError || err instanceof AuthorizationError) {
      return sendJson(res, err.statusCode, { error: err.message, code: err.code }, req)
    }
    if (err?.message?.startsWith('Validation Error:')) {
      return sendJson(res, 400, { error: err.message, code: 'VALIDATION_ERROR' }, req)
    }
    const statusCode = err?.statusCode || 500
    return sendJson(res, statusCode, {
      error: statusCode >= 500 ? 'Internal server error' : (err?.message || 'Request failed'),
      code: err?.code || 'INTERNAL_ERROR'
    }, req)
  }
}
