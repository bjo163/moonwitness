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

export interface MetricCardProps {
  label?: string
  title?: string
  value: string | number
  detail?: string
  icon?: React.ElementType | React.ReactNode
  trend?: string
  href?: string
  action?: React.ReactNode
  variant?: StatVariant
  className?: string
}

export function MetricCard({
  label,
  title,
  value,
  detail,
  icon: Icon,
  trend,
  href,
  action,
  variant = "default",
  className = "",
}: MetricCardProps) {
  const displayLabel = title ?? label ?? ""
  const variantClass = VARIANT_BORDER_CLASSES[variant] || VARIANT_BORDER_CLASSES.default

  const content = (
    <div
      className={cn(
        "rounded-md border bg-card p-4 transition-colors text-card-foreground",
        variantClass,
        href && "hover:border-primary/50 cursor-pointer",
        className
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-medium text-muted-foreground">{displayLabel}</p>
        <div className="flex items-center gap-2">
          {action}
          {Icon && (
            <span className="flex size-8 items-center justify-center rounded-md border border-border bg-muted/40 text-primary">
              {React.isValidElement(Icon)
                ? Icon
                : React.createElement(Icon as React.ComponentType<{ className?: string; "aria-hidden"?: string }>, {
                    className: "size-4",
                    "aria-hidden": "true",
                  })}
            </span>
          )}
        </div>
      </div>
      <p className="mt-3 text-2xl font-semibold tracking-tight text-foreground">{value}</p>
      {(detail || trend) && (
        <div className="mt-1 flex items-center justify-between gap-2 text-xs text-muted-foreground">
          {detail && <span>{detail}</span>}
          {trend && <span className="font-medium text-success">{trend}</span>}
        </div>
      )}
    </div>
  )

  if (href) {
    return (
      <a href={href} className="block no-underline focus:outline-none">
        {content}
      </a>
    )
  }

  return content
}

