import "dotenv/config"
import { NativeServer } from "@moon/server"
import baseAddons from "@moon/base"
import { getModel, createCtx, SUPERUSER_ID } from "@moon/orm"

async function run() {
  const server = new NativeServer({
    database: process.env.DATABASE_URL || "postgres://localhost/moonwitness",
    jwtSecret: "secret",
    addons: baseAddons.models,
  })

  // Start to initialize DB connection
  await server.start()

  // Wait a moment for tables to sync
  await new Promise((r) => setTimeout(r, 2000))

  const FxSession = getModel("fx.session")
  const env = createCtx(SUPERUSER_ID, {}, getModel as any)

  const records = await FxSession?.query(env).fetch()
  console.log("\n--- FX SESSION RECORDS ---")
  console.log(records)

  process.exit(0)
}

run().catch(console.error)
