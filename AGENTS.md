<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

<!-- BEGIN:moonwitness-core-rules -->
# MoonWitness OS — Architecture & Constitutional Guidelines (V10.0 — Canonical Enterprise Matrix)

## 1. Dual-Portal Monorepo System
This project operates on an isolated dual-portal and backend engine architecture:
- `apps/web/`: Public Web Portal (Next.js 16, Port 3000) — Observatorium, Kitab Suci, Hadits, Seismix, Kalender Hijriyah, & Refleksi Global.
- `apps/command-center/`: Operations Terminal (Next.js 16, Port 3001) — Manajemen Hadits, Kitab, Pengguna, CAB RFC, BullMQ Worker Queue, Automations, & System Operations.
- `apps/api/`: Backend Service (Port 4000) — REST, RPC, Server-Sent Events (SSE), dan Background Cron/Queue Runner.

## 2. Master Workspace Packages (37 Projects Matrix & 16 Sovereign Addons)
- **16 Sovereign Addon Packages**: `@moon/base`, `@moon/witness`, `@moon/project`, `@moon/helpdesk`, `@moon/cab`, `@moon/crm`, `@moon/product`, `@moon/stock`, `@moon/account`, `@moon/mail`, `@moon/geo`, `@moon/khidra`, `@moon/mizan`, `@moon/shootgun`, `@moon/performance`, `@moon/cron`.
- `@workspace/ui`: Master Enterprise Design System (shadcn/ui, Tailwind CSS v4), 3D Celestial Visualizers (`CelestialMoonSphere`, `CelestialQiblaCompass`, `CelestialEclipseSimulator`), Server-Driven Matrix Components (`ModelWorkspace`, `ModelDataTable`, `ModelKanbanBoard`, `ModelPivotGrid`, `ModelFormModal`, `ModelImportModal`, `ModelFieldWidget`, `ModelCopilotWidget`), Universal Report Printer, dan Web Audio Synthesizer (`soundEngine`).
- `@workspace/types`: Master domain models, constants (`DEFAULT_COORDINATES`, `STORAGE_KEYS`, `APP_PORTS`), `ViewManifest` type matrix, dan master `NAVIGATION_MESH`.
- `@workspace/state`: Master Zustand stores, `MoonProvider`, dan cross-app reactive state.
- `@workspace/hooks`: Universal client hooks (`useResource`, `useModal`, `useModelSchema`, `useModelRecords`, `useComputedCelestial`, `useDebounce`, `useLocalStorage`, `useClipboard`, `useGeolocation`).
- `@workspace/error`: Fault tolerance layer, `ErrorBoundary`, `ModuleGuard`, dan global crash telemetry (`CrashReporter`).
- `@moon/protocol`: Single Source of Truth Zod API contracts & schema envelopes (`/api/witness/*`, `/auth/*`, `/api/cab/*`, `/api/mizan/*`).
- `@moon/compute`: Isomorphic pure computation engine (astronomy, moon phase, prayer times, sun position) — zero DB, zero network.
- `@moon/client`: Universal typed API client, `useAuthSession` (Cross-App SSO), telemetry listener, dan typed fetch helpers.
- `@moon/server`: Native HTTP/REST/RPC/SSE engine dengan declarative `defineRoute()` builder, rich schema introspection (`/api/meta/model/:name`), dan runtime schema validation.

## 3. Anti-Monolithic Constraints & The 33 Constitutional Laws
- File TIDAK BOLEH melebihi 400 baris (`max-lines: 400`). Jika membesar, ekstrak menjadi sub-komponen terpisah di direktori terkait.
- Kedalaman *nesting* React JSX tidak boleh melebihi 6 level (`react/jsx-max-depth: 6`).
- Module crash isolation: Seluruh dynamic routes di public portal dan command center WAJIB di-wrap dengan `<ModuleGuard moduleId={slug}>` atau `<ErrorBoundary>`.
- Kepatuhan 33 Hukum Konstitusional (Security, Zero HUD, Dynamic Ports, Pure Math Engine, Memory Cleanup, Typography, Mandatory Demo Data, Mandatory View Manifest, Universal Matrix) wajib diuji via `node scripts/audit-rules.mjs`.

### Governance audit scope
- `node scripts/audit-rules.mjs` scans `.ts`, `.tsx`, `.js`, `.mjs`, `.cjs`, `.css`, `.scss`, and `.json` across the repository, including `apps/`, `packages/`, `scripts/`, and `.agents/`; only generated/dependency directories are excluded.
- Active application source may not reference `bg-cyber-*`, `text-cyber-*`, `border-cyber-*`, or other `cyber-*` aliases, custom polygon clips (`clip-*`, `card-clip`, `tag-clip`), custom glow utilities, or tactical military indicators.
- Both web and command-center root layouts must NOT force dark mode. Root `<body>` elements must include both `bg-background` and `text-foreground` so theme selection remains semantic and runtime-controlled.

## 4. Canonical Enterprise Design System (shadcn/ui & Tailwind CSS v4)

### 4.1 Design Philosophy
Theme: Restrained Enterprise Design System — clean, accessible, high-contrast, Vercel-style typography and surfaces built with native Tailwind CSS v4 and shadcn/ui primitives.

### 4.2 Semantic Theme Tokens (`packages/ui/src/styles/globals.css`)
- `bg-background` / `text-foreground`: Primary canvas and text
- `bg-card` / `text-card-foreground`: Elevated surface cards
- `bg-popover` / `text-popover-foreground`: Floating dropdowns and dialogs
- `bg-primary` / `text-primary-foreground`: Primary active states & buttons
- `bg-secondary` / `text-secondary-foreground`: Secondary actions & tags
- `bg-muted` / `text-muted-foreground`: Secondary metadata and captions
- `bg-accent` / `text-accent-foreground`: Interactive highlights
- `bg-destructive` / `text-destructive-foreground`: Destructive actions and alerts
- `bg-success/10` / `text-success`: Confirmation and success states
- `bg-warning/10` / `text-warning`: Pending and warning states
- `bg-info/10` / `text-info`: Informational callouts
- `border-border` / `border-input` / `ring-ring`: Standard outlines and focus rings

### 4.3 Typography Hierarchy
- `font-sans` (Geist): Body text, descriptions, cards, headings
- `font-mono` (JetBrains Mono): Telemetry, code, data labels, identifiers
- `font-arabic` (Amiri): Quranic and Arabic text (`.arabic-text`)
- Orbitron is strictly forbidden. Headings must use normal sentence/title case.

### 4.4 Surface & Component Standards
- Standard Tailwind border radius: `rounded-xl`, `rounded-lg`, `rounded-md`, `rounded-full`
- Standard Tailwind shadows: `shadow-sm`, `shadow-md`, `shadow-lg`
- Standard borders: `border border-border`

## 5. Arsitektur Data Fetching & Server-Driven Matrix Engine
- JANGAN menulis *mock array/object* secara langsung (*inline*) di dalam komponen UI jika endpoint atau typed API helpers tersedia.
- Gunakan `useModelSchema()` + `useModelRecords()` dan `<ModelWorkspace model="..." />` untuk seluruh 16 package addon model ERP (/matrix/[model]).
- Backend routing WAJIB menggunakan `defineRoute()` dari `@moon/server` untuk auto CORS, error boundary, dan query/body parsing.
<!-- END:moonwitness-core-rules -->
