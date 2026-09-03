import type { Knex } from 'knex'

export type ReconciliationSeverity = 'error' | 'warning'
export interface ReconciliationIssue { code: string; severity: ReconciliationSeverity; table: string; column?: string; rows: number; message: string }
export interface LegacyReconciliationReport { schema: string; readOnly: true; checkedAt: string; issues: ReconciliationIssue[]; readyForStagingMigration: boolean }
export interface LegacyReconciliationInput {
  floatColumns?: Array<{ table: string; column: string; rows: number }>
  invalidNumericRows?: Array<{ table: string; column: string; rows: number }>
  nullCompanyRows?: Array<{ table: string; rows: number }>
  unbalancedMoves?: number
  negativeStockRows?: number
  overReservedRows?: number
}

export function evaluateLegacyRows(input: LegacyReconciliationInput): ReconciliationIssue[] {
  const issues: ReconciliationIssue[] = []
  for (const item of input.floatColumns ?? []) if (item.rows > 0) issues.push({ code: 'LEGACY_FLOAT_COLUMN', severity: 'error', table: item.table, column: item.column, rows: item.rows, message: 'Financial or stock quantity still uses floating-point storage.' })
  for (const item of input.invalidNumericRows ?? []) if (item.rows > 0) issues.push({ code: 'INVALID_NUMERIC_VALUE', severity: 'error', table: item.table, column: item.column, rows: item.rows, message: 'NaN, infinity, or null value must be reconciled before conversion.' })
  for (const item of input.nullCompanyRows ?? []) if (item.rows > 0) issues.push({ code: 'MISSING_COMPANY_SCOPE', severity: 'error', table: item.table, rows: item.rows, message: 'Every ERP financial/stock row must have an owning company.' })
  if ((input.unbalancedMoves ?? 0) > 0) issues.push({ code: 'UNBALANCED_JOURNAL', severity: 'error', table: 'account_move', rows: input.unbalancedMoves!, message: 'Posted journal entries do not balance to zero.' })
  if ((input.negativeStockRows ?? 0) > 0) issues.push({ code: 'NEGATIVE_STOCK', severity: 'error', table: 'stock_quant', rows: input.negativeStockRows!, message: 'Stock quantity or reserved quantity is negative.' })
  if ((input.overReservedRows ?? 0) > 0) issues.push({ code: 'OVER_RESERVED_STOCK', severity: 'error', table: 'stock_quant', rows: input.overReservedRows!, message: 'Reserved quantity exceeds available quantity.' })
  return issues
}

const identifiers = new Set(['account_move_line', 'account_move', 'stock_quant', 'stock_move'])
const columns: Array<[string, string]> = [
  ['account_move_line', 'debit'], ['account_move_line', 'credit'], ['account_move_line', 'balance'],
  ['stock_quant', 'quantity'], ['stock_quant', 'reserved_quantity'], ['stock_move', 'product_uom_qty'],
]
function tableName(name: string): string { if (!identifiers.has(name)) throw new Error(`Unsupported reconciliation table: ${name}`); return name }

export async function reconcileLegacyData(db: Knex, schema = 'public'): Promise<LegacyReconciliationReport> {
  const floatColumns: LegacyReconciliationInput['floatColumns'] = []
  const invalidNumericRows: LegacyReconciliationInput['invalidNumericRows'] = []
  for (const [table, column] of columns) {
    const metadata = await db('information_schema.columns').where({ table_schema: schema, table_name: table, column_name: column }).first('data_type')
    if (!metadata) continue
    if (metadata.data_type === 'double precision' || metadata.data_type === 'real') {
      const result = await db(tableName(table)).count({ rows: '*' }).first()
      floatColumns.push({ table, column, rows: Number(result?.rows ?? 0) })
    }
    const invalid = await db(tableName(table)).whereNull(column).orWhereRaw('CAST(?? AS text) IN (?, ?, ?)', [column, 'NaN', 'Infinity', '-Infinity']).count({ rows: '*' }).first()
    if (Number(invalid?.rows ?? 0) > 0) invalidNumericRows.push({ table, column, rows: Number(invalid?.rows ?? 0) })
  }
  const nullCompanyRows: LegacyReconciliationInput['nullCompanyRows'] = []
  for (const table of ['account_move_line', 'account_move', 'stock_quant', 'stock_move']) {
    const exists = await db('information_schema.columns').where({ table_schema: schema, table_name: table, column_name: 'company_id' }).first()
    if (!exists) continue
    const result = await db(table).whereNull('company_id').count({ rows: '*' }).first()
    if (Number(result?.rows ?? 0) > 0) nullCompanyRows.push({ table, rows: Number(result?.rows ?? 0) })
  }
  const moveExists = await db('information_schema.tables').where({ table_schema: schema, table_name: 'account_move' }).first()
  const lineExists = await db('information_schema.tables').where({ table_schema: schema, table_name: 'account_move_line' }).first()
  let unbalancedMoves = 0
  if (moveExists && lineExists) {
    const result = await db('account_move as m').join('account_move_line as l', 'l.move_id', 'm.id').where('m.state', 'posted').groupBy('m.id').havingRaw('ABS(COALESCE(SUM(l.debit - l.credit), 0)) > 0.000000000001').count({ rows: 'm.id' }).first()
    unbalancedMoves = Number(result?.rows ?? 0)
  }
  const stockExists = await db('information_schema.tables').where({ table_schema: schema, table_name: 'stock_quant' }).first()
  let negativeStockRows = 0, overReservedRows = 0
  if (stockExists) {
    negativeStockRows = Number((await db('stock_quant').whereRaw('quantity < 0 OR reserved_quantity < 0').count({ rows: '*' }).first())?.rows ?? 0)
    overReservedRows = Number((await db('stock_quant').whereRaw('reserved_quantity > quantity').count({ rows: '*' }).first())?.rows ?? 0)
  }
  const issues = evaluateLegacyRows({ floatColumns, invalidNumericRows, nullCompanyRows, unbalancedMoves, negativeStockRows, overReservedRows })
  return { schema, readOnly: true, checkedAt: new Date().toISOString(), issues, readyForStagingMigration: issues.length === 0 }
}

export async function preflightLegacyMigration(db: Knex, options: { environment: 'staging' | 'production'; schema?: string }): Promise<LegacyReconciliationReport> {
  if (options.environment !== 'staging') throw new Error('Legacy migration preflight is staging-only; production requires reviewed change control.')
  return reconcileLegacyData(db, options.schema ?? 'public')
}
