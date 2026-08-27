# ◈ @moon/account

```
╔══════════════════════════════════════════════════════════════════════════╗
║  PACKAGE:        @moon/account                                           ║
║  SYSTEM VERSION: MoonWitness OS V9.0 (Divine Operating System Matrix)    ║
║  PKG VERSION:    9.0.0                                                   ║
║  CLASSIFICATION: TIER 3 — ETHICAL LEDGER & ZAKAT CALCULATOR MATRIX       ║
║  STATUS:         ████████████████████████████████ ACTIVE (SOVEREIGN)     ║
╚══════════════════════════════════════════════════════════════════════════╝
```

## 🌌 Overview
`@moon/account` manages double-entry ethical accounting ledgers, Zakat Maal/Fitrah calculators, Waqf asset accounting, and transparent charity distributions.

---

## 📦 Public API Surface

| Function / Model | Description |
|---|---|
| `calculateZakatMaal()` | Computes Nisab threshold (85g Gold equivalent) and 2.5% obligation |
| `calculateZakatFitrah()` | Computes standard grain/rice staple volume per household head |
| `AccountLedgerRecord` | Immutable double-entry financial record (Debit / Credit) |

---

## 🚀 Usage

```typescript
import { calculateZakatMaal, calculateZakatFitrah } from "@moon/account"

// 1. Calculate Zakat Maal (Gold price: $75/gram, Total Assets: $12,500)
const zakat = calculateZakatMaal(12500, 75)
if (zakat.isObligatory) {
  console.log(`Zakat Due: $${zakat.zakatAmount.toFixed(2)} (Nisab: $${zakat.nisabThreshold})`)
}

// 2. Calculate Zakat Fitrah for 4 family members
const fitrah = calculateZakatFitrah(4, 3.5) // 3.5 kg / head
console.log(`Total Fitrah Rice: ${fitrah.totalKg} kg`)
```

---

## 🛡️ Architectural Boundaries
- Belongs to **Tier 3 (Domain Intelligence)**.
- Extends `@moon/orm`.

---

## 🧪 Verification
```bash
pnpm --filter @moon/account test
```

## ??? View Configuration

This package exports declarative view manifests for the **Cosmic Matrix Engine** (src/views.ts):
- Introspected automatically by `@moon/server` at `GET /api/meta/model/:name`
- Rendered dynamically in Command Center via `<CosmicModelWorkspace model="..." />`
- Supported view modes: Kanban Pipeline, Sortable Table, Responsive Form Modal, and Activity Chatter.
