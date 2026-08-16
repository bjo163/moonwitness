"use client"

import React, { useState } from "react"
import { ContextBlock } from "@core/ui"
import { MoonDataTable, CrudColumn } from "@core/widgets/crud"
import { ShieldCheck, FolderKanban, ClipboardList, CalendarCheck, Gavel } from "lucide-react"

type CabTab = "changes" | "projects" | "tasks" | "meetings" | "decisions"

const TAB_CONFIG: { id: CabTab; label: string; icon: React.ReactNode; model: string }[] = [
  { id: "changes",   label: "Change Requests", icon: <ShieldCheck className="w-4 h-4" />,   model: "cab.change"   },
  { id: "projects",  label: "Projects",         icon: <FolderKanban className="w-4 h-4" />,  model: "cab.project"  },
  { id: "tasks",     label: "Tasks",            icon: <ClipboardList className="w-4 h-4" />, model: "cab.task"     },
  { id: "meetings",  label: "CAB Meetings",     icon: <CalendarCheck className="w-4 h-4" />, model: "cab.meeting"  },
  { id: "decisions", label: "Decisions",        icon: <Gavel className="w-4 h-4" />,         model: "cab.decision" },
]

const STATUS_COLORS: Record<string, string> = {
  draft: "text-amber-400", submitted: "text-cyan-400", in_review: "text-purple-400",
  approved: "text-emerald-400", rejected: "text-red-400", implemented: "text-green-500",
  open: "text-cyan-400", closed: "text-slate-400", scheduled: "text-yellow-400",
  completed: "text-green-400", cancelled: "text-red-400", pending: "text-amber-400",
}
const RISK_COLORS: Record<string, string> = {
  low: "text-emerald-400", medium: "text-amber-400", high: "text-orange-400", critical: "text-red-400",
}

function StatusBadge({ val }: { val: unknown }) {
  const s = String(val || "").toLowerCase()
  return <span className={`text-xs font-bold tracking-widest uppercase ${STATUS_COLORS[s] ?? "text-slate-400"}`}>{s || "—"}</span>
}
function RiskBadge({ val }: { val: unknown }) {
  const s = String(val || "").toLowerCase()
  return <span className={`text-xs font-bold tracking-widest uppercase ${RISK_COLORS[s] ?? "text-slate-400"}`}>{s || "—"}</span>
}

const COLUMNS: Record<CabTab, CrudColumn[]> = {
  changes: [
    { name: "reference",    label: "RFC #",        type: "text", required: true },
    { name: "title",        label: "Change Title", type: "text", required: true },
    { name: "risk",         label: "Risk",         type: "text", render: (v) => <RiskBadge val={v} /> },
    { name: "status",       label: "Status",       type: "text", render: (v) => <StatusBadge val={v} /> },
    { name: "scheduledFor", label: "Scheduled",    type: "text" },
  ],
  projects: [
    { name: "name",      label: "Project Name", type: "text", required: true },
    { name: "code",      label: "Code",         type: "text", required: true },
    { name: "status",    label: "Status",       type: "text", render: (v) => <StatusBadge val={v} /> },
    { name: "startDate", label: "Start",        type: "text" },
    { name: "endDate",   label: "End",          type: "text" },
  ],
  tasks: [
    { name: "title",        label: "Task Title",   type: "text", required: true },
    { name: "assignedToId", label: "Assigned To",  type: "text" },
    { name: "priority",     label: "Priority",     type: "text", render: (v) => <RiskBadge val={v} /> },
    { name: "status",       label: "Status",       type: "text", render: (v) => <StatusBadge val={v} /> },
    { name: "dueDate",      label: "Due Date",     type: "text" },
  ],
  meetings: [
    { name: "title",       label: "Meeting Title", type: "text", required: true },
    { name: "scheduledAt", label: "Scheduled At",  type: "text" },
    { name: "chairId",     label: "Chair",         type: "text" },
    { name: "status",      label: "Status",        type: "text", render: (v) => <StatusBadge val={v} /> },
    { name: "notes",       label: "Notes",         type: "text", hideInTable: true },
  ],
  decisions: [
    { name: "outcome",     label: "Outcome",    type: "text" },
    { name: "verdict",     label: "Verdict",    type: "text", render: (v) => <StatusBadge val={v} /> },
    { name: "rationale",   label: "Rationale",  type: "text", hideInTable: true },
    { name: "decidedAt",   label: "Decided At", type: "text" },
    { name: "decidedById", label: "Decided By", type: "text" },
  ],
}

export function ErpCabView() {
  const [activeTab, setActiveTab] = useState<CabTab>("changes")
  const currentTab = TAB_CONFIG.find((t) => t.id === activeTab)!

  return (
    <div className="flex flex-col gap-6">
      <ContextBlock
        title="CHANGE ADVISORY BOARD"
        subtitle="Governance Engine — RFC lifecycle, CAB decisions, meeting agendas, and implementation tracking"
        accentColor="purple"
        status="ACTIVE"
        operation="CAB MANAGEMENT PROTOCOL"
      />

      {/* ── Tab Navigation ── */}
      <div className="flex flex-wrap gap-2">
        {TAB_CONFIG.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={[
              "flex items-center gap-2 px-4 py-2 text-xs font-bold tracking-widest uppercase transition-all duration-200 hud-clip-btn border",
              activeTab === tab.id
                ? "border-cyber-purple text-cyber-purple bg-cyber-purple/10 shadow-[0_0_20px_rgba(161,0,255,0.25)]"
                : "border-cyber-purple/20 text-slate-400 hover:border-cyber-purple/50 hover:text-cyber-purple",
            ].join(" ")}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Active Tab CRUD Table ── */}
      <MoonDataTable
        key={activeTab}
        model={currentTab.model}
        columns={COLUMNS[activeTab]}
        title={`◈ ${currentTab.label.toUpperCase()}`}
        accentColor="purple"
      />
    </div>
  )
}
