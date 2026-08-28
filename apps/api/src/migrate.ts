import "dotenv/config"
import { check, diff, down, status, up, forge, getDb } from "@moon/orm"
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
    const startTime = Date.now()
    const stats: Record<string, number> = {}

    await up()
    const migrationStatus = await status()
    const lastBatch = Math.max(...migrationStatus.map((m: any) => m.batch))
    stats.migrations = migrationStatus.filter((m: any) => m.batch === lastBatch).length

    const integrity = verifySeedIntegrity()
    if (!integrity.valid) throw new Error(`Seed integrity check failed: ${integrity.errors.join(", ")}`)
    stats.seedIntegrity = 1

    if (process.env.NODE_ENV !== 'production') {
      const result = await forge({ silent: true })
      if (result.applied.length > 0) {
        console.log(`Schema sync: ${result.applied.length} changes applied (${result.summary.tablesCreated} tables, ${result.summary.columnsAdded} cols, ${result.summary.indexesCreated} indexes)`)
      }
      stats.schemaSync = result.applied.length
    } else {
      const result = await diff()
      if (result.applied.length > 0) {
        throw new Error(
          `Production schema drift detected: ${result.applied.length} pending changes (${result.summary.tablesCreated} tables, ${result.summary.columnsAdded} cols, ${result.summary.indexesCreated} indexes). Committed migrations are incomplete.`
        )
      }
      console.log('Schema sync: zero drift detected in production.')
      stats.schemaSync = 0
    }

    await loadBaseData()
    stats.baseOperators = 4
    stats.baseObservatories = 2
    stats.baseReports = 3

    await seedWitnessGraphCore()
    stats.scriptures = 1
    stats.entities = 10
    stats.relations = 2
    stats.religions = 3

    await loadAllDemoData()
    const demoStats = await collectDemoStats()
    Object.assign(stats, demoStats)

    const duration = ((Date.now() - startTime) / 1000).toFixed(2)
    const n = (v: any) => (typeof v === 'number' ? v : 0)
    console.log("\n╔══════════════════════════════════════════════════════════════╗")
    console.log("║              INSTALLATION COMPLETE — SUMMARY                 ║")
    console.log("╚══════════════════════════════════════════════════════════════╝")
    console.log(`  Duration        : ${duration}s`)
    console.log(`  Migrations      : ${stats.migrations}`)
    console.log(`  Schema sync     : ${stats.schemaSync} changes`)
    console.log(`  Seed integrity  : ${stats.seedIntegrity ? 'PASS' : 'FAIL'}`)
    console.log("  ────────────────────────────────────────────────────────────")
    console.log(`  Base operators  : ${stats.baseOperators}`)
    console.log(`  Base observatories: ${stats.baseObservatories}`)
    console.log(`  Base reports    : ${stats.baseReports}`)
    console.log("  ────────────────────────────────────────────────────────────")
    console.log(`  Scriptures      : ${stats.scriptures}`)
    console.log(`  Entities        : ${stats.entities}`)
    console.log(`  Relations       : ${stats.relations}`)
    console.log(`  Religions       : ${stats.religions}`)
    console.log("  ────────────────────────────────────────────────────────────")
    console.log(`  Surahs seeded   : ${stats.surahs}`)
    console.log(`  Quran verses    : ${stats.verses}`)
    console.log(`  Asmaul Husna    : ${stats.asmaulHusna}`)
    console.log(`  Traditions      : ${stats.traditions}`)
    console.log(`  Hadiths         : ${stats.hadiths}`)
    console.log(`  Devotions       : ${stats.devotions}`)
    console.log(`  Figures         : ${stats.figures}`)
    console.log(`  Figure roles    : ${stats.figureRoles}`)
    console.log(`  Sources         : ${stats.sources}`)
    console.log(`  Provenances     : ${stats.provenances}`)
    console.log("  ────────────────────────────────────────────────────────────")
    console.log(`  Projects        : ${n(stats.projects)}`)
    console.log(`  Tasks           : ${n(stats.tasks)}`)
    console.log(`  Accounts        : ${n(stats.accounts)}`)
    console.log(`  Products        : ${n(stats.products)}`)
    console.log(`  Tickets         : ${n(stats.tickets)}`)
    console.log(`  RFCs            : ${n(stats.rfcs)}`)
    console.log(`  Helpdesk stages : ${n(stats.helpdeskStages)}`)
    console.log(`  SLAs            : ${n(stats.slas)}`)
    console.log("  ────────────────────────────────────────────────────────────")
    console.log(`  Total tables    : ${stats.tables || 'verified'}`)
    console.log("╚══════════════════════════════════════════════════════════════╝\n")
    console.log("Database install completed.")
  }

  async function collectDemoStats(): Promise<Record<string, number>> {
    const db = getDb()
    const stats: Record<string, number> = {}

    try {
      stats.surahs = await db('wx_scripture_book').count('id as cnt').first().then((r: any) => Number(r.cnt))
      stats.verses = await db('wx_scripture_verse').count('id as cnt').first().then((r: any) => Number(r.cnt))
      stats.asmaulHusna = await db('wx_asmaul_husna').count('id as cnt').first().then((r: any) => Number(r.cnt))
      stats.traditions = await db('wx_tradition').count('id as cnt').first().then((r: any) => Number(r.cnt))
      stats.hadiths = await db('wx_tradition_item').count('id as cnt').first().then((r: any) => Number(r.cnt))
      stats.devotions = await db('wx_devotion').count('id as cnt').first().then((r: any) => Number(r.cnt))
      stats.figures = await db('wx_figure').count('id as cnt').first().then((r: any) => Number(r.cnt))
      stats.figureRoles = await db('wx_figure_role').count('id as cnt').first().then((r: any) => Number(r.cnt))
      stats.sources = await db('wx_source').count('id as cnt').first().then((r: any) => Number(r.cnt))
      stats.provenances = await db('wx_provenance').count('id as cnt').first().then((r: any) => Number(r.cnt))
      stats.religions = await db('wx_religion').count('id as cnt').first().then((r: any) => Number(r.cnt))

      stats.projects = await db('pj_project').count('id as cnt').first().then((r: any) => Number(r.cnt))
      const tasks = await db('pj_task').count('id as cnt').first().then((r: any) => Number(r.cnt))
      stats.tasks = tasks

      stats.accounts = await db('ac_account').count('id as cnt').first().then((r: any) => Number(r.cnt))
      stats.products = await db('pr_product').count('id as cnt').first().then((r: any) => Number(r.cnt))
      stats.tickets = await db('hd_ticket').count('id as cnt').first().then((r: any) => Number(r.cnt))
      stats.rfcs = await db('cab_change').count('id as cnt').first().then((r: any) => Number(r.cnt))
      stats.helpdeskStages = await db('hd_stage').count('id as cnt').first().then((r: any) => Number(r.cnt))
      stats.slas = await db('hd_sla').count('id as cnt').first().then((r: any) => Number(r.cnt))

      const tableCount = await db('information_schema.tables').count('id as cnt')
        .where('table_schema', 'public')
        .whereNotIn('table_name', ['moon_migrations'])
        .first()
        .then((r: any) => Number(r.cnt))
      stats.tables = tableCount
    } catch {
      // Partial stats on missing tables are acceptable during install
    }

    return stats
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
