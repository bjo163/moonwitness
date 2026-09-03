import { createHash } from 'node:crypto'
import { decimalUnits, decimalFromUnits, validateDecimalSpec, type DecimalSpec } from '@moon/orm'

export interface LedgerScope { companyId: number; actorId: number }
export interface LedgerLine { accountId: number; debit: string; credit: string; description?: string }
export interface LedgerDraft { journalId: number; date: string; currency: string; decimal: DecimalSpec; lines: LedgerLine[] }
export interface PostedEntry extends LedgerDraft { id: number; companyId: number; actorId: number; state: 'posted'; idempotencyKey: string; fingerprint: string; postedAt: string; reversalOf?: number; reversalReason?: string }
export interface LedgerTransaction {
  lockCompany(companyId: number): Promise<void>
  findByKey(companyId: number, key: string): Promise<PostedEntry | undefined>
  findEntry(companyId: number, id: number): Promise<PostedEntry | undefined>
  findReversal(companyId: number, originalId: number): Promise<PostedEntry | undefined>
  validateReferences(companyId: number, journalId: number, accountIds: number[]): Promise<void>
  insertPosted(entry: Omit<PostedEntry, 'id'>): Promise<PostedEntry>
}
export interface LedgerStore { transaction<T>(run: (transaction: LedgerTransaction) => Promise<T>): Promise<T> }
export type LedgerAuthorization = (scope: LedgerScope, operation: 'post' | 'reverse') => Promise<void>

function positiveId(id: number): void { if (!Number.isSafeInteger(id) || id <= 0) throw new Error('Positive safe integer ID required') }
function validateScope(scope: LedgerScope, key: string): void { positiveId(scope.companyId); positiveId(scope.actorId); if (typeof key !== 'string' || key.length < 1 || key.length > 128 || key.trim() !== key) throw new Error('Idempotency key must contain 1..128 characters without outer whitespace') }
function validateDate(date: string): void { if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !Number.isFinite(Date.parse(date)) || new Date(date).toISOString().slice(0, 10) !== date) throw new Error('Valid YYYY-MM-DD date required') }

export function normalizeLedgerDraft(draft: LedgerDraft): LedgerDraft {
  positiveId(draft.journalId); validateDate(draft.date)
  if (!/^[A-Z]{3}$/.test(draft.currency)) throw new Error('Three-letter currency code required')
  validateDecimalSpec(draft.decimal)
  if (draft.decimal.scale > 12 || draft.decimal.precision - draft.decimal.scale > 26) throw new Error('Ledger supports at most 26 integral and 12 fractional digits')
  if (!Array.isArray(draft.lines) || draft.lines.length < 2 || draft.lines.length > 1000) throw new Error('A journal entry needs 2..1000 lines')
  let debitTotal = 0n, creditTotal = 0n
  const lines = draft.lines.map(line => {
    positiveId(line.accountId)
    const debit = decimalUnits(line.debit, draft.decimal), credit = decimalUnits(line.credit, draft.decimal)
    if (debit < 0n || credit < 0n || (debit > 0n && credit > 0n) || (debit === 0n && credit === 0n)) throw new Error('Each line requires exactly one positive debit or credit')
    if (line.description !== undefined && (typeof line.description !== 'string' || line.description.length > 255)) throw new Error('Line description must contain at most 255 characters')
    debitTotal += debit; creditTotal += credit
    return { accountId: line.accountId, debit: decimalFromUnits(debit, draft.decimal), credit: decimalFromUnits(credit, draft.decimal), description: line.description ?? '' }
  })
  if (debitTotal !== creditTotal) throw new Error('Journal entry is not balanced')
  decimalFromUnits(debitTotal, draft.decimal)
  return { journalId: draft.journalId, date: draft.date, currency: draft.currency, decimal: { precision: draft.decimal.precision, scale: draft.decimal.scale }, lines }
}
function fingerprint(command: unknown): string { return createHash('sha256').update(JSON.stringify(command)).digest('hex') }
function replay(existing: PostedEntry | undefined, hash: string): PostedEntry | undefined { if (existing && existing.fingerprint !== hash) throw new Error('Idempotency key reused with a different command'); return existing }

export class ExactLedger {
  constructor(private readonly store: LedgerStore, private readonly authorize: LedgerAuthorization) {}
  async post(scope: LedgerScope, draft: LedgerDraft, key: string): Promise<PostedEntry> {
    validateScope(scope, key); await this.authorize(scope, 'post'); const normalized = normalizeLedgerDraft(draft)
    const hash = fingerprint({ operation: 'post', actorId: scope.actorId, draft: normalized })
    return this.store.transaction(async tx => { await tx.lockCompany(scope.companyId); const previous = replay(await tx.findByKey(scope.companyId, key), hash); if (previous) return previous; await tx.validateReferences(scope.companyId, normalized.journalId, normalized.lines.map(line => line.accountId)); return tx.insertPosted({ ...normalized, ...scope, state: 'posted', idempotencyKey: key, fingerprint: hash, postedAt: new Date().toISOString() }) })
  }
  async reverse(scope: LedgerScope, originalId: number, date: string, reason: string, key: string): Promise<PostedEntry> {
    validateScope(scope, key); validateDate(date); positiveId(originalId); if (typeof reason !== 'string' || !reason.trim() || reason.length > 500) throw new Error('Reversal reason required (max 500 characters)'); await this.authorize(scope, 'reverse')
    const hash = fingerprint({ operation: 'reverse', actorId: scope.actorId, originalId, date, reason })
    return this.store.transaction(async tx => { await tx.lockCompany(scope.companyId); const previous = replay(await tx.findByKey(scope.companyId, key), hash); if (previous) return previous; const original = await tx.findEntry(scope.companyId, originalId); if (!original || original.companyId !== scope.companyId || original.state !== 'posted') throw new Error('Posted entry not found in this company'); if (original.reversalOf || await tx.findReversal(scope.companyId, originalId)) throw new Error('Entry already reversed or is a reversal'); if (date < original.date) throw new Error('Reversal cannot precede the original entry'); const draft = normalizeLedgerDraft({ ...original, date, lines: original.lines.map(line => ({ ...line, debit: line.credit, credit: line.debit })) }); await tx.validateReferences(scope.companyId, draft.journalId, draft.lines.map(line => line.accountId)); return tx.insertPosted({ ...draft, ...scope, state: 'posted', idempotencyKey: key, fingerprint: hash, postedAt: new Date().toISOString(), reversalOf: original.id, reversalReason: reason }) })
  }
}
