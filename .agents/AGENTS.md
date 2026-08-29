# ◈ MOONWITNESS — DESIGN & ARCHITECTURE BIBLE V9.5

```
╔══════════════════════════════════════════════════════════════╗
║  CLASSIFICATION: INTERNAL — DESIGN AUTHORITY DOCUMENT       ║
║  CODENAME:       ENTERPRISE SHADCN/UI & VERCEL ARCHITECTURE  ║
║  SYSTEM:         MoonWitness Operating System V9.5          ║
║  STATUS:         ████════════════════════════════ ACTIVE     ║
╚══════════════════════════════════════════════════════════════╝
```

> **This is not documentation. This is constitutional law.**
> Every component, layout, token, and view in MoonWitness must conform to standard shadcn/ui, Vercel design system, and Tailwind CSS v4 conventions.

---

## 01 — IDENTITY & DESIGN PHILOSOPHY

MoonWitness is a **Unified Sacred Knowledge & Celestial Observation Platform** — an enterprise-grade web operating system for Quranic knowledge, celestial telemetry, and global peace intelligence.

```
VISUAL DNA & 4-LAYER ASSET ARCHITECTURE:
├── Layer 1: Clean High-Contrast Backgrounds (Light #ffffff, Dark #090d16)
├── Layer 2: 3D Celestial Simulators (Photorealistic Moon Spheres & Horizons)
├── Layer 3: Smooth Glass Panels (bg-card/90 border border-border/40 backdrop-blur-md)
└── Layer 4: Standard Typography (Geist Sans, JetBrains Mono, Amiri Arabic)
```

### Brand Voice

| Attribute | Description |
|-----------|-------------|
| **Serious** | Research-Grade Observatory — precise, clean, distraction-free |
| **Sacred** | Honoring the source of Quranic knowledge with pure Uthmani orthography |
| **Precise** | Every element is accessible, contrast-compliant, and responsive |
| **Alive** | Responsive states, smooth theme transitions, and clear feedbacks |

### Forbidden Archetypes

❌ Retro Hacker/Gamer Terminal (no `>_`, no `//`, no neon glow, no `cyber-*` tokens) · ❌ Cluttered unstructured dashboards

---

## 02 — COLOR SYSTEM & DESIGN TOKENS

### Primary Semantic Palette (Standard shadcn/ui)

| Token | Class | Light Mode | Dark Mode | Purpose |
|---|---|---|---|---|
| Background | `bg-background` | `#ffffff` | `#090d16` | Main page canvas |
| Foreground | `text-foreground` | `#09090b` | `#f4f4f5` | Primary body text |
| Card | `bg-card` | `#ffffff` | `#0f172a` | Elevated surface cards |
| Primary | `bg-primary` / `text-primary` | `#0284c7` | `#38bdf8` | Primary brand & active states |
| Secondary | `bg-secondary` / `text-secondary` | `#f4f4f5` | `#1e293b` | Secondary actions & badges |
| Muted | `text-muted-foreground` | `#71717a` | `#94a3b8` | Metadata and secondary labels |
| Destructive | `text-destructive` / `bg-destructive` | `#ef4444` | `#f43f5e` | Danger, error, critical |
| Border | `border-border` | `#e4e4e7` | `rgba(255,255,255,0.1)` | Surface borders |

### Semantic Status Tokens

| Semantic State | Text Class | Background Class | Border Class |
|---|---|---|---|
| **Success** | `text-emerald-600 dark:text-emerald-400` | `bg-emerald-500/10` | `border-emerald-500/30` |
| **Warning** | `text-amber-600 dark:text-amber-400` | `bg-amber-500/10` | `border-amber-500/30` |
| **Info** | `text-sky-600 dark:text-sky-400` | `bg-sky-500/10` | `border-sky-500/30` |
| **Accent / AI** | `text-purple-600 dark:text-purple-400` | `bg-purple-500/10` | `border-purple-500/30` |
| **Destructive** | `text-rose-600 dark:text-rose-400` | `bg-rose-500/10` | `border-rose-500/30` |

---

## 03 — SMOOTH SHADCN/UI GEOMETRIC CONTAINERS

```css
rounded-xl   → 12px smooth rounded corners (Standard Cards & Panels)
rounded-2xl  → 16px smooth rounded corners (Hero Sections & Large Blocks)
rounded-lg   → 8px smooth rounded corners (Buttons & Inputs)
rounded-md   → 6px smooth rounded corners (Tags & Badges)
rounded-full → Circular geometry (Icons & Avatars)
```

---

## 04 — TYPOGRAPHY SYSTEM

| Role | Font | Usage |
|---|---|---|
| **Headings & Body** | Geist Sans (`font-sans`) | All titles, cards, descriptions |
| **Telemetry & Code** | JetBrains Mono (`font-mono`) | Numeric values, telemetry, code |
| **Arabic Text** | Amiri (`font-arabic`) | All Quranic/Arabic text (`.arabic-text`) |

---

## 05 — DUAL-PORTAL MONOREPO ARCHITECTURE

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                       MOONWITNESS DUAL-PORTAL SYSTEM                        │
│   ┌──────────────────────────────────┐   ┌──────────────────────────────┐   │
│   │   Web Portal (Port 3000)         │   │ Command Center (Port 3001)   │   │
│   │   Next.js 16 · Modern Portal     │   │ Next.js 16 · Operations Gov  │   │
│   └─────────────────┬────────────────┘   └──────────────┬───────────────┘   │
└─────────────────────┼───────────────────────────────────┼───────────────────┘
                      │                                   │
                      ▼                                   ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│          SHARED PACKAGES (@workspace/ui, @workspace/hooks, @workspace/state) │
│    • Universal Command Palette (Cmd+K)    • 3D Celestial Visualizers        │
│    • ResourceTable & ContextBlock         • Web Audio Sound Engine          │
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

## 06 — THE 30 SUPREME CONSTITUTIONAL LAWS (V9.5)

```
╔══════════════════════════════════════════════════════════════════════════╗
║              ◈ THE 30 SUPREME CONSTITUTIONAL LAWS (V9.5) ◈               ║
╠══════════════════════════════════════════════════════════════════════════╣
║                                                                          ║
║  PILLAR I: VISUAL DNA & SHADCN/UI DESIGN TOKENS                          ║
║  01. Standard shadcn Palette (Zero non-standard raw tokens)              ║
║  02. Continuous Rounded Containers (rounded-xl, rounded-2xl, rounded-lg) ║
║  03. Standard Typography (Geist Sans, JetBrains Mono, Amiri Arabic)      ║
║  04. Unified Glassmorphism & Refined Elevation (backdrop-blur-md)        ║
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
║  30. Modern UX & Terminology Discipline (Standard Vercel/shadcn terms)   ║
║                                                                          ║
╚══════════════════════════════════════════════════════════════════════════╝
```
