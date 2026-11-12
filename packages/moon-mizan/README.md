# ◈ @moon/mizan

```
╔══════════════════════════════════════════════════════════════════════════╗
║  PACKAGE:        @moon/mizan                                             ║
║  SYSTEM VERSION: MoonWitness OS V9.0 (Divine Operating System Matrix)    ║
║  PKG VERSION:    9.0.0                                                   ║
║  CLASSIFICATION: TIER 3 — ETHICAL ASSESSMENT & BALANCE DECISION MATRIX   ║
║  STATUS:         ████████████████████████████████ ACTIVE (SOVEREIGN)     ║
╚══════════════════════════════════════════════════════════════════════════╝
```

## 🌌 Overview
`@moon/mizan` is the internal weighted-assessment engine for MoonWitness OS. It evaluates ethical cases through a four-filter diagnostic framework, ensures material balance condition compliance, and verifies theological references before permitting decisions.

---

## 📦 Public API Surface

| Function / Model | Parameters | Description |
|---|---|---|
| `chooseMethod()` | `MethodInput` | Returns a preview candidate and Prophetic eligibility; it does not finalize an assessment |
| `validateAssessment()` | `AssessmentInput` | Validates filters and returns the final method and bounded weights |
| `registerMizanRoutes()` | `() => void` | Injects Mizan `/api/mizan/*` REST routes into the backend |

---

## Method bounds

| Measure | Maximum |
|---|---:|
| Power Right | 10 |
| Power Left | 7 |
| General total | 17 |
| Prophetic reference contribution | 4 |
| Prophetic total | 21 |

The General total is the sum of Power Right and Power Left. Prophetic
eligibility is a preview; final Prophetic method selection requires a positive,
verified, relevant reference contribution and a material balance condition.

`chooseMethod()` returns `phase: "preview"` and `eligibleForProphetic`.
`validateAssessment()` returns `phase: "final"` and the finalized method.

---

## 🛡️ Architectural Boundaries
- Belongs to **Tier 3 (Domain Intelligence)**.
- Consumes `@moon/base` and `@moon/orm`.

---

## 🧪 Verification
```bash
pnpm --filter @moon/mizan test
```

## ??? View Configuration

This package exports declarative view manifests for the **Cosmic Matrix Engine** (src/views.ts):
- Introspected automatically by `@moon/server` at `GET /api/meta/model/:name`
- Rendered dynamically in Command Center via `<CosmicModelWorkspace model="..." />`
- Supported view modes: Kanban Pipeline, Sortable Table, Responsive Form Modal, and Activity Chatter.
