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
  const colorToken =
    THEME_TOKENS.colors[accentColor] || THEME_TOKENS.colors.system

  return (
    <div
      className="panel-box mb-6 border border-border bg-card p-4 shadow-sm sm:p-5"
      style={{
        borderColor: `color-mix(in srgb, ${colorToken} 40%, transparent)`,
      }}
    >
      <div className="mb-2 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div
            className="tag-clip flex h-6 w-6 items-center justify-center border border-border bg-muted/40 text-xs font-bold"
            style={{
              color: colorToken,
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
              color: colorToken,
              borderColor: `color-mix(in srgb, ${colorToken} 50%, transparent)`,
              background: `color-mix(in srgb, ${colorToken} 12%, transparent)`,
            }}
          >
            ● {status}
          </span>
        </div>
      </div>

      {subtitle && (
        <p className="max-w-3xl font-mono text-xs leading-relaxed text-muted-foreground">
          {subtitle}
        </p>
      )}
    </div>
  )
}
