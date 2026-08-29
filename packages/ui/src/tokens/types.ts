/**
 * Design Token Type Definitions
 * MoonWitness OS V9.5 — Enhanced Token System
 * 
 * Single source of truth for design token types across the monorepo.
 * These types ensure type safety when consuming design tokens programmatically.
 */

// ═══════════════════════════════════════════════════════════════════════════
// COLOR TOKENS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Primary cyber color palette
 * Core semantic colors for the Deep Space Sci-Fi Divine OS theme
 */
export type CyberColorToken =
  | 'cyber-cyan'
  | 'cyber-green'
  | 'cyber-yellow'
  | 'cyber-purple'
  | 'cyber-pink'
  | 'cyber-dark'
  | 'cyber-panel';

/**
 * CSS variable values for each cyber color token. Runtime values live in globals.css.
 */
export const CYBER_COLORS: Record<CyberColorToken, string> = {
  'cyber-cyan': 'var(--cyber-cyan)',
  'cyber-green': 'var(--cyber-green)',
  'cyber-yellow': 'var(--cyber-yellow)',
  'cyber-purple': 'var(--cyber-purple)',
  'cyber-pink': 'var(--cyber-pink)',
  'cyber-dark': 'var(--cyber-dark)',
  'cyber-panel': 'var(--cyber-panel)',
} as const;

/**
 * Semantic color usage mapping
 */
export type ColorSemantic =
  | 'primary'      // Primary actions, navigation
  | 'success'      // Success states, confirmations
  | 'warning'      // Warnings, attention required
  | 'error'        // Errors, destructive actions
  | 'info'         // Informational, neutral
  | 'premium'      // Premium features, special content
  | 'background'   // Backgrounds, surfaces
  | 'surface';     // Elevated surfaces, panels

/**
 * Map semantic intentions to cyber color tokens
 */
export const SEMANTIC_COLOR_MAP: Record<ColorSemantic, CyberColorToken> = {
  primary: 'cyber-cyan',
  success: 'cyber-green',
  warning: 'cyber-yellow',
  error: 'cyber-pink',
  info: 'cyber-cyan',
  premium: 'cyber-purple',
  background: 'cyber-dark',
  surface: 'cyber-panel',
} as const;

/**
 * Opacity variants for colors
 */
export type OpacityLevel = 10 | 20 | 25 | 30 | 40 | 50 | 60 | 70 | 75 | 80 | 90 | 100;

// ═══════════════════════════════════════════════════════════════════════════
// SPACING TOKENS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Spacing scale (in pixels)
 * Matches Tailwind spacing: 1 unit = 4px
 */
export type SpacingToken = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 10 | 12 | 16 | 20 | 24;

/**
 * Spacing scale with descriptions
 */
export const SPACING_SCALE: Record<SpacingToken, { px: number; rem: number; usage: string }> = {
  0: { px: 0, rem: 0, usage: 'No spacing' },
  1: { px: 4, rem: 0.25, usage: 'Minimal gap' },
  2: { px: 8, rem: 0.5, usage: 'Tight spacing' },
  3: { px: 12, rem: 0.75, usage: 'Compact groups' },
  4: { px: 16, rem: 1, usage: 'Standard spacing' },
  5: { px: 20, rem: 1.25, usage: 'Comfortable spacing' },
  6: { px: 24, rem: 1.5, usage: 'Section spacing' },
  7: { px: 28, rem: 1.75, usage: 'Large sections' },
  8: { px: 32, rem: 2, usage: 'Major divisions' },
  10: { px: 40, rem: 2.5, usage: 'Module boundaries' },
  12: { px: 48, rem: 3, usage: 'Large gaps' },
  16: { px: 64, rem: 4, usage: 'Extra large gaps' },
  20: { px: 80, rem: 5, usage: 'Major sections' },
  24: { px: 96, rem: 6, usage: 'Page sections' },
} as const;

// ═══════════════════════════════════════════════════════════════════════════
// TYPOGRAPHY TOKENS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Font family tokens
 */
export type FontFamilyToken = 'sans' | 'mono' | 'orbitron' | 'arabic';

