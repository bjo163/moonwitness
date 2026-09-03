"use client"

import React, { useEffect, useState } from "react"
import {
  Activity,
  BarChart3,
  TrendingUp,
  Cpu,
  Server,
  Wifi,
  Clock,
  TerminalSquare,
} from "lucide-react"
import { MoonClient } from "@moon/client"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts"

import { apiGet, moonClientInstance } from "@moon/client"

export function AnalyticsTelemetryView() {
  const activeConnections = 48

  const [systemStatus, setSystemStatus] = useState<any>({
    uptime: 0,
    models: 0,
    db: "unknown",
  })
  const [metricsData, setMetricsData] = useState<any[]>([])
  const [logs, setLogs] = useState<any[]>([])

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
      <div className="mb-6 flex items-end justify-between">
        <div>
          <h1 className="flex items-center gap-3 text-3xl font-black tracking-widest text-foreground uppercase">
            <Activity className="h-8 w-8 text-success" />
            Global Telemetry & Analytics
          </h1>
          <p className="mt-2 font-mono text-sm text-success/70">
            Real-time system monitoring, usage analytics, and performance
            metrics.
          </p>
        </div>
        <div className="flex gap-4">
          <div className="flex items-center gap-2 rounded-full border border-green-500/30 bg-green-500/10 px-4 py-2">
            <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-green-400"></span>
            <span className="text-xs font-bold tracking-widest text-success uppercase">
              Engine Online
            </span>
          </div>
        </div>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-4">
        <div className="rounded-2xl border border-success/20 bg-card p-6 backdrop-blur-xl transition-all hover:border-emerald-500/50">
          <div className="mb-4 flex items-center gap-2 font-mono text-xs font-bold tracking-widest text-success uppercase">
            <Wifi className="h-4 w-4" /> Active Connections
          </div>
          <div className="bg-gradient-to-r from-emerald-400 to-green-600 bg-clip-text font-mono text-5xl font-black text-transparent">
            {activeConnections}
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 backdrop-blur-xl transition-all hover:border-border">
          <div className="mb-4 flex items-center gap-2 font-mono text-xs font-bold tracking-widest text-primary uppercase">
            <Clock className="h-4 w-4" /> Core Uptime
          </div>
          <div className="font-mono text-4xl font-black text-foreground">
            {systemStatus.uptime}h
          </div>
        </div>

        <div className="rounded-2xl border border-blue-500/20 bg-card p-6 backdrop-blur-xl transition-all hover:border-blue-500/50">
          <div className="mb-4 flex items-center gap-2 font-mono text-xs font-bold tracking-widest text-blue-400 uppercase">
            <Server className="h-4 w-4" /> Database
          </div>
          <div className="font-mono text-3xl font-black text-foreground uppercase">
            {systemStatus.db}
          </div>
        </div>

        <div className="rounded-2xl border border-success/20 bg-card p-6 backdrop-blur-xl transition-all hover:border-emerald-500/50">
          <div className="mb-4 flex items-center gap-2 font-mono text-xs font-bold tracking-widest text-success uppercase">
            <BarChart3 className="h-4 w-4" /> Models Loaded
          </div>
          <div className="font-mono text-4xl font-black text-foreground">
            {systemStatus.models}
          </div>
        </div>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Chart Section */}
        <div className="flex min-h-[250px] flex-col rounded-2xl border border-border bg-card p-6 backdrop-blur-xl md:min-h-[400px] lg:col-span-2">
          <h2 className="mb-6 flex items-center gap-2 text-lg font-semibold text-foreground">
            <TrendingUp className="h-5 w-5 text-primary" />
            Historical Traffic (mx.metric)
          </h2>

          <div className="h-full w-full flex-1">
            {metricsData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={metricsData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient
                      id="colorConnections"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="time"
                    stroke="#475569"
                    fontSize={12}
                    tickMargin={10}
                  />
                  <YAxis stroke="#475569" fontSize={12} />
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#334155"
                    vertical={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0f172a",
                      border: "1px solid #334155",
                      borderRadius: "8px",
                    }}
                    itemStyle={{ color: "#10b981" }}
                  />
                  <Area
                    type="monotone"
                    dataKey="connections"
                    stroke="#10b981"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorConnections)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full w-full items-center justify-center rounded-xl border border-dashed border-border">
                <span className="font-mono text-sm text-muted-foreground">
                  Awaiting metric aggregation...
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Live Logs Section */}
        <div className="flex h-[300px] flex-col rounded-2xl border border-border bg-card p-6 backdrop-blur-xl md:h-[400px]">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-foreground">
            <TerminalSquare className="h-5 w-5 text-primary" />
            Live Engine Logs
          </h2>
          <div className="flex-1 overflow-y-auto rounded-xl border border-border bg-card p-4 font-mono text-xs">
            <ul className="space-y-2">
              {logs.length === 0 && (
                <li className="text-muted-foreground italic">
                  Listening to system events...
                </li>
              )}
              {logs.map((log, i) => {
                let color = "text-foreground"
                if (log.level === "ERROR") color = "text-destructive"
                if (log.level === "WARN") color = "text-warning"
                if (log.level === "INFO") color = "text-success"
                if (log.level === "DEBUG") color = "text-muted-foreground"

                return (
                  <li key={i} className="flex gap-2">
                    <span className="shrink-0 text-muted-foreground">
                      [{new Date(log.timestamp).toLocaleTimeString()}]
                    </span>
                    <span className={`${color} shrink-0 font-bold`}>
                      [{log.level}]
                    </span>
                    <span className="shrink-0 text-primary">
                      {log.context}:
                    </span>
                    <span className={`${color} break-words`}>
                      {log.text || log.message}
                    </span>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
