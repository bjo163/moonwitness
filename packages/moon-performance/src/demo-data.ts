import { createCtx, getModel, SUPERUSER_ID } from '@moon/orm'

export async function loadDemoData() {
  const PxRequest = getModel('px.request')
  const PxCache = getModel('px.cache')
  const PxQuery = getModel('px.query')
  const PxSystem = getModel('px.system')

  if (!PxRequest || !PxCache || !PxQuery || !PxSystem) return

  const env = createCtx(SUPERUSER_ID, {}, getModel)

  // ── 1. HTTP Request Telemetry ──
  const requestSeeds = [
    { method: 'GET', path: '/api/witness/scriptures', latencyMs: 14.2, statusCode: 200, cacheStatus: 'HIT' },
    { method: 'GET', path: '/api/witness/hadiths', latencyMs: 18.5, statusCode: 200, cacheStatus: 'HIT' },
    { method: 'GET', path: '/api/observatory/moon-phase', latencyMs: 3.1, statusCode: 200, cacheStatus: 'MISS' },
    { method: 'POST', path: '/auth/login', latencyMs: 45.8, statusCode: 200, cacheStatus: 'BYPASS' },
    { method: 'GET', path: '/api/cab/summary', latencyMs: 12.4, statusCode: 200, cacheStatus: 'HIT' },
    { method: 'GET', path: '/api/witness/asmaul-husna', latencyMs: 8.7, statusCode: 200, cacheStatus: 'HIT' }
  ]

  const existingRequests = await PxRequest.fetch(PxRequest, env, [], undefined, { limit: 5 })
  if (!existingRequests.length) {
    for (const r of requestSeeds) {
      await PxRequest.spawn(PxRequest, env, r)
    }
  }

  // ── 2. Cache Performance ──
  const cacheSeeds = [
    { cacheKey: 'witness:scriptures:all', hitCount: 1420, missCount: 45, avgLatencyMs: 1.2, ttlSeconds: 300 },
    { cacheKey: 'witness:hadith:bukhari', hitCount: 890, missCount: 22, avgLatencyMs: 2.1, ttlSeconds: 600 },
    { cacheKey: 'cab:summary:metrics', hitCount: 340, missCount: 18, avgLatencyMs: 0.8, ttlSeconds: 60 }
  ]
  for (const c of cacheSeeds) {
    const rows = await PxCache.fetch(PxCache, env, [['cacheKey', '=', c.cacheKey]])
    if (!rows.length) {
      await PxCache.spawn(PxCache, env, c)
    }
  }

  // ── 3. Query Benchmarks ──
  const querySeeds = [
    { model: 'wx.scripture.verse', operation: 'SEARCH', executionMs: 8.4, isSlow: false, recordCount: 10 },
    { model: 'cab.change', operation: 'SELECT', executionMs: 4.2, isSlow: false, recordCount: 4 },
    { model: 'wx.relation', operation: 'SEARCH', executionMs: 112.5, isSlow: true, recordCount: 120 }
  ]
  const existingQueries = await PxQuery.fetch(PxQuery, env, [], undefined, { limit: 3 })
  if (!existingQueries.length) {
    for (const q of querySeeds) {
      await PxQuery.spawn(PxQuery, env, q)
    }
  }

  // ── 4. System Snapshot ──
  const existingSystem = await PxSystem.fetch(PxSystem, env, [], undefined, { limit: 1 })
  if (!existingSystem.length) {
    await PxSystem.spawn(PxSystem, env, {
      memoryUsedMb: 142.5,
      memoryTotalMb: 512.0,
      cpuUsagePercent: 4.8,
      eventLoopLagMs: 1.1,
      activeConnections: 12,
      totalConnections: 145,
      uptimeSeconds: 86400
    })
  }

  // ── 5. Custom Dashboard Widgets ──
  const IrDashboardWidget = getModel('ir.dashboard.widget')
  if (IrDashboardWidget) {
    const widgetSeeds = [
      {
        name: 'Active Support Tickets',
        widgetType: 'kpi_card',
        model: 'hd.ticket',
        metricField: 'id',
        aggregation: 'count',
        accentColor: 'cyan',
        sequence: 10,
        active: true,
      },
      {
        name: 'Project Task Milestones',
        widgetType: 'kpi_card',
        model: 'pj.task',
        metricField: 'id',
        aggregation: 'count',
        accentColor: 'green',
        sequence: 20,
        active: true,
      },
      {
        name: 'Ticket Priority Distribution',
        widgetType: 'metric_chart',
        model: 'hd.ticket',
        metricField: 'priority',
        aggregation: 'count',
        accentColor: 'purple',
        sequence: 30,
        active: true,
      },
      {
        name: 'Recent Background Jobs',
        widgetType: 'record_feed',
        model: 'ir.queue.job',
        metricField: 'status',
        aggregation: 'count',
        accentColor: 'yellow',
        sequence: 40,
        active: true,
      },
    ]

    for (const w of widgetSeeds) {
      await (IrDashboardWidget as any).spawn(IrDashboardWidget, env, w)
    }
  }

  console.log('[moon-performance] Demo data loaded: requests, cache, query benchmarks, system metrics, dashboard widgets')
}
