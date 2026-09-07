---
name: umbrella-audit-and-certification
description: >-
  Use this skill when running repository constitutional audits, validating architectural invariants,
  generating runtime evidence, and certifying pull requests against umbrella standards.
---

# Umbrella Audit & Constitutional Certification Skill

Governs repository-wide static and runtime verification across the 6 constitutional pillars and Genesis contracts.

## The 6 Constitutional Pillars

1. **Pillar I & II: Visual DNA, Tokens & Topology**:
   - Zero ghost files, zero legacy tokens (`cyber-*`, `hud-*`).
   - Layered dependency flow: zero `@core` or `@modules` imports.
   - Zero-drift semantic palette: no raw inline hex codes (`bg-[#...]`).
   - Single theme source in `packages/ui/src/styles/globals.css`.
2. **Pillar III & IV: React 19 / Next.js 16 & Isomorphic Compute**:
   - `"use client"` strict line-1 placement in interactive components.
   - `@moon/compute` pure mathematical engine isolation.
3. **Pillar V: Security & Database Integrity**:
   - Zero plaintext secrets / API keys in code.
   - External links must declare `rel="noopener noreferrer"`.
   - HTML rendering must be sanitized.
4. **Pillar VI: Memory Safety & Performance**:
   - Universal persistent storage hooks (`useLocalStorage`).
   - Leak-free event listeners and SSE telemetry streams.
5. **Phase 5: Canonical Enterprise Design System**:
   - Complete Light, Dark, and System theme parity.
   - Standard semantic status tokens: `success`, `warning`, `info`, `destructive`.

## Certification Runbook

```bash
# Fast rules audit
node scripts/audit-rules.mjs

# Umbrella full validation and runtime evidence generation
pnpm audit:umbrella:validate

# Verify foundation readiness before PR merge
pnpm verify:foundation

# Run comprehensive CI audit pipeline
pnpm audit:ci

# Generate runtime evidence report
pnpm runtime:evidence
```

## Failure Triage Guide

- If `[LAW 01]` fails: Locate the file and line, replace inline color with semantic token (`bg-background`, `text-foreground`, `bg-card`, etc.).
- If `[LAW 11]` fails: Move `"use client";` to line 1 before any imports or comments.
- If `[GENESIS CONTRACT]` fails: Check package `package.json` for missing scripts (`build`, `test`, `lint`, `typecheck`) or non-compliant namespace.
