"use client"

import React from "react"
import { THEME_TOKENS, type ThemeAccentColor } from "../tokens/theme-tokens"

export function ContextBlock({
  title,
  subtitle,
  operation,
  status = "ACTIVE",
  accentColor = "primary",
}: {
  title: string
  subtitle?: string
  operation?: string
  status?: string
  accentColor?: ThemeAccentColor
}) {
  const colorHex =
    THEME_TOKENS.colors[accentColor] || THEME_TOKENS.colors.primary

  return (
    <div
      className="mb-6 rounded-xl border border-border bg-card p-4 sm:p-5 shadow-sm"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div
            className="flex h-7 w-7 items-center justify-center rounded-lg border border-border bg-muted/40 text-xs font-bold text-primary"
            style={{
              color: colorHex,
            }}
          >
            ◉
          </div>
          <h1 className="text-base font-bold tracking-tight text-foreground uppercase sm:text-xl">
            {title}
          </h1>
        </div>

        <div className="flex items-center gap-2 font-mono text-[10px]">
          {operation && (
            <span className="text-muted-foreground">
              OP: <span className="font-semibold text-foreground">{operation}</span>
            </span>
          )}
          <span
            className="inline-flex items-center rounded-md border border-border bg-muted/40 px-2 py-0.5 font-bold"
            style={{
              color: colorHex,
            }}
          >
            ● {status}
          </span>
        </div>
      </div>

      {subtitle && (
        <p className="mt-2 max-w-3xl text-xs leading-relaxed text-muted-foreground">
          {subtitle}
        </p>
      )}
    </div>
  )
}
