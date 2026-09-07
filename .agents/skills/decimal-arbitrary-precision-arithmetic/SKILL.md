---
name: decimal-arbitrary-precision-arithmetic
description: >-
  Use this skill when implementing financial ledger calculations, stock valuation, and accounting entries
  to eliminate IEEE 754 binary floating-point roundoff drift using arbitrary-precision decimal mathematics.
---

# Decimal Arbitrary-Precision Arithmetic (Subatomic Skill)

Governs mathematical computations in financial ledgers (`@moon/account`), stock transactions (`@moon/stock`), and billing where binary floating-point inaccuracies (`0.1 + 0.2 = 0.30000000000000004`) cannot be tolerated.

## The Floating-Point Problem & Invariance

Binary floating-point (`number` in JS, `float` in Python) cannot accurately represent base-10 fractional numbers like $0.1$ or $0.01$, creating cumulative rounding drift in general ledgers.

**Strict Mandate**:
- Never use native JS `+`, `-`, `*`, `/` on monetary quantities or stock asset units.
- Always use `@moon/orm/src/decimal.ts` or Decimal.js with explicit rounding modes.

## Implementation Pattern in `@moon/orm`

```typescript
import { Decimal } from '@moon/orm'

// Creation
const unitPrice = new Decimal('149.99')
const quantity = new Decimal('3')
const taxRate = new Decimal('0.11') // 11% PPN

// Arithmetic operations
const subtotal = unitPrice.mul(quantity)                      // 449.97
const taxAmount = subtotal.mul(taxRate).toDecimalPlaces(2, Decimal.ROUND_HALF_UP) // 49.50
const total = subtotal.add(taxAmount)                         // 499.47

// Safe comparison
if (total.greaterThan('1000.00')) {
  // Apply bulk discount
}
```

## Database Storage & Serialization
- Stored in PostgreSQL as `NUMERIC(16, 4)` or `DECIMAL(20, 6)`.
- Serialized to JSON as string literals (`"499.47"`) across API and RPC contracts to prevent browser JSON parser floating-point degradation.

## Canonical Source Files
- `packages/moon-orm/src/decimal.ts`
- `packages/moon-account/src/`
- `packages/moon-stock/src/`

## Verification Command
```bash
pnpm --filter=@moon/orm exec tsx -e 'import { Decimal } from "./src/decimal"; const a = new Decimal("0.1").add("0.2"); console.log("0.1 + 0.2 =", a.toString(), "| Strict Equality:", a.equals("0.3"))'
```
