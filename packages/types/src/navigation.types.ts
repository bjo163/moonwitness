import type { ComponentType, ElementType } from "react"

export type NavLinkConfig = {
  label: string
  href: string
  icon?: string
  subLinks?: ReadonlyArray<{
    label: string
    href: string
    icon?: string
  }>
}

export type SubNavLink = {
  label: string
  href: string
  icon: string | ElementType
}

export type ModuleType = "CORE_OS" | "APP" | "WIDGET_PACK" | "SERVICE"
export type NavPlacement = "OS_DOCK" | "ERP_SIDEBAR" | "SYSTEM_TRAY" | "HIDDEN"

export type ModuleRoute = {
  /** URL segment, e.g. "atmospheric-radar" */
  slug: string
  /** Display label for navigation, e.g. "Atmospheric Radar" */
  label: string
  /** Lucide icon name, e.g. "Radio" */
  icon?: string
  /** The React component to render for this route */
  component: ComponentType<any>
}

export type WidgetConfig = {
  id: string
  label?: string
  component: ComponentType<any>
  targetDashboard: "HOME" | "COMMAND_CENTER" | "CONSOLE" | string
}

export type ModuleDefinition = {
  /** Unique module identifier, e.g. "observatory" */
  id: string
  /** Display label for top-level navigation, e.g. "OBSERVATORY" */
  label: string
  /** Lucide icon name for the module, e.g. "Telescope" */
  icon?: string
  /** Base URL path, e.g. "/observatory" */
  basePath: string
  /** Default route slug to redirect to, e.g. "daily-transmission" */
  defaultRoute: string
  /** The architectural type of this module */
  type: ModuleType
  /** Where this module should be placed in the global navigation */
  navPlacement: NavPlacement
  /** All routes/pages this module provides */
  routes: ModuleRoute[]
  /** Optional widgets that this module injects into other dashboards */
  widgets?: WidgetConfig[]
}

export const NAVIGATION_MESH = {
  portal: [
    { label: "Home", href: "/", icon: "Home" },
    {
      label: "Observatory",
      href: "/observatory",
      icon: "Telescope",
      subLinks: [
        { label: "Daily Transmission", href: "/observatory/daily-transmission", icon: "Radio" },
        { label: "Global Monitoring", href: "/observatory/global-monitoring", icon: "Globe" },
        { label: "Lunar Calendar", href: "/observatory/lunar-calendar", icon: "Moon" },
        { label: "Eclipse Tracker", href: "/observatory/eclipse-tracker", icon: "Eclipse" },
        { label: "Qibla AR Scope", href: "/observatory/qibla-ar", icon: "Compass" },
        { label: "Orbital Mechanics", href: "/astronomy/divine-astronomy", icon: "Orbit" },
        { label: "Solar Telemetry", href: "/astronomy/sun-position", icon: "Sun" },
        { label: "Celestial Star Map", href: "/observatory/celestial-star-map", icon: "Sparkles" },
        { label: "Atmospheric Radar", href: "/observatory/atmospheric-radar", icon: "Radio" },
      ],
    },
    {
      label: "Explore",
      href: "/knowledge",
      icon: "BookOpen",
      subLinks: [
        { label: "Scripture", href: "/knowledge/kitab", icon: "BookOpen" },
        { label: "Traditions", href: "/knowledge/hadits", icon: "ScrollText" },
        { label: "Search", href: "/knowledge/search", icon: "Search" },
        { label: "Sources", href: "/knowledge/sources", icon: "Database" },
        { label: "Source transparency", href: "/transparency", icon: "ShieldCheck" },
        { label: "Methodology", href: "/methodology", icon: "FileText" },
        { label: "About", href: "/about", icon: "Info" },
      ],
    },
  ],
  commandCenter: [
    { label: "Dashboard", href: "/dashboard", icon: "LayoutDashboard" },
    { label: "Hadith Database", href: "/hadiths", icon: "ScrollText" },
    { label: "Scripture Hub", href: "/scriptures", icon: "BookOpen" },
    { label: "User Access", href: "/users", icon: "Users" },
    { label: "CAB Governance", href: "/cab", icon: "ShieldCheck" },
    { label: "Operator Profile", href: "/profile", icon: "User" },
    { label: "Dev Terminal", href: "/terminal", icon: "Terminal" },
  ],
} as const
