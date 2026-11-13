"use client"

import { useEffect, useState } from "react"
import { apiGet, moonClientInstance } from "@moon/client"
import {
  TelemetryHeader,
  TelemetryLiveLogs,
  TelemetryMetricGrid,
  TelemetryTrafficChart,
  type TelemetryLog,
  type TelemetryMetric,
  type TelemetryStatus,
} from "./analytics-telemetry-renderers"

export function AnalyticsTelemetryView() {
  const [systemStatus, setSystemStatus] = useState<TelemetryStatus>({
    uptime: 0,
    models: 0,
    db: "unknown",
  })
  const [metricsData, setMetricsData] = useState<TelemetryMetric[]>([])
  const [logs, setLogs] = useState<TelemetryLog[]>([])

  useEffect(() => {
    let unsubscribeLogs: any

    const init = async () => {
      try {
        // Fetch historical metrics (now public!)
        try {
          const res = await apiGet<any>("/api/mx.metric")
          if (Array.isArray(res)) {
            const formatted = res
              .map((item: any) => ({
                time: new Date(item.timestamp).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                }),
                connections: item.value,
              }))
              .slice(-20) // Get last 20 data points
            setMetricsData(formatted)
          }
        } catch (e) {
          console.error("Failed to fetch historical metrics:", e)
        }

        // Fetch DB status and models via moon api server (cached 30s)
        const statusRes = await apiGet<any>("/api/external/db/status").catch(
          () => ({})
        )
        const modelsRes = await apiGet<any>(
          "/api/external/meta/models"
        ).catch(() => [])

        setSystemStatus({
          uptime: (statusRes.uptime / 3600).toFixed(2),
          db: statusRes.database?.driverName || "offline",
          models: Array.isArray(modelsRes) ? modelsRes.length : 0,
        })

        unsubscribeLogs = moonClientInstance.subscribe("system_logs", (data: any) => {
          setLogs((prev) => {
            const next = [data, ...prev].slice(0, 50)
            return next
          })
        })
      } catch (err) {
        console.error("Failed to init telemetry stream:", err)
      }
    }

    init()

    return () => {
      if (unsubscribeLogs) unsubscribeLogs()
    }
  }, [])

  return (
    <div className="flex h-screen flex-col overflow-y-auto p-8">
      <TelemetryHeader />
      <TelemetryMetricGrid status={systemStatus} />
      <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <TelemetryTrafficChart data={metricsData} />
        <TelemetryLiveLogs logs={logs} />
      </div>
    </div>
  )
}
