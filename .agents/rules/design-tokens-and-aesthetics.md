# ◈ THE 30 SUPREME CONSTITUTIONAL LAWS OF MOONWITNESS OS (V9.0)

```
╔══════════════════════════════════════════════════════════════╗
║  CLASSIFICATION: INTERNAL — SUPREME CONSTITUTIONAL AUTHORITY ║
║  CODENAME:       DEEP SPACE SCI-FI DIVINE OPERATING SYSTEM   ║
║  STATUS:         ████████████████████████████████ ACTIVE     ║
║  MATRIX:         7 MASTER PILLARS — 30 CONSTITUTIONAL LAWS   ║
╚══════════════════════════════════════════════════════════════╝
```

---

## 🏛️ PILLAR I: VISUAL DNA & SCI-FI DESIGN TOKENS
- **LAW 01 — Zero-Drift Cyber Palette**: Colors must strictly match `--cyber-*` tokens (`#00F0FF`, `#00FF66`, `#FFE600`, `#A100FF`, `#FF0055`, `#05070A`, `#0A0F17`). Zero raw inline hex styles.
- **LAW 02 — Sacred Geometric Chamfers**: Tactical buttons and cards must use canonical clip paths (`.clip-card`, `.clip-hero`, `.clip-btn`, `.clip-tag`, `.clip-rune`).
- **LAW 03 — Apple & NASA Sub-Pixel Typography**: Monospace for telemetry/labels (`tracking-widest`), Orbitron for hero displays, Amiri for Arabic (`.arabic-text`), Geist for body. All headings in UPPERCASE.
- **LAW 04 — Unified Glassmorphism & Optical Glows**: Multi-layered backdrop blurs (`backdrop-blur-md`, `panel-glass`) with semantic glow depths (60px critical, 30px active, 15px passive).
- **LAW 05 — Procedural Web Audio Synthesis**: Zero MP3/WAV static file dependencies; UI audio feedback generated exclusively via Web Audio API oscillator synthesis (`cosmicAudio`).

---

## 🏛️ PILLAR II: MONOREPO TOPOLOGY & BOUNDARIES
- **LAW 06 — Ghost File & Directory Ban**: Zero legacy `@core/`, `@modules/`, `hud/` directories or `HUD_*` file prefixes on disk.
- **LAW 07 — Enterprise Standard Component Naming**: Canonical component names only (`ResourceTable`, `Panel`, `Modal`, `BreadcrumbTrail`, `Button`, `ContextBlock`, `ErrorBoundary`, `useModal`).
- **LAW 08 — Layered Dependency Flow**: `@workspace/types` ➔ `@workspace/ui` ➔ `@workspace/hooks` ➔ `@workspace/state` ➔ `@moon/client` ➔ `@moon/server` ➔ `apps/*`. No circular or upward imports.
- **LAW 09 — Dynamic Port & Environment URLs**: Zero hardcoded `localhost:3000/3001/4000` URLs. Always use `APP_PORTS` and dynamic `process.env` configuration.
- **LAW 10 — Anti-Monolithic 400-Line Limit**: Strict 400 lines limit per file (`max-lines: 400`). Larger views must be split into modular subcomponents.

---

## 🏛️ PILLAR III: REACT 19 & NEXT.JS 16 CONVENTIONS
- **LAW 11 — `"use client"` Line 1 Strict Placement**: Interactive client components must place `"use client"` at line 1 without leading whitespace or comments.
- **LAW 12 — React JSX Nesting Depth Limit**: Maximum JSX nesting is 6 levels (`react/jsx-max-depth: 6`).
- **LAW 13 — Single Semantic H1 Landmark**: Exactly one `<h1>` per view, encapsulated within `<ContextBlock />`.
- **LAW 14 — Fault-Tolerance & Module Isolation**: Dynamic views must be wrapped with `<ModuleGuard>` or `<ErrorBoundary>`.

---

## 🏛️ PILLAR IV: PURE ISOMORPHIC COMPUTE & TELEMETRY
- **LAW 15 — Zero-Network Pure Math Engine**: Astronomical and lunar calculations must run exclusively in `@moon/compute` (zero DB, zero network).
- **LAW 16 — Declarative Routing via `defineRoute()`**: Backend handlers must use declarative Zod schema validation envelopes.
- **LAW 17 — Strongly-Typed SSE Telemetry Streams**: Real-time events must use strongly-typed Server-Sent Events topic listeners (`useCosmicTelemetry`).
- **LAW 18 — Declarative Data Fetching (`useResource`)**: Zero inline mockup arrays in production views when backend endpoints exist.

---

## 🏛️ PILLAR V: SECURITY & DEFENSE-IN-DEPTH
- **LAW 19 — Zero Plaintext Secrets / API Keys**: Automated scanner ensures zero hardcoded API keys (`sk-...`, `ghp_...`) or raw tokens in source files.
- **LAW 20 — Safe External Navigation**: All `<a target="_blank">` tags must specify `rel="noopener noreferrer"`.
- **LAW 21 — Sanitized HTML Rendering**: Zero raw `dangerouslySetInnerHTML` without proper HTML sanitization.
- **LAW 22 — Cryptographic Session Hardening**: Cross-app SSO tokens must use `HttpOnly`, `SameSite=Strict`, `Secure` cookies.

---

## 🏛️ PILLAR VI: MEMORY SAFETY & PERFORMANCE
- **LAW 23 — Zero Memory Leak (Cleanup Function)**: Every `useEffect` with timers or event listeners must provide a corresponding cleanup return function.
- **LAW 24 — Universal Persistent Storage Hook**: Use `useLocalStorage<T>()` from `@workspace/hooks` instead of direct `localStorage.getItem/setItem`.
- **LAW 25 — Zero Uncleaned Debug Statements**: Zero `console.log`, `console.debug`, or `debugger` in production components.
- **LAW 26 — Image Optimization & Accessibility**: All `<img>` tags must include meaningful `alt` text and responsive dimensions.

---

## 🏛️ PILLAR VII: SACRED KNOWLEDGE INTEGRITY & TERMINOLOGY
- **LAW 27 — Pristine Quranic Text Preservation**: Uthmani orthography and diacritics must never be altered or stripped.
- **LAW 28 — Canonical Index Range Integrity**: Surah [1..114], Ayahs [1..6236], Asmaul Husna [1..99] must respect canonical bounds.
- **LAW 29 — Arabic Script Typography & RTL**: All Arabic texts must use `.arabic-text` and explicit right-to-left layout.
- **LAW 30 — Cosmic Terminology Discipline**: Always use OS terminology: Operating System, Module, Operator, System Configuration, Synchronizing. Never "website", "page", "user".
