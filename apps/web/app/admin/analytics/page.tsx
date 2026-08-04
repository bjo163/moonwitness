import React from "react"
import { BarChart3, Users, Globe2, Activity } from "lucide-react"

export default function AdminAnalyticsPage() {
  return (
    <div className="min-h-screen bg-space p-8 text-foreground">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="flex items-center justify-between border-b border-primary/20 pb-4">
          <div>
            <h1 className="font-orbitron text-2xl font-bold tracking-widest text-cyan-400 uppercase drop-shadow-[0_0_8px_rgba(0,240,255,0.3)]">
              Global Command Center
            </h1>
            <p className="font-mono text-xs text-primary/60">
              Admin Analytics Dashboard
            </p>
          </div>
          <div className="flex items-center gap-2 font-mono text-[10px] text-emerald-400">
            <Activity className="h-4 w-4 animate-pulse" />
            LIVE
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard title="Active Operatives" value="12,450" change="+14%" icon={<Users className="h-5 w-5 text-cyan-400" />} />
          <StatCard title="Global Reflections" value="89,201" change="+5.2%" icon={<Globe2 className="h-5 w-5 text-fuchsia-400" />} />
          <StatCard title="Total XP Earned" value="4.2M" change="+21%" icon={<BarChart3 className="h-5 w-5 text-amber-400" />} />
          <StatCard title="Server Load" value="12%" change="-2%" icon={<Activity className="h-5 w-5 text-emerald-400" />} />
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Mock Chart Area */}
          <div className="bg-[#040C1A]/80 rounded-2xl border border-cyan-500/20 p-5 backdrop-blur-xl h-80 flex flex-col shadow-[0_0_20px_rgba(0,240,255,0.05)] hover:border-cyan-500/40 transition-colors">
            <h3 className="font-sans text-xs font-bold tracking-wider text-cyan-400 uppercase mb-4">
              Engagement Matrix
            </h3>
            <div className="flex-1 flex items-end gap-2 justify-between mt-auto">
              {[40, 70, 45, 90, 65, 80, 100].map((h, i) => (
                <div key={i} className="w-full bg-cyan-500/20 hover:bg-cyan-400 hover:shadow-[0_0_15px_rgba(0,240,255,0.5)] transition-all rounded-t cursor-pointer" style={{ height: `${h}%` }}></div>
              ))}
            </div>
            <div className="flex justify-between mt-2 font-mono text-[9px] text-primary/50">
              <span>MON</span>
              <span>TUE</span>
              <span>WED</span>
              <span>THU</span>
              <span>FRI</span>
              <span>SAT</span>
              <span>SUN</span>
            </div>
          </div>
          
          <div className="bg-[#040C1A]/80 rounded-2xl border border-cyan-500/20 p-5 backdrop-blur-xl shadow-[0_0_20px_rgba(0,240,255,0.05)] hover:border-cyan-500/40 transition-colors">
            <h3 className="font-sans text-xs font-bold tracking-wider text-cyan-400 uppercase mb-4">
              Recent System Events
            </h3>
            <div className="space-y-4">
              {[
                { time: "10:42 AM", ev: "Khidra Engine Auto-Scaled" },
                { time: "09:15 AM", ev: "New Guild Created: 'Seekers'" },
                { time: "08:00 AM", ev: "Global Backup Completed" },
              ].map((e, i) => (
                <div key={i} className="flex items-center gap-4 border-b border-white/5 pb-3">
                  <span className="font-mono text-xs text-cyan-500/50 w-16">{e.time}</span>
                  <span className="font-sans text-sm text-white/90">{e.ev}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function StatCard({ title, value, change, icon }: { title: string, value: string, change: string, icon: React.ReactNode }) {
  const isPos = change.startsWith("+")
  return (
    <div className="bg-[#040C1A]/80 rounded-2xl border border-cyan-500/20 p-5 backdrop-blur-xl relative overflow-hidden group hover:border-cyan-500/50 hover:shadow-[0_0_20px_rgba(0,240,255,0.15)] transition-all cursor-pointer">
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="absolute -right-4 -top-4 opacity-10 group-hover:scale-150 group-hover:opacity-20 transition-all duration-500">
        {icon}
      </div>
      <div className="flex items-center justify-between mb-4 relative z-10">
        <h3 className="font-sans text-xs font-bold tracking-wider text-cyan-400/80 uppercase">
          {title}
        </h3>
        {icon}
      </div>
      <div className="flex items-end justify-between relative z-10">
        <span className="font-mono text-3xl font-black text-white drop-shadow-[0_2px_10px_rgba(255,255,255,0.2)] group-hover:text-cyan-50 transition-colors">{value}</span>
        <span className={`font-mono text-[10px] font-bold ${isPos ? "text-emerald-400" : "text-red-400"}`}>
          {change}
        </span>
      </div>
    </div>
  )
}
