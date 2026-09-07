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
import { syncSuperuserFromEnv } from "./lifecycle/admin-sync.js"
import { startSystemTelemetry } from "./lifecycle/telemetry.js"
import { startSyncWorker } from "./lifecycle/sync-worker.js"
import { registerGracefulShutdown } from "./lifecycle/shutdown.js"

// ── 1. Initialize Server Instance ──────────────────────────────────────────
export const server = new NativeServer({
  database: config.databaseUrl,
  jwtSecret: config.jwtSecret,
  port: config.port,
  email: config.email,
  odoo: config.odoo,
  addons: config.odoo ? [] : allAddonModels,
  cors: config.cors,
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

  // Always synchronize superuser credentials directly from .env
  await syncSuperuserFromEnv()

  // Start background cron scheduler, telemetry, and local-first sync worker
  globalCronRunner.start()
  startSystemTelemetry()
  startSyncWorker()

  // Bootstrap baseline accounts and ontology graph if enabled
  await bootstrapSystemData()
})
