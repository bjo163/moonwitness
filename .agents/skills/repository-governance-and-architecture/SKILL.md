---
name: repository-governance-and-architecture
description: >-
  Use this skill to audit repository architecture, discover workspace topologies, inspect package boundaries,
  enforce the Sovereign Monorepo Genesis Contract, and ensure strict compliance with monorepo covenants.
---

# Repository Governance & Architecture Skill

Governs the architectural federation of MoonWitness across all 34 workspace packages, Next.js applications, and polyglot microservices.

## Architectural Boundaries

### 1. Dual-Namespace Convention
Every workspace package must strictly reside in one of two namespaces:
- **`@workspace/<name>`**: Shared frontend primitives, design tokens, hooks, UI state, universal types, error envelopes, and internationalization.
  - Examples: `@workspace/ui`, `@workspace/types`, `@workspace/state`, `@workspace/hooks`, `@workspace/error`, `@workspace/i18n`, `@workspace/auto-avatar`.
- **`@moon/<name>`**: Backend services, pure compute engines, database ORM, protocol contracts, domain intelligence, and operations modules.
  - Examples: `@moon/server`, `@moon/orm`, `@moon/base`, `@moon/compute`, `@moon/protocol`, `@moon/witness`, `@moon/mizan`, `@moon/project`, `@moon/crm`.

### 2. Sovereign Public Gateway (`src/index.ts`)
- Every package MUST expose a single canonical entrypoint: `src/index.ts`.
- **Zero Deep Imports**: Importing internal paths (e.g. `import { x } from "@moon/server/src/handlers/internal"`) is strictly prohibited. All exports must flow through `src/index.ts`.

### 3. Layered Dependency Hierarchy
Dependencies must flow strictly downward:
```text
Apps (apps/web, apps/command-center, apps/api)
  ↓
Domain Intelligence & Operations (@moon/witness, @moon/mizan, @moon/project, etc.)
  ↓
Shared Infrastructure & Core Transport (@moon/server, @moon/orm, @moon/protocol, @workspace/ui)
  ↓
Universal Primitives & Pure Math (@moon/compute, @moon/base, @workspace/types, @workspace/error)
```

## Verification & Auditing Commands

Run these commands to verify repository topology and governance integrity:

```bash
# Verify monorepo package impact and graph topology
pnpm repo:map
pnpm repo:impact

# Verify governance registries schema, dependencies, and reference integrity
pnpm governance:validate

# Inspect workflow policies and testability boundaries
pnpm workflow:check
pnpm testability:check

# Run full constitutional rules auditor across all 34 workspace packages
node scripts/audit-rules.mjs
```

## Governance Checklist

- [ ] Package `package.json` contains valid namespace (`@workspace/*` or `@moon/*`).
- [ ] TypeScript config extends `@workspace/typescript-config/base.json`.
- [ ] Only public symbols are exported via `src/index.ts`.
- [ ] No circular dependencies between workspace packages.
- [ ] Zero raw unvalidated environment variable reads outside `packages/types/src/env.ts`.
