"use client"

import React from "react"
import {
  Flame,
  CheckCircle2,
  Calendar,
  ArrowRight,
  BookOpen,
  Scroll,
  Book,
  FileText,
} from "lucide-react"

export function LearningMetricsRow() {
  return (
    <div className="grid grid-cols-1 gap-6 pt-2 md:grid-cols-2 lg:grid-cols-4">
      {/* Panel 1: Learning Streak */}
      <div className="bg-background flex flex-col justify-between rounded-xl border border-border p-5">
        <div className="mb-4 text-[10px] font-black tracking-widest text-primary uppercase">
          LEARNING STREAK
        </div>

        <div className="mb-6 flex items-center gap-4">
          <Flame className="h-10 w-10 animate-pulse text-destructive" />
          <div>
            <div className="font-mono text-3xl leading-none font-black text-primary">
              100
            </div>
            <div className="mt-1 text-[9px] font-bold tracking-widest text-foreground uppercase">
              DAYS
            </div>
          </div>
          <div className="ml-auto max-w-[90px] font-sans text-[9px] text-muted-foreground italic">
            Keep it up! Consistency builds true understanding.
          </div>
        </div>

        <div className="mb-6 flex items-center justify-between px-2 font-mono text-[9px] font-black">
          {["M", "T", "W", "T", "F", "S", "S"].map((day, i) => (
            <div key={i} className="flex flex-col items-center gap-2">
              <span className="text-foreground">{day}</span>
              <CheckCircle2 className="h-4 w-4 text-success" />
            </div>
          ))}
        </div>

        <button className="flex w-full items-center gap-1 border-t border-border pt-4 text-left text-[9px] font-bold tracking-widest text-primary uppercase hover:text-foreground">
          <Calendar className="h-3.5 w-3.5" /> VIEW CALENDAR{" "}
          <ArrowRight className="ml-auto h-3 w-3" />
        </button>
      </div>

      {/* Panel 2: Time Investment */}
      <div className="bg-background flex flex-col justify-between rounded-xl border border-border p-5">
        <div className="mb-4 text-[10px] font-black tracking-widest text-primary uppercase">
          TIME INVESTMENT
        </div>

        <div className="flex items-center justify-between gap-4">
          <div className="relative flex h-24 w-24 shrink-0 items-center justify-center rounded-full border-[6px] border-primary shadow-xs">
            <div
              className="absolute inset-0 rounded-full border-[6px] border-success border-t-transparent border-l-transparent"
              style={{ transform: "rotate(45deg)" }}
            />
            <div
              className="absolute inset-0 rounded-full border-[6px] border-warning border-r-transparent border-b-transparent"
              style={{ transform: "rotate(45deg)" }}
            />
            <div className="text-center">
              <div className="mb-0.5 text-[8px] font-bold tracking-wider text-muted-foreground uppercase">
                TOTAL
              </div>
              <div className="font-mono text-sm leading-tight font-black text-foreground">
                128h
                <br />
                45m
              </div>
            </div>
          </div>

          <div className="flex-1 space-y-1.5 font-mono text-[9px]">
            {[
              { l: "QUR'AN", v: "42h 15m", color: "bg-success" },
              { l: "HADITH", v: "28h 30m", color: "bg-warning" },
              { l: "TAFSIR", v: "18h 20m", color: "bg-purple-400" },
              { l: "HISTORY", v: "16h 10m", color: "bg-blue-400" },
              { l: "ASTRONOMY", v: "14h 45m", color: "bg-primary" },
              { l: "OTHERS", v: "8h 45m", color: "bg-muted-foreground" },
            ].map((t, i) => (
              <div key={i} className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-foreground">
                  <span className={`h-1.5 w-1.5 rounded-full ${t.color}`} />
                  {t.l}
                </span>
                <span className="text-primary">{t.v}</span>
              </div>
            ))}
          </div>
        </div>

        <button className="mt-6 flex w-full items-center justify-between border-t border-border pt-4 text-center text-[9px] font-bold tracking-widest text-primary uppercase hover:text-foreground">
          VIEW TIME ANALYTICS <ArrowRight className="h-3 w-3" />
        </button>
      </div>

      {/* Panel 3: Weekly Goal */}
      <div className="bg-background flex flex-col justify-between rounded-xl border border-success/30 p-5 shadow-xs">
        <div className="mb-4 text-[10px] font-black tracking-widest text-primary uppercase">
          WEEKLY GOAL
        </div>

        <div className="flex items-center justify-between gap-4">
          <div className="relative flex h-24 w-24 shrink-0 items-center justify-center rounded-full border-4 border-muted">
            <div
              className="absolute inset-0 rounded-full border-4 border-success border-l-transparent shadow-xs"
              style={{ transform: "rotate(-45deg)" }}
            />
            <div className="text-center">
              <div className="font-mono text-2xl font-black text-success">
                78%
              </div>
              <div className="text-[8px] font-bold tracking-wider text-foreground uppercase">
                COMPLETED
              </div>
            </div>
          </div>

          <div className="flex-1 space-y-3 text-right font-mono text-[10px]">
            <div>
              <div className="text-muted-foreground">Goal</div>
              <div className="font-black text-primary">15h 00m</div>
            </div>
            <div>
              <div className="text-muted-foreground">Achieved</div>
              <div className="font-black text-success">11h 42m</div>
            </div>
            <div>
              <div className="text-muted-foreground">Remaining</div>
              <div className="font-black text-foreground">03h 18m</div>
            </div>
          </div>
        </div>

        <button className="mt-6 flex w-full items-center justify-between border-t border-border pt-4 text-center text-[9px] font-bold tracking-widest text-success uppercase hover:text-foreground">
          ADJUST GOAL <ArrowRight className="h-3 w-3" />
        </button>
      </div>

      {/* Panel 4: Knowledge Impact */}
      <div className="bg-background flex flex-col justify-between rounded-xl border border-border p-5">
        <div className="mb-4 text-[10px] font-black tracking-widest text-primary uppercase">
          KNOWLEDGE IMPACT
        </div>

        <div className="grid h-full grid-cols-2 gap-3">
          <div className="rounded border border-border bg-muted/30 p-2">
            <div className="mb-2 flex items-center gap-2">
              <BookOpen className="h-3.5 w-3.5 text-success" />
              <span className="text-[8px] text-muted-foreground uppercase">
                VERSES READ
              </span>
            </div>
            <div className="font-mono text-xl font-black text-foreground">
              1,248
            </div>
            <div className="text-[8px] text-success">+156 this week</div>
          </div>
          <div className="rounded border border-border bg-muted/30 p-2">
            <div className="mb-2 flex items-center gap-2">
              <Scroll className="h-3.5 w-3.5 text-warning" />
              <span className="text-[8px] text-muted-foreground uppercase">
                AHADITH READ
              </span>
            </div>
            <div className="font-mono text-xl font-black text-foreground">
              982
            </div>
            <div className="text-[8px] text-success">+112 this week</div>
          </div>
          <div className="rounded border border-border bg-muted/30 p-2">
            <div className="mb-2 flex items-center gap-2">
              <Book className="h-3.5 w-3.5 text-primary" />
              <span className="text-[8px] text-muted-foreground uppercase">
                PAGES STUDIED
              </span>
            </div>
            <div className="font-mono text-xl font-black text-foreground">
              1,532
            </div>
            <div className="text-[8px] text-success">+203 this week</div>
          </div>
          <div className="rounded border border-border bg-muted/30 p-2">
            <div className="mb-2 flex items-center gap-2">
              <FileText className="h-3.5 w-3.5 text-primary" />
              <span className="text-[8px] text-muted-foreground uppercase">
                NOTES TAKEN
              </span>
            </div>
            <div className="font-mono text-xl font-black text-foreground">
              245
            </div>
            <div className="text-[8px] text-success">+37 this week</div>
          </div>
        </div>

        <button className="mt-4 flex w-full items-center justify-between border-t border-border pt-4 text-center text-[9px] font-bold tracking-widest text-primary uppercase hover:text-foreground">
          VIEW IMPACT REPORT <ArrowRight className="h-3 w-3" />
        </button>
      </div>
    </div>
  )
}
