# ◈ @workspace/ui

```
╔══════════════════════════════════════════════════════════════════════════╗
║  PACKAGE:        @workspace/ui                                           ║
║  SYSTEM VERSION: MoonWitness OS V10.0 (Enterprise Matrix)                ║
║  PKG VERSION:    10.0.0                                                  ║
║  CLASSIFICATION: TIER 5 — ENTERPRISE SHADCN/UI & 3D VISUALIZERS          ║
║  STATUS:         ████════════════════════════════ ACTIVE (SOVEREIGN)     ║
╚══════════════════════════════════════════════════════════════════════════╝
```

> **Master Enterprise Design System, 3D Celestial Shaders & Web Audio Engine**
> The unified visual and component library for MoonWitness OS.

---

## 🎨 Design Philosophy: Canonical Enterprise SaaS (shadcn/ui & Tailwind CSS v4)

`@workspace/ui` enforces the **Enterprise Design System Bible** with standard shadcn/ui ergonomics, high-contrast accessible surfaces (`bg-background`, `bg-card`, `border-border`), compact containers (`rounded-md`) without default shadows, and crisp Geist/JetBrains Mono/Amiri typography.

---

See [Research UI guidelines](../../docs/RESEARCH-UI.md) for typography, spacing, reading width, and accessibility. Prefer text sections and separators over nested cards.

## 📦 Component Inventory

### 1. 🪐 3D Celestial & Domain Visualizers
- **`<CelestialMoonSphere />`**: Photometric 3D Moon sphere calculating real-time terminator shadow physics based on Hijri day (0–100% illuminated), crater synthesis, and interactive gyro cursor tilt.
- **`<CelestialQiblaCompass />`**: Real-time Great-Circle Azimuth compass targeting Ka'bah (`21.4225° N, 39.8262° E`), 360° rotating dial, and alignment tracking (`±2.5°`).
- **`<CelestialEclipseSimulator />`**: Solar corona simulator with interactive contact scrubber (C1, C2, Totality, C3, C4).
- **`<SeismicTectonicRadar />`**: GPU-accelerated plate radar with 360° sweeping beam, pulsing epicenters, and live seismic magnitude feeds.
- **`<QuranRootMatrix />`**: Triliteral Arabic morphology concordance matrix with instant search and Quranic verse citations.

### 2. 🎛️ Layouts & Data Primitives
- **`<ResourceTable<T> />`**: Generic type-safe data grid with client-side multi-key search, pagination, and row actions.
- **`<ContextBlock />`**: Canonical single-H1 page identity banner with real-time operation badges.
- **`<Sidebar />` & `<Topbar />`**: Standard navigation frames with role badges and ThemeToggle.
- **`<Navbar />`**: Primary portal header with dynamic command groups.
- **`<CommandPalette />`**: Universal `Cmd+K` / `Ctrl+K` modal indexing navigation mesh, Quran Surahs, and Hadith books.
- **`<Panel />` & `<PanelHeader />`**: Compact containers with rounded-md corners and semantic variants.
- **`<Modal />` & `<Dialog />`**: High-contrast accessible dialogs with smooth backdrops.
- **`<Button />`**: Standard shadcn action buttons with smooth hover states.
- **`<ThemeToggle />`**: Light / Dark / System mode switcher.
- **`<ErrorBoundary />`**: React crash isolation component with telemetry reporting.

### 3. 🎵 Procedural Web Audio Synthesizer
- **`soundEngine`**: Procedural sound engine synthesizing crisp clicks, modal pulses, and harmonious 528Hz Solfeggio resonant chords via Web Audio API. Zero external audio file dependencies.
- **`<AudioToggle />`**: Floating audio mute/unmute control with `M` keyboard hotkey.

---

## 🚀 Usage

```tsx
import {
  CelestialMoonSphere,
  CelestialQiblaCompass,
  ResourceTable,
  ContextBlock,
  ThemeToggle,
  soundEngine
} from "@workspace/ui"
```

## 🧪 Verification

```bash
pnpm --filter @workspace/ui typecheck
```