/**
 * Font families with CSS variable references
 */
export const FONT_FAMILIES: Record<FontFamilyToken, string> = {
  sans: 'var(--font-sans, "Geist", sans-serif)',
  mono: 'var(--font-mono, "JetBrains Mono", monospace)',
  orbitron: 'var(--font-orbitron, "Orbitron", sans-serif)',
  arabic: 'var(--font-arabic, "Amiri", serif)',
} as const;

/**
 * Font size tokens (Tailwind scale)
 */
export type FontSizeToken =
  | 'xs'    // 12px
  | 'sm'    // 14px
  | 'base'  // 16px
  | 'lg'    // 18px
  | 'xl'    // 20px
  | '2xl'   // 24px
  | '3xl'   // 30px
  | '4xl'   // 36px
  | '5xl';  // 48px

/**
 * Font weight tokens
 */
export type FontWeightToken = 400 | 500 | 600 | 700;

/**
 * Letter spacing tokens
 */
export type LetterSpacingToken = 'tight' | 'normal' | 'wide' | 'wider' | 'widest';

/**
 * Line height tokens
 */
export type LineHeightToken = 'tight' | 'normal' | 'relaxed' | 'loose';

// ═══════════════════════════════════════════════════════════════════════════
// GEOMETRIC TOKENS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Sacred geometric chamfer types
 */
export type ChamferType = 'card' | 'hero' | 'btn' | 'tag' | 'rune';

/**
 * Chamfer specifications (in pixels)
 */
export const CHAMFER_SPECS: Record<ChamferType, { size: number; usage: string; clipPath: string }> = {
  card: {
    size: 16,
    usage: 'Standard cards, panels, containers',
    clipPath: 'polygon(16px 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%, 0 16px)',
  },
  hero: {
    size: 28,
    usage: 'Hero sections, large feature blocks',
    clipPath: 'polygon(28px 0, 100% 0, 100% calc(100% - 28px), calc(100% - 28px) 100%, 0 100%, 0 28px)',
  },
  btn: {
    size: 10,
    usage: 'Buttons, chips, interactive elements',
    clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)',
  },
  tag: {
    size: 6,
    usage: 'Tags, badges, small labels',
    clipPath: 'polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)',
  },
  rune: {
    size: 0, // Octagonal, not chamfer-based
    usage: 'Icons, avatars, sacred geometry',
    clipPath: 'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)',
  },
} as const;

/**
 * Border radius tokens (in rem)
 */
export type RadiusToken = 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';

/**
 * Border radius specifications
 */
export const RADIUS_SPECS: Record<RadiusToken, { rem: number; px: number; usage: string }> = {
  sm: { rem: 0.3, px: 4.8, usage: 'Small elements, tags, badges' },
  md: { rem: 0.4, px: 6.4, usage: 'Buttons, inputs, form elements' },
  lg: { rem: 0.5, px: 8, usage: 'Cards, panels (default)' },
  xl: { rem: 0.7, px: 11.2, usage: 'Large cards, modals' },
  '2xl': { rem: 0.9, px: 14.4, usage: 'Hero sections, featured content' },
  '3xl': { rem: 1.1, px: 17.6, usage: 'Extra large containers' },
  '4xl': { rem: 1.3, px: 20.8, usage: 'Maximum rounded corners' },
} as const;

// ═══════════════════════════════════════════════════════════════════════════
// SHADOW & GLOW TOKENS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Shadow elevation levels
 */
export type ShadowLevel = 'sm' | 'default' | 'md' | 'lg' | 'xl';

/**
 * Glow intensity types
 */
export type GlowIntensity = 'passive' | 'active' | 'critical';

/**
 * Glow specifications by intensity
 */
export const GLOW_SPECS: Record<GlowIntensity, { blur: number; opacity: number; usage: string }> = {
  passive: { blur: 15, opacity: 0.1, usage: 'Resting state, subtle presence' },
  active: { blur: 30, opacity: 0.2, usage: 'Hover, active, interactive' },
  critical: { blur: 60, opacity: 0.3, usage: 'Critical alerts, focus states' },
} as const;

