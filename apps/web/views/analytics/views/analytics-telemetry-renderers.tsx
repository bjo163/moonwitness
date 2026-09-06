"use client"

import {
  Activity,
  BarChart3,
  Clock,
  Server,
  TerminalSquare,
  TrendingUp,
  Wifi,
} from "lucide-react"
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

export type TelemetryStatus = {
  uptime: string | number
  models: number
  db: string
}

export type TelemetryMetric = {
  time: string
  connections: number
}

export type TelemetryLog = {
  timestamp: string
  level: string
  context?: string
  text?: string
  message?: string
}

const TELEMETRY_METRICS = [
  { label: "Active Connections", icon: Wifi, valueClass: "text-success", value: "48" },
  { label: "Core Uptime", icon: Clock, valueClass: "text-primary", value: "uptime" },
  { label: "Database", icon: Server, valueClass: "text-primary", value: "db" },
  { label: "Models Loaded", icon: BarChart3, valueClass: "text-success", value: "models" },
] as const

export function TelemetryHeader() {
  return (
    <div className="mb-6 flex items-end justify-between">
      <div>
        <h1 className="flex items-center gap-3 text-3xl font-black tracking-widest text-foreground uppercase">
          <Activity className="h-8 w-8 text-success" />
          Global Telemetry & Analytics
        </h1>
        <p className="mt-2 font-mono text-sm text-success/70">
          Real-time system monitoring, usage analytics, and performance metrics.
        </p>
      </div>
      <div className="flex gap-4">
        <div className="flex items-center gap-2 rounded-full border border-green-500/30 bg-green-500/10 px-4 py-2">
          <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-green-400" />
          <span className="text-xs font-bold tracking-widest text-success uppercase">
            Engine Online
          </span>
        </div>
      </div>
    </div>
  )
}

function getMetricValue(
  metric: (typeof TELEMETRY_METRICS)[number],
  status: TelemetryStatus
) {
  if (metric.value === "uptime") return `${status.uptime}h`
  if (metric.value === "db") return status.db
  if (metric.value === "models") return status.models
  return metric.value
}

export function TelemetryMetricGrid({ status }: { status: TelemetryStatus }) {
  return (
    <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-4">
      {TELEMETRY_METRICS.map((metric) => {
        const Icon = metric.icon
        const value = getMetricValue(metric, status)
        const isDatabase = metric.value === "db"

        return (
          <div
            key={metric.label}
            className="rounded-2xl border border-border bg-card p-6 backdrop-blur-xl transition-all hover:border-border"
          >
            <div className={`mb-4 flex items-center gap-2 font-mono text-xs font-bold tracking-widest uppercase ${metric.valueClass}`}>
              <Icon className="h-4 w-4" /> {metric.label}
            </div>
            <div className={`font-mono ${isDatabase ? "text-3xl" : "text-4xl"} font-black text-foreground ${isDatabase ? "uppercase" : ""}`}>
              {value}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export function TelemetryTrafficChart({ data }: { data: TelemetryMetric[] }) {
  return (
    <div className="flex min-h-[250px] flex-col rounded-2xl border border-border bg-card p-6 backdrop-blur-xl md:min-h-[400px] lg:col-span-2">
      <h2 className="mb-6 flex items-center gap-2 text-lg font-semibold text-foreground">
        <TrendingUp className="h-5 w-5 text-primary" />
        Historical Traffic (mx.metric)
      </h2>
      <div className="h-full w-full flex-1">
        {data.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorConnections" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="time" stroke="#475569" fontSize={12} tickMargin={10} />
              <YAxis stroke="#475569" fontSize={12} />
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
              <Tooltip
                contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #334155", borderRadius: "8px" }}
                itemStyle={{ color: "#10b981" }}
              />
              <Area type="monotone" dataKey="connections" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorConnections)" />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex h-full w-full items-center justify-center rounded-xl border border-dashed border-border">
            <span className="font-mono text-sm text-muted-foreground">Awaiting metric aggregation...</span>
          </div>
        )}
      </div>
    </div>
  )
}

function logColor(level: string) {
  if (level === "ERROR") return "text-destructive"
  if (level === "WARN") return "text-warning"
  if (level === "INFO") return "text-success"
  if (level === "DEBUG") return "text-muted-foreground"
  return "text-foreground"
}

export function TelemetryLiveLogs({ logs }: { logs: TelemetryLog[] }) {
  return (
    <div className="flex h-[300px] flex-col rounded-2xl border border-border bg-card p-6 backdrop-blur-xl md:h-[400px]">
      <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-foreground">
        <TerminalSquare className="h-5 w-5 text-primary" />
        Live Engine Logs
      </h2>
      <div className="flex-1 overflow-y-auto rounded-xl border border-border bg-card p-4 font-mono text-xs">
        <ul className="space-y-2">
          {logs.length === 0 && <li className="text-muted-foreground italic">Listening to system events...</li>}
          {logs.map((log, index) => {
            const color = logColor(log.level)
            return (
              <li key={`${log.timestamp}-${index}`} className="flex gap-2">
                <span className="shrink-0 text-muted-foreground">[{new Date(log.timestamp).toLocaleTimeString()}]</span>
                <span className={`${color} shrink-0 font-bold`}>[{log.level}]</span>
                <span className="shrink-0 text-primary">{log.context}:</span>
                <span className={`${color} break-words`}>{log.text || log.message}</span>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}
