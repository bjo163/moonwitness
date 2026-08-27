# ◈ @moon/project

```
╔══════════════════════════════════════════════════════════════════════════╗
║  PACKAGE:        @moon/project                                          ║
║  SYSTEM VERSION: MoonWitness OS V9.0 (Divine Operating System Matrix)   ║
║  PKG VERSION:    0.1.0                                                  ║
║  CLASSIFICATION: TIER 2 — PROJECT MANAGEMENT & TASK ORCHESTRATION       ║
║  STATUS:         ████████████████████████████████ ACTIVE (SOVEREIGN)    ║
╚══════════════════════════════════════════════════════════════════════════╝
```

## 🌌 Overview

`@moon/project` provides enterprise-grade project management for MoonWitness OS. It manages project portfolios, kanban stages, tasks, sprints, milestones, and tags — the operational backbone for all work orchestration across the system.

## 📦 Public API Surface

| Model | Description |
|---|---|
| `PjProject` (`pj.project`) | Project portfolio with lifecycle status tracking |
| `PjStage` (`pj.stage`) | Kanban stages per project (customizable pipeline) |
| `PjTask` (`pj.task`) | Work items with priority, assignment, and deadline |
| `PjMilestone` (`pj.milestone`) | Deadline checkpoints per project |
| `PjSprint` (`pj.sprint`) | Sprint / iteration containers |
| `PjTag` (`pj.tag`) | Color-coded categorization tags |
| `loadDemoData()` | Loads demo projects, tasks, sprints, milestones |

## 🚀 Usage

```typescript
import projectAddon, { PjProject, PjTask, loadDemoData } from '@moon/project'

// Register models
server.addons.push(...projectAddon.models)

// Load demo data
await loadDemoData()
```

## 🛡️ Architectural Boundaries

- Belongs to **Tier 2 (Work Management)**.
- Depends on: `@moon/base`, `@moon/orm`.
- Consumed by: `@moon/cab`, `@moon/helpdesk`.

## 🧪 Verification

```bash
pnpm --filter @moon/project typecheck
pnpm --filter @moon/project build
```

## ??? View Configuration

This package exports declarative view manifests for the **Cosmic Matrix Engine** (src/views.ts):
- Introspected automatically by `@moon/server` at `GET /api/meta/model/:name`
- Rendered dynamically in Command Center via `<CosmicModelWorkspace model="..." />`
- Supported view modes: Kanban Pipeline, Sortable Table, Responsive Form Modal, and Activity Chatter.
