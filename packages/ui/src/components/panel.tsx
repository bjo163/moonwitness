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
  accentColor = "system",
  subtitle,
}: {
  title: string
  status?: string
  icon?: React.ElementType
  accentColor?: ThemeAccentColor
  subtitle?: string
}) {
  const colorToken =
    THEME_TOKENS.colors[accentColor] || THEME_TOKENS.colors.system

  return (
    <div
      className="mb-4 border-b border-border pb-3"
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          {Icon ? (
            <div
              className="tag-clip flex h-7 w-7 items-center justify-center border border-border bg-muted/40"
            >
              <Icon className="h-3.5 w-3.5" style={{ color: colorToken }} />
            </div>
          ) : (
            <span className="text-success text-xs font-bold">◉</span>
          )}
          <h3
            className="text-sm font-black tracking-widest text-foreground uppercase sm:text-base"
          >
            {title}
          </h3>
        </div>

        <div className="flex items-center gap-1.5 font-mono text-[10px] font-bold">
          <span
            className="h-1.5 w-1.5 animate-pulse rounded-full"
            style={{ background: colorToken }}
          />
          <span style={{ color: colorToken }}>STATUS {status}</span>
        </div>
      </div>

      {subtitle && (
        <p className="mt-1 font-mono text-[10px] leading-normal text-muted-foreground">
          {subtitle}
        </p>
      )}
    </div>
  )
}

export function Panel({
  children,
  level = "level2",
  accentColor = "system",
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
  const colorToken =
    THEME_TOKENS.colors[accentColor] || THEME_TOKENS.colors.system
  return (
    <div
      className={`panel-box ${levelConfig.padding} relative border border-border bg-card transition-colors ${className}`}
      style={{
        borderWidth: levelConfig.borderWidth,
        borderColor: `color-mix(in srgb, ${colorToken} 35%, transparent)`,
        boxShadow: levelConfig.glow,
        ...style,
      }}
    >
      {/* Corner metadata tag  */}
      <span
        className="pointer-events-none absolute top-1 right-2 font-mono text-[10px] font-bold tracking-widest select-none"
        style={{ color: `${colorHex}50` }}
      >
        {levelConfig.name.toUpperCase()} • SYS.MOD
      </span>
      {children}
    </div>
  )
}
