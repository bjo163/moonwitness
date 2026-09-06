# Repository audit scripts

## Commands

- `node scripts/audit-rules.mjs`: source governance, shared theme tokens,
  light/dark contrast, and the migrated public research UI.
- `pnpm audit:rules`: canonical wrapper, including collector integrity and
  supplemental SQL/localhost checks. Tracked debt is reported explicitly.
- `pnpm test:scripts`: all script regression tests through Vitest.
  These tests also run with `pnpm test` and the existing CI test command.

## Ownership

- `audit-rules.mjs` orchestrates source checks and retains the collector registry.
- Its `SHARED UI BOUNDARY` check reports raw form controls in `apps/` when the
  matching `@workspace/ui` primitive is not imported. Findings are advisory so
  domain-specific controls can be migrated incrementally without blocking CI.
- `COMPONENT REUSE & COMPOSITION` also reports oversized local component counts,
  repeated custom JSX, and long utility-class strings repeated three or more
  times. Treat each finding as a refactor queue: extract a named component,
  data-driven row, or shared variant before adding another copy.
- `component-health.mjs` scores TSX components using lines, props, conditionals,
  nested JSX, and imports. `extract-now` means decompose before extending;
  `review` means inspect before copying. Generic UI belongs in `packages/ui`;
  domain-bound logic stays in its owning package. Renaming or wrapping a
  duplicate does not resolve the finding.
- `audit-consistency.mjs` checks cross-file conventions: one UI import style per
  file, explicit button types, and focused file/component naming. Fix the
  contract at the source; do not silence it with aliases or wrapper exports.
  Use the public `@workspace/ui` entrypoint for feature code unless a documented
  package-level subpath is required.
- Its `color-contract` finding covers dynamic inline colors in ordinary UI.
  Resolve them with `resolveSemanticColor()` from `@workspace/ui`; chart,
  map, seismix, Tajweed, and celestial files remain explicit domain exceptions
  until their visual token registries are migrated.
- `audit-theme-tokens.mjs` checks required light/dark tokens, Tailwind color
  mappings, duplicate declarations, direct self-references, and text contrast.
- `audit-research-ui.mjs` checks literal classes in the migrated public home,
  hero, and knowledge components. Other legacy views are outside this check.
- `audit-collector-contract.mjs` checks collector coverage. Supplemental collectors
  share one source snapshot per run instead of traversing and reading it twice.
- `umbrella-*.mjs` produces evidence, scores, and generated audit reports.
  Use the existing package commands for report validation and generation.

## Limits

Contrast checks require at least 4.5:1 for the configured normal-text pairs in
both themes. They currently resolve opaque 3/6-digit hex colors. Unsupported
formats are reported as unverified rather than silently passing. Extending the
palette to alpha, RGB, or OKLCH requires a tested resolver and compositing rules.
Charts and non-text border tokens are not normal-text contrast pairs.

Static checks do not establish complete accessibility or inspect every rendered
style. Browser review remains necessary for layout, focus, dynamic classes,
color overlays, mobile reflow, and Arabic reading. A passing source audit does
not clear tracked debt or certify deployment readiness.

Font defaults belong in the non-inline Tailwind theme block so generated font
utilities continue to reference the variables supplied by the app layouts.
Semantic color mappings remain in the inline theme block. CSS owns palette
values; the TypeScript token API references those variables.

All `scripts/*.test.mjs` tests use Vitest, including those using Node's assertion
library. Do not introduce a second test runner without updating test discovery.
