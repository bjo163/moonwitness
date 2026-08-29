import React from "react"
import { Target, ArrowRight } from "lucide-react"

export function ActionCenterWidget() {
  return (
    <div className="bg-background flex flex-col rounded-xl border border-border p-4 lg:col-span-4 xl:col-span-3">
      <div className="mb-4 flex items-center justify-between">
        <div className="text-[9px] font-black tracking-widest text-primary uppercase">
          ACTION CENTER
        </div>
        <div className="cursor-pointer text-[8px] text-primary hover:text-foreground">
          View All ∨
        </div>
      </div>

      <div className="mb-2 flex w-full border-b border-border pb-2 text-[8px] text-primary uppercase">
        <div className="w-8"></div>
        <div className="flex-1">TASK</div>
        <div className="hidden w-20 md:block">CATEGORY</div>
        <div className="w-20">ASSIGNED TO</div>
        <div className="w-16">DUE DATE</div>
        <div className="w-16 text-right">STATUS</div>
      </div>

      <div className="flex-1 space-y-2">
        {[
          {
            n: "Deploy observation team to Aceh",
            cat: "Moon Observation",
            asg: "ARS Team",
            d: "27 May",
            stat: "In Progress",
            sc: "#0088FF",
          },
          {
            n: "Upgrade telescope equipment",
            cat: "Astronomy",
            asg: "Tech Dept",
            d: "30 May",
            stat: "Pending",
            sc: "#FF9900",
          },
          {
            n: "Translate 25 hadiths",
            cat: "Translation",
            asg: "Lia & Team",
            d: "28 May",
            stat: "To Do",
            sc: "#8B9BB0",
          },
          {
            n: "Verify historical timeline data",
            cat: "History",
            asg: "Research Team",
            d: "1 Jun",
            stat: "To Do",
            sc: "#8B9BB0",
          },
          {
            n: "Review hilal algorithm v2.1",
            cat: "AI Research",
            asg: "AI Team",
            d: "25 May",
            stat: "Review",
            sc: "#A100FF",
          },
        ].map((tsk, i) => (
          <div
            key={i}
            className="group flex cursor-pointer items-center rounded py-1 text-[9px] transition-colors hover:bg-muted/30"
          >
            <div className="flex w-8 justify-center">
              <Target className="h-3.5 w-3.5 text-primary group-hover:text-primary" />
            </div>
            <div className="flex-1 truncate pr-2 text-foreground">{tsk.n}</div>
            <div className="hidden w-20 truncate text-primary md:block">
              {tsk.cat}
            </div>
            <div className="w-20 truncate text-primary">{tsk.asg}</div>
            <div className="w-16 font-mono text-primary">{tsk.d}</div>
            <div className="w-16 text-right">
              <span
                className="rounded border border-current px-1.5 py-0.5 font-bold"
                style={{ color: tsk.sc }}
              >
                {tsk.stat}
              </span>
            </div>
          </div>
        ))}
      </div>

      <button className="mt-2 flex w-full items-center justify-center gap-1 border-t border-border pt-2 text-center text-[8px] font-bold tracking-widest text-primary uppercase hover:text-foreground">
        VIEW ALL ACTIONS <ArrowRight className="h-2.5 w-2.5" />
      </button>
    </div>
  )
}
