import type { Knex } from 'knex'
import { getSchemaDb as getDb, withSchemaDb } from './schema-connection.js'
import type { Vertex } from './base.js'
import type { FieldDef } from './fields.js'

interface ColumnInfo {
  column_name: string
  data_type: string
  udt_name: string
  is_nullable: string
  character_maximum_length: number | null
  vector_dimension: number | null
  numeric_precision?: number | null
  numeric_scale?: number | null
}

export interface PendingChange {
  model: string
  type: 'create_table' | 'add_column' | 'alter_column' | 'drop_column' | 'drop_table' | 'add_fk' | 'create_m2m' | 'create_index'
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

export interface SchemaSyncResult {
  applied: PendingChange[]
  pending: PendingChange[]
  migrations: MigrationCommand[]
  summary: {
    totalModels: number
    totalColumns: number
    tablesCreated: number
    columnsAdded: number
    columnsAltered: number
    foreignKeysAdded: number
    indexesCreated: number
    m2mTablesCreated: number
  }
}

export interface SchemaSyncOptions { dryRun?: boolean; silent?: boolean; db?: Knex }

export async function forge(options: SchemaSyncOptions = {}): Promise<SchemaSyncResult> {
  // Check before resolving the connection: production startup performs no DB work.
  if (process.env.NODE_ENV === 'production' && !options.dryRun) {
    return runForge(options)
  }
  return withSchemaDb(options.db ?? getDb(), () => runForge(options))
}

async function runForge(options: SchemaSyncOptions): Promise<SchemaSyncResult> {
  const { getRegistry } = await import('./registry.js')
  const registry = getRegistry()
  const applied: PendingChange[] = []
  const migrations: MigrationCommand[] = []
  lastPending = []

  const summary = {
    totalModels: 0,
    totalColumns: 0,
    tablesCreated: 0,
    columnsAdded: 0,
    columnsAltered: 0,
    foreignKeysAdded: 0,
    indexesCreated: 0,
    m2mTablesCreated: 0,
  }

  // Production DDL is exclusively the explicit committed migration lifecycle.
  if (process.env.NODE_ENV === 'production' && !options.dryRun) {
    if (!options.silent) {
      console.warn('[moon.schema] Production runtime sync disabled; apply reviewed migration files.')
    }
    return { applied, pending: [], migrations, summary }
  }

  const requiresVector = [...registry.values()].some((model) =>
    !(model as any)._abstract && Object.values(model.getFieldDefs(model)).some((field) => field.type === 'vector'))
  if (requiresVector) {
    const extension = { up: 'CREATE EXTENSION IF NOT EXISTS vector', down: '-- Shared vector extension retained intentionally' }
    if (options.dryRun) {
      // Planning is read-only; provision extensions explicitly via generated SQL.
      const result = await getDb().raw("SELECT 1 FROM pg_extension WHERE extname = 'vector'")
      if ((result?.rows ?? result).length === 0) migrations.push(extension)
    } else {
      await getDb().raw(extension.up)
    }
  }

  const deferredFks: DeferredFK[] = []
  const deferredM2m: DeferredM2M[] = []
  const deferredIndexes: { table: string, colName: string, modelName: string, isVector?: boolean }[] = []

  // Pass 1: Tables and physical columns
  for (const [name, ModelClass] of registry) {
    if ((ModelClass as any)._abstract) continue
    summary.totalModels++

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
      summary.totalColumns++

      if (fieldDef.type === 'many2one' && fieldDef.comodel) {
        deferredFks.push({ table, colName: toSnakeCase(fieldName), comodel: fieldDef.comodel, modelName: name })
      }

      if (fieldDef.index || fieldDef.type === 'vector') {
        deferredIndexes.push({
          table,
          colName: toSnakeCase(fieldName),
          modelName: name,
          isVector: fieldDef.type === 'vector'
        })
      }
    }

    const exists = await tableExists(table)
    if (!exists) {
      await createTable(table, physicalFields, options.dryRun, migrations)
      summary.tablesCreated++
      const change: PendingChange = {
        model: name,
        type: 'create_table',
        detail: `Created table ${table} (${Object.keys(physicalFields).length} fields)`,
        safe: true
      }
      applied.push(change)
      if (!options.silent) {
        console.log(`\x1b[32m[moon.schema]\x1b[0m [+] Table created: \x1b[1m${table}\x1b[0m (${Object.keys(physicalFields).length} fields)`)
      }
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
        await addColumn(table, colName, fieldDef, options.dryRun, migrations)
        summary.columnsAdded++
        const change: PendingChange = {
          model: name,
          type: 'add_column',
          detail: `Added column ${colName} to ${table} (${colType})`,
          safe: true
        }
        applied.push(change)
        if (!options.silent) {
          console.log(`\x1b[32m[moon.schema]\x1b[0m [+] Column added: \x1b[1m${table}.${colName}\x1b[0m (${colType})`)
        }
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
        summary.columnsAltered++
        const change: PendingChange = {
          model: name,
          type: 'alter_column',
          detail: `Altered column ${colName} in ${table} -> ${colType}`,
          safe: true
        }
        applied.push(change)
        if (!options.silent) {
          console.log(`\x1b[33m[moon.schema]\x1b[0m [~] Column altered: \x1b[1m${table}.${colName}\x1b[0m ➔ ${colType}`)
        }
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
        summary.foreignKeysAdded++
        const change: PendingChange = {
          model: fk.modelName,
          type: 'add_fk',
          detail: `Added foreign key ${fk.table}(${fk.colName}) -> ${refTable}(id)`,
          safe: true
        }
        applied.push(change)
        if (!options.silent) {
          console.log(`\x1b[32m[moon.schema]\x1b[0m [+] Foreign key added: \x1b[1m${fk.table}(${fk.colName})\x1b[0m ➔ ${refTable}(id)`)
        }
      } catch (err: any) {
        if (!options.silent) {
          console.warn(`[moon.schema] Note: Foreign key for ${fk.table}(${fk.colName}) deferred:`, err.message)
        }
      }
    }
  }

  // Pass 3: Many2many Junction Tables
  for (const m2m of deferredM2m) {
    const exists = await tableExists(m2m.relTable)
    if (!exists) {
      await createM2MTable(m2m.relTable, m2m.table1, m2m.table2, options.dryRun, migrations)
      summary.m2mTablesCreated++
      const change: PendingChange = {
        model: m2m.modelName,
        type: 'create_m2m',
        detail: `Created many2many table ${m2m.relTable} (${m2m.table1} <-> ${m2m.table2})`,
        safe: true
      }
      applied.push(change)
      if (!options.silent) {
        console.log(`\x1b[32m[moon.schema]\x1b[0m [+] M2M Table created: \x1b[1m${m2m.relTable}\x1b[0m (${m2m.table1} <-> ${m2m.table2})`)
      }
    }
  }

  // Pass 4: Indexes
  for (const idx of deferredIndexes) {
    const idxName = `${idx.table}_${idx.colName}_idx`
    const exists = await hasIndex(idxName)
    if (!exists) {
      try {
        await createIndex(idx.table, idx.colName, idxName, idx.isVector ?? false, options.dryRun, migrations)
        summary.indexesCreated++
        const change: PendingChange = {
          model: idx.modelName,
          type: 'create_index',
          detail: `Created ${idx.isVector ? 'HNSW vector ' : ''}index ${idxName} on ${idx.table}(${idx.colName})`,
          safe: true
        }
        applied.push(change)
        if (!options.silent) {
          console.log(`\x1b[32m[moon.schema]\x1b[0m [+] Index created: \x1b[1m${idxName}\x1b[0m on ${idx.table}(${idx.colName})`)
        }
      } catch (err: any) {
        if (!options.silent) {
          console.warn(`[moon.schema] Note: Index creation for ${idx.table}(${idx.colName}) deferred:`, err.message)
        }
      }
    }
  }

  if (options.dryRun) {
    lastPending = applied
    return { applied: [], pending: lastPending, migrations, summary }
  }
  return { applied, pending: lastPending, migrations, summary }
}

