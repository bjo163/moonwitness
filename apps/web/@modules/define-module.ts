import type { ModuleDefinition } from "./types"

/**
 * Factory helper to define a module with full type safety.
 * Inspired by Odoo's __manifest__.py pattern.
 *
 * Usage:
 * ```ts
 * export default defineModule({
 *   id: "observatory",
 *   label: "OBSERVATORY",
 *   basePath: "/observatory",
 *   defaultRoute: "daily-transmission",
 *   routes: [...]
 * })
 * ```
 */
export function defineModule(config: ModuleDefinition): ModuleDefinition {
  return Object.freeze(config)
}
