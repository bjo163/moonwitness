"use client"

import React from "react"
import { THEME_TOKENS, ThemeAccentColor } from "@core/tokens/theme-tokens"

export function Tabs({
  tabs,
  activeTab,
  onChange,
  accentColor = "system",
}: {
  tabs: { id: string; label: string; icon?: React.ElementType }[]
  activeTab: string
  onChange: (id: string) => void
  accentColor?: ThemeAccentColor
}) {
  const colorHex = THEME_TOKENS.colors[accentColor]
  return (
    <div className="theme-scrollbar mb-4 flex items-center gap-1 overflow-x-auto border-b border-primary/20">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id
        const Icon = tab.icon
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`ui-clip-tab flex items-center gap-2 px-4 py-2 font-mono text-xs font-bold tracking-widest uppercase transition-all focus-visible:ring-2 focus-visible:outline-none ${
              isActive
                ? "bg-panel border-b-2 text-white"
                : "hover:bg-panel/50 border-b-2 border-transparent text-primary hover:text-white"
            } `}
            style={{
              borderColor: isActive ? colorHex : undefined,
              boxShadow: isActive
                ? `inset 0 -10px 20px -10px ${colorHex}40`
                : "none",
            }}
            role="tab"
            aria-selected={isActive}
          >
            {Icon && (
              <Icon
                className="h-3.5 w-3.5"
                style={{ color: isActive ? colorHex : "currentColor" }}
              />
            )}
            {tab.label}
          </button>
        )
      })}
    </div>
  )
}
