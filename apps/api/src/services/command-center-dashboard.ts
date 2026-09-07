import { getDailyPrayerTimes } from "@moon/compute"
import { getModel } from "@moon/orm"
import type { DashboardData, DashboardResponse } from "@moon/protocol"
import { getOdooSession, OdooClient } from "@moon/odoo-bridge"

type Env = any
type SourceStatus = Record<string, "success" | "unavailable" | "not_configured">

const JAKARTA = { lat: -6.2088, lon: 106.8456 }

function withTimeout<T>(promise: Promise<T>, ms = 2500): Promise<T> {
  let timer: ReturnType<typeof setTimeout>
  const timeout = new Promise<T>((_, reject) => { timer = setTimeout(() => reject(new Error("Dashboard source timeout")), ms) })
  return Promise.race([promise, timeout]).finally(() => clearTimeout(timer!))
}

export async function buildCommandCenterDashboard(env: Env, uid: number, odoo?: { baseUrl: string; database: string; username: string; password: string }, odooSessionKey?: string): Promise<DashboardResponse & { generatedAt: string; sources: SourceStatus }> {
  const sources: SourceStatus = {}
  const data: DashboardData = {
    missionStatus: null,
    todayMission: null,
    todayPrayer: null,
    aiBriefing: null,
    knowledgeFeed: null,
    activeProjects: null,
    tasksOverview: null,
    moonObservatory: null,
    globalMonitoring: null,
  }

  const read = async (name: string, limit: number, order?: string, domain: unknown[] = []) => {
    const odooMap: Record<string, string> = { "pj.project": "project.project", "pj.task": "project.task", "vx.user": "res.users" }
    if (odoo && odooSessionKey && odooMap[name]) {
      const session = getOdooSession(odooSessionKey)
      if (!session) { sources[name] = "unavailable"; return [] }
      try {
        const rows = await withTimeout(new OdooClient(odoo).callWithSession<any[]>(session.sessionId, { model: odooMap[name]!, method: "search_read", args: [domain], kwargs: { limit } }))
        sources[name] = "success"
        return rows
      } catch { sources[name] = "unavailable"; return [] }
    }
    const Model = getModel(name) as any
    if (!Model) { sources[name] = "not_configured"; return [] }
    try {
      const rows = await withTimeout(Model.search(Model, env, domain, { limit, order }))
      sources[name] = "success"
      return Array.isArray(rows) ? rows : []
    } catch {
      sources[name] = "unavailable"
      return []
    }
  }

  const [projects, tasks, telemetry, user, witnessSources, evidence] = await Promise.all([
    read("pj.project", 8, "updatedAt DESC"),
    read("pj.task", 8, "dueDate ASC"),
    read("px.request", 8, "timestamp DESC"),
    read("vx.user", 1, "id DESC", [["id", "=", uid]]),
    read("wx.source", 4, "id DESC"),
    read("wx.evidence", 4, "id DESC"),
  ])

  data.activeProjects = projects.map((p: any) => ({ id: p.id, name: p.name, status: p.status, summary: p.summary }))
  data.todayMission = tasks.map((t: any) => ({ id: t.id, title: t.title, subtitle: t.description, status: t.status, priority: t.priority, dueDate: t.dueDate }))
  data.tasksOverview = { open: tasks.filter((t: any) => t.status !== "done" && t.status !== "completed").length, total: tasks.length }
  data.globalMonitoring = telemetry.map((r: any) => ({ id: r.id, name: r.path, value: `${r.latencyMs ?? "—"}ms`, statusCode: r.statusCode }))
  data.missionStatus = user[0] ? { id: user[0].id, name: user[0].name || user[0].login, status: "active" } : null
  data.knowledgeFeed = [...witnessSources, ...evidence].map((item: any) => ({ id: item.id, title: item.name || item.title || item.reference, description: item.description || item.summary, source: item.stableKey || item.sourceReference, edition: item.edition, revision: item.revision, provenance: item.provenanceId }))

  try {
    const prayers = getDailyPrayerTimes(JAKARTA.lat, JAKARTA.lon, new Date())
    data.todayPrayer = Object.entries(prayers).map(([name, time]) => ({ name, time: time instanceof Date ? time.toISOString() : String(time), status: "pending" }))
    sources.prayer = "success"
  } catch { sources.prayer = "unavailable" }

  const failed = Object.values(sources).filter((value) => value === "unavailable").length
  const configured = Object.values(sources).filter((value) => value !== "not_configured").length
  const status = configured === 0 || (failed === configured && !data.todayPrayer) ? "unavailable" : failed > 0 ? "partial" : "success"
  return { success: status !== "unavailable", status, data, generatedAt: new Date().toISOString(), sources }
}
