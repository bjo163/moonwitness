#!/usr/bin/env node
/**
 * ◈ MoonWitness — Local-First Database Sync Utility
 *
 * Synchronizes data between local SQLite (dev) and external PostgreSQL.
 *
 * Usage:
 *   node scripts/db-sync.mjs --status
 *   node scripts/db-sync.mjs --up    # Sync SQLite -> PostgreSQL
 *   node scripts/db-sync.mjs --down  # Sync PostgreSQL -> SQLite
 */

import { existsSync } from "node:fs"
import { resolve, join, dirname } from "node:path"
import { fileURLToPath } from "node:url"
import { createRequire } from "node:module"

const __dirname = dirname(fileURLToPath(import.meta.url))
const repoRoot = resolve(__dirname, "..")

// Resolve dependencies from @moon/orm
const req = createRequire(join(repoRoot, "packages", "moon-orm", "package.json"))
const knex = req("knex")

// Load root .env if present
const envPath = join(repoRoot, ".env")
if (existsSync(envPath) && typeof process.loadEnvFile === "function") {
  try {
    process.loadEnvFile(envPath)
  } catch {}
}

const args = process.argv.slice(2)
const isStatus = args.includes("--status")
const isUp = args.includes("--up") || args.includes("up")
const isDown = args.includes("--down") || args.includes("down")
const isHelp = args.includes("--help") || args.includes("-h") || (!isStatus && !isUp && !isDown)

if (isHelp) {
  console.log(`
MoonWitness Local-First Database Sync Utility
=============================================
Commands:
  --status    Compare table and row counts between local SQLite and PostgreSQL
  --up        Push local SQLite data -> external PostgreSQL (Upsert)
  --down      Pull external PostgreSQL data -> local SQLite (Upsert)

Environment Variables:
  SQLITE_URL    Path/URL to local SQLite db (default: sqlite://./apps/api/data/moonwitness.dev.db)
  DATABASE_URL  PostgreSQL connection URL (default from .env)
`)
  process.exit(0)
}

