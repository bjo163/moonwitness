import knex, { type Knex } from 'knex'

let dbInstance: Knex | null = null

export type DbConfig = string | Knex | { client: string, connection: any }

export function setupOrm(config: DbConfig) {
  if (typeof config === 'string') {
    dbInstance = knex({
      client: 'pg',
      connection: config
    })
  } else if ('client' in config && !('select' in config)) {
    // Plain config object
    dbInstance = knex(config as any)
  } else {
    // Already a Knex instance
    dbInstance = config as Knex
  }
  
  if (process.env.DEBUG === 'true') {
    dbInstance.on('query', (query) => {
       const timestamp = new Date().toISOString()
       const sql = query.sql
       const bindings = query.bindings ? `[${query.bindings.join(', ')}]` : ''
       console.log(`\x1b[90m[${timestamp}]\x1b[0m \x1b[36mmoon.sql:\x1b[0m ${sql} \x1b[90m${bindings}\x1b[0m`)
       
       // Also append to moonwitness.log if possible
       try {
         const fs = require('node:fs')
         const path = require('node:path')
         const logFile = path.resolve(process.cwd(), 'moonwitness.log')
         fs.appendFileSync(logFile, `[${timestamp}] [DEBUG] moon.sql: ${sql} ${bindings}\n`)
       } catch(e) {}
    })
  }
}

export function getDb(): Knex {
  if (!dbInstance) {
    throw new Error('ORM has not been initialized. Call setupOrm(knex) first.')
  }
  return dbInstance
}
