# MoonWitness Architecture Specification (Enterprise Standard)

Status: **Canonical**. This document defines application architecture and ownership boundaries for the MoonWitness monorepo.

## 1. System model

```text
PUBLIC / ADMIN UI
apps/web + apps/command-center
          |
          v
@moon/client
          |
          v
@moon/protocol
          |
          v
FASTIFY API GATEWAY & INTELLIGENCE RUNTIME (@moon/server / apps/api)
• REST / RPC Routing        • Pure Math Compute (@moon/compute)
• Redis Hot Caching         • pgvector Semantic RAG Retrieval
• Public Fallback Service   • Real-Time SSE Telemetry
          |
          +-----------------------------------+
          | JSON-RPC 2.0 / WAL                | Direct pgvector Connection
          v                                   v
CANONICAL MASTER RELATIONAL DATASTORE   VECTOR EMBEDDINGS (pgvector 0.8+)
Odoo 19 (Python Addons)                 PostgreSQL (postgres:18-pgvector)
PostgreSQL (postgres:18-pgvector)
```

The canonical corpus is maintained separately by:

```text
bjo163/moonwitness-corpus
```

The application consumes versioned corpus releases through `@moon/witness` ingestion and registers them directly into the canonical Witness domain graph mastered in Odoo 19.

## 2. Source and ownership boundaries

### `moonwitness-corpus`

Owns canonical corpus authoring, upstream synchronization, source metadata, corpus schemas, canonical JSON/JSONL, corpus releases/artifacts, and corpus-level provenance. It does not own the application database.

### `@moon/witness`

Owns source-aware ingestion, normalization/validation, application knowledge graph, source/artifact/snapshot records, passages/content, provenance relationships, evidence, and research-domain integration.

### `Odoo 19 Master Datastore (postgres:18-pgvector)`

The single canonical relational source of truth for all domain entities, sacred knowledge graph records (`moon.witness.*`), Mizan ethical balance evaluations (`moon.mizan.*`), disaster & myth correlations (`moon.disaster.*`), user security (`res.users`), and enterprise operational modules (projects, tasks, accounting, stock). It replaces duplicate local relational tables.

### `Fastify Gateway & Compute Engine (@moon/server)`

Owns high-speed API routing, authentication token validation, public request caching, pure mathematical celestial computations (`@moon/compute`), and pgvector RAG vector retrieval. It does not maintain competing duplicate relational models.

### `apps/web`

Owns public product presentation and source-aware knowledge browsing.

### `apps/command-center`

Owns authorized administration, operational monitoring, corpus/import controls, and application management.

## 3. Corpus integration flow

```text
moonwitness-corpus
        |
        v
immutable release / pinned revision
        |
        v
@moon/witness ingestion
        |
        +--> source / artifact / snapshot
        +--> provenance
        +--> text edition / passage / content
        +--> tradition / research graph where applicable
        |
        v
@moon/odoo-bridge
        |
        v
Odoo 19 Master Store (moon.witness.*)
        |
        v
Fastify API Gateway (Hot Read Cache)
   +----+----+
   |         |
   v         v
 Web   Command Center
```

Web and Command Center never treat raw corpus files as a parallel source of truth.

## 4. Canonical write path

```text
HTTP / RPC / Worker
        |
        v
Fastify Gateway (@moon/server)
        |
        v
@moon/protocol Zod Contract Validation
        |
        v
@moon/odoo-bridge (Session / System Service Client)
        |
        v
Odoo 19 Master PostgreSQL (postgres:18-pgvector)
```

Corpus ingestion uses the same application boundary through `@moon/witness` into Odoo 19.

## 5. Enterprise UI architecture

`@workspace/ui` is the shared design system for both applications.

Standards:

- shadcn/ui primitives
- Tailwind CSS v4
- semantic theme tokens
- Geist for product UI
- JetBrains Mono for technical values where useful
- Amiri for Arabic content
- Light, Dark, and System themes
- accessible focus states
- restrained surfaces and standard Tailwind radius/shadow utilities

Application UI must not introduce a competing visual language.

## 6. Design token architecture

Canonical semantic tokens live in:

```text
packages/ui/src/styles/globals.css
packages/ui/src/tokens/theme-tokens.ts
```

Domain-specific visualization tokens may exist only where they represent a real domain meaning; they must not replace the global semantic palette.

## 7. Theme rules

Root layouts use semantic theme classes and must not force dark mode. Theme selection supports Light, Dark, and System through the shared state/provider infrastructure.

## 8. Component naming

Prefer standard descriptive names such as `ResourceTable`, `DataTable`, `Panel`, `Modal`, `ContextBlock`, `BreadcrumbTrail`, and `ErrorBoundary`. Avoid decorative legacy naming for ordinary application primitives.

## 9. Backend transport architecture

`apps/api` constructs `NativeServer` from `@moon/server`.

`NativeServer` is the stable Moon public abstraction. **Fastify 5 is the only canonical production HTTP routing/lifecycle engine underneath it.**

```text
apps/api
  -> NativeServer / Moon contracts
  -> FastifyAdapter
  -> Fastify router + request lifecycle
  -> raw Moon handler bridge where compatibility requires it
  -> domain / ORM
```

The removed handwritten `node:http` route matcher is not a production alternative. `NativeServer.handleRequest()` exists only as a compatibility/test shim and uses Fastify injection.

Addon/domain packages must not import Fastify for ordinary route registration. They use `defineRoute()` or other Moon-owned contracts.

## 10. Request lifecycle

Canonical request ordering:

