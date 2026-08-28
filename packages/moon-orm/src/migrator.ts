import { createHash } from 'node:crypto'
import * as fs from 'node:fs'
import * as path from 'node:path'
import { pathToFileURL } from 'node:url'
import type { Knex } from 'knex'
import { getDb } from './config.js'
import { forge, type MigrationCommand } from './schema-sync.js'

const MIGRATION_LOCK_KEY = 'moonwitness:migrations:v1'

const MIGRATION_FILE_RE = /^\d{14}_[a-zA-Z0-9_-]+\.(ts|js)$/

type MigrationModule = {
  up: (db: Knex) => Promise<void>
  down?: (db: Knex) => Promise<void>
  nonReversible?: boolean
}

type AppliedMigration = {
  id: number
  name: string
  batch: number
  checksum?: string | null
}

export type MigrationStatus = {
  name: string
  checksum: string
  batch?: number
  state: 'applied' | 'pending' | 'checksum_mismatch' | 'missing'
}

export async function initMigrationTable(db: Knex = getDb()) {
  const exists = await db.schema.hasTable('moon_migrations')
  if (!exists) {
    await db.schema.createTable('moon_migrations', (table) => {
      table.increments('id').primary()
      table.string('name').notNullable().unique()
      table.string('checksum', 64).notNullable()
      table.integer('batch').notNullable()
      table.timestamp('run_at').defaultTo(db.fn.now())
      table.index(['batch'], 'moon_migrations_batch_index')
    })
    return
  }

  const hasChecksum = await db.schema.hasColumn('moon_migrations', 'checksum')
  if (!hasChecksum) {
    await db.schema.alterTable('moon_migrations', (table) => {
      table.string('checksum', 64).nullable()
    })
  }

  try {
    await db.schema.alterTable('moon_migrations', (table) => {
      table.index(['batch'], 'moon_migrations_batch_index')
    })
  } catch {
    // index may already exist under a different name
  }
}

export async function getMigrationFiles(dir: string): Promise<string[]> {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
  return fs.readdirSync(dir)
    .filter((file) => MIGRATION_FILE_RE.test(file))
    .sort()
}

function checksum(filePath: string): string {
  return createHash('sha256').update(fs.readFileSync(filePath)).digest('hex')
}

async function loadMigration(filePath: string): Promise<MigrationModule> {
  if (!fs.existsSync(filePath)) throw new Error(`Migration file is missing: ${filePath}`)
  const source = fs.readFileSync(filePath, 'utf8')
  const fileChecksum = createHash('sha256').update(source).digest('hex')
  const fileUrl = pathToFileURL(filePath).href
  const mod = await import(`${fileUrl}?checksum=${fileChecksum}`) as MigrationModule
  if (typeof mod.up !== 'function') {
    throw new Error(`Migration ${path.basename(filePath)} is missing required up() function`)
  }
  return {
    up: mod.up,
    down: mod.down,
    nonReversible: mod.nonReversible ?? source.includes('Manual intervention required')
  }
}

async function withMigrationLock<T>(fn: (db: Knex) => Promise<T>): Promise<T> {
  const db = getDb()
  const client = String((db.client.config as { client?: string }).client || '')
  if (client.includes('pg')) {
    return db.transaction(async (trx) => {
      await trx.raw('SELECT pg_advisory_xact_lock(hashtext(?))', [MIGRATION_LOCK_KEY])
      return fn(trx)
    })
  }

  if (client.includes('sqlite')) {
    return db.transaction(async (trx) => {
      await trx.raw('PRAGMA journal_mode=WAL')
      await trx('moon_migrations').insert({ name: '__migration_lock__', checksum: '', batch: 0 }).onConflict('name').ignore()
      try {
        return fn(trx)
      } finally {
        await trx('moon_migrations').where({ name: '__migration_lock__' }).delete()
      }
    })
  }

  return fn(db)
}

async function readApplied(db: Knex): Promise<AppliedMigration[]> {
  return db('moon_migrations').select('id', 'name', 'batch', 'checksum') as Promise<AppliedMigration[]>
}

async function verifyAppliedChecksums(db: Knex, migrationsDir: string): Promise<void> {
  for (const row of await readApplied(db)) {
    const filePath = path.join(migrationsDir, row.name)
    if (!fs.existsSync(filePath)) throw new Error(`Applied migration file is missing: ${row.name}`)
    const currentChecksum = checksum(filePath)
    if (row.checksum && row.checksum !== currentChecksum) {
      throw new Error(`Migration checksum mismatch: ${row.name}`)
    }
    if (!row.checksum) {
      await db('moon_migrations').where({ id: row.id }).update({ checksum: currentChecksum })
    }
  }
}

