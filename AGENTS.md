<!-- BEGIN:nextjs-agent-rules -->
# Next.js Project Rules

This repository uses a current Next.js release whose APIs and conventions may differ from older examples. Before changing Next.js-specific behavior, inspect the installed project documentation and existing patterns in the repository.
<!-- END:nextjs-agent-rules -->

<!-- BEGIN:moonwitness-core-rules -->
# MoonWitness — Engineering & Architecture Guidelines (Enterprise)

## 1. Application Structure
This monorepo contains two user-facing applications and one backend service:

- `apps/web/`: Public Web application.
- `apps/command-center/`: Administrative and operations application.
- `apps/api/`: Backend service for REST, RPC, SSE, and background jobs.

Both applications share the same domain, API contracts, state layer, and design system.

## 2. Workspace Packages
Core packages include:

- `@moon/base`
- `@moon/witness`
- `@moon/project`
- `@moon/helpdesk`
- `@moon/cab`
- `@moon/crm`
- `@moon/product`
- `@moon/stock`
- `@moon/account`
- `@moon/mail`
- `@moon/geo`
- `@moon/khidra`
- `@moon/mizan`
- `@moon/shootgun`
- `@moon/performance`
- `@moon/cron`
- `@moon/protocol`
- `@moon/compute`
- `@moon/client`
- `@moon/server`
- `@workspace/ui`
- `@workspace/types`
- `@workspace/state`
- `@workspace/hooks`
- `@workspace/error`

## 3. Canonical Domain Ownership

### `moonwitness-corpus`
Owns canonical corpus authoring, upstream synchronization, source metadata, corpus schemas, canonical JSON/JSONL, corpus releases, artifacts, and corpus-level provenance.

### `@moon/witness`
Owns source-aware ingestion, normalization, validation, the application knowledge graph, source/artifact/snapshot records, passages, textual content, provenance, evidence, and research-domain integration.

### `PostgreSQL 18 + pgvector (postgres:18-pgvector)`
Provides the single canonical relational source of truth for all domain entities, sacred knowledge graph records (`moon.witness.*`), Mizan ethical evaluations (`moon.mizan.*`), disaster & myth correlations (`moon.disaster.*`), user security (`vx.user`), and enterprise operational modules. It eliminates duplicate local relational stores.

### `@moon/protocol`
Is the API contract source of truth.

### `@moon/server`
Owns high-speed backend transport, route infrastructure, Redis hot caching, isomorphic celestial math (`@moon/compute`), and pgvector RAG retrieval.

### `@workspace/ui`
Owns the shared enterprise UI primitives and theme system.

## 4. Corpus Integration
The canonical data flow is:

```text
moonwitness-corpus
        |
        | immutable release / pinned revision
        v
corpus artifact + manifest
        |
        v
@moon/witness ingestion
        |
        v
@moon/odoo-bridge
        |
        v
Odoo 19 Master Store (moon.witness.*)
        |
        v
MoonWitness API Gateway (Fastify)
        |
   +----+----+
   |         |
   v         v
  Web   Command Center
```

Applications must not read raw corpus files directly at runtime.

Do not create a second corpus store inside `moonwitness`.

## 5. Data Fetching
- Prefer existing typed API clients and hooks when an endpoint is available.
- Do not place production data in inline mock arrays when real API data exists.
- Public and administrative clients must use typed `@moon/protocol` contracts.
- Backend routes must use the repository's existing route/service architecture.

## 6. Model and Persistence Rules
- Start new business capabilities from an appropriate domain model or existing domain service.
- Keep database logic out of React components.
- Preserve source identity and provenance.
- Do not silently mutate canonical source content.
- Use idempotent, source-aware identity for corpus imports.

## 7. Engine and Research Rules
Engine output is derived application data.

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

Derived output must remain traceable to its input/source context where supported by the domain model.

## 8. Enterprise Design System
The shared design system is based on:

- shadcn/ui
- Tailwind CSS v4
- semantic CSS variables
- Geist for product UI
- JetBrains Mono for technical values where appropriate
- Amiri for Arabic content
- Light, Dark, and System themes

Use existing shared components and semantic tokens before introducing new variants.

## 9. Semantic Theme Tokens
Use semantic roles such as:

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

Do not introduce arbitrary global color aliases when an existing semantic token is appropriate.

