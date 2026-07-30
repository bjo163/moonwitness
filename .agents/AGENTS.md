# ◈ MOONWITNESS — DESIGN BIBLE V3.0

```
╔══════════════════════════════════════════════════════════════╗
║  CLASSIFICATION: INTERNAL — DESIGN AUTHORITY DOCUMENT       ║
║  CODENAME:       DEEP SPACE SCI-FI DIVINE OPERATING SYSTEM  ║
║  SYSTEM:         MoonWitness Operating System V3.0          ║
║  UPDATED:        2026-07-27 — Deep Space Glassmorphism V3   ║
║  STATUS:         ████████████████████████████████ ACTIVE     ║
╚══════════════════════════════════════════════════════════════╝
```

> **This is not documentation. This is constitutional law.**
> Every pixel, 3D simulation, vector frame, color, and word in MoonWitness must conform to this document.
> Deviation without Design Review = system corruption. Never create flat web layouts or rely entirely on static AI images.

---

## 01 — IDENTITY & SCI-FI HUD GLASSMORPHISM

MoonWitness is a **Deep Space Sci-Fi Divine Observation Terminal** — an advanced cosmic operating system for Quranic knowledge, celestial telemetry, and global peace intelligence.

**It is NOT a website. It is NOT an app. It is an immersive cinematic Operating System.**

```
VISUAL DNA & 5-LAYER ASSET ARCHITECTURE:
├── Layer 1: Deep Space Atmosphere ─ indigo/navy nebula glows, star grids, optical scanlines
├── Layer 2: 3D Celestial Sim ────── photorealistic moon spheres, earth horizons, solar coronas
├── Layer 3: Chamfered Glass HUD ─── tactical translucent glass (bg-black/80 backdrop-blur-md) with cut corners
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

❌ Retro Hacker/Gamer Terminal (no `>_`, no `//`, no blinding neon) · ❌ SaaS dashboard · ❌ Generic Islamic app · ❌ E-commerce

---

## 02 — MODULE ARCHITECTURE

```
◈ MOONWITNESS OS V6.5
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
├── ⚙️ CONSOLE ─── System Operations (Admin Only)
│   ERP Dashboard · Analytics · Hadith DB · Scripture Mgr · Users
│
└── 🤖 AI MODULE ─── Prophetic Intelligence (Future)
    Prophetic AI · Wisdom Diagnostic · Quran Semantic Search
```

**Rules:** Every module has a unique code. Every module belongs to exactly ONE family. The ERP Console is admin-only.

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

### Extended

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

### Depth Stack

```
LAYER -1  Cosmic void (stars, nebula, grid particles)
LAYER  0  Base dark surface (#030508)
LAYER  1  Panel surface (#0A0F17)
LAYER  2  Elevated panel (border + glow)
LAYER  3  Active/hover state
LAYER  4  Floating elements (dropdowns)
LAYER  5  Modals (z: 9999)
LAYER  6  Navbar (z: 99999)
```

---

## 04 — TYPOGRAPHY

### Font Stack

