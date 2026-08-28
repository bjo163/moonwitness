/**
 * ◈ MoonWitness OS Design Token System
 * 
 * Single Source of Truth for all design tokens used across the monorepo.
 * This file provides type-safe access to CSS custom properties and design decisions.
 * 
 * @module @workspace/ui/tokens/design-tokens
 * @version 9.5
 */

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * SEMANTIC COLOR PALETTE (CYBER TOKENS)
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

export const CyberColors = {
  cyan: '#00F0FF',
  green: '#00FF66',
  yellow: '#FFE600',
  purple: '#A100FF',
  pink: '#FF0055',
  dark: '#05070A',
  panel: '#0A0F17',
} as const;

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
} as const;

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
  backgroundColor: 'rgba(5, 7, 10, 0.85)',
  backdropFilter: 'blur(16px)',
  border: '1px solid rgba(0, 240, 255, 0.25)',
  boxShadow: '0 0 20px rgba(0, 240, 255, 0.1)',
} as const;

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
 * @example getSemanticColor('success') // returns '#00FF66'
 */
export function getSemanticColor(semantic: keyof typeof SemanticColors): string {
  const colorMap: Record<keyof typeof SemanticColors, string> = {
    primary: CyberColors.cyan,
    success: CyberColors.green,
    warning: CyberColors.yellow,
    premium: CyberColors.purple,
    danger: CyberColors.pink,
    background: CyberColors.dark,
    surface: CyberColors.panel,
  };
  return colorMap[semantic];
}

/**
 * Generate a glow box-shadow with specified color and depth
 * @example getGlowShadow('cyan', 'active') // returns '0 0 20px rgba(0, 240, 255, 0.3)'
 */
export function getGlowShadow(color: CyberColorKey, depth: GlowDepth = 'active'): string {
  const rgbaMap: Record<CyberColorKey, string> = {
    cyan: '0, 240, 255',
    green: '0, 255, 102',
    yellow: '255, 230, 0',
    purple: '161, 0, 255',
    pink: '255, 0, 85',
    dark: '5, 7, 10',
    panel: '10, 15, 23',
  };
  
  const glowSize = GlowDepths[depth].glow;
  const opacity = depth === 'critical' ? 0.4 : depth === 'active' ? 0.3 : 0.2;
  
  return `0 0 ${glowSize}px rgba(${rgbaMap[color]}, ${opacity})`;
}

/**
 * Generate clip-path polygon for chamfered corners
 * @example getChamferPath(16) // returns polygon string for 16px chamfer
 */
export function getChamferPath(size: number): string {
  return `polygon(${size}px 0, 100% 0, 100% calc(100% - ${size}px), calc(100% - ${size}px) 100%, 0 100%, 0 ${size}px)`;
}
