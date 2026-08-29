# ◈ MOONWITNESS — DESIGN & ARCHITECTURE BIBLE V9.5

```
╔══════════════════════════════════════════════════════════════╗
║  CLASSIFICATION: INTERNAL — DESIGN AUTHORITY DOCUMENT       ║
║  CODENAME:       DEEP SPACE SCI-FI DIVINE OPERATING SYSTEM  ║
║  SYSTEM:         MoonWitness Operating System V9.5          ║
║  STATUS:         ████════════════════════════════ ACTIVE     ║
╚══════════════════════════════════════════════════════════════╝
```

> **This is not documentation. This is constitutional law.**
> Every pixel, 3D simulation, vector frame, color, and word in MoonWitness must conform to this document.
> Deviation without Design Review = system corruption. Never create flat web layouts or rely entirely on static AI images.

---

## 01 — IDENTITY & SCI-FI GLASSMORPHISM

MoonWitness is a **Deep Space Sci-Fi Divine Observation Terminal** — an advanced cosmic operating system for Quranic knowledge, celestial telemetry, and global peace intelligence.

**It is NOT a website. It is NOT an app. It is an immersive cinematic Operating System.**

```
VISUAL DNA & 5-LAYER ASSET ARCHITECTURE:
├── Layer 1: Deep Space Atmosphere ─ indigo/navy nebula glows, star grids, optical scanlines
├── Layer 2: 3D Celestial Sim ────── photorealistic moon spheres, earth horizons, solar coronas
├── Layer 3: Chamfered Glass Panel ─ tactical translucent glass (bg-black/80 backdrop-blur-md) with cut corners
├── Layer 4: Quantum Pipelines ───── optical laser data links (──►), sequential integration decks
└── Layer 5: Apple-Grade Typography ─ pristine monospace telemetry, high-contrast command badges
```

### Brand Voice

| Attribute | Description |
|-----------|-------------|
| **Serious** | NASA Mission Control — not entertainment media |
| **Sacred** | Honoring the source of its knowledge |
| **Precise** | Every element has a reason to exist |
| **Immersive** | The operator is inside the system, not browsing it |
| **Alive** | The UI breathes, pulses, scans — it's never static |

### Forbidden Archetypes

❌ Retro Hacker/Gamer Terminal (no `>_`, no `//`, no blinding neon) · ❌ Generic SaaS dashboard · ❌ Generic Islamic app · ❌ E-commerce

---

## 02 — MODULE ARCHITECTURE

```
◈ MOONWITNESS OS V9.0
│
├── 🟢 MISSION ─── Divine Unity Command
│   M-01 Toolkit Rasulullah    M-02 Prophetic Diplomacy
│   M-03 Global Human Unity    M-04 Civilization Covenant
│   M-05 Ambassador Certificate M-06 Scholar Sanad Tree
│
├── 🔵 SCRIPTURE ─── Divine Database
│   S-01 Holy Qur'an Digital   S-02 Hadith Compendiums
│   S-03 Scriptures Matrix     S-04 Tauhid Principles
│   S-05 Asmaul Husna          S-06 Root Concordance
│   S-07 Scripture Comparison   S-08 Daily Dua   S-09 Tasbih
│
├── 🟡 OBSERVATORY ─── Celestial Telemetry
│   O-01 Lunar Calendar        O-02 Eclipse Chronometer
│   O-03 Qibla AR Scope        O-04 Sirah Map
│   O-05 Civilization Timeline O-06 Science Miracles
│   O-07 Nafs Psychology
│
├── 🟣 ANALYTICS ─── Intelligence Systems
│   A-01 Global Monitoring     A-02 Trend Analyzer (Tabayyun)
│   A-03 Zakat Calculator      A-04 Inspiration Archive
│
├── ⚙️ CONSOLE ─── System Operations (Command Center)
│   Dashboard · Analytics · Hadith DB · Scripture Mgr · Users · CAB RFC
│
└── 🤖 AI MODULE ─── Prophetic Intelligence
    Prophetic AI · Wisdom Diagnostic · Quran Semantic Search
```

