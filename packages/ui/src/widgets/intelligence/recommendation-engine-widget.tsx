import React from "react"
import { Moon, ArrowRight } from "lucide-react"

export function RecommendationEngineWidget() {
  return (
    <div className="bg-background flex flex-col justify-between rounded-xl border border-primary/30 p-4 shadow-lg lg:col-span-4 xl:col-span-3">
      <div>
        <div className="text-[9px] font-black tracking-widest text-primary uppercase">
          RECOMMENDATION ENGINE
        </div>
        <div className="mb-3 text-[8px] text-primary/70">
          AI Powered Recommendations
        </div>

        <div className="border-danger/30 bg-danger/20 mb-4 flex items-start gap-3 rounded-lg border p-3">
          <Moon className="text-danger mt-1 h-5 w-5 shrink-0" />
          <div>
            <div className="mb-1 flex items-start justify-between">
              <div className="text-[10px] leading-tight font-bold text-foreground">
                Expand Observation Network in West Indonesia
              </div>
              <div className="bg-danger/20 text-danger ml-2 shrink-0 rounded px-1 py-0.5 text-[7px] font-black uppercase">
                PRIORITY
                <br />
                HIGH
              </div>
            </div>
          </div>
        </div>

        <div className="mb-4 flex items-end justify-between px-2">
          <div>
            <div className="mb-1 text-[8px] text-primary uppercase">
              EXPECTED IMPACT
            </div>
            <div className="text-success font-mono text-lg leading-none font-black">
              +18%
            </div>
            <div className="text-success mt-0.5 text-[8px]">
              Coverage Increase
            </div>
          </div>
          <div className="text-right">
            <div className="mb-1 text-[8px] text-primary uppercase">
              CONFIDENCE
            </div>
            <div className="font-mono text-lg leading-none font-black text-primary">
              96%
            </div>
            <div className="mt-0.5 text-[8px] text-primary">Very High</div>
          </div>
        </div>

        <div>
          <div className="mb-1 text-[8px] text-primary uppercase">REASON</div>
          <div className="font-sans text-[9px] leading-relaxed text-foreground">
            Low observer density and high cloud probability (82%) detected in
            this region.
          </div>
        </div>
      </div>

      <button className="mt-4 flex w-full items-center justify-center gap-1 border-t border-border pt-3 text-center text-[9px] font-bold tracking-widest text-primary uppercase hover:text-foreground">
        VIEW ALL RECOMMENDATIONS <ArrowRight className="h-2.5 w-2.5" />
      </button>
    </div>
  )
}
