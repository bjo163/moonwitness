"use client"

import React from "react"

export function SectionTitle({
  title,
  subtitle,
}: {
  title: string
  subtitle?: string
}) {
  return (
    <div className="mb-6 border-b border-primary/20 pb-2">
      <h2 className="text-sm font-black tracking-widest text-foreground uppercase sm:text-lg">
        // {title}
      </h2>
      {subtitle && (
        <p className="mt-1 font-mono text-[10px] text-primary">{subtitle}</p>
      )}
    </div>
  )
}

export function Title({
  children,
  className = "",
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <h3
      className={`font-mono text-xs font-black tracking-widest text-foreground uppercase ${className}`}
    >
      {children}
    </h3>
  )
}

export function Text({
  children,
  className = "",
  variant = "body",
}: {
  children: React.ReactNode
  className?: string
  variant?: "body" | "muted" | "mono"
}) {
  const variants = {
    body: "font-sans text-sm text-foreground/90",
    muted: "font-sans text-xs text-foreground/60",
    mono: "font-mono text-[10px] text-primary",
  }

  return <p className={`${variants[variant]} ${className}`}>{children}</p>
}