| Role | Font | Usage |
|------|------|-------|
| **Display / HUD** | Orbitron | Module IDs, version badges, hero titles |
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
02. Section titles use clean wide-spaced sans-serif. NEVER use `//` or `>` hacker prefixes. Use subtle dots `•` if needed.
03. Hero text = Orbitron. Everything else = JetBrains Mono or Geist.
04. Arabic text MUST use .arabic-text class. Never Latin fonts.
05. Max line length = 65ch. Use max-w-xl or max-w-2xl.
06. Status/badge text = tracking-widest (terminal aesthetic).
```

### Content Glyphs

```
•      Minimalist separator for metadata (e.g. DATE • 27 JUL)
◈      Decorative dividers, feature callouts
◉      Status indicators, panel IDs
●      Active status dots
╔╗╚╝   Terminal corner decorations
[ ]    Command-style button labels
```

---

## 05 — LAYOUT & SPACING

### Page Skeleton

```
┌────────────────────────────────────────┐
│ [STATUS BAR] ─── 32px ── tier 1       │  ← system telemetry
│ [NAVBAR]     ─── 48px ── tier 2       │  ← command groups
├────────────────────────────────────────┤
│ [HUDBreadcrumb]                       │  ← navigation trail
│ [HUDContextBlock] ── H1 lives here    │  ← page identity
│ [ZONE A] ── Primary content           │
│ [ZONE B] ── Telemetry/status grid     │
│ [ZONE C…] ── Additional zones         │
│ [FOOTER] ── Slim copyright bar        │
├────────────────────────────────────────┤
│ [HUD TASKBAR] ─── 34px ── fixed       │  ← persistent controls
└────────────────────────────────────────┘
```

**Container:** `mx-auto max-w-4xl px-6` (896px max). Navbar/Taskbar/Background = full-width.

### Grid

| Screen | Columns | Gap |
|--------|---------|-----|
| Mobile (<768px) | 1 | 16px |
| Tablet (768px+) | 2 | 16px |
| Desktop (1024px+) | 3 | 16px |
| Wide (1280px+) | 3–4 | 16px |

### Spacing Laws

```
Zones:       py-10 minimum
Panels:      p-5 minimum (p-6 preferred desktop)
Grid gaps:   gap-4 (cards) · gap-3 (dense) · gap-6 (spacious)
Status bar:  32px fixed
Taskbar:     34px fixed
Nav tier-2:  48px
```

---

## 06 — HUD COMPONENT LIBRARY

> All components live in `components/ui/`. Never create ad-hoc alternatives.

### Component Inventory

| # | Component | File | Purpose | Key Props |
|---|-----------|------|---------|-----------|
| 1 | **HUDModal** | `hud-modal.tsx` | Portal overlay | `isOpen`, `onClose`, `title`, `icon`, `maxWidth`, `borderColor`, `glowColor` |
| 2 | **HUDModalTrigger** | `hud-ui-kit.tsx` | Standardized modal opener | `icon`, `label`, `color`, `onClick` |
| 3 | **HUDPanel** | `hud-ui-kit.tsx` | Container panel (5 levels) | `level`, `accentColor`, `children` |
| 4 | **HUDPanelHeader** | `hud-ui-kit.tsx` | Panel header bar | `title`, `icon`, `status`, `accentColor`, `subtitle` |
| 5 | **HUDButton** | `hud-ui-kit.tsx` | CTA button (5 variants) | `variant`, `href`, `accentColor`, `onClick` |
| 6 | **HUDContextBlock** | `hud-ui-kit.tsx` | Page H1 header | `title`, `subtitle`, `operation`, `status`, `accentColor` |
| 7 | **HUDBreadcrumb** | `hud-ui-kit.tsx` | Navigation trail | `paths[]` |
| 8 | **HUDEmptyState** | `hud-ui-kit.tsx` | No data indicator | `title`, `description`, `icon` |
| 9 | **HUDTabs** | `hud-ui-kit.tsx` | Section navigation | `activeTab`, `onChange`, `tabs[]`, `accentColor` |
| 10 | **HUDTable** | `hud-ui-kit.tsx` | Data table | `headers[]`, `rows[][]`, `accentColor` |
| 11 | **HUDProgress** | `hud-ui-kit.tsx` | Progress/sync bar | `value`, `max`, `label`, `status`, `accentColor` |
| 12 | **HUDTooltip** | `hud-ui-kit.tsx` | Hover info | `text`, `position`, `children` |
| 13 | **HUDTerminal** | `hud-ui-kit.tsx` | OS boot/console | `lines[]`, `prefix`, `accentColor` |
| 14 | **HUDSidebar** | `hud-ui-kit.tsx` | Collapsible nav | `items[]`, `activeId`, `onSelect`, `isExpanded` |
| 15 | **HUDAIPanel** | `hud-ui-kit.tsx` | AI interaction panel | `agentName`, `isTyping`, `message` (JSX, NOT string) |
| 16 | **HUDLoadingState** | `hud-ui-kit.tsx` | Radar-spin loader | `message`, `accentColor` |
| 17 | **HUDErrorState** | `hud-ui-kit.tsx` | Fault-tolerance alert | `title`, `message`, `onRetry` |
| 18 | **HUDChart** | `hud-ui-kit.tsx` | CSS data bars | `data[]`, `title`, `subtitle`, `accentColor`, `height` |

> ⚠️ **HUDAIPanel.message** accepts `React.ReactNode` (JSX), NOT raw HTML strings.

---

## 07 — INTERACTION STATES

| State | Visual | Behavior |
|-------|--------|----------|
| Default | 30% border, no glow | Resting |
| Hover | 60% border, 10px glow, translateY(-2px) | Lift effect |
| Active | 100% border, 20px glow, translateY(0) | Press confirmation |
| Focus | Full border + outline ring | Keyboard nav |
| Loading | Pulse animation + `PROCESSING…` | Async wait |
| Success | Green border + glow (2s fade) | Operation complete |
| Error | Pink border + glow | Fault detected |
| Disabled | 20% opacity, cursor-not-allowed | Unavailable |
| Offline | Yellow border + `SIGNAL LOST` | No connection |

### Hover Spec

```css
transition: all 0.25s cubic-bezier(0.2, 0.8, 0.2, 1);
transform: translateY(-2px);
border-color: [accent]/60%;
box-shadow: 0 0 20px [accent]/20%;
/* NEVER use scale() on cards. NEVER animate opacity on entire cards. */
```

### Keyboard

```
TAB / SHIFT+TAB   Navigate focus
ENTER / SPACE     Activate element
ESC               Close modal/dropdown
/                 Open command palette
```

---

## 08 — MOTION DESIGN

### Animation Inventory

| Animation | Duration | Purpose |
|-----------|----------|---------|
| `holoScan` | 4s linear ∞ | Vertical scan line — panel activity |
| `starTwinkle` | 8s ease ∞ | Star opacity — cosmic ambience |
| `cosmicDrift` | 25s linear ∞ | Background depth drift |
| `breathingCyan` | 3s ease ∞ | Box-shadow pulse — system alive |
| `radarPulse` | 3s cubic ∞ | Scale + opacity — observatory |
| `spectrumPulse` | 1s ease alt | Audio visualizer height |
| `blinkingCursor` | variable | Terminal cursor |
| `glowRingSpin` | 6s linear ∞ | FAB button halo |
| `ctaSweep` | 4s ease ∞ | CTA button shimmer |
| `borderPulse` | 2s ease ∞ | Card border emphasis |

### Motion Laws

```
01. Max 3 independent animations visible simultaneously.
02. Hover transitions ≤ 300ms. Use cubic-bezier(0.2, 0.8, 0.2, 1).
03. Page entrance ≤ 400ms.
04. No infinite animations that move significant screen area.
05. All decorative animations respect @media (prefers-reduced-motion: reduce).
06. Modals do NOT animate in. Instant appearance. OS-style.
07. Loading = pulse only. No spinner wheels.
08. holoScan reserved for: modal headers, hero panels, major section headers. Max 3/page.
```

### Performance Budget

- Max **5** `animation` declarations per page
- Max **2** `backdrop-filter: blur` elements per page
- Only animate `transform`, `opacity`, `filter` — never layout properties

---

## 09 — HUD DECORATIONS

### Clip Paths (Sacred Geometry)

| Class | Chamfer | Usage |
|-------|---------|-------|
| `.hud-clip-card` | 16px | Standard cards |
| `.hud-clip-hero` | 28px | Hero panels |
| `.hud-clip-btn` | 10px | Buttons |
| `.hud-clip-tag` | 6px | Tags/badges |
| `.hud-clip-rune` | octagonal | Hexagonal badge |

> All `rounded-*` Tailwind classes are globally overridden to chamfered clip-paths. `rounded-full` = octagon, not circle.

### Military Corner Brackets

```css
.hud-military-box   → cyan corners (default)
.hud-corner-green    → green
.hud-corner-yellow   → yellow
.hud-corner-pink     → pink
.hud-corner-purple   → purple
```

Corner brackets MUST match the accent color of the component family.

### Decoration Limits

| Element | Max Per Page |
|---------|-------------|
| `holo-scan-bar` | 3 |
| `hud-divider` | 5 |
| `sacred-orbit-divider` | 1 |
| Background grid | 1 (global) |
| Star layers | 2 (global) |
| `animate-pulse` dots | 4 |

### Glow Intensity Guide

```
Critical  → box-shadow: 0 0 60px rgba([color], 0.35)
Active    → box-shadow: 0 0 30px rgba([color], 0.25)
Hover     → box-shadow: 0 0 20px rgba([color], 0.20)
Passive   → box-shadow: 0 0 10px rgba([color], 0.10)
None      → list items only
```

---

## 10 — ICONOGRAPHY

**Library:** Lucide Icons (`lucide-react`) — no other libraries allowed.

| Context | Size |
|---------|------|
| Taskbar / Badge | `w-3 h-3` |
| Navbar | `w-3.5 h-3.5` |
| Card header | `w-4 h-4` |
| Panel header | `w-5 h-5` |
| Hero / Modal | `w-6 h-6` |

**Rules:** Icons inherit parent accent color. Interactive icons need text labels (icon-only = toolbars with tooltips only). Stroke width = Lucide default (1.5px). Never override.

---

## 11 — WRITING GUIDE

### Terminology

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
| Menu | Command Groups |
| Logout | TERMINATE SESSION |
| Comment | TRANSMISSION |
| Like | ACKNOWLEDGE |
| Share | BROADCAST |

### Writing Conventions

| Element | Format | Example |
|---------|--------|---------|
| Section title | `CAPS` (no slashes) | `SCRIPTURE DATABASE` |
| Module title | ALL CAPS | `HOLY QUR'AN DIGITAL` |
| Description | Sentence case | `Full 114 Surahs indexed with Tajweed.` |
| Button | `[ CAPS ]` | `[ OPEN MODULE ]` |
| Status | SINGLE WORD | `ONLINE` / `STANDBY` / `OFFLINE` |
| Module ID | Letter-dash-number | `S-01`, `O-03` |
| Error | CAPS prefix + detail | `SIGNAL LOST — telemetry server unreachable.` |
| Loading | CAPS + ellipsis | `SYNCHRONIZING...` |

