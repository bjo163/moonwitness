"use client"

import React from "react"
import { cn } from "@workspace/ui/lib/utils"

export type PanelVariant =
  | "default"
  | "primary"
  | "secondary"
  | "success"
  | "warning"
  | "destructive"
  | "muted"

export type PanelPadding = "none" | "sm" | "md" | "lg" | "xl"

const VARIANT_BORDER_CLASSES: Record<PanelVariant, string> = {
  default: "border-border",
  primary: "border-primary/40",
  secondary: "border-secondary",
  success: "border-success/40",
  warning: "border-warning/40",
  destructive: "border-destructive/40",
  muted: "border-muted",
}

const VARIANT_TEXT_CLASSES: Record<PanelVariant, string> = {
  default: "text-foreground",
  primary: "text-primary",
  secondary: "text-secondary-foreground",
  success: "text-success",
  warning: "text-warning",
  destructive: "text-destructive",
  muted: "text-muted-foreground",
}

const PADDING_CLASSES: Record<PanelPadding, string> = {
  none: "p-0",
  sm: "p-3 sm:p-4",
  md: "p-4 sm:p-5",
  lg: "p-6 sm:p-8",
  xl: "p-8 sm:p-10",
}

function resolveVariant(variant?: PanelVariant, accentColor?: string): PanelVariant {
  if (variant && variant !== "default") return variant
  if (!accentColor) return "default"
  if (accentColor === "danger" || accentColor === "destructive" || accentColor === "critical") return "destructive"
  if (accentColor === "warning" || accentColor === "celestial") return "warning"
  if (accentColor === "success" || accentColor === "mission") return "success"
  if (accentColor === "secondary") return "secondary"
  if (accentColor === "muted") return "muted"
  return "primary"
}

export function PanelHeader({
  title,
  status = "ACTIVE",
  icon: Icon,
  variant = "default",
  accentColor,
  subtitle,
  className,
}: {
  title: string
  status?: string
  icon?: React.ElementType
  variant?: PanelVariant
  accentColor?: string
  subtitle?: string
  className?: string
}) {
  const effectiveVariant = resolveVariant(variant, accentColor)
  const textClass = VARIANT_TEXT_CLASSES[effectiveVariant] || VARIANT_TEXT_CLASSES.default

  return (
    <div className={cn("mb-4 border-b border-border pb-3", className)}>
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          {Icon ? (
            <div className={cn("flex h-7 w-7 items-center justify-center rounded-md border border-border bg-muted", textClass)}>
              <Icon className="h-3.5 w-3.5" aria-hidden="true" />
            </div>
          ) : (
            <span className="text-xs font-bold text-success">●</span>
          )}
          <h3 className={cn("text-sm font-semibold tracking-tight text-foreground sm:text-base", textClass)}>
            {title}
          </h3>
        </div>

        <div className="flex items-center gap-1.5 font-mono text-[10px] font-medium">
          <span className={cn("h-1.5 w-1.5 rounded-full bg-current", textClass)} />
          <span className={textClass}>{status}</span>
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
  variant = "default",
  accentColor,
  level,
  padding = "md",
  className = "",
  style = {},
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  children: React.ReactNode
  variant?: PanelVariant
  accentColor?: string
  level?: string
  padding?: PanelPadding
}) {
  const effectiveVariant = resolveVariant(variant, accentColor)

  return (
    <div
      className={cn(
        "relative rounded-xl border bg-card text-card-foreground shadow-sm transition-colors",
        PADDING_CLASSES[padding],
        VARIANT_BORDER_CLASSES[effectiveVariant],
        className
      )}
      style={style}
      {...props}
    >
      {children}
    </div>
  )
}
