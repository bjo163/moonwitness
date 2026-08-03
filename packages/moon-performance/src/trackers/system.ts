import { getModel, createCtx, SUPERUSER_ID } from '@moon/orm'
import type { SystemMetrics } from '../types/index.js'

/**
 * Track system metrics
 */
export async function trackSystem(metrics?: Partial<SystemMetrics>): Promise<void> {
  try {
    const PxSystem = getModel('px.system')
    if (!PxSystem) return

    const env = createCtx(SUPERUSER_ID, {}, getModel as any)
    const memUsage = process.memoryUsage()
    
    await PxSystem.spawn(PxSystem as any, env, {
      memoryUsedMb: memUsage.heapUsed / 1024 / 1024,
      memoryTotalMb: memUsage.heapTotal / 1024 / 1024,
      uptimeSeconds: Math.floor(process.uptime()),
      activeConnections: metrics?.activeConnections || 0,
      totalConnections: metrics?.totalConnections || 0,
      cpuUsagePercent: metrics?.cpuUsagePercent,
      eventLoopLagMs: metrics?.eventLoopLagMs,
    })
  } catch (err) {
    console.error('[PERF] Failed to track system:', err)
  }
}
