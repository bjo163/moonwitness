import 'dotenv/config';
import { NativeServer } from '@moon/server';
import baseAddons, { seedBaseData, loadBaseData } from '@moon/base';
import performanceAddons, { performanceMiddleware } from '@moon/performance';
import witnessAddons, { registerWitnessRoutes } from '@moon/witness';
import khidraAddons from '@moon/khidra';
import mizanAddons, { registerMizanRoutes } from '@moon/mizan';
import shootgunAddons from '@moon/shootgun';
import cabAddons, { registerCabRoutes } from '@moon/cab';
import { globalRoutes } from '@moon/server/dist/router.js';
import { publish } from '@moon/server';
import { trackSystem } from '@moon/performance';
import { getModel, createCtx, SUPERUSER_ID } from '@moon/orm';

globalRoutes.push({
  method: 'POST',
  path: '/test-publish',
  handler: (req, res) => {
    publish('chat_global', { text: 'Realtime works perfectly!' })
    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ ok: true }))
  }
});

// Performance stats endpoint
globalRoutes.push({
  method: 'GET',
  path: '/api/external/performance/stats',
  handler: async (req, res) => {
    try {
      const env = createCtx(SUPERUSER_ID, {}, getModel as any)
      
      // Get recent request stats
      const PxRequest = getModel('px.request')
      const recentRequests = PxRequest 
        ? await (PxRequest as any).search(PxRequest, env, [], { limit: 100, order: 'timestamp DESC' })
        : []
      
      // Get cache stats
      const PxCache = getModel('px.cache')
      const cacheStats = PxCache
        ? await (PxCache as any).search(PxCache, env, [], { limit: 50, order: 'lastAccess DESC' })
        : []
      
      // Get slow queries
      const PxQuery = getModel('px.query')
      const slowQueries = PxQuery
        ? await (PxQuery as any).search(PxQuery, env, [['isSlow', '=', true]], { limit: 20, order: 'timestamp DESC' })
        : []
      
      // Get latest system metrics
      const PxSystem = getModel('px.system')
      const systemMetrics = PxSystem
        ? await (PxSystem as any).search(PxSystem, env, [], { limit: 1, order: 'timestamp DESC' })
        : []
      
      res.writeHead(200, { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      })
      res.end(JSON.stringify({
        requests: recentRequests,
        cache: cacheStats,
        slowQueries,
        system: systemMetrics[0] || null,
        summary: {
          totalRequests: recentRequests.length,
          avgLatency: recentRequests.length > 0 
            ? recentRequests.reduce((sum: number, r: any) => sum + r.latencyMs, 0) / recentRequests.length 
            : 0,
          cacheHitRate: cacheStats.length > 0 
            ? cacheStats.reduce((sum: number, c: any) => sum + (c.hitRate || 0), 0) / cacheStats.length
            : 0,
          slowQueryCount: slowQueries.length
        }
      }))
    } catch (err) {
      res.writeHead(500, { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      })
      res.end(JSON.stringify({ error: String(err) }))
    }
  }
});

const server = new NativeServer({
  database: process.env.DATABASE_URL || 'postgres://localhost/moonwitness',
  jwtSecret: process.env.JWT_SECRET || 'secret',
  port: Number(process.env.API_PORT || process.env.PORT) || 4000,
  email: {
    service: process.env.SMTP_SERVICE || process.env.EMAIL_SERVICE,
    user: process.env.SMTP_USER || process.env.EMAIL_USER,
    pass: process.env.SMTP_PASS || process.env.EMAIL_PASS,
    from: process.env.SMTP_FROM || process.env.EMAIL_FROM
  },
  addons: [
    ...baseAddons.models,
    ...performanceAddons.models,
    ...witnessAddons.models,
    ...khidraAddons.models,
    ...mizanAddons.models,
    ...shootgunAddons.models,
    ...cabAddons.models
  ],
});

// Add performance tracking middleware
server.use(performanceMiddleware());

// Register witness custom endpoints
registerWitnessRoutes();
registerMizanRoutes();
registerCabRoutes();

// ── NASA ──────────────────────────────────────────────────────────────────────
server.proxy('GET', '/api/external/nasa/neo', 'https://api.nasa.gov/neo/rest/v1/feed', {
  cache: '5m',
  query: ['start_date', 'end_date'],
  apiKey: 'DEMO_KEY'
})

server.proxy('GET', '/api/external/nasa/donki/cme', 'https://api.nasa.gov/DONKI/CME', {
  cache: '30m',
  query: ['startDate'],
  apiKey: 'DEMO_KEY'
})

server.proxy('GET', '/api/external/nasa/apod', 'https://api.nasa.gov/planetary/apod', {
  cache: '1h',
  apiKey: 'DEMO_KEY'
})

// ── Weather (Open-Meteo) — lat & lng forwarded from query ─────────────────────
server.proxy('GET', '/api/external/weather', 'https://api.open-meteo.com/v1/forecast', {
  cache: '10m',
  query: ['latitude', 'longitude', 'current_weather'],
})

// ── Geophysics ────────────────────────────────────────────────────────────────
server.proxy('GET', '/api/external/usgs/earthquakes', 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_day.geojson', {
  cache: '5m',
})

server.proxy('GET', '/api/external/noaa/kp-index', 'https://services.swpc.noaa.gov/products/noaa-planetary-k-index.json', {
  cache: '10m',
})

// ── Space ─────────────────────────────────────────────────────────────────────
server.proxy('GET', '/api/external/iss', 'https://api.wheretheiss.at/v1/satellites/25544', {
  cache: '10s',
})

server.proxy('GET', '/api/external/rainviewer', 'https://api.rainviewer.com/public/weather-maps.json', {
  cache: '2m',
})

// ── Flights ───────────────────────────────────────────────────────────────────
server.proxy('GET', '/api/external/opensky', 'https://opensky-network.org/api/states/all?lamin=35&lomin=-10&lamax=60&lomax=30', {
  cache: '1m',
})

// ── Markets ───────────────────────────────────────────────────────────────────
server.proxy('GET', '/api/external/binance/ticker', 'https://api.binance.com/api/v3/ticker/24hr', {
  cache: '30s',
  query: ['symbol'],
})

// ── System Status (Internal) ──────────────────────────────────────────────────
server.proxy('GET', '/api/external/db/status', 'http://localhost:4000/db/status', {
  cache: '30s',
})

server.proxy('GET', '/api/external/meta/models', 'http://localhost:4000/meta/models', {
  cache: '30s',
})

// ── Trends (Google) ───────────────────────────────────────────────────────────
server.proxy('GET', '/api/external/trends', 'https://trends.google.com/trending/rss?geo=US', {
  cache: '15m',
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  }
})

server.start().then(async () => {
  try {
    await seedBaseData();
    await loadBaseData();
    console.log('[App] Programmatic boot executed and data seeded!');
    
    // Start system metrics collection (every 60 seconds)
    setInterval(async () => {
      try {
        const activeClients = (globalThis as any).moonActiveClients
        const memUsage = process.memoryUsage()
        
        await trackSystem({
          memoryUsedMb: memUsage.heapUsed / 1024 / 1024,
          memoryTotalMb: memUsage.heapTotal / 1024 / 1024,
          uptimeSeconds: Math.floor(process.uptime()),
          activeConnections: activeClients ? activeClients.size : 0,
        })
      } catch (err) {
        console.warn('[Telemetry] Safe boundary caught error:', err)
      }
    }, 60000)
    
  } catch (err) {
    console.error('[App] Failed to seed data:', err);
  }
});









