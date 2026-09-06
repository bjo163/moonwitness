import type { NativeServer } from "@moon/server"
import { globalCronRunner } from "../addons/index.js"
import { stopSystemTelemetry } from "./telemetry.js"
import { stopSyncWorker } from "./sync-worker.js"

let isShuttingDown = false

/**
 * ◈ Graceful Process Shutdown Handler
 *
 * Captures SIGINT and SIGTERM termination signals, stops recurring cron jobs,
 * flushes telemetry, severs SSE connections cleanly, and releases database pools.
 */
export function registerGracefulShutdown(server: NativeServer): void {
  const shutdown = async (signal: string) => {
    if (isShuttingDown) return
    isShuttingDown = true

    console.log(`\n[App] Received ${signal}. Initiating graceful shutdown...`)

    try {
      // 1. Stop background workers
      globalCronRunner.stop()
      stopSystemTelemetry()
      stopSyncWorker()

      // 2. Terminate server, SSE streams, OpenTelemetry, and Knex/SQLite connection pool
      await server.stop()
      console.log("[App] Graceful shutdown completed cleanly.")
      process.exit(0)
    } catch (err) {
      console.error("[App] Error during graceful shutdown:", err)
      process.exit(1)
    }
  }

  process.on("SIGINT", () => shutdown("SIGINT"))
  process.on("SIGTERM", () => shutdown("SIGTERM"))
}
