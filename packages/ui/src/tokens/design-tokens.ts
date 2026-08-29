/**
 * ◈ MoonWitness OS — Standard Enterprise Design Tokens (shadcn/ui & Tailwind v4)
 *
 * Single Source of Truth for all design tokens used across the monorepo.
 * References CSS custom properties defined in packages/ui/src/styles/globals.css.
 *
 * @module @workspace/ui/tokens/design-tokens
 */

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * SEMANTIC COLOR TOKENS (SHADCN STANDARDS)
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

/** Names mirror CSS variables; values remain exclusively owned by globals.css. */
export type ThemeColorVarKey =
  | "primary"
  | "primaryForeground"
  | "secondary"
  | "secondaryForeground"
  | "muted"
  | "mutedForeground"
  | "accent"
  | "accentForeground"
  | "destructive"
  | "destructiveForeground"
  | "success"
  | "successForeground"
  | "warning"
  | "warningForeground"
  | "info"
  | "infoForeground"
  | "background"
  | "foreground"
  | "card"
  | "cardForeground"
  | "popover"
  | "popoverForeground"
  | "border"
  | "input"
  | "ring"
  | "chart1"
  | "chart2"
  | "chart3"
  | "chart4"
  | "chart5"

/** Standard utility class names for rounded containers */
export const ContainerRadiusClasses = {
  sm: "rounded-md",
  md: "rounded-lg",
  lg: "rounded-xl",
  xl: "rounded-2xl",
  full: "rounded-full",
} as const

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * TYPOGRAPHY SYSTEM
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

export const FontFamilies = {
  sans: "var(--font-sans)",
  mono: "var(--font-mono)",
  arabic: "var(--font-arabic)",
} as const

export type FontFamily = keyof typeof FontFamilies
