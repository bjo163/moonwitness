/**
 * Type definitions for performance tracking
 */

export interface RequestMetrics {
  method: string
  path: string
  latencyMs: number
  statusCode: number
  cacheStatus?: 'HIT' | 'MISS' | 'STALE' | 'BYPASS' | 'N/A'
  userAgent?: string
  ipAddress?: string
  requestSize?: number
  responseSize?: number
  errorMessage?: string
}

export interface QueryMetrics {
  model: string
  operation: 'SELECT' | 'INSERT' | 'UPDATE' | 'DELETE' | 'SEARCH' | 'BROWSE' | 'RPC'
  executionMs: number
  recordCount?: number
  userId?: number
  hadError?: boolean
  errorMessage?: string
}

export interface SystemMetrics {
  memoryUsedMb: number
  memoryTotalMb: number
  cpuUsagePercent?: number
  eventLoopLagMs?: number
  activeConnections?: number
  totalConnections?: number
  uptimeSeconds: number
}

export interface CacheStatsUpdate {
  cacheKey: string
  status: 'HIT' | 'MISS' | 'STALE'
  latencyMs: number
}
