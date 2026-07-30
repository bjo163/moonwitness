import type { Vertex } from './base.js'
import { getDb } from './config.js'

export const SUPERUSER_ID = 1
export const ANONYMOUS_ID = 0

export interface Ctx {
  uid: number
  context?: Record<string, unknown>
  getModel?: (name: string) => typeof Vertex | undefined
  trx?: any // Knex.Transaction
  cache?: Map<string, any>
  withContext(context: Record<string, unknown>): Ctx
  transaction<T>(callback: (trxEnv: Ctx) => Promise<T>): Promise<T>
}

export function createCtx(
  uid: number,
  context?: Record<string, unknown>,
  getModel?: (name: string) => typeof Vertex | undefined,
  trx?: any
): Ctx {
  const env: Ctx = { 
    uid, 
    context: context || {}, 
    getModel, 
    trx, 
    cache: new Map(),
    withContext(newContext: Record<string, unknown>) {
      return createCtx(this.uid, { ...this.context, ...newContext }, this.getModel, this.trx)
    },
    async transaction<T>(callback: (trxEnv: Ctx) => Promise<T>): Promise<T> {
      if (this.trx) {
        // Already in a transaction, just reuse it
        return callback(this)
      }
      const db = getDb()
      return await db.transaction(async (trx) => {
        const trxEnv = createCtx(this.uid, this.context, this.getModel, trx)
        return await callback(trxEnv)
      })
    }
  }
  return env
}
