# ◈ @moon/shootgun

```
╔══════════════════════════════════════════════════════════════════════════╗
║  PACKAGE:        @moon/shootgun                                          ║
║  SYSTEM VERSION: MoonWitness OS V9.0 (Divine Operating System Matrix)    ║
║  PKG VERSION:    9.0.0                                                   ║
║  CLASSIFICATION: TIER 3 — RAPID TARGET TRANSMISSION & LINK DISPATCHER    ║
║  STATUS:         ████████████████████████████████ ACTIVE (SOVEREIGN)     ║
╚══════════════════════════════════════════════════════════════════════════╝
```

## 🌌 Overview
`@moon/shootgun` manages rapid target operations, verse linkage dispatches, social broadcast conduits, and public transmission links for MoonWitness OS.

---

## 📦 Public API Surface

| Model / Function | Description |
|---|---|
| `ShootgunOperationRecord` | Tactical broadcast model with verse IDs and target URLs |
| `dispatchShootgunOperation()` | Broadcasts payload across designated communication channels |
| `listRecentOperations()` | Fetches public transmission history |

---

## 🚀 Usage

```typescript
import { dispatchShootgunOperation } from "@moon/shootgun"

// 1. Dispatching Rapid Verse Transmission
await dispatchShootgunOperation({
  title: "Global Peace Transmission #104",
  verseIds: [255, 256],
  targetUrl: "https://moonwitness.org/s/peace-covenant",
})
```

---

## 🛡️ Architectural Boundaries
- Belongs to **Tier 3 (Domain Intelligence)**.
- Extends `@moon/orm`.

---

## 🧪 Verification
```bash
pnpm --filter @moon/shootgun typecheck
```

## ??? View Configuration

This package exports declarative view manifests for the **Cosmic Matrix Engine** (src/views.ts):
- Introspected automatically by `@moon/server` at `GET /api/meta/model/:name`
- Rendered dynamically in Command Center via `<CosmicModelWorkspace model="..." />`
- Supported view modes: Kanban Pipeline, Sortable Table, Responsive Form Modal, and Activity Chatter.
