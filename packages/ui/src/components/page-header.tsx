"use client"

import React from "react"
import { cn } from "@workspace/ui/lib/utils"

export interface PageHeaderProps {
  eyebrow?: React.ReactNode
  title: React.ReactNode
  description?: React.ReactNode
  actions?: React.ReactNode
  status?: React.ReactNode
  bordered?: boolean
  className?: string
}

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
  status,
  bordered = true,
  className = "",
}: PageHeaderProps) {
  return (
    <header
      className={cn(
        "space-y-2 pb-4",
        bordered && "border-b border-border",
        className
      )}
    >
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div className="space-y-1">
          {eyebrow && (
            <p className="text-xs font-medium text-primary">
              {eyebrow}
            </p>
          )}
          <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            {title}
          </h1>
          {description && (
            <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground">
              {description}
            </p>
          )}
        </div>

        {(actions || status) && (
          <div className="flex items-center gap-3">
            {status}
            {actions}
          </div>
        )}
      </div>
    </header>
  )
}
