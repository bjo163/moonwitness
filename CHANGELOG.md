# Changelog

## 0.3.1 - Production Hardening & Canonical Fastify Transport

- **Canonical Fastify 5 runtime**: `NativeServer` remains the public Moon contract while Fastify owns the production HTTP lifecycle internally; the handwritten production router and parameter matcher are retired.
- **Moon compatibility bridge**: existing raw Node handlers, `server.use()` middleware, `defineRoute()`, proxy routes, SSE, and generic REST surfaces run through one Fastify instance.
- **Explicit RPC registry**: `/rpc` no longer resolves caller-controlled class properties. Only registered procedures are callable, with per-procedure Zod input/output validation.
- **Request correlation**: Fastify request IDs are returned as `x-request-id`, bridged to Moon handlers, and included in transport logs.
- **Telemetry lifecycle**: OpenTelemetry NodeSDK auto-instrumentation is initialized at the canonical transport boundary and shut down with the server.
- **Fail-closed production CORS**: an unconfigured production origin is no longer reflected automatically.
- **Release governance docs**: release policy, roadmap, transport, observability, and deployment documentation are synchronized to the 0.3.1 production path.
- **Deployment certification preserved**: fresh PostgreSQL 18 install/verify, Witness graph certification, backup/restore smoke, API readiness, lint, typecheck, tests, and build remain release gates.

## 0.3.0 - Deep Space OS V3.0 & Dual-Portal Monorepo

- **Dual-Portal App Architecture**: Split frontend into `apps/web` (Public Cosmic Portal on `:3000`) and `apps/command-center` (Tactical Governance & Admin Terminal on `:3001`).
- **Universal Shared Engine (`@workspace/ui` & `@workspace/types`)**:
  - Centralized Cosmic HUD components: `Sidebar`, `Topbar`, `Navbar`, `Modal`, `Panel`, `ContextBlock`, and `CommandPalette` (`Cmd+K`).
  - Created GPU-accelerated 3D visualizers: `<CelestialMoonSphere />`, `<CelestialQiblaCompass />`, `<CelestialEclipseSimulator />`, and `<SeismicTectonicRadar />`.
  - Created `<QuranRootMatrix />` for Triliteral Arabic morphology concordance.
  - Implemented procedural Web Audio synthesizer (`cosmicAudio`) with `<CosmicAudioToggle />`.
  - Centralized domain models, `DEFAULT_COORDINATES`, `STORAGE_KEYS`, and master `NAVIGATION_MESH` in `@workspace/types`.
- **Universal Client & Cross-App SSO (`@moon/client`)**:
  - Implemented cross-port Single Sign-On session manager (`useAuthSession`) with `mw_session` cookie & event broadcast.
  - Implemented resilient Server-Sent Events stream hook (`useRealtimeStream`) with exponential backoff reconnect.
  - Connected Command Center Hadiths, Scriptures, and Users views to typed API client.
- **Next.js 16 App Router & SEO Master Engine**:
  - Migrated legacy `@modules/` views into co-located native App Router pages with dynamic OpenGraph & Twitter cards.
- **Developer Experience**: Added `pnpm dev` for one-click multi-app execution.

## 0.2.0 - Production Core

- Hardened JWT/session, CORS, REST, ORM authorization, and bootstrap security.
- Replaced browser-readable bearer persistence with HttpOnly BFF sessions.
- Added migration integrity checks, advisory locking, and explicit install/seed/verify commands.
- Established the provenance-first Witness graph and deterministic engine foundations.

## 0.1.0 - Foundation

- Established Moon ORM, Moon Server, base addon, and canonical seed foundations.
