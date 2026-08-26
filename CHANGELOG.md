# Changelog

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
- **Developer Experience**: Added `pnpm dev` / `pnpm dev:all` for one-click multi-app execution.

## 0.2.0 - Production Core

- Hardened JWT/session, CORS, REST, ORM authorization, and bootstrap security.
- Replaced browser-readable bearer persistence with HttpOnly BFF sessions.
- Added migration integrity checks, advisory locking, and explicit install/seed/verify commands.
- Established the provenance-first Witness graph and deterministic engine foundations.

## 0.1.0 - Foundation

- Established Moon ORM, Moon Server, base addon, and canonical seed foundations.