## 10. Theme Rules
- Root layouts must not force a dark theme.
- Root `body` elements must use `bg-background` and `text-foreground`.
- Light, Dark, and System modes must remain runtime-selectable.
- Do not implement a competing theme provider.

## 11. Typography
- Use sentence/title case for product headings.
- Do not introduce decorative display fonts for the product UI.
- Use `font-mono` only where technical values benefit from it.
- Use `.arabic-text` for Arabic reading experiences where appropriate.

## 12. Component Naming
Use concise, standard names:

```text
ResourceTable
DataTable
Panel
Modal
ContextBlock
BreadcrumbTrail
ErrorBoundary
```

Avoid decorative or themed prefixes.

## 13. Visual Design
Use a compact, text-first research publication presentation. The canonical specification is
[Research UI guidelines](docs/RESEARCH-UI.md). Apply it to new UI and touched views.

- Page titles: text-2xl, optionally sm:text-3xl; section titles: text-lg or text-xl.
- Reading text: text-base with leading-relaxed and a measure around 65–75 characters.
- UI text: text-sm; metadata: text-xs. Do not shrink prose to increase density.
- Prefer document sections, reference lists, and tables separated by thin borders.
- Use section padding py-6 or py-8 and gaps of 3–6 spacing units.
- Avoid promotional heroes, uppercase headings, decorative blur, gradients, and oversized whitespace.
- Cards are for distinct interactive or status groups; use rounded-md and no default shadow.
- Keep source, edition, revision, and citations near the content they qualify.
- Preserve legible Arabic line height, touch targets, keyboard focus, and runtime themes.

Use restrained shared primitives:

- standard Tailwind radius utilities
- standard border and shadow utilities
- clear hierarchy
- accessible contrast
- responsive layouts
- minimal decorative effects

Do not introduce alternate visual systems.

## 14. Code Size
Keep source files within the repository's configured line limits. Split oversized files into focused modules.

Views should remain thin orchestration layers and should not contain large blocks of domain logic.

## 15. Accessibility
Interactive UI must support:

- keyboard navigation
- visible focus states
- semantic headings
- accessible labels
- accessible dialogs/menus
- non-visual alternatives for complex visualizations

## 16. Security
- Validate external input.
- Do not expose credentials or private metadata.
- Use parameterized queries and existing validation layers.
- Respect authorization boundaries for public/admin data.
- Do not execute untrusted source content.

## 17. Search
Search is a projection over canonical application data.

Do not create a second source of truth in the search layer.

## 18. Source Transparency
For source-derived content, preserve and expose meaningful:

```text
source
reference
edition
revision
provenance
```

where available.

Do not represent derived analysis as source text.

## 19. Governance Audit
Run:

```bash
node scripts/audit-rules.mjs
```

The audit scans active source for prohibited legacy UI patterns and other repository rules.

The auditor may contain explicit legacy terms because it exists to detect those terms; active product UI and product-facing documentation must not use them.

## 20. Final Rule
When a requirement can be satisfied by an existing canonical package, model, contract, token, hook, or service, reuse it instead of creating a competing abstraction.

The intended ownership chain is:

```text
corpus data       -> moonwitness-corpus
application graph -> @moon/witness
transport         -> @moon/server
API contract      -> @moon/protocol
master store      -> Odoo 19 + PostgreSQL (postgres:18-pgvector)
vector search     -> pgvector 0.8+ via @moon/witness RAG
pure compute      -> @moon/compute (isomorphic mathematical engine)
public UI         -> apps/web
admin UI          -> apps/command-center
shared UI         -> @workspace/ui
```

No parallel implementation should silently compete with these owners.

## 21. Reuse and component health

- Generic presentation primitives belong in `packages/ui`; feature components
  that depend on domain models, API clients, or feature state remain in their
  owning `apps/*` or `packages/moon-*` package.
- Before adding a component, search `packages/ui` and the feature packages for
  an existing equivalent. Extend the canonical component with a typed variant
  or slot when the behavior is genuinely shared.
- Renaming a duplicate component, moving it to a differently named file, or
  wrapping the same markup does not satisfy reuse. The audit treats equivalent
  duplicate definitions as a refactor finding.
- Use `node scripts/audit-rules.mjs` and `pnpm test:scripts`; inspect component
  health findings. Components rated `extract-now` need decomposition before
  adding more behavior. Do not silence a finding by changing its name.
<!-- END:moonwitness-core-rules -->
