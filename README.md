# ◈ MoonWitness OS

> **Deep Space Sci-Fi Divine Operating System & Knowledge Platform**  
> An enterprise-grade, high-performance monorepo platform uniting Quranic knowledge, celestial telemetry, and relational domain intelligence.

---

## System Architecture

MoonWitness follows a strict **Model-First** architecture designed for modularity, determinism, and high auditability:

```text
┌─────────────────────────────────────────────────────────────┐
│                    MoonWitness Frontend                     │
│               Next.js 15 · Cosmic HUD · @modules            │
└──────────────────────────────┬──────────────────────────────┘
                               │ HTTP / SSE / RPC
┌──────────────────────────────▼──────────────────────────────┐
│                    Moon Server Runtime                      │
│            @moon/server · Transport & Auth Boundary         │
└──────────────────────────────┬──────────────────────────────┘
                               │
┌──────────────────────────────▼──────────────────────────────┐
│                   Moon ORM Data Engine                      │
│      @moon/orm · Vertex Models · Access Rules · pgvector    │
└──────────────────────────────┬──────────────────────────────┘
                               │ Knex / Native SQL
┌──────────────────────────────▼──────────────────────────────┐
│                  PostgreSQL 16+ Infrastructure              │
│               Relational Storage · pgvector 0.8+            │
└─────────────────────────────────────────────────────────────┘
```

---

## Monorepo Layout

```text
moonwitness/
├── apps/
│   ├── api/                  # MoonWitness backend service (HTTP/RPC)
│   ├── web/                  # Cosmic Dashboard Next.js OS frontend
│   └── rocksoul/             # Companion web experimental runtime
├── packages/
│   ├── moon-orm/             # Custom Vertex-based ORM with pgvector & RLS
│   ├── moon-server/          # Transport runtime, auth, middleware & SSE
│   ├── moon-witness/         # Canonical knowledge graph, revelation engine & astronomy
│   ├── moon-base/            # Core models: auth, users, groups, rules & attachments
│   ├── moon-mizan/           # Balance & ethical assessment engine
│   ├── moon-khidra/          # Autonomous workflows & wisdom processing
│   ├── moon-cab/             # Civilizational analytics & wisdom records
│   ├── moon-geo/             # Geospatial datasets (provinces, cities & coordinates)
│   ├── moon-client/          # Isomorphic API client for frontend/SDK consumers
│   ├── moon-cache/           # High-speed memory/Redis cache layer
│   ├── moon-mail/            # Transactional & notification email services
│   ├── moon-product/         # Product management & resource catalogues
│   ├── moon-stock/           # Inventory tracking & distribution
│   ├── moon-account/         # Accounting & ledger management
│   ├── moon-time/            # Timekeeping, lunar calendars & prayer schedules
│   ├── moon-testing/         # Test fixtures, mock environments & assertion utilities
│   ├── moon-performance/     # Performance benchmarking & telemetry
│   ├── ui/                   # Shared UI kit (Radix, Tailwind & Cosmic HUD)
│   ├── eslint-config/        # Shared ESLint configuration
│   └── typescript-config/    # Shared TypeScript compiler options
└── docs/                     # Architecture specifications & design authority
```

---

## Core Technologies & Innovations

### 1. Moon ORM (`@moon/orm`)
A custom Vertex-based ORM built for performance, safety, and strict row-level security:
- **Vertex-Based Models**: Expressive `fetch`, `spawn`, `morph`, `purge`, and `pick` interfaces.
- **Relational Magic Tuples**: Odoo-style atomic relational mutations (e.g. `[0, 0, values]`, `[4, id]`, `[6, 0, ids]`).
- **Row-Level Security & Record Rules**: Dynamic rules evaluated via controlled domain evaluators (fail-closed security).
- **PostgreSQL `pgvector` Integration**: Native `vector(n)` field definitions and similarity operators (`<->`, `<=>`, `<#>`).
- **Computed Stored Fields**: Automatic dependency invalidation and database-persisted computations (`store: true`).
- **Delegation Inheritance**: Multi-table inheritance with transparent field delegation (`_inherits`).
- **Hierarchical Trees**: Fast tree traversal using materialized path indexing (`parent_path`).
- **Schema Forge Engine**: Automatic, safe schema synchronization and differential migration planning.