export function getLastPending(): PendingChange[] {
  return lastPending
}

async function tableExists(table: string): Promise<boolean> {
  const db = getDb()
  const rows = await db
    .select(db.raw('count(*) as cnt'))
    .from('information_schema.tables')
    .where({ table_name: table })
    .whereRaw('table_schema = current_schema()')
  return Number((rows[0] as { cnt: number | string } | undefined)?.cnt) > 0
}

async function hasForeignKey(table: string, colName: string, refTable: string): Promise<boolean> {
  const db = getDb()
  const result = await db.raw(`
    SELECT 1
    FROM information_schema.key_column_usage kcu
    JOIN information_schema.table_constraints tc
      ON kcu.constraint_name = tc.constraint_name
      AND kcu.constraint_schema = tc.constraint_schema
      AND kcu.table_name = tc.table_name
    WHERE tc.constraint_type = 'FOREIGN KEY'
      AND kcu.table_schema = current_schema()
      AND kcu.table_name = ?
      AND kcu.column_name = ?
  `, [table, colName])
  const rows = result?.rows || result
  return Array.isArray(rows) && rows.length > 0
}

async function hasIndex(indexName: string): Promise<boolean> {
  const db = getDb()
  const rows = await db
    .select(db.raw('1'))
    .from('pg_indexes')
    .where({ indexname: indexName })
    .whereRaw('schemaname = current_schema()')
  return rows.length > 0
}

