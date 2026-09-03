"use client"

import React from "react"
import { cn } from "@workspace/ui/lib/utils"

export type ContextBlockVariant =
  | "default"
  | "primary"
  | "success"
  | "warning"
  | "destructive"

const VARIANT_BORDER_CLASSES: Record<ContextBlockVariant, string> = {
  default: "border-border",
  primary: "border-primary/40",
  success: "border-success/40",
  warning: "border-warning/40",
  destructive: "border-destructive/40",
}

const VARIANT_BADGE_CLASSES: Record<ContextBlockVariant, string> = {
  default: "border-border bg-muted/40 text-foreground",
  primary: "border-primary/30 bg-primary/10 text-primary",
  success: "border-success/30 bg-success/10 text-success",
  warning: "border-warning/30 bg-warning/10 text-warning",
  destructive: "border-destructive/30 bg-destructive/10 text-destructive",
}

function resolveContextVariant(variant?: ContextBlockVariant, accentColor?: string): ContextBlockVariant {
  if (variant && variant !== "default") return variant
  if (!accentColor) return "primary"
  if (accentColor === "danger" || accentColor === "destructive" || accentColor === "critical") return "destructive"
  if (accentColor === "warning") return "warning"
  if (accentColor === "success" || accentColor === "mission") return "success"
  return "primary"
}

export function ContextBlock({
  title,
  subtitle,
  operation,
  status = "ACTIVE",
  variant = "primary",
  accentColor,
  className,
}: {
  title: string
  subtitle?: string
  operation?: string
  status?: string
  variant?: ContextBlockVariant
  accentColor?: string
  className?: string
}) {
  const effectiveVariant = resolveContextVariant(variant, accentColor)
  const borderClass = VARIANT_BORDER_CLASSES[effectiveVariant] || VARIANT_BORDER_CLASSES.default
  const badgeClass = VARIANT_BADGE_CLASSES[effectiveVariant] || VARIANT_BADGE_CLASSES.default

  return (
    <div
      className={cn(
        "rounded-xl mb-6 border bg-card p-4 shadow-sm sm:p-5",
        borderClass,
        className
      )}
    >
      <div className="mb-2 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="rounded flex h-6 w-6 items-center justify-center border border-border bg-muted/40 text-xs font-bold text-primary">
            ●
          </div>
          <h1 className="text-base font-bold tracking-tight text-foreground sm:text-xl">
            {title}
          </h1>
        </div>

        <div className="flex items-center gap-2 font-mono text-[10px]">
          {operation && (
            <span className="text-primary">
              OP: <span className="font-bold text-foreground">{operation}</span>
            </span>
          )}
          <span className={cn("rounded border px-2 py-0.5 font-bold", badgeClass)}>
            ● {status}
          </span>
        </div>
      </div>

      {subtitle && (
        <p className="max-w-3xl font-sans text-xs leading-relaxed text-muted-foreground">
          {subtitle}
        </p>
      )}
    </div>
  )
}
