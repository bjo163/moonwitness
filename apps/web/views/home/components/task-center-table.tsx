"use client"

import React from "react"
import {
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  User,
} from "lucide-react"
import { Button, resolveSemanticColor, type SemanticColorToken } from "@workspace/ui"

export function TaskCenterTable() {
  return (
    <div className="bg-background flex flex-1 flex-col rounded-xl border border-border p-4">
      {/* Tabs */}
      <div className="mb-4 flex gap-4 border-b border-border px-2 text-[9px] font-bold tracking-widest text-primary uppercase">
        <Button type="button" variant="ghost" size="sm" className="border-b-2 border-primary py-2 text-primary">
          All Tasks
        </Button>
        <Button type="button" variant="ghost" size="sm" className="py-2 transition-colors">
          High Priority
        </Button>
        <Button type="button" variant="ghost" size="sm" className="py-2 transition-colors">
          Due Today
        </Button>
        <Button type="button" variant="ghost" size="sm" className="py-2 transition-colors">
          This Week
        </Button>
        <Button type="button" variant="ghost" size="sm" className="py-2 transition-colors">
          Overdue
        </Button>
      </div>

      {/* Table Header */}
      <div className="grid grid-cols-12 gap-2 border-b border-border px-2 pb-2 text-[8px] font-black tracking-widest text-primary uppercase">
        <div className="col-span-4 flex gap-2">
          <div className="h-4 w-4 rounded-sm border border-border" /> TASK
        </div>
        <div className="col-span-2">PROJECT</div>
        <div className="col-span-2">ASSIGNEE</div>
        <div className="col-span-1 text-center">PRIORITY</div>
        <div className="col-span-1 text-center">STATUS</div>
        <div className="col-span-1 text-center">DUE DATE</div>
        <div className="col-span-1 text-right">PROGRESS</div>
      </div>

      {/* Table Body */}
      <div className="hide-scrollbar mt-2 flex-1 space-y-1 overflow-y-auto">
        {[
          {
            t: "Observe Hilal - West Indonesia",
            tag: "Observation",
            proj: "Moon Observation",
            asg: "Ahmad Farisi",
            prio: "HIGH",
            prioC: "destructive" as SemanticColorToken,
            stat: "In Progress",
            statC: "warning" as SemanticColorToken,
            date: "May 27, 2025",
            prog: 70,
          },
          {
            t: "Analyze Moon Phase Data",
            tag: "Research",
            proj: "Astronomy Atlas",
            asg: "Fatimah Zahra",
            prio: "HIGH",
            prioC: "destructive" as SemanticColorToken,
            stat: "In Progress",
            statC: "warning" as SemanticColorToken,
            date: "May 28, 2025",
            prog: 45,
          },
          {
            t: "Translate Qur'an 2:184",
            tag: "Translation",
            proj: "Qur'an Translation",
            asg: "Muhammad Ridwan",
            prio: "MEDIUM",
            prioC: "warning" as SemanticColorToken,
            stat: "Review",
            statC: "info" as SemanticColorToken,
            date: "May 30, 2025",
            prog: 80,
          },
          {
            t: "Verify Historical Event - Badr",
            tag: "History",
            proj: "Islamic History",
            asg: "Aisha Nurul",
            prio: "MEDIUM",
            prioC: "warning" as SemanticColorToken,
            stat: "To Do",
            statC: "primary" as SemanticColorToken,
            date: "Jun 01, 2025",
            prog: 0,
          },
          {
            t: "Develop AI Hilal Detection Model",
            tag: "AI & ML",
            proj: "AI Systems",
            asg: "Omar Hassan",
            prio: "HIGH",
            prioC: "destructive" as SemanticColorToken,
            stat: "In Progress",
            statC: "warning" as SemanticColorToken,
            date: "Jun 03, 2025",
            prog: 60,
          },
          {
            t: "Collect Data - Cloud Coverage",
            tag: "Environment",
            proj: "Climate Monitor",
            asg: "Yusuf Al-Kaff",
            prio: "LOW",
            prioC: "success" as SemanticColorToken,
            stat: "To Do",
            statC: "primary" as SemanticColorToken,
            date: "Jun 04, 2025",
            prog: 0,
          },
          {
            t: "Create Educational Content - Moon",
            tag: "Education",
            proj: "Content Creation",
            asg: "Zainab Azzahra",
            prio: "MEDIUM",
            prioC: "warning" as SemanticColorToken,
            stat: "Review",
            statC: "info" as SemanticColorToken,
            date: "Jun 05, 2025",
            prog: 75,
          },
          {
            t: "Prepare Monthly Report - May",
            tag: "Reporting",
            proj: "Monthly Reports",
            asg: "Ahmad Farisi",
            prio: "HIGH",
            prioC: "destructive" as SemanticColorToken,
            stat: "To Do",
            statC: "primary" as SemanticColorToken,
            date: "Jun 06, 2025",
            prog: 10,
          },
        ].map((row, i) => (
          <div
            key={i}
            className="group grid cursor-pointer grid-cols-12 items-center gap-2 rounded border border-transparent p-2 text-[9px] transition-colors hover:border-border hover:bg-muted/30"
          >
            <div className="col-span-4 flex items-center gap-2">
              <div className="h-3.5 w-3.5 shrink-0 rounded-sm border border-border" />
              <div>
                <div className="truncate font-bold text-foreground transition-colors group-hover:text-primary">
                  {row.t}
                </div>
                <div className="mt-0.5 inline-block rounded border border-border bg-primary px-1.5 py-[1px] text-[6px] text-primary">
                  {row.tag}
                </div>
              </div>
            </div>
            <div className="col-span-2 truncate text-primary">
              {row.proj}
            </div>
            <div className="col-span-2 flex items-center gap-1.5 truncate text-primary">
              <div className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-muted">
                <User className="h-2.5 w-2.5 text-primary" />
              </div>
              {row.asg}
            </div>
            <div className="col-span-1 flex justify-center">
              <span
                className="text-[8px] font-bold"
            style={{ color: resolveSemanticColor(row.prioC) }}
              >
                {row.prio}
              </span>
            </div>
            <div className="col-span-1 flex justify-center">
              <span
                className="rounded border px-1.5 py-0.5 text-[8px] whitespace-nowrap"
                style={{
                  borderColor: resolveSemanticColor(row.statC),
                  color: resolveSemanticColor(row.statC),
                }}
              >
                {row.stat}
              </span>
            </div>
            <div className="col-span-1 text-center font-mono text-primary">
              {row.date}
            </div>
            <div className="col-span-1 flex items-center gap-2">
              <div className="bg-background h-1 flex-1 overflow-hidden rounded-full">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${row.prog}%`,
                    backgroundColor: resolveSemanticColor(row.statC),
                  }}
                />
              </div>
              <span className="w-5 text-right font-mono text-primary">
                {row.prog}%
              </span>
              <MoreHorizontal className="h-3.5 w-3.5 text-primary opacity-0 transition-opacity group-hover:opacity-100" />
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="mt-4 flex items-center justify-between border-t border-border pt-3 text-[9px] text-primary">
        <div>Showing 1 to 8 of 238 tasks</div>
        <div className="flex items-center gap-1">
          <Button type="button" variant="ghost" size="icon-xs">
            <ChevronLeft className="h-3.5 w-3.5" />
          </Button>
          <Button type="button" variant="outline" size="icon-xs" className="border-primary/50 bg-primary/20 text-primary">
            1
          </Button>
          <Button type="button" variant="ghost" size="icon-xs">
            2
          </Button>
          <Button type="button" variant="ghost" size="icon-xs">
            3
          </Button>
          <span>...</span>
          <Button type="button" variant="ghost" size="icon-xs">
            30
          </Button>
          <button className="p-1 hover:text-foreground">
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
        <div className="flex items-center gap-2">
          <span>Rows per page:</span>
          <Button type="button" variant="outline" size="sm" className="bg-background text-foreground">
            10 <ChevronDown className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </div>
  )
}
