"use client"

import React, { useState } from "react"
import { Table, LayoutGrid, Grid3X3, Calendar, Plus, RefreshCw, AlertCircle } from "lucide-react"
import { useModelSchema, useModelRecords } from "@workspace/hooks"
import { CosmicDataTable } from "./cosmic-data-table"
import { CosmicKanbanBoard } from "./cosmic-kanban-board"
import { CosmicPivotGrid } from "./cosmic-pivot-grid"
import { CosmicTimelineView } from "./cosmic-timeline-view"
import { CosmicFormModal } from "./cosmic-form-modal"
import { CosmicCopilotWidget } from "./cosmic-copilot-widget"
import type { MatrixViewMode } from "@workspace/types"

export interface CosmicModelWorkspaceProps {
  model: string
}

export function CosmicModelWorkspace({ model }: CosmicModelWorkspaceProps) {
  const { schema, loading: schemaLoading, error: schemaError, refetch: refetchSchema } = useModelSchema(model)
  const {
    records,
    loading: recordsLoading,
    refetch: refetchRecords,
    createRecord,
    updateRecord,
    deleteRecord,
  } = useModelRecords(model)

  const [activeView, setActiveView] = useState<MatrixViewMode>("table")
  const [selectedRecord, setSelectedRecord] = useState<any | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Sync initial view mode from schema manifest if not manually set
  React.useEffect(() => {
    if (schema?.views?.defaultView) {
      setActiveView(schema.views.defaultView)
    }
  }, [schema?.views?.defaultView])

  if (schemaLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-3">
        <RefreshCw className="w-6 h-6 text-cyber-cyan animate-spin" />
        <span className="text-xs font-mono text-steel-gray uppercase tracking-widest">
          INTROSPECTING MODEL MATRIX [{model}]...
        </span>
      </div>
    )
  }

  if (schemaError || !schema) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4 text-center">
        <AlertCircle className="w-10 h-10 text-cyber-pink" />
        <div className="space-y-1">
          <h3 className="text-base font-bold text-white font-orbitron uppercase">MODEL MATRIX FAULT</h3>
          <p className="text-xs font-mono text-steel-gray max-w-md">
            {schemaError?.message || `Model '${model}' failed to reflect schema from PostgreSQL ORM.`}
          </p>
        </div>
        <button
          onClick={() => refetchSchema()}
          className="px-4 py-2 bg-cyber-cyan/20 border border-cyber-cyan rounded text-xs font-mono text-cyber-cyan hover:bg-cyber-cyan/30 uppercase"
        >
          RETRY INTROSPECTION
        </button>
      </div>
    )
  }

  const handleOpenCreate = () => {
    setSelectedRecord(null)
    setIsModalOpen(true)
  }

  const handleOpenEdit = (rec: any) => {
    setSelectedRecord(rec)
    setIsModalOpen(true)
  }

  const handleSave = async (vals: Record<string, any>) => {
    if (selectedRecord?.id) {
      await updateRecord(selectedRecord.id, vals)
    } else {
      await createRecord(vals)
    }
  }

  const handleDelete = async (rec: any) => {
    if (confirm(`Authorize purge of unit #${rec.id} from ${schema.name}?`)) {
      await deleteRecord(rec.id)
    }
  }

  const hasKanban = Boolean(schema.views?.kanban)

  return (
    <div className="space-y-6">
      {/* Workspace Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 bg-cyber-dark/80 border border-cyber-cyan/20 rounded-lg corner-box backdrop-blur-md">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-mono text-cyber-cyan tracking-widest uppercase">
            <span>VERTEX MODEL</span>
            <span>//</span>
            <span>{schema.name}</span>
            <span>//</span>
            <span className="text-steel-gray">{records.length} UNITS</span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-wide uppercase font-orbitron mt-0.5">
            {schema.views?.form?.title || schema.description || schema.name}
          </h1>
          {schema.description && (
            <p className="text-xs font-mono text-steel-gray mt-0.5">{schema.description}</p>
          )}
        </div>

        {/* View Switcher & Action */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-black/60 border border-cyber-cyan/20 rounded p-0.5">
            <button
              onClick={() => setActiveView("table")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono uppercase transition-all ${
                activeView === "table"
                  ? "bg-cyber-cyan/20 text-cyber-cyan border border-cyber-cyan/40"
                  : "text-steel-gray hover:text-white"
              }`}
            >
              <Table className="w-3.5 h-3.5" /> TABLE
            </button>
            {hasKanban && (
              <button
                onClick={() => setActiveView("kanban")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono uppercase transition-all ${
                  activeView === "kanban"
                    ? "bg-cyber-cyan/20 text-cyber-cyan border border-cyber-cyan/40"
                    : "text-steel-gray hover:text-white"
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" /> KANBAN
              </button>
            )}
            <button
              onClick={() => setActiveView("pivot" as any)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono uppercase transition-all ${
                activeView === ("pivot" as any)
                  ? "bg-cyber-cyan/20 text-cyber-cyan border border-cyber-cyan/40"
                  : "text-steel-gray hover:text-white"
              }`}
            >
              <Grid3X3 className="w-3.5 h-3.5" /> PIVOT
            </button>
            <button
              onClick={() => setActiveView("timeline" as any)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono uppercase transition-all ${
                activeView === ("timeline" as any)
                  ? "bg-cyber-cyan/20 text-cyber-cyan border border-cyber-cyan/40"
                  : "text-steel-gray hover:text-white"
              }`}
            >
              <Calendar className="w-3.5 h-3.5" /> TIMELINE
            </button>
          </div>

          <button
            onClick={handleOpenCreate}
            className="flex items-center gap-1.5 px-4 py-2 bg-cyber-cyan/20 border border-cyber-cyan rounded text-xs font-mono text-cyber-cyan hover:bg-cyber-cyan/30 uppercase tracking-wider transition-all shadow-[0_0_12px_rgba(0,240,255,0.2)]"
          >
            <Plus className="w-3.5 h-3.5" /> NEW ENTRY
          </button>
        </div>
      </div>

      {/* View Render */}
      {activeView === ("timeline" as any) ? (
        <CosmicTimelineView
          schema={schema}
          records={records}
          onRecordClick={handleOpenEdit}
        />
      ) : activeView === ("pivot" as any) ? (
        <CosmicPivotGrid
          schema={schema}
          records={records}
          onRecordClick={handleOpenEdit}
        />
      ) : activeView === "kanban" && hasKanban ? (
        <CosmicKanbanBoard
          schema={schema}
          records={records}
          loading={recordsLoading}
          onCardClick={handleOpenEdit}
          onCardStageChange={async (card, newStageKey) => {
            const groupField = schema.views?.kanban?.groupBy || "stageId"
            await updateRecord(card.id, { [groupField]: newStageKey })
          }}
          onCreateInColumn={(stageKey) => {
            const groupField = schema.views?.kanban?.groupBy || "stageId"
            setSelectedRecord({ [groupField]: stageKey })
            setIsModalOpen(true)
          }}
        />
      ) : (
        <CosmicDataTable
          schema={schema}
          records={records}
          loading={recordsLoading}
          onRowClick={handleOpenEdit}
          onEdit={handleOpenEdit}
          onDelete={handleDelete}
          onCreateClick={handleOpenCreate}
        />
      )}

      {/* Universal Form Modal */}
      <CosmicFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        schema={schema}
        initialRecord={selectedRecord}
        onSave={handleSave}
      />

      {/* Floating AI Copilot */}
      <CosmicCopilotWidget schema={schema} records={records} />
    </div>
  )
}
