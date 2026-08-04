"use client"

import React, { useState, useEffect } from "react"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"
import { ShieldCheck, Activity, Award, Calendar, FileText } from "lucide-react"

const MOCK_REPORT_DATA = [
  { name: 'Mon', prayer: 5, quran: 20, dzikir: 33 },
  { name: 'Tue', prayer: 4, quran: 15, dzikir: 0 },
  { name: 'Wed', prayer: 5, quran: 30, dzikir: 66 },
  { name: 'Thu', prayer: 5, quran: 10, dzikir: 33 },
  { name: 'Fri', prayer: 5, quran: 45, dzikir: 99 },
  { name: 'Sat', prayer: 5, quran: 25, dzikir: 33 },
  { name: 'Sun', prayer: 3, quran: 0, dzikir: 0 },
]

export function SpiritualReportWidget() {
  const [mounted, setMounted] = useState(false)
  const [activeMetric, setActiveMetric] = useState<"prayer" | "quran" | "dzikir">("prayer")

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const getMetricColor = () => {
    switch(activeMetric) {
      case "prayer": return "#00F0FF" // Cyan
      case "quran": return "#10B981"  // Emerald
      case "dzikir": return "#D946EF" // Fuchsia
      default: return "#00F0FF"
    }
  }

  return (
    <div className="panel-clip group relative flex h-full min-h-[300px] flex-col overflow-hidden border border-cyan-500/30 bg-space p-6 transition-all hover:border-cyan-400">
      {/* Background Decor */}
      <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-cyan-900/20 blur-3xl" />
      
      {/* Header */}
      <div className="relative z-10 mb-6 flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-cyan-400" />
            <h2 className="font-sans text-lg font-black tracking-widest text-white uppercase drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]">
              Weekly Spiritual Report
            </h2>
          </div>
          <p className="mt-1 font-mono text-[10px] uppercase tracking-widest text-primary">
            Auto-Generated • Last 7 Days
          </p>
        </div>
        <div className="rounded bg-black/40 px-3 py-1 font-mono text-[10px] font-bold text-cyan-400 border border-cyan-500/20">
          <Calendar className="h-3 w-3 inline-block mr-1" />
          AUG 04 - AUG 10
        </div>
      </div>

      {/* Metric Selector Tabs */}
      <div className="relative z-10 mb-6 flex gap-2">
        <button 
          onClick={() => setActiveMetric("prayer")}
          className={`flex-1 flex items-center justify-center gap-2 rounded-lg border py-2 text-[10px] font-bold uppercase tracking-widest transition-colors ${
            activeMetric === "prayer" 
              ? "border-cyan-500 bg-cyan-500/20 text-cyan-300" 
              : "border-white/10 bg-black/40 text-slate-400 hover:border-cyan-500/30"
          }`}
        >
          <ShieldCheck className="h-3.5 w-3.5" />
          Prayers
        </button>
        <button 
          onClick={() => setActiveMetric("quran")}
          className={`flex-1 flex items-center justify-center gap-2 rounded-lg border py-2 text-[10px] font-bold uppercase tracking-widest transition-colors ${
            activeMetric === "quran" 
              ? "border-emerald-500 bg-emerald-500/20 text-emerald-300" 
              : "border-white/10 bg-black/40 text-slate-400 hover:border-emerald-500/30"
          }`}
        >
          <Activity className="h-3.5 w-3.5" />
          Qur'an (Mins)
        </button>
        <button 
          onClick={() => setActiveMetric("dzikir")}
          className={`flex-1 flex items-center justify-center gap-2 rounded-lg border py-2 text-[10px] font-bold uppercase tracking-widest transition-colors ${
            activeMetric === "dzikir" 
              ? "border-fuchsia-500 bg-fuchsia-500/20 text-fuchsia-300" 
              : "border-white/10 bg-black/40 text-slate-400 hover:border-fuchsia-500/30"
          }`}
        >
          <Award className="h-3.5 w-3.5" />
          Dzikir
        </button>
      </div>

      {/* Chart */}
      <div className="relative z-10 h-[180px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={MOCK_REPORT_DATA} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#475569', fontSize: 10, fontFamily: 'monospace' }} 
              dy={10}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#475569', fontSize: 10, fontFamily: 'monospace' }} 
            />
            <Tooltip 
              cursor={{ fill: 'rgba(255,255,255,0.05)' }}
              contentStyle={{ 
                backgroundColor: 'rgba(0,0,0,0.8)', 
                borderColor: getMetricColor(),
                borderWidth: 1,
                borderRadius: '8px',
                fontFamily: 'monospace',
                fontSize: '12px'
              }}
              itemStyle={{ color: getMetricColor() }}
            />
            <Bar 
              dataKey={activeMetric} 
              fill={getMetricColor()} 
              radius={[4, 4, 0, 0]}
              animationDuration={1500}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
