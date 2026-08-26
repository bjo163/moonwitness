"use client"
import { useMounted } from "@core/hooks"

import React, { useEffect, useState } from "react"
import { Command } from "lucide-react"
import { THEME_TOKENS, ThemeAccentColor } from "@core/tokens/theme-tokens"

export function CommandPaletteTrigger({
  accentColor = "system",
  onClick,
}: {
  accentColor?: ThemeAccentColor
  onClick?: () => void
}) {
  const mounted = useMounted()
  const colorHex = THEME_TOKENS.colors[accentColor]

  return (
    <button
      onClick={onClick}
      className="bg-space tag-clip group flex w-full max-w-sm items-center justify-between border border-primary/20 px-3 py-2 text-left transition-all hover:border-primary/40 hover:bg-primary/5 focus-visible:ring-2 focus-visible:outline-none"
      style={{
        boxShadow: `inset 0 0 10px ${colorHex}05`,
      }}
    >
      <div className="flex items-center gap-2">
        <Command
          className="h-4 w-4 transition-colors group-hover:animate-pulse"
          style={{ color: colorHex }}
        />
        <span className="font-mono text-xs tracking-widest text-primary/70 group-hover:text-primary">
          INITIATE COMMAND...
        </span>
      </div>
      {mounted && (
        <kbd className="tag-clip hidden items-center gap-1 border border-primary/30 bg-primary/10 px-2 py-0.5 font-mono text-[9px] text-primary sm:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      )}
    </button>
  )
}
