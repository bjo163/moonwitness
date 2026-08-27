# ◈ @moon/khidra

```
╔══════════════════════════════════════════════════════════════════════════╗
║  PACKAGE:        @moon/khidra                                            ║
║  SYSTEM VERSION: MoonWitness OS V9.0 (Divine Operating System Matrix)    ║
║  PKG VERSION:    9.0.0                                                   ║
║  CLASSIFICATION: TIER 3 — PROPHETIC WISDOM & KNOWLEDGE REASONING ENGINE  ║
║  STATUS:         ████████████████████████████████ ACTIVE (SOVEREIGN)     ║
╚══════════════════════════════════════════════════════════════════════════╝
```

## 🌌 Overview
`@moon/khidra` implements the Prophetic Intelligence Agent (Khidra AI), multi-perspective philosophical reasoning workflows, cognitive Tabayyun analyzers, and autonomous Quranic root concordance extraction.

---

## 📦 Public API Surface

| Class / Function | Description |
|---|---|
| `KhidraEngine` | Autonomous prophetic reasoning and wisdom analysis service |
| `parseGardenBrainstorm(text)` | Extracts structured epistemic nodes from complex thought discussions |
| `scoreWisdomCoherence(statement)` | Evaluates consistency of claims against Quranic root principles |

---

## 🚀 Usage

```typescript
import { parseGardenBrainstorm, scoreWisdomCoherence } from "@moon/khidra"

// 1. Parsing Multi-Perspective Brainstorm Streams
const stream = `
Perspective A: Unity of humanity under the Divine Covenant.
Perspective B: Respecting civilizational boundaries and mutual covenants.
`
const nodes = parseGardenBrainstorm(stream)
console.log(`Extracted ${nodes.length} philosophical nodes`)

// 2. Scoring Coherence
const score = scoreWisdomCoherence("Justice and mercy must balance in peace treaties")
console.log(`Coherence Score: ${score.coherenceIndex * 100}%`)
```

---

## 🛡️ Architectural Boundaries
- Belongs to **Tier 3 (Domain Intelligence)**.
- Consumes `@moon/base`, `@moon/orm`, and `@moon/protocol`.

---

## 🧪 Verification
```bash
pnpm --filter @moon/khidra test
```

## ??? View Configuration

This package exports declarative view manifests for the **Cosmic Matrix Engine** (src/views.ts):
- Introspected automatically by `@moon/server` at `GET /api/meta/model/:name`
- Rendered dynamically in Command Center via `<CosmicModelWorkspace model="..." />`
- Supported view modes: Kanban Pipeline, Sortable Table, Responsive Form Modal, and Activity Chatter.
