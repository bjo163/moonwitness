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
| `evaluateCase()` | `caseData: CaseInput` | Runs weighted diagnostic scoring across 4 ethical filters |
| `chooseMethod()` | `assessment: Assessment` | Enforces General-first vs Prophetic/Divine decision paths |
| `registerMizanRoutes()` | `() => void` | Injects Mizan `/api/mizan/*` REST routes into the backend |

---

## 🚀 Usage

```typescript
import { evaluateCase, chooseMethod } from "@moon/mizan"

// 1. Evaluate Ethical Case
const result = evaluateCase({
  title: "Diplomatic Treaty Verification",
  filterAnswers: [true, true, true, false],
  referenceVerified: true,
})

// 2. Select Decision Resolution Method
const method = chooseMethod(result)
console.log(`Resolution Method: ${method.selectedMethod} (Confidence: ${method.confidence * 100}%)`)
```

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
