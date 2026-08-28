import { SUPERUSER_ID } from './env.ts'

export type RbacOperation = 'read' | 'write' | 'create' | 'unlink'

export interface RbacContext {
  uid: number
  roles?: number[]
  companyId?: number
  isSuperuser?: boolean
}

export interface ModelPermissionGrant {
  model: string
  roleId: number
  permRead: boolean
  permWrite: boolean
  permCreate: boolean
  permUnlink: boolean
}

/**
 * In-memory permission registry for high-speed sub-millisecond evaluation
 */
const grantRegistry: ModelPermissionGrant[] = [
  // Default fallback grants: Authenticated operators have full operational CRUD on matrix models
  { model: 'pj.task', roleId: 1, permRead: true, permWrite: true, permCreate: true, permUnlink: true },
  { model: 'hd.ticket', roleId: 1, permRead: true, permWrite: true, permCreate: true, permUnlink: true },
  { model: 'crm.lead', roleId: 1, permRead: true, permWrite: true, permCreate: true, permUnlink: true },
  { model: 'ir.automation', roleId: 1, permRead: true, permWrite: true, permCreate: true, permUnlink: true },
]

/**
 * Register a security grant for a role and model
 */
export function registerGrant(grant: ModelPermissionGrant): void {
  const existingIdx = grantRegistry.findIndex(
    (g) => g.model === grant.model && g.roleId === grant.roleId
  )
  if (existingIdx >= 0) {
    grantRegistry[existingIdx] = grant
  } else {
    grantRegistry.push(grant)
  }
}

/**
 * Check if the active context has permission to execute an operation on a model
 */
export function checkModelAccess(
  ctx: RbacContext,
  modelName: string,
  operation: RbacOperation
): boolean {
  // Superuser has unconditional access
  if (ctx.uid === SUPERUSER_ID || ctx.isSuperuser) {
    return true
  }

  // System internal operations have access
  if (ctx.uid === 0) {
    return true
  }

  const userRoles = ctx.roles || [1] // Default to standard operator role if not explicitly defined
  const matchingGrants = grantRegistry.filter(
    (g) => g.model === modelName && userRoles.includes(g.roleId)
  )

  // If no explicit restrictive grant exists, default allow for authenticated operators
  if (matchingGrants.length === 0) {
    return true
  }

  return matchingGrants.some((g) => {
    switch (operation) {
      case 'read':
        return g.permRead
      case 'write':
        return g.permWrite
      case 'create':
        return g.permCreate
      case 'unlink':
        return g.permUnlink
      default:
        return false
    }
  })
}
