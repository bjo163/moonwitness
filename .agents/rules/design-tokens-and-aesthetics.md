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

---

## 🏛️ PILLAR II: THEME PARITY & ACCESSIBILITY
- **LAW 06 — 100% Light & Dark Theme Parity**: Every component, dialog, dropdown, card, and table must render with high contrast and readable surfaces in Light, Dark, and System modes. No hardcoded dark backgrounds.
- **LAW 07 — Enterprise Terminology**: Use standard professional SaaS terminology (`Dashboard`, `Overview`, `Users`, `Projects`, `Tasks`, `Activity`, `Settings`, `Profile`, `Notifications`, `Integrations`, `Reports`, `Audit Log`, `System Health`, `Quick Actions`, `Data Table`).
- **LAW 08 — Clean Surfaces & Accessibility**: Avoid decorative transparency stacks, excessive blur, and glowing borders. Ensure all interactive controls have accessible focus rings (`ring-ring`) and accessible contrast.
