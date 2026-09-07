---
name: design-system-and-theme-governance
description: >-
  Use this skill when implementing, auditing, or refactoring UI components to ensure strict adherence to
  MoonWitness Enterprise shadcn/ui semantic tokens, Tailwind CSS v4 conventions, and Light/Dark theme parity.
---

# Design System & Theme Governance Skill

Guides visual implementation, ensuring zero drift from standard shadcn/ui semantic tokens and strict prevention of banned legacy styling.

## Core Rules

1. **Semantic Theme Tokens Only**:
   - Canvas: `bg-background`, `text-foreground`
   - Elevated Surfaces: `bg-card`, `text-card-foreground`, `border-border`
   - Primary Actions: `bg-primary`, `text-primary-foreground`
   - Secondary / Muted: `bg-secondary`, `text-muted-foreground`, `bg-muted`
   - Status Semantics: `bg-success/10 text-success`, `bg-warning/10 text-warning`, `bg-destructive/10 text-destructive`
   - Never use raw inline hex colors (`#...`), custom glow effects (`glow-*`), or pseudo-sci-fi utilities.

2. **Full Theme Parity**:
   - Root layouts must not hardcode dark mode.
   - All components must be accessible and readable across Light, Dark, and System modes.

3. **Validation**:
   - Run the constitutional rules auditor before committing UI code:
     ```bash
     node scripts/audit-rules.mjs
     ```
