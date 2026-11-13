import * as React from "react"
import { cn } from "@workspace/ui/lib/utils"
import { StatusDot, type StatusVariant } from "./status-badge"

export interface TimelineProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

export function Timeline({ children, className, ...props }: TimelineProps) {
  return (
    <div
      role="feed"
      aria-busy="false"
      className={cn("relative space-y-4 font-sans", className)}
      {...props}
    >
      {children}
    </div>
  )
}

export interface TimelineItemProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  date?: React.ReactNode
  time?: React.ReactNode
  title: React.ReactNode
  description?: React.ReactNode
  icon?: React.ReactNode
  tag?: React.ReactNode
  status?: StatusVariant
  active?: boolean
}

export function TimelineItem({
  date,
  time,
  title,
  description,
  icon,
  tag,
  status,
  active,
  children,
  className,
  ...props
}: TimelineItemProps) {
  return (
    <div
      className={cn(
        "group relative flex items-start gap-3 text-left transition-colors",
        className
      )}
      {...props}
    >
      {/* Date & Time Column (optional) */}
      {(date || time) && (
        <div className="w-16 shrink-0 pt-0.5 text-right">
          {date && (
            <div className="text-[11px] font-semibold text-foreground">
              {date}
            </div>
          )}
          {time && (
            <div className="font-mono text-[10px] text-muted-foreground">
              {time}
            </div>
          )}
        </div>
      )}

      {/* Node Icon / Dot */}
      <div className="relative z-10 flex shrink-0 items-center justify-center">
        {icon ? (
          <div
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-md border border-border bg-card text-foreground shadow-xs transition-colors group-hover:border-primary/40",
              active && "border-primary/50 text-primary"
            )}
          >
            {icon}
          </div>
        ) : (
          <div className="flex h-6 w-6 items-center justify-center">
            <StatusDot status={status || (active ? "primary" : "neutral")} pulse={active} />
          </div>
        )}
      </div>

      {/* Content Card */}
      <div className="min-w-0 flex-1 rounded-md border border-border bg-card p-3 shadow-xs transition-colors group-hover:border-border/80">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="font-sans text-xs font-semibold text-foreground">
            {title}
          </div>
          {tag && (
            <div className="rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
              {tag}
            </div>
          )}
        </div>

        {description && (
          <div className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
            {description}
          </div>
        )}

        {children && <div className="mt-2">{children}</div>}
      </div>
    </div>
  )
}
