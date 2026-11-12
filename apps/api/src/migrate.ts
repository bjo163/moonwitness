import "dotenv/config"
import { bootstrap, check, diff, diffAdditive, down, status, up } from "@moon/orm"
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
import cronAddons from "@moon/cron"

async function seedLegacyWitnessIfEnabled(): Promise<void> {
  await seedWitnessGraphCore()
}

async function loadAllDemoData() {
  console.log("=== Loading Demo Data across all 16 Addon Packages ===")

  console.log("[Level 0] Seeding @moon/base demo data...")
  const { loadDemoData: loadBaseDemo } = await import("@moon/base")
  await loadBaseDemo()

  console.log("[Level 1] Seeding independent addon demo data...")
  const [witnessM, perfM, projectM, productM, accountM, mailM, geoM, cronM] = await Promise.all([
    import("@moon/witness"),
    import("@moon/performance"),
    import("@moon/project"),
    import("@moon/product"),
    import("@moon/account"),
    import("@moon/mail"),
    import("@moon/geo"),
    import("@moon/cron"),
  ])
  const legacyDemoLoads = [
    witnessM.loadDemoData(),
    projectM.loadDemoData(),
    productM.loadDemoData(),
    accountM.loadDemoData(),
    mailM.loadDemoData(),
    geoM.loadDemoData(),
    cronM.loadDemoData(),
  ]
  await Promise.all(legacyDemoLoads)

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
      "JWT_SECRET is required for migration commands. Set it explicitly before running migration operations."
    )
  }

  new NativeServer({
    database:
      process.env.DATABASE_URL ||
      (process.env.NODE_ENV === "production"
        ? "postgres://localhost/moonwitness"
        : "sqlite://./data/moonwitness.dev.db"),
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
      ...cronAddons.models,
    ],
  })

  const cmd = process.argv[2]
  const isDemo = process.argv.includes("--demo")
  const withExternal = process.argv.includes("--with-external")

  if (cmd === "diff") {
    await diff()
  } else if (cmd === "diff:additive" || cmd === "additive") {
    await diffAdditive()
  } else if (cmd === "up" || cmd === "migrate") {
    await up()
  } else if (cmd === "down" || cmd === "rollback") {
    await down()
  } else if (cmd === "status" || cmd === "dry-run") {
    console.table(await status())
  } else if (cmd === "check") {
    await check()
    console.log("Migration integrity check passed.")
  } else if (cmd === "bootstrap") {
    await bootstrap()
  } else if (cmd === "seed") {
    const integrity = verifySeedIntegrity()
    if (!integrity.valid) throw new Error(`Seed integrity check failed: ${integrity.errors.join(", ")}`)
    await loadBaseData()
    await seedLegacyWitnessIfEnabled()
    console.log("Canonical seed completed.")
    if (isDemo || withExternal) {
      await loadAllDemoData()
    }
  } else if (cmd === "demo") {
    const integrity = verifySeedIntegrity()
    if (!integrity.valid) throw new Error(`Seed integrity check failed: ${integrity.errors.join(", ")}`)
    await loadBaseData()
    await seedLegacyWitnessIfEnabled()
    await loadAllDemoData()
  } else if (cmd === "install") {
    await up()
    const integrity = verifySeedIntegrity()
    if (!integrity.valid) throw new Error(`Seed integrity check failed: ${integrity.errors.join(", ")}`)
    await loadBaseData()
    await seedLegacyWitnessIfEnabled()
    console.log("Database install completed.")
    if (isDemo || withExternal) {
      await loadAllDemoData()
    }
  } else if (cmd === "verify") {
    await check()
    const integrity = verifySeedIntegrity()
    if (!integrity.valid) throw new Error(`Seed integrity check failed: ${integrity.errors.join(", ")}`)
    console.log("Database migration and canonical seed integrity checks passed.")
  } else {
    console.log("Usage: pnpm tsx src/migrate.ts <diff|diff:additive|up|down|bootstrap|status|check|seed|demo|install|verify> [--demo] [--with-external]")
  }

  process.exit(0)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
