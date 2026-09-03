import { z } from 'zod'
import type { Ctx, Vertex } from '@moon/orm'

export interface RpcProcedureContext {
  uid: number
  model: string
  ModelClass: typeof Vertex
  env: Ctx
}

export interface RpcProcedure<TInput = unknown, TOutput = unknown> {
  name: string
  description: string
  input: z.ZodType<TInput>
  output: z.ZodType<TOutput>
  requireAuth?: boolean
  requireAdmin?: boolean
  handler: (ctx: RpcProcedureContext, input: TInput) => Promise<TOutput> | TOutput
}

const globalProcedures = new Map<string, RpcProcedure<any, any>>()

export function defineProcedure<TInput, TOutput>(procedure: RpcProcedure<TInput, TOutput>) {
  if (globalProcedures.has(procedure.name)) {
    throw new Error(`RPC procedure already registered: ${procedure.name}`)
  }
  globalProcedures.set(procedure.name, procedure as RpcProcedure<any, any>)
}

export function getRegisteredProcedure(name: string): RpcProcedure<any, any> | undefined {
  return globalProcedures.get(name)
}

export function getAllRegisteredProcedures(): RpcProcedure<any, any>[] {
  return Array.from(globalProcedures.values())
}

const GenericModelRpcInputSchema = z.object({
  model: z.string().min(1),
  args: z.array(z.unknown()).default([]),
  kwargs: z.record(z.unknown()).default({}),
})

const callArgs = (input: z.infer<typeof GenericModelRpcInputSchema>) => {
  if (Object.keys(input.kwargs).length === 0) return input.args
  return [...input.args, input.kwargs]
}

function registerBuiltinReadProcedures() {
  defineProcedure({
    name: 'fetch',
    description: 'Read model records through the canonical ORM ACL and record-rule boundary.',
    input: GenericModelRpcInputSchema,
    output: z.unknown(),
    requireAuth: true,
    handler: async ({ ModelClass, env }, input) =>
      ModelClass.fetch(ModelClass, env, ...callArgs(input) as any),
  })

  defineProcedure({
    name: 'searchCount',
    description: 'Count model records through the canonical ORM ACL and record-rule boundary.',
    input: GenericModelRpcInputSchema,
    output: z.number(),
    requireAuth: true,
    handler: async ({ ModelClass, env }, input) =>
      ModelClass.searchCount(ModelClass, env, ...callArgs(input) as any),
  })

  defineProcedure({
    name: 'count',
    description: 'Compatibility alias for the canonical searchCount read procedure.',
    input: GenericModelRpcInputSchema,
    output: z.number(),
    requireAuth: true,
    handler: async ({ ModelClass, env }, input) =>
      ModelClass.searchCount(ModelClass, env, ...callArgs(input) as any),
  })

  defineProcedure({
    name: 'readGroup',
    description: 'Read grouped model aggregates through the canonical ORM boundary.',
    input: GenericModelRpcInputSchema,
    output: z.unknown(),
    requireAuth: true,
    handler: async ({ ModelClass, env }, input) =>
      ModelClass.readGroup(ModelClass, env, ...callArgs(input) as any),
  })
}

registerBuiltinReadProcedures()

export function isAllowedRpcMethod(method: string): boolean {
  return globalProcedures.has(method)
}

export function validateRpcMethod(method: string): { ok: boolean; error?: string } {
  if (!/^[a-zA-Z0-9_.]+$/.test(method)) {
    return { ok: false, error: `Invalid method name format: ${method}` }
  }
  if (method.includes('__')) {
    return { ok: false, error: `Dunder methods are not allowed: ${method}` }
  }
  if (method.startsWith('_')) {
    return { ok: false, error: `Private methods are not allowed: ${method}` }
  }
  if (!globalProcedures.has(method)) {
    return { ok: false, error: `Method ${method} is not registered for RPC access` }
  }
  return { ok: true }
}

export function resolveRpcProcedure(method: string): RpcProcedure<any, any> | null {
  return globalProcedures.get(method) ?? null
}
