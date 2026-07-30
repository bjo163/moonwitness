"use client"

import React from "react"
import { THEME_TOKENS, ThemeAccentColor } from "@core/tokens/theme-tokens"

export function Stat({
  label,
  value,
  trend,
  icon: Icon,
  accentColor = "system",
}: {
  label: string
  value: string | number
  trend?: string
  icon?: React.ElementType
  accentColor?: ThemeAccentColor
}) {
  const colorHex = THEME_TOKENS.colors[accentColor]

  return (
    <div className="panel-box bg-space/60 flex flex-col border border-primary/10 p-4 transition-colors hover:bg-primary/5">
      <div className="mb-2 flex items-center justify-between text-primary/70">
        <span className="font-mono text-[10px] font-bold tracking-widest uppercase">
          {label}
        </span>
        {Icon && <Icon className="h-3.5 w-3.5" />}
      </div>
      <div className="flex items-end justify-between">
        <span
          className="font-mono text-xl font-black tracking-wider"
          style={{
            color: colorHex,
            textShadow: `0 0 10px ${colorHex}40`,
          }}
        >
          {value}
        </span>
        {trend && (
          <span
            className={`font-mono text-[9px] ${
              trend.startsWith("+") ? "text-success" : "text-danger"
            }`}
          >
            {trend}
          </span>
        )}
      </div>
    </div>
  )
}
