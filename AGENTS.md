<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

<!-- BEGIN:moonwitness-core-rules -->
# MoonWitness OS — Architecture & Constitutional Guidelines (V9.5 — Apex Enterprise Matrix)

## 1. Dual-Portal Monorepo System
This project operates on an isolated dual-portal and backend engine architecture:
- `apps/web/`: Public Web Portal (Next.js 16, Port 3000) — Observatorium, Kitab Suci, Hadits, Seismix, Kalender Hijriyah, & Refleksi Global.
- `apps/command-center/`: Operations & Governance Console (Next.js 16, Port 3001) — Manajemen Hadits, Kitab, Pengguna, CAB RFC, BullMQ Worker Queue, Automations, & System Operations.
- `apps/api/`: Backend Service (Port 4000) — REST, RPC, Server-Sent Events (SSE), dan Background Cron/Queue Runner.

## 2. Master Workspace Packages (37 Projects Matrix & 16 Sovereign Addons)
- **16 Sovereign Addon Packages**: `@moon/base`, `@moon/witness`, `@moon/project`, `@moon/helpdesk`, `@moon/cab`, `@moon/crm`, `@moon/product`, `@moon/stock`, `@moon/account`, `@moon/mail`, `@moon/geo`, `@moon/khidra`, `@moon/mizan`, `@moon/shootgun`, `@moon/performance`, `@moon/cron`.
- `@workspace/ui`: Master UI Design System (Standard shadcn/ui & Tailwind v4), 3D Celestial Visualizers (`CelestialMoonSphere`, `CelestialQiblaCompass`, `CelestialEclipseSimulator`), Server-Driven Matrix Components (`CosmicModelWorkspace`, `CosmicDataTable`, `CosmicKanbanBoard`, `CosmicPivotGrid`, `CosmicFormModal`, `CosmicImportModal`, `CosmicFieldWidget`, `CosmicCopilotWidget`), Universal Report Printer (`report-printer.ts`), dan Web Audio Engine (`cosmicAudio`).
- `@workspace/types`: Master domain models, constants (`DEFAULT_COORDINATES`, `STORAGE_KEYS`, `APP_PORTS`), `ViewManifest` type matrix, dan master `NAVIGATION_MESH`.
- `@workspace/state`: Master Zustand stores, `MoonProvider`, dan cross-app reactive state.
- `@workspace/hooks`: Universal client hooks (`useResource`, `useModal`, `useModelSchema`, `useModelRecords`, `useComputedCelestial`, `useDebounce`, `useLocalStorage`, `useClipboard`, `useGeolocation`).
- `@workspace/error`: Fault tolerance layer, `ErrorBoundary`, `ModuleGuard`, dan global crash telemetry (`CrashReporter`).
- `@moon/protocol`: Single Source of Truth Zod API contracts & schema envelopes (`/api/witness/*`, `/auth/*`, `/api/cab/*`, `/api/mizan/*`).
- `@moon/compute`: Isomorphic pure computation engine (astronomy, moon phase, prayer times, sun position) — zero DB, zero network.
- `@moon/client`: Universal typed API client, `useAuthSession` (Cross-App SSO), `useCosmicTelemetry` (strongly-typed SSE topic listener), dan typed fetch helpers.
- `@moon/server`: Native HTTP/REST/RPC/SSE engine dengan declarative `defineRoute()` builder, rich schema introspection (`/api/meta/model/:name`), dan runtime schema validation.

## 3. Anti-Monolithic Constraints & The 33 Constitutional Laws
- File TIDAK BOLEH melebihi 400 baris (`max-lines: 400`). Jika membesar, ekstrak menjadi sub-komponen terpisah di direktori terkait.
- Kedalaman *nesting* React JSX tidak boleh melebihi 6 level (`react/jsx-max-depth: 6`).
- Module crash isolation: Seluruh dynamic routes di public portal dan command center WAJIB di-wrap dengan `<ModuleGuard moduleId={slug}>` atau `<ErrorBoundary>`.
- Kepatuhan 33 Hukum Konstitusional V9.5 (Security, Zero HUD, Dynamic Ports, Pure Math Engine, Memory Cleanup, Typography, Mandatory Demo Data, Mandatory View Manifest, Universal Matrix) wajib diuji via `node scripts/audit-rules.mjs`.

## 4. Standard shadcn/ui & Vercel Design Token System

### 4.1 Design Philosophy
Theme: "Enterprise-grade shadcn/ui Design Architecture" — clean, smooth, modern ergonomics with full light and dark mode support, utilizing subtle surface borders (`border-border/40`), standard cards (`bg-card/90`), and continuous rounded containers (`rounded-2xl`, `rounded-xl`, `rounded-lg`, `rounded-md`).

### 4.2 Semantic Color Tokens (Primary Palette)
**Standard Palette** — `packages/ui/src/styles/globals.css`:
- `bg-background` / `text-foreground`: Primary application canvas & body text
- `bg-card` / `text-card-foreground`: Elevated surface cards and dialog panels
- `bg-primary` / `text-primary-foreground`: Primary active states, buttons, and focal points
- `bg-secondary` / `text-secondary-foreground`: Subdued buttons and utility badges
- `text-muted-foreground` / `bg-muted`: Secondary descriptions and metadata
- `bg-destructive` / `text-destructive`: Critical alerts and destructive actions
- `border-border`: Standard subtle container borders

**Semantic Status Tokens**:
- Success: `text-emerald-500`, `bg-emerald-500/10`, `border-emerald-500/30`
- Warning: `text-amber-500`, `bg-amber-500/10`, `border-amber-500/30`
- Info: `text-sky-500`, `bg-sky-500/10`, `border-sky-500/30`
- Accent / AI: `text-purple-500`, `bg-purple-500/10`, `border-purple-500/30`

### 4.3 Smooth Geometric Container System
**Canonical Rounded Utilities**:
- `rounded-xl` (12px): Standard cards, panels, containers
- `rounded-2xl` (16px): Hero sections, large feature blocks
- `rounded-lg` (8px): Buttons, chips, interactive elements
- `rounded-md` (6px): Tags, badges, small labels
- `rounded-full`: Circular geometry for icons, avatars

### 4.4 Glassmorphism & Panel System
**Primary Glass Panel**:
- Background: `var(--card)` with `backdrop-blur-md`
- Border: `1px solid var(--border)`
- Shadow: `0 4px 20px -1px rgba(0, 0, 0, 0.08)` (Light) / `rgba(0, 0, 0, 0.5)` (Dark)

### 4.5 Typography System
**Font Stack Hierarchy**:
- `font-sans` (Geist): Body text, descriptions, content
- `font-mono` (JetBrains Mono): Data labels, code, system values
- `font-arabic` (Amiri): Arabic text (use `.arabic-text` class for RTL + proper spacing)

### 4.6 Component Naming Standards
- ✅ `ResourceTable`, `Panel`, `Modal`, `ContextBlock`, `Button`, `Badge`, `Tabs`
- ❌ `HUDTable`, `HUDPanel`, `HUDModal`, `CyberButton` (forbidden)

## 5. Arsitektur Data Fetching & Server-Driven Matrix Engine
- JANGAN menulis *mock array/object* secara langsung (*inline*) di dalam komponen UI jika endpoint atau typed API helpers tersedia.
- Gunakan `useModelSchema()` + `useModelRecords()` dan `<CosmicModelWorkspace model="..." />` untuk seluruh 16 package addon model ERP (/matrix/[model]).
- Backend routing WAJIB menggunakan `defineRoute()` dari `@moon/server` untuk auto CORS, error boundary, dan query/body parsing.
<!-- END:moonwitness-core-rules -->