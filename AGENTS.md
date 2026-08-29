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

## 4. Enhanced Design Token System & Deep Space Sci-Fi Aesthetic

### 4.1 Design Philosophy
Theme: "Deep Space Cosmic Operating System powered by Standard shadcn/ui Design Architecture" — a fusion of futuristic aesthetics with clean, smooth, standard shadcn/ui ergonomics, utilizing glassmorphism (`backdrop-blur-md bg-card/85`), subtle ambient glows (`--cyber-*` tokens), and smooth rounded containers (`rounded-2xl`, `rounded-xl`, `rounded-lg`, `rounded-md`).

### 4.2 Semantic Color Tokens (Primary Palette)
**Core Cyber Palette** — `packages/ui/src/styles/globals.css`:
- `--cyber-cyan` / `#00F0FF`: Primary accent, navigation, interactive states, primary CTAs
- `--cyber-green` / `#00FF66`: Success states, confirmation, growth metrics, positive indicators
- `--cyber-yellow` / `#FFE600`: Warning states, alerts, pending actions, attention required
- `--cyber-purple` / `#A100FF`: Premium features, special highlights, mystical elements
- `--cyber-pink` / `#FF0055`: Critical alerts, destructive actions, error states, danger zones
- `--cyber-dark` / `#05070A`: Root background, deep space backdrop
- `--cyber-panel` / `#0A0F17`: Panel backgrounds, card surfaces, elevated UI layers

**Tailwind Class Mapping**:
- `text-cyber-cyan` → Primary text highlights
- `border-cyber-green` → Success borders
- `bg-cyber-yellow/10` → Warning backgrounds with opacity
- `shadow-cyber-purple` → Premium glow effects

### 4.3 Smooth shadcn/ui Geometric Container System
**Canonical Rounded Utilities** — Apply via Tailwind classes:
- `clip-card` / `card-clip`: 12px smooth rounded corners (`rounded-xl`) for standard cards, panels, containers
- `clip-hero` / `hero-clip`: 16px smooth rounded corners (`rounded-2xl`) for hero sections, large feature blocks
- `clip-btn` / `btn-clip`: 8px smooth rounded corners (`rounded-lg`) for buttons, chips, interactive elements
- `clip-tag` / `tag-clip`: 6px smooth rounded corners (`rounded-md`) for tags, badges, small labels
- `clip-rune` / `rune-clip`: Circular geometry (`rounded-full`) for icons, avatars

**Usage Example**:
```tsx
<div className="clip-card bg-card/90 border border-border/40 p-6 backdrop-blur-md shadow-sm">
  {/* Card content */}
</div>
```

### 4.4 Subtle State Accent Indicators
**Dynamic Semantic Indicators**:
- `corner-cyan`: Active/Selected state
- `corner-green`: Success/Confirmed state
- `corner-yellow`: Warning/Pending state
- `corner-purple`: Premium/Special state
- `corner-pink`: Critical/Error state

### 4.5 Optical Elevation & Ambient Depth
**Semantic Ambient Utilities**:
- `glow-cyan`: 16px ambient cyan halo (primary active)
- `glow-emerald`: 16px ambient green halo (success)
- `glow-amber`: 16px ambient yellow halo (warning)
- `glow-purple`: 16px ambient purple halo (premium)
- `glow-pink`: 16px ambient pink halo (critical)
- `holo-glow`: Text shadow with cyan holographic effect

### 4.6 Glassmorphism & Panel System
**Primary Glass Panel** — `panel-glass` utility:
- Background: `rgba(10, 15, 23, 0.85)` (85% dark with transparency)
- Backdrop: 16px blur (`backdrop-blur-md`)
- Border: `rgba(255, 255, 255, 0.08)` (clean subtle border)
- Shadow: `0 4px 20px -1px rgba(0, 0, 0, 0.5)`

**Usage Pattern**:
```tsx
<section className="panel-glass p-6 space-y-4 shadow-sm">
  {/* Multi-layered smooth glass effect */}
</section>
```

### 4.7 Grid & Background Patterns
**Cosmic Grid Backgrounds**:
- `bg-cosmic-grid`: 32px grid with 4% cyan lines (primary navigation/dashboard)
- `bg-dense-grid`: 16px grid with 3% white lines (data-heavy interfaces)

