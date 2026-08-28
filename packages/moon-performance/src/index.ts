import PxRequest from './models/px-request.js'
import PxCache from './models/px-cache.js'
import PxQuery from './models/px-query.js'
import PxSystem from './models/px-system.js'
import IrDashboardWidget from './models/ir-dashboard-widget.js'

// Trackers
export { trackRequest } from './trackers/request.js'
export { trackQuery } from './trackers/query.js'
export { trackSystem } from './trackers/system.js'
export { updateCacheStats } from './trackers/cache.js'
export { loadDemoData } from './demo-data.js'
export { views } from './views.js'

// Middleware
export { performanceMiddleware } from './middleware/performance.js'

// Types
export type {
  RequestMetrics,
  QueryMetrics,
  SystemMetrics,
  CacheStatsUpdate
} from './types/index.js'

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