```text
Fastify request acceptance
-> request id + body parsing
-> Moon raw-request bridge
-> Moon middleware chain
-> authentication/authorization
-> route / REST / explicit RPC procedure
-> domain + ORM transaction
-> Moon response/error envelope
-> Fastify lifecycle completion
```

Fastify request IDs are returned as `x-request-id`, bridged to raw handlers, and logged at the transport boundary.

## 11. RPC boundary

RPC exposure is explicit. Network callers may invoke only names registered through `defineProcedure()`.

Every procedure has:

- explicit name
- runtime input schema
- runtime output schema
- fixed handler
- auth/admin policy where needed

Caller-controlled model/method strings must never resolve arbitrary class properties. Adding a new static ORM/model helper must expose zero new RPC surface automatically.

Ordinary CRUD continues to use the canonical bounded REST contract when possible.

## 12. SSE boundary

SSE runs as a deliberate raw-response escape hatch under the Fastify listener. Protected streams bind session identity, periodically revalidate token/user state, and close on revocation, expiry, inactivity, or shutdown.

## 13. OpenTelemetry and performance

`@moon/server` owns OpenTelemetry initialization and shutdown. The NodeSDK auto-instrumentation bundle provides supported transport/database tracing when `ENABLE_TELEMETRY=true`; local development must work with telemetry disabled and no collector.

`@moon/performance` remains application/product metrics. OTel complements it rather than replacing it.

Telemetry must never record JWTs, passwords, OTPs, authorization headers, raw sensitive bodies, secrets, or unbounded user text.

## 14. Witness domain architecture

Canonical Witness models include, where applicable:

```text
wx.source
wx.source.manifest
wx.source.artifact
wx.source.snapshot
wx.provenance
wx.text.edition
wx.passage
wx.content
wx.tradition
wx.tradition.corpus
wx.tradition.unit
wx.tradition.reference
wx.assertion
wx.evidence
```

Do not create duplicate models when an existing canonical model represents the requirement.

## 15. Engine and research boundary

Derived application data must remain distinct and traceable:

```text
source content
!= translation
!= evidence
!= assertion
!= research result
!= AI-generated synthesis
```

Derived results should retain source/evidence and execution context where the domain supports it.

## 16. Search architecture

Search is a projection over canonical application data, never a second source of truth:

```text
Witness graph -> search projection -> retrieval service -> @moon/protocol -> UIs
```

## 17. Repository cleanliness

- Keep application scripts in dedicated script locations.
- Keep domain logic inside domain/service packages.
- Keep UI rendering inside UI/application layers.
- Do not commit local caches, credentials, temporary corpus downloads, or generated runtime state.
- Avoid duplicate implementation paths once a migration is complete.

## 18. File size and maintainability

Keep source files below configured repository limits. Split components/services when they grow beyond the audit threshold. Views should orchestrate rather than contain large blocks of business or presentation logic.

## 19. Production database lifecycle

Application startup is not the schema migration mechanism. Production promotion requires reviewed migrations and canonical install/verify commands before service promotion.

```text
build exact artifact
-> PostgreSQL/Redis healthy
-> db:install
-> db:verify
-> API healthy
-> portals start
```

## 20. Operational ownership

Every production behavior has an identifiable owner:

```text
source data       -> moonwitness-corpus
application graph -> @moon/witness
transport         -> @moon/server / Fastify internally
API contract      -> @moon/protocol
master store      -> Odoo 19 + PostgreSQL (postgres:18-pgvector)
vector search     -> pgvector 0.8+ via @moon/witness RAG
pure compute      -> @moon/compute (isomorphic mathematical engine)
public UI         -> apps/web
admin UI          -> apps/command-center
shared UI         -> @workspace/ui
```

No parallel implementation should silently compete with these owners.

## 21. Polyglot monorepo architecture & contracts

The repository supports an enterprise polyglot architecture enabling compute-intensive capabilities to be implemented in their most effective runtime (TypeScript for application web/admin/BFF, Python for astronomical ephemeris and AI/NLP):

```text
moonwitness/
├── apps/
│   ├── web/                 # Public Next.js 16 Web application (Port 3000)
│   ├── command-center/      # Operations & administrative portal (Port 3001)
│   └── api/                 # Fastify / NativeServer Gateway (Port 4000)
├── services/
│   ├── celestial-engine/    # Python 3.12 FastAPI astronomical service (Port 8001)
│   │   ├── src/ephemeris.py # Lunar phase & orbital parameters
│   │   └── src/astronomy.py # Qibla Great Circle & Hilal MABIMS/Odeh criteria
│   └── ai-agent/            # Python 3.12 FastAPI AI service (Port 8002)
│       └── src/search.py    # Arabic text normalization & BM25 ranking
├── packages/                # 33 shared TypeScript packages (protocol, client, UI, ORM)
├── contracts/
│   └── openapi/             # Universal OpenAPI 3.0 contract artifact
└── docs/                    # Structured enterprise documentation (architecture, roadmap)
```

### Universal contract flow
1. `@moon/protocol` defines the canonical source of truth for endpoints, models, and schemas in TypeScript with Zod.
2. `pnpm contracts:export` exports `contracts/openapi/openapi.json` from the server registry.
3. `pnpm contracts:verify` validates that committed contracts match code with zero drift (blocking in CI and release pre-flight).
4. `pnpm contracts:generate:python` derives strongly-typed Pydantic v2 models directly into `services/celestial-engine/src/models/contracts.py` and `services/ai-agent/src/models/contracts.py`.
5. `apps/api` transparently proxies requests to `services/celestial-engine` and `services/ai-agent` with in-memory caching.
6. `@moon/client` provides typed frontend methods (`fetchQiblaDirection`, `fetchHilalVisibility`, `searchSemanticPassages`) consumed by `apps/web`.


