"use client"

import React, { useEffect, useMemo, useState } from "react"
import { ContextBlock } from "@core/ui"
import { MoonDataTable, CrudColumn } from "@core/widgets/crud"
import { useMoonStore } from "@core/store/moon-store"
import { Scale, ShieldAlert, CheckCircle2 } from "lucide-react"

type MizanSummary = {
  total: number
  assessed: number
  needsReference: number
}

export function ErpMizanView() {
  const [activeTab, setActiveTab] = useState("all")
  const { request } = useMoonStore()
  const [summary, setSummary] = useState<MizanSummary | null>(null)

  useEffect(() => {
    let mounted = true

    request("GET", "/api/mizan/summary")
      .then((data: MizanSummary) => {
        if (mounted) setSummary(data)
      })
      .catch(() => {
        if (mounted) setSummary(null)
      })

    return () => {
      mounted = false
    }
  }, [request])

  const filters = useMemo(
    () => (activeTab === "all" ? undefined : { status: activeTab }),
    [activeTab]
  )

  const mizanColumns: CrudColumn[] = [
    { name: "title", label: "Case Title", type: "text", required: true },
    {
      name: "caseText",
      label: "Case Details",
      type: "text",
      required: true,
      hideInTable: true,
    },
    { name: "subjectAlias", label: "Subject Alias", type: "text" },
    { name: "subjectAge", label: "Subject Age", type: "number" },
    {
      name: "status",
      label: "Status",
      type: "text",
      render: (val) => {
        let color = "text-slate-400"
        if (val === "draft") color = "text-amber-400"
        if (val === "assessed") color = "text-emerald-400"
        if (val === "needs_reference") color = "text-purple-400"

        return (
          <span className={`text-xs font-semibold ${color}`}>
            {val?.toString().toUpperCase() || "DRAFT"}
          </span>
        )
      },
    },
  ]

  const topWidgets = (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      <div className="relative flex flex-col gap-2 overflow-hidden rounded-xl border border-cyan-900/30 bg-black/40 p-4 backdrop-blur-md">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Scale className="h-16 w-16 text-cyan-500" />
        </div>
        <div className="flex items-center gap-2 text-cyan-500">
          <Scale className="h-4 w-4" />
          <span className="text-xs font-bold tracking-wider uppercase">
            Total Cases
          </span>
        </div>
        <div className="text-2xl font-bold text-white">
          {summary?.total ?? "—"}
        </div>
        <div className="text-[10px] text-cyan-400">
          Recorded cases in system
        </div>
      </div>

      <div className="relative flex flex-col gap-2 overflow-hidden rounded-xl border border-emerald-900/30 bg-black/40 p-4 backdrop-blur-md">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <CheckCircle2 className="h-16 w-16 text-emerald-500" />
        </div>
        <div className="flex items-center gap-2 text-emerald-500">
          <CheckCircle2 className="h-4 w-4" />
          <span className="text-xs font-bold tracking-wider uppercase">
            Assessed
          </span>
        </div>
        <div className="text-2xl font-bold text-white">
          {summary?.assessed ?? "—"}
        </div>
        <div className="text-[10px] text-emerald-500">
          Validated through Mizan
        </div>
      </div>

      <div className="relative flex flex-col gap-2 overflow-hidden rounded-xl border border-purple-900/30 bg-black/40 p-4 backdrop-blur-md">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <ShieldAlert className="h-16 w-16 text-purple-500" />
        </div>
        <div className="flex items-center gap-2 text-purple-500">
          <ShieldAlert className="h-4 w-4" />
          <span className="text-xs font-bold tracking-wider uppercase">
            Needs Reference
          </span>
        </div>
        <div className="text-2xl font-bold text-white">
          {summary?.needsReference ?? "—"}
        </div>
        <div className="text-[10px] text-purple-400">
          Awaiting internal prophetic references
        </div>
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
        accentColor="system"
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
        filters={filters}
      />
    </div>
  )
}
