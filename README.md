# ◈ MOONWITNESS OS V3.0

> **Deep Space Sci-Fi Divine Operating System & Knowledge Platform**  
> An enterprise-grade, high-performance monorepo platform uniting Quranic knowledge, celestial telemetry, and relational domain intelligence.

---

## 🏛️ System Architecture

MoonWitness follows a strict **Model-First & Modular HUD** architecture designed for performance, determinism, and high auditability:

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                       MOONWITNESS DUAL-PORTAL SYSTEM                        │
│   ┌──────────────────────────────────┐   ┌──────────────────────────────┐   │
│   │   Web Portal (Port 3000)         │   │ Command Center (Port 3001)   │   │
│   │   Next.js 16 · Cosmic HUD        │   │ Next.js 16 · Tactical Gov    │   │
│   └─────────────────┬────────────────┘   └──────────────┬───────────────┘   │
└─────────────────────┼───────────────────────────────────┼───────────────────┘
                      │                                   │
                      ▼                                   ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                SHARED WORKSPACE ENGINE (@workspace/ui & @workspace/types)    │
│    • Universal Command Palette (Cmd+K)    • 3D Celestial Visualizers        │
│    • Master NAVIGATION_MESH               • Procedural Web Audio Synth      │
└─────────────────────────────────────┬───────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                 UNIVERSAL CLIENT LAYER (@moon/client)                       │
│    • Cross-App SSO Session (useAuthSession)  • Real-Time SSE (useRealtimeStream) │
│    • Typed REST Endpoints                    • Axios Interceptor & Failover │
└─────────────────────────────────────┬───────────────────────────────────────┘
                                      │ HTTP / SSE / RPC
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                     MOON SERVER & BACKEND RUNTIME                           │
│        apps/api (Port 4000) · @moon/server · Transport & Auth Boundary      │
└─────────────────────────────────────┬───────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                     MOON ORM & DATA GRAPH ENGINE                            │
│        @moon/orm · Vertex Models · @moon/witness · Knowledge Graph          │
└─────────────────────────────────────┬───────────────────────────────────────┘
                                      │ Knex / Native SQL
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                    POSTGRESQL 16+ INFRASTRUCTURE                            │
│                 Relational Storage · pgvector 0.8+                          │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 📦 Monorepo Layout (28 Packages & Applications)

```text
moonwitness/
├── apps/
│   ├── web/                  # Cosmic Dashboard Next.js 16 frontend (:3000)
│   ├── command-center/       # Tactical Governance & Administrative Console (:3001)
│   ├── api/                  # MoonWitness backend service (:4000)
│   └── rocksoul/             # Companion web experimental runtime
├── packages/
│   ├── ui/                   # @workspace/ui (Master Cosmic HUD & 3D Visualizer Kit)
│   ├── types/                # @workspace/types (Domain types, constants, NAVIGATION_MESH)
│   ├── moon-client/          # @moon/client (Isomorphic API client, SSO, SSE hook)
│   ├── moon-orm/             # Vertex-based ORM with pgvector & RLS
│   ├── moon-server/          # Transport runtime, auth, middleware & SSE
│   ├── moon-witness/         # Canonical knowledge graph, revelation engine & astronomy
│   ├── moon-base/            # Core models: auth, users, groups, rules & attachments
│   ├── moon-mizan/           # Balance & ethical assessment engine
│   ├── moon-khidra/          # Autonomous workflows & wisdom processing
│   ├── moon-cab/             # Civilizational analytics & wisdom records
│   ├── moon-geo/             # Geospatial datasets (provinces, cities & coordinates)
│   ├── moon-cache/           # High-speed memory/Redis cache layer
│   ├── moon-mail/            # Transactional & notification email services
│   ├── moon-product/         # Product management & resource catalogues
│   ├── moon-stock/           # Inventory tracking & distribution
│   ├── moon-account/         # Accounting & ledger management
│   ├── moon-time/            # Timekeeping, lunar calendars & prayer schedules
│   ├── moon-testing/         # Test fixtures, mock environments & assertion utilities
│   ├── moon-performance/     # Performance benchmarking & telemetry
│   ├── eslint-config/        # Shared ESLint configuration
│   └── typescript-config/    # Shared TypeScript compiler options
└── docs/                     # Architecture specifications & design authority
```

---

## ✨ Key Features & Capabilities

### 1. 🪐 3D Celestial Engine & Interactive Observatories
- **`<CelestialMoonSphere />`**: Photometric 3D Moon sphere with real-time terminator curve illumination (0-100% lit), crater synthesis, and interactive cursor tilt.
- **`<CelestialQiblaCompass />`**: Real-time Great-Circle Azimuth compass calculating exact vector to Makkah Ka'bah (`21.4225° N, 39.8262° E`), 360° rotating dial, and laser lock alignment (`±2.5°`).
- **`<CelestialEclipseSimulator />`**: Photometric solar corona simulator with scrubbable contact timeline (C1, C2, Totality, C3, C4).
- **`<SeismicTectonicRadar />`**: GPU-accelerated Canvas plate radar with 360° sweeping beam, pulsing epicenters, and live seismic magnitude feeds.
- **`<QuranRootMatrix />`**: Triliteral Arabic root word morphology explorer with derivation trees and Quranic citation indexing.

### 2. 🔑 Universal SSO & Real-Time Telemetry
- **Cross-App SSO (`@moon/client`)**: Seamless auth session sharing across ports via `mw_session` cookies and reactive `useAuthSession()` hook.
- **Real-Time SSE Stream Hook (`useRealtimeStream`)**: Auto-reconnecting Server-Sent Events listener for live intelligence broadcasts and prayer alerts.
- **Universal Command Palette (`Cmd+K` / `Ctrl+K`)**: Instant navigation mesh, Quran Surahs, and Hadith books queryable from any screen.

### 3. 🎵 Procedural Web Audio Soundscape
- **Zero-Dependency Synth (`cosmicAudio`)**: Synthesizes crisp tactical click blips, modal pulses, and harmonious 528Hz Solfeggio resonant chords via Web Audio API.
- **HUD Audio Toggle (`<CosmicAudioToggle />`)**: Persisted mute/unmute control with `M` keyboard hotkey.

---

## 🚀 Quick Start & Development

### 1. Installation
```bash
# Clone the repository
git clone https://github.com/bjo163/moonwitness.git
cd moonwitness

# Install dependencies using pnpm
pnpm install
```

### 2. Run Applications in Parallel
```bash
# Start all apps simultaneously (Web :3000, Command Center :3001, API :4000)
pnpm dev

# Or run individual apps:
pnpm dev:web    # Web Portal (http://localhost:3000)
pnpm dev:admin  # Command Center (http://localhost:3001)
pnpm dev:api    # Backend Service (http://localhost:4000)
```

### 3. Build & Typecheck (Monorepo Verification)
```bash
# Typecheck all 28 packages
pnpm typecheck

# Production build all packages
pnpm build
```

---

## 📜 License & Provenance
MoonWitness OS is an open and sovereign technological artifact dedicated to the preservation and dissemination of divine wisdom, celestial observation, and peace intelligence.