**Rules:** Every module has a unique code. Every module belongs to exactly ONE family. The ERP Command Center is operator-only.

---

## 03 — COLOR SYSTEM

### Primary Semantic Palette

| Token | Hex | Meaning | Family |
|-------|-----|---------|--------|
| `--cyber-cyan` | `#00F0FF` | System / Active / Default | Scripture |
| `--cyber-green` | `#00FF66` | Online / Success / Mission | Mission |
| `--cyber-yellow` | `#FFE600` | Celestial / Warning | Observatory |
| `--cyber-purple` | `#A100FF` | Knowledge / AI | Analytics |
| `--cyber-pink` | `#FF0055` | Critical / Danger / Alert | Errors |
| `--cyber-dark` | `#05070A` | Void Background | — |
| `--cyber-panel` | `#0A0F17` | Panel Surface | — |

### Extended Palette

| Hex | Usage |
|-----|-------|
| `#030508` | Deepest void (body) |
| `#070C14` | Panel variant / modal body |
| `#8B9BB0` | Steel gray — muted/inactive text |
| `#F5F5F5` | Primary content text |
| `#d477ff` | Analytics light variant |
| `rgba(0,240,255,0.25)` | Default panel border |

### Color Laws

```
01. Each family = ONE accent color. Never mix.
02. Opacity = hierarchy: 100% active → 60% border → 30% subtle → 12% fill → 5% hover
03. Glow = importance: 60px critical → 30px active → 20px hover → 10px passive
04. Gray (#8B9BB0) = metadata/inactive only. Never for primary content.
05. White (#F5F5F5) = text only. Never pure #FFFFFF as background.
06. Pink (#FF0055) = CRITICAL STATES ONLY. Never decorative.
```

---

## 04 — TYPOGRAPHY

### Font Stack

| Role | Font | Usage |
|------|------|-------|
| **Display / Titles** | Orbitron | Module IDs, version badges, hero titles |
| **Terminal / Body** | JetBrains Mono | All body text, labels, code, status |
| **UI / Sans** | Geist | Descriptions, paragraphs |
| **Arabic** | Amiri | All Quranic/Arabic text (`.arabic-text`) |

### Scale

| Level | Size | Weight | Example |
|-------|------|--------|---------|
| Display XL | `text-7xl` | 900 | Hero H1 |
| Display L | `text-5xl–6xl` | 900 | Section hero |
| Heading | `text-2xl` | 900 | Zone headers (H2) |
| Panel Title | `text-base–xl` | 900 | Panel headers (H3) |
| Card Title | `text-sm` | 700 | Card titles |
| Body | `text-xs` | 400 | Descriptions |
| Caption | `text-[10px]` | 400 | Metadata |
| Micro | `text-[8px–9px]` | 700 | Status bars, badges |

### Type Laws

