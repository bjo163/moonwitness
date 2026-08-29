/**
 * ◈ MoonWitness OS Design Token System
 * 
 * Type-safe names for CSS custom properties and design decisions.
 * Runtime values are owned by styles/globals.css.
 * 
 * @module @workspace/ui/tokens/design-tokens
 * @version 9.5
 */

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * SEMANTIC COLOR PALETTE (CYBER TOKENS)
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

export const CyberColors = {
  cyan: 'var(--cyber-cyan)',
  green: 'var(--cyber-green)',
  yellow: 'var(--cyber-yellow)',
  purple: 'var(--cyber-purple)',
  pink: 'var(--cyber-pink)',
  dark: 'var(--cyber-dark)',
  panel: 'var(--cyber-panel)',
} as const

export type CyberColorKey = keyof typeof CyberColors;

/** CSS variable references for use in inline styles */
export const CyberColorVars = {
  cyan: 'var(--cyber-cyan)',
  green: 'var(--cyber-green)',
  yellow: 'var(--cyber-yellow)',
  purple: 'var(--cyber-purple)',
  pink: 'var(--cyber-pink)',
  dark: 'var(--cyber-dark)',
  panel: 'var(--cyber-panel)',
} as const

/** Domain palettes are intentionally separate from the semantic cyber UI palette. */
export const VisualizationColors = {
  chart1: 'var(--data-chart-1)',
  chart2: 'var(--data-chart-2)',
  chart3: 'var(--data-chart-3)',
  chart4: 'var(--data-chart-4)',
  chart5: 'var(--data-chart-5)',
} as const

/** Tajweed colors are reserved for Quranic recitation markup. */
export const TajweedColors = {
  madda: 'var(--tajweed-madda)',
  maddaObligatory: 'var(--tajweed-madda-obligatory)',
  qalaqah: 'var(--tajweed-qalaqah)',
  idgham: 'var(--tajweed-idgham)',
  idghamWithoutGhunnah: 'var(--tajweed-idgham-without-ghunnah)',
  ghunnah: 'var(--tajweed-ghunnah)',
  ikhafa: 'var(--tajweed-ikhafa)',
  iqlab: 'var(--tajweed-iqlab)',
  silent: 'var(--tajweed-silent)',
} as const

/** Semantic color mapping by UI intent */
export const SemanticColors = {
  primary: CyberColorVars.cyan,
  success: CyberColorVars.green,
  warning: CyberColorVars.yellow,
  premium: CyberColorVars.purple,
  danger: CyberColorVars.pink,
  background: CyberColorVars.dark,
  surface: CyberColorVars.panel,
} as const;

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * GEOMETRIC CHAMFER SYSTEM
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

export const ChamferSizes = {
  card: 16,
  hero: 28,
  button: 10,
  tag: 6,
} as const;

export type ChamferSize = keyof typeof ChamferSizes;

/** CSS clip-path polygon values */
export const ClipPaths = {
  card: 'polygon(16px 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%, 0 16px)',
  hero: 'polygon(28px 0, 100% 0, 100% calc(100% - 28px), calc(100% - 28px) 100%, 0 100%, 0 28px)',
  button: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)',
  tag: 'polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)',
  rune: 'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)',
} as const;

/** Tailwind utility class names for clip paths */
export const ClipPathClasses = {
  card: 'clip-card',
  hero: 'clip-hero',
  button: 'clip-btn',
  tag: 'clip-tag',
  rune: 'clip-rune',
} as const;

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * OPTICAL GLOW & DEPTH SYSTEM
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

export const GlowDepths = {
  critical: { blur: 60, glow: 30 },
  active: { blur: 30, glow: 20 },
  passive: { blur: 15, glow: 10 },
} as const;

export type GlowDepth = keyof typeof GlowDepths;

/** Tailwind utility classes for semantic glows */
export const GlowClasses = {
  cyan: 'glow-cyan',
  emerald: 'glow-emerald',
  amber: 'glow-amber',
  purple: 'glow-purple',
  pink: 'glow-pink',
  holo: 'holo-glow',
} as const;

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * GLASSMORPHISM & BACKDROP SYSTEM
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

export const BackdropBlurs = {
  sm: '8px',
  md: '16px',
  lg: '24px',
  xl: '32px',
} as const;

