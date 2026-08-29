# ◈ MOONWITNESS — ENTERPRISE DESIGN SYSTEM BIBLE

```
╔══════════════════════════════════════════════════════════════╗
║  CLASSIFICATION: INTERNAL — DESIGN AUTHORITY DOCUMENT       ║
║  CODENAME:       ENTERPRISE SHADCN/UI & VERCEL ARCHITECTURE  ║
║  SYSTEM:         MoonWitness Operating System               ║
║  STATUS:         ████████████████████████████████ ACTIVE     ║
╚══════════════════════════════════════════════════════════════╝
```

> **Constitutional Design Authority**: Every component, layout, token, and view in MoonWitness must conform strictly to standard shadcn/ui semantic tokens, Vercel enterprise ergonomics, and Tailwind CSS v4 conventions.

---

## 01 — IDENTITY & DESIGN PHILOSOPHY

MoonWitness is a **Unified Knowledge Platform & Celestial Observatory** — an enterprise-grade administrative and knowledge platform for Quranic knowledge, celestial calculations, and global intelligence.

```
VISUAL DNA & ARCHITECTURE:
├── Single Theme Source: packages/ui/src/styles/globals.css
├── Standard Semantic Tokens: background, foreground, card, primary, secondary, muted, accent, destructive
├── Semantic Status Tokens: success, warning, info
├── Standard Surfaces: rounded-xl, rounded-2xl, rounded-lg, rounded-md, border-border, shadow-sm
└── Clean Typography: Geist Sans (font-sans), JetBrains Mono (font-mono), Amiri Arabic (font-arabic)
```

### Brand Voice
- **Professional**: Clean, distraction-free, accessible, high contrast.
- **Sacred**: Honoring Quranic scriptures with pristine Uthmani orthography.
- **Predictable**: Enterprise SaaS standards, no decorative sci-fi or retro-hacker styling.

### Absolute Terminology & Aesthetic Ban
❌ Banned terms and tokens:
- `cyber`, `tactical`, `HUD`, `cosmic`, `neon`, `laser`, `glow`, `sci-fi`, `hacker`, `retro terminal`, `holographic`
- `mission control`, `operator clearance`, `command shell`, `secure link`, `signal active`, `telemetry aesthetic`
- `Orbitron` font
- Custom clips: `clip-card`, `clip-tag`, `corner-box`, `panel-glass`, `laser-*`, `glow-*`, `bg-space`
- Raw color literals: `bg-[#...]`, `text-[#...]`, `border-[#...]`, `shadow-[...rgba(...)]`

---

## 02 — CANONICAL SEMANTIC PALETTE (SHADCN STANDARDS)

| Token | Class | Light Mode | Dark Mode | Usage |
|---|---|---|---|---|
| Background | `bg-background` | `#ffffff` | `#090d16` | Main page canvas |
| Foreground | `text-foreground` | `#09090b` | `#f4f4f5` | Primary body text |
| Card | `bg-card` | `#ffffff` | `#0f172a` | Elevated surface cards |
| Card Foreground | `text-card-foreground` | `#09090b` | `#f4f4f5` | Card text |
| Primary | `bg-primary` / `text-primary` | `#0284c7` | `#38bdf8` | Primary active states & buttons |
| Primary Foreground | `text-primary-foreground` | `#ffffff` | `#090d16` | Text on primary buttons |
| Secondary | `bg-secondary` / `text-secondary` | `#f4f4f5` | `#1e293b` | Secondary actions & tags |
| Muted | `text-muted-foreground` / `bg-muted` | `#71717a` / `#f4f4f5` | `#94a3b8` / `#1e293b` | Metadata and secondary labels |
| Accent | `bg-accent` / `text-accent` | `#f4f4f5` / `#0284c7` | `#1e293b` / `#38bdf8` | Interactive highlights |
| Destructive | `text-destructive` / `bg-destructive` | `#ef4444` / `#ef4444` | `#f43f5e` / `#f43f5e` | Danger, errors, critical |
| Border | `border-border` | `#e4e4e7` | `rgba(255,255,255,0.1)` | Surface borders |
| Input | `border-input` | `#e4e4e7` | `rgba(255,255,255,0.15)` | Form input borders |
| Ring | `ring-ring` | `#0284c7` | `#38bdf8` | Focus rings |

### Semantic Status Tokens

| Status | Background | Text / Foreground | Border |
|---|---|---|---|
| **Success** | `bg-success/10` | `text-success` | `border-success/30` |
| **Warning** | `bg-warning/10` | `text-warning` | `border-warning/30` |
| **Info** | `bg-info/10` | `text-info` | `border-info/30` |

---

## 03 — TYPOGRAPHY SYSTEM

| Role | Font | CSS Variable | Usage |
|---|---|---|---|
| **Headings & Body** | Geist Sans | `var(--font-sans)` | All titles, cards, descriptions |
| **Telemetry & Code** | JetBrains Mono | `var(--font-mono)` | Numeric values, code, identifiers |
| **Arabic Text** | Amiri | `var(--font-arabic)` | Quranic/Arabic text (`.arabic-text`) |

---

## 04 — ENTERPRISE TERMINOLOGY STANDARD

| ❌ Theatrical / Legacy | ✅ Enterprise Standard |
|---|---|
| `DEV COMMAND SHELL` | `Developer Console` |
| `QUICK DIRECTIVES` | `Quick Actions` |
| `LIVE DIAGNOSTIC` | `System Health` |
| `OPERATOR CLEARANCE` | `Access Verification` |
| `COMMIT MORPH` | `Save Changes` |
| `INITIALIZE INSTANCE` | `Create Record` |
| `ABORT` | `Cancel` |
| `TRANSMIT` | `Post Comment` / `Submit` |
| `SYNCHRONIZING` | `Loading` / `Updating` |