```
01. ALL headings = UPPERCASE. No exceptions.
02. Section titles use clean wide-spaced sans-serif. NEVER use `//` or `>` hacker prefixes.
03. Hero text = Orbitron. Everything else = JetBrains Mono or Geist.
04. Arabic text MUST use .arabic-text class. Never Latin fonts.
05. Max line length = 65ch. Use max-w-xl or max-w-2xl.
06. Status/badge text = tracking-widest (terminal aesthetic).
```

---

## 05 — DUAL-PORTAL MONOREPO ARCHITECTURE

MoonWitness OS operates as a high-performance Turborepo monorepo with isolated dual Next.js 16 portals and a standalone backend runtime:

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                       MOONWITNESS DUAL-PORTAL SYSTEM                        │
│   ┌──────────────────────────────────┐   ┌──────────────────────────────┐   │
│   │   Web Portal (Port 3000)         │   │ Command Center (Port 3001)   │   │
│   │   Next.js 16 · Cosmic Dashboard  │   │ Next.js 16 · Tactical Gov    │   │
│   └─────────────────┬────────────────┘   └──────────────┬───────────────┘   │
└─────────────────────┼───────────────────────────────────┼───────────────────┘
                      │                                   │
                      ▼                                   ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│          SHARED PACKAGES (@workspace/ui, @workspace/hooks, @workspace/state) │
│    • Universal Command Palette (Cmd+K)    • 3D Celestial Visualizers        │
│    • ResourceTable & ContextBlock         • Procedural Web Audio Synth      │
│    • useResource & useModal               • ErrorBoundary & ModuleGuard     │
└─────────────────────────────────────┬───────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│         UNIVERSAL PROTOCOL & CLIENT LAYER (@moon/protocol, @moon/client)    │
│    • Zod API Contracts & Envelopes        • Cross-App SSO (useAuthSession)  │
│    • Strongly-Typed SSE Telemetry         • Zero-Network Pure Math Compute  │
└─────────────────────────────────────┬───────────────────────────────────────┘
                                      │ HTTP / SSE / RPC
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                    MOON SERVER & BACKEND RUNTIME (Port 4000)                │
│        apps/api · @moon/server · defineRoute() Declarative Schemas          │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 06 — ENTERPRISE COMPONENT LIBRARY

> All reusable UI components live in `@workspace/ui` (`packages/ui/src/components/`). Never create ad-hoc duplicates.

### Component Inventory

| # | Component | Canonical File | Purpose | Key Props |
|---|-----------|----------------|---------|-----------|
| 1 | **Modal** | `modal.tsx` | Dialog overlay | `isOpen`, `onClose`, `title`, `icon`, `maxWidth`, `borderColor` |
| 2 | **Panel** | `panel.tsx` | Container box (5 levels) | `level`, `accentColor`, `children` |
| 3 | **PanelHeader** | `panel.tsx` | Panel header bar | `title`, `icon`, `status`, `accentColor`, `subtitle` |
| 4 | **Button** | `button.tsx` | Tactical CTA button | `variant`, `href`, `accentColor`, `onClick` |
| 5 | **ContextBlock** | `context-block.tsx` | Page H1 header | `title`, `subtitle`, `operation`, `status`, `accentColor` |
| 6 | **Breadcrumb** | `breadcrumb.tsx` | Navigation trail | `paths[]` |
| 7 | **ResourceTable** | `resource-table.tsx` | Generic data grid | `data`, `columns`, `searchKeys`, `accentColor`, `onEdit`, `onDelete` |
| 8 | **SimpleTable** | `table.tsx` | Data table | `headers[]`, `rows[][]` |
| 9 | **MetricChart** | `chart.tsx` | CSS metric bars | `data[]`, `title`, `subtitle`, `accentColor`, `height` |
| 10 | **Tabs** | `tabs.tsx` | Section navigation | `activeTab`, `onChange`, `tabs[]`, `accentColor` |
| 11 | **Progress** | `progress.tsx` | Sync progress bar | `value`, `max`, `label`, `status`, `accentColor` |
| 12 | **Tooltip** | `tooltip.tsx` | Hover info | `text`, `position`, `children` |
| 13 | **Sidebar** | `sidebar.tsx` | Tactical sidebar nav | `items[]`, `activeId`, `onSelect` |
| 14 | **AIPanel** | `chat/ai-console.tsx` | AI interaction panel | `agentName`, `isTyping`, `message` (JSX) |
| 15 | **LoadingState** | `states.tsx` | Pulse sync loader | `message`, `accentColor` |
| 16 | **ErrorState** | `states.tsx` | Fault-tolerance alert | `title`, `message`, `onRetry` |
| 17 | **EmptyState** | `empty.tsx` | No data indicator | `title`, `description`, `icon` |
| 18 | **ErrorBoundary** | `@workspace/error` | React crash isolation | `moduleId`, `fallback`, `onError` |
| 19 | **ModuleGuard** | `@workspace/error` | Dynamic module guard | `moduleId`, `children`, `fallback` |
| 20 | **CelestialMoonSphere** | `celestial-moon-sphere.tsx` | 3D Moon simulation | `phase`, `size`, `interactive` |
| 21 | **CelestialQiblaCompass** | `celestial-qibla-compass.tsx` | Realtime Qibla azimuth | `size`, `interactive` |
| 22 | **CelestialEclipseSimulator**| `celestial-eclipse-simulator.tsx` | Solar corona scrubber | `size` |
| 23 | **CosmicModelWorkspace** | `matrix/cosmic-model-workspace.tsx` | Server-driven UI matrix | `model` |
| 24 | **CosmicDataTable** | `matrix/cosmic-data-table.tsx` | Auto-column sortable grid | `schema`, `records`, `onRowClick` |
| 25 | **CosmicKanbanBoard** | `matrix/cosmic-kanban-board.tsx` | Stage pipeline kanban | `schema`, `records`, `onCardClick` |
| 26 | **CosmicFormModal** | `matrix/cosmic-form-modal.tsx` | Auto-widget form & chatter | `isOpen`, `schema`, `initialRecord` |
| 27 | **CosmicFieldWidget** | `matrix/cosmic-field-widget.tsx` | Universal widget mapper | `field`, `value`, `onChange` |

---

## 07 — UNIVERSAL DATA HOOKS

> Standard business logic and data-fetching hooks live in `@workspace/hooks`.

| Hook | Purpose | Usage |
|------|---------|-------|
| **`useResource<T>()`** | Reactive data fetching with auto-cache & mutation | `const { data, loading, mutate } = useResource(fetchFn, { storageKey })` |
| **`useModal<T>()`** | Standard modal controller | `const modal = useModal<Item>()` (`isOpen`, `open()`, `close()`) |
| **`useModelSchema()`** | Introspect rich model schema & view manifest | `const { schema, loading } = useModelSchema("pj.task")` |
| **`useModelRecords()`** | Universal CRUD data hook for matrix models | `const { records, createRecord, updateRecord, deleteRecord } = useModelRecords("pj.task")` |
| **`useComputedCelestial()`** | Pure isomorphic astronomical math | `const { moonPhase, qiblaAngle, prayerTimes } = useComputedCelestial(coords)` |
| **`useDebounce<T>()`** | Debounce search input values | `const debouncedQuery = useDebounce(query, 300)` |
| **`useLocalStorage<T>()`** | Persistent localStorage synchronization | `const [val, setVal] = useLocalStorage(key, defaultVal)` |
| **`useCosmicTelemetry<K>()`** | Strongly-typed SSE topic listener (`@moon/client`) | `const { payload, isConnected } = useCosmicTelemetry("system_metric")` |

---

## 08 — MOTION & ACOUSTICS DESIGN

### Animation Inventory

| Animation | Duration | Purpose |
|-----------|----------|---------|
| `holoScan` | 4s linear ∞ | Vertical scan line — panel activity |
| `starTwinkle` | 8s ease ∞ | Star opacity — cosmic ambience |
| `cosmicDrift` | 25s linear ∞ | Background depth drift |
| `breathingCyan` | 3s ease ∞ | Box-shadow pulse — system alive |
| `radarPulse` | 3s cubic ∞ | Scale + opacity — observatory |
| `spectrumPulse` | 1s ease alt | Audio visualizer height |

### Procedural Web Audio Engine

- **`cosmicAudio`**: Web Audio API oscillator synthesis generating tactical clicks, confirm pings, alert tones, and 528Hz Solfeggio resonant harmonics.
- **Zero MP3 / WAV file dependencies**: 0ms latency, 0 network bandwidth.

---

## 09 — SMOOTH SHADCN/UI GEOMETRY & CONTAINERS

```css
.clip-card  → 12px smooth rounded corners (rounded-xl)
.clip-hero  → 16px smooth rounded corners (rounded-2xl)
.clip-btn   → 8px smooth rounded corners (rounded-lg)
.clip-tag   → 6px smooth rounded corners (rounded-md)
.clip-rune  → circular geometry (rounded-full)
```

Corner accent indicators match the semantic state family:
```css
.military-box    → rounded-xl container
.corner-cyan     → cyan accent border
.corner-green    → green accent border
.corner-yellow   → yellow accent border
.corner-pink     → pink accent border
.corner-purple   → purple accent border
```

---

## 10 — WRITING & TERMINOLOGY GUIDE

| ❌ NEVER | ✅ ALWAYS |
|----------|---------|
| Website | Operating System |
| Page | Module / Window |
| Click here | Launch / Execute |
| User | Operator |
| Settings | System Configuration |
| Loading... | SYNCHRONIZING... |
| Error | SIGNAL LOST / SYSTEM FAULT |
| Success | OPERATION COMPLETE |
| Search | QUERY DATABASE |
| Logout | TERMINATE SESSION |

---

## 11 — CONSTITUTIONAL CODE DISCIPLINE (THE 30 SUPREME LAWS)

> **The codebase IS the product. Dirty code = corrupted system.**

```
╔══════════════════════════════════════════════════════════════════════════╗
║              ◈ THE 30 SUPREME CONSTITUTIONAL LAWS (V9.0) ◈               ║
╠══════════════════════════════════════════════════════════════════════════╣
║                                                                          ║
║  PILLAR I: VISUAL DNA & DESIGN TOKENS                                    ║
║  01. Zero-Drift Cyber Palette (--cyber-* semantic tokens)                ║
║  02. Sacred Geometric Chamfers (.clip-card, .clip-hero, .clip-btn)       ║
║  03. Apple & NASA Typography (Orbitron, JetBrains Mono, Amiri Arabic)    ║
║  04. Unified Glassmorphism & Optical Glows                               ║
║  05. Procedural Web Audio Synthesis (0 MP3/WAV file dependencies)        ║
║                                                                          ║
║  PILLAR II: MONOREPO TOPOLOGY & BOUNDARIES                               ║
║  06. Ghost File & Directory Ban (@core, @modules, hud-* on disk)         ║
║  07. Enterprise Component Naming (ResourceTable, Panel, BreadcrumbTrail) ║
║  08. Layered Dependency Flow (types ➔ ui ➔ hooks ➔ state ➔ client ➔ app)║
║  09. Dynamic Port & Environment URLs (APP_PORTS resolution)             ║
║  10. Strict File Size Limit (max 400 lines per file)                     ║
║                                                                          ║
║  PILLAR III: REACT 19 & NEXT.JS 16 CONVENTIONS                           ║
║  11. "use client" Line 1 Strict Placement                                ║
║  12. React JSX Nesting Depth Cap (max 6 levels)                          ║
║  13. Single Semantic H1 Landmark (<ContextBlock />)                      ║
║  14. Fault-Tolerance & Module Isolation (<ModuleGuard>, <ErrorBoundary>) ║
║                                                                          ║
║  PILLAR IV: PURE ISOMORPHIC COMPUTE & TELEMETRY                          ║
║  15. Zero-Network Pure Math Engine (@moon/compute)                       ║
║  16. Declarative Backend Routing via defineRoute()                       ║
║  17. Strongly-Typed SSE Telemetry Streams (useCosmicTelemetry)           ║
║  18. Declarative Data Fetching via useResource (Zero inline mocks)       ║
║                                                                          ║
║  PILLAR V: SECURITY & DEFENSE-IN-DEPTH                                   ║
║  19. Zero Plaintext Secrets / API Keys in Code (sk-..., ghp_...)         ║
║  20. Safe External Navigation (rel="noopener noreferrer" on _blank)     ║
║  21. Sanitized HTML Rendering (No raw dangerouslySetInnerHTML)           ║
║  22. Cryptographic Session Hardening (HttpOnly, SameSite=Strict)         ║
║                                                                          ║
║  PILLAR VI: MEMORY SAFETY & PERFORMANCE                                  ║
║  23. Zero Memory Leak (Timer/Listener Cleanup in useEffect)              ║
║  24. Universal Persistent Storage Hook (useLocalStorage<T>)              ║
║  25. Zero Uncleaned Debug Statements (No console.log in production)      ║
║  26. Image Accessibility (alt text & responsive dimensions)              ║
║                                                                          ║
║  PILLAR VII: SACRED KNOWLEDGE INTEGRITY & TERMINOLOGY                    ║
║  27. Pristine Quranic Text Preservation (Uthmani orthography)            ║
║  28. Canonical Index Range Integrity (Surah 1-114, Asmaul Husna 1-99)    ║
║  29. Arabic Script Typography & RTL (.arabic-text encapsulation)         ║
║  30. Cosmic Terminology Discipline (Operating System, Module, Operator)  ║
║                                                                          ║
║  PILLAR VIII: SERVER-DRIVEN UI & MODEL MATRIX INTEGRITY                  ║
║  31. Mandatory Demo Data Contract (src/demo-data.ts per addon package)   ║
║  32. Mandatory View Manifest Contract (src/views.ts per addon package)   ║
║  33. Zero-Boilerplate Universal Matrix (<CosmicModelWorkspace />)        ║
║                                                                          ║
╚══════════════════════════════════════════════════════════════════════════╝
```

---

## 12 — MASTER WORKSPACE PACKAGES MATRIX (34 PACKAGES)

```
moonwitness/
├── apps/
│   ├── web/                  # Cosmic Dashboard Next.js 16 frontend (:3000)
│   ├── command-center/       # Tactical Governance & Administrative Console (:3001)
│   ├── api/                  # MoonWitness backend service (:4000)
│   └── rocksoul/             # Companion web experimental runtime
├── packages/
│   ├── ui/                   # @workspace/ui (Master Cosmic Design System & 3D Visualizer Kit)
│   ├── types/                # @workspace/types (Domain types, constants, NAVIGATION_MESH)
│   ├── state/                # @workspace/state (Zustand Master Store & MoonProvider)
│   ├── hooks/                # @workspace/hooks (useResource, useModal, useComputedCelestial)
│   ├── error/                # @workspace/error (ErrorBoundary, ModuleGuard, CrashReporter)
│   ├── moon-protocol/        # @moon/protocol (Single Source of Truth Zod API & SSE Contracts)
│   ├── moon-compute/         # @moon/compute (Pure Isomorphic Astronomical Math Engine)
│   ├── moon-client/          # @moon/client (Isomorphic API client, SSO, SSE telemetry hook)
│   ├── moon-server/          # @moon/server (Transport runtime, defineRoute declarative schemas)
│   ├── moon-orm/             # @moon/orm (Vertex-based ORM with pgvector & RLS)
│   ├── moon-witness/         # @moon/witness (Canonical knowledge graph, revelation engine)
│   ├── moon-base/            # @moon/base (Core models: auth, users, groups, rules)
│   ├── moon-mizan/           # @moon/mizan (Balance & ethical assessment engine)
│   ├── moon-khidra/          # @moon/khidra (Autonomous workflows & wisdom processing)
│   ├── moon-cab/             # @moon/cab (Civilizational analytics & RFC records)
│   ├── moon-geo/             # @moon/geo (Geospatial datasets)
│   ├── moon-cache/           # @moon/cache (High-speed memory/Redis cache layer)
│   ├── moon-mail/            # @moon/mail (Transactional email services)
│   ├── moon-product/         # @moon/product (Product management & resource catalogues)
│   ├── moon-stock/           # @moon/stock (Inventory tracking & distribution)
│   ├── moon-account/         # @moon/account (Accounting & ledger management)
│   ├── moon-time/            # @moon/time (Timekeeping & lunar calendars)
│   ├── moon-testing/         # @moon/testing (Test fixtures & protocol contract suites)
│   ├── moon-performance/     # @moon/performance (Benchmarking & telemetry)
│   ├── auto-avatar/          # @workspace/auto-avatar (Procedural geometric avatar generator)
│   ├── i18n/                 # @workspace/i18n (Cosmic multilingual dictionary)
│   ├── eslint-config/        # Shared ESLint configuration
│   └── typescript-config/    # Shared TypeScript compiler options
```

---

```
◈ MOONWITNESS OS V9.0 — DIVINE OBSERVATION TERMINAL ◈
Document Status: ACTIVE — V9.0 (Enterprise Standard Edition)
Source: @workspace/ui · @workspace/hooks · @workspace/error · @moon/protocol · @moon/compute
All architectural decisions must conform to this Bible.
END TRANSMISSION.
```
