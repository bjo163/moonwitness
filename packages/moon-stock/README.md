# ◈ @moon/stock

```
╔══════════════════════════════════════════════════════════════════════════╗
║  PACKAGE:        @moon/stock                                             ║
║  SYSTEM VERSION: MoonWitness OS V9.0 (Divine Operating System Matrix)    ║
║  PKG VERSION:    9.0.0                                                   ║
║  CLASSIFICATION: TIER 3 — RESOURCE & PHYSICAL ASSET DISTRIBUTION LEDGER  ║
║  STATUS:         ████████████████████████████████ ACTIVE (SOVEREIGN)     ║
╚══════════════════════════════════════════════════════════════════════════╝
```

## 🌌 Overview
`@moon/stock` tracks humanitarian aid distributions, physical scripture book compendiums, and observation equipment inventory across global observation nodes.

---

## 📦 Public API Surface

| Model / Function | Description |
|---|---|
| `StockItemRecord` | Item entity with SKU, warehouse node, quantity, and safety threshold |
| `adjustStockQuantity()` | Atomic inventory adjustments with immutable audit trail |
| `getLowStockAlerts()` | Scans inventory for items below safety buffer |

---

## 🚀 Usage

```typescript
import { adjustStockQuantity, getLowStockAlerts } from "@moon/stock"

// 1. Adjusting Humanitarian Aid Inventory
await adjustStockQuantity("item-aid-water-01", -500, "Palestine Relief Distribution Batch #42")

// 2. Scan for Alert Levels
const alerts = await getLowStockAlerts()
console.log(`Critical stock items: ${alerts.length}`)
```

---

## 🛡️ Architectural Boundaries
- Belongs to **Tier 3 (Domain Intelligence)**.
- Extends `@moon/orm`.

---

## 🧪 Verification
```bash
pnpm --filter @moon/stock test
```

## ??? View Configuration

This package exports declarative view manifests for the **Cosmic Matrix Engine** (src/views.ts):
- Introspected automatically by `@moon/server` at `GET /api/meta/model/:name`
- Rendered dynamically in Command Center via `<CosmicModelWorkspace model="..." />`
- Supported view modes: Kanban Pipeline, Sortable Table, Responsive Form Modal, and Activity Chatter.
