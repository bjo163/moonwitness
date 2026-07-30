import React from "react"
import {
  Search,
  Users,
  BookOpen,
  Scroll,
  Map,
  Globe2,
  Telescope,
  Lightbulb,
  Book,
} from "lucide-react"
import { useKnowledgeGraph } from "../../hooks/use-knowledge-graph"

// Helper to map string icon names to Lucide components
const iconMap: Record<string, React.ElementType> = {
  Users, BookOpen, Scroll, Map, Globe2, Telescope, Lightbulb, Book
};

type EntityTypeItem = {
  id: string
  i: string
  col: string
  n: string
  c: number | string
}

export function GraphSidebarWidget() {
  const { data, loading } = useKnowledgeGraph();
  return (
    <div className="hide-scrollbar flex w-full shrink-0 flex-col gap-4 overflow-y-auto lg:w-64">
      {/* Search */}
      <div>
        <div className="mb-2 text-[9px] font-black tracking-widest text-primary uppercase">
          EXPLORE ENTITY
        </div>
        <div className="relative">
          <Search className="absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2 text-primary" />
          <input
            type="text"
            placeholder="Search anything..."
            className="bg-space w-full rounded-md border border-white/10 py-2 pr-8 pl-9 text-[10px] text-white transition-colors focus:border-primary focus:outline-none"
          />
          <div className="absolute top-1/2 right-2 -translate-y-1/2 rounded bg-white/10 px-1.5 py-0.5 text-[7px] text-primary">
            ⌘ K
          </div>
        </div>
      </div>

      {/* Entity Types */}
      <div>
        <div className="mb-2 text-[9px] font-black tracking-widest text-primary uppercase">
          ENTITY TYPES
        </div>
        <div className="space-y-1 text-[9px]">
          {loading ? (
            <div className="animate-pulse text-white/50 text-xs">Loading entities...</div>
          ) : (
            (data?.entityTypes as EntityTypeItem[] | undefined)?.map((et: EntityTypeItem) => {
              const IconComponent = iconMap[et.i] || Book;
              return (
                <div
                  key={et.id}
                  className="group flex cursor-pointer items-center justify-between rounded p-1.5 transition-colors hover:bg-white/5"
                >
                  <div className="flex items-center gap-2">
                    <IconComponent className={`h-3.5 w-3.5 opacity-90 transition-colors group-hover:text-white ${et.col}`} />
                    <span className="text-white/70 transition-colors group-hover:text-white">
                      {et.n}
                    </span>
                  </div>
                  <span className="font-mono text-primary group-hover:text-primary">
                    {et.c}
                  </span>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Quick Filters */}
      <div>
        <div className="mb-2 text-[9px] font-black tracking-widest text-primary uppercase">
          QUICK FILTERS
        </div>
        <div className="grid grid-cols-2 gap-1.5">
          <button className="rounded border border-primary/50 bg-primary/20 px-2 py-1.5 text-[9px] font-bold text-primary">
            Show All
          </button>
          <button className="bg-space rounded border border-white/10 px-2 py-1.5 text-[9px] font-bold text-primary transition-colors hover:border-white/30 hover:text-white">
            Revelation
          </button>
          <button className="bg-space rounded border border-white/10 px-2 py-1.5 text-[9px] font-bold text-primary transition-colors hover:border-white/30 hover:text-white">
            Timeline
          </button>
          <button className="bg-space rounded border border-white/10 px-2 py-1.5 text-[9px] font-bold text-primary transition-colors hover:border-white/30 hover:text-white">
            Science
          </button>
          <button className="bg-space rounded border border-white/10 px-2 py-1.5 text-[9px] font-bold text-primary transition-colors hover:border-white/30 hover:text-white">
            People
          </button>
          <button className="bg-space rounded border border-white/10 px-2 py-1.5 text-[9px] font-bold text-primary transition-colors hover:border-white/30 hover:text-white">
            Places
          </button>
        </div>
      </div>

      {/* Time Period */}
      <div>
        <div className="mb-2 text-[9px] font-black tracking-widest text-primary uppercase">
          TIME PERIOD
        </div>
        <div className="px-1">
          <div className="bg-space relative mb-2 h-1 rounded-full">
            <div className="absolute inset-y-0 right-[30%] left-[20%] rounded-full bg-primary" />
            <div className="absolute top-1/2 left-[20%] h-2.5 w-2.5 -translate-y-1/2 cursor-pointer rounded-full border border-primary bg-white shadow-[0_0_5px_#00F0FF]" />
            <div className="absolute top-1/2 right-[30%] h-2.5 w-2.5 -translate-y-1/2 cursor-pointer rounded-full border border-primary bg-white shadow-[0_0_5px_#00F0FF]" />
          </div>
          <div className="flex justify-between font-mono text-[8px] text-primary">
            <span>-4000</span>
            <span>0</span>
            <span>2025</span>
          </div>
        </div>
      </div>

      {/* Depth Level */}
      <div>
        <div className="mb-2 text-[9px] font-black tracking-widest text-primary uppercase">
          DEPTH LEVEL
        </div>
        <div className="flex overflow-hidden rounded border border-white/10 text-[9px] font-bold">
          <button className="bg-space flex-1 py-1.5 text-primary hover:bg-white/5">
            1
          </button>
          <button className="bg-space flex-1 border-l border-white/10 py-1.5 text-primary hover:bg-white/5">
            2
          </button>
          <button className="flex-1 border-l border-primary/30 bg-primary/20 py-1.5 text-primary">
            3
          </button>
          <button className="bg-space flex-1 border-l border-white/10 py-1.5 text-primary hover:bg-white/5">
            4
          </button>
          <button className="bg-space flex-1 border-l border-white/10 py-1.5 text-primary hover:bg-white/5">
            5
          </button>
        </div>
      </div>
    </div>
  )
}
