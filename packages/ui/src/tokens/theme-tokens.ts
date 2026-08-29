// MOONWITNESS OS V9.0 — CENTRALIZED DESIGN TOKENS & SYSTEM SCHEMAS

export const THEME_TOKENS = {
  // ── ENTERPRISE SEMANTIC COLOR ALIASES (DESIGN BIBLE V9.0) ──────────────────
  colors: {
    // Core Semantic Cyber Palette
    primary: "var(--primary)",
    secondary: "var(--secondary)",
    success: "var(--chart-2)",
    warning: "var(--chart-3)",
    danger: "var(--destructive)",
    info: "var(--chart-1)",
    muted: "var(--muted-foreground)",
    accent: "var(--chart-4)",

    system: "var(--primary)",
    mission: "var(--chart-2)",
    celestial: "var(--chart-3)",
    knowledge: "var(--chart-4)",
    knowledgeLight: "var(--chart-4)",
    critical: "var(--destructive)",
    textPrimary: "var(--foreground)",
    textMuted: "var(--muted-foreground)",
    background: "var(--background)",
    panelBg: "var(--card)",
    panelBorder: "var(--border)",
  },

  // ── TYPOGRAPHY SCALE ──────────────────────────────────────────────────────
  typography: {
    h1: "text-[48px] leading-[64px]",
    h2: "text-[36px] leading-[48px]",
    h3: "text-[28px] leading-[36px]",
    h4: "text-[22px] leading-[28px]",
    body: "text-[16px] leading-[24px]",
    small: "text-[14px] leading-[20px]",
    caption: "text-[12px] leading-[16px]",
  },

  // ── BORDER SYSTEM ─────────────────────────────────────────────────────────
  borders: {
    radius: {
      none: "rounded-none",
      sm: "rounded-[4px]",
      md: "rounded-[8px]",
      lg: "rounded-[12px]",
      xl: "rounded-[16px]",
      "2xl": "rounded-[24px]",
      full: "rounded-full",
    },
    style: {
      solid1: "border-solid border",
      solid2: "border-solid border-2",
      glow: "border-solid border shadow-[0_0_10px_rgba(0,240,255,0.5)]",
      dashed: "border-dashed border",
    },
  },

  // ── SHADOWS / ELEVATION ───────────────────────────────────────────────────
  shadows: {
    soft: "shadow-[0_4px_20px_-2px_rgba(0,0,0,0.5)]",
    glow: "shadow-[0_0_16px_-2px_rgba(0,240,255,0.25)]",
    neon: "shadow-[0_0_16px_-2px_rgba(0,255,102,0.25)]",
    terminal: "shadow-sm",
  },

  // ── PANEL IMPORTANCE LEVELS (SHADCN CARD STANDARDS) ────────────────────────
  panelLevels: {
    level1: {
      name: "Mission",
      borderWidth: "1px",
      glow: "0 10px 30px -5px rgba(0, 0, 0, 0.6)",
      titleSize: "text-lg sm:text-xl",
      padding: "p-6 sm:p-8",
    },
    level2: {
      name: "Primary",
      borderWidth: "1px",
      glow: "0 4px 20px -2px rgba(0, 0, 0, 0.4)",
      titleSize: "text-base sm:text-lg",
      padding: "p-5 sm:p-6",
    },
    level3: {
      name: "Information",
      borderWidth: "1px",
      glow: "0 2px 10px rgba(0, 0, 0, 0.3)",
      titleSize: "text-sm sm:text-base",
      padding: "p-4 sm:p-5",
    },
    level4: {
      name: "Statistics",
      borderWidth: "1px",
      glow: "0 1px 4px rgba(0, 0, 0, 0.2)",
      titleSize: "text-xs sm:text-sm",
      padding: "p-3 sm:p-4",
    },
    level5: {
      name: "Utility",
      borderWidth: "1px",
      glow: "none",
      titleSize: "text-xs",
      padding: "p-3",
    },
  },

  // ── ENTERPRISE GRID & SPACING SYSTEM  ──────────────────────────────────
  spacing: {
    outerMargin: "px-4 sm:px-6 lg:px-8",
    sectionGap: "py-12 sm:py-16",
    panelGap: "gap-4 sm:gap-6",
    internalPadding: "p-4 sm:p-6",
    system: {
      "4": "4px",
      "8": "8px",
      "12": "12px",
      "16": "16px",
      "24": "24px",
      "32": "32px",
      "48": "48px",
      "64": "64px",
      "96": "96px",
    },
  },

  // ── Z-INDEX LAYERING SYSTEM ───────────────────────────────────────────────
  zIndex: {
    background: -1,
    content: 1,
    taskbar: 50,
    navbar: 100,
    dropdown: 200,
    modal: 9999,
  },

  // ── SYSTEM METADATA DEFAULTS  ────────────────────────────────────
  metadata: {
    systemName: "MOONWITNESS OS",
    version: "V9.0",
    build: "BUILD-2026.08",
    protocol: "COSMIC-MATRIX-V9",
    defaultStatus: "ONLINE",
  },

  // ── CENTRALIZED BRAND & HERO COPYWRITING ──────────────────────────────────
  brand: {
    title: "MOONWITNESS",
    subTitle: "GLOBAL ESCHATOLOGY & DIVINE OBSERVATORY SYSTEM",
    mottoLine1: "When the Moon Bears Witness,",
    mottoLine2: "We Share the Message.",
    actionPillars: "Observe the Sky. Explore Knowledge. Reflect on History.",
    supportingText:
      "MoonWitness is a unified knowledge platform that connects humanity, creation, and wisdom through celestial observation, historical reflection, and lifelong learning.",
    primaryCta: "Explore Observatory",
    secondaryCta: "Learn the Framework",
    aiName: "KHIDRA AI",
    aiSubTitle: "PROPHETIC WISDOM ENGINE",
  },

  // ── THE MOONWITNESS KNOWLEDGE FRAMEWORK (RGB → LIGHT) ─────────────────────
  framework: {
    title: "THE MOONWITNESS KNOWLEDGE FRAMEWORK",
    subtitle: "RGB → LIGHT",
    supportingText:
      "Light does not represent omniscience itself. Rather, it symbolizes the integration of Reality (Haqiqah), Flourishing (Falāḥ), and Wisdom (Ḥikmah) into a coherent understanding.\n\nRGB is the path toward integrated understanding.",
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
      desc: "Where Reality, Flourishing, and Wisdom become one coherent understanding. Light is the integration of the three pillars. It is not omniscience. It symbolizes illuminated understanding.",
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
