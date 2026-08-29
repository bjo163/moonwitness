/**
 * MoonWitness structural design tokens.
 *
 * Semantic colors are owned by theme-tokens.ts. This module contains reusable
 * geometry, layout, typography, and motion values that do not encode a color
 * palette.
 */

export const ChamferSizes = { card: 16, hero: 28, button: 10, tag: 6 } as const;
export type ChamferSize = keyof typeof ChamferSizes;

export const ClipPaths = {
  card: 'polygon(16px 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%, 0 16px)',
  hero: 'polygon(28px 0, 100% 0, 100% calc(100% - 28px), calc(100% - 28px) 100%, 0 100%, 0 28px)',
  button: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)',
  tag: 'polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)',
  rune: 'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)',
} as const;

export const ClipPathClasses = { card: 'clip-card', hero: 'clip-hero', button: 'clip-btn', tag: 'clip-tag', rune: 'clip-rune' } as const;
export const GlowDepths = { critical: { blur: 60, glow: 30 }, active: { blur: 30, glow: 20 }, passive: { blur: 15, glow: 10 } } as const;
export type GlowDepth = keyof typeof GlowDepths;
export const BackdropBlurs = { sm: '8px', md: '16px', lg: '24px', xl: '32px' } as const;
export const PanelGlass = {
  backgroundColor: 'rgba(5, 7, 10, 0.85)',
  backdropFilter: 'blur(16px)',
  border: '1px solid rgba(0, 240, 255, 0.25)',
  boxShadow: '0 0 20px rgba(0, 240, 255, 0.1)',
} as const;

export const FontFamilies = { sans: 'var(--font-sans)', mono: 'var(--font-mono)', orbitron: 'var(--font-orbitron)', arabic: 'var(--font-arabic)' } as const;
export type FontFamily = keyof typeof FontFamilies;
export const TypographyUsage = { body: FontFamilies.sans, telemetry: FontFamilies.mono, hero: FontFamilies.orbitron, arabic: FontFamilies.arabic } as const;
export const LetterSpacing = { telemetry: '0.15em', normal: 'normal', tight: '-0.025em' } as const;
export const GridSizes = { cosmic: 32, dense: 16 } as const;
export const GridClasses = { cosmic: 'bg-cosmic-grid', dense: 'bg-dense-grid' } as const;
export const CornerClasses = { cyan: 'corner-cyan', green: 'corner-green', yellow: 'corner-yellow', purple: 'corner-purple', pink: 'corner-pink' } as const;
export const SemanticCorners = { active: CornerClasses.cyan, success: CornerClasses.green, warning: CornerClasses.yellow, premium: CornerClasses.purple, critical: CornerClasses.pink } as const;
export const LaserConduitClasses = { cyan: 'laser-conduit-cyan', green: 'laser-conduit-green', yellow: 'laser-conduit-yellow', purple: 'laser-conduit-purple' } as const;
export const AnimationNames = { heroShake: 'heroShake', textGlow: 'textGlow', holoScan: 'holoScan', starTwinkle: 'starTwinkle', cosmicDrift: 'cosmicDrift', breathingCyan: 'breathingCyan', radarPulse: 'radarPulse' } as const;
export type AnimationName = keyof typeof AnimationNames;
export const AnimationDurations = { fast: 150, normal: 300, slow: 500, verySlow: 1000 } as const;
export const RadiusSizes = {
  sm: 'calc(var(--radius) * 0.6)', md: 'calc(var(--radius) * 0.8)', lg: 'var(--radius)',
  xl: 'calc(var(--radius) * 1.4)', '2xl': 'calc(var(--radius) * 1.8)', '3xl': 'calc(var(--radius) * 2.2)', '4xl': 'calc(var(--radius) * 2.6)',
} as const;

export function getChamferPath(size: number): string {
  return `polygon(${size}px 0, 100% 0, 100% calc(100% - ${size}px), calc(100% - ${size}px) 100%, 0 100%, 0 ${size}px)`;
}
