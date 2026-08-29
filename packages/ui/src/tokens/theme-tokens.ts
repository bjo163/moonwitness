// MOONWITNESS — CANONICAL ENTERPRISE THEME SCHEMAS & CONSTANTS

export const THEME_TOKENS = {
  colors: {
    primary: "var(--primary)",
    secondary: "var(--secondary)",
    muted: "var(--muted)",
    mutedForeground: "var(--muted-foreground)",
    accent: "var(--accent)",
    destructive: "var(--destructive)",
    danger: "var(--destructive)",
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
    system: "var(--primary)",
    mission: "var(--primary)",
    celestial: "var(--warning)",
    knowledge: "var(--primary)",
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

  framework: {
    title: "THE MOONWITNESS KNOWLEDGE FRAMEWORK",
    subtitle: "RGB → LIGHT",
    supportingText:
      "Light does not represent omniscience itself. Rather, it symbolizes the integration of Reality (Haqiqah), Flourishing (Falāḥ), and Wisdom (Ḥikmah) into a coherent understanding.",
    red: {
      code: "RED",
      name: "HAQIQAH",
      subtitle: "Reality • History • Truth",
      desc: "Discover reality through history, scripture, human civilization, and historical reflection.",
      hex: "#FF3355",
    },
    green: {
      code: "GREEN",
      name: "FALĀḤ",
      subtitle: "Creation • Universe • Growth",
      desc: "Observe creation, explore the universe, study astronomy, and understand the living world.",
      hex: "#00FF66",
    },
    blue: {
      code: "BLUE",
      name: "ḤIKMAH",
      subtitle: "Wisdom • Reflection • Insight",
      desc: "Transform knowledge into wisdom through reflection, critical thinking, understanding, and meaningful application.",
      hex: "#00F0FF",
    },
    light: {
      code: "LIGHT",
      name: "ILLUMINATION",
      subtitle: "Integrated Understanding",
      desc: "Where Reality, Flourishing, and Wisdom become one coherent understanding.",
      hex: "#FFFFFF",
    },
    missionTitle: "OUR MISSION",
    missionText1:
      "MoonWitness exists to connect humanity, creation, and wisdom into one living observatory.",
    missionText2:
      "We believe understanding grows through observation, reflection, and continuous learning.",
    principles:
      "Reality → Growth → Wisdom → Light // Observe → Learn → Reflect → Illuminate",
  },
} as const

export type ThemeAccentColor = keyof typeof THEME_TOKENS.colors
export type ThemePanelLevel = keyof typeof THEME_TOKENS.panelLevels
