import { isSqlite } from "@moon/orm"
import { seedBaseData, loadBaseData, seedWitnessGraphCore } from "../addons/index.js"

/**
 * ◈ System Bootstrapper
 *
 * Automatically provisions baseline administrative accounts and the
 * canonical Witness ontological knowledge graph if starting in dev SQLite
 * or when MOON_BOOTSTRAP_ON_START is explicitly requested.
 */
export async function bootstrapSystemData(): Promise<void> {
  const shouldBootstrap =
    process.env.MOON_BOOTSTRAP_ON_START === "true" ||
    (isSqlite() && process.env.NODE_ENV !== "production")

  if (!shouldBootstrap) {
    console.log("[App] Automatic seed disabled; use pnpm db:install or pnpm db:seed.")
    return
  }

  try {
    await seedBaseData()
    await loadBaseData()
    const graphSeed = await seedWitnessGraphCore()
    console.log(
      `[App] Witness graph core seeded: ${graphSeed.relationTypeCount} relation types (${graphSeed.ontologyVersion}), ${graphSeed.religionContextCount} religion contexts`
    )
    console.log("[App] Programmatic boot executed and baseline data seeded!")
  } catch (err) {
    console.error("[App] Failed to seed baseline data:", err)
  }
}