---

## 12 — ACCESSIBILITY

```
CONTRAST:      #F5F5F5 on #030508 = 17:1 ✓ (body text)
               #8B9BB0 on #030508 = 5.8:1 ✓ (captions)
FOCUS:         :focus-visible { outline: 2px solid var(--cyber-cyan); outline-offset: 2px; }
REDUCED MOTION: @media (prefers-reduced-motion: reduce) → all decorative animation: none
ARIA:          Modals = role="dialog" aria-modal="true"
               Icons = aria-hidden="true" (decorative) or aria-label (functional)
TOUCH TARGET:  44×44px minimum (WCAG AA)
H1:            Exactly ONE per page — inside HUDContextBlock
SKIP NAV:      <a href="#main-content">Skip to content</a> at body top
```

---

## 13 — ANTI-PATTERNS

```
╔══════════════════════════════════════════════════════╗
║            FORBIDDEN DESIGN PATTERNS                 ║
╠══════════════════════════════════════════════════════╣
║                                                      ║
║  ❌ rounded-full on cards/buttons (use clip-paths)   ║
║  ❌ Generic shadows: box-shadow: 0 4px 6px rgba()   ║
║  ❌ Random gradients (use only cyber-* colors)       ║
║  ❌ Mixed fonts in same component                    ║
║  ❌ Retro Hacker elements (`>`, `//`, heavy mono)    ║
║  ❌ Plain <button> without HUD styling               ║
║  ❌ Milky/Foggy Glass (use dark smoked glass)        ║
║  ❌ Inline random hex (#3b82f6, etc.)                ║
║  ❌ Ad-hoc z-index values                            ║
║  ❌ Manual createPortal (use HUDModal)               ║
║  ❌ Multiple <h1> tags per page                      ║
║  ❌ Hardcoded hex in className (use Tailwind tokens)  ║
║  ❌ Arbitrary spacing: p-[13px] (use p-3 or p-4)    ║
║                                                      ║
╚══════════════════════════════════════════════════════╝
```

---

## 14 — NAMING CONVENTIONS

```
FILES:       kebab-case.tsx         → hud-modal.tsx
PAGES:       page.tsx (in route)    → /kitab/quran/page.tsx
COMPONENTS:  HUD + PascalCase      → HUDModal, HUDPanel, HUDButton
MODALS:      PascalCase + Modal     → GlobalSearchModal
CSS CLASSES: hud-[descriptor]       → hud-btn, hud-clip-tag
TOKENS:      --cyber-[color]        → --cyber-cyan
```

---

## 15 — NEW MODULE CHECKLIST

Before any new module goes live:

```
[ ] Assigned module code (e.g., K-04)
[ ] Assigned to correct family (Mission/Scripture/Observatory/Analytics)
[ ] Added to NAV_GROUPS in navbar.tsx
[ ] HUDBreadcrumb as first element
[ ] HUDContextBlock with H1
[ ] Zone A → B → C structure
[ ] Uses HUDPanel (not raw divs)
[ ] Loading + Error + Empty states handled
[ ] Responsive: 375px / 768px / 1024px
[ ] Keyboard navigation functional
[ ] Colors from --cyber-* tokens only
[ ] Max 5 animations per page
[ ] No horizontal overflow at any breakpoint
```

---

## 16 — TOKEN QUICK REFERENCE

```css
/* ── COLORS ──────────────────────────── */
--cyber-cyan:         #00F0FF
--cyber-green:        #00FF66
--cyber-yellow:       #FFE600
--cyber-purple:       #A100FF
--cyber-pink:         #FF0055
--cyber-dark:         #05070A
--cyber-panel:        #0A0F17
--cyber-panel-border: rgba(0,240,255,0.25)

/* ── Z-INDEX ─────────────────────────── */
--z-background:  -1
--z-content:      1
--z-taskbar:     50
--z-navbar:     100
--z-dropdown:   200
--z-modal:     9999
/* Navbar inline: zIndex: 99999 */

/* ── FONTS ───────────────────────────── */
--font-orbitron  → Display/HUD labels
--font-mono      → Body/terminal text
--font-sans      → Descriptions
--font-arabic    → Quranic text

/* ── CLIP PATHS ──────────────────────── */
.hud-clip-card  → 16px chamfer
.hud-clip-hero  → 28px chamfer
.hud-clip-btn   → 10px chamfer
.hud-clip-tag   → 6px chamfer
.hud-clip-rune  → octagonal
```

---

## 17 — CODE DISCIPLINE

> **The codebase IS the product. Dirty code = corrupted system.**

### Zero Hardcode Policy

```
╔══════════════════════════════════════════════════════╗
║            ⛔ ZERO HARDCODE TOLERANCE ⛔              ║
╠══════════════════════════════════════════════════════╣
║                                                      ║
║  ❌ style={{ color: '#00F0FF' }}                     ║
║  ✅ className="text-cyber-cyan"                      ║
║                                                      ║
║  ❌ className="text-[#00F0FF]"                       ║
║  ✅ className="text-cyber-cyan"                      ║
║                                                      ║
║  ❌ style={{ fontSize: '12px' }}                     ║
║  ✅ className="text-xs"                              ║
║                                                      ║
║  ❌ className="p-[13px]" or "mt-[27px]"              ║
║  ✅ className="p-3" or "mt-7" (use token scale)      ║
║                                                      ║
║  ❌ style={{ zIndex: 500 }}                          ║
║  ✅ Use --z-* tokens (--z-modal: 9999)               ║
║                                                      ║
║  ❌ borderColor: 'rgba(0,240,255,0.3)'               ║
║  ✅ className="border-cyber-cyan/30"                 ║
║                                                      ║
╚══════════════════════════════════════════════════════╝
```

**Exception:** Inline `style` is permitted ONLY for:
- Dynamic values calculated at runtime (e.g., `width: ${percent}%`)
- Navbar `zIndex: 99999` (Tailwind z-index max is too low)
- CSS custom property overrides via `style={{ '--var': value }}`

### Clean Code Mandate

```
PROTOCOL: MINIMALISTIC CODE — MAXIMUM IMPACT

01. SINGLE RESPONSIBILITY
    One component = one job. If it does two things, split it.

02. NO COPY-PASTE COMPONENTS
    If you find yourself copying JSX blocks between pages, STOP.
    Extract it into components/ui/ or a shared component.

03. DRY ABOVE ALL
    Duplicated logic = system bug waiting to happen.
    Shared data → lib/  |  Shared UI → components/  |  Shared types → types/

04. PROPS OVER VARIANTS
    Don't create HUDPanelGreen, HUDPanelYellow, HUDPanelPurple.
    Use: <HUDPanel accentColor="success" /> — one component, many modes.

05. FLATTEN CONDITIONALS
    ❌ if (x) { if (y) { if (z) { ... } } }
    ✅ Early return pattern. Guard clauses. Max 2 levels of nesting.

06. MEANINGFUL NAMES
    ❌ const d = getData()
    ✅ const trendMetrics = fetchTabayyunAnalytics()

07. ZERO CONSOLE.LOG IN PRODUCTION
    All debug logging must be removed before merge.

08. IMPORTS: GROUPED & SORTED
    Line 1: React / Next.js
    Line 2: External libs (lucide-react, etc.)
    Line 3: Internal components (@/components/...)
    Line 4: Internal utils/lib (@/lib/...)
    Line 5: Types (@/types/...)
```

### Reusable Component Contract

```
╔══════════════════════════════════════════════════════╗
║         COMPONENT REUSABILITY = MANDATORY            ║
╠══════════════════════════════════════════════════════╣
║                                                      ║
║  RULE 1: If it appears on 2+ pages → extract it.    ║
║                                                      ║
║  RULE 2: Every HUD component MUST accept:            ║
║          • accentColor?: HudAccentColor              ║
║          • className?: string                        ║
║                                                      ║
║  RULE 3: Components must be THEME-AWARE.             ║
║          Use HUD_TOKENS.colors[accentColor]           ║
║          Never hardcode a color inside a component.  ║
║                                                      ║
║  RULE 4: Prefer COMPOSITION over CONFIGURATION.      ║
║          Use children, render props, or slots.       ║
║          Avoid 20-prop mega-components.              ║
║                                                      ║
║  RULE 5: Export from a SINGLE barrel file.           ║
║          hud-ui-kit.tsx = the official kit.           ║
║          Don't scatter HUD components across files.  ║
║                                                      ║
║  RULE 6: TypeScript REQUIRED.                        ║
║          Every prop must be typed.                   ║
║          No `any`. No `as any`. No exceptions.       ║
║                                                      ║
╚══════════════════════════════════════════════════════╝
```

---

## 18 — ICON & LOGO SYSTEM

### App Logo

```
MOONWITNESS LOGO SPECIFICATIONS
────────────────────────────────────────
Symbol:       Crescent moon + cosmic orbit ring
Style:        Geometric, sharp edges, NO soft gradients
Color:        --cyber-cyan (#00F0FF) primary
              --cyber-dark (#05070A) background
Minimum size: 24×24px (favicon) / 32×32px (UI usage)
Clear space:  1× logo height on all sides

VARIANTS:
├── Full logo    → Crescent + "MOONWITNESS" wordmark (Orbitron)
├── Icon only    → Crescent symbol (for favicon, mobile, taskbar)
├── Monochrome   → Single color version for dark/light contexts
└── Badge        → Octagonal frame (.hud-clip-rune) for certificates
```

### Logo Usage Rules

```
01. Logo ALWAYS uses Orbitron font for wordmark. Never substitute.
02. Logo must sit on dark background (#030508 – #0A0F17). No light BG.
03. Logo may NOT be rotated, stretched, or recolored outside the approved variants.
04. Minimum clear space = 1× the height of the crescent symbol.
05. In-app header: use Icon variant (crescent only) at w-6 h-6.
06. Splash/boot screen: use Full logo centered with breathing glow animation.
```

### Icon System

**Library:** `lucide-react` — the ONLY permitted icon library.

```
╔══════════════════════════════════════════════════════╗
║              ICON SIZE PROTOCOL                      ║
╠══════════════════════════════════════════════════════╣
║                                                      ║
║  Micro (Taskbar/Badge)     w-3 h-3     12×12px      ║
║  Small (Navbar)            w-3.5 h-3.5 14×14px      ║
║  Default (Card header)     w-4 h-4     16×16px      ║
║  Medium (Panel header)     w-5 h-5     20×20px      ║
║  Large (Hero/Modal/Empty)  w-6 h-6     24×24px      ║
║                                                      ║
║  ⚠️ NO OTHER SIZES PERMITTED.                       ║
║  Pick from this scale. No w-7, no w-8, no w-10.    ║
║                                                      ║
╚══════════════════════════════════════════════════════╝
```

### Icon Laws

```
01. Icons INHERIT accent color from parent. Never hardcode icon color.
02. Interactive icons MUST have text label (icon-only = toolbar + tooltip only).
03. Stroke width = Lucide default (1.5px). NEVER override strokeWidth.
04. Decorative icons → aria-hidden="true"
    Functional icons → aria-label="[description]"
05. Animated icons (animate-pulse) reserved for:
    • SYS ONLINE indicator
    • Audio player when playing
    • Active loading states
06. NO mixing Lucide with Heroicons, Font Awesome, or any other library.
07. Icon in badge container → padding: p-1.5 (6px all sides)
```

### Semantic Icon Map

| Icon | Lucide Name | Meaning |
|------|-------------|---------|
| 📖 | `BookOpen` | Qur'an, Scriptures |
| 📜 | `Scroll` | Hadith, historical docs |
| 🌙 | `Moon` | Lunar, astronomy |
| 🧭 | `Compass` | Qibla, navigation |
| 🛡️ | `ShieldCheck` | Mission, protection |
| 🌍 | `Globe` | Global unity |
| ✨ | `Sparkles` | Divine wisdom |
| 📡 | `Satellite` | Global observation |
| 🗄️ | `Database` | Archive, database |
| 🔀 | `GitBranch` | Sanad tree, lineage |
| 💻 | `Terminal` | System console |
| 🔍 | `Search` | Query operations |
| ❌ | `X` | Close, cancel |
| ⚡ | `Activity` | Telemetry, charts |
| 🔥 | `Flame` | Trending, viral |
| ⚠️ | `AlertTriangle` | Error, warning |

---

## 19 — UNIFORM SIZING PROTOCOL

> **Consistency is not optional. Every element follows the grid.**

### Component Size Matrix

```
╔════════════════════════════════════════════════════════════╗
║              UNIFORM SIZING — MANDATORY                    ║
╠════════════════════════════════════════════════════════════╣
║                                                            ║
║  MODULE CARDS (grid items):                                ║
║  ├── Min height: 120px                                     ║
║  ├── Padding: p-5 (mobile) → p-6 (desktop)                ║
║  ├── Border: 1px solid [accent]/30                         ║
║  ├── Icon: w-5 h-5 in badge container (p-2)               ║
║  └── Title: text-sm font-bold tracking-wide UPPERCASE      ║
║                                                            ║
║  STAT BOXES (telemetry grid):                              ║
║  ├── Height: auto (content-driven)                         ║
║  ├── Padding: p-4                                          ║
║  ├── Value: text-2xl font-black                            ║
║  ├── Label: text-[9px] tracking-widest UPPERCASE           ║
║  └── Grid: grid-cols-2 md:grid-cols-4 gap-3                ║
║                                                            ║
║  PANEL HEADERS:                                            ║
║  ├── Height: auto (single line preferred)                  ║
║  ├── Padding: px-4 py-3                                    ║
║  ├── Title: text-[10px] font-black tracking-widest         ║
║  ├── Status dot: w-1.5 h-1.5 rounded-full animate-pulse   ║
║  └── Icon: w-4 h-4                                        ║
║                                                            ║
║  BADGES / TAGS:                                            ║
║  ├── Padding: px-2 py-0.5                                  ║
║  ├── Font: text-[8px] font-bold tracking-widest            ║
║  ├── Border: 1px solid [accent]/50                         ║
║  └── Clip: .hud-clip-tag (6px chamfer)                     ║
║                                                            ║
║  BUTTONS (HUDButton):                                      ║
║  ├── Padding: px-4 py-2 (standard) / px-3 py-1.5 (small)  ║
║  ├── Font: text-[10px] font-bold tracking-widest           ║
║  ├── Min height: 36px (meets 44px touch with padding)      ║
║  └── Clip: .hud-clip-btn (10px chamfer)                    ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
```

### Size Consistency Rules

```
01. ALL cards in a grid MUST be the same height within their row.
    Use CSS Grid with auto-rows or min-height to enforce.

02. ALL stat boxes in a telemetry grid MUST use identical padding and font sizes.
    No "special" stat boxes with different sizing.

03. ALL panel headers MUST use HUDPanelHeader. No custom header divs.
    This guarantees uniform height, icon size, and status indicator placement.

04. ALL badges/tags MUST use .hud-clip-tag class and the 8px/9px font scale.
    No ad-hoc badge styling.

05. Spacing between sections is ALWAYS space-y-6 (24px).
    Exception: dense telemetry grids may use space-y-3 or space-y-4.

06. Page padding is ALWAYS px-4 sm:px-6 on the outer container.
    Content max-width: max-w-4xl (896px) + mx-auto.
```

---

## ◈ THE TEN COMMANDMENTS

```
╔══════════════════════════════════════════════════════╗
║         ◈ THE TEN COMMANDMENTS OF MOONWITNESS ◈      ║
╠══════════════════════════════════════════════════════╣
║                                                      ║
║  01. EVERY PAGE IS A COMMAND CENTER.                 ║
║      The operator commands. The screen responds.     ║
║                                                      ║
║  02. EVERY PANEL IS A HARDWARE MODULE.               ║
║      It has purpose, status, and hierarchy.          ║
║                                                      ║
║  03. EVERY ACTION IS A SYSTEM COMMAND.               ║
║      Buttons are [COMMANDS]. Users execute.          ║
║                                                      ║
║  04. EVERY ANIMATION COMMUNICATES.                   ║
║      If it moves, it means something.                ║
║                                                      ║
║  05. STRUCTURE BEFORE DECORATION.                    ║
║      Never sacrifice clarity for visual effect.      ║
║                                                      ║
║  06. CONSISTENCY > NOVELTY.                          ║
║      Reuse components. Justify new patterns.         ║
║                                                      ║
║  07. EVERY COMPONENT IS REUSABLE.                    ║
║      Write once. Parameterize. Never duplicate.      ║
║                                                      ║
║  08. COLOR = MEANING.                                ║
║      Cyan=system. Green=mission. Yellow=celestial.   ║
║      Purple=knowledge. Pink=danger.                  ║
║                                                      ║
║  09. ZERO VISUAL NOISE.                              ║
║      If it has no purpose, delete it.                ║
║                                                      ║
║  10. THIS IS AN OS, NOT A WEBSITE.                   ║
║      Think terminal. Think mission control.          ║
║      The moment it looks "webby" — fix it.           ║
║                                                      ║
╚══════════════════════════════════════════════════════╝
```

---

---

# XIV. THE 5-LAYER DESIGN ASSET ARCHITECTURE & GOLDEN RATIO

To maintain a million-dollar product aesthetic on par with Apple, Nothing, Linear, Vercel, Star Citizen, and NASA JPL, MoonWitness OS enforces strict stratification of visual assets. **Never rely entirely on static AI images.**

## 1. THE 5-LAYER HIERARCHY (SYSTEM ➔ HUD ➔ OBJECT ➔ TEXT)
```
LAYER 1: BACKGROUND  →  Grid, Noise, Stars, Nebula, Particles, Gradient Scanlines
    ↓
LAYER 2: 3D OBJECTS  →  Moon Spheres, Earth Horizon, Sun Corona, Satellites, Qibla Vectors (Three.js / Blender / Spline)
    ↓
LAYER 3: HUD SYSTEM  →  SVG Tactical Frames, Cut Corners, Radar Sweep, Telemetry Wireframes
    ↓
LAYER 4: KNOWLEDGE   →  Interconnected Cards, Quantum Pipelines, Timelines, Equalizer Charts
    ↓
LAYER 5: TYPOGRAPHY  →  Apple & NASA Tier Monospace Headings, Descriptions, Command Buttons
```

## 2. THE ASSET GOLDEN RATIO
```
20% AI IMAGES (Only 4K Hero Backgrounds, Nebulas, Galaxies, & Observatory Vistas)
────────────
30% 3D ASSETS (Interactive Spheres, Orbits, Celestial Bodies)
────────────
30% SVG HUD   (Vector Frames, RGB Pipeline, Diagrams, Timelines for razor sharpness)
────────────
20% MOTION    (Lottie/Rive, CSS scanlines, radar sweeps, glowing laser pipelines)
```

## 3. ASSET CREATION MATRIX
* **Blender / Spline / Three.js:** 3D Moon, Earth, Sun, Satellite orbits, Interactive celestial maps.
* **SVG Vectors:** All HUD components, RGB ➔ LIGHT icons, timelines, and command decks.
* **Motion / CSS / Lottie:** Radar sweep, telemetry streams, glowing optical connectors (`──►`).
* **AI Artwork (20% cap):** Deep sky backgrounds, galaxy backdrops, and cloud/nebula texturing.

---

```
◈ MOONWITNESS OS V6.5 — DIVINE OBSERVATION TERMINAL ◈
Document Status: ACTIVE — Version 2.1 (5-Layer Asset Architecture Enforcing)
Source: moonwitness.css · hud-ui-kit.tsx (18 components) · hud-modal.tsx · 44+ modules
All design decisions must be traceable to this Bible.
END TRANSMISSION.
```



## 05 — THE UNIVERSAL CATCHER (ZERO LEGACY ROUTING ARCHITECTURE)

**IMPORTANT: MoonWitness OS V3.0 utilizes a 100% Dynamic Routing Architecture ("The Universal Catcher").**

The pp/ directory MUST remain completely clean. Do NOT create manual route folders (like pp/knowledge or pp/erp).
All modular routing is handled automatically by the following files:
- pp/[module_slug]/layout.tsx: Dynamically applies the correct UI Shell (ErpLayout vs StandardLayout) based on the module's 
avPlacement.
- pp/[module_slug]/page.tsx: Redirects to or renders the default route of the module.
- pp/[module_slug]/[route_slug]/page.tsx: The Universal Catcher that dynamically loads the correct component from MODULE_REGISTRY in @modules/index.ts.

### How to Add a New Page/Module:
1. Create your component inside @modules/[module_name]/views/.
2. Register the route in @modules/[module_name]/index.ts under the outes array.
3. The URL /[module_name]/[route_slug] will immediately become active.
4. **Never** touch the pp/ folder. All shared UI components go in @core/widgets/ or @core/ui/.