**Laser Conduit Dividers**:
- `laser-conduit-cyan`: Horizontal 1px gradient divider (primary)
- `laser-conduit-green`: Success state dividers
- `laser-conduit-yellow`: Warning section separators
- `laser-conduit-purple`: Premium feature dividers

### 4.8 Typography System
**Font Stack Hierarchy**:
- `font-sans` (Geist): Body text, descriptions, content
- `font-mono` (JetBrains Mono): Telemetry, code, data labels, system values
- `font-orbitron` (Orbitron): Hero headings, major titles (UPPERCASE)
- `font-arabic` (Amiri): Arabic text (use `.arabic-text` class for RTL + proper spacing)

**Typography Rules**:
- All major headings MUST be UPPERCASE
- Monospace (`tracking-widest`) for system telemetry and numeric data
- Arabic text MUST use `.arabic-text` class (RTL, line-height: 2.3)
- Sub-pixel rendering: `-webkit-font-smoothing: antialiased`

### 4.9 Animation Token Library
**Keyframe Animations** (use via Tailwind `animate-*`):
- `heroShake`: Glitch effect for hero elements
- `textGlow`: Pulsing holographic text effect
- `holoScan`: Vertical scanning line effect
- `starTwinkle`: Twinkling star background particles
- `cosmicDrift`: Slow drifting background gradient
- `breathingCyan`: Subtle pulsing cyan glow
- `radarPulse`: Radar-style pulsing scale effect

### 4.10 Component Naming Standards
**Enterprise-Grade Naming** (NO `HUD*` prefixes):
- ✅ `ResourceTable`, `Panel`, `Modal`, `ContextBlock`, `Button`
- ✅ `BreadcrumbTrail`, `ErrorBoundary`, `useModal`
- ❌ `HUDTable`, `HUDPanel`, `HUDModal` (legacy, forbidden)

### 4.11 Spacing & Layout Token System
**Spacing Scale** (Tailwind utilities):
- `space-y-2` (8px): Tight form fields, compact lists
- `space-y-4` (16px): Standard vertical rhythm, default spacing
- `space-y-6` (24px): Section spacing, content groups
- `space-y-8` (32px): Major section breaks, module boundaries
- `gap-3` (12px): Button groups, inline elements
- `gap-4` (16px): Grid/flex standard gap, card layouts
- `gap-6` (24px): Large card grids, dashboard layouts

**Padding Standards**:
- `p-4` (16px): Standard panel/card padding
- `p-6` (24px): Large panel padding, hero sections
- `px-4 py-2` (16px/8px): Button padding standard
- `px-6 py-3` (24px/12px): Large button padding

**Container Widths**:
- `max-w-7xl` (1280px): Main content container
- `max-w-5xl` (1024px): Article/document content
- `max-w-3xl` (768px): Form layouts, narrow content
- `max-w-screen-2xl` (1536px): Full-width dashboards

### 4.12 Border & Radius Token System
**Border Radius Scale**:
- `--radius-sm: 0.3rem` (4.8px): Small elements, tags, badges
- `--radius-md: 0.4rem` (6.4px): Buttons, inputs, form elements
- `--radius-lg: 0.5rem` (8px): Cards, panels (default standard)
- `--radius-xl: 0.7rem` (11.2px): Large cards, modals
- `--radius-2xl: 0.9rem` (14.4px): Hero sections, featured content

**Border Width Standards**:
- `border` (1px): Standard borders, panel outlines
- `border-2` (2px): Emphasized borders, active states
- `border-4` (4px): Heavy emphasis, loading indicators

**Border Opacity Patterns**:
- `border-cyber-cyan/25`: Standard panel borders (25% opacity)
- `border-cyber-cyan/50`: Active/hover borders (50% opacity)
- `border-cyber-cyan/75`: Focused borders (75% opacity)
- `border-cyber-cyan`: Solid borders (100% opacity)

