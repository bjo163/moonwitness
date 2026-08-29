/**
 * Design Token Type Definitions
 * MoonWitness OS V9.5 — Standard shadcn/ui & Tailwind v4
 */

export type ThemeColorToken =
  | 'primary'
  | 'secondary'
  | 'muted'
  | 'accent'
  | 'destructive'
  | 'card'
  | 'background'
  | 'foreground';

export type CyberColorToken = ThemeColorToken;

export const THEME_COLORS: Record<string, string> = {
  primary: '#0284c7',
  secondary: '#f4f4f5',
  muted: '#71717a',
  accent: '#0284c7',
  destructive: '#ef4444',
  card: '#ffffff',
  background: '#ffffff',
  foreground: '#09090b',
} as const;

export const CYBER_COLORS = THEME_COLORS;

export type ColorSemantic =
  | 'primary'
  | 'success'
  | 'warning'
  | 'error'
  | 'info'
  | 'premium'
  | 'background'
  | 'surface';

export const SEMANTIC_COLOR_MAP: Record<ColorSemantic, string> = {
  primary: 'primary',
  success: 'emerald-500',
  warning: 'amber-500',
  error: 'destructive',
  info: 'sky-500',
  premium: 'purple-500',
  background: 'background',
  surface: 'card',
} as const;

export type ChamferType = 'card' | 'hero' | 'btn' | 'tag' | 'rune';

export const CHAMFER_SPECS: Record<ChamferType, { size: number; usage: string; clipPath: string }> = {
  card: { size: 12, usage: 'Cards (rounded-xl)', clipPath: '0.75rem' },
  hero: { size: 16, usage: 'Heroes (rounded-2xl)', clipPath: '1rem' },
  btn: { size: 8, usage: 'Buttons (rounded-lg)', clipPath: '0.5rem' },
  tag: { size: 6, usage: 'Badges (rounded-md)', clipPath: '0.375rem' },
  rune: { size: 9999, usage: 'Circles (rounded-full)', clipPath: '9999px' },
} as const;

export type RadiusToken = 'sm' | 'md' | 'lg' | 'xl' | '2xl';

export const RADIUS_SPECS: Record<RadiusToken, { rem: number; px: number; usage: string }> = {
  sm: { rem: 0.375, px: 6, usage: 'Small / badges' },
  md: { rem: 0.5, px: 8, usage: 'Buttons / inputs' },
  lg: { rem: 0.75, px: 12, usage: 'Cards / default' },
  xl: { rem: 1, px: 16, usage: 'Large cards' },
  '2xl': { rem: 1.5, px: 24, usage: 'Hero containers' },
} as const;
