"use client"

import React from "react"
import { ArrowRight } from "lucide-react"

export function TaskCenterAnalytics() {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      {/* Task Priority Distribution */}
      <div className="bg-background flex flex-col rounded-xl border border-border p-4">
        <div className="mb-4 text-[9px] font-black tracking-widest text-primary uppercase">
          TASK PRIORITY DISTRIBUTION
        </div>
        <div className="flex flex-1 items-center justify-center gap-4">
          <div className="relative flex h-24 w-24 shrink-0 items-center justify-center rounded-full border-4 border-primary">
            <div
              className="absolute inset-0 rounded-full border-[6px] border-rose-500 border-r-transparent border-b-transparent"
              style={{ transform: "rotate(45deg)" }}
            />
            <div
              className="absolute inset-0 rounded-full border-[6px] border-amber-500 border-b-transparent border-l-transparent"
              style={{ transform: "rotate(135deg)" }}
            />
            <div
              className="absolute inset-0 rounded-full border-[6px] border-emerald-500 border-t-transparent border-r-transparent"
              style={{ transform: "rotate(-110deg)" }}
            />
            <div
              className="absolute inset-0 rounded-full border-[6px] border-primary border-t-transparent border-l-transparent"
              style={{ transform: "rotate(-45deg)" }}
            />

            <div className="text-center">
              <div className="font-mono text-lg leading-none font-black text-foreground">
                238
              </div>
              <div className="mt-1 text-[6px] font-bold text-primary uppercase">
                Total Tasks
              </div>
            </div>
          </div>
          <div className="space-y-1.5 text-[8px]">
            <div className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />{" "}
              <span className="w-10 text-foreground">High</span>{" "}
              <span className="font-mono text-primary">68 (28.6%)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />{" "}
              <span className="w-10 text-foreground">Medium</span>{" "}
              <span className="font-mono text-primary">102 (42.9%)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />{" "}
              <span className="w-10 text-foreground">Low</span>{" "}
              <span className="font-mono text-primary">48 (20.2%)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />{" "}
              <span className="w-10 text-foreground">None</span>{" "}
              <span className="font-mono text-primary">20 (8.3%)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Task Progress Trend */}
      <div className="bg-background flex flex-col rounded-xl border border-border p-4">
        <div className="mb-4 text-[9px] font-black tracking-widest text-primary uppercase">
          TASK PROGRESS TREND
        </div>

        <div className="relative mt-2 ml-5 min-h-[100px] flex-1 border-b border-l border-border">
          <div className="absolute top-0 -left-5 -translate-y-1/2 text-[6px] text-primary">
            250
          </div>
          <div className="absolute bottom-[60%] -left-5 -translate-y-1/2 text-[6px] text-primary">
            150
          </div>
          <div className="absolute bottom-[20%] -left-5 -translate-y-1/2 text-[6px] text-primary">
            50
          </div>

          <svg
            className="absolute inset-0 h-full w-full overflow-visible"
            preserveAspectRatio="none"
          >
            {/* To Do (Blue) */}
            <polyline
              points="0,20 16,30 33,25 50,30 66,20 83,10 100,0"
              fill="none"
              stroke="#3B82F6"
              strokeWidth="1.5"
            />
            {/* In Progress (Orange) */}
            <polyline
              points="0,50 16,60 33,55 50,50 66,45 83,40 100,30"
              fill="none"
              stroke="#F59E0B"
              strokeWidth="1.5"
            />
            {/* Done (Green) */}
            <polyline
              points="0,90 16,85 33,80 50,85 66,70 83,60 100,50"
              fill="none"
              stroke="#10B981"
              strokeWidth="1.5"
            />

            {[0, 16, 33, 50, 66, 83, 100].map((cx, i) => (
              <React.Fragment key={i}>
                <circle
                  cx={`${cx}%`}
                  cy={`${[20, 30, 25, 30, 20, 10, 0][i]}%`}
                  r="1.5"
                  fill="#3B82F6"
                />
                <circle
                  cx={`${cx}%`}
                  cy={`${[50, 60, 55, 50, 45, 40, 30][i]}%`}
                  r="1.5"
                  fill="#F59E0B"
                />
                <circle
                  cx={`${cx}%`}
                  cy={`${[90, 85, 80, 85, 70, 60, 50][i]}%`}
                  r="1.5"
                  fill="#10B981"
                />
              </React.Fragment>
            ))}
          </svg>

          <div className="absolute inset-x-0 -bottom-3 flex justify-between font-mono text-[6px] text-primary">
            <span>May 20</span>
            <span>May 22</span>
            <span>May 24</span>
            <span>May 26</span>
          </div>
        </div>

        <div className="mt-4 flex justify-center gap-3 text-[7px] font-bold tracking-widest text-primary uppercase">
          <span className="flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-500" /> To Do
          </span>
          <span className="flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500" /> In Progress
          </span>
          <span className="flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Done
          </span>
        </div>
      </div>

      {/* Tasks by Project */}
      <div className="bg-background flex flex-col rounded-xl border border-border p-4">
        <div className="mb-4 text-[9px] font-black tracking-widest text-primary uppercase">
          TASKS BY PROJECT
        </div>
        <div className="flex-1 space-y-2.5 text-[8px]">
          {[
            { n: "Moon Observation", v: 72, p: "30%", c: "#3B82F6" },
            { n: "Astronomy Atlas", v: 45, p: "19%", c: "#F59E0B" },
            { n: "Qur'an Translation", v: 38, p: "16%", c: "#F97316" },
            { n: "Islamic History", v: 28, p: "12%", c: "#10B981" },
            { n: "AI Systems", v: 22, p: "9%", c: "#A855F7" },
            { n: "Others", v: 33, p: "14%", c: "#708090" },
          ].map((proj, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="w-20 truncate text-foreground">{proj.n}</div>
              <div className="bg-background h-1 flex-1 overflow-hidden rounded-full">
                <div
                  className="h-full rounded-full"
                  style={{ width: proj.p, backgroundColor: proj.c }}
                />
              </div>
              <div className="w-12 text-right font-mono text-foreground">
                {proj.v} <span className="text-primary">({proj.p})</span>
              </div>
            </div>
          ))}
        </div>
        <button className="mt-2 flex items-center justify-center gap-1 text-[8px] font-bold tracking-widest text-primary uppercase transition-colors hover:text-foreground">
          View All Projects <ArrowRight className="h-2.5 w-2.5" />
        </button>
      </div>
    </div>
  )
}
