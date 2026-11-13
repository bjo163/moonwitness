---
name: shadcn-tailwind-v4-token-enforcement
description: >-
  Use this skill when auditing or refactoring UI components to replace raw hex colors,
  prohibited legacy cyber classes, and enforce Tailwind CSS v4 semantic tokens with light/dark theme parity.
---

# shadcn / Tailwind CSS v4 Semantic Token Enforcement (Subatomic Skill)

Governs the visual design token system across `packages/ui`, `apps/command-center`, and `apps/web` to enforce the MoonWitness Enterprise Design System Bible.

## Canonical Semantic Tokens

All background, foreground, border, and state styles must use semantic tokens:

```text
bg-background        text-foreground        border-border
bg-card              text-card-foreground   border-input
bg-primary           text-primary-foreground ring-ring
bg-secondary         text-secondary-foreground
bg-muted             text-muted-foreground
bg-accent            text-accent-foreground
bg-destructive       text-destructive-foreground
```

### Status Variants
- **Success**: `bg-success/10 text-success border-success/30`
- **Warning**: `bg-warning/10 text-warning border-warning/30`
- **Info**: `bg-info/10 text-info border-info/30`

## Absolute Bans & Auto-Remediation
| ❌ Prohibited Code | ✅ Compliant Replacement |
|---|---|
| `bg-[#090d16]` | `bg-background` |
| `text-[#f4f4f5]` | `text-foreground` |
| `bg-cyber-*` / `text-cyber-*` | Standard semantic tokens (`bg-primary`, etc.) |
| `font-orbitron` | `font-mono` (JetBrains Mono) |
| `border-[#ffffff1a]` | `border-border` |

## Canonical Source Files
- `packages/ui/src/styles/globals.css`
- `packages/ui/src/tokens/`
- `scripts/audit-rules.mjs`

## Verification Command
```bash
node scripts/audit-rules.mjs
```
