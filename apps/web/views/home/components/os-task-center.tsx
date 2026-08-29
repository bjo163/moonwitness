"use client"
import Image from "next/image"

import React, { useState, useEffect } from "react"
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
  Clock,
  AlertTriangle,
  MoreHorizontal,
  ArrowRight,
  Filter,
  Calendar,
  List,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Moon,
  Activity,
  BookOpen,
} from "lucide-react"

export function OSTaskCenter() {
  const [clockWIB, setClockWIB] = useState("07:13:45 WIB")

  useEffect(() => {
    const tick = () => {
      const now = new Date()
      setClockWIB(
        now.toLocaleTimeString("en-US", {
          hour12: false,
          timeZone: "Asia/Jakarta",
        }) + " WIB"
      )
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <section
      id="tasks"
      className="bg-background relative z-10 overflow-hidden border-b border-primary/30 py-20 font-mono text-foreground"
    >
      {/* ═══ LAYER 1: DEEP SPACE BACKGROUND ══════════════════════════════════ */}
      <div className="pointer-events-none absolute inset-0">
        <div className="theme-grid-bg absolute inset-0 opacity-20" />
        <div className="bg-radial-gradient absolute top-1/4 right-1/4 h-[800px] w-[1200px] from-primary/10 via-blue-900/5 to-transparent blur-[120px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-[1700px] space-y-4 px-4">
        {/* ═══ TOP HEADER (Blueprint 16) ══════════════════════════════════════ */}
        <div className="flex flex-col justify-between gap-4 border-b border-white/10 pb-4 xl:flex-row xl:items-center">
          <div className="flex items-center gap-4">
            <div className="bg-background inline-flex items-center gap-3 rounded-sm border-2 border-border px-3.5 py-1.5 text-xs font-black tracking-[0.25em] text-primary uppercase shadow-sm">
              <span className="rounded-xs bg-primary px-1.5 py-0.5 font-black text-black">
                16
              </span>
              <span>TASK CENTER</span>
            </div>
            <div>
              <h2 className="ml-2 font-mono text-sm font-black tracking-widest text-primary uppercase">
                Organize. Prioritize. Execute.
              </h2>
              <div className="ml-2 text-[9px] tracking-wide text-primary uppercase">
                Manage tasks, track progress, and achieve meaningful impact
                together.
              </div>
            </div>
          </div>
        </div>

        {/* ═══ LAYER 2: MAIN WORKSPACE (3 Columns) ════════════════════════════ */}
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
          {/* LEFT COLUMN: Sidebar (Col 1-2) */}
          <div className="flex flex-col gap-4 xl:col-span-2">
            {/* Nav Menu */}
            <div className="bg-background space-y-1 rounded-xl border border-white/10 p-2 text-[9px] font-bold tracking-widest text-primary uppercase">
              <div className="flex cursor-pointer items-center justify-between rounded-r border-l-2 border-primary bg-primary/10 px-3 py-2.5 text-primary">
                <span className="flex items-center gap-2">
                  <LayoutDashboard className="h-3.5 w-3.5" /> Overview
                </span>
              </div>
              <div className="flex cursor-pointer items-center justify-between rounded px-3 py-2 transition-colors hover:bg-white/5">
                <span className="flex items-center gap-2">
                  <CheckSquare className="h-3.5 w-3.5" /> My Tasks
                </span>
                <span className="font-mono text-primary">28</span>
              </div>
              <div className="flex cursor-pointer items-center justify-between rounded px-3 py-2 transition-colors hover:bg-white/5">
                <span className="flex items-center gap-2">
                  <User className="h-3.5 w-3.5" /> Assigned to me
                </span>
                <span className="font-mono text-amber-500">15</span>
              </div>
              <div className="flex cursor-pointer items-center justify-between rounded px-3 py-2 transition-colors hover:bg-white/5">
                <span className="flex items-center gap-2">
                  <Users className="h-3.5 w-3.5" /> Team Tasks
                </span>
                <span className="font-mono text-primary">86</span>
              </div>
              <div className="flex cursor-pointer items-center justify-between rounded px-3 py-2 transition-colors hover:bg-white/5">
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Review & Approval
                </span>
                <span className="text-knowledge font-mono">12</span>
              </div>
              <div className="flex cursor-pointer items-center justify-between rounded px-3 py-2 transition-colors hover:bg-white/5">
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Completed
                </span>
                <span className="font-mono text-emerald-400">342</span>
              </div>
              <div className="flex cursor-pointer items-center justify-between rounded px-3 py-2 transition-colors hover:bg-white/5">
                <span className="flex items-center gap-2">
                  <Archive className="h-3.5 w-3.5" /> Archived
                </span>
              </div>
            </div>

            {/* Quick Create */}
            <div className="bg-background rounded-xl border border-white/10 p-3">
              <div className="mb-3 text-[9px] font-black tracking-widest text-primary uppercase">
                QUICK CREATE
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button className="flex items-center justify-center gap-1.5 rounded border border-primary/30 bg-primary/10 p-2 text-[8px] font-bold text-primary uppercase transition-colors hover:bg-primary/20">
                  <Plus className="h-3 w-3" /> New Task
                </button>
                <button className="bg-background flex items-center justify-center gap-1.5 rounded border border-white/10 p-2 text-[8px] font-bold text-primary uppercase transition-colors hover:bg-white/10 hover:text-white">
                  <Upload className="h-3 w-3" /> Import Tasks
                </button>
                <button className="bg-background flex items-center justify-center gap-1.5 rounded border border-white/10 p-2 text-[8px] font-bold text-primary uppercase transition-colors hover:bg-white/10 hover:text-white">
                  <Repeat className="h-3 w-3" /> Recurring Task
                </button>
                <button className="bg-background flex items-center justify-center gap-1.5 rounded border border-white/10 p-2 text-[8px] font-bold text-primary uppercase transition-colors hover:bg-white/10 hover:text-white">
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
                  <div className="mb-1 text-[10px] font-bold text-white">
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
            <div className="bg-background rounded-xl border border-white/10 p-4">
              <div className="mb-4 text-[9px] font-black tracking-widest text-primary uppercase">
                TASK INSIGHTS
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="bg-background rounded border border-white/10 p-1.5">
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
                    <div className="font-mono text-sm leading-tight font-black text-white">
                      38
                    </div>
                    <div className="font-mono text-[8px] font-bold text-emerald-400">
                      +22%
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="bg-background rounded border border-white/10 p-1.5">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                    </div>
                    <div>
                      <div className="text-[8px] text-primary uppercase">
                        Tasks Completed
                      </div>
                      <div className="text-[7px] text-primary">This Week</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono text-sm leading-tight font-black text-white">
                      52
                    </div>
                    <div className="font-mono text-[8px] font-bold text-emerald-400">
                      +31%
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-white/10 pt-3">
                  <div className="text-center">
                    <div className="mb-0.5 text-[8px] text-primary uppercase">
                      On Track
                    </div>
                    <div className="font-mono text-sm font-black text-emerald-400">
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

          {/* CENTER COLUMN: Main Workspace (Col 3-9) */}
          <div className="flex flex-col gap-4 xl:col-span-7">
            {/* Task Overview Stats */}
            <div className="bg-background rounded-xl border border-white/10 p-4">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2 text-[10px] font-black tracking-widest text-primary uppercase">
                  <CheckSquare className="h-4 w-4" /> TASK OVERVIEW
                </div>
                <div className="flex gap-2">
                  <button className="bg-background flex items-center gap-1 rounded border border-white/10 px-2 py-1 text-[8px] text-primary transition-colors hover:bg-white/5">
                    <Filter className="h-3 w-3" /> Filters ∨
                  </button>
                  <button className="bg-background flex items-center gap-1 rounded border border-white/10 px-2 py-1 text-[8px] text-primary transition-colors hover:bg-white/5">
                    Group by: <span className="text-primary">Status</span> ∨
                  </button>
                  <button className="bg-background flex items-center gap-1 rounded border border-white/10 px-2 py-1 text-[8px] text-primary transition-colors hover:bg-white/5">
                    Sort by: <span className="text-primary">Priority</span> ∨
                  </button>
                  <div className="bg-background ml-2 flex overflow-hidden rounded border border-white/10">
                    <button className="bg-white/10 px-2 py-1 text-white">
                      <List className="h-3 w-3" />
                    </button>
                    <button className="px-2 py-1 text-primary hover:bg-white/5">
                      <Calendar className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 lg:grid-cols-6">
                <div className="bg-background col-span-2 flex flex-col items-center justify-center rounded border-b-2 border-border p-3 text-center">
                  <div className="mb-1 text-[8px] font-bold tracking-widest text-primary uppercase">
                    TOTAL TASKS
                  </div>
                  <div className="mb-1 font-mono text-3xl leading-none font-black text-white">
                    238
                  </div>
                  <div className="text-[8px] font-bold text-primary">
                    +18 this week
                  </div>
                </div>
                {[
                  { n: "TO DO", v: 78, p: "32.8%", c: "#3B82F6", i: Clock },
                  {
                    n: "IN PROGRESS",
                    v: 96,
                    p: "40.3%",
                    c: "#F59E0B",
                    i: Activity,
                  },
                  {
                    n: "REVIEW",
                    v: 38,
                    p: "16.0%",
                    c: "#A855F7",
                    i: CheckSquare,
                  },
                  {
                    n: "DONE",
                    v: 26,
                    p: "10.9%",
                    c: "#10B981",
                    i: CheckCircle2,
                  },
                ].map((st, i) => (
                  <div
                    key={i}
                    className="bg-background flex flex-col items-center justify-center rounded border-b-2 p-3 text-center"
                    style={{ borderColor: st.c }}
                  >
                    <div
                      className="mb-1 text-[7px] font-bold tracking-widest uppercase"
                      style={{ color: st.c }}
                    >
                      {st.n}
                    </div>
                    <div className="mb-1 font-mono text-2xl leading-none font-black text-white">
                      {st.v}
                    </div>
                    <div className="font-mono text-[8px] text-primary">
                      {st.p}
                    </div>
                  </div>
                ))}
                <div className="flex flex-col items-center justify-center rounded border-b-2 border-rose-500 bg-rose-950/20 p-3 text-center">
                  <div className="mb-1 text-[7px] font-bold tracking-widest text-rose-500 uppercase">
                    OVERDUE
                  </div>
                  <div className="mb-1 font-mono text-2xl leading-none font-black text-white">
                    14
                  </div>
                  <div className="font-mono text-[8px] text-rose-500">5.9%</div>
                </div>
              </div>
            </div>

            {/* Task List Table */}
            <div className="bg-background flex flex-1 flex-col rounded-xl border border-white/10 p-4">
              {/* Tabs */}
              <div className="mb-4 flex gap-4 border-b border-white/10 px-2 text-[9px] font-bold tracking-widest text-primary uppercase">
                <button className="border-b-2 border-primary py-2 text-primary">
                  All Tasks
                </button>
                <button className="py-2 transition-colors hover:text-white">
                  High Priority
                </button>
                <button className="py-2 transition-colors hover:text-white">
                  Due Today
                </button>
                <button className="py-2 transition-colors hover:text-white">
                  This Week
                </button>
                <button className="py-2 transition-colors hover:text-white">
                  Overdue
                </button>
              </div>

              {/* Table Header */}
              <div className="grid grid-cols-12 gap-2 border-b border-white/5 px-2 pb-2 text-[8px] font-black tracking-widest text-primary uppercase">
                <div className="col-span-4 flex gap-2">
                  <div className="h-4 w-4 rounded-sm border border-white/20" />{" "}
                  TASK
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
                    prioC: "#F43F5E",
                    stat: "In Progress",
                    statC: "#F59E0B",
                    date: "May 27, 2025",
                    prog: 70,
                  },
                  {
                    t: "Analyze Moon Phase Data",
                    tag: "Research",
                    proj: "Astronomy Atlas",
                    asg: "Fatimah Zahra",
                    prio: "HIGH",
                    prioC: "#F43F5E",
                    stat: "In Progress",
                    statC: "#F59E0B",
                    date: "May 28, 2025",
                    prog: 45,
                  },
                  {
                    t: "Translate Qur'an 2:184",
                    tag: "Translation",
                    proj: "Qur'an Translation",
                    asg: "Muhammad Ridwan",
                    prio: "MEDIUM",
                    prioC: "#F59E0B",
                    stat: "Review",
                    statC: "#A855F7",
                    date: "May 30, 2025",
                    prog: 80,
                  },
                  {
                    t: "Verify Historical Event - Badr",
                    tag: "History",
                    proj: "Islamic History",
                    asg: "Aisha Nurul",
                    prio: "MEDIUM",
                    prioC: "#F59E0B",
                    stat: "To Do",
                    statC: "#3B82F6",
                    date: "Jun 01, 2025",
                    prog: 0,
                  },
                  {
                    t: "Develop AI Hilal Detection Model",
                    tag: "AI & ML",
                    proj: "AI Systems",
                    asg: "Omar Hassan",
                    prio: "HIGH",
                    prioC: "#F43F5E",
                    stat: "In Progress",
                    statC: "#F59E0B",
                    date: "Jun 03, 2025",
                    prog: 60,
                  },
                  {
                    t: "Collect Data - Cloud Coverage",
                    tag: "Environment",
                    proj: "Climate Monitor",
                    asg: "Yusuf Al-Kaff",
                    prio: "LOW",
                    prioC: "#10B981",
                    stat: "To Do",
                    statC: "#3B82F6",
                    date: "Jun 04, 2025",
                    prog: 0,
                  },
                  {
                    t: "Create Educational Content - Moon",
                    tag: "Education",
                    proj: "Content Creation",
                    asg: "Zainab Azzahra",
                    prio: "MEDIUM",
                    prioC: "#F59E0B",
                    stat: "Review",
                    statC: "#A855F7",
                    date: "Jun 05, 2025",
                    prog: 75,
                  },
                  {
                    t: "Prepare Monthly Report - May",
                    tag: "Reporting",
                    proj: "Monthly Reports",
                    asg: "Ahmad Farisi",
                    prio: "HIGH",
                    prioC: "#F43F5E",
                    stat: "To Do",
                    statC: "#3B82F6",
                    date: "Jun 06, 2025",
                    prog: 10,
                  },
                ].map((row, i) => (
                  <div
                    key={i}
                    className="group grid cursor-pointer grid-cols-12 items-center gap-2 rounded border border-transparent p-2 text-[9px] transition-colors hover:border-white/5 hover:bg-white/5"
                  >
                    <div className="col-span-4 flex items-center gap-2">
                      <div className="h-3.5 w-3.5 shrink-0 rounded-sm border border-white/20" />
                      <div>
                        <div className="truncate font-bold text-white transition-colors group-hover:text-primary">
                          {row.t}
                        </div>
                        <div className="mt-0.5 inline-block rounded border border-white/10 bg-primary px-1.5 py-[1px] text-[6px] text-primary">
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
                        style={{ color: row.prioC }}
                      >
                        {row.prio}
                      </span>
                    </div>
                    <div className="col-span-1 flex justify-center">
                      <span
                        className="rounded border px-1.5 py-0.5 text-[8px] whitespace-nowrap"
                        style={{
                          borderColor: `${row.statC}50`,
                          color: row.statC,
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
                            backgroundColor: row.statC,
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
              <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-3 text-[9px] text-primary">
                <div>Showing 1 to 8 of 238 tasks</div>
                <div className="flex items-center gap-1">
                  <button className="p-1 hover:text-white">
                    <ChevronLeft className="h-3.5 w-3.5" />
                  </button>
                  <button className="flex h-5 w-5 items-center justify-center rounded border border-primary/50 bg-primary/20 text-primary">
                    1
                  </button>
                  <button className="flex h-5 w-5 items-center justify-center rounded hover:bg-white/5">
                    2
                  </button>
                  <button className="flex h-5 w-5 items-center justify-center rounded hover:bg-white/5">
                    3
                  </button>
                  <span>...</span>
                  <button className="flex h-5 w-5 items-center justify-center rounded hover:bg-white/5">
                    30
                  </button>
                  <button className="p-1 hover:text-white">
                    <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <span>Rows per page:</span>
                  <button className="bg-background flex items-center gap-1 rounded border border-white/10 px-2 py-1 text-white">
                    10 <ChevronDown className="h-3 w-3" />
                  </button>
                </div>
              </div>
            </div>

            {/* Bottom Analytics Row */}
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
              {/* Task Priority Distribution */}
              <div className="bg-background flex flex-col rounded-xl border border-white/10 p-4">
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
                      <div className="font-mono text-lg leading-none font-black text-white">
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
                      <span className="w-10 text-white/80">High</span>{" "}
                      <span className="font-mono text-primary">68 (28.6%)</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />{" "}
                      <span className="w-10 text-white/80">Medium</span>{" "}
                      <span className="font-mono text-primary">
                        102 (42.9%)
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />{" "}
                      <span className="w-10 text-white/80">Low</span>{" "}
                      <span className="font-mono text-primary">48 (20.2%)</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary" />{" "}
                      <span className="w-10 text-white/80">None</span>{" "}
                      <span className="font-mono text-primary">20 (8.3%)</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Task Progress Trend */}
              <div className="bg-background flex flex-col rounded-xl border border-white/10 p-4">
                <div className="mb-4 text-[9px] font-black tracking-widest text-primary uppercase">
                  TASK PROGRESS TREND
                </div>

                <div className="relative mt-2 ml-5 min-h-[100px] flex-1 border-b border-l border-white/10">
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
                    <span className="h-1.5 w-1.5 rounded-full bg-blue-500" /> To
                    Do
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />{" "}
                    In Progress
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />{" "}
                    Done
                  </span>
                </div>
              </div>

              {/* Tasks by Project */}
              <div className="bg-background flex flex-col rounded-xl border border-white/10 p-4">
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
                      <div className="w-20 truncate text-white/80">
                        {proj.n}
                      </div>
                      <div className="bg-background h-1 flex-1 overflow-hidden rounded-full">
                        <div
                          className="h-full rounded-full"
                          style={{ width: proj.p, backgroundColor: proj.c }}
                        />
                      </div>
                      <div className="w-12 text-right font-mono text-white">
                        {proj.v}{" "}
                        <span className="text-primary">({proj.p})</span>
                      </div>
                    </div>
                  ))}
                </div>
                <button className="mt-2 flex items-center justify-center gap-1 text-[8px] font-bold tracking-widest text-primary uppercase transition-colors hover:text-white">
                  View All Projects <ArrowRight className="h-2.5 w-2.5" />
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Summary & Deadlines (Col 10-12) */}
          <div className="flex flex-col gap-4 xl:col-span-3">
            {/* My Tasks Summary */}
            <div className="bg-background rounded-xl border border-white/10 p-4">
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
                    <div className="font-mono text-lg leading-none font-black text-white">
                      40
                    </div>
                    <div className="mt-0.5 text-[5px] font-bold text-primary uppercase">
                      My Tasks
                    </div>
                  </div>
                </div>
                <div className="flex-1 space-y-1 text-[8px]">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-white/80">
                      <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />{" "}
                      To Do
                    </span>
                    <span className="font-mono text-primary">12 (30%)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-white/80">
                      <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />{" "}
                      In Progress
                    </span>
                    <span className="font-mono text-primary">18 (45%)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-white/80">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary" />{" "}
                      Review
                    </span>
                    <span className="font-mono text-primary">6 (15%)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-white/80">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />{" "}
                      Done
                    </span>
                    <span className="font-mono text-primary">4 (10%)</span>
                  </div>
                </div>
              </div>
              <button className="mt-3 flex w-full items-center justify-center gap-1 border-t border-white/10 py-1.5 text-[8px] font-bold tracking-widest text-primary uppercase transition-colors hover:text-white">
                View My Tasks <ArrowRight className="h-2.5 w-2.5" />
              </button>
            </div>

            {/* Upcoming Deadlines */}
            <div className="bg-background rounded-xl border border-white/10 p-4">
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
                    <div className="bg-background flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/10">
                      <dl.i className="h-3.5 w-3.5 text-primary" />
                    </div>
                    <div className="flex-1 border-b border-white/5 pb-2">
                      <div className="mb-0.5 truncate text-[9px] leading-tight font-bold text-white">
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
              <button className="mt-2 flex w-full items-center justify-center gap-1 py-1.5 text-[8px] font-bold tracking-widest text-primary uppercase transition-colors hover:text-white">
                View Calendar <ArrowRight className="h-2.5 w-2.5" />
              </button>
            </div>

            {/* Team Workload */}
            <div className="bg-background rounded-xl border border-white/10 p-4">
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
                    <div className="w-24 truncate text-white/80">{tm.n}</div>
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
              <button className="mt-3 flex w-full items-center justify-center gap-1 border-t border-white/10 py-1.5 text-[8px] font-bold tracking-widest text-primary uppercase transition-colors hover:text-white">
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
                  <div className="text-[9px] leading-tight text-white/80">
                    14 tasks are overdue. Consider rescheduling.
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-500" />
                  <div className="text-[9px] leading-tight text-white/80">
                    You have 6 high priority tasks due this week.
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <User className="mt-0.5 h-3.5 w-3.5 shrink-0 text-rose-500" />
                  <div className="text-[9px] leading-tight text-white/80">
                    Fatimah Zahra has high workload next 3 days.
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Target className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-500" />
                  <div className="text-[9px] leading-tight text-white/80">
                    Observation coverage is low in West Indonesia.
                  </div>
                </div>
              </div>
              <button className="mt-2 flex items-center justify-center gap-1 text-[8px] font-bold text-primary transition-colors hover:text-white">
                View All Suggestions <ArrowRight className="h-2.5 w-2.5" />
              </button>
            </div>
          </div>
        </div>

        {/* ═══ LAYER 3: FOOTER GRAPHIC ════════════════════════════════════════ */}
        <div className="bg-background relative mt-4 flex min-h-[150px] flex-1 flex-col items-center justify-center overflow-hidden rounded-xl border border-white/10 text-center">
          <div className="absolute inset-0 bg-[url('/assets/landscape-temp.jpg')] bg-cover bg-center opacity-20 mix-blend-screen" />
          <div className="from-space via-space/50 absolute inset-0 z-10 bg-gradient-to-t to-transparent" />

          <div className="relative z-20 px-8">
            <div
              className="font-arabic mb-3 text-[20px] font-bold text-white"
              dir="rtl"
            >
              وَقُل رَّبِّ زِدْنِي عِلْمًا
            </div>
            <div className="mb-2 font-sans text-[11px] text-white/80 italic">
              "And say, 'My Lord, increase me in knowledge.'"
            </div>
            <div className="font-mono text-[9px] font-bold tracking-widest text-primary uppercase">
              (Qur&apos;an 20:114)
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
