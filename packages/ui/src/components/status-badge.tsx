import * as React from "react"
import { cn } from "@workspace/ui/lib/utils"

export type StatusVariant =
  | "online"
  | "offline"
  | "active"
  | "inactive"
  | "pending"
  | "success"
  | "warning"
  | "destructive"
  | "error"
  | "info"
  | "primary"
  | "neutral"

export interface StatusDotProps extends React.HTMLAttributes<HTMLSpanElement> {
  status?: StatusVariant
  pulse?: boolean
  size?: "sm" | "default" | "lg"
}

const statusDotColors: Record<StatusVariant, string> = {
  online: "bg-success",
  active: "bg-success",
  success: "bg-success",
  warning: "bg-warning",
  pending: "bg-warning",
  destructive: "bg-destructive",
  error: "bg-destructive",
  offline: "bg-muted-foreground",
  inactive: "bg-muted-foreground",
  info: "bg-info",
  primary: "bg-primary",
  neutral: "bg-muted-foreground",
}

const statusDotSizes = {
  sm: "h-1.5 w-1.5",
  default: "h-2 w-2",
  lg: "h-2.5 w-2.5",
}

export function StatusDot({
  status = "neutral",
  pulse = false,
  size = "default",
  className,
  ...props
}: StatusDotProps) {
  const dotColor = statusDotColors[status] || statusDotColors.neutral
  const dotSize = statusDotSizes[size] || statusDotSizes.default

  return (
    <span
      className={cn(
        "inline-block shrink-0 rounded-full",
        dotSize,
        dotColor,
        pulse && "animate-pulse",
        className
      )}
      aria-hidden="true"
      {...props}
    />
  )
}

export interface StatusBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  status?: StatusVariant
  label?: React.ReactNode
  showDot?: boolean
  pulse?: boolean
  size?: "sm" | "default" | "lg"
}

const statusBadgeStyles: Record<StatusVariant, string> = {
  online: "border-success/30 bg-success/10 text-success",
  active: "border-success/30 bg-success/10 text-success",
  success: "border-success/30 bg-success/10 text-success",
  warning: "border-warning/30 bg-warning/10 text-warning",
  pending: "border-warning/30 bg-warning/10 text-warning",
  destructive: "border-destructive/30 bg-destructive/10 text-destructive",
  error: "border-destructive/30 bg-destructive/10 text-destructive",
  offline: "border-border bg-muted/50 text-muted-foreground",
  inactive: "border-border bg-muted/50 text-muted-foreground",
  info: "border-info/30 bg-info/10 text-info",
  primary: "border-primary/30 bg-primary/10 text-primary",
  neutral: "border-border bg-muted text-muted-foreground",
}

const statusBadgeSizes = {
  sm: "px-1.5 py-0.25 text-[10px]",
  default: "px-2 py-0.5 text-xs",
  lg: "px-2.5 py-1 text-xs",
}

export function StatusBadge({
  status = "neutral",
  label,
  showDot = false,
  pulse = false,
  size = "default",
  children,
  className,
  ...props
}: StatusBadgeProps) {
  const style = statusBadgeStyles[status] || statusBadgeStyles.neutral
  const sizeStyle = statusBadgeSizes[size] || statusBadgeSizes.default
  const content = children ?? label ?? status

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md border font-mono font-medium tracking-wide uppercase shadow-xs select-none",
        style,
        sizeStyle,
        className
      )}
      {...props}
    >
      {showDot && (
        <StatusDot
          status={status}
          pulse={pulse}
          size={size === "lg" ? "default" : "sm"}
        />
      )}
      <span>{content}</span>
    </span>
  )
}