async function createIndex(
  table: string,
  colName: string,
  indexName: string,
  isVector: boolean = false,
  dryRun: boolean = false,
  migrations: MigrationCommand[] = []
) {
  const db = getDb()
  const sql = isVector
    ? `CREATE INDEX ${sqlIdentifier(indexName)} ON ${sqlIdentifier(table)} USING hnsw (${sqlIdentifier(colName)} vector_cosine_ops)`
    : `CREATE INDEX ${sqlIdentifier(indexName)} ON ${sqlIdentifier(table)} (${sqlIdentifier(colName)})`
  if (dryRun) {
    migrations.push({ up: sql, down: `DROP INDEX IF EXISTS ${sqlIdentifier(indexName)}` })
  } else {
    await db.raw(sql)
  }
}

async function getColumns(table: string): Promise<ColumnInfo[]> {
  const db = getDb()
  const rows = await db.raw(`
    SELECT c.column_name, c.data_type, c.udt_name, c.is_nullable,
      c.character_maximum_length, c.numeric_precision, c.numeric_scale,
      CASE WHEN c.udt_name = 'vector' THEN NULLIF(a.atttypmod - 4, -4) END AS vector_dimension
    FROM information_schema.columns c
    LEFT JOIN pg_catalog.pg_attribute a
      ON a.attrelid = to_regclass(format('%I.%I', current_schema(), ?::text)) AND a.attname = c.column_name AND a.attnum > 0
    WHERE c.table_schema = current_schema() AND c.table_name = ?
  `, [table, table])
  const resultRows = (rows as any).rows || rows
  return resultRows as unknown as ColumnInfo[]
}

function buildColumnSql(colName: string, fieldDef: FieldDef): string {
  const colType = mapFieldType(fieldDef)
  const parts = [sqlIdentifier(colName), colType]

  if (fieldDef.default !== undefined && fieldDef.default !== null) {
    if (typeof fieldDef.default === 'string') {
      parts.push(`DEFAULT '${fieldDef.default.replace(/'/g, "''")}'`)
    } else if (typeof fieldDef.default === 'boolean' || typeof fieldDef.default === 'number') {
      parts.push(`DEFAULT ${fieldDef.default}`)
    }
  } else if (fieldDef.autoNowAdd || fieldDef.autoNow) {
    parts.push('DEFAULT CURRENT_TIMESTAMP')
  }

  if (fieldDef.required) {
    parts.push('NOT NULL')
  }

  if (fieldDef.unique) {
    parts.push('UNIQUE')
  }

  return parts.join(' ')
}

