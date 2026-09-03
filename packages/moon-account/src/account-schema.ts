import type { Ctx } from '@moon/orm'

export async function assertAccountingSchema(trx: NonNullable<Ctx['trx']>): Promise<void> {
  const schema = (await trx.raw('SELECT current_schema() AS name')).rows[0].name
  const columns = await trx('information_schema.columns').where({ table_schema: schema, table_name: 'account_move_line' }).whereIn('column_name', ['debit', 'credit', 'balance']).select('data_type', 'numeric_precision', 'numeric_scale')
  const marker = await trx.raw(`SELECT 1 FROM pg_constraint WHERE conrelid = to_regclass('account_move') AND conname = 'account_move_exact_posting_metadata'`)
  if (columns.length !== 3 || columns.some((column: any) => column.data_type !== 'numeric' || column.numeric_precision !== 38 || column.numeric_scale !== 12) || marker.rows.length !== 1) {
    throw new Error('Reviewed accounting numeric(38,12) migration and constraints required before writes')
  }
}
