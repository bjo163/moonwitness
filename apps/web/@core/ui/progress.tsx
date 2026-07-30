"use client"

import React from "react"
import { THEME_TOKENS, ThemeAccentColor } from "@core/tokens/theme-tokens"

export function Progress({
  value,
  max = 100,
  label,
  accentColor = "system",
  status = "ACTIVE",
}: {
  value: number
  max?: number
  label?: string
  accentColor?: ThemeAccentColor
  status?: string
}) {
  const colorHex = THEME_TOKENS.colors[accentColor]
  const percentage = Math.min(100, Math.max(0, (value / max) * 100))

  return (
    <div className="flex w-full flex-col gap-1.5">
      {(label || status) && (
        <div className="flex items-end justify-between font-mono text-[9px] tracking-widest uppercase sm:text-[10px]">
          <span className="text-primary">{label}</span>
          <span className="font-bold" style={{ color: colorHex }}>
            {status} [{Math.round(percentage)}%]
          </span>
        </div>
      )}
      <div className="bg-space tag-clip relative h-2 w-full overflow-hidden border border-primary/20">
        <div
          className="absolute top-0 left-0 h-full transition-all duration-500 ease-out"
          style={{
            width: `${percentage}%`,
            backgroundColor: colorHex,
            boxShadow: `0 0 10px ${colorHex}`,
          }}
        />
        {/* Grid overlay to give it a tech look */}
        <div
          className="pointer-events-none absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "linear-gradient(90deg, transparent 50%, #000 50%)",
            backgroundSize: "4px 100%",
          }}
        />
      </div>
    </div>
  )
}
