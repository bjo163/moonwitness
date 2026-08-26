import { getDb } from './config.js'
import type { Ctx } from './env.js'
import type { Vertex } from './base.js'

export type PermissionOperation = 'permRead' | 'permWrite' | 'permCreate' | 'permUnlink'
export type AuthSecurityScope = 'login' | 'register' | 'password-recovery'
export type AuthorizationErrorCode =
  | 'AUTH_REQUIRED'
  | 'ACCESS_DENIED'
  | 'SECURITY_METADATA_MISSING'
  | 'SECURITY_RULE_INVALID'

const AUTH_SCOPE_CONTEXT_KEY = '__moonInternalAuthScope'

const AUTH_SCOPE_RULES: Record<AuthSecurityScope, Partial<Record<string, PermissionOperation[]>>> = {
  login: {
    'vx.user': ['permRead'],
  },
  register: {
    'vx.user': ['permRead', 'permCreate'],
    'vx.node': ['permRead'],
  },
  'password-recovery': {
    'vx.user': ['permRead', 'permWrite'],
  },
}

interface UserRoleRow {
  vx_role_id: number
}

interface ModelMetadataRow {
  id: number
  model: string
}

interface RuleLinkRow {
  ir_rule_id: number
}

interface RuleRow {
  id: number
  name?: string
  domain_force?: string
}

export class AuthorizationError extends Error {
  readonly code: AuthorizationErrorCode
  readonly statusCode: 401 | 403

  constructor(code: AuthorizationErrorCode, message: string) {
    super(message)
    this.name = 'AuthorizationError'
    this.code = code
    this.statusCode = code === 'AUTH_REQUIRED' ? 401 : 403
  }
}

export function authSecurityContext(scope: AuthSecurityScope): Record<string, unknown> {
  return { [AUTH_SCOPE_CONTEXT_KEY]: scope }
}

function getAuthSecurityScope(env: Ctx): AuthSecurityScope | undefined {
  const scope = env.context?.[AUTH_SCOPE_CONTEXT_KEY]
  if (scope === 'login' || scope === 'register' || scope === 'password-recovery') {
    return scope
  }
  return undefined
}

function isExplicitAuthException(
  modelClass: typeof Vertex,
  env: Ctx,
  operation: PermissionOperation
): boolean {
  const scope = getAuthSecurityScope(env)
  if (!scope) return false
  return AUTH_SCOPE_RULES[scope][modelClass._name]?.includes(operation) === true
}

