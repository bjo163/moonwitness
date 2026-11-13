import { Network } from "lucide-react"
import { ContextBlock } from "@workspace/ui"
import { IntelligenceGraphCanvas } from "./intelligence-graph-canvas"
export type { GraphEdge, GraphNode } from "./intelligence-graph.types"
import type { GraphEdge, GraphNode } from "./intelligence-graph.types"

type IntelligenceGraphPresentationProps = {
  nodes: GraphNode[]
  edges: GraphEdge[]
  nodeCount: number
  edgeCount: number
}

export function IntelligenceGraphPresentation({
  nodes,
  edges,
  nodeCount,
  edgeCount,
}: IntelligenceGraphPresentationProps) {
  return (
    <>
      <ContextBlock
        title="INTELLIGENCE GRAPH (KNOWLEDGE WEB)"
        subtitle="Sistem pemetaan jaringan visual untuk melacak relasi intelektual, peristiwa sejarah, dan pusat peradaban umat. Hanya untuk observasi dan analisis (Read-Only)."
        operation="NEURAL-MAPPING"
        status="ONLINE"
        accentColor="primary"
      />

      <div className="relative flex h-[700px] flex-col overflow-hidden rounded-xl border-2 border-primary/50 bg-background shadow-sm">
        <div className="pointer-events-none absolute top-0 left-0 z-10 flex w-full items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <Network className="h-5 w-5 animate-pulse text-primary" />
            <div>
              <div className="text-[10px] font-bold tracking-widest text-primary/50">
                GRAPH DATABASE
              </div>
              <div className="font-mono text-xs font-bold text-primary">
                NODES: {nodeCount} | EDGES: {edgeCount}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 border border-primary/30 bg-card p-2 text-[10px] font-bold backdrop-blur-sm">
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-primary" /> TOKOH
            </span>
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-emerald-500" /> LOKASI
            </span>
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-rose-500" /> PERISTIWA
            </span>
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-amber-500" /> KONSEP
            </span>
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-primary" /> KITAB/SUMBER
            </span>
          </div>
        </div>

        <IntelligenceGraphCanvas nodes={nodes} edges={edges} />
      </div>
    </>
  )
}
