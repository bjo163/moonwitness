import { getDb } from './config.js'
import type { Vertex } from './base.js'
import type { FieldDef } from './fields.js'

interface ColumnInfo {
  column_name: string
  data_type: string
  udt_name: string
  is_nullable: string
  character_maximum_length: number | null
}

interface PendingChange {
  model: string
  type: 'create_table' | 'add_column' | 'alter_column' | 'drop_column' | 'drop_table' | 'add_fk' | 'create_m2m'
  detail: string
  safe: boolean
}

let lastPending: PendingChange[] = []

interface DeferredFK {
  table: string
  colName: string
  comodel: string
  modelName: string
}

interface DeferredM2M {
  table1: string
  table2: string
  relTable: string
  modelName: string
}

export interface MigrationCommand {
  up: string
  down: string
}

export async function forge(options: { dryRun?: boolean } = {}): Promise<{
  applied: PendingChange[]
  pending: PendingChange[]
  migrations: MigrationCommand[]
}> {
  const { getRegistry } = await import('./registry.js')
  const registry = getRegistry()
  const applied: PendingChange[] = []
  const migrations: MigrationCommand[] = []
  lastPending = []

  // Initialize pgvector
  try {
    const db = getDb()
    await db.raw('CREATE EXTENSION IF NOT EXISTS vector')
  } catch (err: any) {
    console.warn('Failed to initialize pgvector extension:', err.message)
  }

  const deferredFks: DeferredFK[] = []
  const deferredM2m: DeferredM2M[] = []
  const deferredIndexes: { table: string, colName: string, modelName: string }[] = []

  // Pass 1: Tables and physical columns
  for (const [name, ModelClass] of registry) {
    if ((ModelClass as any)._abstract) continue;

    const table = ModelClass.tableName(ModelClass)
    const fieldDefs = ModelClass.getFieldDefs(ModelClass)

    const physicalFields: Record<string, FieldDef> = {}

    for (const [fieldName, fieldDef] of Object.entries(fieldDefs)) {
      if (fieldDef.type === 'one2many' || fieldDef.type === 'many2many') {
        if (fieldDef.type === 'many2many' && fieldDef.comodel) {
          const Comodel = registry.get(fieldDef.comodel)
          if (Comodel) {
            const table2 = Comodel.tableName(Comodel)
            const relTable = (fieldDef as any).relation || `${table}_${table2}_rel`
            deferredM2m.push({ table1: table, table2, relTable, modelName: name })
          }
        }
        continue
      }
      
      if (fieldDef.compute && !fieldDef.store) {
        continue // Computed fields are not physical columns unless store=true
      }
      
      physicalFields[fieldName] = fieldDef

      if (fieldDef.type === 'many2one' && fieldDef.comodel) {
        deferredFks.push({ table, colName: toSnakeCase(fieldName), comodel: fieldDef.comodel, modelName: name })
      }
      
      if (fieldDef.index) {
        deferredIndexes.push({ table, colName: toSnakeCase(fieldName), modelName: name })
      }
    }

    const exists = await tableExists(table)
    if (!exists) {
      await createTable(table, physicalFields, options.dryRun, migrations)
      applied.push({
        model: name,
        type: 'create_table',
        detail: `Created table ${table}`,
        safe: true
      })
      continue
    }

    const existingCols = await getColumns(table)
    const existingColNames = new Set(
      existingCols.map((c) => c.column_name)
    )

    for (const [fieldName, fieldDef] of Object.entries(physicalFields)) {
      const colName = toSnakeCase(fieldName)
      const colType = mapFieldType(fieldDef)

      if (!existingColNames.has(colName)) {
        await addColumn(table, colName, colType, options.dryRun, migrations)
        applied.push({
          model: name,
          type: 'add_column',
          detail: `Added column ${colName} to ${table}`,
          safe: true
        })
        continue
      }

      const existing = existingCols.find(
        (c) => c.column_name === colName
      )
      if (existing && needsAlter(existing, fieldDef)) {
        await alterColumn(
          table,
          colName,
          colType,
          options.dryRun,
          migrations
        )
        applied.push({
          model: name,
          type: 'alter_column',
          detail: `Altered column ${colName} in ${table}`,
          safe: true
        })
      }
    }
  }

  // Pass 2: Foreign Keys
  for (const fk of deferredFks) {
    const Comodel = registry.get(fk.comodel)
    if (!Comodel) continue
    const refTable = Comodel.tableName(Comodel)
    
    const exists = await hasForeignKey(fk.table, fk.colName, refTable)
    if (!exists) {
      try {
        await addForeignKey(fk.table, fk.colName, refTable, options.dryRun, migrations)
        applied.push({
          model: fk.modelName,
          type: 'add_fk',
          detail: `Added foreign key ${fk.table}(${fk.colName}) -> ${refTable}(id)`,
          safe: true
        })
      } catch (err: any) {
        console.warn(`Failed to add foreign key for ${fk.table}(${fk.colName}):`, err.message)
      }
    }
  }

  // Pass 3: Many2many Junction Tables
  for (const m2m of deferredM2m) {
    const exists = await tableExists(m2m.relTable)
    if (!exists) {
      await createM2MTable(m2m.relTable, m2m.table1, m2m.table2, options.dryRun, migrations)
      applied.push({
        model: m2m.modelName,
        type: 'create_m2m',
        detail: `Created many2many table ${m2m.relTable}`,
        safe: true
      })
    }
  }

  // Pass 4: Indexes
  for (const idx of deferredIndexes) {
    const idxName = `${idx.table}_${idx.colName}_idx`
    const exists = await hasIndex(idxName)
    if (!exists) {
      try {
        await createIndex(idx.table, idx.colName, idxName, options.dryRun, migrations)
        applied.push({
          model: idx.modelName,
          type: 'add_column',
          detail: `Created index ${idxName} on ${idx.table}(${idx.colName})`,
          safe: true
        })
      } catch (err: any) {
        console.warn(`Failed to create index for ${idx.table}(${idx.colName}):`, err.message)
      }
    }
  }

  return { applied, pending: lastPending, migrations }
}

