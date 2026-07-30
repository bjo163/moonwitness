/**
 * Navigation Types & Utilities
 *
 * PENTING: File ini TIDAK BOLEH mengimpor dari views/ atau @modules/.
 * Tipe NavLinkConfig didefinisikan di @modules/types.ts dan di-re-export di sini
 * untuk backward compatibility.
 *
 * Navigasi aktual dibangun melalui:
 *   import { buildGlobalNavigation } from "@modules"
 */

// Re-export NavLinkConfig type for backward compatibility
export type { NavLinkConfig } from "@modules/types"

// Re-export navigation builder for convenience
export { buildGlobalNavigation } from "@modules/index"

