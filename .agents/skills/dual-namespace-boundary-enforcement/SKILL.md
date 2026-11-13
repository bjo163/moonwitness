---
name: dual-namespace-boundary-enforcement
description: >-
  Use this skill when auditing or refactoring package dependencies, enforcing the strict separation
  between @moon/* (domain capabilities) and @workspace/* (infrastructure/framework platform).
---

# Dual-Namespace Boundary Enforcement (Subatomic Skill)

Governs the architectural boundary separating domain business packages from shared infrastructure packages according to Sovereign Monorepo Genesis Mandate 02.

## Dual Namespace Topology

The repository partitions packages into two mutually exclusive namespaces:

```text
┌────────────────────────────────────────────────────────┐
│                   @moon/* (Domain)                     │
│  @moon/compute, @moon/witness, @moon/mizan,            │
│  @moon/project, @moon/crm, @moon/account, etc.         │
└───────────────────────────┬────────────────────────────┘
                            │ depends on
                            ▼
┌────────────────────────────────────────────────────────┐
│               @workspace/* (Platform)                  │
│  @workspace/ui, @workspace/types, @workspace/state,    │
│  @workspace/hooks, @workspace/error                    │
└────────────────────────────────────────────────────────┘
```

### Sovereign Dependency Rules
1. **Unidirectional Flow**: `@moon/*` packages may depend on `@workspace/*` packages.
2. **Forbidden Inversion**: `@workspace/*` infrastructure packages must NEVER import from `@moon/*` domain packages.
3. **No Sibling Monolithic Creep**: `@moon/compute` (pure math) must NEVER depend on `@moon/orm` or `@moon/server`.
4. **Zero Circular Imports**: Cyclic dependencies between packages result in immediate build failures.

## Canonical Source Files
- `pnpm-workspace.yaml`
- `tools/validate-governance.mjs`
- `scripts/audit-rules.mjs`

## Verification Command
```bash
node scripts/audit-rules.mjs
```