/**
 * Glow utility types
 */
export type GlowType = 'cyan' | 'emerald' | 'amber' | 'purple' | 'pink' | 'holo';

// ═══════════════════════════════════════════════════════════════════════════
// ANIMATION TOKENS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Animation duration tokens (in milliseconds)
 */
export type AnimationDuration = 100 | 200 | 300 | 500 | 1000;

/**
 * Animation easing tokens
 */
export type AnimationEasing = 'ease-in' | 'ease-out' | 'ease-in-out' | 'linear';

/**
 * Keyframe animation names
 */
export type KeyframeAnimation =
  | 'heroShake'
  | 'textGlow'
  | 'holoScan'
  | 'starTwinkle'
  | 'cosmicDrift'
  | 'breathingCyan'
  | 'radarPulse';

// ═══════════════════════════════════════════════════════════════════════════
// Z-INDEX TOKENS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Z-index layering system
 */
export type ZIndexLayer =
  | 'base'          // 0
  | 'content'       // 10
  | 'floating'      // 20
  | 'overlay'       // 30
  | 'modal'         // 40
  | 'notification'  // 50
  | 'critical';     // 100

/**
 * Z-index specifications
 */
export const Z_INDEX_SCALE: Record<ZIndexLayer, { value: number; usage: string }> = {
  base: { value: 0, usage: 'Backgrounds, grid patterns' },
  content: { value: 10, usage: 'Cards, panels, text' },
  floating: { value: 20, usage: 'Dropdowns, tooltips, popovers' },
  overlay: { value: 30, usage: 'Modal backdrops, overlays' },
  modal: { value: 40, usage: 'Modals, dialogs, sheets' },
  notification: { value: 50, usage: 'Toasts, notifications, alerts' },
  critical: { value: 100, usage: 'Critical system overlays' },
} as const;

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT VARIANT TOKENS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Button variants
 */
export type ButtonVariant = 'primary' | 'success' | 'warning' | 'destructive' | 'ghost' | 'outline';

/**
 * Button sizes
 */
export type ButtonSize = 'sm' | 'md' | 'lg';

/**
 * Panel variants
 */
export type PanelVariant = 'default' | 'glass' | 'solid';

/**
 * Corner bracket colors
 */
export type CornerColor = 'cyan' | 'green' | 'yellow' | 'purple' | 'pink';

// ═══════════════════════════════════════════════════════════════════════════
// UTILITY TYPES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Tailwind class name builder helper
 */
export type TailwindClass = string;

/**
 * CSS variable reference
 */
export type CSSVar = `var(--${string})`;

/**
 * Helper type for token with opacity
 */
export type TokenWithOpacity<T extends string> = T | `${T}/${OpacityLevel}`;

/**
 * Complete design token configuration
 */
export interface DesignTokenConfig {
  colors: typeof CYBER_COLORS;
  spacing: typeof SPACING_SCALE;
  fonts: typeof FONT_FAMILIES;
  chamfers: typeof CHAMFER_SPECS;
  radius: typeof RADIUS_SPECS;
  glows: typeof GLOW_SPECS;
  zIndex: typeof Z_INDEX_SCALE;
}

/**
 * Export complete token configuration
 */
export const DESIGN_TOKENS: DesignTokenConfig = {
  colors: CYBER_COLORS,
  spacing: SPACING_SCALE,
  fonts: FONT_FAMILIES,
  chamfers: CHAMFER_SPECS,
  radius: RADIUS_SPECS,
  glows: GLOW_SPECS,
  zIndex: Z_INDEX_SCALE,
} as const;

// ═══════════════════════════════════════════════════════════════════════════
// TYPE GUARDS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Type guard for cyber color token
 */
export function isCyberColor(value: string): value is CyberColorToken {
  return value in CYBER_COLORS;
}

/**
 * Type guard for chamfer type
 */
export function isChamferType(value: string): value is ChamferType {
  return value in CHAMFER_SPECS;
}

/**
 * Type guard for z-index layer
 */
export function isZIndexLayer(value: string): value is ZIndexLayer {
  return value in Z_INDEX_SCALE;
}
