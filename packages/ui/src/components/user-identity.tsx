import * as React from "react"
import { cn } from "@workspace/ui/lib/utils"
import { StatusDot, type StatusVariant } from "./status-badge"

export interface UserIdentityProps {
  name: string
  subtitle?: React.ReactNode
  avatarUrl?: string
  avatarFallback?: string
  fallbackText?: string
  avatarEmoji?: string
  status?: StatusVariant
  badge?: React.ReactNode
  size?: "sm" | "default" | "lg"
  className?: string
  onClick?: () => void
}

const avatarSizes = {
  sm: "h-7 w-7 text-xs",
  default: "h-8 w-8 text-xs",
  lg: "h-10 w-10 text-sm",
}

const nameSizes = {
  sm: "text-xs font-medium",
  default: "text-xs font-semibold",
  lg: "text-sm font-semibold",
}

const subtitleSizes = {
  sm: "text-[10px]",
  default: "text-[11px]",
  lg: "text-xs",
}

export function UserIdentity({
  name,
  subtitle,
  avatarUrl,
  avatarFallback,
  fallbackText,
  avatarEmoji,
  status,
  badge,
  size = "default",
  className,
  onClick,
}: UserIdentityProps) {
  const fallback = avatarFallback || fallbackText || (name ? name.charAt(0).toUpperCase() : "?")

  const content = (
    <div
      className={cn(
        "flex items-center gap-2.5 text-left",
        onClick && "cursor-pointer select-none transition-opacity hover:opacity-80",
        className
      )}
      onClick={onClick}
    >
      {/* Avatar Container */}
      <div className="relative shrink-0">
        <div
          className={cn(
            "flex items-center justify-center overflow-hidden rounded-full border border-border bg-muted font-mono font-bold text-foreground",
            avatarSizes[size]
          )}
        >
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={name}
              className="h-full w-full object-cover"
            />
          ) : avatarEmoji ? (
            <span className="text-sm select-none" role="img" aria-label={name}>
              {avatarEmoji}
            </span>
          ) : (
            <span>{fallback}</span>
          )}
        </div>

        {status && (
          <span className="absolute -bottom-0.5 -right-0.5 rounded-full border-2 border-background">
            <StatusDot status={status} size="sm" />
          </span>
        )}
      </div>

      {/* Info Container */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <span className={cn("truncate text-foreground", nameSizes[size])}>
            {name}
          </span>
          {badge}
        </div>
        {subtitle && (
          <div className={cn("truncate text-muted-foreground", subtitleSizes[size])}>
            {subtitle}
          </div>
        )}
      </div>
    </div>
  )

  return content
}
