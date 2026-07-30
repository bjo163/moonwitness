import React from "react"
import {
  Search,
  ZoomIn,
  ZoomOut,
  Maximize,
  Plus,
  Minus,
  Target,
} from "lucide-react"
import { GraphSvgPrimaryNodes } from "./graph-svg-primary-nodes"
import { GraphSvgSecondaryNodes } from "./graph-svg-secondary-nodes"

export function GraphCanvasWidget() {
  return (
    <div className="bg-space relative flex flex-1 flex-col overflow-hidden rounded-xl border border-white/10">
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: "radial-gradient(#ffffff 1px, transparent 1px)",
          backgroundSize: "30px 30px",
        }}
      />

      <div className="relative flex h-full w-full flex-1 items-center justify-center">
        {/* SVG GRAPH SIMULATION */}
        <svg
          className="absolute inset-0 h-full w-full overflow-visible"
          viewBox="-500 -350 1000 700"
        >
          <GraphSvgPrimaryNodes />
          <GraphSvgSecondaryNodes />
        </svg>
      </div>

      {/* Bottom Toolbar */}
      <div className="bg-space/90 absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-4 rounded-lg border border-white/10 px-4 py-2 text-[10px] font-bold text-primary backdrop-blur">
        <div className="flex gap-2">
          <button className="rounded p-1.5 transition-colors hover:bg-white/10 hover:text-white">
            <Search className="h-4 w-4" />
          </button>
          <button className="rounded p-1.5 transition-colors hover:bg-white/10 hover:text-white">
            <ZoomIn className="h-4 w-4" />
          </button>
          <button className="rounded p-1.5 transition-colors hover:bg-white/10 hover:text-white">
            <ZoomOut className="h-4 w-4" />
          </button>
          <button className="rounded p-1.5 transition-colors hover:bg-white/10 hover:text-white">
            <Target className="h-4 w-4" />
          </button>
        </div>
        <div className="h-4 w-px bg-white/10" />
        <div className="font-sans tracking-wide text-white/50">
          Click on any node to explore connections
        </div>
        <div className="h-4 w-px bg-white/10" />
        <div className="flex items-center gap-3">
          <button className="hover:text-white">
            <Minus className="h-3.5 w-3.5" />
          </button>
          <span className="w-8 text-center font-mono text-white">100%</span>
          <button className="hover:text-white">
            <Plus className="h-3.5 w-3.5" />
          </button>
          <button className="ml-2 rounded bg-white/5 px-2 py-1 transition-colors hover:bg-white/10">
            Fit
          </button>
          <button className="p-1 hover:text-white">
            <Maximize className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
