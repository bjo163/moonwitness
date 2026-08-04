/**
 * Shared seed utilities for moon-witness
 * Provides DB connection bootstrap & helpers for all seed scripts.
 */
import dotenv from 'dotenv'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'
import { setupOrm, getDb } from '@moon/orm'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Try multiple env paths
const envPaths = [
  path.resolve(__dirname, '../../../apps/api/.env'),
  path.resolve(__dirname, '../../apps/api/.env'),
  path.resolve(process.cwd(), '.env'),
  path.resolve(process.cwd(), '../api/.env'),
  path.resolve(process.cwd(), '../../apps/api/.env'),
]

for (const p of envPaths) {
  if (fs.existsSync(p)) {
    dotenv.config({ path: p })
    break
  }
}

const DB_URL = process.env.DATABASE_URL || 'postgres://localhost/moonwitness'

let initialized = false

export async function initSeedDb() {
  if (initialized) return getDb()
  setupOrm(DB_URL)
  initialized = true
  return getDb()
}

export function toSnakeCase(str: string): string {
  return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`)
}

/**
 * Batch insert rows into a table using Knex.
 * Ignores conflicts on the given column (idempotent).
 */
export async function batchInsert(
  table: string,
  rows: Record<string, unknown>[],
  batchSize: number = 100,
  onConflictColumn?: string
) {
  const db = getDb()
  for (let i = 0; i < rows.length; i += batchSize) {
    const chunk = rows.slice(i, i + batchSize)
    if (onConflictColumn) {
      await db(table).insert(chunk).onConflict(onConflictColumn).ignore()
    } else {
      await db(table).insert(chunk)
    }
  }
}

export function progress(current: number, total: number, label: string) {
  process.stdout.write(`\r  ${label}: ${current}/${total}`)
  if (current === total) console.log(' ✅')
}
