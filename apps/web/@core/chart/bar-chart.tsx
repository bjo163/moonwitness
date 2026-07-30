"use client"

import React from "react"
import { Activity } from "lucide-react"
import { THEME_TOKENS, ThemeAccentColor } from "@core/tokens/theme-tokens"
import { Tooltip } from "@core/ui"

export function Chart({
  data,
  title,
  subtitle,
  accentColor = "system",
  height = "h-48",
}: {
  data: { label: string; value: number }[]
  title: string
  subtitle?: string
  accentColor?: ThemeAccentColor
  height?: string
}) {
  const accentHex =
    THEME_TOKENS.colors[accentColor] || THEME_TOKENS.colors.system
  const maxValue = Math.max(...data.map((d) => d.value), 1)

  return (
    <div
      className="panel-box border-opacity-30 bg-panel space-y-4 border p-4"
      style={{ borderColor: `${accentHex}40` }}
    >
      <div
        className="flex items-end justify-between border-b pb-2"
        style={{ borderColor: `${accentHex}20` }}
      >
        <div>
          <h4 className="text-[10px] font-black tracking-widest text-foreground uppercase">
            {title}
          </h4>
          {subtitle && (
            <p className="mt-0.5 text-[9px] tracking-wider text-primary">
              {subtitle}
            </p>
          )}
        </div>
        <Activity className="h-4 w-4" style={{ color: accentHex }} />
      </div>

      <div className={`flex w-full items-end gap-2 ${height} pt-4`}>
        {data.map((item, i) => {
          const heightPct = (item.value / maxValue) * 100
          return (
            <div
              key={i}
              className="group relative flex flex-1 flex-col items-center gap-2"
            >
              <Tooltip text={`${item.label}: ${item.value}`} position="top">
                <div
                  className="tag-clip relative w-full cursor-pointer overflow-hidden transition-all duration-500"
                  style={{
                    height: `${heightPct}%`,
                    backgroundColor: `${accentHex}20`,
                    borderTop: `2px solid ${accentHex}`,
                  }}
                >
                  <div
                    className="absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100"
                    style={{
                      backgroundImage: `linear-gradient(to top, transparent, ${accentHex}80)`,
                    }}
                  />
                </div>
              </Tooltip>
              <span className="w-full truncate text-center font-mono text-[8px] text-primary uppercase">
                {item.label}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
