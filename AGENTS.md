<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

<!-- BEGIN:moonwitness-core-rules -->
# MoonWitness OS — Architecture & Constitutional Guidelines (V9.5 — Apex Enterprise Matrix)

## 1. Dual-Portal Monorepo System
This project operates on an isolated dual-portal and backend engine architecture:
- `apps/web/`: Public Cosmic Portal (Next.js 16, Port 3000) — Observatorium, Kitab Suci, Hadits, Seismix, Kalender Hijriyah, & Refleksi Global.
- `apps/command-center/`: Tactical Governance Terminal (Next.js 16, Port 3001) — Manajemen Hadits, Kitab, Pengguna, CAB RFC, BullMQ Worker Queue, Automations, & System Operations.
- `apps/api/`: Backend Service (Port 4000) — REST, RPC, Server-Sent Events (SSE), dan Background Cron/Queue Runner.

## 2. Master Workspace Packages (37 Projects Matrix & 16 Sovereign Addons)
- **16 Sovereign Addon Packages**: `@moon/base`, `@moon/witness`, `@moon/project`, `@moon/helpdesk`, `@moon/cab`, `@moon/crm`, `@moon/product`, `@moon/stock`, `@moon/account`, `@moon/mail`, `@moon/geo`, `@moon/khidra`, `@moon/mizan`, `@moon/shootgun`, `@moon/performance`, `@moon/cron`.
- `@workspace/ui`: Master Cosmic Design System, 3D Celestial Visualizers (`CelestialMoonSphere`, `CelestialQiblaCompass`, `CelestialEclipseSimulator`), Server-Driven Matrix Components (`CosmicModelWorkspace`, `CosmicDataTable`, `CosmicKanbanBoard`, `CosmicPivotGrid`, `CosmicFormModal`, `CosmicImportModal`, `CosmicFieldWidget`, `CosmicCopilotWidget`), Universal Report Printer (`report-printer.ts`), dan Procedural Web Audio Synth (`cosmicAudio`).
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

## 4. Estetika UI/UX (Deep Space Sci-Fi Divine Operating System)
- Tema: "Deep Space Sci-Fi Divine Operating System" — modern, futuristik, dengan *glassmorphism* (`backdrop-blur`), *glow effect* (`--cyber-*` tokens), dan sudut chamfered military box.
- Gunakan token warna semantik (`--cyber-cyan`, `--cyber-green`, `--cyber-yellow`, `--cyber-purple`, `--cyber-pink`).
- Standard Naming: Gunakan nama enterprise bersih (`ResourceTable`, `Panel`, `Modal`, `ContextBlock`, `Button`). Jangan gunakan prefix legacy `HUD*`.

## 5. Arsitektur Data Fetching & Server-Driven Matrix Engine
- JANGAN menulis *mock array/object* secara langsung (*inline*) di dalam komponen UI jika endpoint atau typed API helpers tersedia.
- Gunakan `useModelSchema()` + `useModelRecords()` dan `<CosmicModelWorkspace model="..." />` untuk seluruh 16 package addon model ERP (/matrix/[model]).
- Backend routing WAJIB menggunakan `defineRoute()` dari `@moon/server` untuk auto CORS, error boundary, dan query/body parsing.
<!-- END:moonwitness-core-rules -->