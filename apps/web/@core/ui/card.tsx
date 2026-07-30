"use client"

import React from "react"

export function Card({
  children,
  className = "",
  hoverEffect = false,
}: {
  children: React.ReactNode
  className?: string
  hoverEffect?: boolean
}) {
  return (
    <div
      className={`panel-box bg-panel border border-primary/20 p-4 transition-all duration-300 ${
        hoverEffect ? "hover:bg-panel/80 hover:border-primary/40" : ""
      } ${className}`}
    >
      {children}
    </div>
  )
}
