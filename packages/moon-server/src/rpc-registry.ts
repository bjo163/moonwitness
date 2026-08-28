import type { z } from 'zod'
import { getModel } from '@moon/orm'

export interface RpcProcedure {
  name: string
  description: string
  input?: z.ZodTypeAny
  output?: z.ZodTypeAny
  requireAuth?: boolean
  requireAdmin?: boolean
}

const globalProcedures = new Map<string, RpcProcedure>()

export function defineProcedure(procedure: RpcProcedure) {
  globalProcedures.set(procedure.name, procedure)
}

export function getRegisteredProcedure(name: string): RpcProcedure | undefined {
  return globalProcedures.get(name)
}

export function getAllRegisteredProcedures(): RpcProcedure[] {
  return Array.from(globalProcedures.values())
}

const SAFE_READONLY_METHODS = new Set([
  'fetch',
  'count',
  'searchCount',
  'readGroup',
])

const DANGEROUS_METHODS = new Set([
  'spawn',
  'morph',
  'purge',
  'destroy',
  'unlink',
  'create',
  'write',
  'update',
  'delete',
  'transaction',
  'emitEvent',
  'getFieldDefs',
  'tableName',
  'validateData',
  'splitVals',
  'processRelationalTuples',
  'checkRecordOperationAccess',
  'onchange',
  'label',
])

export function isAllowedRpcMethod(method: string): boolean {
  if (globalProcedures.has(method)) {
    return true
  }
  if (DANGEROUS_METHODS.has(method)) {
    return false
  }
  if (SAFE_READONLY_METHODS.has(method)) {
    return true
  }
  return false
}

export function validateRpcMethod(method: string): { ok: boolean; error?: string } {
  if (!/^[a-zA-Z0-9_]+$/.test(method)) {
    return { ok: false, error: `Invalid method name format: ${method}` }
  }
  if (method.includes('__')) {
    return { ok: false, error: `Dunder methods are not allowed: ${method}` }
  }
  if (method.startsWith('_')) {
    return { ok: false, error: `Private methods are not allowed: ${method}` }
  }
  if (!isAllowedRpcMethod(method)) {
    return { ok: false, error: `Method ${method} is not registered for RPC access` }
  }
  return { ok: true }
}

export function resolveRpcHandler(modelName: string, method: string) {
  const ModelClass = getModel(modelName)
  if (!ModelClass) {
    return null
  }
  const methodFn = (ModelClass as any)[method]
  if (typeof methodFn !== 'function') {
    return null
  }
  return methodFn
}
