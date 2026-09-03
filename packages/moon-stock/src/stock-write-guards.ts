import type { Ctx } from '@moon/orm'
import { assertStockNumericSchema } from './stock-transfer.js'

const serviceFields = ['reservedAt', 'reserved_at', 'reservedBy', 'reserved_by', 'completedAt', 'completed_at', 'completedBy', 'completed_by', 'cancelledAt', 'cancelled_at', 'cancelledBy', 'cancelled_by']
export async function guardStockMoveMutation(env: Ctx, values: Record<string, unknown>, id?: number): Promise<void> {
  if (!env.trx) throw new Error('Stock mutations require an ORM transaction')
  await assertStockNumericSchema(env.trx)
  if (id !== undefined) { const existing = await env.trx('stock_move').where({ id }).forUpdate().first('state'); if (!existing || existing.state !== 'draft') throw new Error('Only draft stock moves can be modified or deleted') }
  if (values.state !== undefined && values.state !== 'draft') throw new Error('Use the stock transfer service for state transitions')
  if (serviceFields.some(field => Object.hasOwn(values, field))) throw new Error('Stock transfer audit metadata is service-owned')
}
export function rejectDirectQuantMutation(): never { throw new Error('Stock quantities are service-owned; use a reviewed inventory operation') }
export async function guardStockLocationMutation(env: Ctx, values: Record<string, unknown>, id?: number): Promise<void> {
  if (id === undefined) return
  if (!env.trx) throw new Error('Stock location mutations require an ORM transaction')
  const trx = env.trx, reference = await trx('stock_location').where({ id }).first('company_id')
  if (!reference) throw new Error('Stock location not found')
  await trx.raw('SELECT pg_advisory_xact_lock(?, hashtext(?))', [1297040211, String(reference.company_id)])
  const existing = await trx('stock_location').where({ id }).forUpdate().first()
  if (!existing || existing.company_id !== reference.company_id) throw new Error('Stock location changed concurrently; retry')
  const company = values.companyId ?? values.company_id, deleting = Object.keys(values).length === 0
  if (!deleting && (company === undefined || company === existing.company_id) && (values.usage === undefined || values.usage === existing.usage)) return
  const quant = await trx('stock_quant').where({ location_id: id }).first('id')
  const move = await trx('stock_move').where({ location_id: id }).orWhere({ location_dest_id: id }).first('id')
  if (quant || move) throw new Error('Referenced stock location company, usage and identity are immutable')
}
