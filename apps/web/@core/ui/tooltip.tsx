"use client"

import React from "react"

export function Tooltip({
  children,
  text,
  position = "top",
}: {
  children: React.ReactNode
  text: string
  position?: "top" | "bottom" | "left" | "right"
}) {
  const posClasses = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
    left: "right-full top-1/2 -translate-y-1/2 mr-2",
    right: "left-full top-1/2 -translate-y-1/2 ml-2",
  }

  return (
    <div className="group relative inline-flex">
      {children}
      <div
        role="tooltip"
        className={`absolute ${posClasses[position]} bg-panel tag-clip pointer-events-none invisible z-[100] border border-primary/30 px-2 py-1 font-mono text-[9px] tracking-wider whitespace-nowrap text-foreground uppercase opacity-0 shadow-[0_0_10px_rgba(0,240,255,0.15)] transition-all duration-200 group-hover:visible group-hover:opacity-100`}
      >
        {text}
      </div>
    </div>
  )
}
