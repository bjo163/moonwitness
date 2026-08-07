"use client"

import React, { useEffect, useState } from "react"
import { Activity, BarChart3, TrendingUp, Cpu, Server, Wifi, Clock, TerminalSquare } from "lucide-react"
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
  AreaChart
} from "recharts"

import { useMoonStore } from "@core/store/moon-store"

export function AnalyticsTelemetryView() {
  const { request, subscribe, activeConnections } = useMoonStore()
  
  const [systemStatus, setSystemStatus] = useState<any>({ uptime: 0, models: 0, db: 'unknown' })
  const [metricsData, setMetricsData] = useState<any[]>([])
  const [logs, setLogs] = useState<any[]>([])

  useEffect(() => {
    let unsubscribeLogs: any

    const init = async () => {
      try {
        // Fetch historical metrics (now public!)
        try {
          const res = await request('GET', '/api/mx.metric')
          if (Array.isArray(res)) {
            const formatted = res.map((item: any) => ({
              time: new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              connections: item.value
            })).slice(-20) // Get last 20 data points
            setMetricsData(formatted)
          }
        } catch (e) {
          console.warn("Failed to fetch historical metrics:", e)
        }

        // Fetch DB status and models via moon api server (cached 30s)
        const statusRes = await request('GET', '/api/external/db/status').catch(() => ({}))
        const modelsRes = await request('GET', '/api/external/meta/models').catch(() => [])
        
        setSystemStatus({
          uptime: (statusRes.uptime / 3600).toFixed(2),
          db: statusRes.database?.driverName || 'offline',
          models: Array.isArray(modelsRes) ? modelsRes.length : 0
        })

        unsubscribeLogs = subscribe('system_logs', (data) => {
          setLogs(prev => {
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
  }, [request, subscribe])

  return (
    <div className="flex h-screen flex-col p-8 overflow-y-auto">
      <div className="mb-6 flex justify-between items-end">
        <div>
          <h1 className="flex items-center gap-3 text-3xl font-black tracking-widest text-white uppercase">
            <Activity className="h-8 w-8 text-emerald-400" />
            Global Telemetry & Analytics
          </h1>
          <p className="mt-2 font-mono text-sm text-emerald-500/70">
            Real-time system monitoring, usage analytics, and performance metrics.
          </p>
        </div>
        <div className="flex gap-4">
          <div className="rounded-full border border-green-500/30 bg-green-500/10 px-4 py-2 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-green-400 animate-pulse"></span>
            <span className="text-xs font-bold text-green-400 uppercase tracking-widest">Engine Online</span>
          </div>
        </div>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-4">
        <div className="rounded-2xl border border-emerald-500/20 bg-black/40 p-6 backdrop-blur-xl transition-all hover:border-emerald-500/50">
          <div className="mb-4 flex items-center gap-2 font-mono text-xs font-bold tracking-widest text-emerald-400 uppercase">
            <Wifi className="h-4 w-4" /> Active Connections
          </div>
          <div className="font-mono text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-green-600">
            {activeConnections}
          </div>
        </div>
        
        <div className="rounded-2xl border border-cyan-500/20 bg-black/40 p-6 backdrop-blur-xl transition-all hover:border-cyan-500/50">
          <div className="mb-4 flex items-center gap-2 font-mono text-xs font-bold tracking-widest text-cyan-400 uppercase">
            <Clock className="h-4 w-4" /> Core Uptime
          </div>
          <div className="font-mono text-4xl font-black text-white">{systemStatus.uptime}h</div>
        </div>

        <div className="rounded-2xl border border-blue-500/20 bg-black/40 p-6 backdrop-blur-xl transition-all hover:border-blue-500/50">
          <div className="mb-4 flex items-center gap-2 font-mono text-xs font-bold tracking-widest text-blue-400 uppercase">
            <Server className="h-4 w-4" /> Database
          </div>
          <div className="font-mono text-3xl font-black text-white uppercase">{systemStatus.db}</div>
        </div>

        <div className="rounded-2xl border border-emerald-500/20 bg-black/40 p-6 backdrop-blur-xl transition-all hover:border-emerald-500/50">
          <div className="mb-4 flex items-center gap-2 font-mono text-xs font-bold tracking-widest text-emerald-400 uppercase">
            <BarChart3 className="h-4 w-4" /> Models Loaded
          </div>
          <div className="font-mono text-4xl font-black text-white">{systemStatus.models}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Chart Section */}
        <div className="lg:col-span-2 rounded-2xl border border-cyan-500/20 bg-black/40 p-6 backdrop-blur-xl flex flex-col min-h-[250px] md:min-h-[400px]">
          <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-cyan-400" />
            Historical Traffic (mx.metric)
          </h2>
          
          <div className="flex-1 w-full h-full">
            {metricsData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={metricsData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorConnections" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="time" stroke="#475569" fontSize={12} tickMargin={10} />
                  <YAxis stroke="#475569" fontSize={12} />
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px' }}
                    itemStyle={{ color: '#10b981' }}
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
              <div className="w-full h-full flex items-center justify-center border border-dashed border-slate-700 rounded-xl">
                <span className="text-slate-500 font-mono text-sm">Awaiting metric aggregation...</span>
              </div>
            )}
          </div>
        </div>

        {/* Live Logs Section */}
        <div className="rounded-2xl border border-cyan-500/20 bg-black/40 p-6 backdrop-blur-xl flex flex-col h-[300px] md:h-[400px]">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <TerminalSquare className="h-5 w-5 text-cyan-400" />
            Live Engine Logs
          </h2>
          <div className="flex-1 bg-black/60 rounded-xl border border-cyan-500/10 p-4 overflow-y-auto font-mono text-xs">
            <ul className="space-y-2">
              {logs.length === 0 && (
                <li className="text-slate-600 italic">Listening to system events...</li>
              )}
              {logs.map((log, i) => {
                let color = 'text-slate-300'
                if (log.level === 'ERROR') color = 'text-red-400'
                if (log.level === 'WARN') color = 'text-yellow-400'
                if (log.level === 'INFO') color = 'text-emerald-400'
                if (log.level === 'DEBUG') color = 'text-slate-500'
                
                return (
                  <li key={i} className="flex gap-2">
                    <span className="text-slate-600 shrink-0">[{new Date(log.timestamp).toLocaleTimeString()}]</span>
                    <span className={`${color} font-bold shrink-0`}>[{log.level}]</span>
                    <span className="text-cyan-400 shrink-0">{log.context}:</span>
                    <span className={`${color} break-words`}>{log.text || log.message}</span>
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
