import db from '../db.js'
import type { BaseModel } from './base.js'
import type { FieldDef } from './fields.js'

interface ColumnInfo {
  column_name: string
  data_type: string
  is_nullable: string
  character_maximum_length: number | null
}

interface PendingChange {
  model: string
  type: 'create_table' | 'add_column' | 'alter_column' | 'drop_column' | 'drop_table'
  detail: string
  safe: boolean
}

let lastPending: PendingChange[] = []

export async function syncSchema(): Promise<{
  applied: PendingChange[]
  pending: PendingChange[]
}> {
  const { getRegistry } = await import('./registry.js')
  const registry = getRegistry()
  const applied: PendingChange[] = []
  lastPending = []

  for (const [name, ModelClass] of registry) {
    const table = ModelClass.tableName(ModelClass)
    const fieldDefs = ModelClass.getFieldDefs(ModelClass)

    const exists = await tableExists(table)
    if (!exists) {
      await createTable(table, fieldDefs)
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

    for (const [fieldName, fieldDef] of Object.entries(
      fieldDefs
    )) {
      const colName = toSnakeCase(fieldName)
      const colType = mapFieldType(fieldDef)

      if (!existingColNames.has(colName)) {
        await addColumn(table, colName, colType)
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
          colType
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

  return { applied, pending: lastPending }
}

export function getLastPending(): PendingChange[] {
  return lastPending
}

async function tableExists(
  table: string
): Promise<boolean> {
  const rows = await db
    .select(db.raw('count(*) as cnt'))
    .from('information_schema.tables')
    .where({ table_schema: 'public', table_name: table })
  return Number((rows[0] as { cnt: number | string } | undefined)?.cnt) > 0
}

async function getColumns(
  table: string
): Promise<ColumnInfo[]> {
  const rows = await db
    .select(
      db.raw(`
        column_name, data_type,
        is_nullable, character_maximum_length
      `)
    )
    .from('information_schema.columns')
    .where({ table_schema: 'public', table_name: table })
  return rows as unknown as ColumnInfo[]
}

async function createTable(
  table: string,
  fieldDefs: Record<string, FieldDef>
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
  const sql = `CREATE TABLE ${sqlIdentifier(table)} (${cols.join(', ')})`
  await db.raw(sql)
}

async function addColumn(
  table: string,
  colName: string,
  colType: string
) {
  await db.raw(
    `ALTER TABLE ${sqlIdentifier(table)} ADD COLUMN ${colName} ${colType}`
  )
}

async function alterColumn(
  table: string,
  colName: string,
  colType: string
) {
  await db.raw(
    `ALTER TABLE ${sqlIdentifier(table)} ALTER COLUMN ${colName} TYPE ${colType}`
  )
}

function mapFieldType(field: FieldDef): string {
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
      return 'text'
    default:
      return 'text'
  }
}

function needsAlter(
  existing: ColumnInfo,
  field: FieldDef
): boolean {
  const expected = mapFieldType(field)
  const actual = normalizeType(existing.data_type)
  return actual !== normalizeType(expected)
}

function normalizeType(t: string): string {
  return t
    .replace(/character varying/, 'varchar')
    .replace(/double precision/, 'float8')
    .replace(/\(\d+\)$/, '')
    .trim()
}

function toSnakeCase(s: string): string {
  return s
    .replace(/[A-Z]/g, '_$1')
    .toLowerCase()
}

function sqlIdentifier(name: string): string {
  return `"${name.replace(/"/g, '""')}"`
}