import { assertAccountingSchema } from './account-schema.js'
import type { Ctx } from '@moon/orm'

function transaction(env: Ctx) { if (!env.trx) throw new Error('Accounting mutations require an ORM transaction'); return env.trx }
const serviceFields = ['postedAt', 'posted_at', 'postedBy', 'posted_by', 'idempotencyKey', 'idempotency_key', 'fingerprint', 'reversalOf', 'reversal_of', 'reversalReason', 'reversal_reason']

export async function guardEntryMutation(env: Ctx, vals: Record<string, unknown>, id?: number): Promise<void> {
  const trx = transaction(env)
  if (id !== undefined) {
    const existing = await trx('account_move').where({ id }).forUpdate().first('state')
    if (!existing || existing.state !== 'draft') throw new Error('Only draft journal entries can be modified or deleted')
  }
  if (vals.state !== undefined && vals.state !== 'draft') throw new Error('Use the accounting posting service for state transitions')
  if (serviceFields.some(field => Object.hasOwn(vals, field))) throw new Error('Posting metadata is service-owned')
  if (id !== undefined && ['companyId', 'company_id', 'journalId', 'journal_id'].some(field => Object.hasOwn(vals, field))) throw new Error('Changing draft company or journal requires a dedicated accounting operation')
}

export async function guardLineMutation(env: Ctx, vals: Record<string, unknown>, id?: number): Promise<void> {
  const trx = transaction(env)
  const existing = id === undefined ? undefined : await trx('account_move_line').where({ id }).first()
  if (id !== undefined && !existing) throw new Error('Journal item not found')
  const moveId = vals.moveId ?? vals.move_id ?? existing?.move_id
  if (!Number.isSafeInteger(moveId) || Number(moveId) <= 0) throw new Error('A journal entry is required')
  if (existing && moveId !== existing.move_id) throw new Error('Moving an existing journal item is not allowed')
  const entry = await trx('account_move').where({ id: moveId }).forUpdate().first()
  if (!entry || entry.state !== 'draft') throw new Error('Posted journal items are immutable')
  const companyId = vals.companyId ?? vals.company_id ?? existing?.company_id
  if (companyId !== entry.company_id || !companyId) throw new Error('Journal item company must match its entry')
  const accountId = vals.accountId ?? vals.account_id ?? existing?.account_id
  const account = await trx('account_account').where({ id: accountId, company_id: companyId }).forShare().first('id')
  if (!account) throw new Error('Account must belong to the journal entry company')
  await assertAccountingSchema(trx)
}
