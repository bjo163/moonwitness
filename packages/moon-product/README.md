# ◈ @moon/product

```
╔══════════════════════════════════════════════════════════════════════════╗
║  PACKAGE:        @moon/product                                           ║
║  SYSTEM VERSION: MoonWitness OS V9.0 (Divine Operating System Matrix)    ║
║  PKG VERSION:    9.0.0                                                   ║
║  CLASSIFICATION: TIER 3 — DIGITAL PRODUCTS & SCRIPTURE CATALOGUE         ║
║  STATUS:         ████████████████████████████████ ACTIVE (SOVEREIGN)     ║
╚══════════════════════════════════════════════════════════════════════════╝
```

## 🌌 Overview
`@moon/product` manages digital scripture study packs, audio reciter bundles, offline knowledge packages, and cryptographic access grants for operators.

---

## 📦 Public API Surface

| Model / Function | Description |
|---|---|
| `ProductCatalogueRecord` | Digital item entity with SKU, type, version, and pricing/free tier |
| `grantProductAccess()` | Generates cryptographically verifiable operator license |
| `listFeaturedScripturePacks()` | Queries active featured digital study bundles |

---

## 🚀 Usage

```typescript
import { listFeaturedScripturePacks, grantProductAccess } from "@moon/product"

// 1. Fetching Available Study Packs
const packs = await listFeaturedScripturePacks()
console.log(`Available packs: ${packs.length}`)

// 2. Granting Operator Access
await grantProductAccess("user-42", "pack-hadith-bukhari-audio")
```

---

## 🛡️ Architectural Boundaries
- Belongs to **Tier 3 (Domain Intelligence)**.
- Extends `@moon/orm`.

---

## 🧪 Verification
```bash
pnpm --filter @moon/product test
```

## ??? View Configuration

This package exports declarative view manifests for the **Cosmic Matrix Engine** (src/views.ts):
- Introspected automatically by `@moon/server` at `GET /api/meta/model/:name`
- Rendered dynamically in Command Center via `<CosmicModelWorkspace model="..." />`
- Supported view modes: Kanban Pipeline, Sortable Table, Responsive Form Modal, and Activity Chatter.
