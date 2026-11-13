import { Activity, Cpu, Globe, Radio, ShieldCheck, Users } from "lucide-react"
import { resolveVisualizationColor } from "@workspace/ui"
import { ACTIVITY_LOGS, DIAGNOSTIC_CARDS } from "./mission-control-data"

export function MissionControlActivityFeed({ clock }: { clock: string }) {
  return (
    <div className="flex flex-col justify-between space-y-4 lg:col-span-5">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { ...DIAGNOSTIC_CARDS[0], icon: ShieldCheck },
          { ...DIAGNOSTIC_CARDS[1], icon: Cpu },
          { ...DIAGNOSTIC_CARDS[2], icon: Users },
          { title: "MISSION TIME", value: clock.split(" ")[0], sub: "WIB ATOMIC", color: "#3B82F6", icon: Activity },
        ].map((card) => (
          <div key={card.title} className="bg-background flex flex-col justify-between rounded-lg border border-border p-3 text-center shadow-inner transition-colors hover:border-border">
            <div className="flex items-center justify-center gap-1.5 truncate text-[9px] font-black tracking-wider text-primary uppercase">
              <card.icon className="h-3.5 w-3.5 shrink-0" style={{ color: resolveVisualizationColor(card.color) }} />
              <span className="truncate">{card.title}</span>
            </div>
            <div className="my-1.5 font-mono text-xl font-black tracking-wider text-foreground drop-shadow-sm" style={{ color: resolveVisualizationColor(card.color) }}>
              {card.value}
            </div>
            <div className="text-[9px] font-black tracking-widest text-primary uppercase">{card.sub}</div>
          </div>
        ))}
      </div>

      <div className="bg-background flex flex-1 flex-col justify-between rounded-xl border-2 border-primary/50 p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between border-b border-border pb-3.5 text-xs font-black uppercase">
          <div className="flex items-center gap-2.5 tracking-wider text-primary"><Radio className="h-4 w-4 animate-pulse text-success" /><span>GLOBAL ACTIVITIES LIVE FEED</span></div>
          <span className="animate-pulse rounded-xs border border-emerald-400 bg-success/20 px-2.5 py-0.5 text-[10px] font-bold text-success shadow-sm">● LIVE</span>
        </div>

        <div className="my-auto grid grid-cols-1 items-center gap-5 sm:grid-cols-12">
          <div className="bg-background relative flex h-44 w-full items-center justify-center overflow-hidden rounded-lg border border-primary/30 shadow-sm sm:col-span-6">
            <div className="theme-grid-bg absolute inset-0 opacity-50" />
            <Globe className="h-28 w-28 animate-pulse text-primary/40" />
            <span className="absolute top-1/3 left-1/3 h-2.5 w-2.5 animate-ping rounded-full bg-emerald-400 shadow-sm" />
            <span className="absolute right-1/3 bottom-1/3 h-2.5 w-2.5 animate-ping rounded-full bg-primary shadow-sm" style={{ animationDelay: "500ms" }} />
            <span className="absolute top-1/2 right-1/4 h-2.5 w-2.5 animate-ping rounded-full bg-primary shadow-sm" style={{ animationDelay: "1s" }} />
          </div>
          <div className="space-y-3 border-l border-border pl-4 font-mono text-[11px] sm:col-span-6">
            {ACTIVITY_LOGS.map((log) => (
              <div key={log.title} className="group flex cursor-pointer items-center justify-between rounded-xs px-1.5 py-1 transition-colors hover:bg-muted/30">
                <span className="mr-2 flex items-center gap-2 truncate font-bold text-foreground">
                  <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: resolveVisualizationColor(log.color), boxShadow: `0 0 8px ${resolveVisualizationColor(log.color)}` }} />
                  <span className="truncate transition-colors group-hover:text-primary">{log.title}</span>
                </span>
                <span className="shrink-0 font-mono text-[10px] text-primary">{log.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
