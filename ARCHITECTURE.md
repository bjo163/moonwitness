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
@moon/server
NativeServer public API
Fastify 5 internal HTTP engine
          |
          v
DOMAIN + APPLICATION SERVICES
@moon/witness + other addons + @moon/orm
          |
          v
PostgreSQL / Redis / application infrastructure
```

The canonical corpus is maintained separately by:

```text
bjo163/moonwitness-corpus
```

The application consumes versioned corpus releases through `@moon/witness` ingestion and represents them in the canonical Witness domain graph.

## 2. Source and ownership boundaries

### `moonwitness-corpus`

Owns canonical corpus authoring, upstream synchronization, source metadata, corpus schemas, canonical JSON/JSONL, corpus releases/artifacts, and corpus-level provenance. It does not own the application database.

### `@moon/witness`

Owns source-aware ingestion, normalization/validation, application knowledge graph, source/artifact/snapshot records, passages/content, provenance relationships, evidence, and research-domain integration.

### MoonWitness database

The database is operational persistence and query projection of the application domain. It is not the editorial source of the corpus.

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
MoonWitness API
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
Application Service / Domain Operation
        |
        v
Canonical Model
        |
        v
Moon ORM transaction + authorization
        |
        v
PostgreSQL
```

Corpus ingestion uses the same application boundary through `@moon/witness`.

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
persistence       -> @moon/orm + PostgreSQL
public UI         -> apps/web
admin UI          -> apps/command-center
shared UI         -> @workspace/ui
```

No parallel implementation should silently compete with these owners.
