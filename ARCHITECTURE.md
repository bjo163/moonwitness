# MoonWitness Architecture Specification (Enterprise Standard)

Status: **Canonical**. This document defines the application architecture and ownership boundaries for the MoonWitness monorepo.

---

## 1. System Model

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
          |
          v
DOMAIN + APPLICATION SERVICES
@moon/witness + @moon/compute + @moon/orm
          |
          v
PostgreSQL / application infrastructure
```

The canonical corpus is maintained separately by:

```text
bjo163/moonwitness-corpus
```

The application consumes versioned corpus releases through `@moon/witness` ingestion and represents them in the canonical Witness domain graph.

---

## 2. Source and Ownership Boundaries

### `moonwitness-corpus`
Owns:

- canonical corpus authoring
- upstream synchronization
- source metadata
- corpus schemas
- canonical JSON/JSONL
- corpus releases and artifacts
- corpus-level provenance

The corpus repository does not own the MoonWitness application database.

### `@moon/witness`
Owns:

- source-aware ingestion
- normalization and validation
- application knowledge graph
- source/artifact/snapshot records
- passage and textual content models
- provenance relationships
- evidence and research-domain integration

### MoonWitness database

The database is the operational persistence and query projection of the application domain. It is not the editorial source of the corpus.

### `apps/web`

Public product presentation and source-aware knowledge browsing.

### `apps/command-center`

Authorized administration, operational monitoring, corpus/import controls, and application management.

---

## 3. Corpus Integration Flow

```text
moonwitness-corpus
        |
        | immutable release / pinned revision
        v
Corpus artifact + manifest
        |
        v
@moon/witness ingestion
        |
        +--> source / artifact / snapshot
        +--> provenance
        +--> text edition
        +--> passage
        +--> content
        +--> tradition / research graph where applicable
        |
        v
MoonWitness API
        |
   +----+----+
   |         |
   v         v
 Web   Command Center
```

The public Web and Command Center never read raw corpus files directly.

---

## 4. Canonical Write Path

New business capabilities should start from an appropriate domain model or existing domain service.

Canonical application write path:

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
Moon ORM
        |
        v
Database transaction
```

Corpus ingestion follows the same application boundary through `@moon/witness` rather than creating a parallel repository or persistence layer.

---

## 5. Enterprise UI Architecture

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

---

## 6. Design Token Architecture

The canonical semantic token layer lives in:

```text
packages/ui/src/styles/globals.css
packages/ui/src/tokens/theme-tokens.ts
```

Primary semantic roles include:

```text
background
foreground
card
card-foreground
popover
popover-foreground
primary
primary-foreground
secondary
secondary-foreground
muted
muted-foreground
accent
accent-foreground
destructive
destructive-foreground
success
success-foreground
warning
warning-foreground
info
info-foreground
border
input
ring
```

Domain-specific visualization tokens may exist where they have a real domain meaning. They must not become substitutes for the global UI palette.

---

## 7. Theme Rules

The root layouts of both applications must use semantic theme classes:

```text
bg-background
text-foreground
```

Neither application may force a dark theme at the root.

The theme is selected by the existing application state/provider and must support:

```text
Light
Dark
System
```

---

## 8. Component Naming

Use standard, descriptive names:

```text
ResourceTable
DataTable
Panel
Modal
ContextBlock
BreadcrumbTrail
ErrorBoundary
```

Avoid legacy or decorative naming conventions.

---

## 9. Backend Architecture

`apps/api` is the application backend runtime.

`@moon/server` provides transport and route infrastructure.

`@moon/protocol` is the API contract source of truth.

Routes should remain thin and delegate application behavior to services/domain models.

---

## 10. Witness Domain Architecture

The canonical Witness graph includes, where applicable:

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

Do not create duplicate models when an existing canonical model already represents the requirement.

---

## 11. Engine and Research Boundary

Engine and research outputs are derived application data.

```text
source content
    !=
translation
    !=
evidence
    !=
assertion
    !=
research result
    !=
AI-generated synthesis
```

Derived results must remain traceable to the source/evidence and execution context that produced them where the domain supports this.

---

## 12. Search Architecture

Search is a projection over canonical application data.

```text
Witness graph
    |
    v
search projection
    |
    v
retrieval service
    |
    v
@moon/protocol
    |
    v
Web / Command Center
```

Search must not become a second source of truth.

---

## 13. Repository Cleanliness

- Keep application scripts in dedicated script locations.
- Keep domain logic inside domain/service packages.
- Keep UI rendering inside UI/application layers.
- Do not commit local caches, credentials, temporary corpus downloads, or generated runtime state.

---

## 14. File Size and Maintainability

Keep source files below the repository's configured file-size limits. When a component or service grows beyond the limit, split it into focused modules.

Views should orchestrate rather than contain large blocks of business or presentation logic.

---

## 15. Operational Principle

Every production behavior should have an identifiable owner:

```text
source data       -> moonwitness-corpus
application graph -> @moon/witness
transport         -> @moon/server
API contract      -> @moon/protocol
public UI         -> apps/web
admin UI          -> apps/command-center
shared UI         -> @workspace/ui
```

No parallel implementation should silently compete with these owners.
