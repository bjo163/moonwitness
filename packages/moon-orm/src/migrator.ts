import { createHash } from 'node:crypto'
import * as fs from 'node:fs'
import * as path from 'node:path'
import { pathToFileURL } from 'node:url'
import type { Knex } from 'knex'
import { getDb } from './config.ts'
import { forge } from './schema-sync.ts'

const MIGRATION_LOCK_KEY = 'moonwitness:migrations:v1'

type MigrationModule = {
  up?: (db: Knex) => Promise<void>
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
  state: 'applied' | 'pending' | 'checksum_mismatch'
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
    })
    return
  }

  if (!(await db.schema.hasColumn('moon_migrations', 'checksum'))) {
    await db.schema.alterTable('moon_migrations', (table) => {
      table.string('checksum', 64).nullable()
    })
  }
}

export async function getMigrationFiles(dir: string): Promise<string[]> {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
  return fs.readdirSync(dir)
    .filter((file) => file.endsWith('.ts') || file.endsWith('.ts'))
    .sort()
}

function checksum(filePath: string): string {
  return createHash('sha256').update(fs.readFileSync(filePath)).digest('hex')
}

async function loadMigration(filePath: string): Promise<MigrationModule> {
  if (!fs.existsSync(filePath)) throw new Error(`Migration file is missing: ${filePath}`)
  const source = fs.readFileSync(filePath, 'utf8')
  const fileChecksum = createHash('sha256').update(source).digest('hex')
  const mod = await import(`${pathToFileURL(filePath).href}?checksum=${fileChecksum}`) as MigrationModule
  if (typeof mod.up !== 'function') {
    throw new Error(`Migration ${path.basename(filePath)} is missing required up() function`)
  }
  return { ...mod, nonReversible: source.includes('Manual intervention required') }
}

async function withMigrationLock<T>(fn: (db: Knex) => Promise<T>): Promise<T> {
  const db = getDb()
  const client = String((db.client.config as { client?: string }).client || '')
  if (!client.includes('pg')) return fn(db)

  return db.transaction(async (trx) => {
    await trx.raw('SELECT pg_advisory_xact_lock(hashtext(?))', [MIGRATION_LOCK_KEY])
    return fn(trx)
  })
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
    const fileChecksum = checksum(path.join(migrationsDir, file))
    const row = applied.get(file)
    result.push({
      name: file,
      checksum: fileChecksum,
      batch: row?.batch,
      state: !row ? 'pending' : row.checksum && row.checksum !== fileChecksum ? 'checksum_mismatch' : 'applied',
    })
  }

  for (const row of applied.values()) {
    if (!files.includes(row.name)) {
      result.push({ name: row.name, checksum: row.checksum || '', batch: row.batch, state: 'checksum_mismatch' })
    }
  }
  return result
}

export async function check(
  migrationsDir: string = path.join(process.cwd(), 'migrations')
): Promise<MigrationStatus[]> {
  const current = await status(migrationsDir)
  const invalid = current.filter((item) => item.state === 'checksum_mismatch')
  if (invalid.length > 0) {
    throw new Error(`Migration integrity check failed: ${invalid.map((item) => item.name).join(', ')}`)
  }
  return current
}

export async function diff(migrationsDir: string = path.join(process.cwd(), 'migrations')) {
  console.log('Detecting schema changes...')
  const { migrations } = await forge({ dryRun: true })
  if (migrations.length === 0) {
    console.log('No schema changes detected. Everything is up to date.')
    return
  }
  if (migrations.some((migration) => migration.down.includes('Manual intervention required'))) {
    throw new Error('Refusing to generate a non-reversible migration. Supply an explicit rollback before continuing.')
  }

  if (!fs.existsSync(migrationsDir)) fs.mkdirSync(migrationsDir, { recursive: true })
  const timestamp = new Date().toISOString().replace(/[-:T]/g, '').split('.')[0]
  const filepath = path.join(migrationsDir, `${timestamp}_auto.ts`)
  const upStmts = migrations.map((migration) => `  await db.raw(\`${migration.up}\`)`).join('\n')
  const downStmts = migrations.map((migration) => `  await db.raw(\`${migration.down}\`)`).join('\n')
  fs.writeFileSync(filepath, `import type { Knex } from 'knex'\n\nexport async function up(db: Knex): Promise<void> {\n${upStmts}\n}\n\nexport async function down(db: Knex): Promise<void> {\n${downStmts}\n}\n`)
  console.log(`Migration generated: ${filepath}`)
}

export async function up(migrationsDir: string = path.join(process.cwd(), 'migrations')) {
  return withMigrationLock(async (db) => {
    await initMigrationTable(db)
    await verifyAppliedChecksums(db, migrationsDir)
    const files = await getMigrationFiles(migrationsDir)
    const appliedNames = new Set((await readApplied(db)).map((row) => row.name))
    const pendingFiles = files.filter((file) => !appliedNames.has(file))
    if (pendingFiles.length === 0) {
      console.log('Database is up to date.')
      return
    }

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
    console.log('Migrations completed.')
  })
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
