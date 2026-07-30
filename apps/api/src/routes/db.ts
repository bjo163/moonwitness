import type { FastifyInstance } from 'fastify'
import db from '../db.js'
import { getLastPending } from '../models/schema-sync.js'

export const dbRoutes = async (fastify: FastifyInstance) => {
  fastify.get('/ping', async () => {
    const result = await db.select(db.raw('now() as now'))
    return { pong: true, time: result[0].now }
  })

  fastify.get('/health', async () => {
    try {
      const result = await db.select(db.raw('1 as ok'))
      return { ok: result[0].ok === 1 }
    } catch {
      return { ok: false }
    }
  })

  fastify.get('/status', async () => {
    try {
      const [dbName, versionRow, tableCountRow] = await Promise.all([
        db.select(db.raw('current_database() as dbName')),
        db.select(db.raw('version() as version')),
        db.select(
          db.raw(
            'count(*) as total FROM information_schema.tables WHERE table_schema = ?',
            ['public']
          )
        )
      ])
      const pending = getLastPending()
      return {
        ok: true,
        client: db.client.driverName,
        database: dbName[0].dbName,
        version: versionRow[0].version,
        totalTables: Number(tableCountRow[0].total),
        pendingSchemaMigrations: pending.filter((p) => !p.safe)
      }
    } catch (err) {
      return { ok: false, error: String(err) }
    }
  })

  fastify.get('/tables', async () => {
    try {
      const rows = await db.select(
        db.raw(
          'table_name FROM information_schema.tables WHERE table_schema = ? ORDER BY table_name',
          ['public']
        )
      )
      return { ok: true, tables: rows.map((r: any) => r.table_name) }
    } catch (err) {
      return { ok: false, error: String(err) }
    }
  })

  fastify.get('/pending-schema', async () => {
    const pending = getLastPending()
    return { ok: true, pending }
  })
}