import Image from "next/image"
import { resolveVisualizationColor } from "@workspace/ui"
import { KNOWLEDGE_NODES } from "./mission-control-data"

type KnowledgeNodeData = { label: string; value: string; color: string }

function KnowledgeNode({ node, side }: { node: KnowledgeNodeData; side: "left" | "right" }) {
  return (
    <div
      className={`bg-background/90 py-1 shadow-sm ${side === "left" ? "rounded-r-sm border-l-2 pl-2.5 text-left" : "rounded-l-sm border-r-2 pr-2.5 text-right"}`}
      style={{ borderColor: resolveVisualizationColor(node.color) }}
    >
      <div className="text-xs font-black text-foreground">{node.label}</div>
      <div style={{ color: resolveVisualizationColor(node.color) }}>{node.value}</div>
    </div>
  )
}

export function MissionControlGlobeMatrix() {
  return (
    <div className="bg-background relative flex min-h-[460px] flex-col items-center justify-center overflow-hidden rounded-xl border-2 border-primary shadow-sm lg:col-span-4">
      <div className="absolute inset-0">
        <Image
          unoptimized
          fill
          src="/assets/galaxy_milkyway_bg.png"
          alt="Milky Way space background"
          className="object-cover opacity-40"
        />
        <div className="from-background to-background absolute inset-0 bg-gradient-to-t via-transparent" />
      </div>

      <div className="relative my-auto flex h-72 w-full items-center justify-center">
        <div className="animate-spin-slow pointer-events-none absolute h-64 w-64 rounded-full border border-dashed border-primary/40" style={{ animationDuration: "50s" }} />
        <div className="animate-spin-slow pointer-events-none absolute h-72 w-72 rounded-full border border-border" style={{ animationDirection: "reverse", animationDuration: "80s" }} />
        <div className="bg-radial-gradient pointer-events-none absolute bottom-1 h-8 w-56 animate-pulse rounded-[50%] from-primary/10 via-blue-600/20 to-transparent blur-md" />
        <div className="relative flex h-64 w-64 items-center justify-center overflow-hidden rounded-full border border-primary/30 drop-shadow-sm">
          <Image
            unoptimized
            fill
            src="/assets/earth_from_space.png"
            alt="Earth from Space"
            className="object-cover transition-transform duration-700 hover:scale-105"
          />
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-primary/10 to-transparent mix-blend-screen" />
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-3 inset-y-8 flex items-center justify-between font-mono text-[11px] font-bold">
        <div className="pointer-events-auto space-y-7">
          {KNOWLEDGE_NODES.left.map((node) => <KnowledgeNode key={node.label} node={node} side="left" />)}
        </div>
        <div className="pointer-events-auto space-y-7">
          {KNOWLEDGE_NODES.right.map((node) => <KnowledgeNode key={node.label} node={node} side="right" />)}
        </div>
      </div>

      <div className="absolute bottom-3 rounded-full border border-primary bg-primary/30 px-4 py-1 text-[10px] font-black tracking-widest text-primary uppercase shadow-sm">
        // HOLO-GLOBE MATRIX : ONLINE //
      </div>
    </div>
  )
}
