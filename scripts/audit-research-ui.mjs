/**
 * Research UI guidelines auditor for MoonWitness publication surfaces.
 * Enforces text-first density, academic reading typography, compact section rhythm,
 * and restrained surface presentation according to docs/RESEARCH-UI.md and AGENTS.md.
 */
export function researchUiFindings(file, content) {
  const normalizedPath = file.replaceAll('\\', '/')
  
  // Scope: public publication surfaces in apps/web/components
  // Exclude 3D canvas shader layers that need internal scene blur filters
  if (!/^apps\/web\/components\/(?:hero|home|knowledge|auth|layouts|observatory|profile|shell)\/.*\.tsx$/.test(normalizedPath)) return []
  if (normalizedPath.includes('cosmic-3d-background.tsx')) return []

  const findings = []
  const rules = [
    // 1. Display typography: text-2xl or text-3xl for page titles, text-lg/xl for sections; reject oversized display type
    [/^(?:.*:)?text-[4-9]xl$/, 'Use text-2xl or text-3xl page titles (avoid oversized display type)'],
    [/^(?:.*:)?text-\[(?:3[6-9]|[4-9]\d|\d{3,})px\]$/, 'Use standard text-2xl/3xl typography tokens instead of arbitrary large px'],

    // 2. Text case: sentence case for headings and reading prose; avoid shouting uppercase
    [/^(?:.*:)?uppercase$/, 'Use sentence case for headings and reading text (avoid loud uppercase)'],

    // 3. Letter spacing: normal or tight tracking; avoid over-spaced tracking
    [/^(?:.*:)?tracking-(?:widest|wider|\[.+\])$/, 'Use normal or tight letter spacing for compact readability'],

    // 4. Decorative surface effects: avoid blur, gradients, and drop shadows
    [/^(?:.*:)?(?:backdrop-blur.*|blur-.*|bg-gradient-.*|bg-linear-.*|bg-radial-.*|shadow-(?:sm|md|lg|xl|2xl))$/, 'Remove decorative surface effects, gradients, and drop shadows'],

    // 5. Text density & section rhythm: py-6 or py-8 for compact document rhythm
    [/^(?:.*:)?(?:py|pb|pt)-(?:14|16|20|24|28|32|36|40|48)$/, 'Use compact section spacing (py-6 or py-8) for dense research text'],

    // 6. Layout gaps: gap-3 to gap-6 for high information density
    [/^(?:.*:)?gap-(?:12|14|16|20|24|28|32)$/, 'Use compact gaps (gap-3 to gap-6) for high information density'],

    // 7. Animations: avoid decorative bouncing or pulsating animations on structural elements
    [/^(?:.*:)?animate-(?:bounce|ping)$/, 'Avoid decorative bouncing or pulsating animations in research UI'],
  ]

  for (const match of content.matchAll(/className\s*=\s*"([^"]*)"/g)) {
    const line = content.slice(0, match.index).split('\n').length
    for (const token of match[1].split(/\s+/)) {
      const rule = rules.find(([pattern]) => pattern.test(token))
      if (rule) findings.push({ file, line, token, fix: rule[1] })
    }
  }

  return findings
}
