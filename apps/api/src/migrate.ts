import "dotenv/config"
import { check, diff, down, status, up } from "@moon/orm"
import { NativeServer } from "@moon/server"
import baseAddons, {
  loadBaseData,
  verifySeedIntegrity,
} from "@moon/base"
import { seedWitnessGraphCore } from "@moon/witness"

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
    addons: baseAddons.models,
  })

  const cmd = process.argv[2]

  if (cmd === "diff") {
    await diff()
  } else if (cmd === "up" || cmd === "migrate") {
    await up()
  } else if (cmd === "down" || cmd === "rollback") {
    await down()
  } else if (cmd === "status" || cmd === "dry-run") {
    console.table(await status())
  } else if (cmd === "check") {
    await check()
    console.log("Migration integrity check passed.")
  } else if (cmd === "seed") {
    const integrity = verifySeedIntegrity()
    if (!integrity.valid) throw new Error(`Seed integrity check failed: ${integrity.errors.join(", ")}`)
    await loadBaseData()
    await seedWitnessGraphCore()
    console.log("Canonical seed completed.")
  } else if (cmd === "install") {
    await up()
    const integrity = verifySeedIntegrity()
    if (!integrity.valid) throw new Error(`Seed integrity check failed: ${integrity.errors.join(", ")}`)
    await loadBaseData()
    await seedWitnessGraphCore()
    console.log("Database install completed.")
  } else if (cmd === "verify") {
    await check()
    const integrity = verifySeedIntegrity()
    if (!integrity.valid) throw new Error(`Seed integrity check failed: ${integrity.errors.join(", ")}`)
    console.log("Database migration and canonical seed integrity checks passed.")
  } else {
    console.log("Usage: pnpm tsx src/migrate.ts <diff|up|down|status|check|seed|install|verify>")
  }

  process.exit(0)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
