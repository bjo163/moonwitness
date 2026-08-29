"use client"

import React from "react"

export function Divider({ className = "" }: { className?: string }) {
  return (
    <div className={`my-6 flex items-center justify-center ${className}`}>
      <div className="h-px w-full bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      <div className="rounded-md mx-2 h-2 w-2 bg-primary/40" />
      <div className="h-px w-full bg-gradient-to-r from-primary/30 via-primary/30 to-transparent" />
    </div>
  )
}
