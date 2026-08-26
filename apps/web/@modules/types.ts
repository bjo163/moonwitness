import type { ComponentType } from "react"
export type { NavLinkConfig } from "@workspace/types"

/**
 * Represents a single route/page within a module.
 * Each route maps a URL slug to a React component.
 */
export type ModuleRoute = {
  /** URL segment, e.g. "atmospheric-radar" */
  slug: string
  /** Display label for navigation, e.g. "Atmospheric Radar" */
  label: string
  /** Lucide icon name, e.g. "Radio" */
  icon?: string
  /** The React component to render for this route */
  component: ComponentType
}

export type ModuleType = "CORE_OS" | "APP" | "WIDGET_PACK" | "SERVICE"
export type NavPlacement = "OS_DOCK" | "ERP_SIDEBAR" | "SYSTEM_TRAY" | "HIDDEN"

export type WidgetConfig = {
  id: string
  label?: string
  component: ComponentType<any>
  targetDashboard: "HOME" | "COMMAND_CENTER" | "CONSOLE" | string
}

/**
 * The manifest for a self-contained module.
 * Inspired by Odoo's __manifest__.py — one file defines everything
 * the system needs to know about this module.
 */
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

/**
 * Navigation link configuration derived from module definitions.
 * Used by navbar, sidebar, and other navigation components.
 */
