"use client"

import React from "react"
import { AlertCircle, CheckCircle, Info, AlertTriangle } from "lucide-react"

export function Alert({
  title,
  children,
  variant = "info",
}: {
  title?: string
  children: React.ReactNode
  variant?: "info" | "warning" | "error" | "success"
}) {
  const styles = {
    info: {
      bg: "bg-primary/10",
      border: "border-primary/30",
      text: "text-primary",
      icon: Info,
    },
    warning: {
      bg: "bg-[#FFB000]/10",
      border: "border-[#FFB000]/30",
      text: "text-[#FFB000]",
      icon: AlertTriangle,
    },
    error: {
      bg: "bg-danger/10",
      border: "border-danger/30",
      text: "text-danger",
      icon: AlertCircle,
    },
    success: {
      bg: "bg-success/10",
      border: "border-success/30",
      text: "text-success",
      icon: CheckCircle,
    },
  }

  const activeStyle = styles[variant]
  const Icon = activeStyle.icon

  return (
    <div
      className={`panel-box mb-4 flex gap-3 border p-4 ${activeStyle.bg} ${activeStyle.border}`}
    >
      <Icon className={`h-5 w-5 shrink-0 ${activeStyle.text}`} />
      <div className="flex flex-col gap-1">
        {title && (
          <h5
            className={`font-mono text-[10px] font-bold tracking-widest uppercase ${activeStyle.text}`}
          >
            {title}
          </h5>
        )}
        <div className="font-sans text-xs text-foreground/80">{children}</div>
      </div>
    </div>
  )
}
