import "dotenv/config"
import {
  NativeServer,
  authenticateRequest,
  AuthError,
  sendJson,
  registerViewManifests,
  defineRoute,
} from "@moon/server"
import baseAddons, { seedBaseData, loadBaseData, views as baseViews, loadDemoData as loadBaseDemoData } from "@moon/base"
import performanceAddons, { performanceMiddleware, views as performanceViews, loadDemoData as loadPerformanceDemoData } from "@moon/performance"
import witnessAddons, {
  registerWitnessRoutes,
  seedWitnessGraphCore,
  views as witnessViews,
  loadDemoData as loadWitnessDemoData,
} from "@moon/witness"
import khidraAddons, { views as khidraViews, loadDemoData as loadKhidraDemoData } from "@moon/khidra"
import mizanAddons, { registerMizanRoutes, views as mizanViews, loadDemoData as loadMizanDemoData } from "@moon/mizan"
import shootgunAddons, { views as shootgunViews, loadDemoData as loadShootgunDemoData } from "@moon/shootgun"
import cabAddons, { registerCabRoutes, views as cabViews, loadDemoData as loadCabDemoData } from "@moon/cab"
import projectAddons, { views as projectViews, loadDemoData as loadProjectDemoData } from "@moon/project"
import helpdeskAddons, { views as helpdeskViews, loadDemoData as loadHelpdeskDemoData } from "@moon/helpdesk"
import productAddons, { views as productViews, loadDemoData as loadProductDemoData } from "@moon/product"
import stockAddons, { views as stockViews, loadDemoData as loadStockDemoData } from "@moon/stock"
import accountAddons, { views as accountViews, loadDemoData as loadAccountDemoData } from "@moon/account"
import crmAddons, { views as crmViews, loadDemoData as loadCrmDemoData } from "@moon/crm"
import mailAddons, { views as mailViews, loadDemoData as loadMailDemoData } from "@moon/mail"
import geoAddons, { views as geoViews, loadDemoData as loadGeoDemoData } from "@moon/geo"
import cronAddons, { views as cronViews, globalCronRunner, loadDemoData as loadCronDemoData } from "@moon/cron"
import { globalRoutes } from "@moon/server/dist/router.js"
import { publish } from "@moon/server"
import { trackSystem } from "@moon/performance"
import { getModel, createCtx, SUPERUSER_ID, checkDbConnection } from "@moon/orm"

async function requireAdmin(req: any, res: any, jwtSecret: string): Promise<boolean> {
  try {
    const session = await authenticateRequest(req, jwtSecret, { allowAnonymous: false })
    if (session.uid !== SUPERUSER_ID) {
      await sendJson(res, 403, { error: "Administrator access required", code: "AUTH_FORBIDDEN" }, req)
      return false
    }
    return true
  } catch (error) {
    if (error instanceof AuthError) {
      await sendJson(res, error.statusCode, { error: error.message, code: error.code }, req)
      return false
    }
    await sendJson(res, 500, { error: "Internal server error", code: "INTERNAL_ERROR" }, req)
    return false
  }
}

globalRoutes.push({
  method: "POST",
  path: "/test-publish",
  handler: async (req, res) => {
    if (!(await requireAdmin(req, res, process.env.JWT_SECRET || ""))) return
    publish("chat_global", { text: "Realtime works perfectly!" })
    res.writeHead(200, { "Content-Type": "application/json" })
    res.end(JSON.stringify({ ok: true }))
  },
})

// Performance stats endpoint
globalRoutes.push({
  method: "GET",
  path: "/api/external/performance/stats",
  handler: async (req, res) => {
    if (!(await requireAdmin(req, res, process.env.JWT_SECRET || ""))) return
    try {
      const env = createCtx(SUPERUSER_ID, {}, getModel as any)

      // Get recent request stats
      const PxRequest = getModel("px.request")
      const recentRequests = PxRequest
        ? await (PxRequest as any).search(PxRequest, env, [], {
            limit: 100,
            order: "timestamp DESC",
          })
        : []

      // Get cache stats
      const PxCache = getModel("px.cache")
      const cacheStats = PxCache
        ? await (PxCache as any).search(PxCache, env, [], {
            limit: 50,
            order: "lastAccess DESC",
          })
        : []

      // Get slow queries
      const PxQuery = getModel("px.query")
      const slowQueries = PxQuery
        ? await (PxQuery as any).search(PxQuery, env, [["isSlow", "=", true]], {
            limit: 20,
            order: "timestamp DESC",
          })
        : []

      // Get latest system metrics
      const PxSystem = getModel("px.system")
      const systemMetrics = PxSystem
        ? await (PxSystem as any).search(PxSystem, env, [], {
            limit: 1,
            order: "timestamp DESC",
          })
        : []

      res.writeHead(200, {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      })
      res.end(
        JSON.stringify({
          requests: recentRequests,
          cache: cacheStats,
          slowQueries,
          system: systemMetrics[0] || null,
          summary: {
            totalRequests: recentRequests.length,
            avgLatency:
              recentRequests.length > 0
                ? recentRequests.reduce(
                    (sum: number, r: any) => sum + r.latencyMs,
                    0
                  ) / recentRequests.length
                : 0,
            cacheHitRate:
              cacheStats.length > 0
                ? cacheStats.reduce(
                    (sum: number, c: any) => sum + (c.hitRate || 0),
                    0
                  ) / cacheStats.length
                : 0,
            slowQueryCount: slowQueries.length,
          },
        })
      )
    } catch (err) {
      res.writeHead(500, {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      })
      res.end(JSON.stringify({ error: String(err) }))
    }
  },
})

