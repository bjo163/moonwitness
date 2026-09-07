---
name: anti-monolithic-file-decomposition
description: >-
  Use this skill when decomposing source files exceeding the 400-line threshold (Law 10) into focused,
  atomic sub-modules while preserving all public TypeScript exports and contract compatibility.
---

# Anti-Monolithic File Decomposition (Subatomic Skill)

Governs the systematic refactoring of oversized monolithic source files ($> 400\text{ lines}$) into cohesive subatomic modules according to MoonWitness Law 10.

## Decomposition Procedure

When a file exceeds 400 lines (e.g. `base.ts`, `query.ts`, or large view components):
1. **Identify Orthogonal Responsibilities**:
   - Split types and interfaces into `*.types.ts`.
   - Extract pure utility functions into `*-utils.ts`.
   - Separate state machines or hooks into `use-*.ts`.
   - Isolate sub-components into atomic child files.
2. **Barrel Gateway Preservation**:
   - The original entry file (or `index.ts`) must re-export all symbols to ensure **zero breaking changes** for downstream consumers:
     ```typescript
     export * from './model-types'
     export * from './model-lifecycle'
     export * from './model-query-builder'
     ```
3. **Verify Downstream Consumers**:
   - Run type checks and unit tests to ensure all call sites compile cleanly without import path adjustments.

## Canonical Reference
- `scripts/audit-rules.mjs` (Constitutional Law 10)
- `POLIGOTCLEANER.MD` (D1-D10 Duplication & Debt Remediation)

## Verification Command
```bash
node scripts/audit-rules.mjs
```
