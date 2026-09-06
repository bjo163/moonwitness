"use client"

import React from "react"
import {
  Book,
  Users,
  Map,
  Swords,
  Telescope,
  Clock,
  History,
  BookOpen,
  ArrowRight,
} from "lucide-react"

const STAT_ITEMS = [
  {
    n: "Total Events",
    v: "1,842",
    s: "Across all time",
    icon: Book,
    c: "#F59E0B",
  },
  {
    n: "Prophets & Messengers",
    v: "124",
    s: "Sent to guide humanity",
    icon: Users,
    c: "#10B981",
  },
  {
    n: "Major Civilizations",
    v: "96",
    s: "That shaped the world",
    icon: Map,
    c: "#A855F7",
  },
  {
    n: "Powerful Empires",
    v: "47",
    s: "Rise and fall of powers",
    icon: Swords,
    c: "#F97316",
  },
  {
    n: "Astronomy Discoveries",
    v: "128",
    s: "Milestones of knowledge",
    icon: Telescope,
    c: "#3B82F6",
  },
  {
    n: "Future Major Events",
    v: "23",
    s: "Awaiting to unfold",
    icon: Clock,
    c: "#10B981",
  },
]

const INSIGHT_ITEMS = [
  {
    n: "History repeats in patterns",
    d: "Similar events occurred 3 times in different eras.",
    icon: History,
    c: "#3B82F6",
  },
  {
    n: "Knowledge evolves continuously",
    d: "Astronomy discoveries increased 400% in last 200 years.",
    icon: BookOpen,
    c: "#A855F7",
  },
  {
    n: "Divine guidance is consistent",
    d: "124 messengers were sent across all civilizations.",
    icon: Users,
    c: "#10B981",
  },
  {
    n: "The end is certain",
    d: "Future events are mentioned in 27% of verses.",
    icon: Clock,
    c: "#F59E0B",
  },
]

export function PropheticTimelineStatsInsights() {
  return (
    <>
      {/* Key Statistics & Footer Graphic (Col 4-9) */}
      <div className="flex flex-col gap-4 lg:col-span-6">
        {/* Stats */}
        <div className="bg-background rounded-xl border border-border p-4">
          <div className="mb-4 text-[9px] font-black tracking-widest text-primary uppercase">
            KEY STATISTICS
          </div>

          <div className="grid grid-cols-3 gap-2 md:grid-cols-6">
            {STAT_ITEMS.map((st, i) => (
              <div
                key={i}
                className="bg-background flex flex-col items-center justify-center rounded-lg border border-border p-2 text-center"
              >
                <st.icon className="mb-2 h-5 w-5" style={{ color: st.c }} />
                <div className="mb-1 font-mono text-lg leading-none font-black text-foreground">
                  {st.v}
                </div>
                <div className="mb-0.5 text-[7px] leading-tight text-primary">
                  {st.n}
                </div>
                <div className="hidden text-[6px] text-primary md:block">
                  {st.s}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Graphic (Camels in Desert) */}
        <div className="bg-background relative flex min-h-[120px] flex-1 flex-col items-center justify-center overflow-hidden rounded-xl border border-border text-center">
          <div className="from-background absolute inset-0 z-10 bg-gradient-to-t via-transparent to-transparent" />
          {/* Silhouette abstract simulation */}
          <svg
            className="absolute bottom-0 z-0 h-20 w-full opacity-30"
            preserveAspectRatio="none"
          >
            <path
              d="M 0,20 Q 20,15 40,20 T 80,18 T 120,22 T 160,15 T 200,20 L 200,20 L 0,20 Z"
              fill="#0A1220"
            />
            <path
              d="M 10,20 Q 15,10 20,20 Z M 30,20 Q 32,15 35,20 Z M 60,20 Q 65,5 70,20 Z"
              fill="#1A253A"
            />
          </svg>

          <div className="relative z-20 px-8">
            <div
              className="font-arabic mb-2 text-[16px] font-bold text-foreground"
              dir="rtl"
            >
              إِنَّ فِي ذَٰلِكَ لَعِبْرَةً لِّأُولِي الْأَبْصَارِ
            </div>
            <div className="mb-2 font-sans text-[10px] text-foreground italic">
              "Indeed in that are signs for those of understanding."
            </div>
            <div className="font-mono text-[9px] font-bold text-primary uppercase">
              Qur&apos;an 59:21
            </div>
          </div>
        </div>
      </div>

      {/* Timeline Insights (Col 10-12) */}
      <div className="bg-background flex flex-col rounded-xl border border-border p-4 lg:col-span-3">
        <div className="mb-4 flex items-center justify-between">
          <div className="text-[9px] font-black tracking-widest text-primary uppercase">
            TIMELINE INSIGHTS
          </div>
          <div className="cursor-pointer text-[8px] text-primary hover:text-foreground">
            View All
          </div>
        </div>

        <div className="flex-1 space-y-4">
          {INSIGHT_ITEMS.map((ins, i) => (
            <div
              key={i}
              className="flex items-start gap-3 border-b border-border pb-3"
            >
              <div
                className="bg-background flex h-8 w-8 shrink-0 items-center justify-center rounded-full border"
                style={{ borderColor: `${ins.c}50` }}
              >
                <ins.icon className="h-4 w-4" style={{ color: ins.c }} />
              </div>
              <div>
                <div className="mb-0.5 text-[10px] font-bold text-foreground">
                  {ins.n}
                </div>
                <div className="font-sans text-[8px] leading-relaxed text-primary">
                  {ins.d}
                </div>
              </div>
            </div>
          ))}
        </div>

        <button className="mt-2 flex w-full items-center justify-center gap-1 rounded border border-border py-2 text-center text-[8px] font-bold tracking-widest text-primary uppercase transition-colors hover:bg-muted/30 hover:text-foreground">
          VIEW ALL INSIGHTS <ArrowRight className="h-2.5 w-2.5" />
        </button>
      </div>
    </>
  )
}
