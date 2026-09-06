"use client"

import React from "react"
import {
  CheckSquare,
  LayoutDashboard,
  User,
  Users,
  CheckCircle2,
  Archive,
  Plus,
  Upload,
  Repeat,
  FileCode2,
  Target,
} from "lucide-react"

export function TaskCenterSidebar() {
  return (
    <div className="flex flex-col gap-4 xl:col-span-2">
      {/* Nav Menu */}
      <div className="bg-background space-y-1 rounded-xl border border-border p-2 text-[9px] font-bold tracking-widest text-primary uppercase">
        <div className="flex cursor-pointer items-center justify-between rounded-r border-l-2 border-primary bg-primary/10 px-3 py-2.5 text-primary">
          <span className="flex items-center gap-2">
            <LayoutDashboard className="h-3.5 w-3.5" /> Overview
          </span>
        </div>
        <div className="flex cursor-pointer items-center justify-between rounded px-3 py-2 transition-colors hover:bg-muted/30">
          <span className="flex items-center gap-2">
            <CheckSquare className="h-3.5 w-3.5" /> My Tasks
          </span>
          <span className="font-mono text-primary">28</span>
        </div>
        <div className="flex cursor-pointer items-center justify-between rounded px-3 py-2 transition-colors hover:bg-muted/30">
          <span className="flex items-center gap-2">
            <User className="h-3.5 w-3.5" /> Assigned to me
          </span>
          <span className="font-mono text-warning">15</span>
        </div>
        <div className="flex cursor-pointer items-center justify-between rounded px-3 py-2 transition-colors hover:bg-muted/30">
          <span className="flex items-center gap-2">
            <Users className="h-3.5 w-3.5" /> Team Tasks
          </span>
          <span className="font-mono text-primary">86</span>
        </div>
        <div className="flex cursor-pointer items-center justify-between rounded px-3 py-2 transition-colors hover:bg-muted/30">
          <span className="flex items-center gap-2">
            <CheckCircle2 className="h-3.5 w-3.5" /> Review & Approval
          </span>
          <span className="text-knowledge font-mono">12</span>
        </div>
        <div className="flex cursor-pointer items-center justify-between rounded px-3 py-2 transition-colors hover:bg-muted/30">
          <span className="flex items-center gap-2">
            <CheckCircle2 className="h-3.5 w-3.5" /> Completed
          </span>
          <span className="font-mono text-success">342</span>
        </div>
        <div className="flex cursor-pointer items-center justify-between rounded px-3 py-2 transition-colors hover:bg-muted/30">
          <span className="flex items-center gap-2">
            <Archive className="h-3.5 w-3.5" /> Archived
          </span>
        </div>
      </div>

      {/* Quick Create */}
      <div className="bg-background rounded-xl border border-border p-3">
        <div className="mb-3 text-[9px] font-black tracking-widest text-primary uppercase">
          QUICK CREATE
        </div>
        <div className="grid grid-cols-2 gap-2">
          <button className="flex items-center justify-center gap-1.5 rounded border border-primary/30 bg-primary/10 p-2 text-[8px] font-bold text-primary uppercase transition-colors hover:bg-primary/20">
            <Plus className="h-3 w-3" /> New Task
          </button>
          <button className="bg-background flex items-center justify-center gap-1.5 rounded border border-border p-2 text-[8px] font-bold text-primary uppercase transition-colors hover:bg-muted/30 hover:text-foreground">
            <Upload className="h-3 w-3" /> Import Tasks
          </button>
          <button className="bg-background flex items-center justify-center gap-1.5 rounded border border-border p-2 text-[8px] font-bold text-primary uppercase transition-colors hover:bg-muted/30 hover:text-foreground">
            <Repeat className="h-3 w-3" /> Recurring Task
          </button>
          <button className="bg-background flex items-center justify-center gap-1.5 rounded border border-border p-2 text-[8px] font-bold text-primary uppercase transition-colors hover:bg-muted/30 hover:text-foreground">
            <FileCode2 className="h-3 w-3" /> Task Template
          </button>
        </div>
      </div>

      {/* AI Task Assistant */}
      <div className="bg-background group relative overflow-hidden rounded-xl border-2 border-primary/30 p-4 shadow-sm">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-50 transition-opacity group-hover:opacity-100" />

        <div className="relative z-10 mb-3 flex items-center justify-between">
          <div className="text-[9px] font-black tracking-widest text-primary uppercase">
            AI TASK ASSISTANT
          </div>
          <div className="rounded border border-primary/50 bg-primary/30 px-1.5 py-0.5 text-[7px] font-bold text-primary uppercase">
            BETA
          </div>
        </div>

        <div className="relative z-10 flex gap-3">
          <div className="bg-background h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-primary/50">
            <img
              alt="Media"
              src="/assets/mod_khidra.png"
              className="h-full w-full object-cover opacity-90 mix-blend-screen"
            />
          </div>
          <div>
            <div className="mb-1 text-[10px] font-bold text-foreground">
              Hi, I&apos;m KHIDRA.
            </div>
            <div className="font-sans text-[8px] leading-relaxed text-primary/70">
              I can help you plan, prioritize, and execute tasks more
              effectively.
            </div>
          </div>
        </div>
        <button className="mt-3 flex w-full items-center justify-center rounded border border-primary/50 bg-transparent py-2 text-[9px] font-bold tracking-widest text-primary uppercase transition-colors hover:bg-primary/20">
          ASK KHIDRA
        </button>
      </div>

      {/* Task Insights */}
      <div className="bg-background rounded-xl border border-border p-4">
        <div className="mb-4 text-[9px] font-black tracking-widest text-primary uppercase">
          TASK INSIGHTS
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="bg-background rounded border border-border p-1.5">
                <Target className="h-3.5 w-3.5 text-blue-400" />
              </div>
              <div>
                <div className="text-[8px] text-primary uppercase">
                  Tasks Created
                </div>
                <div className="text-[7px] text-primary">This Week</div>
              </div>
            </div>
            <div className="text-right">
              <div className="font-mono text-sm leading-tight font-black text-foreground">
                38
              </div>
              <div className="font-mono text-[8px] font-bold text-success">
                +22%
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="bg-background rounded border border-border p-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-success" />
              </div>
              <div>
                <div className="text-[8px] text-primary uppercase">
                  Tasks Completed
                </div>
                <div className="text-[7px] text-primary">This Week</div>
              </div>
            </div>
            <div className="text-right">
              <div className="font-mono text-sm leading-tight font-black text-foreground">
                52
              </div>
              <div className="font-mono text-[8px] font-bold text-success">
                +31%
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-border pt-3">
            <div className="text-center">
              <div className="mb-0.5 text-[8px] text-primary uppercase">
                On Track
              </div>
              <div className="font-mono text-sm font-black text-success">
                92%
              </div>
            </div>
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-rose-500/20 border-t-rose-500">
              <span className="text-[8px] font-black text-rose-500">
                A
              </span>
            </div>
            <div className="text-center">
              <div className="mb-0.5 text-[8px] text-primary uppercase">
                At Risk
              </div>
              <div className="font-mono text-sm font-black text-rose-500">
                8%
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
