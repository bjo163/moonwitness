import { AsyncLocalStorage } from 'node:async_hooks'
import { getDb } from './config.js'
import type { Knex } from 'knex'

const context = new AsyncLocalStorage<Knex>()
export const getSchemaDb = (): Knex => context.getStore() ?? getDb()
export function withSchemaDb<T>(db: Knex, work: () => T): T {
  return context.run(db, work)
}