export async function status(
  migrationsDir: string = path.join(process.cwd(), 'migrations')
): Promise<MigrationStatus[]> {
  await initMigrationTable()
  const db = getDb()
  const applied = new Map((await readApplied(db)).map((row) => [row.name, row]))
  const files = await getMigrationFiles(migrationsDir)
  const result: MigrationStatus[] = []

  for (const file of files) {
    const filePath = path.join(migrationsDir, file)
    const fileChecksum = checksum(filePath)
    const row = applied.get(file)
    if (!row) {
      result.push({ name: file, checksum: fileChecksum, state: 'pending' })
      continue
    }
    if (row.checksum && row.checksum !== fileChecksum) {
      result.push({ name: file, checksum: fileChecksum, batch: row.batch, state: 'checksum_mismatch' })
    } else {
      result.push({ name: file, checksum: fileChecksum, batch: row.batch, state: 'applied' })
    }
  }

  for (const row of applied.values()) {
    if (!files.includes(row.name)) {
      result.push({ name: row.name, checksum: row.checksum || '', batch: row.batch, state: 'missing' })
    }
  }
  return result
}

export async function check(
  migrationsDir: string = path.join(process.cwd(), 'migrations')
): Promise<MigrationStatus[]> {
  const current = await status(migrationsDir)
  const invalid = current.filter((item) => item.state === 'checksum_mismatch' || item.state === 'missing')
  if (invalid.length > 0) {
    throw new Error(`Migration integrity check failed: ${invalid.map((item) => `${item.name} (${item.state})`).join(', ')}`)
  }
  return current
}

function writeAutoMigration(
  migrationsDir: string,
  label: string,
  migrations: MigrationCommand[]
): string {
  if (!fs.existsSync(migrationsDir)) fs.mkdirSync(migrationsDir, { recursive: true })
  const timestamp = new Date().toISOString().replace(/[-:T]/g, '').split('.')[0]
  const filepath = path.join(migrationsDir, `${timestamp}_${label}.ts`)
  const upStmts = migrations.map((migration) => `  await db.raw(\`${migration.up}\`)`).join('\n')
  const downStmts = migrations.map((migration) => `  await db.raw(\`${migration.down}\`)`).join('\n')
  fs.writeFileSync(filepath, `import type { Knex } from 'knex'\n\nexport async function up(db: Knex): Promise<void> {\n${upStmts}\n}\n\nexport async function down(db: Knex): Promise<void> {\n${downStmts}\n}\n`)
  return filepath
}

function detectNonReversible(migrations: MigrationCommand[]): boolean {
  return migrations.some((migration) => migration.down.includes('Manual intervention required'))
}

export async function diff(migrationsDir: string = path.join(process.cwd(), 'migrations')) {
  console.log('Detecting schema changes...')
  const { migrations } = await forge({ dryRun: true })
  if (migrations.length === 0) {
    console.log('No schema changes detected. Everything is up to date.')
    return
  }
  if (detectNonReversible(migrations)) {
    throw new Error('Refusing to generate a non-reversible migration. Supply an explicit rollback before continuing.')
  }

  const filepath = writeAutoMigration(migrationsDir, 'auto', migrations)
  console.log(`Migration generated: ${filepath}`)
  return filepath
}

/**
 * Generate a full baseline migration that captures the entire current registry
 * schema (every table, column, FK, index and M2M junction derived from the
 * registered models). This is the zero-state seed used to make a fresh
 * PostgreSQL install migration-complete without relying on runtime schema repair.
 * Returns the generated file path, or null when the schema is already in sync.
 */
export async function snapshot(migrationsDir: string = path.join(process.cwd(), 'migrations')): Promise<string | null> {
  const { migrations } = await forge({ dryRun: true })
  if (migrations.length === 0) {
    console.log('Schema is already in sync; no baseline migration needed.')
    return null
  }
  if (detectNonReversible(migrations)) {
    throw new Error('Refusing to generate a non-reversible baseline. Supply an explicit rollback before continuing.')
  }
  const filepath = writeAutoMigration(migrationsDir, 'baseline', migrations)
  console.log(`Baseline migration snapshot generated: ${filepath}`)
  return filepath
}

