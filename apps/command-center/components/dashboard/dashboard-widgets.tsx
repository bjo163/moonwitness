"use client"

import React from "react"
import { 
  Calculator, 
  HeartHandshake, 
  CheckCircle2, 
  MapPin, 
  Sparkles,
  Orbit,
  Activity,
  Globe2
} from "lucide-react"

export function ZakatCalculatorWidget() {
  return (
    <div className="rounded-xl border border-border bg-black/40 p-4 backdrop-blur-md">
      <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase mb-2">
        <Calculator className="h-4 w-4" />
        <span>Zakat Calculator</span>
      </div>
      <div className="text-xl font-bold text-white">Rp 2.450.000</div>
      <div className="text-[10px] text-slate-400 mt-1">Nisab 85g Emas (Terpenuhi)</div>
    </div>
  )
}

export function InfaqTrackerWidget() {
  return (
    <div className="rounded-xl border border-emerald-900/30 bg-black/40 p-4 backdrop-blur-md">
      <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase mb-2">
        <HeartHandshake className="h-4 w-4" />
        <span>Infaq & Sedekah</span>
      </div>
      <div className="text-xl font-bold text-white">Rp 850.000</div>
      <div className="text-[10px] text-emerald-400 mt-1">12 Transaksi Bulan Ini</div>
    </div>
  )
}

export function MutabaahWidget() {
  return (
    <div className="rounded-xl border border-border bg-black/40 p-4 backdrop-blur-md">
      <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase mb-2">
        <CheckCircle2 className="h-4 w-4" />
        <span>Mutaba'ah Yaumiyah</span>
      </div>
      <div className="text-xl font-bold text-white">85% Selesai</div>
      <div className="text-[10px] text-primary mt-1">Shalat 5 Waktu & Tilawah</div>
    </div>
  )
}

export function MosqueRadarWidget() {
  return (
    <div className="rounded-xl border border-amber-900/30 bg-black/40 p-4 backdrop-blur-md">
      <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase mb-2">
        <MapPin className="h-4 w-4" />
        <span>Radar Masjid Terdekat</span>
      </div>
      <div className="text-sm font-bold text-white">Masjid Raya Istiqlal</div>
      <div className="text-[10px] text-amber-400 mt-1">1.2 KM • Arah 295° NW</div>
    </div>
  )
}

export function SpiritualReportWidget() {
  return (
    <div className="rounded-xl border border-border bg-black/40 p-6 backdrop-blur-md">
      <div className="flex items-center justify-between border-b border-border pb-3">
        <div className="flex items-center gap-2 text-primary font-bold text-sm uppercase">
          <Sparkles className="h-4 w-4" />
          <span>Spiritual Health & Reflection Analytics</span>
        </div>
        <span className="text-xs text-emerald-400 font-bold font-mono">STATUS: OPTIMAL</span>
      </div>
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
        <div className="p-3 bg-muted border border-border rounded-lg">
          <div className="text-slate-400 text-[10px]">Konsistensi Ibadah</div>
          <div className="text-lg font-bold text-primary mt-1">94.2%</div>
        </div>
        <div className="p-3 bg-muted border border-border rounded-lg">
          <div className="text-slate-400 text-[10px]">Khatam Qur'an Target</div>
          <div className="text-lg font-bold text-emerald-300 mt-1">Juz 18 / 30</div>
        </div>
        <div className="p-3 bg-muted border border-border rounded-lg">
          <div className="text-slate-400 text-[10px]">Indeks Kedamaian Hati</div>
          <div className="text-lg font-bold text-primary mt-1">High (Al-Muthma'innah)</div>
        </div>
      </div>
    </div>
  )
}

export function RightSidebar({
  moon,
  monitoring,
  status,
}: {
  moon: any
  monitoring: any[]
  status: any
}) {
  return (
    <div className="space-y-6 font-mono text-xs">
      {/* Moon Phase Box */}
      <div className="rounded-xl border border-border bg-black/60 p-5 backdrop-blur-md">
        <div className="flex items-center justify-between border-b border-border pb-2">
          <div className="flex items-center gap-2 text-primary font-bold">
            <Orbit className="h-4 w-4 animate-spin [animation-duration:20s]" />
            <span className="text-[10px] uppercase">Celestial Telemetry</span>
          </div>
          <span className="text-[10px] text-amber-400 font-bold">{moon?.illumination || "87%"} LIT</span>
        </div>
        <div className="mt-3 space-y-1 text-slate-300">
          <div className="text-sm font-bold text-white">{moon?.phase || "Waxing Gibbous"}</div>
          <div className="text-[10px] text-slate-500">Moon Age: {moon?.moonAge || "11.4d"} • Visibility: {moon?.visibility || "Clear"}</div>
        </div>
      </div>

      {/* Global Monitoring List */}
      <div className="rounded-xl border border-border bg-black/60 p-5 backdrop-blur-md space-y-3">
        <div className="flex items-center gap-2 text-primary font-bold text-[10px] uppercase border-b border-border pb-2">
          <Globe2 className="h-4 w-4" />
          <span>Global Monitoring</span>
        </div>
        <div className="space-y-2.5">
          {monitoring && monitoring.map((m, i) => (
            <div key={i} className="flex items-center justify-between text-[11px]">
              <span className="text-slate-400">{m.name}</span>
              <span className="text-primary font-bold">{m.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}