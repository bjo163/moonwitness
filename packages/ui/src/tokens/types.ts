/**
 * Design Token Type Definitions
 * MoonWitness — Standard shadcn/ui & Tailwind v4
 */

export type ThemeColorToken =
  | 'primary'
  | 'secondary'
  | 'muted'
  | 'accent'
  | 'destructive'
  | 'success'
  | 'warning'
  | 'info'
  | 'card'
  | 'background'
  | 'foreground';

export type RadiusToken = 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';

export const RADIUS_CLASSES: Record<RadiusToken, string> = {
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  xl: 'rounded-xl',
  '2xl': 'rounded-2xl',
  full: 'rounded-full',
} as const;
