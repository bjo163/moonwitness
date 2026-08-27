# ◈ @moon/helpdesk

```
╔══════════════════════════════════════════════════════════════════════════╗
║  PACKAGE:        @moon/helpdesk                                         ║
║  SYSTEM VERSION: MoonWitness OS V9.0 (Divine Operating System Matrix)   ║
║  PKG VERSION:    0.1.0                                                  ║
║  CLASSIFICATION: TIER 2 — SUPPORT TICKETING & SLA ENGINE                ║
║  STATUS:         ████████████████████████████████ ACTIVE (SOVEREIGN)    ║
╚══════════════════════════════════════════════════════════════════════════╝
```

## 🌌 Overview

`@moon/helpdesk` provides enterprise-grade support ticketing for MoonWitness OS. It manages support teams, ticket pipelines, SLA policies, and escalation to `@moon/cab` governance when structural changes are needed.

## 📦 Public API Surface

| Model | Description |
|---|---|
| `HdTeam` (`hd.team`) | Support team with leader and members |
| `HdStage` (`hd.stage`) | Ticket pipeline stages per team |
| `HdTicket` (`hd.ticket`) | Support ticket with SLA tracking and escalation |
| `HdSla` (`hd.sla`) | SLA response/resolution time policies |
| `HdTag` (`hd.tag`) | Ticket categorization tags |
| `loadDemoData()` | Loads demo teams, tickets, SLA policies |

## 🚀 Usage

```typescript
import helpdeskAddon, { HdTicket, loadDemoData } from '@moon/helpdesk'

// Register models
server.addons.push(...helpdeskAddon.models)

// Load demo data
await loadDemoData()
```

## 🛡️ Architectural Boundaries

- Belongs to **Tier 2 (Work Management)**.
- Depends on: `@moon/base`, `@moon/project`.
- Soft-references: `@moon/cab` (ticket → RFC escalation).

## 🧪 Verification

```bash
pnpm --filter @moon/helpdesk typecheck
pnpm --filter @moon/helpdesk build
```

## ??? View Configuration

This package exports declarative view manifests for the **Cosmic Matrix Engine** (src/views.ts):
- Introspected automatically by `@moon/server` at `GET /api/meta/model/:name`
- Rendered dynamically in Command Center via `<CosmicModelWorkspace model="..." />`
- Supported view modes: Kanban Pipeline, Sortable Table, Responsive Form Modal, and Activity Chatter.
