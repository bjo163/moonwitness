import {
  defineRoute,
  publish,
  handleDbStatus,
  handleMetaModels,
  type NativeServer,
} from "@moon/server"
import { getModel, createCtx, SUPERUSER_ID } from "@moon/orm"
import { config } from "../config/index.js"
import { allDemoLoaders, allAddonManifests, allAddonViews } from "../addons/index.js"
import { DashboardResponseSchema } from "@moon/protocol"
import { buildCommandCenterDashboard } from "../services/command-center-dashboard.js"

/**
 * ◈ System & Admin Operational Routes
 */
export function registerSystemRoutes(server: NativeServer): void {
  defineRoute({
    method: "GET",
    path: "/api/command-center/dashboard",
    auth: "user",
    tags: ["System"],
    summary: "Get the Command Center operational dashboard read model",
    response: DashboardResponseSchema,
    handler: async ({ env, uid }) => buildCommandCenterDashboard(env, uid),
  })
  // Direct in-process database status & model introspection (eliminates HTTP loopback)
  server.get("/api/external/db/status", handleDbStatus, "user")
  server.get("/api/external/meta/models", handleMetaModels, "user")

  // Model-Driven Addons & Apps Catalog (served directly by API)
  defineRoute({
    method: "GET",
    path: "/api/meta/addons",
    auth: "none",
    tags: ["System"],
    summary: "Get full Model-Driven Addons Catalog and App manifests",
    handler: async () => {
      const addons = allAddonManifests.map((manifest) => {
        const models = (manifest.models || []).map((modelClass: any) => {
          const modelName = modelClass._name || ""
          const viewConfig = (allAddonViews as any)[modelName] || {}
          return {
            name: modelName,
            description: modelClass._description || "",
            recName: modelClass._rec_name || "name",
            defaultView: viewConfig.defaultView || "table",
            icon: viewConfig.icon || "Layers",
            accentColor: viewConfig.accentColor || "cyan",
          }
        })

        const primaryModel = models[0]?.name ?? ""

        return {
          id: manifest.name,
          name: manifest.name.charAt(0).toUpperCase() + manifest.name.slice(1),
          packageName: `@moon/${manifest.name}`,
          description: manifest.description || "",
          depends: manifest.depends || [],
          primaryModel,
          modelCount: models.length,
          models,
        }
      })

      return {
        count: addons.length,
        addons,
      }
    },
  })

  // Realtime test publish route
  defineRoute({
    method: "POST",
    path: "/test-publish",
    auth: "admin",
    tags: ["System"],
    summary: "Publish test realtime message",
    handler: async () => {
      publish("chat_global", { text: "Realtime works perfectly!" })
      return { ok: true }
    },
  })

  // System performance statistics
  defineRoute({
    method: "GET",
    path: "/api/external/performance/stats",
    auth: "admin",
    tags: ["Performance"],
    summary: "Get aggregate performance and telemetry metrics",
    handler: async () => {
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

      const avgLatency =
        recentRequests.length > 0
          ? recentRequests.reduce((sum: number, r: any) => sum + r.latencyMs, 0) /
            recentRequests.length
          : 0

      const cacheHitRate =
        cacheStats.length > 0
          ? cacheStats.reduce((sum: number, c: any) => sum + (c.hitRate || 0), 0) /
            cacheStats.length
          : 0

      return {
        requests: recentRequests,
        cache: cacheStats,
        slowQueries,
        system: systemMetrics[0] || null,
        summary: {
          totalRequests: recentRequests.length,
          avgLatency,
          cacheHitRate,
          slowQueryCount: slowQueries.length,
        },
      }
    },
  })

  // Universal demo matrix installer across all 16 addon packages (or a specific package)
  defineRoute({
    method: "POST",
    path: "/api/system/demo-seed",
    auth: "admin",
    tags: ["System"],
    summary: "Seed comprehensive demo data matrix across all 16 addon packages or a specific package",
    handler: async (ctx) => {
      if (!config.demoSeedEnabled) {
        throw Object.assign(new Error("Demo seeding is disabled in production"), {
          statusCode: 403,
          code: "DEMO_SEED_DISABLED",
        })
      }

      const targetPackage = ctx.body?.package ? String(ctx.body.package).trim().toLowerCase() : null
      const loadersToRun = targetPackage
        ? allDemoLoaders.filter((l) => l.name.toLowerCase() === targetPackage)
        : allDemoLoaders

      if (targetPackage && loadersToRun.length === 0) {
        throw Object.assign(new Error(`Unknown package '${targetPackage}' for demo seed`), {
          statusCode: 400,
          code: "UNKNOWN_PACKAGE",
        })
      }

      const seededPackages: Record<string, string> = {}
      for (const { name, fn } of loadersToRun) {
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
        message: targetPackage
          ? `Package '${targetPackage}' demo data initialized successfully`
          : "Universal demo matrix initialized successfully across all 16 addon packages",
        seededPackages,
      }
    },
  })
}
