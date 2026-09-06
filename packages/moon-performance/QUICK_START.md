# @moon/performance - Quick Start Guide

Get started with performance monitoring in 5 minutes.

## 📦 Step 1: Build Package

```bash
cd packages/moon-performance
pnpm run build
```

## 🔌 Step 2: Register Addon

In `apps/api/src/server.ts`:

```typescript
import performanceAddons from '@moon/performance'

const server = new NativeServer({
  database: process.env.DATABASE_URL,
  jwtSecret: process.env.JWT_SECRET,
  addons: [...baseAddons.models, ...performanceAddons.models],
})
```

## 📊 Step 3: Start Tracking

### Track HTTP Requests

```typescript
import { trackRequest } from '@moon/performance'

// Inside your route handler or middleware
await trackRequest({
  method: 'GET',
  path: '/api/users',
  latencyMs: 45.2,
  statusCode: 200,
  cacheStatus: 'HIT'
})
```

### Track Database Queries

```typescript
import { trackQuery } from '@moon/performance'

const start = Date.now()
const users = await User.scan(User, env, [])
const executionMs = Date.now() - start

await trackQuery({
  model: 'vx.user',
  operation: 'SELECT',
  executionMs,
  recordCount: users.length
})
```

### Track System Metrics

```typescript
import { trackSystem } from '@moon/performance'

// Run periodically (e.g., every 60 seconds)
setInterval(async () => {
  const mem = process.memoryUsage()
  await trackSystem({
    memoryUsedMb: mem.heapUsed / 1024 / 1024,
    memoryTotalMb: mem.heapTotal / 1024 / 1024,
    uptimeSeconds: Math.floor(process.uptime()),
    activeConnections: (globalThis as any).moonActiveClients?.size || 0
  })
}, 60000)
```

## 🔍 Step 4: Query Performance Data

```typescript
import { getModel, createCtx, SUPERUSER_ID } from '@moon/orm'

const env = createCtx(SUPERUSER_ID, {}, getModel)

// Find slow requests
const PxRequest = getModel('px.request')
const slowRequests = await PxRequest.scan(
  PxRequest,
  env,
  [['latencyMs', '>', 500]],
  { limit: 10 }
)

console.log(`Found ${slowRequests.length} slow requests`)
for (const req of slowRequests) {
  console.log(`- ${req.method} ${req.path}: ${req.latencyMs}ms`)
}
```

## ✅ Step 5: Verify Installation

Verify the build and integration:

```bash
# Build the performance package
pnpm --filter @moon/performance build

# Run repository tests
pnpm test
```

## 🎯 Common Use Cases

### 1. Monitor API Endpoint Performance

```typescript
server.proxy('GET', '/api/external/weather', 'https://api.weather.com', {
  cache: '10m',
  onResponse: async (latencyMs, status, cacheHit) => {
    await trackRequest({
      method: 'GET',
      path: '/api/external/weather',
      latencyMs,
      statusCode: status,
      cacheStatus: cacheHit ? 'HIT' : 'MISS'
    })
  }
})
```

### 2. Track All ORM Operations

```typescript
// Wrap your ORM calls
async function trackedQuery<T>(
  model: string,
  operation: string,
  fn: () => Promise<T>
): Promise<T> {
  const start = Date.now()
  try {
    const result = await fn()
    await trackQuery({
      model,
      operation: operation as any,
      executionMs: Date.now() - start
    })
    return result
  } catch (err) {
    await trackQuery({
      model,
      operation: operation as any,
      executionMs: Date.now() - start,
      hadError: true,
      errorMessage: String(err)
    })
    throw err
  }
}

// Usage
const users = await trackedQuery('vx.user', 'SELECT', () =>
  User.scan(User, env, [['isActive', '=', true]])
)
```

### 3. Alert on High Memory Usage

```typescript
setInterval(async () => {
  const mem = process.memoryUsage()
  const usedMb = mem.heapUsed / 1024 / 1024
  const totalMb = mem.heapTotal / 1024 / 1024
  const usagePercent = (usedMb / totalMb) * 100

  await trackSystem({
    memoryUsedMb: usedMb,
    memoryTotalMb: totalMb,
    uptimeSeconds: Math.floor(process.uptime()),
    activeConnections: activeClients.size
  })

  // Alert if memory usage >80%
  if (usagePercent > 80) {
    console.warn(`⚠️  High memory usage: ${usagePercent.toFixed(1)}%`)
    // Send notification, email, etc.
  }
}, 60000)
```

## 📚 Next Steps

- Read the full [README.md](./README.md) for detailed API reference
- Check [ROADMAP.md](./ROADMAP.md) for upcoming features
- Explore example queries in the README
- Build custom dashboards using the performance data

## 🐛 Troubleshooting

### Tables not created?

The schema should auto-sync on server start. If not:

```typescript
import { forge } from '@moon/orm'
await forge()
```

### Performance impact?

Tracking is async and fails silently to avoid blocking your app. For high-traffic applications, consider:

- Sampling (track 1 in N requests)
- Batch inserts
- Periodic cleanup of old data

### Type errors?

Make sure you've built the package:

```bash
pnpm run build --filter @moon/performance
```

## 💡 Tips

1. **Start simple** - Track just requests first, then add queries and system metrics
2. **Use indexes** - The models have built-in indexes on common query fields
3. **Clean old data** - Set up periodic cleanup to prevent database bloat
4. **Monitor monitoring** - Track the performance impact of tracking itself

---

Happy monitoring! 🎉
