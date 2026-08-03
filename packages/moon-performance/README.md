# @moon/performance

Performance monitoring and metrics tracking addon for Moonwitness Engine.

## Overview

`@moon/performance` provides comprehensive performance tracking capabilities:

- **HTTP Request Metrics** - Track request latency, status codes, cache hits/misses
- **Database Query Metrics** - Monitor query execution time, detect slow queries
- **Cache Statistics** - Aggregate cache hit rates and performance
- **System Resource Metrics** - Monitor memory, CPU, connections, uptime

## Installation

```bash
pnpm add @moon/performance
```

## Models

### `px.request` - HTTP Request Performance

Tracks individual HTTP request metrics:

- `method` - HTTP method (GET, POST, PUT, DELETE, etc.)
- `path` - Request path/endpoint
- `latencyMs` - Request latency in milliseconds
- `statusCode` - HTTP status code
- `cacheStatus` - Cache hit/miss/stale status
- `userAgent` - User agent string
- `ipAddress` - Client IP address
- `requestSize` / `responseSize` - Body sizes in bytes
- `errorMessage` - Error details if request failed
- `timestamp` - When request occurred

### `px.cache` - Cache Performance Statistics

Aggregated cache statistics per endpoint:

- `cacheKey` - Cache key or endpoint path
- `hitCount` / `missCount` / `staleCount` - Hit/miss counters
- `avgLatencyMs` - Average response latency
- `ttlSeconds` - Cache TTL configuration
- `cacheSize` - Approximate cache entry size
- `periodStart` / `periodEnd` - Statistics time window
- `lastAccess` - Last cache access timestamp

### `px.query` - Database Query Performance

Tracks database query execution:

- `model` - Model name (e.g., 'vx.user', 'mx.metric')
- `operation` - Query type (SELECT, INSERT, UPDATE, DELETE, SEARCH, BROWSE, RPC)
- `executionMs` - Query execution time in milliseconds
- `isSlow` - Flagged if query >100ms
- `queryHash` - Hash for grouping similar queries
- `recordCount` - Number of records affected/returned
- `userId` - User who triggered the query
- `stackTrace` - Abbreviated stack trace for debugging
- `hadError` / `errorMessage` - Error tracking
- `timestamp` - When query executed

### `px.system` - System Resource Metrics

System-level performance metrics:

- `memoryUsedMb` / `memoryTotalMb` - Heap memory usage
- `cpuUsagePercent` - CPU utilization
- `eventLoopLagMs` - Event loop lag indicator
- `activeConnections` - Current active connections
- `totalConnections` - Total connections since start
- `dbPoolActive` / `dbPoolIdle` - Database connection pool stats
- `uptimeSeconds` - Process uptime
- `timestamp` - When metrics collected

## Usage

### Basic Setup

```typescript
import { NativeServer } from '@moon/server'
import baseAddons from '@moon/base'
import performanceAddons, { performanceMiddleware } from '@moon/performance'

const server = new NativeServer({
  database: 'postgres://localhost/mydb',
  jwtSecret: 'your-secret',
  addons: [
    ...baseAddons.models,
    ...performanceAddons.models
  ]
})

// Add performance tracking middleware
server.use(performanceMiddleware())

server.start()
```

### Manual Tracking

```typescript
import { trackRequest, trackQuery, trackSystem } from '@moon/performance'

// Track HTTP request
await trackRequest({
  method: 'GET',
  path: '/api/users',
  latencyMs: 45.3,
  statusCode: 200,
  cacheStatus: 'HIT'
})

// Track database query
await trackQuery({
  model: 'vx.user',
  operation: 'SEARCH',
  executionMs: 12.5,
  recordCount: 25
})

// Track system metrics
await trackSystem({
  memoryUsedMb: 125.4,
  memoryTotalMb: 512.0,
  uptimeSeconds: 86400,
  activeConnections: 15
})
```

### Performance Stats API

Example endpoint to expose performance metrics:

```typescript
import { getModel, createCtx, SUPERUSER_ID } from '@moon/orm'

globalRoutes.push({
  method: 'GET',
  path: '/api/external/performance/stats',
  handler: async (req, res) => {
    const env = createCtx(SUPERUSER_ID, {}, getModel as any)
    
    const PxRequest = getModel('px.request')
    const recentRequests = await PxRequest.search(PxRequest, env, [], { 
      limit: 100, 
      order: 'timestamp DESC' 
    })
    
    const PxCache = getModel('px.cache')
    const cacheStats = await PxCache.search(PxCache, env, [], { 
      limit: 50, 
      order: 'lastAccess DESC' 
    })
    
    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({
      requests: recentRequests,
      cache: cacheStats,
      summary: {
        avgLatency: recentRequests.reduce((s, r) => s + r.latencyMs, 0) / recentRequests.length,
        cacheHitRate: cacheStats.reduce((s, c) => s + c.hitRate, 0) / cacheStats.length
      }
    }))
  }
})
```

## Integration with Model Explorer

All performance models are automatically registered with Moon Engine's model registry and can be:

- Queried via REST API: `GET /api/px.request`, `GET /api/px.cache`, etc.
- Browsed in model explorer UI
- Accessed via ORM: `getModel('px.request')`

## Performance Considerations

- Tracking is designed to be **non-blocking** - failures won't crash your app
- Models use **indexed fields** for efficient querying
- Slow queries (>100ms) and slow requests (>500ms) are automatically flagged
- Consider setting up **automatic cleanup** of old metrics to prevent database bloat

## Example Cleanup Script

```typescript
// Delete metrics older than 7 days
const cutoff = new Date()
cutoff.setDate(cutoff.getDate() - 7)

const PxRequest = getModel('px.request')
await PxRequest.search(PxRequest, env, [['timestamp', '<', cutoff.toISOString()]])
  .then(records => PxRequest.unlink(PxRequest, env, records.map(r => r.id)))
```

## License

Part of Moonwitness monorepo.
