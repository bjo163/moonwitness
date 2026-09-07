import React from "react"
import { Moon, ArrowRight } from "lucide-react"
import { Button } from "../../components/button"

export function RecommendationEngineWidget() {
  return (
    <div className="flex flex-col justify-between rounded-md border border-border bg-card p-4 lg:col-span-4 xl:col-span-3">
      <div>
        <div className="text-sm font-semibold text-foreground">
          Recommendation engine
        </div>
        <div className="mb-3 text-xs text-muted-foreground">
          AI Powered Recommendations
        </div>

        <div className="border-danger/30 bg-danger/20 mb-4 flex items-start gap-3 rounded-lg border p-3">
          <Moon className="text-danger mt-1 h-5 w-5 shrink-0" />
          <div>
            <div className="mb-1 flex items-start justify-between">
              <div className="text-sm leading-tight font-semibold text-foreground">
                Expand Observation Network in West Indonesia
              </div>
              <div className="bg-danger/10 text-danger ml-2 shrink-0 rounded px-2 py-1 text-xs font-semibold">
                High priority
              </div>
            </div>
          </div>
        </div>

        <div className="mb-4 flex items-end justify-between px-2">
          <div>
            <div className="mb-1 text-xs text-muted-foreground">
              Expected impact
            </div>
            <div className="text-success font-mono text-lg leading-none font-black">
              +18%
            </div>
            <div className="text-success mt-0.5 text-xs">
              Coverage Increase
            </div>
          </div>
          <div className="text-right">
            <div className="mb-1 text-xs text-muted-foreground">
              Confidence
            </div>
            <div className="font-mono text-lg leading-none font-black text-primary">
              96%
            </div>
            <div className="mt-0.5 text-xs text-muted-foreground">Very high</div>
          </div>
        </div>

        <div>
          <div className="mb-1 text-xs text-muted-foreground">Reason</div>
          <div className="font-sans text-sm leading-relaxed text-foreground">
            Low observer density and high cloud probability (82%) detected in
            this region.
          </div>
        </div>
      </div>

      <Button type="button" variant="ghost" className="mt-4 flex w-full items-center justify-center gap-1 border-t border-border pt-3 text-center text-sm font-medium text-primary hover:text-foreground">
        View all recommendations <ArrowRight className="h-3.5 w-3.5" />
      </Button>
    </div>
  )
}
