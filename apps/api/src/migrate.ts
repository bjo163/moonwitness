import "dotenv/config"
import { diff, up, down } from "@moon/orm"
import { NativeServer } from "@moon/server"
import baseAddons from "@moon/base"

async function run() {
  new NativeServer({
    database: process.env.DATABASE_URL || "postgres://localhost/moonwitness",
    jwtSecret:
      process.env.JWT_SECRET || "migration-script-temporary-key-32chars",
    addons: baseAddons.models,
  })

  const cmd = process.argv[2]

  if (cmd === "diff") {
    await diff()
  } else if (cmd === "up" || cmd === "migrate") {
    await up()
  } else if (cmd === "down" || cmd === "rollback") {
    await down()
  } else {
    console.log("Usage: pnpm tsx src/migrate.ts <diff|up|down>")
  }

  process.exit(0)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
