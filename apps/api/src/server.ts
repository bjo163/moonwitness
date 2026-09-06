import { NativeServer, registerViewManifests } from "@moon/server"
import { checkDbConnection } from "@moon/orm"
import { config } from "./config/index.js"
import {
  allAddonModels,
  allAddonViews,
  initAddonRoutes,
  performanceMiddleware,
  globalCronRunner,
} from "./addons/index.js"
import { registerAllRoutes } from "./routes/index.js"
import { bootstrapSystemData } from "./lifecycle/bootstrap.js"
import { startSystemTelemetry } from "./lifecycle/telemetry.js"
import { registerGracefulShutdown } from "./lifecycle/shutdown.js"

// ── 1. Initialize Server Instance ──────────────────────────────────────────
export const server = new NativeServer({
  database: config.databaseUrl,
  jwtSecret: config.jwtSecret,
  port: config.port,
  email: config.email,
  addons: allAddonModels,
})

// ── 2. Register Middleware & Addons ─────────────────────────────────────────
server.use(performanceMiddleware())
initAddonRoutes()
registerViewManifests(allAddonViews)

// ── 3. Register All Application Routes ──────────────────────────────────────
registerAllRoutes(server)

// ── 4. Lifecycle & Process Signals ──────────────────────────────────────────
registerGracefulShutdown(server)

// ── 5. Boot Server Engine ───────────────────────────────────────────────────
server.start().then(async () => {
  const dbHealth = await checkDbConnection()
  if (dbHealth.ok) {
    console.log(
      `[Database] ✓ Connection verified: ${dbHealth.dialect} (${dbHealth.version || "Connected"}) - Latency: ${dbHealth.latencyMs}ms`
    )
  } else {
    console.error(
      `[Database] ✗ Connection failed: ${dbHealth.error} (${dbHealth.latencyMs}ms)`
    )
  }

  // Start background cron scheduler and telemetry collection
  globalCronRunner.start()
  startSystemTelemetry()

  // Bootstrap baseline accounts and ontology graph if enabled
  await bootstrapSystemData()
})
