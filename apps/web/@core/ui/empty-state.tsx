import React from "react"
import { AlertCircle } from "lucide-react"

interface EmptyStateProps {
  icon?: React.ElementType
  title?: string
  message: string
  action?: React.ReactNode
  variant?: "default" | "danger" | "warning" | "success"
}

export function EmptyState({
  icon: Icon = AlertCircle,
  title = "NO DATA",
  message,
  action,
  variant = "default",
}: EmptyStateProps) {
  const variantStyles = {
    default: "border-cyan-500/20 text-cyan-500/50 bg-black/40",
    danger: "border-red-500/20 text-red-500/50 bg-red-950/20",
    warning: "border-amber-500/20 text-amber-500/50 bg-amber-950/20",
    success: "border-emerald-500/20 text-emerald-500/50 bg-emerald-950/20",
  }

  const iconColors = {
    default: "text-cyan-500/50",
    danger: "text-red-500/50",
    warning: "text-amber-500/50",
    success: "text-emerald-500/50",
  }

  return (
    <div
      className={`flex flex-col items-center justify-center rounded-2xl border ${variantStyles[variant]} min-h-[160px] animate-in p-8 text-center backdrop-blur-xl duration-500 fade-in zoom-in`}
    >
      <Icon className={`mb-3 h-10 w-10 ${iconColors[variant]} animate-pulse`} />
      {title && (
        <h3 className="mb-1 font-sans text-sm font-bold tracking-widest uppercase">
          {title}
        </h3>
      )}
      <p className="mx-auto max-w-sm font-mono text-xs leading-relaxed opacity-80">
        {message}
      </p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}
