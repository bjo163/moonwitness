/**
 * ◈ MoonWitness OS — Standard Enterprise Design Tokens (shadcn/ui & Tailwind v4)
 * 
 * Single Source of Truth for all design tokens used across the monorepo.
 * This file provides type-safe access to CSS custom properties and design decisions.
 * 
 * @module @workspace/ui/tokens/design-tokens
 * @version 9.5
 */

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * SEMANTIC COLOR TOKENS (SHADCN STANDARDS)
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

export const ThemeColors = {
  primary: '#0284c7',
  secondary: '#f4f4f5',
  muted: '#71717a',
  accent: '#0284c7',
  destructive: '#ef4444',
  success: '#10b981',
  warning: '#f59e0b',
  background: '#ffffff',
  surface: '#ffffff',
} as const;

export type ThemeColorKey = keyof typeof ThemeColors;

/** CSS variable references for use in styles */
export const ThemeColorVars = {
  primary: 'var(--primary)',
  secondary: 'var(--secondary)',
  muted: 'var(--muted)',
  mutedForeground: 'var(--muted-foreground)',
  accent: 'var(--accent)',
  destructive: 'var(--destructive)',
  background: 'var(--background)',
  foreground: 'var(--foreground)',
  card: 'var(--card)',
  cardForeground: 'var(--card-foreground)',
  border: 'var(--border)',
  input: 'var(--input)',
  ring: 'var(--ring)',
  chart1: 'var(--chart-1)',
  chart2: 'var(--chart-2)',
  chart3: 'var(--chart-3)',
  chart4: 'var(--chart-4)',
  chart5: 'var(--chart-5)',
} as const;

/** Semantic color mapping by UI intent */
export const SemanticColors = {
  primary: ThemeColorVars.primary,
  success: ThemeColorVars.chart2,
  warning: ThemeColorVars.chart3,
  premium: ThemeColorVars.chart4,
  danger: ThemeColorVars.destructive,
  background: ThemeColorVars.background,
  surface: ThemeColorVars.card,
} as const;

// Backward-compatibility aliases
export const CyberColors = {
  cyan: '#00F0FF',
  green: '#00FF66',
  yellow: '#FFE600',
  purple: '#A100FF',
  pink: '#FF0055',
  dark: '#05070A',
  panel: '#0A0F17',
} as const;
export const CyberColorVars = {
  cyan: 'var(--primary)',
  green: 'var(--chart-2)',
  yellow: 'var(--chart-3)',
  purple: 'var(--chart-4)',
  pink: 'var(--destructive)',
  dark: 'var(--background)',
  panel: 'var(--card)',
} as const;
export type CyberColorKey = keyof typeof CyberColors;

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * GEOMETRIC CONTAINER & RADIUS SYSTEM (SHADCN STANDARDS)
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

export const ContainerRadii = {
  card: 12,    // rounded-xl
  hero: 16,    // rounded-2xl
  button: 8,   // rounded-lg
  tag: 6,      // rounded-md
  rune: 9999,  // rounded-full
} as const;

export const ChamferSizes = ContainerRadii;
export type ChamferSize = keyof typeof ChamferSizes;

/** Standard utility class names for rounded containers */
export const ClipPathClasses = {
  card: 'rounded-xl',
  hero: 'rounded-2xl',
  button: 'rounded-lg',
  tag: 'rounded-md',
  rune: 'rounded-full',
} as const;

export const ClipPaths = {
  card: 'var(--radius-xl, 0.75rem)',
  hero: 'var(--radius-2xl, 1rem)',
  button: 'var(--radius-md, 0.5rem)',
  tag: 'var(--radius-sm, 0.375rem)',
  rune: '9999px',
} as const;

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * GLASSMORPHISM & SURFACE SYSTEM
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

export const BackdropBlurs = {
  sm: '8px',
  md: '16px',
  lg: '24px',
  xl: '32px',
} as const;

export const PanelGlass = {
  backgroundColor: 'var(--card)',
  backdropFilter: 'blur(16px)',
  border: '1px solid var(--border)',
  boxShadow: '0 4px 20px -1px rgba(0, 0, 0, 0.08)',
} as const;

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * TYPOGRAPHY SYSTEM
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

export const FontFamilies = {
  sans: 'var(--font-sans)',
  mono: 'var(--font-mono)',
  arabic: 'var(--font-arabic)',
} as const;

export type FontFamily = keyof typeof FontFamilies;

export const TypographyUsage = {
  body: FontFamilies.sans,
  telemetry: FontFamilies.mono,
  hero: FontFamilies.sans,
  arabic: FontFamilies.arabic,
} as const;

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * RADIUS SIZES
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

/**
 * Get a semantic color by name
 */
export function getSemanticColor(semantic: keyof typeof SemanticColors): string {
  const colorMap: Record<keyof typeof SemanticColors, string> = {
    primary: ThemeColors.primary,
    success: ThemeColors.success,
    warning: ThemeColors.warning,
    premium: '#8b5cf6',
    danger: ThemeColors.destructive,
    background: ThemeColors.background,
    surface: ThemeColors.surface,
  };
  return colorMap[semantic];
}
