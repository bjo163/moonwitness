import { getModel, createCtx, SUPERUSER_ID } from '@moon/orm'
import type { QueryMetrics } from '../types/index.ts'

/**
 * Track database query performance
 */
export async function trackQuery(metrics: QueryMetrics): Promise<void> {
  try {
    const PxQuery = getModel('px.query')
    if (!PxQuery) return

    const env = createCtx(SUPERUSER_ID, {}, getModel as any)
    const isSlow = metrics.executionMs > 100

    await PxQuery.spawn(PxQuery as any, env, {
      model: metrics.model,
      operation: metrics.operation,
      executionMs: metrics.executionMs,
      isSlow,
      recordCount: metrics.recordCount,
      userId: metrics.userId,
      hadError: metrics.hadError || false,
      errorMessage: metrics.errorMessage,
    })

    if (isSlow) {
      console.warn(`[PERF] Slow query: ${metrics.operation} on ${metrics.model} took ${metrics.executionMs}ms`)
    }
  } catch (err) {
    console.error('[PERF] Failed to track query:', err)
  }
}
