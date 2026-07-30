"use client"

import React from "react"
import { Database, Loader2, XCircle, RefreshCw } from "lucide-react"

const DEFAULT_LOADING_LINES = 3
const BASE_SKELETON_WIDTH = 85
const SKELETON_STEP_WIDTH = 12
const SKELETON_DELAY_SEC = 0.15

export function EmptyState({
  title = "NO TELEMETRY DATA",
  description = "Waiting for satellite synchronization or signal connection...",
  icon: Icon = Database,
}: {
  title?: string
  description?: string
  icon?: React.ElementType
}) {
  return (
    <div className="panel-box bg-space flex min-h-[180px] flex-col items-center justify-center border border-primary/20 p-8 text-center">
      <div className="tag-clip mb-3 flex h-12 w-12 items-center justify-center border border-primary/40 bg-primary/10 text-primary">
        <Icon className="h-6 w-6 animate-pulse text-primary" />
      </div>
      <h4 className="mb-1 text-sm font-black tracking-widest text-foreground uppercase">
        // {title}
      </h4>
      <p className="max-w-sm font-mono text-[10px] text-primary">
        {description}
      </p>
      <div className="text-success mt-4 flex items-center gap-1.5 font-mono text-[10px]">
        <span className="bg-success h-1.5 w-1.5 animate-ping rounded-full" />
        <span>RECONNECTING TELEMETRY BUS...</span>
      </div>
    </div>
  )
}

export function LoadingState({
  title = "SYNCHRONIZING TELEMETRY",
  description = "Connecting to satellite uplink...",
  lines = DEFAULT_LOADING_LINES,
}: {
  title?: string
  description?: string
  lines?: number
}) {
  return (
    <div
      className="panel-box bg-space flex flex-col gap-4 border border-primary/20 p-6"
      role="status"
      aria-busy="true"
      aria-label={title}
    >
      <div className="flex items-center gap-3">
        <Loader2
          className="h-5 w-5 shrink-0 animate-spin text-primary"
          aria-hidden="true"
        />
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-black tracking-widest text-primary uppercase">
            // {title}
          </span>
          <span className="font-mono text-[9px] text-primary">
            {description}
          </span>
        </div>
        <div className="text-success ml-auto flex shrink-0 items-center gap-1 font-mono text-[8px]">
          <span
            className="bg-success h-1.5 w-1.5 animate-pulse rounded-full"
            aria-hidden="true"
          />
          <span>LIVE</span>
        </div>
      </div>

      <div className="space-y-2.5">
        {Array.from({ length: lines }).map((_, i) => (
          <div key={i} className="flex gap-2">
            <div
              className="h-3 animate-pulse border border-primary/15 bg-primary/10"
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

export function SkeletonCard() {
  return (
    <div
      className="panel-box bg-space flex min-h-[160px] flex-col gap-3 border border-primary/15 p-5"
      aria-hidden="true"
    >
      <div className="flex justify-between">
        <div className="h-4 w-20 animate-pulse border border-primary/15 bg-primary/10" />
        <div className="bg-primary/08 h-4 w-12 animate-pulse" />
      </div>
      <div className="flex items-center gap-2">
        <div className="h-9 w-9 shrink-0 animate-pulse bg-primary/10" />
        <div className="h-4 w-36 animate-pulse bg-primary/12" />
      </div>
      <div className="mt-1 space-y-1.5">
        <div className="bg-primary/08 h-2.5 w-full animate-pulse" />
        <div
          className="bg-primary/08 h-2.5 w-4/5 animate-pulse"
          style={{ animationDelay: "0.1s" }}
        />
      </div>
      <div className="mt-auto flex justify-between border-t border-primary/10 pt-3">
        <div className="bg-success/12 h-3 w-16 animate-pulse" />
        <div className="h-3 w-10 animate-pulse bg-primary/10" />
      </div>
    </div>
  )
}

export function ErrorState({
  title = "SIGNAL LOST",
  description = "Unable to retrieve telemetry. Please retry the operation.",
  onRetry,
  errorCode,
}: {
  title?: string
  description?: string
  onRetry?: () => void
  errorCode?: string
}) {
  return (
    <div
      className="panel-box border-danger/30 bg-space flex min-h-[180px] flex-col items-center justify-center gap-4 border p-8 text-center"
      style={{ boxShadow: "0 0 20px rgba(255,0,85,0.08)" }}
      role="alert"
      aria-live="assertive"
    >
      <div className="border-danger/40 bg-danger/10 tag-clip flex h-12 w-12 items-center justify-center border">
        <XCircle className="text-danger h-6 w-6" aria-hidden="true" />
      </div>

      <div className="space-y-1">
        <h4 className="text-danger text-sm font-black tracking-widest uppercase">
          // {title}
        </h4>
        {errorCode && (
          <p className="text-danger/60 font-mono text-[8px] font-bold">
            ERR: {errorCode}
          </p>
        )}
        <p className="max-w-sm font-mono text-[10px] leading-relaxed text-primary">
          {description}
        </p>
      </div>

      {onRetry && (
        <button
          onClick={onRetry}
          className="btn-primary btn-primary-ghost btn-clip border-danger/40 text-danger hover:border-danger hover:bg-danger/10 focus-visible:ring-danger flex items-center gap-2 px-4 py-2 text-xs focus-visible:ring-2 focus-visible:outline-none"
        >
          <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
          <span>[ RETRY CONNECTION ]</span>
        </button>
      )}
    </div>
  )
}
