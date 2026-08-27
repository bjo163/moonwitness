# ◈ @moon/cron

```
╔══════════════════════════════════════════════════════════════════════════╗
║  PACKAGE:        @moon/cron                                             ║
║  SYSTEM VERSION: MoonWitness OS V9.0 (Divine Operating System Matrix)   ║
║  PKG VERSION:    0.1.0                                                  ║
║  CLASSIFICATION: TIER 1 — BACKGROUND SCHEDULING & INTERVAL ORCHESTRATION ║
║  STATUS:         ████████████████████████████████ ACTIVE (SOVEREIGN)    ║
╚══════════════════════════════════════════════════════════════════════════╝
```

## 🌌 Overview

`@moon/cron` provides enterprise-grade background task orchestration, interval scheduling, and execution logging for MoonWitness OS. It allows models across the entire system to declare recurring tasks (e.g. telemetry pruning, ephemeris calculations, SLA monitoring, cache purges) and track execution latency.

## 📦 Public API Surface

| Component | Description |
|---|---|
| `IrCron` (`ir.cron`) | Scheduled job definition with interval and next-call timing |
| `IrCronLog` (`ir.cron.log`) | Execution log with latency, duration, and error audit trail |
| `CronRunner` | Autonomous background execution loop |
| `globalCronRunner` | Singleton scheduler runner instance |
| `loadDemoData()` | Seeds standard telemetry, SLA, and ephemeris cron jobs |
| `views` | Declarative View Manifests for the Cosmic Matrix Engine |

## 🚀 Usage

```typescript
import cronAddon, { globalCronRunner, loadDemoData } from '@moon/cron'

// 1. Register addon models
server.addons.push(...cronAddon.models)

// 2. Start background scheduler loop
globalCronRunner.start()

// 3. Optional: Seed demo crons
await loadDemoData()
```

## 🛡️ Architectural Boundaries

- Belongs to **Tier 1 (Infrastructure & Orchestration)**.
- Depends on: `@moon/orm`, `@moon/base`.
- Consumed by: `apps/api`, `apps/command-center`.

## 🎛️ View Configuration

This package exports declarative view manifests for the **Cosmic Matrix Engine** (`src/views.ts`):
- Introspected automatically by `@moon/server` at `GET /api/meta/model/:name`
- Rendered dynamically in Command Center via `<CosmicModelWorkspace model="ir.cron" />`
- Supported view modes: Sortable Table, Responsive Form Modal, and Activity Chatter.

## 🧪 Verification

```bash
pnpm --filter @moon/cron typecheck
pnpm --filter @moon/cron build
```