/**
 * Materialize any schema drift that remains after the committed migration files
 * have been applied. The drift is captured from `forge({ dryRun: true })`, written
 * as a recorded auto-migration, and applied. This guarantees a zero-state install
 * reaches full parity with the registry so the running application never needs to
 * perform runtime schema repair.
 */
async function syncPendingSchema(db: Knex, migrationsDir: string): Promise<boolean> {
  const { migrations } = await forge({ dryRun: true })
  if (migrations.length === 0) return false
  if (detectNonReversible(migrations)) {
    console.warn(
      '[moon.migrate] Schema drift contains a non-reversible column change; refusing automatic migration. ' +
      'Run `moon diff` to author an explicit reviewed migration before continuing.'
    )
    return false
  }

  const filepath = writeAutoMigration(migrationsDir, 'auto', migrations)
  const mod = await loadMigration(filepath)
  const lastBatchRow = await db('moon_migrations').max('batch as maxBatch').first()
  const nextBatch = (Number(lastBatchRow?.maxBatch) || 0) + 1
  await db.transaction(async (trx) => {
    console.log(`Migrating (schema sync): ${path.basename(filepath)}`)
    await mod.up!(trx)
    await trx('moon_migrations').insert({
      name: path.basename(filepath),
      checksum: checksum(filepath),
      batch: nextBatch,
    })
  })
  return true
}

export async function up(migrationsDir: string = path.join(process.cwd(), 'migrations')) {
  return withMigrationLock(async (db) => {
    await initMigrationTable(db)
    await verifyAppliedChecksums(db, migrationsDir)
    const files = await getMigrationFiles(migrationsDir)
    const appliedNames = new Set((await readApplied(db)).map((row) => row.name))
    const pendingFiles = files.filter((file) => !appliedNames.has(file))

    if (pendingFiles.length > 0) {
      const lastBatchRow = await db('moon_migrations').max('batch as maxBatch').first()
      const nextBatch = (Number(lastBatchRow?.maxBatch) || 0) + 1
      console.log(`Running ${pendingFiles.length} migrations...`)
      for (const file of pendingFiles) {
        const filePath = path.join(migrationsDir, file)
        const mod = await loadMigration(filePath)
        await db.transaction(async (trx) => {
          console.log(`Migrating: ${file}`)
          await mod.up!(trx)
          await trx('moon_migrations').insert({ name: file, checksum: checksum(filePath), batch: nextBatch })
        })
      }
    } else {
      console.log('No pending migration files.')
    }

    // Zero-state guarantee: bring the install to full schema parity with the
    // registry by recording and applying any remaining drift as a migration.
    if (process.env.MOON_NO_AUTO_MIGRATE !== 'true') {
      await syncPendingSchema(db, migrationsDir)
    }

    console.log('Migrations completed.')
  })
}

/**
 * Bootstrap a zero-state PostgreSQL install to migration-completeness: generate a
 * baseline snapshot for the current registry (if any drift remains) and apply every
 * pending migration. Equivalent to `snapshot()` followed by `up()`.
 */
export async function bootstrap(migrationsDir: string = path.join(process.cwd(), 'migrations')) {
  await snapshot(migrationsDir)
  return up(migrationsDir)
}

export async function down(migrationsDir: string = path.join(process.cwd(), 'migrations')) {
  return withMigrationLock(async (db) => {
    await initMigrationTable(db)
    await verifyAppliedChecksums(db, migrationsDir)
    const lastBatchRow = await db('moon_migrations').max('batch as maxBatch').first()
    const lastBatch = Number(lastBatchRow?.maxBatch) || 0
    if (lastBatch === 0) {
      console.log('No migrations to rollback.')
      return
    }

    const batchRows = await db('moon_migrations').where({ batch: lastBatch }).orderBy('id', 'desc') as AppliedMigration[]
    console.log(`Rolling back ${batchRows.length} migrations from batch ${lastBatch}...`)
    for (const row of batchRows) {
      const mod = await loadMigration(path.join(migrationsDir, row.name))
      if (typeof mod.down !== 'function' || mod.nonReversible) {
        throw new Error(`Migration ${row.name} is not reversible: down() is required for rollback`)
      }
      await db.transaction(async (trx) => {
        console.log(`Rolling back: ${row.name}`)
        await mod.down!(trx)
        await trx('moon_migrations').where({ id: row.id }).delete()
      })
    }
    console.log('Rollback completed.')
  })
}
