"use client"

import React, { useCallback, useEffect, useState } from "react"
import { Table, LayoutGrid, Grid3X3, Calendar, Plus, RefreshCw, AlertCircle } from "lucide-react"
import { useModelSchema, useModelRecords } from "@workspace/hooks"
import type { ModelSchema, MatrixViewMode } from "@workspace/types"
import { ModelDataTable } from "./model-data-table"
import { ModelKanbanBoard } from "./model-kanban-board"
import { ModelPivotGrid } from "./model-pivot-grid"
import { ModelTimelineView } from "./model-timeline-view"
import { ModelFormModal } from "./model-form-modal"
import { ModelCopilotWidget } from "./model-copilot-widget"
import { Button } from "../button"

export interface ModelWorkspaceProps {
  model: string
}

type ModelWorkspaceController = {
  schema: ModelSchema | null
  schemaLoading: boolean
  schemaError: Error | null
  refetchSchema: () => Promise<void>
  records: any[]
  recordsLoading: boolean
  activeView: MatrixViewMode
  selectedRecord: any | null
  isModalOpen: boolean
  setActiveView: (view: MatrixViewMode) => void
  openCreate: () => void
  openEdit: (record: any) => void
  closeModal: () => void
  saveRecord: (values: Record<string, any>) => Promise<void>
  deleteRecord: (record: any) => Promise<void>
  updateRecord: (id: number, values: Record<string, any>) => Promise<any>
  setRecordForColumn: (stageKey: any, groupField: string) => void
}

function useModelWorkspaceController(model: string): ModelWorkspaceController {
  const { schema, loading: schemaLoading, error: schemaError, refetch: refetchSchema } = useModelSchema(model)
  const {
    records,
    loading: recordsLoading,
    createRecord,
    updateRecord,
    deleteRecord,
  } = useModelRecords(model)

  const [activeView, setActiveView] = useState<MatrixViewMode>("table")
  const [selectedRecord, setSelectedRecord] = useState<any | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    if (schema?.views?.defaultView) {
      setActiveView(schema.views.defaultView)
    }
  }, [schema?.views?.defaultView])

  const openCreate = useCallback(() => {
    setSelectedRecord(null)
    setIsModalOpen(true)
  }, [])

  const openEdit = useCallback((record: any) => {
    setSelectedRecord(record)
    setIsModalOpen(true)
  }, [])

  const closeModal = useCallback(() => {
    setIsModalOpen(false)
  }, [])

  const saveRecord = useCallback(
    async (values: Record<string, any>) => {
      if (selectedRecord?.id) {
        await updateRecord(selectedRecord.id, values)
      } else {
        await createRecord(values)
      }
    },
    [createRecord, selectedRecord, updateRecord],
  )

  const deleteRecordFromWorkspace = useCallback(
    async (record: any) => {
      if (schema && confirm(`Delete record #${record.id} from ${schema.name}?`)) {
        await deleteRecord(record.id)
      }
    },
    [deleteRecord, schema],
  )

  const setRecordForColumn = useCallback((stageKey: any, groupField: string) => {
    setSelectedRecord({ [groupField]: stageKey })
    setIsModalOpen(true)
  }, [])

  return {
    schema,
    schemaLoading,
    schemaError,
    refetchSchema,
    records,
    recordsLoading,
    activeView,
    selectedRecord,
    isModalOpen,
    setActiveView,
    openCreate,
    openEdit,
    closeModal,
    saveRecord,
    deleteRecord: deleteRecordFromWorkspace,
    updateRecord,
    setRecordForColumn,
  }
}

type ModelWorkspacePresentationProps = {
  model: string
  controller: ModelWorkspaceController
}

