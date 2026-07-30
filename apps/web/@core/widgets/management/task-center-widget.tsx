import React from "react"
import { ArrowRight } from "lucide-react"

export function TaskCenterWidget() {
  return (
    <div className="bg-space flex flex-col rounded-xl border border-white/10 p-4 lg:col-span-12 xl:col-span-3">
      <div className="mb-2 flex items-center justify-between">
        <div className="text-[9px] font-black tracking-widest text-primary uppercase">
          TASK CENTER
        </div>
      </div>
      <div className="mb-4 text-[8px] text-primary">My Tasks Overview</div>

      <div className="flex flex-1 items-center gap-4 xl:flex-col">
        <div className="relative flex h-28 w-28 shrink-0 items-center justify-center rounded-full border-8 border-primary shadow-[0_0_15px_rgba(0,0,0,0.5)]">
          <div
            className="absolute inset-0 rounded-full border-[8px] border-secondary border-r-transparent border-b-transparent shadow-[0_0_10px_#0088FF]"
            style={{ transform: "rotate(-20deg)" }}
          />
          <div
            className="border-success absolute inset-0 rounded-full border-[8px] border-b-transparent border-l-transparent"
            style={{ transform: "rotate(70deg)" }}
          />
          <div
            className="border-knowledge absolute inset-0 rounded-full border-[8px] border-t-transparent border-r-transparent"
            style={{ transform: "rotate(-45deg)" }}
          />
          <div
            className="border-warning absolute inset-0 rounded-full border-[8px] border-t-transparent border-l-transparent"
            style={{ transform: "rotate(135deg)" }}
          />

          <div className="text-center">
            <div className="font-mono text-2xl leading-none font-black text-white">
              238
            </div>
            <div className="mt-1 text-[7px] font-bold text-primary uppercase">
              TOTAL
              <br />
              TASKS
            </div>
          </div>
        </div>

        <div className="w-full space-y-2.5">
          {[
            { n: "To Do", v: 78, p: "33%", c: "#0088FF" },
            { n: "In Progress", v: 96, p: "40%", c: "#FF9900" },
            { n: "Review", v: 38, p: "16%", c: "#A100FF" },
            { n: "Done", v: 26, p: "11%", c: "#00FF66" },
          ].map((st, i) => (
            <div
              key={i}
              className="group flex cursor-pointer items-center justify-between rounded p-1 text-[9px] hover:bg-white/5"
            >
              <span className="flex items-center gap-2 text-white/80">
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: st.c }}
                />
                {st.n}
              </span>
              <span className="font-mono text-white">
                {st.v} <span className="text-primary">({st.p})</span>
              </span>
            </div>
          ))}
        </div>
      </div>

      <button className="mt-2 flex w-full items-center justify-end gap-1 text-right text-[8px] font-bold tracking-widest text-primary uppercase hover:text-white">
        VIEW ALL TASKS <ArrowRight className="h-2.5 w-2.5" />
      </button>
    </div>
  )
}
