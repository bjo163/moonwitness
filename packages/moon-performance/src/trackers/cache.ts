import { getModel, createCtx, SUPERUSER_ID } from '@moon/orm'
import type { CacheStatsUpdate } from '../types/index.ts'

/**
 * Update cache statistics
 */
export async function updateCacheStats(
  cacheKey: string,
  status: 'HIT' | 'MISS' | 'STALE',
  latencyMs: number
): Promise<void> {
  try {
    const PxCache = getModel('px.cache')
    if (!PxCache) return

    const env = createCtx(SUPERUSER_ID, {}, getModel as any)
    
    // Find existing cache stat record
    const existing: any[] = await (PxCache as any).search(
      PxCache as any,
      env,
      [['cacheKey', '=', cacheKey]],
      { limit: 1 }
    )
    
    if (existing.length > 0) {
      const record = existing[0]
      const updates: any = {
        lastAccess: new Date(),
      }
      
      // Increment counters
      if (status === 'HIT') updates.hitCount = (record.hitCount || 0) + 1
      if (status === 'MISS') updates.missCount = (record.missCount || 0) + 1
      if (status === 'STALE') updates.staleCount = (record.staleCount || 0) + 1
      
      // Update average latency
      const totalRequests = (record.hitCount || 0) + (record.missCount || 0) + (record.staleCount || 0)
      const currentAvg = record.avgLatencyMs || 0
      updates.avgLatencyMs = (currentAvg * totalRequests + latencyMs) / (totalRequests + 1)
      
      await (PxCache as any).write(PxCache as any, env, [record.id], updates)
    } else {
      // Create new record
      await PxCache.spawn(PxCache as any, env, {
        cacheKey,
        hitCount: status === 'HIT' ? 1 : 0,
        missCount: status === 'MISS' ? 1 : 0,
        staleCount: status === 'STALE' ? 1 : 0,
        avgLatencyMs: latencyMs,
        periodStart: new Date(),
      })
    }
  } catch (err) {
    console.error('[PERF] Failed to update cache stats:', err)
  }
}