async function hasIndex(indexName: string): Promise<boolean> {
  const db = getDb()
  const rows = await db
    .select(db.raw('1'))
    .from('pg_indexes')
    .where({ indexname: indexName })
  return rows.length > 0
}

async function createIndex(table: string, colName: string, indexName: string, dryRun: boolean = false, migrations: MigrationCommand[] = []) {
  const db = getDb()
  const sql = `CREATE INDEX ${sqlIdentifier(indexName)} ON ${sqlIdentifier(table)} (${sqlIdentifier(colName)})`
  if (dryRun) {
    migrations.push({ up: sql, down: `DROP INDEX IF EXISTS ${sqlIdentifier(indexName)}` })
  } else {
    await db.raw(sql)
  }
}

export function getLastPending(): PendingChange[] {
  return lastPending
}

async function tableExists(table: string): Promise<boolean> {
  const db = getDb()
  const rows = await db
    .select(db.raw('count(*) as cnt'))
    .from('information_schema.tables')
    .where({ table_schema: 'public', table_name: table })
  return Number((rows[0] as { cnt: number | string } | undefined)?.cnt) > 0
}

async function hasForeignKey(table: string, colName: string, refTable: string): Promise<boolean> {
  const db = getDb()
  const result = await db.raw(`
    SELECT 1
    FROM information_schema.key_column_usage kcu
    JOIN information_schema.table_constraints tc
      ON kcu.constraint_name = tc.constraint_name
    WHERE tc.constraint_type = 'FOREIGN KEY'
      AND kcu.table_name = ?
      AND kcu.column_name = ?
  `, [table, colName])
  // Knex raw output format differs by dialect, try rows or direct array
  const rows = result.rows || result
  return Array.isArray(rows) && rows.length > 0
}

async function getColumns(table: string): Promise<ColumnInfo[]> {
  const db = getDb()
  const rows = await db
    .select(
      db.raw(`
        column_name, data_type, udt_name,
        is_nullable, character_maximum_length
      `)
    )
    .from('information_schema.columns')
    .where({ table_schema: 'public', table_name: table })
  return rows as unknown as ColumnInfo[]
}

async function createTable(
  table: string,
  fieldDefs: Record<string, FieldDef>,
  dryRun: boolean = false,
  migrations: MigrationCommand[] = []
) {
  const cols: string[] = ['id SERIAL PRIMARY KEY']
  for (const [fieldName, fieldDef] of Object.entries(
    fieldDefs
  )) {
    const colName = toSnakeCase(fieldName)
    const colType = mapFieldType(fieldDef)
    const nullable = fieldDef.required
      ? 'NOT NULL'
      : ''
    cols.push(
      `${colName} ${colType} ${nullable}`.trim()
    )
  }
  const db = getDb()
  const sql = `CREATE TABLE ${sqlIdentifier(table)} (${cols.join(', ')})`
  if (dryRun) {
    migrations.push({ up: sql, down: `DROP TABLE IF EXISTS ${sqlIdentifier(table)} CASCADE` })
  } else {
    await db.raw(sql)
  }
}

