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
    <div className={`flex flex-col items-center justify-center rounded-2xl border ${variantStyles[variant]} p-8 backdrop-blur-xl text-center min-h-[160px] animate-in fade-in zoom-in duration-500`}>
      <Icon className={`h-10 w-10 mb-3 ${iconColors[variant]} animate-pulse`} />
      {title && (
        <h3 className="font-sans text-sm font-bold tracking-widest uppercase mb-1">
          {title}
        </h3>
      )}
      <p className="font-mono text-xs max-w-sm mx-auto leading-relaxed opacity-80">
        {message}
      </p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}
