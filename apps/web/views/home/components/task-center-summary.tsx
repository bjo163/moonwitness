"use client"

import React from "react"
import {
  ArrowRight,
  Moon,
  BookOpen,
  User,
  Clock,
  AlertTriangle,
  Target,
} from "lucide-react"

export function TaskCenterSummary() {
  return (
    <div className="flex flex-col gap-4 xl:col-span-3">
      {/* My Tasks Summary */}
      <div className="bg-background rounded-xl border border-border p-4">
        <div className="mb-4 text-[9px] font-black tracking-widest text-primary uppercase">
          MY TASKS SUMMARY
        </div>
        <div className="flex items-center gap-4">
          <div className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-full border-4 border-primary">
            <div
              className="absolute inset-0 rounded-full border-[4px] border-blue-500 border-r-transparent border-b-transparent"
              style={{ transform: "rotate(-45deg)" }}
            />
            <div
              className="absolute inset-0 rounded-full border-[4px] border-amber-500 border-b-transparent border-l-transparent"
              style={{ transform: "rotate(45deg)" }}
            />
            <div
              className="absolute inset-0 rounded-full border-[4px] border-border border-t-transparent border-l-transparent"
              style={{ transform: "rotate(135deg)" }}
            />

            <div className="text-center">
              <div className="font-mono text-lg leading-none font-black text-foreground">
                40
              </div>
              <div className="mt-0.5 text-[5px] font-bold text-primary uppercase">
                My Tasks
              </div>
            </div>
          </div>
          <div className="flex-1 space-y-1 text-[8px]">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-foreground">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />{" "}
                To Do
              </span>
              <span className="font-mono text-primary">12 (30%)</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-foreground">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />{" "}
                In Progress
              </span>
              <span className="font-mono text-primary">18 (45%)</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-foreground">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />{" "}
                Review
              </span>
              <span className="font-mono text-primary">6 (15%)</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-foreground">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />{" "}
                Done
              </span>
              <span className="font-mono text-primary">4 (10%)</span>
            </div>
          </div>
        </div>
        <button className="mt-3 flex w-full items-center justify-center gap-1 border-t border-border py-1.5 text-[8px] font-bold tracking-widest text-primary uppercase transition-colors hover:text-foreground">
          View My Tasks <ArrowRight className="h-2.5 w-2.5" />
        </button>
      </div>

      {/* Upcoming Deadlines */}
      <div className="bg-background rounded-xl border border-border p-4">
        <div className="mb-4 text-[9px] font-black tracking-widest text-primary uppercase">
          UPCOMING DEADLINES
        </div>
        <div className="space-y-3">
          {[
            {
              n: "Observe Hilal - West Indonesia",
              p: "Moon Observation",
              d: "May 27, 2025",
              l: "Tomorrow",
              c: "#F43F5E",
              i: Moon,
            },
            {
              n: "Analyze Moon Phase Data",
              p: "Astronomy Atlas",
              d: "May 28, 2025",
              l: "2 days left",
              c: "#F43F5E",
              i: Moon,
            },
            {
              n: "Translate Qur'an 2:184",
              p: "Qur'an Translation",
              d: "May 30, 2025",
              l: "4 days left",
              c: "#F59E0B",
              i: BookOpen,
            },
          ].map((dl, i) => (
            <div key={i} className="flex gap-3">
              <div className="bg-background flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border">
                <dl.i className="h-3.5 w-3.5 text-primary" />
              </div>
              <div className="flex-1 border-b border-border pb-2">
                <div className="mb-0.5 truncate text-[9px] leading-tight font-bold text-foreground">
                  {dl.n}
                </div>
                <div className="mb-1 text-[7px] text-primary uppercase">
                  {dl.p}
                </div>
                <div className="flex items-center justify-between font-mono text-[8px]">
                  <span className="text-primary">{dl.d}</span>
                  <span style={{ color: dl.c }}>{dl.l}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <button className="mt-2 flex w-full items-center justify-center gap-1 py-1.5 text-[8px] font-bold tracking-widest text-primary uppercase transition-colors hover:text-foreground">
          View Calendar <ArrowRight className="h-2.5 w-2.5" />
        </button>
      </div>

      {/* Team Workload */}
      <div className="bg-background rounded-xl border border-border p-4">
        <div className="mb-4 text-[9px] font-black tracking-widest text-primary uppercase">
          TEAM WORKLOAD
        </div>
        <div className="flex-1 space-y-3 text-[9px]">
          {[
            {
              n: "Ahmad Farisi",
              v: "8 / 12",
              s: "High",
              c: "#F43F5E",
              w: "66%",
            },
            {
              n: "Fatimah Zahra",
              v: "6 / 10",
              s: "Medium",
              c: "#F59E0B",
              w: "60%",
            },
            {
              n: "Muhammad Ridwan",
              v: "7 / 10",
              s: "High",
              c: "#F43F5E",
              w: "70%",
            },
            {
              n: "Aisha Nurul",
              v: "5 / 8",
              s: "Medium",
              c: "#F59E0B",
              w: "62%",
            },
            {
              n: "Omar Hassan",
              v: "9 / 12",
              s: "High",
              c: "#F43F5E",
              w: "75%",
            },
          ].map((tm, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-muted">
                <User className="h-3 w-3 text-primary" />
              </div>
              <div className="w-24 truncate text-foreground">{tm.n}</div>
              <div className="bg-background h-1 flex-1 overflow-hidden rounded-full">
                <div
                  className="h-full rounded-full"
                  style={{ width: tm.w, backgroundColor: tm.c }}
                />
              </div>
              <div className="w-8 text-right font-mono text-primary">
                {tm.v}
              </div>
              <div
                className="w-8 text-right font-bold"
                style={{ color: tm.c }}
              >
                {tm.s}
              </div>
            </div>
          ))}
        </div>
        <button className="mt-3 flex w-full items-center justify-center gap-1 border-t border-border py-1.5 text-[8px] font-bold tracking-widest text-primary uppercase transition-colors hover:text-foreground">
          View Team Tasks <ArrowRight className="h-2.5 w-2.5" />
        </button>
      </div>

      {/* AI Suggested Actions */}
      <div className="bg-background relative flex flex-1 flex-col overflow-hidden rounded-xl border border-primary/20 p-4">
        <div className="mb-3 text-[9px] font-black tracking-widest text-primary uppercase">
          AI SUGGESTED ACTIONS
        </div>
        <div className="flex-1 space-y-2.5">
          <div className="flex items-start gap-2">
            <Clock className="mt-0.5 h-3.5 w-3.5 shrink-0 text-rose-500" />
            <div className="text-[9px] leading-tight text-foreground">
              14 tasks are overdue. Consider rescheduling.
            </div>
          </div>
          <div className="flex items-start gap-2">
            <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-warning" />
            <div className="text-[9px] leading-tight text-foreground">
              You have 6 high priority tasks due this week.
            </div>
          </div>
          <div className="flex items-start gap-2">
            <User className="mt-0.5 h-3.5 w-3.5 shrink-0 text-rose-500" />
            <div className="text-[9px] leading-tight text-foreground">
              Fatimah Zahra has high workload next 3 days.
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Target className="mt-0.5 h-3.5 w-3.5 shrink-0 text-success" />
            <div className="text-[9px] leading-tight text-foreground">
              Observation coverage is low in West Indonesia.
            </div>
          </div>
        </div>
        <button className="mt-2 flex items-center justify-center gap-1 text-[8px] font-bold text-primary transition-colors hover:text-foreground">
          View All Suggestions <ArrowRight className="h-2.5 w-2.5" />
        </button>
      </div>
    </div>
  )
}
