import * as fs from 'fs'
import * as path from 'path'
import { getDb } from './config.js'
import { forge } from './schema-sync.js'

export async function initMigrationTable() {
  const db = getDb()
  const exists = await db.schema.hasTable('moon_migrations')
  if (!exists) {
    await db.schema.createTable('moon_migrations', (table) => {
      table.increments('id').primary()
      table.string('name').notNullable()
      table.integer('batch').notNullable()
      table.timestamp('run_at').defaultTo(db.fn.now())
    })
  }
}

export async function getMigrationFiles(dir: string): Promise<string[]> {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
  const files = fs.readdirSync(dir)
  return files.filter(f => f.endsWith('.ts') || f.endsWith('.js')).sort()
}

export async function diff(migrationsDir: string = path.join(process.cwd(), 'migrations')) {
  console.log('Detecting schema changes...')
  const { migrations, pending, applied } = await forge({ dryRun: true })
  
  if (migrations.length === 0) {
    console.log('No schema changes detected. Everything is up to date.')
    return
  }
  
  if (!fs.existsSync(migrationsDir)) {
    fs.mkdirSync(migrationsDir, { recursive: true })
  }
  
  const timestamp = new Date().toISOString().replace(/[-:T]/g, '').split('.')[0]
  const filename = `${timestamp}_auto.ts`
  const filepath = path.join(migrationsDir, filename)
  
  const upStmts = migrations.map(m => `  await db.raw(\`${m.up}\`)`).join('\n')
  const downStmts = migrations.map(m => `  await db.raw(\`${m.down}\`)`).join('\n')
  
  const content = `import type { Knex } from 'knex'

export async function up(db: Knex): Promise<void> {
${upStmts}
}

export async function down(db: Knex): Promise<void> {
${downStmts}
}
`
  
  fs.writeFileSync(filepath, content)
  console.log(`Migration generated: ${filepath}`)
}

export async function up(migrationsDir: string = path.join(process.cwd(), 'migrations')) {
  await initMigrationTable()
  const db = getDb()
  
  const files = await getMigrationFiles(migrationsDir)
  const appliedRows = await db('moon_migrations').select('name')
  const appliedNames = new Set(appliedRows.map((r: any) => r.name))
  
  const pendingFiles = files.filter(f => !appliedNames.has(f))
  
  if (pendingFiles.length === 0) {
    console.log('Database is up to date.')
    return
  }
  
  const lastBatchRow = await db('moon_migrations').max('batch as maxBatch').first()
  const nextBatch = (Number(lastBatchRow?.maxBatch) || 0) + 1
  
  console.log(`Running ${pendingFiles.length} migrations...`)
  
  for (const file of pendingFiles) {
    const filePath = path.join(migrationsDir, file)
    const fileUrl = 'file://' + filePath.replace(/\\/g, '/')
    const mod = await import(fileUrl)
    
    if (typeof mod.up === 'function') {
      await db.transaction(async (trx) => {
        console.log(`Migrating: ${file}`)
        await mod.up(trx)
        await trx('moon_migrations').insert({ name: file, batch: nextBatch })
      })
    } else {
      console.warn(`Migration ${file} is missing 'up' function.`)
    }
  }
  
  console.log('Migrations completed.')
}

export async function down(migrationsDir: string = path.join(process.cwd(), 'migrations')) {
  await initMigrationTable()
  const db = getDb()
  
  const lastBatchRow = await db('moon_migrations').max('batch as maxBatch').first()
  const lastBatch = Number(lastBatchRow?.maxBatch) || 0
  
  if (lastBatch === 0) {
    console.log('No migrations to rollback.')
    return
  }
  
  const batchRows = await db('moon_migrations').where({ batch: lastBatch }).orderBy('id', 'desc')
  
  console.log(`Rolling back ${batchRows.length} migrations from batch ${lastBatch}...`)
  
  for (const row of batchRows) {
    const filePath = path.join(migrationsDir, row.name)
    const fileUrl = 'file://' + filePath.replace(/\\/g, '/')
    
    if (fs.existsSync(filePath)) {
      const mod = await import(fileUrl)
      if (typeof mod.down === 'function') {
        await db.transaction(async (trx) => {
          console.log(`Rolling back: ${row.name}`)
          await mod.down(trx)
          await trx('moon_migrations').where({ id: row.id }).delete()
        })
      }
    } else {
      console.error(`Migration file ${row.name} not found! Rollback failed for this file.`)
    }
  }
  console.log('Rollback completed.')
}
