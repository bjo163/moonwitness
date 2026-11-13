---
name: polyglot-repo-cleanup-and-refactor
description: >-
  Use this skill when auditing the polyglot codebase for structural waste, ambiguity, duplication (D1-D10),
  boundary violations, or generating atomic user-selectable remediation task backlogs.
---

# Polyglot Repository Cleanup & Atomic Task Generation Skill

Executes comprehensive structural audits and generates atomic, user-selectable remediation backlogs based on the canonical `POLIGOTCLEANER` framework.

## Core Mandate: Audit-First / Task-Generation-Only

When activated, the agent operates in an **Audit-Only** mode:
- **Zero In-Flight Edits**: Never move, delete, rename, or rewrite files during the audit phase.
- **Output Artifact**: A structured, priority-ranked task backlog ready for selective user execution.

## The Invariant Success Condition

```text
ONE CONCEPT
    ↓
ONE RESPONSIBLE OWNER
    ↓
ONE CANONICAL LOCATION
    ↓
ONE CANONICAL IMPLEMENTATION
    ↓
ONE CANONICAL ENTRYPOINT
    ↓
ONE VALIDATED WAY TO USE IT
```

## The L0–L11 Inspection Scale

Audit repository structures across all 12 dimensions:
- **L0 Repository**: Root governance, federation model.
- **L1 Workspace / App / Service**: `apps/web`, `apps/command-center`, `apps/api`, `services/*`.
- **L2 Domain / Bounded Context**: Corpus, Mizan, Disaster, Celestial, Business.
- **L3 Module / Package**: 34 workspace packages (`@moon/*`, `@workspace/*`).
- **L4 Directory**: Responsibility, boundary, density, pollution.
- **L5 File**: Orphan files, shadow implementations, lifecycle state.
- **L6 Symbol / Type**: Duplicate interfaces, classes, functions.
- **L7 Dependency / Import**: Deep imports, reverse dependencies, cycles.
- **L8 Configuration Entry**: Shadowed configs, duplicate env variables.
- **L9 Command / Script**: Redundant build, dev, and test entrypoints.
- **L10 Generated Artifact**: Outdated bindings, untracked artifacts.
- **L11 Documentation Reference**: Outdated READMEs, broken file links.

## Multi-Dimensional Duplication Detection (D1–D10)

- **D1 Exact**: Identical code blocks or duplicated files.
- **D2 Structural**: Parallel directories serving identical architectural roles.
- **D3 Semantic**: Multiple different implementations of the same business capability.
- **D4 Behavioral**: Disparate execution paths producing identical runtime results.
- **D5 Configuration**: Settings repeated across multiple files.
- **D6 Command**: Duplicate CLI commands performing identical tasks.
- **D7 Schema**: Duplicated TypeScript interfaces, Zod contracts, or database schemas.
- **D8 Utility**: Repeated helper functions scattered across domain packages.
- **D9 Documentation**: Contradictory or repeated guidelines.
- **D10 Cross-Language**: Duplicate business logic reimplemented in TS and Python.

## Canonical Task Schema

Every generated task MUST adhere to this exact machine-verifiable format:

```text
TASK-ID: TASK-001
TITLE: <One atomic action>
PRIORITY: P0 | P1 | P2 | P3 | P4
CONFIDENCE: HIGH | MEDIUM | LOW
RISK: LOW | MEDIUM | HIGH
CATEGORY: DIRECTORY | DUPLICATION | OWNERSHIP | MODULE | DEPENDENCY | CONFIG | SCRIPT | ENTRYPOINT | GENERATED | LEGACY | NAMING | DOCUMENTATION | TEST | OTHER
PROBLEM: Exactly one structural issue.
EVIDENCE: Concrete file paths, line numbers, or symbol references.
CURRENT STATE: Observed status quo.
CANONICAL TARGET: The authoritative location/implementation.
TARGET STATE: Target architecture post-execution.
ATOMIC ACTION: Exact steps to take.
SCOPE: Explicitly bounded paths.
NON-GOALS: Changes that must NOT be made.
DEPENDENCIES: Prerequisite TASK-IDs.
VALIDATION: Independent command to verify correctness.
DONE CRITERIA: Machine-checkable completion conditions.
```

## The Single Repository Clean Gate

At the conclusion of the audit, evaluate all findings against the single clean gate:
- If unresolved P0/P1 architectural blockers exist: `REPOSITORY CLEAN GATE: FAIL`
- If all structural boundaries are verified: `REPOSITORY CLEAN GATE: PASS`
