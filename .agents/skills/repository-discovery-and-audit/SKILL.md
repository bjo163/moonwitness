---
name: repository-discovery-and-audit
description: >-
  Use this skill to audit repository architecture, discover workspace topologies, inspect package boundaries,
  verify dependency graphs, and detect structural debt or duplication across the polyglot monorepo.
---

# Repository Discovery & Architectural Audit Skill

Provides procedural guidelines for discovering monorepo components, mapping package relationships, and validating architectural integrity.

## Workflow

1. **Map Repository Topology & Workspaces**:
   - Inspect package manifests across `apps/*` and `packages/*`.
   - Run dependency impact and topology analyzers:
     ```bash
     pnpm repo:map
     pnpm repo:impact
     ```

2. **Audit Architectural Boundaries**:
   - Verify that all packages adhere to the **Sovereign Monorepo Genesis Contract**:
     - Check dual-namespace conventions (`@moon/*` for backend/engine, `@workspace/*` for shared UI/types).
     - Ensure single entrypoint `src/index.ts` with zero illegal deep imports across package boundaries.
   - Run umbrella architectural audits:
     ```bash
     pnpm audit:umbrella:validate
     ```

3. **Check Polyglot Cleanliness**:
   - Verify single canonical ownership: one concept, one responsible owner, one canonical location.
   - Flag orphaned artifacts, shadow implementations, or duplicated configuration models.
