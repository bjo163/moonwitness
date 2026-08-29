"use client"

import React from "react"
import {
  THEME_TOKENS,
  type ThemeAccentColor,
  type ThemePanelLevel,
} from "../tokens/theme-tokens"

export function PanelHeader({
  title,
  status = "ACTIVE",
  icon: Icon,
  accentColor = "primary",
  subtitle,
}: {
  title: string
  status?: string
  icon?: React.ElementType
  accentColor?: ThemeAccentColor
  subtitle?: string
}) {
  const colorHex = THEME_TOKENS.colors[accentColor] || THEME_TOKENS.colors.primary

  return (
    <div className="mb-4 border-b pb-3 border-border">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          {Icon ? (
            <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-border bg-muted/40">
              <Icon className="h-3.5 w-3.5" style={{ color: colorHex }} />
            </div>
          ) : (
            <span className="text-xs font-bold text-primary">◉</span>
          )}
          <h3 className="text-sm font-bold tracking-wide text-foreground uppercase sm:text-base">
            {title}
          </h3>
        </div>

        <div className="flex items-center gap-1.5 font-mono text-[10px] font-medium text-muted-foreground">
          <span
            className="h-1.5 w-1.5 animate-pulse rounded-full"
            style={{ background: colorHex }}
          />
          <span style={{ color: colorHex }}>{status}</span>
        </div>
      </div>

      {subtitle && (
        <p className="mt-1 text-xs text-muted-foreground">
          {subtitle}
        </p>
      )}
    </div>
  )
}

export function Panel({
  children,
  level = "level2",
  accentColor = "primary",
  className = "",
  style = {},
}: {
  children: React.ReactNode
  level?: ThemePanelLevel
  accentColor?: ThemeAccentColor
  className?: string
  style?: React.CSSProperties
}) {
  const levelConfig =
    THEME_TOKENS.panelLevels[level] || THEME_TOKENS.panelLevels.level2

  return (
    <div
      className={`rounded-xl border border-border bg-card ${levelConfig.padding} relative shadow-sm transition-colors ${className}`}
      style={{
        ...style,
      }}
    >
      {children}
    </div>
  )
}