### 4.13 Z-Index Layering System
**Semantic Z-Index Scale** (Tailwind `z-*`):
- `z-0`: Base layer (backgrounds, grid patterns)
- `z-10`: Content layer (cards, panels, text)
- `z-20`: Floating UI (dropdowns, tooltips, popovers)
- `z-30`: Overlay backdrops (modal backgrounds)
- `z-40`: Modals, dialogs, sheets
- `z-50`: Toasts, notifications, alerts
- `z-[100]`: Critical system overlays, emergency alerts

### 4.14 Transition & Animation Standards
**Standard Transitions** (Tailwind utilities):
- `transition-colors duration-200`: Color changes (hover states, theme switches)
- `transition-transform duration-300`: Movement (scale, translate, rotate)
- `transition-opacity duration-200`: Fade effects (show/hide)
- `transition-shadow duration-300`: Glow effects (active states)

**Easing Functions**:
- Default: `ease-in-out` (smooth both directions)
- Entrances: `ease-out` (natural deceleration)
- Exits: `ease-in` (natural acceleration)
- Custom: `cubic-bezier(0.4, 0, 0.2, 1)` for special effects

**Animation Duration Standards**:
- Instant feedback: `duration-100` (100ms)
- Quick transitions: `duration-200` (200ms)
- Standard animations: `duration-300` (300ms)
- Slow dramatic effects: `duration-500` (500ms)

### 4.15 Shadow Token System
**Box Shadow Scale**:
- `shadow-sm`: Subtle elevation (small cards)
- `shadow`: Standard elevation (panels)
- `shadow-md`: Medium elevation (modals)
- `shadow-lg`: High elevation (dropdowns)
- `shadow-xl`: Maximum elevation (critical dialogs)

**Semantic Glow Shadows** (Custom):
- Critical: `shadow-[0_0_60px_rgba(0,240,255,0.3)]`
- Active: `shadow-[0_0_30px_rgba(0,240,255,0.2)]`
- Passive: `shadow-[0_0_15px_rgba(0,240,255,0.1)]`
- Hover: `shadow-[0_0_40px_rgba(0,240,255,0.25)]`

### 4.16 Typography Scale & Hierarchy
**Size Scale** (Tailwind text utilities):
- `text-xs` (12px): Labels, captions, metadata
- `text-sm` (14px): Secondary text, descriptions
- `text-base` (16px): Body text, standard content
- `text-lg` (18px): Emphasized body, large descriptions
- `text-xl` (20px): Subheadings, card titles
- `text-2xl` (24px): Section headings
- `text-3xl` (30px): Page headings
- `text-4xl` (36px): Major titles
- `text-5xl` (48px): Hero headings

**Weight Scale**:
- `font-normal` (400): Body text
- `font-medium` (500): Emphasized text
- `font-semibold` (600): Headings, labels
- `font-bold` (700): Hero titles, CTAs

**Letter Spacing**:
- `tracking-tight`: Compact headings (-0.025em)
- `tracking-normal`: Body text (0em)
- `tracking-wide`: Emphasized text (0.025em)
- `tracking-wider`: System labels (0.05em)
- `tracking-widest`: Telemetry, monospace data (0.1em)

**Line Height**:
- `leading-tight` (1.25): Compact headings
- `leading-normal` (1.5): Body text
- `leading-relaxed` (1.625): Comfortable reading
- `leading-loose` (2): Arabic text, poetry

### 4.17 Component Pattern Templates

#### Standard Panel Component
```tsx
<div className="clip-card bg-cyber-panel border border-cyber-cyan/25 p-6 space-y-4 glow-cyan">
  <h2 className="text-2xl font-heading uppercase tracking-wide text-cyber-cyan">
    PANEL TITLE
  </h2>
  <div className="laser-conduit-cyan" />
  <div className="space-y-2">
    {/* Content */}
  </div>
</div>
```

#### Glassmorphism Hero Section
```tsx
<section className="panel-glass clip-hero p-8 space-y-6">
  <div className="corner-cyan">
    <h1 className="text-5xl font-orbitron uppercase tracking-wider text-cyber-cyan holo-glow">
      SYSTEM TITLE
    </h1>
  </div>
  <p className="text-lg text-gray-400">Description text</p>
</section>
```

