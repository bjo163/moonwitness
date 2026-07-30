"use client"

import React from "react"
import Link from "next/link"
import { THEME_TOKENS, ThemeAccentColor } from "@core/tokens/theme-tokens"

export function Button({
  children,
  variant = "primary",
  accentColor = "system",
  onClick,
  href,
  className = "",
}: {
  children: React.ReactNode
  variant?: "primary" | "secondary" | "danger" | "ghost" | "console"
  accentColor?: ThemeAccentColor
  onClick?: () => void
  href?: string
  className?: string
}) {
  const colorHex =
    THEME_TOKENS.colors[accentColor] || THEME_TOKENS.colors.system

  const variantStyles: Record<string, React.CSSProperties> = {
    primary: {
      background: `${colorHex}15`,
      color: colorHex,
      borderWidth: 2,
      borderStyle: "solid",
      borderColor: `${colorHex}60`,
      boxShadow: `0 0 20px ${colorHex}35`,
    },
    secondary: {
      background: "#0A0F17",
      color: "#F5F5F5",
      borderWidth: 1,
      borderStyle: "solid",
      borderColor: `${colorHex}40`,
    },
    danger: {
      background: "rgba(255,0,85,0.08)",
      color: "#FF0055",
      borderWidth: 1,
      borderStyle: "solid",
      borderColor: "rgba(255,0,85,0.35)",
    },
    ghost: {
      background: "transparent",
      color: colorHex,
      borderWidth: 1,
      borderStyle: "solid",
      borderColor: "transparent",
    },
    console: {
      background: "#030508",
      color: colorHex,
      borderWidth: 1,
      borderStyle: "solid",
      borderColor: `${colorHex}60`,
    },
  }

  const content = (
    <span className="flex items-center gap-2 text-[10px] font-black tracking-widest uppercase sm:text-xs">
      {children}
    </span>
  )

  const combinedClass = `btn-primary btn-clip inline-flex items-center justify-center px-4 py-2 transition-all cursor-pointer ${className || ""}`

  if (href) {
    return (
      <Link
        href={href}
        className={combinedClass}
        style={{
          ...(variantStyles[variant] || variantStyles.primary),
          borderColor: `${colorHex}60`,
          color: colorHex,
        }}
      >
        {content}
      </Link>
    )
  }

  return (
    <button
      onClick={onClick}
      className={combinedClass}
      style={{
        ...(variantStyles[variant] || variantStyles.primary),
        borderColor: `${colorHex}60`,
        color: colorHex,
      }}
    >
      {content}
    </button>
  )
}