### 2. Moon Witness (`@moon/witness`)
The sacred knowledge and celestial telemetry engine:
- **Canonical Domain Knowledge Graph**: Relational graph indexing Revelation (`wx.passage`, `wx.content`), Historical Figures (`wx.figure`), Universal Traditions/Hadith (`wx.tradition.unit`, `wx.transmission.chain`), and Epistemic Concepts.
- **Epistemic Authority & Provenance**: Immutable provenance chains tracking authority classes (`PRIMARY_SOURCE`, `TRANSLATION`, `TRANSMISSION_REPORT`, `DERIVED`).
- **Deterministic Engine Runtime**: Versioned computational execution pipelines (`WitnessEngineRuntime`, `revelation.query`) with cryptographic run reproducibility checksums.
- **Corpus Ingestion Pipeline**: Checksummed, verified source adapters (`WitnessSourceAdapter`, `FixtureAdapter`).
- **Pure Compute Astronomy**: High-precision solar/lunar algorithms for moon phases, Qibla coordinates, and prayer times.

### 3. Cosmic Dashboard (`apps/web`)
A state-of-the-art Deep Space Sci-Fi Divine Operating System interface:
- **Modular HUD**: Odoo-inspired plugin system (`@modules/`) integrated with Next.js App Router.
- **Atmospheric Glassmorphism**: Smoked translucent glass, laser telemetry lines, chamfered tactical borders, and subtle scanlines.

---

## Getting Started

### Prerequisites
- **Node.js**: `v20.x` or higher (tested on Node `v22` / `v26`)
- **pnpm**: `v9.x` or higher
- **PostgreSQL**: `v16+` with `pgvector` extension installed

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/moonwitness/moonwitness.git
   cd moonwitness
   ```

2. **Install workspace dependencies**:
   ```bash
   pnpm install
   ```

3. **Configure Environment Variables**:
   Copy `.env.example` to `.env` in the root and in `apps/api/.env`:
   ```bash
   cp .env.example .env
   cp .env.example apps/api/.env
   ```
   Set your `DATABASE_URL` with your PostgreSQL credentials:
   ```env
   DATABASE_URL=postgres://postgres:password@localhost:5432/moonwitness
   JWT_SECRET=your-secure-secret-key-32-chars-minimum
   API_PORT=4000
   ```

4. **Initialize and verify the database**:
   ```bash
   pnpm --filter api db:install
   pnpm --filter api db:verify
   ```

   `db:install` applies immutable migrations and canonical seed data. Runtime startup does not
   perform schema changes or seed automatically. Use `MOON_BOOTSTRAP_ON_START=true` only for an
   explicitly controlled development bootstrap.

---

## Development & Execution

### Run Development Servers
```bash
# Start API backend and Web frontend in watch mode
pnpm dev

# Or run specific applications
pnpm --filter api dev
pnpm --filter web dev
```

### Build Workspace
```bash
pnpm build
```

### Run Tests & Validation
```bash
# Run unit & integration test suites
pnpm test

# Typecheck all packages
pnpm typecheck

# Lint workspace
pnpm lint

# Run real PostgreSQL graph certification
pnpm --filter api run certify:witness-graph-pg
```

---

## Branching & Release Promotion Flow

MoonWitness adheres to a structured, 3-tier promotion lifecycle:

```text
feature branches  ──►  dev (Integration & CI)  ──►  main (Stable Release)
```

1. **`feature`**: Active feature development, experimentation, and refactoring.
2. **`dev`**: Integration branch for cross-addon validation, database migration verification, and CI regression checks.
3. **`main`**: Production release branch. Merges only from verified `dev` builds.

---

## Documentation Directory

| Document | Description |
|---|---|
| [ARCHITECTURE.md](ARCHITECTURE.md) | Platform principles, layer boundaries & model-first design rules |
| [DEVELOPMENT.md](DEVELOPMENT.md) | Branch promotion flow, CI gates & definition of done |
| [ROADMAP.md](ROADMAP.md) | High-level roadmap & milestone phases |
| [RELEASE.md](RELEASE.md) | Version source of truth and release procedure |
| [CHANGELOG.md](CHANGELOG.md) | Release history |
| [SECURITY.md](SECURITY.md) | Vulnerability reporting and secret-handling policy |
| [AGENTS.md](AGENTS.md) | Design rules, code discipline & architecture constraints |
| [@moon/orm Documentation](packages/moon-orm/README.md) | Moon ORM API reference & model definitions |
| [@moon/witness Documentation](packages/moon-witness/README.md) | Domain knowledge graph & engine runtime |
| [@moon/server Documentation](packages/moon-server/README.md) | Server transport, middleware & auth |

---

## License

MoonWitness is proprietary and open-core under the **MIT License**.
