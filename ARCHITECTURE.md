# ◈ MoonWitness Architecture Specification (V9.0 Enterprise Standard)

Status: **Canonical Authority** for platform architecture across all 34 packages.

---

## 1. Unified Mental Model

```text
CLIENT UI (apps/web, apps/command-center)
   |
   +---> HOOKS (@workspace/hooks: useResource, useModal)
   |
   +---> STATE (@workspace/state: Zustand MoonProvider)
   |
   v
CLIENT SDK (@moon/client)
   |
   v
PROTOCOL CONTRACTS (@moon/protocol: Zod Schemas & Envelopes)
   |
   v
BACKEND TRANSPORT (@moon/server: defineRoute, Auth JWT, SSE)
   |
   v
DOMAIN ENGINES & ORM (@moon/witness, @moon/compute, @moon/orm)
   |
   v
POSTGRESQL 18+ INFRASTRUCTURE (pgvector 0.8+)
```

---

## 2. Core Architectural Laws

### A. Model-First Principle
New business capabilities start from a model. Do not begin by creating a repository, service layer, command bus, or database access path unless a concrete need proves it is necessary.

Canonical write path:
```text
HTTP / RPC / Worker
        |
        v
     Model
        |
        v
    Moon ORM
        |
        v
  PostgreSQL transaction
```

### B. Anti-Monolithic Law (`max-lines: 400`)
Every file in the monorepo must remain strictly under 400 lines. If a view or component expands, extract dedicated subcomponents into component directories (e.g. `views/knowledge/components/reader/`).

### C. Standard Enterprise Naming Law
Components and hooks use clean standard enterprise descriptors (`ResourceTable`, `Panel`, `Modal`, `ErrorBoundary`, `useModal`, `useResource`). Legacy `HUD*` prefixes are deprecated and aliased.

---

## 3. Package Responsibilities

### `apps/*`
- Composes user interfaces and runs Next.js 16 portals (`apps/web:3000`, `apps/command-center:3001`) and API runtime (`apps/api:4000`).
- Views act as thin orchestrators (< 200 lines) delegating UI rendering to subcomponents.

### `packages/moon-protocol`
- Single Source of Truth for Zod schemas, API contracts, response envelopes, and SSE event payload definitions.

### `packages/moon-compute`
- Zero-dependency, zero-network pure mathematical computation engine (planetary motion, lunar phase, prayer calculations).

### `packages/moon-server`
- Transport runtime: HTTP routing, JWT session validation, SSE real-time broadcasting, declarative `defineRoute()` builder with runtime Zod validation.

### `packages/moon-orm`
- Canonical data & model runtime: Vertex base model, fields, relations, `Recordset`, `QueryBuilder`, transaction boundaries, and schema synchronization.

### `packages/workspace/error`
- React crash isolation: `<ErrorBoundary>`, `<ModuleGuard>`, and `CrashReporter` telemetry dispatcher.

### `packages/workspace/hooks`
- Logic-only universal React hooks: `useResource`, `useModal`, `useComputedCelestial`, `useDebounce`, `useLocalStorage`.

### `packages/workspace/ui`
- Master Cosmic Design System, 3D Celestial Shaders, `<ResourceTable>`, `<ContextBlock>`, `<Panel>`, `<Button>`, and Web Audio acoustic synthesizers.

---

## 4. Directory Cleanliness Policy
- All loose scripts in application directories belong in dedicated `scripts/` folders (`apps/web/scripts/`, `apps/api/scripts/`).
- Root directory must contain only canonical repository configuration and high-level markdown specifications.