import React from "react"
import { Moon, BookOpen, Globe2, Activity, Target, Heart } from "lucide-react"

const SPARK_HIGH_Y = 15
const SPARK_LOW_Y = 5
const SPARK_STEP_LOW = 3

export function GlobalIssuesWidget() {
  return (
    <div className="bg-space flex flex-col rounded-xl border border-white/10 p-4 lg:col-span-6 xl:col-span-7">
      <div className="mb-4 text-[9px] font-black tracking-widest text-primary uppercase">
        GLOBAL ISSUES OVERVIEW
      </div>

      <div className="grid flex-1 grid-cols-2 gap-3 md:grid-cols-3">
        {[
          {
            n: "Moon Observation Coverage",
            i: Moon,
            sev: "High",
            val: "-12%",
            c: "#FF0055",
            impact: "Hilal Confirmation",
          },
          {
            n: "Education Quality",
            i: BookOpen,
            sev: "Medium",
            val: "+6%",
            c: "#FF9900",
            impact: "Global Literacy",
          },
          {
            n: "Climate Change",
            i: Globe2,
            sev: "High",
            val: "+9%",
            c: "#FF0055",
            impact: "Environment",
          },
          {
            n: "Research Funding",
            i: Activity,
            sev: "Medium",
            val: "+3%",
            c: "#FF9900",
            impact: "Innovation",
          },
          {
            n: "Prayer Synchronization",
            i: Target,
            sev: "Low",
            val: "+1%",
            c: "#00FF66",
            impact: "Spiritual Unity",
          },
          {
            n: "Humanitarian Crisis",
            i: Heart,
            sev: "High",
            val: "+7%",
            c: "#FF0055",
            impact: "Humanity",
          },
        ].map((iss, i) => (
          <div
            key={i}
            className="bg-space group flex flex-col justify-between rounded-lg border border-white/5 p-3 transition-colors hover:border-white/20"
          >
            <div className="mb-2 flex items-start gap-2">
              <iss.i className="h-4 w-4 shrink-0 text-white/50 group-hover:text-white" />
              <div className="text-[9px] leading-tight font-bold text-white">
                {iss.n}
              </div>
            </div>

            <div>
              <div className="mb-1 flex justify-between text-[7px] text-primary uppercase">
                <span>SEVERITY</span>
                <span></span>
              </div>
              <div className="mb-2 flex items-baseline justify-between">
                <span
                  className="text-[10px] font-black"
                  style={{ color: iss.c }}
                >
                  {iss.sev}
                </span>
                <span className="font-mono text-[9px]" style={{ color: iss.c }}>
                  {iss.val}
                </span>
              </div>

              <div className="mb-1 text-[7px] text-primary uppercase">
                IMPACT
              </div>
              <div className="truncate text-[9px] text-primary">
                {iss.impact}
              </div>

              {/* Sparkline simulation */}
              <svg
                viewBox="0 0 100 20"
                className="mt-2 h-4 w-full overflow-visible"
                preserveAspectRatio="none"
              >
                <polyline
                  points={`0,10 20,${SPARK_HIGH_Y - i * 2} 40,${SPARK_LOW_Y + i * SPARK_STEP_LOW} 60,${SPARK_HIGH_Y} 80,${SPARK_LOW_Y} 100,10`}
                  fill="none"
                  stroke={iss.c}
                  strokeWidth="1.5"
                />
                <circle cx="20" cy={SPARK_HIGH_Y - i * 2} r="1.5" fill={iss.c} />
                <circle cx="40" cy={SPARK_LOW_Y + i * SPARK_STEP_LOW} r="1.5" fill={iss.c} />
                <circle cx="60" cy={SPARK_HIGH_Y} r="1.5" fill={iss.c} />
                <circle cx="80" cy={SPARK_LOW_Y} r="1.5" fill={iss.c} />
              </svg>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
