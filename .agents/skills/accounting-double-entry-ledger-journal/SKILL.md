---
name: accounting-double-entry-ledger-journal
description: >-
  Use this skill when auditing or implementing double-entry general ledger journal entries, debit/credit equality
  invariants, multi-currency foreign exchange revaluation, and chart of accounts structures in @moon/account.
---

# Accounting Double-Entry Ledger & Journal (Subatomic Skill)

Governs the general ledger, journal vouchers, and strict balance invariants of double-entry bookkeeping in `@moon/account`.

## Fundamental Accounting Invariant

Every journal entry must satisfy strict mathematical balance:
$$\sum_{j=1}^M \text{Debit}_j - \sum_{j=1}^M \text{Credit}_j \equiv 0.0000 \quad (\text{Exact Zero Invariant})$$
Any attempt to post a journal entry where Debit $\ne$ Credit throws an immediate `LedgerImbalanceError` and triggers transaction rollback.

## Multi-Currency FX Revaluation
For transactions denominated in foreign currency $FC$ converted to base currency $BC$ using spot exchange rate $R$:
$$\text{Base Amount} = \text{Decimal}(\text{Foreign Amount}) \cdot \text{Decimal}(R)$$

Unrealized FX Gain/Loss calculation at fiscal month-end:
$$\Delta_{\text{FX}} = \text{Foreign Balance} \times (R_{\text{closing}} - R_{\text{booking}})$$
- If $\Delta_{\text{FX}} > 0$: Credit Unrealized FX Gain (Income account).
- If $\Delta_{\text{FX}} < 0$: Debit Unrealized FX Loss (Expense account).

## Canonical Source Files
- `packages/moon-account/src/`
- `packages/moon-account/src/views.ts`

## Verification Command
```bash
pnpm --filter=@moon/account test
```
