import knex, { type Knex } from 'knex'
import { SpanStatusCode } from '@opentelemetry/api'
import { databaseOperation, sanitizedDatabaseError } from './connection-profile.js'
import {
  isOtelEnabled,
  startDbSpan,
  shouldSampleQuery,
} from './telemetry.js'
import { detectDialect, parseDbUrl, setDialect, getDialect } from './dialect.js'

let dbInstance: Knex | null = null
const pendingQuerySpans = new Map<string, any>()

export type DbConfig = string | Knex | Knex.Config

export function setupOrm(config: DbConfig) {
  if (typeof config === 'string') {
    const dialect = detectDialect(config)
    setDialect(dialect)
    const knexConfig = parseDbUrl(config)
    dbInstance = knex(knexConfig as any)
  } else if (typeof config !== 'function' && 'client' in config && typeof (config as any).client === 'string' && !('raw' in config)) {
    // Plain Knex config object
    const clientStr = String((config as any).client || '')
    setDialect(detectDialect(clientStr))
    dbInstance = knex(config as any)
  } else {
    // Already a Knex instance or mock DB instance
    dbInstance = config as Knex
    const clientStr = String((dbInstance.client as any)?.config?.client || (dbInstance.client as any)?.driverName || '')
    setDialect(detectDialect(clientStr))
  }
  
  if (process.env.DEBUG === 'true') {
    dbInstance.on('query', (query) => {
       const timestamp = new Date().toISOString()
       console.log(`[${timestamp}] moon.sql: ${databaseOperation(query.sql)}`)
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
          console.warn(`[SLOW QUERY] ${duration.toFixed(2)}ms: ${databaseOperation(query.sql)}`)
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
    dbInstance.transaction = async function (callback: any) {
        const span = startDbSpan('db.transaction')
        const dbSystem = getDialect() === 'pg' ? 'postgresql' : 'sqlite'
        span?.setAttribute('db.system', dbSystem)
        try {
          const result = await rawTransaction(callback)
          span?.setStatus({ code: SpanStatusCode.OK })
          return result
        } catch (err: any) {
          span?.setStatus({ code: SpanStatusCode.ERROR, message: sanitizedDatabaseError(err) })
          span?.recordException(new Error(sanitizedDatabaseError(err)))
          throw err
        } finally {
          span?.end()
        }
    } as Knex['transaction']

    dbInstance.on('query', (query) => {
      if (!shouldSampleQuery()) return
      const uid = query.__knexQueryUid
      if (!uid) return
      const dbSystem = getDialect() === 'pg' ? 'postgresql' : 'sqlite'
      const span = startDbSpan('db.query', {
        attributes: {
          'db.system': dbSystem,
          'db.operation.name': databaseOperation(query.sql),
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
        span.setStatus({ code: SpanStatusCode.ERROR, message: sanitizedDatabaseError(error) })
        span.recordException(new Error(sanitizedDatabaseError(error)))
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

  const dbSystem = getDialect() === 'pg' ? 'postgresql' : 'sqlite'
  const span = startDbSpan('db.connection_check', {
    attributes: { 'db.system': dbSystem }
  })

  const start = performance.now()
  try {
    await dbInstance.raw('SELECT 1 as ping')
    const latencyMs = Number((performance.now() - start).toFixed(2))

    let version: string | undefined
    try {
      if (getDialect() === 'pg') {
        const vResult = await dbInstance.raw('SELECT version() as version')
        const rows = vResult?.rows || vResult
        const row = Array.isArray(rows) && rows.length > 0 ? rows[0] : undefined
        if (row && typeof row === 'object' && 'version' in row && row.version) {
          const firstLine = String(row.version).split('\n')[0]
          if (firstLine) {
            version = firstLine.trim()
          }
        }
      } else {
        const vResult = await dbInstance.raw('SELECT sqlite_version() as version')
        const rows = Array.isArray(vResult) ? vResult : []
        if (rows.length > 0 && rows[0]?.version) {
          version = `SQLite ${rows[0].version}`
        }
      }
    } catch {
      // Ignored if dialect does not support version query
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
    span?.setStatus({ code: SpanStatusCode.ERROR, message: sanitizedDatabaseError(err) })
    span?.recordException(new Error(sanitizedDatabaseError(err)))
    span?.end()
    return {
      ok: false,
      dialect,
      latencyMs,
      error: sanitizedDatabaseError(err)
    }
  }
}
