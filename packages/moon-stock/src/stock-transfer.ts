import { decimalFromUnits, decimalUnits, getDb } from '@moon/orm'
type Database = ReturnType<typeof getDb>
export type StockOperation = 'reserve' | 'complete' | 'cancel'
export interface StockTransferCommand { actorId: number; companyId: number; moveId: number }
export interface StockAuthorization extends StockTransferCommand { operation: StockOperation }
export interface StockTransferResult { moveId: number; companyId: number; state: 'assigned' | 'done' | 'cancel'; quantity: string }
export const STOCK_QUANTITY = { precision: 38, scale: 12 } as const
export async function assertStockNumericSchema(trx: Database): Promise<void> {
  const schema = (await trx.raw('SELECT current_schema() AS name')).rows[0].name
  const columns = await trx('information_schema.columns').where({ table_schema: schema }).where((builder: any) => builder.where({ table_name: 'stock_move', column_name: 'product_uom_qty' }).orWhere((inner: any) => inner.where({ table_name: 'stock_quant' }).whereIn('column_name', ['quantity', 'reserved_quantity']))).select('data_type', 'numeric_precision', 'numeric_scale', 'is_nullable')
  const scope = await trx('information_schema.columns').where({ table_schema: schema, column_name: 'company_id' }).whereIn('table_name', ['stock_move', 'stock_quant']).select('is_nullable')
  const constraints = await trx('information_schema.table_constraints').where({ constraint_schema: schema }).whereIn('constraint_name', ['stock_quant_scope_unique', 'stock_quant_available_check', 'stock_move_quantity_check', 'stock_location_company_unique', 'stock_quant_location_company_fk', 'stock_move_location_company_fk', 'stock_move_destination_company_fk']).select('constraint_name')
  if (columns.length !== 3 || columns.some((column: any) => column.data_type !== 'numeric' || column.numeric_precision !== 38 || column.numeric_scale !== 12 || column.is_nullable !== 'NO') || scope.length !== 2 || scope.some((column: any) => column.is_nullable !== 'NO') || constraints.length !== 7) throw new Error('Apply the reviewed stock numeric(38,12) migration before stock writes')
}
export function createStockTransferService(db: Database, authorize: (request: StockAuthorization) => boolean | Promise<boolean>) {
  if (typeof authorize !== 'function') throw new TypeError('Stock authorizer is required')
  const execute = async (operation: StockOperation, command: StockTransferCommand): Promise<StockTransferResult> => {
    for (const value of [command.actorId, command.companyId, command.moveId]) if (!Number.isSafeInteger(value) || value <= 0) throw new TypeError('Stock actor, company and move ids must be positive integers')
    if (await authorize({ ...command, operation }) !== true) throw new Error('Stock operation forbidden')
    return db.transaction(async trx => {
      await assertStockNumericSchema(trx)
      await trx.raw('SELECT pg_advisory_xact_lock(?, hashtext(?))', [1297040211, String(command.companyId)])
      const move = await trx('stock_move').where({ id: command.moveId, company_id: command.companyId }).forUpdate().first()
      if (!move) throw new Error('Stock move not found in this company')
      const units = decimalUnits(move.product_uom_qty, STOCK_QUANTITY), targetState = operation === 'reserve' ? 'assigned' : operation === 'complete' ? 'done' : 'cancel'
      const result = { moveId: move.id, companyId: move.company_id, state: targetState, quantity: decimalFromUnits(units, STOCK_QUANTITY) } as StockTransferResult
      if (move.state === targetState) return result
      if (operation === 'reserve' && !['draft', 'confirmed'].includes(move.state)) throw new Error('Only draft or confirmed moves can be reserved')
      if (operation === 'complete' && move.state !== 'assigned') throw new Error('Only reserved moves can be completed')
      if (operation === 'cancel' && !['draft', 'confirmed', 'assigned'].includes(move.state)) throw new Error('Completed moves require a separate reversal transfer')
      if (operation !== 'cancel') { if (units <= 0n) throw new Error('Stock transfer quantity must be positive'); if (move.location_id === move.location_dest_id) throw new Error('Transfer locations must differ'); const locations = await trx('stock_location').where({ company_id: command.companyId, usage: 'internal' }).whereIn('id', [move.location_id, move.location_dest_id]).orderBy('id').forShare().select('id'); const product = await trx('product_product').where({ id: move.product_id }).forShare().first('id'); if (locations.length !== 2 || !product) throw new Error('Transfer requires valid product and two internal locations in the same company') }
      if (move.state === 'assigned' && units <= 0n) throw new Error('Reserved move quantity requires reconciliation')
      if (operation !== 'cancel' || move.state === 'assigned') {
        const scope = { company_id: command.companyId, product_id: move.product_id }, source = await trx('stock_quant').where({ ...scope, location_id: move.location_id }).forUpdate().first()
        if (!source) throw new Error('Source stock balance is unavailable')
        const quantity = decimalUnits(source.quantity, STOCK_QUANTITY), reserved = decimalUnits(source.reserved_quantity, STOCK_QUANTITY)
        if (quantity < 0n || reserved < 0n || reserved > quantity) throw new Error('Source stock balance requires reconciliation')
        if (operation === 'reserve') { if (quantity - reserved < units) throw new Error('Insufficient available stock'); await trx('stock_quant').where({ id: source.id }).update({ reserved_quantity: decimalFromUnits(reserved + units, STOCK_QUANTITY) }) } else { if (reserved < units || quantity < units) throw new Error('Reserved stock balance requires reconciliation'); await trx('stock_quant').where({ id: source.id }).update({ reserved_quantity: decimalFromUnits(reserved - units, STOCK_QUANTITY), ...(operation === 'complete' ? { quantity: decimalFromUnits(quantity - units, STOCK_QUANTITY) } : {}) }); if (operation === 'complete') { await trx('stock_quant').insert({ ...scope, location_id: move.location_dest_id, quantity: '0', reserved_quantity: '0' }).onConflict(['company_id', 'product_id', 'location_id']).ignore(); const destination = await trx('stock_quant').where({ ...scope, location_id: move.location_dest_id }).forUpdate().first(); const destinationUnits = decimalUnits(destination.quantity, STOCK_QUANTITY); await trx('stock_quant').where({ id: destination.id }).update({ quantity: decimalFromUnits(destinationUnits + units, STOCK_QUANTITY) }) } }
      }
      const prefix = operation === 'reserve' ? 'reserved' : operation === 'complete' ? 'completed' : 'cancelled'
      await trx('stock_move').where({ id: move.id }).update({ state: targetState, [`${prefix}_by`]: command.actorId, [`${prefix}_at`]: trx.fn.now() })
      return result
    })
  }
  return { reserve: (command: StockTransferCommand) => execute('reserve', command), complete: (command: StockTransferCommand) => execute('complete', command), cancel: (command: StockTransferCommand) => execute('cancel', command) }
}