async function addColumn(
  table: string,
  colName: string,
  colType: string,
  dryRun: boolean = false,
  migrations: MigrationCommand[] = []
) {
  const db = getDb()
  const sql = `ALTER TABLE ${sqlIdentifier(table)} ADD COLUMN ${colName} ${colType}`
  if (dryRun) {
    migrations.push({ up: sql, down: `ALTER TABLE ${sqlIdentifier(table)} DROP COLUMN ${colName}` })
  } else {
    await db.raw(sql)
  }
}

async function alterColumn(
  table: string,
  colName: string,
  colType: string,
  dryRun: boolean = false,
  migrations: MigrationCommand[] = []
) {
  const db = getDb()
  const sql = `ALTER TABLE ${sqlIdentifier(table)} ALTER COLUMN ${colName} TYPE ${colType}`
  if (dryRun) {
    migrations.push({ up: sql, down: `-- Manual intervention required to down-migrate column type alteration for ${table}.${colName}` })
  } else {
    await db.raw(sql)
  }
}

async function addForeignKey(table: string, colName: string, refTable: string, dryRun: boolean = false, migrations: MigrationCommand[] = []) {
  const db = getDb()
  const sql = `
    ALTER TABLE ${sqlIdentifier(table)}
    ADD CONSTRAINT ${sqlIdentifier(`${table}_${colName}_fkey`)}
    FOREIGN KEY (${sqlIdentifier(colName)}) REFERENCES ${sqlIdentifier(refTable)}(id) ON DELETE SET NULL
  `
  if (dryRun) {
    migrations.push({ up: sql, down: `ALTER TABLE ${sqlIdentifier(table)} DROP CONSTRAINT ${sqlIdentifier(`${table}_${colName}_fkey`)}` })
  } else {
    await db.raw(sql)
  }
}

async function createM2MTable(relTable: string, table1: string, table2: string, dryRun: boolean = false, migrations: MigrationCommand[] = []) {
  const db = getDb()
  const sql = `
    CREATE TABLE ${sqlIdentifier(relTable)} (
      ${sqlIdentifier(table1 + '_id')} INTEGER REFERENCES ${sqlIdentifier(table1)}(id) ON DELETE CASCADE,
      ${sqlIdentifier(table2 + '_id')} INTEGER REFERENCES ${sqlIdentifier(table2)}(id) ON DELETE CASCADE,
      PRIMARY KEY (${sqlIdentifier(table1 + '_id')}, ${sqlIdentifier(table2 + '_id')})
    )
  `
  if (dryRun) {
    migrations.push({ up: sql, down: `DROP TABLE IF EXISTS ${sqlIdentifier(relTable)} CASCADE` })
  } else {
    await db.raw(sql)
  }
}

function mapFieldType(field: FieldDef): string {
  if (field.translate) {
    return 'jsonb'
  }
  switch (field.type) {
    case 'char':
      return `varchar(${field.size ?? 255})`
    case 'text':
      return 'text'
    case 'integer':
      return 'integer'
    case 'float':
      return 'double precision'
    case 'boolean':
      return 'boolean'
    case 'date':
      return 'date'
    case 'datetime':
      return 'timestamp'
    case 'selection':
      return 'varchar(255)'
    case 'many2one':
      return 'integer'
    case 'one2many':
    case 'many2many':
      return 'text' // should not be used for physical cols anymore
    case 'vector':
      return `vector(${field.dim ?? 1536})`
    default:
      return 'text'
  }
}

function needsAlter(
  existing: ColumnInfo,
  field: FieldDef
): boolean {
  const expected = mapFieldType(field)
  let actual = existing.data_type
  if (actual === 'USER-DEFINED' && existing.udt_name === 'vector') {
    actual = 'vector' // We only get 'vector' without dims from information_schema easily, so let's just ignore dim changes for now
    if (expected.startsWith('vector')) {
      return false
    }
  }
  return normalizeType(actual) !== normalizeType(expected)
}

function normalizeType(t: string): string {
  return t
    .replace(/character varying/, 'varchar')
    .replace(/double precision/, 'float8')
    .replace(/\(\d+\)$/, '')
    .trim()
}

function toSnakeCase(s: string): string {
  return s.replace(/([A-Z])/g, '_$1').toLowerCase()
}

function sqlIdentifier(name: string): string {
  return `"${name.replace(/"/g, '""')}"`
}