#### Button Matrix (All Variants)
```tsx
{/* Primary */}
<button className="clip-btn bg-cyber-cyan text-cyber-dark px-4 py-2 font-mono uppercase tracking-widest hover:bg-cyber-cyan/90 transition-colors">
  ACTIVATE
</button>

{/* Success */}
<button className="clip-btn bg-cyber-green text-cyber-dark px-4 py-2 font-mono uppercase tracking-widest hover:bg-cyber-green/90 transition-colors">
  CONFIRM
</button>

{/* Warning */}
<button className="clip-btn bg-cyber-yellow text-cyber-dark px-4 py-2 font-mono uppercase tracking-widest hover:bg-cyber-yellow/90 transition-colors">
  REVIEW
</button>

{/* Destructive */}
<button className="clip-btn bg-cyber-pink text-white px-4 py-2 font-mono uppercase tracking-widest hover:bg-cyber-pink/90 transition-colors">
  DELETE
</button>

{/* Ghost/Secondary */}
<button className="clip-btn border border-cyber-cyan/25 text-cyber-cyan px-4 py-2 font-mono uppercase tracking-widest hover:bg-cyber-cyan/10 transition-colors">
  CANCEL
</button>
```

#### Data Card with Tactical Corners
```tsx
<div className="military-box corner-cyan clip-card bg-cyber-panel border border-cyber-cyan/25 p-4 space-y-3">
  <div className="text-xs font-mono uppercase tracking-widest text-cyber-cyan/70">
    System Status
  </div>
  <div className="text-3xl font-mono text-cyber-cyan">
    98.7%
  </div>
  <div className="laser-conduit-cyan" />
  <div className="text-sm text-gray-400">
    All systems operational
  </div>
</div>
```

#### Grid Background Section
```tsx
<section className="min-h-screen bg-cyber-dark bg-cosmic-grid p-8">
  <div className="max-w-7xl mx-auto space-y-8">
    {/* Grid-backed content */}
  </div>
</section>
```

### 4.18 Token Usage Best Practices
1. **Zero Inline Hex Colors**: Always use CSS variables (`--cyber-*`) or Tailwind classes
2. **Semantic Over Literal**: Use `--cyber-green` for success, not generic green
3. **Consistent Layering**: Follow depth system (60px → 30px → 15px blur)
4. **Accessibility**: Ensure 4.5:1 contrast ratio for text on backgrounds
5. **Dark Mode Native**: All tokens optimized for dark space theme
6. **Responsive Spacing**: Use responsive Tailwind variants (`md:p-8`, `lg:gap-6`)
7. **Animation Performance**: Prefer `transform` and `opacity` for 60fps animations
8. **Token Composition**: Combine tokens for consistent visual language
9. **Avoid Magic Numbers**: Use spacing scale instead of arbitrary values
10. **Test on Multiple Screens**: Verify glows and blurs on different displays

### 4.19 Token Reference Quick Guide

**Color Decision Tree**:
- Primary action? → `cyber-cyan`
- Success/confirm? → `cyber-green`
- Warning/attention? → `cyber-yellow`
- Premium/special? → `cyber-purple`
- Error/destructive? → `cyber-pink`
- Background? → `cyber-dark` or `cyber-panel`

**Spacing Decision Tree**:
- Related elements? → `gap-3` or `space-y-2`
- Standard sections? → `gap-4` or `space-y-4`
- Major divisions? → `gap-6` or `space-y-6`
- Module boundaries? → `space-y-8`

**Chamfer Decision Tree**:
- Small badge? → `clip-tag` (6px)
- Button? → `clip-btn` (10px)
- Card/panel? → `clip-card` (16px)
- Hero section? → `clip-hero` (28px)
- Special icon? → `clip-rune` (octagon)

## 5. Arsitektur Data Fetching & Server-Driven Matrix Engine
- JANGAN menulis *mock array/object* secara langsung (*inline*) di dalam komponen UI jika endpoint atau typed API helpers tersedia.
- Gunakan `useModelSchema()` + `useModelRecords()` dan `<CosmicModelWorkspace model="..." />` untuk seluruh 16 package addon model ERP (/matrix/[model]).
- Backend routing WAJIB menggunakan `defineRoute()` dari `@moon/server` untuk auto CORS, error boundary, dan query/body parsing.
<!-- END:moonwitness-core-rules -->