function ModelWorkspacePresentation({ model, controller }: ModelWorkspacePresentationProps) {
  const {
    schema,
    schemaLoading,
    schemaError,
    refetchSchema,
    records,
    recordsLoading,
    activeView,
    selectedRecord,
    isModalOpen,
    setActiveView,
    openCreate,
    openEdit,
    closeModal,
    saveRecord,
    deleteRecord,
    updateRecord,
    setRecordForColumn,
  } = controller

  if (schemaLoading) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center space-y-3">
        <RefreshCw className="h-6 w-6 animate-spin text-primary" />
        <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
          Loading model schema [{model}]...
        </span>
      </div>
    )
  }

  if (schemaError || !schema) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center space-y-4 text-center">
        <AlertCircle className="h-10 w-10 text-destructive" />
        <div className="space-y-1">
          <h3 className="text-base font-bold uppercase text-foreground">Model Schema Error</h3>
          <p className="max-w-md font-sans text-xs text-muted-foreground">
            {schemaError?.message || `Model '${model}' failed to reflect schema from PostgreSQL ORM.`}
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          onClick={() => void refetchSchema()}
          className="rounded-lg border border-border bg-secondary px-4 py-2 text-xs font-medium text-secondary-foreground hover:bg-accent"
        >
          Retry
        </Button>
      </div>
    )
  }

  const hasKanban = Boolean(schema.views?.kanban)
  const isPivotView = activeView === ("pivot" as MatrixViewMode)
  const isTimelineView = activeView === ("timeline" as MatrixViewMode)

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 rounded-xl border border-border bg-card p-5 shadow-sm md:flex-row md:items-center">
        <div>
          <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-wider text-primary">
            <span>MODEL</span>
            <span>•</span>
            <span>{schema.name}</span>
            <span>•</span>
            <span className="text-muted-foreground">{records.length} records</span>
          </div>
          <h1 className="mt-0.5 text-2xl font-bold tracking-tight text-foreground">
            {schema.views?.form?.title || schema.description || schema.name}
          </h1>
          {schema.description && <p className="mt-0.5 text-xs text-muted-foreground">{schema.description}</p>}
        </div>

        <ModelWorkspaceToolbar
          activeView={activeView}
          hasKanban={hasKanban}
          onViewChange={setActiveView}
          onCreate={openCreate}
        />
      </div>

      {isTimelineView ? (
        <ModelTimelineView schema={schema} records={records} onRecordClick={openEdit} />
      ) : isPivotView ? (
        <ModelPivotGrid schema={schema} records={records} onRecordClick={openEdit} />
      ) : activeView === "kanban" && hasKanban ? (
        <ModelKanbanBoard
          schema={schema}
          records={records}
          loading={recordsLoading}
          onCardClick={openEdit}
          onCardStageChange={async (card, newStageKey) => {
            const groupField = schema.views?.kanban?.groupBy || "stageId"
            await updateRecord(card.id, { [groupField]: newStageKey })
          }}
          onCreateInColumn={(stageKey) => {
            const groupField = schema.views?.kanban?.groupBy || "stageId"
            setRecordForColumn(stageKey, groupField)
          }}
        />
      ) : (
        <ModelDataTable
          schema={schema}
          records={records}
          loading={recordsLoading}
          onRowClick={openEdit}
          onEdit={openEdit}
          onDelete={deleteRecord}
          onCreateClick={openCreate}
        />
      )}

      <ModelFormModal
        isOpen={isModalOpen}
        onClose={closeModal}
        schema={schema}
        initialRecord={selectedRecord}
        onSave={saveRecord}
      />

      <ModelCopilotWidget schema={schema} records={records} />
    </div>
  )
}

export function ModelWorkspace({ model }: ModelWorkspaceProps) {
  const controller = useModelWorkspaceController(model)
  return <ModelWorkspacePresentation model={model} controller={controller} />
}

function ModelWorkspaceToolbar({
  activeView,
  hasKanban,
  onViewChange,
  onCreate,
}: {
  activeView: MatrixViewMode
  hasKanban: boolean
  onViewChange: (view: MatrixViewMode) => void
  onCreate: () => void
}) {
  const viewButtonClass = (view: MatrixViewMode) =>
    `flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all ${activeView === view ? "bg-card font-semibold text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center rounded-lg border border-border bg-muted p-0.5">
        <Button type="button" variant="ghost" onClick={() => onViewChange("table")} className={viewButtonClass("table")}><Table className="h-3.5 w-3.5" /> Table</Button>
        {hasKanban && <Button type="button" variant="ghost" onClick={() => onViewChange("kanban")} className={viewButtonClass("kanban")}><LayoutGrid className="h-3.5 w-3.5" /> Kanban</Button>}
        <Button type="button" variant="ghost" onClick={() => onViewChange("pivot" as MatrixViewMode)} className={viewButtonClass("pivot" as MatrixViewMode)}><Grid3X3 className="h-3.5 w-3.5" /> Pivot</Button>
        <Button type="button" variant="ghost" onClick={() => onViewChange("timeline" as MatrixViewMode)} className={viewButtonClass("timeline" as MatrixViewMode)}><Calendar className="h-3.5 w-3.5" /> Timeline</Button>
      </div>
      <Button type="button" onClick={onCreate} className="flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/90"><Plus className="h-3.5 w-3.5" /> New Record</Button>
    </div>
  )
}
