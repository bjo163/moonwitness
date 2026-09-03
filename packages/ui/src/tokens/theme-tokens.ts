/**
 * MoonWitness Canonical Enterprise Design Tokens
 * Single source of truth for semantic design token constants.
 */

export const THEME_TOKENS = {
  colors: {
    primary: "var(--primary)",
    primaryForeground: "var(--primary-foreground)",
    secondary: "var(--secondary)",
    secondaryForeground: "var(--secondary-foreground)",
    background: "var(--background)",
    foreground: "var(--foreground)",
    card: "var(--card)",
    cardForeground: "var(--card-foreground)",
    popover: "var(--popover)",
    popoverForeground: "var(--popover-foreground)",
    muted: "var(--muted)",
    mutedForeground: "var(--muted-foreground)",
    accent: "var(--accent)",
    accentForeground: "var(--accent-foreground)",
    destructive: "var(--destructive)",
    destructiveForeground: "var(--destructive-foreground)",
    success: "var(--success)",
    successForeground: "var(--success-foreground)",
    warning: "var(--warning)",
    warningForeground: "var(--warning-foreground)",
    info: "var(--info)",
    infoForeground: "var(--info-foreground)",
    border: "var(--border)",
    input: "var(--input)",
    ring: "var(--ring)",
  },
  radius: {
    sm: "var(--radius-sm)",
    md: "var(--radius-md)",
    lg: "var(--radius-lg)",
    xl: "var(--radius-xl)",
    "2xl": "var(--radius-2xl)",
  },
  fonts: {
    sans: "var(--font-sans)",
    mono: "var(--font-mono)",
    arabic: "var(--font-arabic)",
  },
} as const;

export type ThemeAccentColor =
  | "primary"
  | "secondary"
  | "success"
  | "warning"
  | "destructive"
  | "info"
  | "muted"
  | "accent";
