import type { ModuleDefinition, NavLinkConfig } from "./types"
import home from "./home"
import observatory from "./observatory"
import knowledge from "./knowledge"

import history from "./history"
import commandCenter from "./command-center"
import astronomy from "./astronomy"
import analytics from "./analytics"
import mission from "./mission"
import auth from "./auth"
import seismix from "./seismix"
import shootgun from "./shootgun"

// ── Daftar Modul Terdaftar ──────────────────────────────────────
// Tambahkan modul baru di sini. Satu baris per modul.
// Modul yang belum dimigrasikan ke @modules/ bisa ditambahkan setelah Fase 2.
export const MODULE_REGISTRY: ModuleDefinition[] = [
  home,
  observatory,
  knowledge,
  history,
  commandCenter,
  astronomy,
  analytics,
  mission,
  auth,
  seismix,
  shootgun,
]

// ── Helper: Cari modul berdasarkan ID ───────────────────────────
export function getModule(id: string): ModuleDefinition | undefined {
  return MODULE_REGISTRY.find((m) => m.id === id)
}

// ── Helper: Bangun array navigasi global dari semua modul ───────
export function buildGlobalNavigation(): NavLinkConfig[] {
  return buildNavigation("OS_DOCK")
}

// ── Helper: Bangun navigasi berdasarkan target placement ────────
export function buildNavigation(
  placement: "OS_DOCK" | "ERP_SIDEBAR" | "SYSTEM_TRAY" | "HIDDEN"
): NavLinkConfig[] {
  const filteredModules = MODULE_REGISTRY.filter(
    (m) => m.navPlacement === placement
  )

  const moduleNavItems: NavLinkConfig[] = filteredModules.map((m) => ({
    label: m.label,
    href: `${m.basePath}/${m.defaultRoute}`,
    icon: m.icon,
    subLinks: m.routes.map((r) => ({
      label: r.label,
      href: `${m.basePath}/${r.slug}`,
      icon: r.icon,
    })),
  }))

  return moduleNavItems
}

// ── Helper: Ambil semua widget untuk dashboard tertentu ─────────
export function getWidgetsForDashboard(dashboard: string) {
  const widgets: any[] = []
  MODULE_REGISTRY.forEach((m) => {
    if (m.widgets) {
      widgets.push(...m.widgets.filter((w) => w.targetDashboard === dashboard))
    }
  })
  return widgets
}

// Re-export types for convenience
export type { ModuleDefinition, ModuleRoute, NavLinkConfig } from "./types"
export { defineModule } from "./define-module"
