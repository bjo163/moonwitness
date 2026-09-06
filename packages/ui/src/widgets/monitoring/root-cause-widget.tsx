import React from "react"
import { Globe2, Moon, Users, Target, Clock, ArrowRight } from "lucide-react"
import { resolveSemanticColor, type SemanticColorToken } from "../../lib/semantic-color"

export function RootCauseWidget() {
  return (
    <div className="bg-background flex flex-col rounded-xl border border-border p-4 lg:col-span-3 xl:col-span-3">
      <div className="mb-1 text-[9px] font-black tracking-widest text-primary uppercase">
        ROOT CAUSE ANALYSIS
      </div>
      <div className="mb-4 text-[8px] text-primary">Top 5 Issues</div>

      <div className="flex flex-1 items-center gap-4">
        {/* Donut Chart */}
        <div className="relative flex h-24 w-24 shrink-0 items-center justify-center rounded-full border-4 border-primary shadow-sm">
          <div
            className="absolute inset-0 rounded-full border-[5px] border-primary border-r-transparent border-b-transparent shadow-sm"
            style={{ transform: "rotate(-20deg)" }}
          />
          <div
            className="border-success absolute inset-0 rounded-full border-[5px] border-b-transparent border-l-transparent"
            style={{ transform: "rotate(70deg)" }}
          />
          <div
            className="absolute inset-0 rounded-full border-[5px] border-secondary border-t-transparent border-r-transparent"
            style={{ transform: "rotate(-45deg)" }}
          />
          <div
            className="border-knowledge absolute inset-0 rounded-full border-[5px] border-t-transparent border-l-transparent"
            style={{ transform: "rotate(135deg)" }}
          />

          <div className="text-center">
            <div className="mb-0.5 text-[7px] font-bold text-primary uppercase">
              ISSUE
            </div>
            <div className="text-[9px] leading-tight font-black text-foreground">
              Moon
              <br />
              Observation
              <br />
              Coverage
            </div>
          </div>
        </div>

        {/* Legend List */}
        <div className="flex-1 space-y-2">
          <div className="mb-1 text-[8px] font-black tracking-widest text-primary uppercase">
            ROOT CAUSES
          </div>
          {[
            { n: "Weather Conditions", v: "42%", c: "info", icon: Globe2 },
            { n: "Cloud Coverage", v: "28%", c: "success", icon: Moon },
            { n: "Low Observer Density", v: "18%", c: "primary", icon: Users },
            { n: "Equipment Limitations", v: "7%", c: "info", icon: Target },
            { n: "Reporting Delay", v: "5%", c: "warning", icon: Clock },
          ].map((rc, i) => (
            <div
              key={i}
              className="group flex cursor-pointer items-center justify-between text-[9px]"
            >
              <span className="flex items-center gap-1.5 text-foreground transition-colors group-hover:text-foreground">
                <rc.icon className="h-3 w-3" style={{ color: resolveSemanticColor(rc.c as SemanticColorToken) }} />
                <span className="max-w-[85px] truncate">{rc.n}</span>
              </span>
              <span className="font-mono text-foreground transition-colors group-hover:text-primary">
                {rc.v}
              </span>
            </div>
          ))}
        </div>
      </div>

      <button type="button" className="mt-3 flex w-full items-center justify-end gap-1 text-right text-[8px] font-bold tracking-widest text-primary uppercase hover:text-foreground">
        VIEW FULL ANALYSIS <ArrowRight className="h-2.5 w-2.5" />
      </button>
    </div>
  )
}
