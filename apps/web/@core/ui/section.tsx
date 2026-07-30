"use client"

import React from "react"

/**
 * SectionBadge — Reusable section number + label badge
 * Used at the top of every OS section to match Blueprint styling.
 *
 * Example: <SectionBadge number="02" label="THE MOONWITNESS KNOWLEDGE FRAMEWORK" />
 */
export function SectionBadge({
  number,
  label,
  color = "cyan",
}: {
  number: string
  label: string
  color?: "cyan" | "teal" | "amber" | "purple" | "red" | "emerald" | "white"
}) {
  const colorMap = {
    cyan: {
      bg: "bg-cyan-950/60",
      border: "border-primary",
      text: "text-primary",
      badgeBg: "bg-cyan-400",
      shadow: "shadow-[0_0_15px_rgba(0,240,255,0.3)]",
    },
    teal: {
      bg: "bg-space",
      border: "border-teal-500/60",
      text: "text-teal-300",
      badgeBg: "bg-teal-500",
      shadow: "shadow-[0_0_15px_rgba(20,184,166,0.3)]",
    },
    amber: {
      bg: "bg-amber-950/60",
      border: "border-amber-400",
      text: "text-amber-300",
      badgeBg: "bg-amber-400",
      shadow: "shadow-[0_0_15px_rgba(245,158,11,0.3)]",
    },
    purple: {
      bg: "bg-purple-950/60",
      border: "border-purple-400",
      text: "text-purple-300",
      badgeBg: "bg-purple-400",
      shadow: "shadow-[0_0_15px_rgba(168,85,247,0.3)]",
    },
    red: {
      bg: "bg-red-950/60",
      border: "border-red-400",
      text: "text-red-300",
      badgeBg: "bg-red-400",
      shadow: "shadow-[0_0_15px_rgba(239,68,68,0.3)]",
    },
    emerald: {
      bg: "bg-emerald-950/60",
      border: "border-emerald-400",
      text: "text-emerald-300",
      badgeBg: "bg-emerald-400",
      shadow: "shadow-[0_0_15px_rgba(16,185,129,0.3)]",
    },
    white: {
      bg: "bg-white/5",
      border: "border-white/40",
      text: "text-white",
      badgeBg: "bg-white",
      shadow: "shadow-[0_0_15px_rgba(255,255,255,0.2)]",
    },
  }
  const c = colorMap[color]

  return (
    <div
      className={`inline-flex items-center gap-3 px-3.5 py-1.5 ${c.bg} border-2 ${c.border} ${c.text} btn-clip text-xs font-black tracking-[0.25em] uppercase ${c.shadow}`}
    >
      <span
        className={`px-1.5 py-0.5 ${c.badgeBg} tag-clip font-black text-black`}
      >
        {number}
      </span>
      <span>{label}</span>
    </div>
  )
}

/**
 * Section — Reusable section wrapper with consistent styling
 * Provides the standard deep-space background, grid overlay, and container max-width.
 *
 * Example:
 * <Section id="knowledge-framework" borderColor="cyan">
 *   {children}
 * </Section>
 */
export function Section({
  id,
  children,
  className = "",
  borderColor = "cyan",
  noPadding = false,
}: {
  id: string
  children: React.ReactNode
  className?: string
  borderColor?: "cyan" | "teal" | "amber" | "purple" | "white"
  noPadding?: boolean
}) {
  const borderMap = {
    cyan: "border-cyan-500/25",
    teal: "border-teal-500/25",
    amber: "border-amber-500/25",
    purple: "border-purple-500/25",
    white: "border-white/10",
  }

  return (
    <section
      id={id}
      className={`relative ${noPadding ? "" : "py-16 sm:py-24"} bg-space z-10 border-b font-mono text-foreground ${borderMap[borderColor]} overflow-hidden ${className}`}
    >
      {/* Deep space background effects */}
      <div className="pointer-events-none absolute inset-0">
        <div className="theme-grid-bg absolute inset-0 opacity-20" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,240,255,0.01)_1px,transparent_1px)] bg-[size:100%_4px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 sm:px-10">
        {children}
      </div>
    </section>
  )
}
