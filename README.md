# ◈ MOONWITNESS OS V9.5

> **Deep Space Sci-Fi Divine Operating System & Knowledge Platform**  
> An enterprise-grade, high-performance monorepo platform uniting Quranic knowledge, celestial telemetry, and relational domain intelligence.

---

## 🏛️ System Architecture

MoonWitness follows a strict **Model-First & Enterprise Standard** architecture designed for performance, determinism, and high auditability:

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                       MOONWITNESS DUAL-PORTAL SYSTEM                        │
│   ┌──────────────────────────────────┐   ┌──────────────────────────────┐   │
│   │   Web Portal (Port 3000)         │   │ Command Center (Port 3001)   │   │
│   │   Next.js 16 · Cosmic Dashboard  │   │ Next.js 16 · Tactical Gov    │   │
│   └─────────────────┬────────────────┘   └──────────────┬───────────────┘   │
└─────────────────────┼───────────────────────────────────┼───────────────────┘
                      │                                   │
                      ▼                                   ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│      SHARED WORKSPACE ENGINE (@workspace/ui, @workspace/hooks, @workspace/state) │
│    • Universal Command Palette (Cmd+K)    • 3D Celestial Visualizers        │
│    • Cosmic Matrix Engine (Table/Kanban/Pivot) • Procedural Audio Synth     │
│    • Universal CSV Ingestion Wizard       • Tactical Document Printer       │
│    • useResource & useModal               • ErrorBoundary & ModuleGuard     │
└─────────────────────────────────────┬───────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│         UNIVERSAL PROTOCOL & CLIENT LAYER (@moon/protocol, @moon/client)    │
│    • Zod API Contracts & Envelopes        • Cross-App SSO (useAuthSession)  │
│    • Strongly-Typed SSE Telemetry         • Zero-Network Pure Math Compute  │
└─────────────────────────────────────┬───────────────────────────────────────┘
                                      │ HTTP / SSE / RPC
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                     MOON SERVER & BACKEND RUNTIME (Port 4000)               │
│        apps/api · @moon/server · Cron Runner & BullMQ CosmicWorker Pool     │
└─────────────────────────────────────┬───────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                     MOON ORM & 16 ADDON PACKAGES MATRIX                     │
│        @moon/orm · Vertex Models · 16 Sovereign Enterprise Addons           │
└─────────────────────────────────────┬───────────────────────────────────────┘
                                      │ Knex / Native SQL
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                    POSTGRESQL 16+ & REDIS INFRASTRUCTURE                    │
│                 Relational Storage · pgvector 0.8+ · High-Speed Cache       │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 📦 Master Monorepo Layout (37 Packages Matrix & 16 Sovereign Addons)

```text
moonwitness/
├── apps/
│   ├── web/                  # Cosmic Dashboard Next.js 16 frontend (:3000)
│   ├── command-center/       # Tactical Governance & Administrative Console (:3001)
│   ├── api/                  # MoonWitness backend service & worker queue (:4000)
│   └── rocksoul/             # Companion web experimental runtime
├── packages/
│   ├── ui/                   # @workspace/ui (Master Cosmic Design System & CME 3-View Engine)
│   ├── types/                # @workspace/types (Domain types, constants, NAVIGATION_MESH)
│   ├── state/                # @workspace/state (Zustand Master Store & MoonProvider)
│   ├── hooks/                # @workspace/hooks (useResource, useModal, useComputedCelestial)
│   ├── error/                # @workspace/error (ErrorBoundary, ModuleGuard, CrashReporter)
│   ├── i18n/                 # @workspace/i18n (Arabic, Indonesian, English dictionary)
│   ├── auto-avatar/          # @workspace/auto-avatar (Procedural geometric avatar generator)
│   ├── moon-protocol/        # @moon/protocol (Single Source of Truth Zod API & SSE Contracts)
│   ├── moon-compute/         # @moon/compute (Pure Isomorphic Astronomical Math Engine)
│   ├── moon-client/          # @moon/client (Isomorphic API client, SSO, SSE telemetry hook)
│   ├── moon-server/          # @moon/server (Transport runtime, defineRoute declarative schemas)
│   ├── moon-orm/             # @moon/orm (Vertex-based ORM with pgvector & RLS)
│   ├── moon-cron/            # @moon/cron (BullMQ-class Job Queue & Cron Runner)
│   ├── moon-witness/         # @moon/witness (Canonical knowledge graph, revelation engine)
│   ├── moon-base/            # @moon/base (Core models, 2FA/TOTP security, report & version models)
│   ├── moon-mizan/           # @moon/mizan (Balance & ethical assessment engine)
│   ├── moon-khidra/          # @moon/khidra (Autonomous workflows, rules & webhook mesh)
│   ├── moon-cab/             # @moon/cab (Civilizational analytics & RFC records)
│   ├── moon-geo/             # @moon/geo (Geospatial datasets)
│   ├── moon-cache/           # @moon/cache (High-speed memory/Redis cache layer)
│   ├── moon-mail/            # @moon/mail (Transactional email services & scheduled activities)
│   ├── moon-product/         # @moon/product (Product management & resource catalogues)
│   ├── moon-stock/           # @moon/stock (Inventory tracking & distribution)
│   ├── moon-account/         # @moon/account (Accounting & ledger management)
│   ├── moon-crm/             # @moon/crm (Lead outreach & relationship tracking)
│   ├── moon-project/         # @moon/project (Task backlog & milestone sprints)
│   ├── moon-helpdesk/        # @moon/helpdesk (Support tickets & SLA tracking)
│   ├── moon-shootgun/        # @moon/shootgun (Operation logs & tactical executions)
│   ├── moon-performance/     # @moon/performance (Benchmarking, telemetry & dashboard widgets)
│   ├── moon-time/            # @moon/time (Timekeeping & lunar calendars)
│   ├── moon-testing/         # @moon/testing (Test fixtures & protocol contract suites)
│   ├── eslint-config/        # Shared ESLint configuration
│   └── typescript-config/    # Shared TypeScript compiler options
├── cli/                      # Standalone CLI tools (mw.mjs doctor, totp, ports)
├── docker-compose.yml        # Production multi-container orchestration stack
├── Dockerfile                # Multi-stage Turbo production container
└── ecosystem.config.cjs      # PM2 enterprise cluster process manager
```

