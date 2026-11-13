"use client"

import React from "react"
import {
  Sun,
  Target,
  Activity,
  Zap,
  Wind,
  Clock,
  Smile,
  Heart,
} from "lucide-react"

export function SunPositionMetrics() {
  const metrics = [
    {
      label: "SUNLIGHT NOW",
      value: "782",
      unit: "W/m²",
      desc: "GOOD EXPOSURE",
      icon: Sun,
      color: "text-warning",
    },
    {
      label: "UV INDEX",
      value: "5",
      unit: "",
      desc: "MODERATE",
      icon: Target,
      color: "text-warning",
    },
    {
      label: "VITAMIN D TODAY",
      value: "92%",
      unit: "",
      desc: "GOOD LEVEL",
      icon: Activity,
      color: "text-warning",
    },
    {
      label: "SUN ENERGY",
      value: "846",
      unit: "kWh/m²",
      desc: "HIGH INTENSITY",
      icon: Zap,
      color: "text-warning",
    },
    {
      label: "AIR QUALITY",
      value: "42",
      unit: "",
      desc: "GOOD",
      icon: Wind,
      color: "text-warning",
    },
    {
      label: "CIRCADIAN SCORE",
      value: "87%",
      unit: "",
      desc: "ALIGNED",
      icon: Clock,
      color: "text-warning",
    },
    {
      label: "MOOD BOOST",
      value: "84%",
      unit: "",
      desc: "POSITIVE",
      icon: Smile,
      color: "text-warning",
    },
    {
      label: "SPIRITUAL LIGHT",
      value: "99.7%",
      unit: "",
      desc: "CONNECTED",
      icon: Heart,
      color: "text-warning",
    },
  ]

  return (
    <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-8">
      {metrics.map((m, i) => (
        <div
          key={i}
          className="flex flex-col items-center justify-center rounded-xl border border-border bg-card p-4 transition-colors hover:border-warning/20"
        >
          <div className="mb-2 flex items-center gap-2">
            <m.icon className={`h-4 w-4 ${m.color} drop-shadow-sm`} />
            <span className="text-[8px] tracking-widest text-muted-foreground uppercase">
              {m.label}
            </span>
          </div>
          <div className="mb-1 font-mono text-2xl font-black text-foreground">
            {m.value} <span className="text-xs text-foreground/50">{m.unit}</span>
          </div>
          <div className="text-[7px] tracking-widest text-foreground/40 uppercase">
            {m.desc}
          </div>
        </div>
      ))}
    </div>
  )
}
