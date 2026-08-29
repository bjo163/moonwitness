# ◈ @workspace/ui

```
╔══════════════════════════════════════════════════════════════════════════╗
║  PACKAGE:        @workspace/ui                                           ║
║  SYSTEM VERSION: MoonWitness OS V9.0 (Divine Operating System Matrix)    ║
║  PKG VERSION:    9.0.0                                                   ║
║  CLASSIFICATION: TIER 5 — MASTER COSMIC DESIGN SYSTEM & 3D VISUALIZERS   ║
║  STATUS:         ████████████████████████████████ ACTIVE (SOVEREIGN)     ║
╚══════════════════════════════════════════════════════════════════════════╝
```

> **Master Cosmic Design System, 3D Celestial Shaders & Procedural Web Audio Engine**  
> The unified visual and sensory language for MoonWitness OS.

---

## 🎨 Design Philosophy: Deep Space Cosmic Operating System (Standard shadcn/ui)

`@workspace/ui` enforces the **Design Bible V9.5** with standard shadcn/ui ergonomics, glassmorphism (`backdrop-blur-md bg-card/85`), smooth rounded containers (`.clip-card`, `rounded-xl`, `rounded-2xl`), semantic laser conduits, and crisp Geist/JetBrains Mono typography.

---

## 📦 Component Inventory

### 1. 🪐 3D Celestial Visualizers
- **`<CelestialMoonSphere />`**: Photometric 3D Moon sphere calculating real-time terminator shadow physics based on Hijri day (0–100% illuminated), crater synthesis, and interactive gyro cursor tilt.
- **`<CelestialQiblaCompass />`**: Real-time Great-Circle Azimuth compass targeting Ka'bah (`21.4225° N, 39.8262° E`), 360° rotating dial, and laser lock alignment (`±2.5°`).
- **`<CelestialEclipseSimulator />`**: Solar corona simulator with interactive contact scrubber (C1, C2, Totality, C3, C4).
- **`<SeismicTectonicRadar />`**: GPU-accelerated plate radar with 360° sweeping beam, pulsing epicenters, and live seismic magnitude feeds.
- **`<QuranRootMatrix />`**: Triliteral Arabic morphology concordance matrix with instant search and Quranic verse citations.

### 2. 🎛️ Cosmic Layouts & Data Primitives
- **`<ResourceTable<T> />`**: Generic type-safe data grid with client-side multi-key search, pagination, and row actions.
- **`<ContextBlock />`**: Canonical single-H1 page identity banner with real-time operation badges.
- **`<Sidebar />` & `<Topbar />`**: Standard navigation frames with role badges.
- **`<Navbar />`**: Primary portal header with dynamic command groups.
- **`<CommandPalette />`**: Universal `Cmd+K` / `Ctrl+K` modal indexing navigation mesh, Quran Surahs, and Hadith books.
- **`<Panel />` & `<PanelHeader />`**: 5-level smooth glass container boxes with rounded-xl corners.
- **`<Modal />` & `<Dialog />`**: High-contrast dialogs with smooth backdrops.
- **`<Button />`**: Standard shadcn action buttons with smooth hover states.
- **`<ErrorBoundary />`**: React crash isolation component with telemetry reporting.

### 3. 🎵 Procedural Web Audio Synthesizer
- **`cosmicAudio`**: Procedural sound engine synthesizing crisp clicks, modal pulses, and harmonious 528Hz Solfeggio resonant chords via Web Audio API. Zero external audio file dependencies.
- **`<CosmicAudioToggle />`**: Floating audio mute/unmute control with `M` keyboard hotkey.

---

## 🚀 Usage

```tsx
import { 
  CelestialMoonSphere, 
  CelestialQiblaCompass, 
  ResourceTable, 
  ContextBlock,
  cosmicAudio 
} from "@workspace/ui"

export function Observatory() {
  return (
    <div className="space-y-6">
      <ContextBlock 
        title="OBSERVATORY TELEMETRY"
        subtitle="Live astronomical positions and solar alignments."
        status="ONLINE"
        accentColor="celestial"
      />
      <CelestialMoonSphere phase={0.5} size={280} interactive={true} />
      <CelestialQiblaCompass size={300} />
    </div>
  )
}
```

---

## 🛡️ Architectural Boundaries
- Belongs to **Tier 5 (React UI & Shaders)**.
- Consumes `@workspace/types` and `@workspace/error`.

---

## 🧪 Verification
```bash
pnpm --filter @workspace/ui typecheck
```