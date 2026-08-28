import knex, { type Knex } from 'knex'
import { SpanStatusCode } from '@opentelemetry/api'
import {
  isOtelEnabled,
  startDbSpan,
  withDbSpan,
  sanitizeSql,
  shouldSampleQuery,
  resetQuerySampler,
  trackAttribute,
} from './telemetry.js'

let dbInstance: Knex | null = null
const pendingQuerySpans = new Map<string, any>()

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
       
       try {
         const fs = require('node:fs')
         const path = require('node:path')
         const logFile = path.resolve(process.cwd(), 'moonwitness.log')
         fs.appendFileSync(logFile, `[${timestamp}] [DEBUG] moon.sql: ${sql} ${bindings}\n`)
       } catch(e) {}
    })
  }

  // Slow Query Logger (Observability)
  const queryTimes = new Map<string, number>()
  dbInstance.on('query', (query) => {
    if (query.__knexQueryUid) {
      queryTimes.set(query.__knexQueryUid, performance.now())
    }
  })
  dbInstance.on('query-response', (response, query) => {
    if (query.__knexQueryUid) {
      const startTime = queryTimes.get(query.__knexQueryUid)
      if (startTime) {
        const duration = performance.now() - startTime
        queryTimes.delete(query.__knexQueryUid)
        if (duration > 100) {
          console.warn(`\x1b[33m[SLOW QUERY] ${duration.toFixed(2)}ms\x1b[0m: ${query.sql}`)
        }
      }
    }
  })
  dbInstance.on('query-error', (error, query) => {
    if (query.__knexQueryUid) {
      queryTimes.delete(query.__knexQueryUid)
    }
  })

  if (isOtelEnabled()) {
    const rawTransaction = dbInstance.transaction.bind(dbInstance)
    dbInstance.transaction = function (callback: any) {
      return withDbSpan('db.transaction', async (span) => {
        span?.setAttribute('db.system', 'postgresql')
        try {
          const result = await rawTransaction(callback)
          span?.setStatus({ code: SpanStatusCode.OK })
          return result
        } catch (err: any) {
          span?.setStatus({ code: SpanStatusCode.ERROR, message: err?.message || String(err) })
          span?.recordException(err instanceof Error ? err : new Error(String(err)))
          throw err
        }
      })
    }

    dbInstance.on('query', (query) => {
      if (!shouldSampleQuery()) return
      const uid = query.__knexQueryUid
      if (!uid) return
      const span = startDbSpan('db.query', {
        attributes: {
          'db.system': 'postgresql',
          'db.query.text': sanitizeSql(query.sql),
          'db.query.bindings_count': Array.isArray(query.bindings) ? query.bindings.length : 0,
        },
      })
      if (span) {
        pendingQuerySpans.set(uid, span)
      }
    })

    dbInstance.on('query-response', (_response, query) => {
      const uid = query.__knexQueryUid
      const span = pendingQuerySpans.get(uid)
      if (span) {
        pendingQuerySpans.delete(uid)
        span.setStatus({ code: SpanStatusCode.OK })
        span.end()
      }
    })

    dbInstance.on('query-error', (error, query) => {
      const uid = query.__knexQueryUid
      const span = pendingQuerySpans.get(uid)
      if (span) {
        pendingQuerySpans.delete(uid)
        span.setStatus({ code: SpanStatusCode.ERROR, message: error?.message || String(error) })
        span.recordException(error instanceof Error ? error : new Error(String(error)))
        span.end()
      }
    })
  }
}

export function getDb(): Knex {
  if (!dbInstance) {
    throw new Error('ORM has not been initialized. Call setupOrm(knex) first.')
  }
  return dbInstance
}

export async function teardownOrm(): Promise<void> {
  if (dbInstance) {
    if (typeof (dbInstance as any).destroy === 'function') {
      await (dbInstance as any).destroy()
    }
    dbInstance = null
  }
}

export const closeDb = teardownOrm

export interface DbHealthStatus {
  ok: boolean
  dialect: string
  version?: string
  latencyMs: number
  error?: string
}

export async function checkDbConnection(): Promise<DbHealthStatus> {
  if (!dbInstance) {
    return {
      ok: false,
      dialect: 'unknown',
      latencyMs: 0,
      error: 'ORM has not been initialized. Call setupOrm(config) first.'
    }
  }

  const span = startDbSpan('db.connection_check', {
    attributes: { 'db.system': 'postgresql' }
  })

  const start = performance.now()
  try {
    await dbInstance.raw('SELECT 1 as ping')
    const latencyMs = Number((performance.now() - start).toFixed(2))

    let version: string | undefined
    try {
      const vResult = await dbInstance.raw('SELECT version() as version')
      const rows = vResult?.rows || vResult
      const row = Array.isArray(rows) && rows.length > 0 ? rows[0] : undefined
      if (row && typeof row === 'object' && 'version' in row && row.version) {
        const firstLine = String(row.version).split('\n')[0]
        if (firstLine) {
          version = firstLine.trim()
        }
      }
    } catch {
      // Ignored if dialect does not support SELECT version()
    }

    const dialect = (dbInstance.client as any)?.dialect || (dbInstance.client as any)?.driverName || 'pg'

    span?.setStatus({ code: SpanStatusCode.OK })
    span?.setAttribute('db.dialect', dialect)
    if (version) {
      span?.setAttribute('db.version', version)
    }
    span?.end()

    return {
      ok: true,
      dialect,
      version,
      latencyMs
    }
  } catch (err: any) {
    const latencyMs = Number((performance.now() - start).toFixed(2))
    const dialect = (dbInstance.client as any)?.dialect || 'pg'
    span?.setStatus({ code: SpanStatusCode.ERROR, message: err?.message || String(err) })
    span?.recordException(err instanceof Error ? err : new Error(String(err)))
    span?.end()
    return {
      ok: false,
      dialect,
      latencyMs,
      error: err?.message || String(err)
    }
  }
}

