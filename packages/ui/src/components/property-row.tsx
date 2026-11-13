"use client"

import React from "react"
import { CopyButton } from "./copy-button"
import { cn } from "@workspace/ui/lib/utils"

export interface PropertyRowProps {
  label: React.ReactNode
  value: React.ReactNode
  icon?: React.ElementType
  copyableValue?: string
  badge?: React.ReactNode
  variant?: "default" | "stacked"
  className?: string
}

export function PropertyRow({
  label,
  value,
  icon: Icon,
  copyableValue,
  badge,
  variant = "default",
  className = "",
}: PropertyRowProps) {
  if (variant === "stacked") {
    return (
      <div className={cn("flex flex-col gap-1", className)}>
        <span className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
          {Icon && <Icon className="h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />}
          <span>{label}</span>
        </span>
        <div className="flex items-center gap-2">
          <span className="font-mono text-sm text-foreground">{value}</span>
          {badge}
          {copyableValue && (
            <CopyButton value={copyableValue} iconOnly className="h-6 w-6" />
          )}
        </div>
      </div>
    )
  }

  return (
    <div
      className={cn(
        "flex items-center justify-between gap-4 py-2 text-sm",
        className
      )}
    >
      <span className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
        {Icon && <Icon className="h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />}
        <span>{label}</span>
      </span>
      <div className="flex items-center gap-2 text-right">
        <span className="text-xs text-foreground">{value}</span>
        {badge}
        {copyableValue && (
          <CopyButton value={copyableValue} iconOnly className="h-6 w-6" />
        )}
      </div>
    </div>
  )
}

export interface PropertyListProps {
  children: React.ReactNode
  divided?: boolean
  className?: string
}

export function PropertyList({
  children,
  divided = true,
  className = "",
}: PropertyListProps) {
  return (
    <div
      className={cn(
        "w-full",
        divided && "divide-y divide-border",
        className
      )}
    >
      {children}
    </div>
  )
}
