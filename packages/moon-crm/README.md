# ◈ @moon/crm

```
╔══════════════════════════════════════════════════════════════════════════╗
║  PACKAGE:        @moon/crm                                               ║
║  SYSTEM VERSION: MoonWitness OS V9.0 (Divine Operating System Matrix)    ║
║  PKG VERSION:    9.0.0                                                   ║
║  CLASSIFICATION: TIER 3 — COMMUNITY & AMBASSADOR RELATIONSHIP MATRIX     ║
║  STATUS:         ████████████████████████████████ ACTIVE (SOVEREIGN)     ║
╚══════════════════════════════════════════════════════════════════════════╝
```

## 🌌 Overview
`@moon/crm` manages global community participants, international peace ambassadors, partner organizations, and cryptographic certificates of prophetic unity.

---

## 📦 Public API Surface

| Model / Helper | Description |
|---|---|
| `CrmContactRecord` | Member contact entity with status, verification level, and region |
| `issueAmbassadorCertificate()` | Creates immutable cryptographic record of certification |
| `searchPartnersByRegion()` | Queries registered non-profit and humanitarian organizations |

---

## 🚀 Usage

```typescript
import { getModel, createCtx, SUPERUSER_ID } from "@moon/orm"
import { issueAmbassadorCertificate } from "@moon/crm"

// 1. Issuing Ambassador Certification
const cert = await issueAmbassadorCertificate("contact-108", "CHIEF_AMBASSADOR")
console.log(`Certificate issued: ${cert.serialNumber}`)
```

---

## 🛡️ Architectural Boundaries
- Belongs to **Tier 3 (Domain Intelligence)**.
- Extends `@moon/orm` Vertex models.

---

## 🧪 Verification
```bash
pnpm --filter @moon/crm test
```

## ??? View Configuration

This package exports declarative view manifests for the **Cosmic Matrix Engine** (src/views.ts):
- Introspected automatically by `@moon/server` at `GET /api/meta/model/:name`
- Rendered dynamically in Command Center via `<CosmicModelWorkspace model="..." />`
- Supported view modes: Kanban Pipeline, Sortable Table, Responsive Form Modal, and Activity Chatter.
