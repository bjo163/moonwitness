"use client"

import React from "react"
import { AlertCircle, Inbox, Loader2, RefreshCw } from "lucide-react"
import { cn } from "@workspace/ui/lib/utils"

const DEFAULT_LOADING_LINES = 3
const BASE_SKELETON_WIDTH = 85
const SKELETON_STEP_WIDTH = 12
const SKELETON_DELAY_SEC = 0.15

export function EmptyState({
  title = "No data available",
  description = "There are no records to display at this time.",
  icon: Icon = Inbox,
  action,
  className,
}: {
  title?: string
  description?: string
  icon?: React.ElementType
  action?: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        "flex min-h-[180px] flex-col items-center justify-center rounded-md border border-border bg-card p-8 text-center text-card-foreground",
        className
      )}
    >
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-md border border-border bg-muted/50 text-muted-foreground">
        <Icon className="h-5 w-5" aria-hidden="true" />
      </div>
      <h3 className="text-sm font-semibold text-foreground">
        {title}
      </h3>
      <p className="mt-1 max-w-sm text-xs leading-relaxed text-muted-foreground">
        {description}
      </p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}

export function LoadingState({
  title = "Loading data",
  description = "Retrieving information from sources...",
  lines = DEFAULT_LOADING_LINES,
  className,
}: {
  title?: string
  description?: string
  lines?: number
  className?: string
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 rounded-md border border-border bg-card p-6 text-card-foreground",
        className
      )}
      role="status"
      aria-busy="true"
      aria-label={title}
    >
      <div className="flex items-center gap-3">
        <Loader2
          className="h-4 w-4 shrink-0 animate-spin text-primary"
          aria-hidden="true"
        />
        <div className="flex flex-col">
          <span className="text-xs font-semibold text-foreground">
            {title}
          </span>
          <span className="text-xs text-muted-foreground">
            {description}
          </span>
        </div>
      </div>

      <div className="space-y-2 pt-2">
        {Array.from({ length: lines }).map((_, i) => (
          <div key={i} className="flex">
            <div
              className="h-2.5 animate-pulse rounded-sm bg-muted"
              style={{
                width: `${BASE_SKELETON_WIDTH - i * SKELETON_STEP_WIDTH}%`,
                animationDelay: `${i * SKELETON_DELAY_SEC}s`,
              }}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex min-h-[140px] flex-col justify-between rounded-md border border-border bg-card p-5 text-card-foreground",
        className
      )}
      aria-hidden="true"
    >
      <div className="flex items-center justify-between">
        <div className="h-3 w-24 animate-pulse rounded-sm bg-muted" />
        <div className="h-4 w-4 animate-pulse rounded-sm bg-muted" />
      </div>
      <div className="space-y-2 py-3">
        <div className="h-6 w-32 animate-pulse rounded-sm bg-muted" />
        <div className="h-2.5 w-48 animate-pulse rounded-sm bg-muted/60" />
      </div>
      <div className="border-t border-border pt-3">
        <div className="h-2.5 w-20 animate-pulse rounded-sm bg-muted/40" />
      </div>
    </div>
  )
}

export function ErrorState({
  title = "Unable to load data",
  description = "A connection or source error occurred. Please try again.",
  onRetry,
  errorCode,
  className,
}: {
  title?: string
  description?: string
  onRetry?: () => void
  errorCode?: string
  className?: string
}) {
  return (
    <div
      className={cn(
        "flex min-h-[180px] flex-col items-center justify-center gap-3 rounded-md border border-destructive/30 bg-destructive/5 p-8 text-center",
        className
      )}
      role="alert"
      aria-live="assertive"
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-md border border-destructive/30 bg-destructive/10 text-destructive">
        <AlertCircle className="h-5 w-5" aria-hidden="true" />
      </div>

      <div className="space-y-1">
        <h3 className="text-sm font-semibold text-destructive">
          {title}
        </h3>
        {errorCode && (
          <p className="font-mono text-xs text-muted-foreground">
            Error code: {errorCode}
          </p>
        )}
        <p className="max-w-sm text-xs leading-relaxed text-muted-foreground">
          {description}
        </p>
      </div>

      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-2 inline-flex items-center gap-2 rounded-md border border-border bg-card px-3.5 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-accent"
        >
          <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
          <span>Retry</span>
        </button>
      )}
    </div>
  )
}

export type StatusNoticeVariant =
  | "destructive"
  | "error"
  | "success"
  | "warning"
  | "info"
  | "neutral"

export interface StatusNoticeProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  message?: React.ReactNode
  variant?: StatusNoticeVariant
  title?: React.ReactNode
  action?: React.ReactNode
  icon?: React.ReactNode
}

const statusNoticeStyles: Record<StatusNoticeVariant, string> = {
  destructive: "border-destructive/30 bg-destructive/10 text-destructive",
  error: "border-destructive/30 bg-destructive/10 text-destructive",
  success: "border-success/30 bg-success/10 text-success",
  warning: "border-warning/30 bg-warning/10 text-warning",
  info: "border-info/30 bg-info/10 text-info",
  neutral: "border-border bg-muted/60 text-muted-foreground",
}

export function StatusNotice({
  message,
  title,
  variant = "info",
  action,
  icon,
  children,
  className,
  role,
  ...props
}: StatusNoticeProps) {
  const style = statusNoticeStyles[variant] || statusNoticeStyles.info
  const content = children ?? message
  const computedRole = role ?? (variant === "destructive" || variant === "error" ? "alert" : "status")

  return (
    <div
      role={computedRole}
      className={cn(
        "flex items-start justify-between gap-3 rounded-md border p-3 text-sm",
        style,
        className
      )}
      {...props}
    >
      <div className="flex items-start gap-2.5">
        {icon && <span className="mt-0.5 shrink-0">{icon}</span>}
        <div>
          {title && <div className="font-semibold text-foreground">{title}</div>}
          {content && <div className={cn(title && "mt-0.5 text-xs opacity-90")}>{content}</div>}
        </div>
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  )
}

export function ErrorNotice({
  message = "Content is temporarily unavailable.",
  className,
  children,
}: {
  message?: React.ReactNode
  className?: string
  children?: React.ReactNode
}) {
  return (
    <StatusNotice
      variant="destructive"
      message={children ?? message}
      className={className}
    />
  )
}

