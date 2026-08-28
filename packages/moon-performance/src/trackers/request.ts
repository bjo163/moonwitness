import { getModel, createCtx, SUPERUSER_ID } from '@moon/orm'
import type { RequestMetrics } from '../types/index.js'

/**
 * Track HTTP request performance
 */
export async function trackRequest(metrics: RequestMetrics): Promise<void> {
  try {
    const PxRequest = getModel('px.request')
    if (!PxRequest) return

    const env = createCtx(SUPERUSER_ID, {}, getModel as any)
    const isSlow = metrics.latencyMs > 500

    await PxRequest.spawn(PxRequest as any, env, {
      method: metrics.method,
      path: metrics.path,
      latencyMs: metrics.latencyMs,
      statusCode: metrics.statusCode,
      cacheStatus: metrics.cacheStatus || 'N/A',
      userAgent: metrics.userAgent,
      ipAddress: metrics.ipAddress,
      requestSize: metrics.requestSize,
      responseSize: metrics.responseSize,
      errorMessage: metrics.errorMessage,
    })

    if (isSlow) {
      console.warn(`[PERF] Slow request: ${metrics.method} ${metrics.path} took ${metrics.latencyMs}ms`)
    }
  } catch (err) {
    console.error('[PERF] Failed to track request:', err)
  }
}
