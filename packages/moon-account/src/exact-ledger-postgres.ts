import { normalizeDecimal, subtractDecimal, getDb } from '@moon/orm'
import { assertAccountingSchema } from './account-schema.js'
import type { LedgerStore, PostedEntry } from './exact-ledger.js'

type Database = ReturnType<typeof getDb>
export function createPostgresLedgerStore(db: Database): LedgerStore {
  return { transaction: run => db.transaction(async trx => {
    await assertAccountingSchema(trx)
    const readEntry = async (where: Record<string, unknown>): Promise<PostedEntry | undefined> => {
      const row = await trx('account_move').where(where).select('*', trx.raw('date::text AS entry_date')).first()
      if (!row) return undefined
      if (row.state !== 'posted') throw new Error('Entry is not posted')
      const decimal = { precision: row.decimal_precision, scale: row.decimal_scale }
      const lines = await trx('account_move_line').where({ company_id: row.company_id, move_id: row.id }).orderBy('id')
      return { id: row.id, companyId: row.company_id, actorId: row.posted_by, journalId: row.journal_id, date: row.entry_date, currency: row.currency_code, decimal, state: 'posted', idempotencyKey: row.idempotency_key, fingerprint: row.fingerprint, postedAt: new Date(row.posted_at).toISOString(), ...(row.reversal_of ? { reversalOf: row.reversal_of, reversalReason: row.reversal_reason } : {}), lines: lines.map(line => ({ accountId: line.account_id, debit: normalizeDecimal(line.debit, decimal), credit: normalizeDecimal(line.credit, decimal), description: line.name ?? '' })) }
    }
    const tx = {
      async lockCompany(companyId: number) { await trx.raw('SELECT pg_advisory_xact_lock(?, hashtext(?))', [1297040206, String(companyId)]) },
      findByKey: (companyId: number, key: string) => readEntry({ company_id: companyId, idempotency_key: key }),
      findEntry: (companyId: number, id: number) => readEntry({ company_id: companyId, id }),
      findReversal: (companyId: number, originalId: number) => readEntry({ company_id: companyId, reversal_of: originalId }),
      async validateReferences(companyId: number, journalId: number, accountIds: number[]) { const journal = await trx('account_journal').where({ id: journalId, company_id: companyId }).forShare().first('id'); const uniqueIds = [...new Set(accountIds)]; const accounts = await trx('account_account').where({ company_id: companyId }).whereIn('id', uniqueIds).forShare().select('id'); if (!journal || accounts.length !== uniqueIds.length) throw new Error('Journal or account belongs to another company or does not exist') },
      async insertPosted(entry: Omit<PostedEntry, 'id'>): Promise<PostedEntry> { const [row] = await trx('account_move').insert({ name: '/', company_id: entry.companyId, posted_by: entry.actorId, journal_id: entry.journalId, date: entry.date, currency_code: entry.currency, decimal_precision: entry.decimal.precision, decimal_scale: entry.decimal.scale, state: 'draft', idempotency_key: entry.idempotencyKey, fingerprint: entry.fingerprint, posted_at: entry.postedAt, reversal_of: entry.reversalOf ?? null, reversal_reason: entry.reversalReason ?? null }).returning('id'); const id = row.id; await trx('account_move_line').insert(entry.lines.map(line => ({ company_id: entry.companyId, move_id: id, account_id: line.accountId, debit: line.debit, credit: line.credit, name: line.description ?? '', balance: subtractDecimal(line.debit, line.credit, entry.decimal) }))); await trx('account_move').where({ company_id: entry.companyId, id, state: 'draft' }).update({ state: 'posted' }); return { ...entry, id } }
    }
    return run(tx)
  }) }
}