async function createTable(
  table: string,
  fieldDefs: Record<string, FieldDef>,
  dryRun: boolean = false,
  migrations: MigrationCommand[] = []
) {
  const cols: string[] = ['id SERIAL PRIMARY KEY']
  for (const [fieldName, fieldDef] of Object.entries(fieldDefs)) {
    const colName = toSnakeCase(fieldName)
    cols.push(buildColumnSql(colName, fieldDef))
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
  fieldDef: FieldDef,
  dryRun: boolean = false,
  migrations: MigrationCommand[] = []
) {
  const db = getDb()
  const colDefSql = buildColumnSql(colName, fieldDef)
  const sql = `ALTER TABLE ${sqlIdentifier(table)} ADD COLUMN ${colDefSql}`
  if (dryRun) {
    migrations.push({ up: sql, down: `ALTER TABLE ${sqlIdentifier(table)} DROP COLUMN ${sqlIdentifier(colName)}` })
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
  const sql = `ALTER TABLE ${sqlIdentifier(table)} ALTER COLUMN ${sqlIdentifier(colName)} TYPE ${colType}`
  if (dryRun) {
    migrations.push({ up: sql, down: `-- Manual intervention required to down-migrate column type alteration for ${table}.${colName}` })
  } else {
    validateAutomaticAlteration(colType, table, colName)
    await db.raw(sql)
  }
}

export function validateAutomaticAlteration(colType: string, table = 'table', colName = 'column'): void {
  if (colType.startsWith('numeric(')) {
    throw new Error(`Decimal conversion for ${table}.${colName} requires an explicit reviewed migration; automatic alteration is refused.`)
  }
  if (colType.startsWith('vector(')) {
    throw new Error(`Vector dimension change for ${table}.${colName} requires an explicit reviewed migration; automatic alteration is refused.`)
  }
}

async function addForeignKey(
  table: string,
  colName: string,
  refTable: string,
  dryRun: boolean = false,
  migrations: MigrationCommand[] = []
) {
  const db = getDb()
  const constraintName = `${table}_${colName}_fkey`
  const sql = `
    ALTER TABLE ${sqlIdentifier(table)}
    ADD CONSTRAINT ${sqlIdentifier(constraintName)}
    FOREIGN KEY (${sqlIdentifier(colName)}) REFERENCES ${sqlIdentifier(refTable)}(id) ON DELETE SET NULL
  `
  if (dryRun) {
    migrations.push({ up: sql, down: `ALTER TABLE ${sqlIdentifier(table)} DROP CONSTRAINT ${sqlIdentifier(constraintName)}` })
  } else {
    await db.raw(sql)
  }
}

async function createM2MTable(
  relTable: string,
  table1: string,
  table2: string,
  dryRun: boolean = false,
  migrations: MigrationCommand[] = []
) {
  const db = getDb()
  const col1 = `${table1}_id`
  const col2 = `${table2}_id`
  const sql = `
    CREATE TABLE ${sqlIdentifier(relTable)} (
      ${sqlIdentifier(col1)} INTEGER REFERENCES ${sqlIdentifier(table1)}(id) ON DELETE CASCADE,
      ${sqlIdentifier(col2)} INTEGER REFERENCES ${sqlIdentifier(table2)}(id) ON DELETE CASCADE,
      PRIMARY KEY (${sqlIdentifier(col1)}, ${sqlIdentifier(col2)})
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
    case 'decimal':
      if (!Number.isInteger(field.precision) || !Number.isInteger(field.scale) ||
          field.precision! < 1 || field.precision! > 38 || field.scale! < 0 || field.scale! > field.precision!) {
        throw new Error('Decimal fields require precision 1..38 and scale 0..precision')
      }
      return `numeric(${field.precision},${field.scale})`
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
      return 'text' // Virtual relational fields
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
  if (field.type === 'decimal') {
    return actual !== 'numeric' || Number(existing.numeric_precision) !== field.precision ||
      Number(existing.numeric_scale) !== field.scale
  }
  if (actual === 'USER-DEFINED' && existing.udt_name === 'vector') {
    actual = 'vector'
    if (expected.startsWith('vector')) {
      const expectedDimension = Number(expected.match(/vector\((\d+)\)/)?.[1] ?? 0)
      if (existing.vector_dimension && expectedDimension && existing.vector_dimension !== expectedDimension) return true
      return false
    }
  }
  return normalizeType(actual) !== normalizeType(expected)
}

function normalizeType(t: string): string {
  return t
    .replace(/timestamp without time zone/, 'timestamp')
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
