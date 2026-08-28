import PxRequest from './models/px-request.ts'
import PxCache from './models/px-cache.ts'
import PxQuery from './models/px-query.ts'
import PxSystem from './models/px-system.ts'
import IrDashboardWidget from './models/ir-dashboard-widget.ts'

// Trackers
export { trackRequest } from './trackers/request.ts'
export { trackQuery } from './trackers/query.ts'
export { trackSystem } from './trackers/system.ts'
export { updateCacheStats } from './trackers/cache.ts'
export { loadDemoData } from './demo-data.ts'
export { views } from './views.ts'

// Middleware
export { performanceMiddleware } from './middleware/performance.ts'

// Types
export type {
  RequestMetrics,
  QueryMetrics,
  SystemMetrics,
  CacheStatsUpdate
} from './types/index.ts'

// Models export
export {
  PxRequest,
  PxCache,
  PxQuery,
  PxSystem,
  IrDashboardWidget
}

/**
 * Default addon export for moon-base integration
 */
export default {
  name: 'performance',
  description: 'Performance monitoring, metrics tracking, and custom KPI dashboards',
  depends: ['base'],
  models: [
    PxRequest,
    PxCache,
    PxQuery,
    PxSystem,
    IrDashboardWidget
  ]
}
