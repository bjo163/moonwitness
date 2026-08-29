"use client"

import React from "react"
import { cn } from "@workspace/ui/lib/utils"
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
  const accentClasses: Record<ThemeAccentColor, string> = {
    destructive: "text-destructive",
    primary: "text-primary",
    secondary: "text-secondary-foreground",
    success: "text-success",
    warning: "text-warning",
    danger: "text-destructive",
    info: "text-primary",
    muted: "text-muted-foreground",
    accent: "text-accent-foreground",
    system: "text-primary",
    mission: "text-success",
    celestial: "text-warning",
    knowledge: "text-accent-foreground",
    knowledgeLight: "text-accent-foreground",
    critical: "text-destructive",
    textPrimary: "text-foreground",
    textMuted: "text-muted-foreground",
    background: "text-foreground",
    panelBg: "text-foreground",
    panelBorder: "text-primary",
  }
  const accentClass = accentClasses[accentColor] || accentClasses.system

  return (
    <div
      className="mb-4 border-b pb-3"
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          {Icon ? (
            <div
              className={cn(
                "flex h-7 w-7 items-center justify-center rounded-md border bg-muted",
                accentClass
              )}
            >
              <Icon className="h-3.5 w-3.5" aria-hidden="true" />
            </div>
          ) : (
            <span className="text-success text-xs font-bold">◉</span>
          )}
          <h3
            className={cn(
              "text-sm font-semibold tracking-tight text-foreground uppercase sm:text-base",
              accentClass
            )}
          >
            {title}
          </h3>
        </div>

        <div className="flex items-center gap-1.5 font-mono text-[10px] font-bold">
          <span className={cn("h-1.5 w-1.5 rounded-full bg-current", accentClass)} />
          <span className={accentClass}>STATUS {status}</span>
        </div>
      </div>

      {subtitle && (
        <p className="mt-1 text-sm leading-normal text-muted-foreground">
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
  const accentClasses: Record<ThemeAccentColor, string> = {
    destructive: "border-destructive/30",
    primary: "border-primary/30",
    secondary: "border-secondary/40",
    success: "border-success/30",
    warning: "border-warning/30",
    danger: "border-destructive/30",
    info: "border-primary/30",
    muted: "border-border",
    accent: "border-accent/40",
    system: "border-primary/30",
    mission: "border-success/30",
    celestial: "border-warning/30",
    knowledge: "border-accent/40",
    knowledgeLight: "border-accent/40",
    critical: "border-destructive/30",
    textPrimary: "border-border",
    textMuted: "border-border",
    background: "border-border",
    panelBg: "border-border",
    panelBorder: "border-primary/30",
  }

  return (
    <div
      className={cn(
        "relative rounded-xl border bg-card text-card-foreground shadow-sm transition-colors",
        levelConfig.padding,
        accentClasses[accentColor] || accentClasses.system,
        className
      )}
      style={style}
    >
      {children}
    </div>
  )
}
