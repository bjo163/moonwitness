"use client"

import React from "react"
import { 
  Calculator, 
  HeartHandshake, 
  CheckCircle2, 
  MapPin, 
  Sparkles, 
  Orbit, 
  Globe2 
} from "lucide-react"
import { MetricCard, PropertyList, PropertyRow, StatusBadge } from "@workspace/ui"

export function ZakatCalculatorWidget() {
  return (
    <MetricCard
      title="Zakat Calculator"
      value="Rp 2.450.000"
      detail="Demo data · backend belum tersedia"
      icon={<Calculator className="h-4 w-4" />}
    />
  )
}

export function InfaqTrackerWidget() {
  return (
    <MetricCard
      title="Infaq & Sedekah"
      value="Rp 850.000"
      detail="Demo data · backend belum tersedia"
      icon={<HeartHandshake className="h-4 w-4" />}
      variant="success"
    />
  )
}

export function MutabaahWidget() {
  return (
    <MetricCard
      title="Mutaba'ah Yaumiyah"
      value="85% Selesai"
      detail="Demo data · backend belum tersedia"
      icon={<CheckCircle2 className="h-4 w-4" />}
    />
  )
}

export function MosqueRadarWidget() {
  return (
    <MetricCard
      title="Radar Masjid Terdekat"
      value="Masjid Raya Istiqlal"
      detail="Demo data · backend belum tersedia"
      icon={<MapPin className="h-4 w-4" />}
      variant="warning"
    />
  )
}

export function SpiritualReportWidget() {
  return (
    <div className="rounded-md border border-border bg-card p-6 shadow-xs">
      <div className="flex items-center justify-between border-b border-border pb-3">
        <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <Sparkles className="h-4 w-4" />
          <span>Spiritual Health & Reflection Analytics</span>
        </div>
        <StatusBadge status="warning" label="Demo data" size="sm" />
      </div>
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
        <MetricCard
          title="Konsistensi Ibadah"
          value="—"
          variant="default"
        />
        <MetricCard
          title="Khatam Qur'an Target"
          value="—"
          variant="success"
        />
        <MetricCard
          title="Indeks Kedamaian Hati"
          value="—"
          variant="default"
        />
      </div>
    </div>
  )
}

export function RightSidebar({
  moon,
  monitoring,
}: {
  moon?: any
  monitoring?: any[]
  status?: any
}) {
  return (
    <div className="space-y-6 font-mono text-xs">
      {/* Moon Phase Box */}
      <div className="rounded-md border border-border bg-card p-5 shadow-xs">
        <div className="flex items-center justify-between border-b border-border pb-2">
          <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <Orbit className="h-4 w-4 animate-spin [animation-duration:20s]" />
            <span>Celestial telemetry</span>
          </div>
          <StatusBadge status="warning" label={`${moon?.illumination || "87%"} LIT`} size="sm" />
        </div>
        <div className="mt-3 space-y-1 text-foreground">
          <div className="text-sm font-bold text-foreground">{moon?.phase || "Waxing Gibbous"}</div>
          <div className="text-[10px] text-muted-foreground">Moon Age: {moon?.moonAge || "11.4d"} • Visibility: {moon?.visibility || "Clear"}</div>
        </div>
      </div>

      {/* Global Monitoring List */}
      <div className="rounded-md border border-border bg-card p-5 shadow-xs space-y-3">
        <div className="flex items-center gap-2 border-b border-border pb-2 text-sm font-semibold text-foreground">
          <Globe2 className="h-4 w-4" />
          <span>Global Monitoring</span>
        </div>
        <PropertyList>
          {monitoring && monitoring.map((m, i) => (
            <PropertyRow
              key={i}
              label={m.name}
              value={<span className="font-bold text-primary">{m.value}</span>}
            />
          ))}
        </PropertyList>
      </div>
    </div>
  )
}