const apiPort = Number(process.env.API_PORT || process.env.PORT) || 4000
const demoSeedEnabled =
  process.env.NODE_ENV !== "production" || process.env.MOON_ENABLE_DEMO_SEED === "true"

const rawDatabaseUrl = process.env.DATABASE_URL
if (!rawDatabaseUrl || rawDatabaseUrl.trim() === "") {
  throw new Error(
    "[moon.security] Fatal: DATABASE_URL is required. Set it in the environment before starting the API."
  )
}

const server = new NativeServer({
  database: rawDatabaseUrl,
  jwtSecret: process.env.JWT_SECRET || "",
  port: apiPort,
  email: {
    service: process.env.SMTP_SERVICE || process.env.EMAIL_SERVICE,
    user: process.env.SMTP_USER || process.env.EMAIL_USER,
    pass: process.env.SMTP_PASS || process.env.EMAIL_PASS,
    from: process.env.SMTP_FROM || process.env.EMAIL_FROM,
  },
  addons: [
    ...baseAddons.models,
    ...performanceAddons.models,
    ...witnessAddons.models,
    ...projectAddons.models,
    ...helpdeskAddons.models,
    ...khidraAddons.models,
    ...mizanAddons.models,
    ...shootgunAddons.models,
    ...cabAddons.models,
    ...productAddons.models,
    ...stockAddons.models,
    ...accountAddons.models,
    ...crmAddons.models,
    ...mailAddons.models,
    ...geoAddons.models,
    ...cronAddons.models,
  ],
})

// Add performance tracking middleware
server.use(performanceMiddleware())

// Register witness custom endpoints
registerWitnessRoutes()
registerMizanRoutes()
registerCabRoutes()

// Cosmic Matrix Engine: Register view manifests across all 16 addon packages
registerViewManifests({
  ...baseViews,
  ...performanceViews,
  ...witnessViews,
  ...projectViews,
  ...helpdeskViews,
  ...khidraViews,
  ...mizanViews,
  ...shootgunViews,
  ...cabViews,
  ...productViews,
  ...stockViews,
  ...accountViews,
  ...crmViews,
  ...mailViews,
  ...geoViews,
  ...cronViews,
})

// Start the Autonomous Background Cron Scheduler
globalCronRunner.start()

// ── One-Click Full Demo Matrix Installer ──────────────────────────────────────
defineRoute({
  method: "POST",
  path: "/api/system/demo-seed",
  auth: "admin",
  handler: async () => {
    if (!demoSeedEnabled) {
      throw Object.assign(new Error("Demo seeding is disabled in production"), {
        statusCode: 403,
        code: "DEMO_SEED_DISABLED",
      })
    }

    const loaders = [
      { name: "base", fn: loadBaseDemoData },
      { name: "performance", fn: loadPerformanceDemoData },
      { name: "witness", fn: loadWitnessDemoData },
      { name: "project", fn: loadProjectDemoData },
      { name: "helpdesk", fn: loadHelpdeskDemoData },
      { name: "khidra", fn: loadKhidraDemoData },
      { name: "mizan", fn: loadMizanDemoData },
      { name: "shootgun", fn: loadShootgunDemoData },
      { name: "cab", fn: loadCabDemoData },
      { name: "product", fn: loadProductDemoData },
      { name: "stock", fn: loadStockDemoData },
      { name: "account", fn: loadAccountDemoData },
      { name: "crm", fn: loadCrmDemoData },
      { name: "mail", fn: loadMailDemoData },
      { name: "geo", fn: loadGeoDemoData },
      { name: "cron", fn: loadCronDemoData },
    ]

    const seededPackages: Record<string, string> = {}
    for (const { name, fn } of loaders) {
      try {
        if (typeof fn === "function") {
          await fn()
          seededPackages[name] = "SEEDED"
        }
      } catch (err: any) {
        seededPackages[name] = `FAILED: ${err?.message || err}`
      }
    }

    return {
      success: true,
      message: "Universal demo matrix initialized successfully across all 16 addon packages",
      seededPackages,
    }
  },
})

