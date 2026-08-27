import React from "react"

export interface StatProps {
  label: string
  value: string | number
  trend?: string
  icon?: React.ElementType
  accentColor?: "accent" | "system" | "warning" | "danger" | "knowledge" | string
  className?: string
}

export function Stat({
  label,
  value,
  trend,
  icon: Icon,
  accentColor = "system",
  className = "",
}: StatProps) {
  let accentClass = "text-cyan-400 border-cyan-500/30"
  if (accentColor === "warning") accentClass = "text-amber-400 border-amber-500/30"
  if (accentColor === "accent" || accentColor === "danger") accentClass = "text-red-400 border-red-500/30"
  if (accentColor === "knowledge") accentClass = "text-fuchsia-400 border-fuchsia-500/30"

  return (
    <div
      className={`relative overflow-hidden rounded-xl border bg-black/40 p-3.5 backdrop-blur-md transition-all hover:bg-white/5 ${accentClass} ${className}`}
    >
      <div className="flex items-center justify-between">
        <span className="font-mono text-[9px] font-bold tracking-widest text-slate-400 uppercase">
          {label}
        </span>
        {Icon && <Icon className="h-3.5 w-3.5 opacity-80" />}
      </div>
      <div className="mt-2 flex items-baseline justify-between">
        <span className="font-mono text-base font-bold text-white sm:text-lg">
          {value}
        </span>
        {trend && (
          <span className="font-mono text-[9px] font-semibold text-emerald-400">
            {trend}
          </span>
        )}
      </div>
    </div>
  )
}
