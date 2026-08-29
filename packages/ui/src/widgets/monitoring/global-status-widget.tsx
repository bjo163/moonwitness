import React from "react"
import {
  BookOpen,
  Heart,
  Moon,
  Activity,
  Globe2,
  Users,
  Zap,
  Crosshair,
  ArrowRight,
} from "lucide-react"

export function GlobalStatusWidget() {
  return (
    <div className="bg-background flex flex-1 flex-col justify-between rounded-xl border border-primary/30 p-4">
      <div className="mb-4 flex items-center justify-between">
        <div className="text-[9px] font-black tracking-widest text-primary uppercase">
          LIVE GLOBAL STATUS
        </div>
        <div className="bg-success/20 text-success flex items-center gap-1 rounded px-1.5 py-0.5 text-[8px] font-bold">
          <span className="bg-success h-1 w-1 animate-pulse rounded-full" />{" "}
          LIVE
        </div>
      </div>

      <div className="grid h-full grid-cols-2 gap-2">
        {[
          {
            l: "KNOWLEDGE",
            v: "82%",
            s: "Coverage",
            icon: BookOpen,
            c: "text-primary",
          },
          {
            l: "PEACE INDEX",
            v: "68%",
            s: "Stable",
            icon: Heart,
            c: "text-success",
          },
          {
            l: "MOON STATUS",
            v: "Good",
            s: "Visibility",
            icon: Moon,
            c: "text-secondary",
          },
          {
            l: "PRAYER SYNC",
            v: "98.7%",
            s: "Global Sync",
            icon: Activity,
            c: "text-success",
          },
          {
            l: "ENVIRONMENT",
            v: "72",
            s: "Air Quality",
            icon: Globe2,
            c: "text-success",
          },
          {
            l: "HUMANITY",
            v: "7.83B",
            s: "Population",
            icon: Users,
            c: "text-knowledge",
          },
          {
            l: "TECHNOLOGY",
            v: "76%",
            s: "Progress",
            icon: Zap,
            c: "text-knowledge",
          },
          {
            l: "RESEARCH",
            v: "1,248",
            s: "Active Projects",
            icon: Crosshair,
            c: "text-primary",
          },
        ].map((st, i) => (
          <div
            key={i}
            className="bg-background flex cursor-pointer flex-col justify-between rounded border border-border p-2 transition-colors hover:bg-muted/30"
          >
            <div className="text-[7px] font-bold text-primary uppercase">
              {st.l}
            </div>
            <div className="mt-1 flex items-end justify-between">
              <st.icon className={`mb-0.5 h-3.5 w-3.5 ${st.c}`} />
              <div className="text-right">
                <div className="text-xs font-black text-foreground">{st.v}</div>
                <div className="text-[7px] text-primary">{st.s}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <button className="mt-3 flex w-full items-center justify-center gap-1 border-t border-border pt-3 text-center text-[9px] font-bold tracking-widest text-primary uppercase hover:text-foreground">
        VIEW DETAILED STATUS <ArrowRight className="h-3 w-3" />
      </button>
    </div>
  )
}
