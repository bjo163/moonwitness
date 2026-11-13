---
name: research-publication-typography-measure
description: >-
  Use this skill when auditing or implementing text-first research typography, 65-75 character measure line lengths,
  leading-relaxed prose, and Amiri Arabic font baseline alignments for sacred text.
---

# Research Publication Typography & Measure (Subatomic Skill)

Governs textual ergonomics and typography in research publications, Quranic study views, and technical documentation across MoonWitness (`docs/RESEARCH-UI.md`).

## Typography Standards & Scale

| Text Role | Tailwind Class | Font Family | Ideal Measure |
|---|---|---|---|
| Page Title | `text-2xl font-semibold` | Geist Sans (`font-sans`) | Single line |
| Section Title | `text-lg font-medium` | Geist Sans (`font-sans`) | Single line |
| Reading Prose | `text-base leading-relaxed` | Geist Sans (`font-sans`) | **65–75 characters** (`max-w-prose`) |
| Quranic Scripture | `text-2xl font-arabic` | Amiri (`font-arabic`) | Right-to-Left (RTL), line-height $\ge 2.2$ |
| Metadata / Badges | `text-xs text-muted-foreground` | Geist Sans (`font-sans`) | Inline |
| Numeric / Code | `font-mono text-sm` | JetBrains Mono (`font-mono`) | Compact |

## Arabic Script Font Baseline Invariants
To eliminate clipping of Arabic diacritics (fathah, kasrah, shaddah, sukun, dagger alif):
```css
.arabic-text {
  font-family: var(--font-arabic), "Amiri", serif;
  direction: rtl;
  text-align: right;
  line-height: 2.4 !important;
  font-feature-settings: "cv01", "cv02";
  word-spacing: 0.15em;
}
```

## Anti-Patterns
- Never shrink prose measure below 50 characters or expand beyond 85 characters without multi-column layout.
- Never force uppercase styling (`uppercase tracking-widest`) on long sentence headings.

## Canonical Source Files
- `docs/RESEARCH-UI.md`
- `packages/ui/src/styles/globals.css`
- `apps/web/app/surah/`

## Verification Command
```bash
node scripts/audit-rules.mjs
```
