# Research UI guidelines

MoonWitness presents sources, references, and research in a compact document layout.
This is the visual specification for the shared design system, not a separate theme.

## Typography and density

- Use Geist for interface text, JetBrains Mono for identifiers, and Amiri with
  arabic-text for Arabic passages. Keep source content unchanged.
- Page titles use text-2xl with optional sm:text-3xl. Section titles use text-lg
  or text-xl. Use sentence case and normal letter spacing.
- Prose uses text-base leading-relaxed and max-w-prose. Metadata uses text-xs;
  navigation and tables use text-sm. Density comes from spacing, not tiny text.
- Outer content uses max-w-6xl; reading paragraphs remain narrower. Use py-6 or
  py-8 sections, gap-3 to gap-6, and p-3 or p-4 grouped controls.
- Allow navbar clearance at the top. Avoid full-height promotional sections.

## Surfaces and information

Prefer headings, paragraphs, lists, tables, and thin separators. Cards should group
independent controls or status, with rounded-md and no default shadow. Avoid
nested cards, decorative gradients, glowing shapes, blurred surfaces, uppercase
headings, oversized numbers, and decorative status indicators.

Keep source names, references, editions, revisions, and provenance near the
relevant passage. Clearly label translations and derived analysis. Explain
content in reader language; transport details belong in technical documentation.
Charts and maps may use domain-specific color and dimensions when necessary.

## Accessibility

Keep Light, Dark, and System modes. Use semantic tokens and visible keyboard
focus. Preserve 44px touch controls where appropriate and readable Arabic
harakat. Check mobile reflow at 320px and 200% zoom; only wide data tables may
need their own horizontal scrolling region. Never compress reading line height
or disable user text scaling to fit more information.

## Verification and scope

Run node scripts/audit-rules.mjs and pnpm audit:rules. The publication-style
checks cover apps/web/components/hero, home, and knowledge. They inspect literal
className strings for oversized display type, wide letter spacing, uppercase,
decorative blur/gradients/shadows, and oversized section padding. They are
regression checks for the migrated public surface, not a complete visual audit
or a claim that every older view has been migrated. Review composed classes,
content hierarchy, contrast, responsiveness, and focus in the browser.