// ── NASA ──────────────────────────────────────────────────────────────────────
server.proxy(
  "GET",
  "/api/external/nasa/neo",
  "https://api.nasa.gov/neo/rest/v1/feed",
  {
    cache: "5m",
    query: ["start_date", "end_date"],
    apiKey: "DEMO_KEY",
  }
)

server.proxy(
  "GET",
  "/api/external/nasa/donki/cme",
  "https://api.nasa.gov/DONKI/CME",
  {
    cache: "30m",
    query: ["startDate"],
    apiKey: "DEMO_KEY",
  }
)

server.proxy(
  "GET",
  "/api/external/nasa/apod",
  "https://api.nasa.gov/planetary/apod",
  {
    cache: "1h",
    apiKey: "DEMO_KEY",
  }
)

// ── Weather (Open-Meteo) — lat & lng forwarded from query ─────────────────────
server.proxy(
  "GET",
  "/api/external/weather",
  "https://api.open-meteo.com/v1/forecast",
  {
    cache: "10m",
    query: ["latitude", "longitude", "current_weather"],
  }
)

// ── Geophysics ────────────────────────────────────────────────────────────────
server.proxy(
  "GET",
  "/api/external/usgs/earthquakes",
  "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_day.geojson",
  {
    cache: "5m",
  }
)

server.proxy(
  "GET",
  "/api/external/noaa/kp-index",
  "https://services.swpc.noaa.gov/products/noaa-planetary-k-index.json",
  {
    cache: "10m",
  }
)

// ── Space ──────────────────────────────────────────────────────────────────────
server.proxy(
  "GET",
  "/api/external/iss",
  "https://api.wheretheiss.at/v1/satellites/25544",
  {
    cache: "10s",
  }
)

server.proxy(
  "GET",
  "/api/external/rainviewer",
  "https://api.rainviewer.com/public/weather-maps.json",
  {
    cache: "2m",
  }
)

// ── Flights ───────────────────────────────────────────────────────────────────
server.proxy(
  "GET",
  "/api/external/opensky",
  "https://opensky-network.org/api/states/all?lamin=35&lomin=-10&lamax=60&lomax=30",
  {
    cache: "1m",
  }
)

// ── Markets ───────────────────────────────────────────────────────────────────
server.proxy(
  "GET",
  "/api/external/binance/ticker",
  "https://api.binance.com/api/v3/ticker/24hr",
  {
    cache: "30s",
    query: ["symbol"],
  }
)

// ── System Status (Internal) ──────────────────────────────────────────────────
server.proxy(
  "GET",
  "/api/external/db/status",
  `http://127.0.0.1:${apiPort}/db/status`,
  {
    cache: "30s",
  }
)

server.proxy(
  "GET",
  "/api/external/meta/models",
  `http://127.0.0.1:${apiPort}/meta/models`,
  {
    cache: "30s",
  }
)

// ── Trends (Google) ───────────────────────────────────────────────────────────
server.proxy(
  "GET",
  "/api/external/trends",
  "https://trends.google.com/trending/rss?geo=US",
  {
    cache: "15m",
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    },
  }
)

server.start().then(async () => {
  const dbHealth = await checkDbConnection()
  if (dbHealth.ok) {
    console.log(
      `[Database] ✓ Connection verified: ${dbHealth.dialect} (${dbHealth.version || "Connected"}) - Latency: ${dbHealth.latencyMs}ms`
    )
  } else {
    console.error(
      `[Database] ✗ Connection failed: ${dbHealth.error} (${dbHealth.latencyMs}ms)`
    )
  }

  if (process.env.MOON_BOOTSTRAP_ON_START !== "true") {
    console.log("[App] Automatic seed disabled; use pnpm db:install or pnpm db:seed.")
    return
  }
  try {
    await seedBaseData()
    await loadBaseData()
    const graphSeed = await seedWitnessGraphCore()
    console.log(
      `[App] Witness graph core seeded: ${graphSeed.relationTypeCount} relation types (${graphSeed.ontologyVersion}), ${graphSeed.religionContextCount} religion contexts`
    )
    console.log("[App] Programmatic boot executed and data seeded!")

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
        console.warn("[Telemetry] Safe boundary caught error:", err)
      }
    }, 60000)
  } catch (err) {
    console.error("[App] Failed to seed data:", err)
  }
})
