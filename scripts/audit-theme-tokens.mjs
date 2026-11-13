export const CANONICAL_SEMANTIC_TOKENS = [
  "background",
  "foreground",
  "card",
  "card-foreground",
  "popover",
  "popover-foreground",
  "primary",
  "primary-foreground",
  "secondary",
  "secondary-foreground",
  "muted",
  "muted-foreground",
  "accent",
  "accent-foreground",
  "destructive",
  "destructive-foreground",
  "success",
  "success-foreground",
  "warning",
  "warning-foreground",
  "info",
  "info-foreground",
  "border",
  "input",
  "ring",
  "chart-1",
  "chart-2",
  "chart-3",
  "chart-4",
  "chart-5",
  "sidebar",
  "sidebar-foreground",
  "sidebar-primary",
  "sidebar-primary-foreground",
  "sidebar-accent",
  "sidebar-accent-foreground",
  "sidebar-border",
  "sidebar-ring",
]

// Contrast checks deliberately accept opaque hex only. Other representations must
// be resolved/composited before they can be certified, never silently skipped.
export function getContrastRatio(first, second) {
  function luminance(value) {
    if (!/^#(?:[a-f\d]{3}|[a-f\d]{6})$/i.test(value)) return null
    let hex = value.slice(1)
    if (hex.length === 3) hex = [...hex].map(c => c + c).join('')
    const channels = [0, 2, 4].map(offset => {
      const v = parseInt(hex.slice(offset, offset + 2), 16) / 255
      return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4
    })
    return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722
  }
  const a = luminance(first), b = luminance(second)
  return a === null || b === null ? null : (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05)
}

export function auditThemeTokens(source) {
  const css = source.replace(/\/\*[\s\S]*?\*\//g, '')
  const findings = { themeParity: [], accessibility: [], cyberVarMisuse: [] }
  const parity = token => findings.themeParity.push({ file: 'globals.css', token })
  const declarations = block => [...block.matchAll(/--([a-z0-9-]+)\s*:\s*([^;]+);/g)]
  const pairs = [
    ['background', 'foreground'], ['card', 'card-foreground'],
    ['popover', 'popover-foreground'], ['primary', 'primary-foreground'],
    ['secondary', 'secondary-foreground'], ['muted', 'muted-foreground'],
    ['accent', 'accent-foreground'], ['destructive', 'destructive-foreground'],
    ['success', 'success-foreground'], ['warning', 'warning-foreground'],
    ['info', 'info-foreground'], ['background', 'muted-foreground'],
    ['sidebar', 'sidebar-foreground'], ['sidebar-primary', 'sidebar-primary-foreground'],
    ['sidebar-accent', 'sidebar-accent-foreground'],
  ]
  for (const [name, pattern] of [[':root', /:root\s*\{([^}]+)\}/], ['.dark', /\.dark\s*\{([^}]+)\}/]]) {
    const block = css.match(pattern)?.[1]
    if (!block) { parity(`Missing ${name} theme block`); continue }
    const vars = new Map()
    for (const [, key, value] of declarations(block)) {
      if (vars.has(key)) parity(`${name} duplicates --${key}`)
      vars.set(key, value.trim())
    }
    for (const token of CANONICAL_SEMANTIC_TOKENS) {
      if (!vars.has(token)) parity(`${name} missing canonical token --${token}`)
    }
    for (const [bg, fg] of pairs) {
      if (!vars.has(bg) || !vars.has(fg)) continue
      const ratio = getContrastRatio(vars.get(bg), vars.get(fg))
      if (ratio === null || ratio < 4.5) {
        findings.accessibility.push({ file: 'globals.css', issue: ratio === null
          ? `${name} contrast unverified for ${bg}/${fg}: use opaque hex or extend the color resolver`
          : `${name} contrast below 4.5:1 for ${bg}/${fg}: ${ratio.toFixed(2)}:1` })
      }
    }
  }
  const themeBlocks = [...css.matchAll(/@theme(?:\s+inline)?\s*\{([^}]+)\}/g)]
  const aliases = new Map(themeBlocks.flatMap(match => declarations(match[1]).map(([, key, value]) => [key, value.trim()])))
  for (const token of CANONICAL_SEMANTIC_TOKENS) {
    if (aliases.get(`color-${token}`) !== `var(--${token})`) parity(`Missing semantic utility mapping --color-${token}`)
  }
  for (const [key, value] of aliases) {
    const refs = [...value.matchAll(/var\(\s*--([a-z0-9-]+)/g)].map(match => match[1])
    if (refs.includes(key)) parity(`Self-referencing theme variable --${key}`)
  }
  if (/--cyber-[a-z-]+/.test(css)) findings.cyberVarMisuse.push({ file: 'globals.css', snippet: 'Forbidden legacy theme variables' })
  return findings
}