---

## ✨ Key Features & Capabilities

### 1. 🪐 3D Celestial Engine & Interactive Observatories
- **`<CelestialMoonSphere />`**: Photometric 3D Moon sphere with real-time terminator curve illumination (0-100% lit), crater synthesis, and interactive cursor tilt.
- **`<CelestialQiblaCompass />`**: Real-time Great-Circle Azimuth compass calculating exact vector to Makkah Ka'bah (`21.4225° N, 39.8262° E`), 360° rotating dial, and laser lock alignment (`±2.5°`).
- **`<CelestialEclipseSimulator />`**: Photometric solar corona simulator with scrubbable contact timeline (C1, C2, Totality, C3, C4).
- **`<SeismicTectonicRadar />`**: GPU-accelerated Canvas plate radar with 360° sweeping beam, pulsing epicenters, and live seismic magnitude feeds.

### 2. 🎛️ Cosmic Matrix Engine (CME) 3-View Suite
- **`TABLE ⊞`**: Auto-columns, search filtering, edit/delete actions, and RFC 4180 CSV & JSON exporter.
- **`KANBAN ▥`**: Realtime HTML5 Drag-and-Drop stage pipelines with optimistic UI updates and procedural drop sound.
- **`PIVOT ◫`**: Multi-dimensional 2D Cross-Tabulation with dynamic X/Y axis selectors and cell drilldown modal.
- **`<CosmicImportModal />`**: Universal bulk CSV ingestion wizard with auto-header mapping and batch progress bar.
- **`[PRINT BRIEFING]`**: Zero-dependency `@media print` engine generating Apple/NASA-grade printable documents with dynamic SHA-256 cryptographic verification checksums.

### 3. ⚡ BullMQ-Class Job Queue & Scheduled Cron Runner (`@moon/cron`)
- **`IrQueueJob` & `CosmicQueue`**: High-concurrency worker pool with exponential backoff retries (`backoffMs * 2^(attempts-1)`) and progress callbacks.
- **`IrCron` & `IrCronLog`**: Autonomous periodic scheduler polling every 30s.

### 4. 🤖 Autonomous Workflows & Outbound Webhook Mesh (`@moon/khidra`)
- **`ir.automation`**: Declarative trigger & action rules (On Create, On Update, On Time).
- **`ir.webhook` & `ir.webhook.log`**: HMAC SHA-256 signed webhook dispatching with delivery audit trail.

### 5. 🔐 Two-Factor Authentication (2FA / TOTP) Security Engine (`@moon/base`)
- Pure RFC 6238 implementation with Base32 secret generation, 6-digit OTP verification, and `otpauth://` URI generator.

---

## 🛠️ Quick Start

```bash
# Install dependencies across all 37 packages
pnpm install

# Run development servers (Web :3000, Command Center :3001, API :4000)
pnpm dev

# Full database setup: migrations + canonical seed + demo data
pnpm db:install

# Run workspace typecheck (100% pass)
pnpm turbo typecheck

# Run system CLI diagnostics
node cli/mw.mjs doctor

# Run constitutional compliance audit (33 Laws)
node scripts/audit-rules.mjs
```