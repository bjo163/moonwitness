// MOONWITNESS — CANONICAL ENTERPRISE THEME SCHEMAS & CONSTANTS

export const THEME_TOKENS = {
  colors: {
    primary: "var(--primary)",
    secondary: "var(--secondary)",
    muted: "var(--muted)",
    mutedForeground: "var(--muted-foreground)",
    accent: "var(--accent)",
    destructive: "var(--destructive)",
    success: "var(--success)",
    warning: "var(--warning)",
    info: "var(--info)",
    background: "var(--background)",
    foreground: "var(--foreground)",
    card: "var(--card)",
    cardForeground: "var(--card-foreground)",
    border: "var(--border)",
    input: "var(--input)",
    ring: "var(--ring)",
  },

  borders: {
    radius: {
      none: "rounded-none",
      sm: "rounded-sm",
      md: "rounded-md",
      lg: "rounded-lg",
      xl: "rounded-xl",
      "2xl": "rounded-2xl",
      full: "rounded-full",
    },
  },

  panelLevels: {
    level1: { padding: "p-6", titleSize: "text-xl", borderWidth: "1px" },
    level2: { padding: "p-5", titleSize: "text-lg", borderWidth: "1px" },
    level3: { padding: "p-4", titleSize: "text-base", borderWidth: "1px" },
    level4: { padding: "p-3", titleSize: "text-sm", borderWidth: "1px" },
    level5: { padding: "p-2", titleSize: "text-xs", borderWidth: "1px" },
  },

  shadows: {
    sm: "shadow-sm",
    md: "shadow-md",
    lg: "shadow-lg",
  },

  spacing: {
    outerMargin: "px-4 sm:px-6 lg:px-8",
    sectionGap: "py-8 sm:py-12",
    panelGap: "gap-4 sm:gap-6",
    internalPadding: "p-4 sm:p-6",
  },

  zIndex: {
    background: -1,
    content: 1,
    taskbar: 50,
    navbar: 100,
    dropdown: 200,
    modal: 9999,
  },

  metadata: {
    systemName: "MoonWitness",
    version: "1.0.0",
  },

  brand: {
    title: "MoonWitness",
    subTitle: "Unified Sacred Knowledge & Celestial Observatory",
    mottoLine1: "When the Moon Bears Witness,",
    mottoLine2: "We Share the Message.",
    actionPillars: "Observe the Sky. Explore Knowledge. Reflect on History.",
    supportingText:
      "MoonWitness is a unified knowledge platform connecting celestial observation, historical reflection, and sacred scriptures.",
    primaryCta: "Explore Observatory",
    secondaryCta: "Learn the Framework",
  },
} as const

export type ThemeAccentColor = keyof typeof THEME_TOKENS.colors
export type ThemePanelLevel = keyof typeof THEME_TOKENS.panelLevels
