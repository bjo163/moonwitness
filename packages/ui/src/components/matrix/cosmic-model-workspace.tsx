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
        <RefreshCw className="w-6 h-6 text-primary animate-spin" />
        <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
          Loading model schema [{model}]...
        </span>
      </div>
    )
  }

  if (schemaError || !schema) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4 text-center">
        <AlertCircle className="w-10 h-10 text-destructive" />
        <div className="space-y-1">
          <h3 className="text-base font-bold text-foreground uppercase">Model Schema Error</h3>
          <p className="text-xs font-sans text-muted-foreground max-w-md">
            {schemaError?.message || `Model '${model}' failed to reflect schema from PostgreSQL ORM.`}
          </p>
        </div>
        <button
          onClick={() => refetchSchema()}
          className="px-4 py-2 bg-secondary text-secondary-foreground border border-border rounded-lg text-xs font-medium hover:bg-accent"
        >
          Retry
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
    if (confirm(`Delete record #${rec.id} from ${schema.name}?`)) {
      await deleteRecord(rec.id)
    }
  }

  const hasKanban = Boolean(schema.views?.kanban)

  return (
    <div className="space-y-6">
      {/* Workspace Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 bg-card/90 border border-border/40 rounded-xl backdrop-blur-md shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-mono text-primary tracking-wider uppercase">
            <span>MODEL</span>
            <span>•</span>
            <span>{schema.name}</span>
            <span>•</span>
            <span className="text-muted-foreground">{records.length} records</span>
          </div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight mt-0.5">
            {schema.views?.form?.title || schema.description || schema.name}
          </h1>
          {schema.description && (
            <p className="text-xs text-muted-foreground mt-0.5">{schema.description}</p>
          )}
        </div>

        {/* View Switcher & Action */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-muted/40 border border-border/40 rounded-lg p-0.5">
            <button
              onClick={() => setActiveView("table")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                activeView === "table"
                  ? "bg-card text-foreground shadow-sm font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Table className="w-3.5 h-3.5" /> Table
            </button>
            {hasKanban && (
              <button
                onClick={() => setActiveView("kanban")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                  activeView === "kanban"
                    ? "bg-card text-foreground shadow-sm font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" /> Kanban
              </button>
            )}
            <button
              onClick={() => setActiveView("pivot" as any)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                activeView === ("pivot" as any)
                  ? "bg-card text-foreground shadow-sm font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Grid3X3 className="w-3.5 h-3.5" /> Pivot
            </button>
            <button
              onClick={() => setActiveView("timeline" as any)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                activeView === ("timeline" as any)
                  ? "bg-card text-foreground shadow-sm font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Calendar className="w-3.5 h-3.5" /> Timeline
            </button>
          </div>

          <button
            onClick={handleOpenCreate}
            className="flex items-center gap-1.5 px-4 py-2 bg-primary text-primary-foreground font-semibold rounded-lg text-xs hover:bg-primary/90 transition-all shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" /> New Record
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
