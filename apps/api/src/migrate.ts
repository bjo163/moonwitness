import "dotenv/config"
import { check, diff, down, status, up, forge } from "@moon/orm"
import { NativeServer } from "@moon/server"
import baseAddons, {
  loadBaseData,
  verifySeedIntegrity,
} from "@moon/base"
import witnessAddons, { seedWitnessGraphCore } from "@moon/witness"
import performanceAddons from "@moon/performance"
import projectAddons from "@moon/project"
import helpdeskAddons from "@moon/helpdesk"
import khidraAddons from "@moon/khidra"
import mizanAddons from "@moon/mizan"
import shootgunAddons from "@moon/shootgun"
import cabAddons from "@moon/cab"
import productAddons from "@moon/product"
import stockAddons from "@moon/stock"
import accountAddons from "@moon/account"
import crmAddons from "@moon/crm"
import mailAddons from "@moon/mail"
import geoAddons from "@moon/geo"

async function loadAllDemoData() {
  console.log("=== Loading Demo Data across all 15 Addon Packages ===")

  console.log("[Level 0] Seeding @moon/base demo data...")
  const { loadDemoData: loadBaseDemo } = await import("@moon/base")
  await loadBaseDemo()

  console.log("[Level 1] Seeding independent addon demo data...")
  const [witnessM, perfM, projectM, productM, accountM, mailM, geoM] = await Promise.all([
    import("@moon/witness"),
    import("@moon/performance"),
    import("@moon/project"),
    import("@moon/product"),
    import("@moon/account"),
    import("@moon/mail"),
    import("@moon/geo"),
  ])
  await Promise.all([
    witnessM.loadDemoData(),
    perfM.loadDemoData(),
    projectM.loadDemoData(),
    productM.loadDemoData(),
    accountM.loadDemoData(),
    mailM.loadDemoData(),
    geoM.loadDemoData(),
  ])

  console.log("[Level 2] Seeding higher-tier addon demo data...")
  const [cabM, helpdeskM, mizanM, khidraM, stockM, crmM, shootgunM] = await Promise.all([
    import("@moon/cab"),
    import("@moon/helpdesk"),
    import("@moon/mizan"),
    import("@moon/khidra"),
    import("@moon/stock"),
    import("@moon/crm"),
    import("@moon/shootgun"),
  ])
  await Promise.all([
    cabM.loadDemoData(),
    helpdeskM.loadDemoData(),
    mizanM.loadDemoData(),
    khidraM.loadDemoData(),
    stockM.loadDemoData(),
    crmM.loadDemoData(),
    shootgunM.loadDemoData(),
  ])

  console.log("=== Demo Data Loading Completed Successfully ===")
}

async function run() {
  const jwtSecret = process.env.JWT_SECRET?.trim()
  if (!jwtSecret) {
    throw new Error(
      "JWT_SECRET is required for migration commands. Set it explicitly before running diff, up, or down."
    )
  }

  new NativeServer({
    database: process.env.DATABASE_URL || "postgres://localhost/moonwitness",
    jwtSecret,
    addons: [
      ...baseAddons.models,
      ...performanceAddons.models,
      ...witnessAddons.models,
      ...projectAddons.models,
      ...helpdeskAddons.models,
      ...khidraAddons.models,
      ...mizanAddons.models,
      ...shootgunAddons.models,
      ...cabAddons.models,
      ...productAddons.models,
      ...stockAddons.models,
      ...accountAddons.models,
      ...crmAddons.models,
      ...mailAddons.models,
      ...geoAddons.models,
    ],
  })

  async function full() {
    await up()
    const integrity = verifySeedIntegrity()
    if (!integrity.valid) throw new Error(`Seed integrity check failed: ${integrity.errors.join(", ")}`)
    if (process.env.NODE_ENV !== 'production') {
      const result = await forge({ silent: true })
      if (result.applied.length > 0) {
        console.log(`Schema sync: ${result.applied.length} changes applied (${result.summary.tablesCreated} tables, ${result.summary.columnsAdded} cols, ${result.summary.indexesCreated} indexes)`)
      }
    } else {
      const result = await diff()
      if (result.applied.length > 0) {
        throw new Error(
          `Production schema drift detected: ${result.applied.length} pending changes (${result.summary.tablesCreated} tables, ${result.summary.columnsAdded} cols, ${result.summary.indexesCreated} indexes). Committed migrations are incomplete.`
        )
      }
      console.log('Schema sync: zero drift detected in production.')
    }
    await loadBaseData()
    await seedWitnessGraphCore()
    await loadAllDemoData()
    console.log("Database install completed.")
  }

  const cmd = process.argv[2]

  if (cmd === "full" || cmd === "install" || cmd === "seed" || cmd === "demo") {
    await full()
  } else if (cmd === "verify") {
    await check()
    const integrity = verifySeedIntegrity()
    if (!integrity.valid) throw new Error(`Seed integrity check failed: ${integrity.errors.join(", ")}`)
    console.log("Database migration and canonical seed integrity checks passed.")
  } else {
    console.log("Usage: pnpm tsx src/migrate.ts <full|verify>")
  }

  process.exit(0)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
