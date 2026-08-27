# ◈ @moon/base

```
╔══════════════════════════════════════════════════════════════════════════╗
║  PACKAGE:        @moon/base                                              ║
║  SYSTEM VERSION: MoonWitness OS V9.0 (Divine Operating System Matrix)    ║
║  PKG VERSION:    9.0.0                                                   ║
║  CLASSIFICATION: TIER 2 — CORE IDENTITY, ROLES & SECURITY KERNEL         ║
║  STATUS:         ████████████████████████████████ ACTIVE (SOVEREIGN)     ║
╚══════════════════════════════════════════════════════════════════════════╝
```

## 🌌 Overview
`@moon/base` provides the foundational database models and lifecycle rules for operators, roles, permissions, recovery challenges, and security kernels using the `@moon/orm` Vertex engine.

---

## 📦 Public API Surface

| Entity / Helper | File | Description |
|---|---|---|
| `BaseUserRecord` | `models/user.ts` | Operator account entity with clearance, status, and credentials |
| `BaseGroupRecord` | `models/group.ts` | Role & group membership mappings (RBAC) |
| `BaseRuleRecord` | `models/rule.ts` | Row-Level Security (RLS) policies and domain access rules |
| `AuthChallengeRecord` | `models/challenge.ts` | Cryptographic OTP & password recovery challenges |
| `seedBaseData()` | `seed.ts` | Idempotent initial superuser and system roles seeder |

---

## 🚀 Usage

```typescript
import { getModel, createCtx, SUPERUSER_ID } from "@moon/orm"
import { seedBaseData, loadBaseData } from "@moon/base"

// 1. Initializing Base Security System
await seedBaseData()
await loadBaseData()

// 2. Querying Operator Profiles with Security Context
const env = createCtx(SUPERUSER_ID, {}, getModel as any)
const UserModel = getModel("res.users")

const activeOperators = await (UserModel as any).search(UserModel, env, [
  ["status", "=", "ACTIVE"],
  ["clearance", "=", "COMMANDER"],
])
```

---

## 🛡️ Architectural Boundaries
- Belongs to **Tier 2 (Core Infrastructure)**.
- Extends `@moon/orm` models. Zero direct UI dependencies.

---

## 🧪 Verification
```bash
pnpm --filter @moon/base test
```

## ??? View Configuration

This package exports declarative view manifests for the **Cosmic Matrix Engine** (src/views.ts):
- Introspected automatically by `@moon/server` at `GET /api/meta/model/:name`
- Rendered dynamically in Command Center via `<CosmicModelWorkspace model="..." />`
- Supported view modes: Kanban Pipeline, Sortable Table, Responsive Form Modal, and Activity Chatter.