// Locate SQLite DB
let sqlitePath = process.env.SQLITE_URL
  ? process.env.SQLITE_URL.replace(/^sqlite3?:\/\//, "")
  : join(repoRoot, "apps", "api", "data", "moonwitness.dev.db")

if (!existsSync(sqlitePath)) {
  const altPath = join(repoRoot, "data", "moonwitness.dev.db")
  if (existsSync(altPath)) sqlitePath = altPath
}

const pgUrl = process.env.DATABASE_URL || "postgres://postgres:postgres@localhost:5432/moonwitness"

console.log("=================================================================")
console.log("MOONWITNESS — LOCAL-FIRST DATABASE SYNC")
console.log("=================================================================")
console.log(`SQLite Path:  ${sqlitePath}`)
console.log(`Postgres URL: ${pgUrl.replace(/:[^:@]*@/, ":***@")}`)

if (!existsSync(sqlitePath)) {
  console.error(`\n[!] Error: SQLite database not found at ${sqlitePath}`)
  console.error("    Start the dev server first or run 'pnpm dev:api' to generate it.")
  process.exit(1)
}

const sqliteDb = knex({
  client: "better-sqlite3",
  connection: { filename: sqlitePath },
  useNullAsDefault: true,
})

const pgDb = knex({
  client: "pg",
  connection: pgUrl,
})

async function checkConnections() {
  try {
    await sqliteDb.raw("SELECT 1")
    console.log("  [✓] SQLite connected successfully")
  } catch (err) {
    console.error(`  [✗] SQLite connection failed: ${err.message}`)
    process.exit(1)
  }

  try {
    await pgDb.raw("SELECT 1")
    console.log("  [✓] PostgreSQL connected successfully")
  } catch (err) {
    console.error(`  [✗] PostgreSQL connection failed: ${err.message}`)
    console.error("      Ensure PostgreSQL is running if you want to sync with it.")
    process.exit(1)
  }
}

async function getSqliteTables() {
  const rows = await sqliteDb.raw(
    "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' AND name NOT LIKE 'knex_%' ORDER BY name"
  )
  return (Array.isArray(rows) ? rows : []).map((r) => r.name)
}

async function getPgTables() {
  const rows = await pgDb.raw(`
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE'
      AND table_name NOT LIKE 'knex_%'
    ORDER BY table_name
  `)
  const result = rows?.rows || rows
  return (Array.isArray(result) ? result : []).map((r) => r.table_name)
}

async function showStatus() {
  await checkConnections()
  console.log("\n>> Scanning Database Status...")
  const sqliteTables = await getSqliteTables()
  const pgTables = await getPgTables()

  const allTables = Array.from(new Set([...sqliteTables, ...pgTables])).sort()
  console.log(`\nFound ${allTables.length} total distinct tables.\n`)

  const summary = []
  for (const table of allTables) {
    let sqliteCount = "-"
    let pgCount = "-"

    if (sqliteTables.includes(table)) {
      try {
        const [{ cnt }] = await sqliteDb(table).count("* as cnt")
        sqliteCount = String(cnt)
      } catch {
        sqliteCount = "ERR"
      }
    }

    if (pgTables.includes(table)) {
      try {
        const [{ cnt }] = await pgDb(table).count("* as cnt")
        pgCount = String(cnt)
      } catch {
        pgCount = "ERR"
      }
    }

    summary.push({
      Table: table,
      "SQLite (Local)": sqliteCount,
      "PostgreSQL (Remote)": pgCount,
      Status:
        sqliteCount === pgCount
          ? "In Sync"
          : sqliteCount === "-"
            ? "PostgreSQL only"
            : pgCount === "-"
              ? "SQLite only"
              : "Count Drift",
    })
  }

  console.table(summary)
}

async function syncUp() {
  await checkConnections()
  console.log("\n>> Syncing SQLite (Local) -> PostgreSQL (Remote)...")
  const tables = await getSqliteTables()
  const pgTables = new Set(await getPgTables())

  let syncedTables = 0
  let totalRows = 0

  for (const table of tables) {
    if (!pgTables.has(table)) {
      console.log(`  [-] Skipping table '${table}' (does not exist in PostgreSQL schema)`)
      continue
    }

    const rows = await sqliteDb(table).select("*")
    if (rows.length === 0) continue

    // Batch insert into PG
    const chunkSize = 200
    for (let i = 0; i < rows.length; i += chunkSize) {
      const chunk = rows.slice(i, i + chunkSize)
      if (chunk[0]?.id !== undefined) {
        await pgDb(table).insert(chunk).onConflict("id").merge()
      } else {
        await pgDb(table).insert(chunk).onConflict().ignore()
      }
    }

    // Reset Postgres sequence if auto-increment primary key
    try {
      await pgDb.raw(
        `SELECT setval(pg_get_serial_sequence(?, 'id'), COALESCE(MAX(id), 1)) FROM ${table}`,
        [table]
      )
    } catch {
      // Sequence might not exist, safe to ignore
    }

    syncedTables++
    totalRows += rows.length
    console.log(`  [✓] Synced '${table}': ${rows.length} rows`)
  }

  console.log(`\n>> Sync Up Complete: ${syncedTables} tables, ${totalRows} rows pushed to PostgreSQL.`)
}

async function syncDown() {
  await checkConnections()
  console.log("\n>> Syncing PostgreSQL (Remote) -> SQLite (Local)...")
  const pgTables = await getPgTables()
  const sqliteTables = new Set(await getSqliteTables())

  let syncedTables = 0
  let totalRows = 0

  for (const table of pgTables) {
    if (!sqliteTables.has(table)) {
      console.log(`  [-] Skipping table '${table}' (does not exist in SQLite schema)`)
      continue
    }

    const rows = await pgDb(table).select("*")
    if (rows.length === 0) continue

    // Batch insert into SQLite
    const chunkSize = 200
    for (let i = 0; i < rows.length; i += chunkSize) {
      const chunk = rows.slice(i, i + chunkSize)
      if (chunk[0]?.id !== undefined) {
        await sqliteDb(table).insert(chunk).onConflict("id").merge()
      } else {
        await sqliteDb(table).insert(chunk).onConflict().ignore()
      }
    }

    syncedTables++
    totalRows += rows.length
    console.log(`  [✓] Synced '${table}': ${rows.length} rows`)
  }

  console.log(`\n>> Sync Down Complete: ${syncedTables} tables, ${totalRows} rows pulled to SQLite.`)
}

async function main() {
  try {
    if (isStatus) {
      await showStatus()
    } else if (isUp) {
      await syncUp()
    } else if (isDown) {
      await syncDown()
    }
  } finally {
    await sqliteDb.destroy()
    await pgDb.destroy()
  }
}

main().catch((err) => {
  console.error("\n[!] Sync fatal error:", err)
  process.exit(1)
})
