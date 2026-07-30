"use client"

import React from "react"
import { THEME_TOKENS, ThemeAccentColor } from "@core/tokens/theme-tokens"

export function Badge({
  children,
  accentColor = "system",
  variant = "solid",
}: {
  children: React.ReactNode
  accentColor?: ThemeAccentColor
  variant?: "solid" | "outline"
}) {
  const colorHex = THEME_TOKENS.colors[accentColor]

  return (
    <span
      className={`tag-clip inline-flex items-center px-2 py-0.5 font-mono text-[9px] font-bold tracking-widest uppercase ${
        variant === "solid" ? "border-transparent" : "border bg-transparent"
      }`}
      style={{
        backgroundColor: variant === "solid" ? `${colorHex}20` : undefined,
        borderColor: variant === "outline" ? `${colorHex}50` : undefined,
        color: colorHex,
      }}
    >
      {children}
    </span>
  )
}
