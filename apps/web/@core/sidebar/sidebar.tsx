"use client"

import React from "react"
import { ChevronLeft, Menu } from "lucide-react"

export function Sidebar({
  items,
  activeId,
  onSelect,
  isExpanded = true,
  onToggle,
}: {
  items: { id: string; label: string; icon: React.ElementType }[]
  activeId: string
  onSelect: (id: string) => void
  isExpanded?: boolean
  onToggle?: () => void
}) {
  return (
    <aside
      className={`panel-box bg-space flex flex-col border border-primary/20 transition-all duration-300 ${isExpanded ? "w-64" : "w-14"} `}
    >
      {onToggle && (
        <div className="flex justify-end border-b border-primary/20 p-3">
          <button
            onClick={onToggle}
            className="tag-clip p-1 text-primary transition-colors hover:bg-primary/10"
          >
            {isExpanded ? (
              <ChevronLeft className="h-4 w-4" />
            ) : (
              <Menu className="h-4 w-4" />
            )}
          </button>
        </div>
      )}
      <nav className="theme-scrollbar flex flex-1 flex-col gap-1 overflow-y-auto py-2">
        {items.map((item) => {
          const isActive = activeId === item.id
          const Icon = item.icon
          return (
            <button
              key={item.id}
              onClick={() => onSelect(item.id)}
              className={`tag-clip mx-2 flex items-center gap-3 px-4 py-3 text-left font-mono text-[10px] tracking-widest uppercase transition-all ${
                isActive
                  ? "border border-primary/30 bg-primary/15 text-primary"
                  : "border border-transparent text-primary hover:bg-primary/5 hover:text-white"
              } `}
              style={
                isActive
                  ? { boxShadow: "inset 0 0 10px rgba(0,240,255,0.1)" }
                  : {}
              }
              title={!isExpanded ? item.label : undefined}
            >
              <Icon
                className={`h-4 w-4 shrink-0 ${isActive ? "text-primary" : ""}`}
              />
              {isExpanded && <span className="truncate">{item.label}</span>}
            </button>
          )
        })}
      </nav>
    </aside>
  )
}