function permissionColumn(operation: PermissionOperation): string {
  return operation.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`)
}

function deny(code: AuthorizationErrorCode, message: string): never {
  throw new AuthorizationError(code, message)
}

async function getUserRoleIds(env: Ctx): Promise<number[]> {
  const db = getDb()
  const conn = env.trx || db
  const rows = (await conn('vx_user_vx_role_rel')
    .where('vx_user_id', env.uid)
    .select('vx_role_id')) as UserRoleRow[]

  return rows.map((row) => row.vx_role_id)
}

async function getModelMetadata(modelClass: typeof Vertex, env: Ctx): Promise<ModelMetadataRow> {
  const db = getDb()
  const conn = env.trx || db
  const row = (await conn('mx_model')
    .where('model', modelClass._name)
    .first()) as ModelMetadataRow | undefined

  if (!row) {
    deny(
      'SECURITY_METADATA_MISSING',
      `Access Denied: Security metadata missing for ${modelClass._name}`
    )
  }

  return row
}

export async function checkAccessRights(
  modelClass: typeof Vertex,
  env: Ctx,
  operation: PermissionOperation
): Promise<void> {
  if (env.uid === 1) return

  if (modelClass._public && operation === 'permRead') return

  if (env.uid === 0) {
    if (isExplicitAuthException(modelClass, env, operation)) return
    deny(
      'AUTH_REQUIRED',
      `Unauthorized: Token required to ${operation.replace('perm', '').toLowerCase()} ${modelClass._name}`
    )
  }

  const groupIds = await getUserRoleIds(env)
  if (groupIds.length === 0) {
    deny(
      'ACCESS_DENIED',
      `Access Denied: No groups assigned to user. Cannot ${operation} on ${modelClass._name}`
    )
  }

  const model = await getModelMetadata(modelClass, env)
  const db = getDb()
  const conn = env.trx || db
  const grant = await conn('mx_grant')
    .where('model_id', model.id)
    .whereIn('group_id', groupIds)
    .where(permissionColumn(operation), true)
    .first()

  if (!grant) {
    deny('ACCESS_DENIED', `Access Denied: Missing ${operation} on ${modelClass._name}`)
  }
}

const ALLOWED_RECORD_RULE_OPERATORS = new Set([
  '=',
  '==',
  '!=',
  '<>',
  '>',
  '>=',
  '<',
  '<=',
  'in',
  'not in',
  'like',
  'ilike',
  'not like',
  'not ilike',
  'child_of',
  '=like',
  '=ilike',
])

const ALLOWED_USER_VARIABLES: Record<string, (user: Record<string, unknown>) => unknown> = {
  '$user.id': (user) => user.id,
  'user.id': (user) => user.id,
  '$user.company_id': (user) => user.company_id ?? user.companyId,
  '$user.companyId': (user) => user.company_id ?? user.companyId,
  'user.company_id': (user) => user.company_id ?? user.companyId,
  'user.companyId': (user) => user.company_id ?? user.companyId,
  '$user.company_ids': (user) =>
    user.company_ids ??
    user.companyIds ??
    (user.company_id !== undefined
      ? [user.company_id]
      : user.companyId !== undefined
      ? [user.companyId]
      : []),
  '$user.companyIds': (user) =>
    user.company_ids ??
    user.companyIds ??
    (user.company_id !== undefined
      ? [user.company_id]
      : user.companyId !== undefined
      ? [user.companyId]
      : []),
  'user.company_ids': (user) =>
    user.company_ids ??
    user.companyIds ??
    (user.company_id !== undefined
      ? [user.company_id]
      : user.companyId !== undefined
      ? [user.companyId]
      : []),
  'user.companyIds': (user) =>
    user.company_ids ??
    user.companyIds ??
    (user.company_id !== undefined
      ? [user.company_id]
      : user.companyId !== undefined
      ? [user.companyId]
      : []),
  '$user.partner_id': (user) => user.partner_id ?? user.partnerId,
  '$user.partnerId': (user) => user.partner_id ?? user.partnerId,
  'user.partner_id': (user) => user.partner_id ?? user.partnerId,
  'user.partnerId': (user) => user.partner_id ?? user.partnerId,
  '$user.email': (user) => user.email,
  'user.email': (user) => user.email,
  '$user.name': (user) => user.name,
  'user.name': (user) => user.name,
  '$user.login': (user) => user.login ?? user.email,
  'user.login': (user) => user.login ?? user.email,
}

export function parseDeclarativeDomain(raw: string): unknown[] {
  const trimmed = raw.trim()
  if (!trimmed.startsWith('[') || !trimmed.endsWith(']')) {
    deny('SECURITY_RULE_INVALID', 'Access Denied: Record rule domain must be an array')
  }

  try {
    const parsed = JSON.parse(trimmed)
    if (Array.isArray(parsed)) return parsed
  } catch {
    // Try normalizing single-quoted array representation: e.g. [['owner_id', '=', '$user.id']]
    try {
      const jsonCompatible = trimmed
        .replace(/'((?:\\'|[^'])*)'/g, '"$1"')
        .replace(/,\s*]/g, ']')
      const parsed = JSON.parse(jsonCompatible)
      if (Array.isArray(parsed)) return parsed
    } catch {
      deny('SECURITY_RULE_INVALID', 'Access Denied: Malformed record rule domain syntax')
    }
  }

  deny('SECURITY_RULE_INVALID', 'Access Denied: Record rule domain must be an array')
}

function resolveDomainValue(value: unknown, user: Record<string, unknown>): unknown {
  if (typeof value === 'string') {
    if (value.startsWith('$') || value.startsWith('user.')) {
      const resolver = ALLOWED_USER_VARIABLES[value]
      if (!resolver) {
        deny('SECURITY_RULE_INVALID', `Access Denied: Unauthorized or unknown record rule variable "${value}"`)
      }
      const resolved = resolver(user)
      if (resolved === undefined) {
        deny('SECURITY_RULE_INVALID', `Access Denied: Could not resolve variable "${value}" for current user`)
      }
      return resolved
    }
    return value
  }

  if (Array.isArray(value)) {
    return value.map((item) => resolveDomainValue(item, user))
  }

  return value
}

export function evaluateRecordRuleDomain(
  domainForce: string,
  user: Record<string, unknown>
): unknown[] {
  const rawArray = parseDeclarativeDomain(domainForce)
  const evaluated: unknown[] = []

  for (const item of rawArray) {
    if (typeof item === 'string') {
      if (item === '|' || item === '&' || item === '!') {
        evaluated.push(item)
        continue
      }
      deny('SECURITY_RULE_INVALID', `Access Denied: Invalid operator token "${item}" in record rule`)
    }

    if (!Array.isArray(item) || item.length !== 3) {
      deny('SECURITY_RULE_INVALID', 'Access Denied: Record rule condition must be a 3-element tuple [field, op, value]')
    }

    const [field, op, rawValue] = item
    if (typeof field !== 'string' || field.trim().length === 0) {
      deny('SECURITY_RULE_INVALID', 'Access Denied: Record rule field must be a non-empty string')
    }

    if (typeof op !== 'string' || !ALLOWED_RECORD_RULE_OPERATORS.has(op.toLowerCase())) {
      deny('SECURITY_RULE_INVALID', `Access Denied: Unsupported record rule operator "${op}"`)
    }

    const resolvedValue = resolveDomainValue(rawValue, user)
    evaluated.push([field, op, resolvedValue])
  }

  return evaluated
}

export async function getRecordRulesDomain(
  modelClass: typeof Vertex,
  env: Ctx
): Promise<unknown[]> {
  if (env.uid === 1 || modelClass._public) return []
  if (env.uid === 0 && getAuthSecurityScope(env)) return []

  const groupIds = await getUserRoleIds(env)
  if (groupIds.length === 0) {
    deny('ACCESS_DENIED', `Access Denied: No groups assigned to user for ${modelClass._name}`)
  }

  const model = await getModelMetadata(modelClass, env)
  const db = getDb()
  const conn = env.trx || db

  const ruleGroupRows = (await conn('ir_rule_res_groups_rel')
    .whereIn('vx_role_id', groupIds)
    .select('ir_rule_id')) as RuleLinkRow[]
  const ruleIds = ruleGroupRows.map((row) => row.ir_rule_id)

  if (ruleIds.length === 0) return []

  const rules = (await conn('mx_rule')
    .where('model_id', model.id)
    .whereIn('id', ruleIds)
    .select('id', 'name', 'domain_force')) as RuleRow[]

  if (rules.length === 0) {
    deny(
      'SECURITY_METADATA_MISSING',
      `Access Denied: Record-rule links reference missing rules for ${modelClass._name}`
    )
  }

  const user = (await conn('vx_user').where('id', env.uid).first()) as Record<string, unknown> | undefined
  if (!user) {
    deny('ACCESS_DENIED', `Access Denied: User ${env.uid} does not exist`)
  }

  let combinedDomain: unknown[] = []

  for (const rule of rules) {
    if (typeof rule.domain_force !== 'string' || rule.domain_force.trim().length === 0) {
      deny('SECURITY_RULE_INVALID', `Access Denied: Invalid record rule ${rule.name ?? rule.id}`)
    }

    try {
      const evaluated = evaluateRecordRuleDomain(rule.domain_force, user)
      if (evaluated.length === 0) continue

      if (combinedDomain.length === 0) {
        combinedDomain = evaluated
      } else {
        combinedDomain = ['|', ...combinedDomain, ...evaluated]
      }
    } catch (error) {
      if (error instanceof AuthorizationError) throw error
      deny('SECURITY_RULE_INVALID', `Access Denied: Failed to evaluate record rule ${rule.name ?? rule.id}`)
    }
  }

  return combinedDomain
}
