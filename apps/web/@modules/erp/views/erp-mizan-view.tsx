"use client"

import React, { useState } from "react"
import { ContextBlock } from "@core/ui"
import { MoonDataTable, CrudColumn } from "@core/widgets/crud"
import { Scale, ShieldAlert, CheckCircle2, History } from "lucide-react"

export function ErpMizanView() {
  const [activeTab, setActiveTab] = useState("all")

  const mizanColumns: CrudColumn[] = [
    { name: "title", label: "Case Title", type: "text", required: true },
    { name: "caseText", label: "Case Details", type: "textarea", required: true, hideInTable: true },
    { name: "subjectAlias", label: "Subject Alias", type: "text" },
    { name: "subjectAge", label: "Subject Age", type: "number" },
    { 
      name: "status", 
      label: "Status", 
      type: "select",
      options: [
        { label: "Draft", value: "draft" },
        { label: "Assessed", value: "assessed" },
        { label: "Needs Internal Reference", value: "needs_reference" },
        { label: "Archived", value: "archived" }
      ],
      render: (val) => {
        let color = "text-slate-400"
        if (val === "draft") color = "text-amber-400"
        if (val === "assessed") color = "text-emerald-400"
        if (val === "needs_reference") color = "text-purple-400"
        
        return <span className={`text-xs font-semibold ${color}`}>{val?.toString().toUpperCase() || 'DRAFT'}</span>
      }
    }
  ]

  const topWidgets = (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="rounded-xl border border-cyan-900/30 bg-black/40 backdrop-blur-md p-4 flex flex-col gap-2 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Scale className="w-16 h-16 text-cyan-500" />
        </div>
        <div className="flex items-center gap-2 text-cyan-500">
          <Scale className="w-4 h-4" />
          <span className="text-xs font-bold uppercase tracking-wider">Total Cases</span>
        </div>
        <div className="text-2xl font-bold text-white">42</div>
        <div className="text-[10px] text-cyan-400">Recorded cases in system</div>
      </div>
      
      <div className="rounded-xl border border-emerald-900/30 bg-black/40 backdrop-blur-md p-4 flex flex-col gap-2 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <CheckCircle2 className="w-16 h-16 text-emerald-500" />
        </div>
        <div className="flex items-center gap-2 text-emerald-500">
          <CheckCircle2 className="w-4 h-4" />
          <span className="text-xs font-bold uppercase tracking-wider">Assessed</span>
        </div>
        <div className="text-2xl font-bold text-white">28</div>
        <div className="text-[10px] text-emerald-500">Validated through Mizan</div>
      </div>

      <div className="rounded-xl border border-purple-900/30 bg-black/40 backdrop-blur-md p-4 flex flex-col gap-2 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <ShieldAlert className="w-16 h-16 text-purple-500" />
        </div>
        <div className="flex items-center gap-2 text-purple-500">
          <ShieldAlert className="w-4 h-4" />
          <span className="text-xs font-bold uppercase tracking-wider">Needs Reference</span>
        </div>
        <div className="text-2xl font-bold text-white">5</div>
        <div className="text-[10px] text-purple-400">Awaiting internal prophetic references</div>
      </div>
    </div>
  )

  const tabs = [
    { id: "all", label: "All Cases" },
    { id: "draft", label: "Drafts" },
    { id: "assessed", label: "Assessed" },
    { id: "needs_reference", label: "Needs Reference" },
  ]

  return (
    <div className="space-y-6">
      <ContextBlock
        title="MIZAN MANAGER"
        subtitle="Internal Weighted-Assessment and Validation Database."
        operation="MIZAN-OS"
        status="ONLINE"
        accentColor="cyan"
      />

      <MoonDataTable 
        modelName="mz.case"
        title="Mizan Cases"
        description="List of all cases submitted for balance assessment."
        columns={mizanColumns}
        icon={<Scale className="h-5 w-5" />}
        topWidgets={topWidgets}
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
    </div>
  )
}
