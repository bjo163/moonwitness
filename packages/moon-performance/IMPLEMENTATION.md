# Implementation Guide

## Integrating with Existing Server

### Step 1: Add to `apps/api/src/server.ts`

```typescript
import performanceAddon, { performanceMiddleware } from '@moon/performance'

const server = new NativeServer({
  database: process.env.DATABASE_URL,
  jwtSecret: process.env.JWT_SECRET,
  addons: [
    ...baseAddons.models,
    ...performanceAddon.models  // ← Add here
  ],
})

// Enable auto-tracking
server.use(performanceMiddleware())  // ← Add here

server.start()
```

### Step 2: Update Proxy Handler (Optional)

To track cache statistics in proxy routes, update `packages/moon-server/src/proxy.ts`:

```typescript
import { updateCacheStats } from '@moon/performance'

export function createProxyHandler(opts: ProxyOptions): HttpHandler {
  return async (req, res) => {
    const startTime = Date.now()
    
    // ... existing code ...
    
    if (cached) {
      const latency = Date.now() - startTime
      updateCacheStats(cacheKey, 'HIT', latency).catch(() => {})
      
      res.writeHead(200, { 'Content-Type': 'application/json', 'X-Cache': 'HIT', ...corsHeaders })
      res.end(JSON.stringify(cached))
      return
    }
    
    // ... existing code ...
    
    const data = await upstream.json()
    if (cacheMs > 0) {
      cache.set(cacheKey, data, cacheMs)
    }
    
    const latency = Date.now() - startTime
    updateCacheStats(cacheKey, 'MISS', latency).catch(() => {})
    
    res.writeHead(200, { 'Content-Type': 'application/json', 'X-Cache': 'MISS', ...corsHeaders })
    res.end(JSON.stringify(data))
  }
}
```

### Step 3: Run Migration

After adding models, run migration:

```bash
cd apps/api
pnpm run migrate
```

### Step 4: Access Performance Data

Create API routes to expose metrics:

```typescript
server.get('/api/performance/requests', async (req, res) => {
  const PxRequest = getModel('px.request')
  const env = createCtx(SUPERUSER_ID, {}, getModel as any)
  
  const slow = await PxRequest.search(
    PxRequest,
    env,
    [['latencyMs', '>', 500]],
    { limit: 100, order: 'timestamp desc' }
  )
  
  server.sendJson(res, 200, slow, req)
})

server.get('/api/performance/cache', async (req, res) => {
  const PxCache = getModel('px.cache')
  const env = createCtx(SUPERUSER_ID, {}, getModel as any)
  
  const stats = await PxCache.search(
    PxCache,
    env,
    [],
    { order: 'hitRate desc' }
  )
  
  server.sendJson(res, 200, stats, req)
})
```

## Background System Metrics

Add to `server.start()`:

```typescript
import { trackSystem } from '@moon/performance'

server.start().then(() => {
  // Track system metrics every 60 seconds
  setInterval(async () => {
    await trackSystem({
      activeConnections: (globalThis as any).moonActiveClients?.size || 0
    })
  }, 60000)
})
```

## Querying Performance Data

### Get Slow Endpoints

```typescript
const PxRequest = getModel('px.request')
const env = createCtx(userId, {}, getModel as any)

const slowByPath = await PxRequest.browse(
  PxRequest,
  env,
  [['latencyMs', '>', 500]],
  { 
    groupBy: ['path'],
    aggregates: { 
      avgLatency: 'AVG(latencyMs)',
      count: 'COUNT(*)'
    }
  }
)
```

### Get Cache Performance

```typescript
const PxCache = getModel('px.cache')
const topCached = await PxCache.search(
  PxCache,
  env,
  [['hitRate', '>', 70]],
  { order: 'hitCount desc', limit: 10 }
)
```

### Get Slow Queries

```typescript
const PxQuery = getModel('px.query')
const slowQueries = await PxQuery.search(
  PxQuery,
  env,
  [['isSlow', '=', true]],
  { order: 'executionMs desc', limit: 20 }
)
```

## Monitoring Dashboard

Create a dedicated performance dashboard widget in `apps/web`:

```typescript
export function PerformanceDashboard() {
  const { data: slowRequests } = useMoonStore(s => s.request)
  
  useEffect(() => {
    slowRequests('GET', '/api/performance/requests?slow=true')
  }, [])
  
  return (
    <div className="grid grid-cols-2 gap-4">
      <MetricCard title="Slow Requests" value={data?.length} />
      <MetricCard title="Avg Latency" value={avgLatency(data)} />
    </div>
  )
}
```
