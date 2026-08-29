# ◈ ENTERPRISE DESIGN SYSTEM & SEMANTIC TOKEN RULES

```
╔══════════════════════════════════════════════════════════════╗
║  CLASSIFICATION: INTERNAL — CANONICAL DESIGN SYSTEM RULES    ║
║  FRAMEWORK:      SHADCN/UI & TAILWIND CSS V4 ARCHITECTURE    ║
║  STATUS:         ████████████████████████████████ ACTIVE     ║
╚══════════════════════════════════════════════════════════════╝
```

---

## 🏛️ PILLAR I: CANONICAL DESIGN TOKENS & SURFACES
- **LAW 01 — Single Theme Source of Truth**: All semantic tokens are declared exclusively in `packages/ui/src/styles/globals.css`. Never create parallel TypeScript color palettes or app-local theme systems.
- **LAW 02 — Zero Custom Visual Utilities**: Never declare or use pseudo-sci-fi utilities (`.clip-card`, `.clip-hero`, `.clip-btn`, `.clip-tag`, `.clip-rune`, `.corner-box`, `.panel-glass`, `.laser-*`, `.glow-*`, `.bg-space`). Use standard Tailwind rounded corners (`rounded-xl`, `rounded-lg`, `rounded-md`) and standard surface backgrounds (`bg-card`, `bg-background`).
- **LAW 03 — Zero Raw Color Literals**: Never hardcode inline hex colors (`#00F0FF`, `#040814`, `#080E1C`), raw RGB/HSL, or arbitrary utilities (`bg-[#...]`, `text-[#...]`, `border-[#...]`, `shadow-[...rgba(...)]`) in UI components.
- **LAW 04 — Semantic Status Tokens**: Use only `success`, `warning`, and `info` status tokens with foreground pairs defined in `:root` and `.dark` via `@theme inline`.
- **LAW 05 — Typography Standards**: Use Geist for `font-sans`, JetBrains Mono / Geist Mono for `font-mono`, and Amiri for `font-arabic`. Orbitron is strictly banned. Headings must use normal sentence/title case.

### Audit scope and explicit exceptions

`node scripts/audit-rules.mjs` inventories every text file under `apps/`, `packages/`, `scripts/`, `docs/`, and `.agents/`, plus root configuration and documentation. It classifies application source, theme, domain visualization, tests, docs, and tooling; generated directories are counted as excluded inventory, and scripts are never silently skipped.

The following are intentional exceptions, reported as `domainExceptions` rather than ignored:

- `packages/ui/src/tokens/**` and `packages/ui/src/styles/globals.css`: canonical token and utility declarations may contain the palette values and supported color functions. Theme parity still verifies the canonical token set and both portals' shared-theme import.
- `apps/web/views/seismix/**`: canvas, waveform, tectonic plate, and severity palettes may use explicit colors because they encode domain data rather than UI decoration.
- `packages/ui/src/widgets/graph/**`, `packages/ui/src/widgets/monitoring/**`, and named celestial/radar/compass/sphere visualizers: SVG, canvas, chart colors, shadows, and motion may encode domain measurements. Keep those values local to the visualization data layer; do not use the exception for ordinary layout or primary UI surfaces.

All exceptions remain visible with file, line, rule, kind, and reason. Documentation examples are scanned and classified but do not become source violations. Supported authored color formats are hex, `rgb(a)`, `hsl(a)`, and token references; `oklch`, `oklab`, `hwb`, `lab`, `lch`, `color()`, `color-mix()`, and `device-cmyk()` require design review.

### Auditor boundary

The design-token registry (`packages/ui/src/tokens/**`) and shared theme stylesheet (`packages/ui/src/styles/globals.css`, including `.dark`) are canonical infrastructure. The auditor itself and governance documentation are classified as tooling/documentation. Every active source file under `apps/` or `packages/` must use canonical semantic theme tokens and must not reference `bg-cyber-*`, `text-cyber-*`, `border-cyber-*`, or other legacy aliases.

---

## 🏛️ PILLAR II: THEME PARITY & ACCESSIBILITY
- **LAW 06 — 100% Light & Dark Theme Parity**: Every component, dialog, dropdown, card, and table must render with high contrast and readable surfaces in Light, Dark, and System modes. No hardcoded dark backgrounds.
- **LAW 07 — Enterprise Terminology**: Use standard professional SaaS terminology (`Dashboard`, `Overview`, `Users`, `Projects`, `Tasks`, `Activity`, `Settings`, `Profile`, `Notifications`, `Integrations`, `Reports`, `Audit Log`, `System Health`, `Quick Actions`, `Data Table`).
- **LAW 08 — Clean Surfaces & Accessibility**: Avoid decorative transparency stacks, excessive blur, and glowing borders. Ensure all interactive controls have accessible focus rings (`ring-ring`) and accessible contrast.