/** Panel glass component configuration */
export const PanelGlass = {
  backgroundColor: 'color-mix(in srgb, var(--cyber-dark) 85%, transparent)',
  backdropFilter: 'blur(16px)',
  border: '1px solid color-mix(in srgb, var(--cyber-cyan) 25%, transparent)',
  boxShadow: '0 0 20px color-mix(in srgb, var(--cyber-cyan) 10%, transparent)',
} as const

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * TYPOGRAPHY SYSTEM
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

export const FontFamilies = {
  sans: 'var(--font-sans)',
  mono: 'var(--font-mono)',
  orbitron: 'var(--font-orbitron)',
  arabic: 'var(--font-arabic)',
} as const;

export type FontFamily = keyof typeof FontFamilies;

/** Typography usage guidelines */
export const TypographyUsage = {
  body: FontFamilies.sans,
  telemetry: FontFamilies.mono,
  hero: FontFamilies.orbitron,
  arabic: FontFamilies.arabic,
} as const;

/** Letter spacing values for telemetry text */
export const LetterSpacing = {
  telemetry: '0.15em', // tracking-widest
  normal: 'normal',
  tight: '-0.025em',
} as const;

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * GRID & BACKGROUND PATTERNS
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

export const GridSizes = {
  cosmic: 32,
  dense: 16,
} as const;

export const GridClasses = {
  cosmic: 'bg-cosmic-grid',
  dense: 'bg-dense-grid',
} as const;

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * CORNER BRACKET SYSTEM
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

export const CornerClasses = {
  cyan: 'corner-cyan',
  green: 'corner-green',
  yellow: 'corner-yellow',
  purple: 'corner-purple',
  pink: 'corner-pink',
} as const;

/** Semantic corner bracket mapping */
export const SemanticCorners = {
  active: CornerClasses.cyan,
  success: CornerClasses.green,
  warning: CornerClasses.yellow,
  premium: CornerClasses.purple,
  critical: CornerClasses.pink,
} as const;

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * LASER CONDUIT DIVIDERS
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

export const LaserConduitClasses = {
  cyan: 'laser-conduit-cyan',
  green: 'laser-conduit-green',
  yellow: 'laser-conduit-yellow',
  purple: 'laser-conduit-purple',
} as const;

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * ANIMATION SYSTEM
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

export const AnimationNames = {
  heroShake: 'heroShake',
  textGlow: 'textGlow',
  holoScan: 'holoScan',
  starTwinkle: 'starTwinkle',
  cosmicDrift: 'cosmicDrift',
  breathingCyan: 'breathingCyan',
  radarPulse: 'radarPulse',
} as const;

export type AnimationName = keyof typeof AnimationNames;

/** Animation duration presets (in milliseconds) */
export const AnimationDurations = {
  fast: 150,
  normal: 300,
  slow: 500,
  verySlow: 1000,
} as const;

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * SPACING & LAYOUT
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

export const RadiusSizes = {
  sm: 'calc(var(--radius) * 0.6)',
  md: 'calc(var(--radius) * 0.8)',
  lg: 'var(--radius)',
  xl: 'calc(var(--radius) * 1.4)',
  '2xl': 'calc(var(--radius) * 1.8)',
  '3xl': 'calc(var(--radius) * 2.2)',
  '4xl': 'calc(var(--radius) * 2.6)',
} as const;

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * UTILITY HELPERS
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

/**
 * Get a cyber color by semantic name
 * @example getSemanticColor('success') // returns 'var(--cyber-green)'
 */
export function getSemanticColor(semantic: keyof typeof SemanticColors): string {
  return SemanticColors[semantic]
}

/**
 * Generate a glow box-shadow with specified color and depth
 * @example getGlowShadow('cyan', 'active') // returns a CSS-variable-backed shadow
 */
export function getGlowShadow(color: CyberColorKey, depth: GlowDepth = 'active'): string {
  const glowSize = GlowDepths[depth].glow
  const opacity = depth === 'critical' ? 40 : depth === 'active' ? 30 : 20

  return `0 0 ${glowSize}px color-mix(in srgb, ${CyberColors[color]} ${opacity}%, transparent)`
}

/**
 * Generate clip-path polygon for chamfered corners
 * @example getChamferPath(16) // returns polygon string for 16px chamfer
 */
export function getChamferPath(size: number): string {
  return `polygon(${size}px 0, 100% 0, 100% calc(100% - ${size}px), calc(100% - ${size}px) 100%, 0 100%, 0 ${size}px)`
}
