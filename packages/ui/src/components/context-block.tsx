"use client"

import React from "react"
import { THEME_TOKENS, type ThemeAccentColor } from "../tokens/theme-tokens"

export function ContextBlock({
  title,
  subtitle,
  operation,
  status = "ACTIVE",
  accentColor = "system",
}: {
  title: string
  subtitle?: string
  operation?: string
  status?: string
  accentColor?: ThemeAccentColor
}) {
  const colorHex =
    THEME_TOKENS.colors[accentColor] || THEME_TOKENS.colors.system

  return (
    <div
      className="panel-box bg-space mb-6 border p-4 sm:p-5"
      style={{
        borderColor: `${colorHex}40`,
        boxShadow: `0 0 20px ${colorHex}15`,
      }}
    >
      <div className="mb-2 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div
            className="tag-clip flex h-6 w-6 items-center justify-center border text-xs font-bold"
            style={{
              borderColor: `${colorHex}60`,
              background: `${colorHex}15`,
              color: colorHex,
            }}
          >
            ◉
          </div>
          <h1 className="text-base font-black tracking-widest text-foreground uppercase sm:text-xl">
            {title}
          </h1>
        </div>

        <div className="flex items-center gap-2 font-mono text-[10px]">
          {operation && (
            <span className="text-primary">
              OP: <span className="font-bold text-foreground">{operation}</span>
            </span>
          )}
          <span
            className="tag-clip border px-2 py-0.5 font-bold"
            style={{
              color: colorHex,
              borderColor: `${colorHex}50`,
              background: `${colorHex}12`,
            }}
          >
            ● {status}
          </span>
        </div>
      </div>

      {subtitle && (
        <p className="max-w-3xl font-mono text-xs leading-relaxed text-primary">
          &gt; {subtitle}
        </p>
      )}
    </div>
  )
}
