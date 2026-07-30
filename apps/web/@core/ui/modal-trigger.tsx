"use client"

import React from "react"
import { Maximize2 } from "lucide-react"

export function ModalTrigger({
  onClick,
  label = "EXPAND",
  icon: Icon = Maximize2,
  title,
  color,
  hideLabelOnMobile = false,
}: {
  onClick: () => void
  label?: string
  icon?: React.ElementType
  title?: string
  color?: string
  hideLabelOnMobile?: boolean
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      style={color ? { color, borderColor: color } : undefined}
      className="tag-clip flex items-center gap-1.5 border border-primary/30 bg-primary/10 px-2 py-1 text-primary transition-colors hover:bg-primary/20 hover:text-white"
    >
      <Icon className="h-3 w-3" />
      <span
        className={`font-mono text-[9px] font-bold tracking-widest uppercase ${hideLabelOnMobile ? "hidden sm:inline-block" : ""}`}
      >
        {label}
      </span>
    </button>
  )
}
