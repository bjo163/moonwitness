import { trackSystem } from "@moon/performance"

let telemetryTimer: NodeJS.Timeout | null = null

/**
 * ◈ Background System Telemetry Collector
 *
 * Flushes memory utilization, system uptime, and active connection counts
 * to the operational performance registry on a 60-second cycle.
 */
export function startSystemTelemetry(intervalMs = 60000): void {
  if (telemetryTimer) return

  telemetryTimer = setInterval(async () => {
    try {
      const activeClients = (globalThis as any).moonActiveClients
      const memUsage = process.memoryUsage()

      await trackSystem({
        memoryUsedMb: memUsage.heapUsed / 1024 / 1024,
        memoryTotalMb: memUsage.heapTotal / 1024 / 1024,
        uptimeSeconds: Math.floor(process.uptime()),
        activeConnections: activeClients ? activeClients.size : 0,
      })
    } catch (err) {
      console.warn("[Telemetry] Safe boundary caught error:", err)
    }
  }, intervalMs)

  // Ensure timer does not block process exit during tests
  telemetryTimer.unref()
}

export function stopSystemTelemetry(): void {
  if (telemetryTimer) {
    clearInterval(telemetryTimer)
    telemetryTimer = null
  }
}
