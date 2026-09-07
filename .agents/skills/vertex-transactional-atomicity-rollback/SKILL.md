---
name: vertex-transactional-atomicity-rollback
description: >-
  Use this skill when managing database transactions, nested savepoint rollbacks, isolation levels,
  and dead-lock retry mechanisms in Vertex ORM.
---

# Vertex Transactional Atomicity & Rollback (Subatomic Skill)

Governs database transactions in `@moon/orm` to guarantee ACID (Atomicity, Consistency, Isolation, Durability) properties during complex multi-table mutations.

## Atomic Transaction Wrapper

```typescript
import { runInTransaction, Vertex } from '@moon/orm'

await runInTransaction(async (trx) => {
  // Nested mutations inherit the transaction client `trx`
  const accountDebit = await LedgerEntry.create({
    accountId: 101,
    debit: '500.00',
    credit: '0.00',
    transactionId: 99
  }, { trx })

  const accountCredit = await LedgerEntry.create({
    accountId: 201,
    debit: '0.00',
    credit: '500.00',
    transactionId: 99
  }, { trx })

  if (accountDebit.debit !== accountCredit.credit) {
    // Immediate rollback: aborts all mutations made inside this block
    throw new Error('Ledger imbalance: Debit must match Credit exactly.')
  }
})
```

## Nested Transactions & Savepoints
For nested blocks:
1. Outer transaction issues `BEGIN`.
2. Inner `runInTransaction` detects existing transaction and executes `SAVEPOINT sp_level_1`.
3. If inner block fails, issues `ROLLBACK TO SAVEPOINT sp_level_1` without aborting outer operations.
4. On top-level exit, issues `COMMIT`.

## Deadlock Detection & Exponential Backoff Retry
For concurrent writes under high load:
```typescript
const MAX_RETRIES = 3
for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
  try {
    return await runInTransaction(fn)
  } catch (err: any) {
    if (err.code === '40P01' /* PostgreSQL deadlock_detected */ && attempt < MAX_RETRIES) {
      await sleep(50 * Math.pow(2, attempt) + Math.random() * 20)
      continue
    }
    throw err
  }
}
```

## Canonical Source Files
- `packages/moon-orm/src/base.ts`
- `packages/moon-orm/src/query.ts`
- `packages/moon-orm/src/config.ts`

## Verification Command
```bash
pnpm --filter=@moon/orm test
```
