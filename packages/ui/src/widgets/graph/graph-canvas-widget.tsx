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
import { Button } from "../../components/button"

export function GraphCanvasWidget() {
  return (
    <div className="bg-background relative flex flex-1 flex-col overflow-hidden rounded-xl border border-white/10">
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
      <div className="bg-background/90 absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-4 rounded-lg border border-white/10 px-4 py-2 text-[10px] font-bold text-primary backdrop-blur">
        <div className="flex gap-2">
          <Button type="button" variant="ghost" aria-label="Search graph" className="rounded p-1.5 transition-colors hover:bg-white/10 hover:text-white">
            <Search className="h-4 w-4" />
          </Button>
          <Button type="button" variant="ghost" aria-label="Zoom in" className="rounded p-1.5 transition-colors hover:bg-white/10 hover:text-white">
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button type="button" variant="ghost" aria-label="Zoom out" className="rounded p-1.5 transition-colors hover:bg-white/10 hover:text-white">
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Button type="button" variant="ghost" aria-label="Center graph" className="rounded p-1.5 transition-colors hover:bg-white/10 hover:text-white">
            <Target className="h-4 w-4" />
          </Button>
        </div>
        <div className="h-4 w-px bg-white/10" />
        <div className="font-sans tracking-wide text-white/50">
          Click on any node to explore connections
        </div>
        <div className="h-4 w-px bg-white/10" />
        <div className="flex items-center gap-3">
          <Button type="button" variant="ghost" aria-label="Decrease zoom" className="hover:text-white">
            <Minus className="h-3.5 w-3.5" />
          </Button>
          <span className="w-8 text-center font-mono text-white">100%</span>
          <Button type="button" variant="ghost" aria-label="Increase zoom" className="hover:text-white">
            <Plus className="h-3.5 w-3.5" />
          </Button>
          <Button type="button" variant="ghost" className="ml-2 rounded bg-white/5 px-2 py-1 transition-colors hover:bg-white/10">
            Fit
          </Button>
          <Button type="button" variant="ghost" aria-label="Maximize graph" className="p-1 hover:text-white">
            <Maximize className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
