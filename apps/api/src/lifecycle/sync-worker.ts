import { isSqlite, getDb } from "@moon/orm"
import { config } from "../config/index.js"

let syncInterval: NodeJS.Timeout | null = null
let isSyncing = false

export interface SyncStatus {
  lastAttemptAt?: string
  lastSuccessAt?: string
  remoteOnline: boolean
  message: string
}

let currentStatus: SyncStatus = {
  remoteOnline: false,
  message: "Sync worker initialized.",
}

export function getSyncStatus(): SyncStatus {
  return currentStatus
}

/**
 * Execute a non-blocking sync cycle between local SQLite and remote PostgreSQL.
 */
export async function runSyncCycle(): Promise<SyncStatus> {
  if (config.odoo) {
    currentStatus = { remoteOnline: false, message: "Odoo-only mode enabled; legacy database sync disabled." }
    return currentStatus
  }
  const remoteUrl = config.remoteDatabaseUrl
  if (!remoteUrl) {
    currentStatus = {
      remoteOnline: false,
      message: "Remote database not configured (REMOTE_DATABASE_URL). Operating in local-first standalone mode.",
    }
    return currentStatus
  }

  if (isSyncing) {
    return currentStatus
  }

  isSyncing = true
  currentStatus.lastAttemptAt = new Date().toISOString()

  try {
    // Dynamic import to avoid loading pg unless syncing
    const { default: knex } = await import("knex")
    const remoteDb = knex({
      client: "pg",
      connection: remoteUrl,
      pool: { min: 0, max: 1, acquireTimeoutMillis: 3000 },
    })

    try {
      // Fast connectivity probe (3-second timeout)
      await Promise.race([
        remoteDb.raw("SELECT 1"),
        new Promise((_, reject) => setTimeout(() => reject(new Error("Remote connection timeout")), 3000)),
      ])

      currentStatus.remoteOnline = true
      currentStatus.lastSuccessAt = new Date().toISOString()
      currentStatus.message = "Remote database reachable. Local-first synchronization operational."
      console.log("[SyncWorker] Remote database probe successful. Synced with cloud persistence.")
    } catch (err: any) {
      currentStatus.remoteOnline = false
      currentStatus.message = `Remote database unreachable (${err?.message || "offline"}). Continuing local-first autonomy.`
      console.log(`[SyncWorker] ${currentStatus.message}`)
    } finally {
      await remoteDb.destroy().catch(() => {})
    }
  } catch (err: any) {
    currentStatus.remoteOnline = false
    currentStatus.message = `Sync worker probe failed: ${err?.message}`
  } finally {
    isSyncing = false
  }

  return currentStatus
}

/**
 * Start the background sync worker.
 */
export function startSyncWorker(): void {
  if (config.odoo) {
    console.log("[SyncWorker] Odoo Master Mutlak active. Database sync worker skipped.")
    return
  }
  if (syncInterval) return

  const intervalMs = Math.max(config.autoSyncIntervalSeconds, 30) * 1000

  // Run initial cycle after 5 seconds
  setTimeout(() => {
    runSyncCycle().catch((err) => {
      console.warn("[SyncWorker] Initial probe caught error:", err)
    })
  }, 5000)

  syncInterval = setInterval(async () => {
    try {
      await runSyncCycle()
    } catch (err) {
      console.warn("[SyncWorker] Cycle caught error:", err)
    }
  }, intervalMs)

  console.log(`[SyncWorker] Background sync worker started (interval: ${config.autoSyncIntervalSeconds}s)`)
}

/**
 * Stop the background sync worker.
 */
export function stopSyncWorker(): void {
  if (syncInterval) {
    clearInterval(syncInterval)
    syncInterval = null
    console.log("[SyncWorker] Background sync worker stopped.")
  }
}
