<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

<!-- BEGIN:moonwitness-core-rules -->
# MoonWitness OS — Enterprise Architecture & Design System Guidelines

## 1. Dual-Portal Monorepo System
This project operates on an isolated dual-portal and backend engine architecture:
- `apps/web/`: Public Web Portal (Next.js 16, Port 3000) — Observatory, Holy Scriptures, Hadith, Seismix, Hijri Calendar, & Knowledge Network.
- `apps/command-center/`: Operations & Governance Console (Next.js 16, Port 3001) — Hadith & Scripture Management, Users, CAB Governance, Task Queues, Automations, & System Administration.
- `apps/api/`: Backend Service (Port 4000) — REST, RPC, Server-Sent Events (SSE), and Background Cron/Queue Runner.

## 2. Canonical Enterprise Design System (shadcn/ui & Tailwind CSS v4)
- **Single Source of Truth**: `packages/ui/src/styles/globals.css` is the sole canonical theme source.
- **Pure Semantic Tokens**:
  - `bg-background` / `text-foreground`
  - `bg-card` / `text-card-foreground`
  - `bg-primary` / `text-primary-foreground`
  - `bg-secondary` / `text-secondary-foreground`
  - `bg-muted` / `text-muted-foreground`
  - `bg-accent` / `text-accent-foreground`
  - `bg-destructive` / `text-destructive-foreground`
  - `border-border`, `border-input`, `ring-ring`
- **Semantic Status Tokens**:
  - `success` / `success-foreground` (`bg-success`, `text-success`)
  - `warning` / `warning-foreground` (`bg-warning`, `text-warning`)
  - `info` / `info-foreground` (`bg-info`, `text-info`)
- **Theme Parity**: Full Light, Dark, and System mode support with high contrast and readable surfaces.

## 3. Absolute Terminology & Aesthetic Ban
- **Forbidden Terms & Visual Tokens**:
  - `cyber`, `tactical`, `HUD`, `cosmic`, `neon`, `laser`, `glow`, `sci-fi`, `hacker`, `retro terminal`, `holographic`
  - `mission control`, `operator clearance`, `command shell`, `secure link`, `signal active`, `telemetry aesthetic`
  - `Orbitron` font family (permanently banned)
  - Custom clip utilities (`clip-card`, `clip-tag`, `corner-box`, `panel-glass`, `laser-*`, `glow-*`, `bg-space`)
  - Raw inline color literals (`bg-[#...]`, `text-[#...]`, `border-[#...]`, `shadow-[...rgba(...)]`)
- **Standard Enterprise Terminology**:
  - `Dashboard`, `Overview`, `Users`, `Projects`, `Tasks`, `Activity`, `Settings`, `Profile`, `Notifications`, `Integrations`, `Reports`, `Audit Log`, `System Health`, `Quick Actions`, `Data Table`, `Search`, `Filters`

## 4. Typography Hierarchy
- `font-sans`: Geist (`--font-sans`) for headings, body, and UI elements.
- `font-mono`: JetBrains Mono / Geist Mono (`--font-mono`) for code, data values, and identifiers.
- `font-arabic`: Amiri (`--font-arabic`, `.arabic-text`) for sacred Arabic scripts with RTL alignment.

## 5. Architectural Constraints
- File size limit: max 400 lines per file (`max-lines: 400`).
- React JSX nesting depth cap: max 6 levels (`react/jsx-max-depth: 6`).
- Module crash isolation: Dynamic routes wrapped with `<ModuleGuard>` or `<ErrorBoundary>`.
- Verified via `node scripts/audit-rules.mjs`.
<!-- END:moonwitness-core-rules -->