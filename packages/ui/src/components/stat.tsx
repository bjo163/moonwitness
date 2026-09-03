import React from "react"
import { cn } from "@workspace/ui/lib/utils"

export type StatVariant = "default" | "primary" | "success" | "warning" | "destructive"

const VARIANT_BORDER_CLASSES: Record<StatVariant, string> = {
  default: "border-border",
  primary: "border-primary/40 text-primary",
  success: "border-success/40 text-success",
  warning: "border-warning/40 text-warning",
  destructive: "border-destructive/40 text-destructive",
}

function resolveStatVariant(variant?: StatVariant, accentColor?: string): StatVariant {
  if (variant && variant !== "default") return variant
  if (!accentColor) return "default"
  if (accentColor === "danger" || accentColor === "destructive" || accentColor === "accent") return "destructive"
  if (accentColor === "warning" || accentColor === "knowledge") return "warning"
  if (accentColor === "success" || accentColor === "mission") return "success"
  return "primary"
}

export interface StatProps {
  label: string
  value: string | number
  trend?: string
  icon?: React.ElementType
  variant?: StatVariant
  accentColor?: string
  className?: string
}

export function Stat({
  label,
  value,
  trend,
  icon: Icon,
  variant = "default",
  accentColor,
  className = "",
}: StatProps) {
  const effectiveVariant = resolveStatVariant(variant, accentColor)

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl border bg-card p-3.5 shadow-sm transition-colors text-card-foreground",
        VARIANT_BORDER_CLASSES[effectiveVariant],
        className
      )}
    >
      <div className="flex items-center justify-between">
        <span className="font-sans text-xs font-medium text-muted-foreground uppercase tracking-wider">
          {label}
        </span>
        {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
      </div>
      <div className="mt-2 flex items-baseline justify-between">
        <span className="font-mono text-xl font-bold text-foreground">
          {value}
        </span>
        {trend && (
          <span className="font-mono text-xs font-semibold text-success">
            {trend}
          </span>
        )}
      </div>
    </div>
  )
}
