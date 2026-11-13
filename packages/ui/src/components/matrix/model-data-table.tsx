"use client"

import React from "react"
import type { ModelSchema } from "@workspace/types"
import { ModelImportModal } from "./model-import-modal"
import {
  ModelDataTableGrid,
  ModelDataTablePagination,
  ModelDataTableToolbar,
} from "./model-data-table-presentation"
import { useModelDataTableController } from "./model-data-table-controller"

export interface ModelDataTableProps {
  schema: ModelSchema
  records: any[]
  loading?: boolean
  onRowClick?: (record: any) => void
  onEdit?: (record: any) => void
  onDelete?: (record: any) => void
  onCreateClick?: () => void
}

export function ModelDataTable({
  schema,
  records,
  loading = false,
  onRowClick,
  onEdit,
  onDelete,
  onCreateClick,
}: ModelDataTableProps) {
  const controller = useModelDataTableController({ schema, records })

  return (
    <div className="space-y-4 font-sans text-xs">
      <ModelDataTableToolbar
        schema={schema}
        search={controller.search}
        showExportMenu={controller.showExportMenu}
        onSearchChange={controller.setSearch}
        onToggleExportMenu={() => controller.setShowExportMenu((value) => !value)}
        onExportCsv={controller.handleExportCsv}
        onExportJson={controller.handleExportJson}
        onPrint={() => {
          controller.setShowExportMenu(false)
          window.print()
        }}
        onOpenImport={() => controller.setShowImportModal(true)}
        onCreateClick={onCreateClick}
      />

      <ModelDataTableGrid
        schema={schema}
        columnKeys={controller.columnKeys}
        records={controller.paginatedRecords}
        loading={loading}
        onRowClick={onRowClick}
        onEdit={onEdit}
        onDelete={onDelete}
      />

      <ModelDataTablePagination
        page={controller.page}
        totalPages={controller.totalPages}
        visibleRecordCount={controller.paginatedRecords.length}
        filteredRecordCount={controller.filteredRecords.length}
        onPrevious={() => controller.setPage((current) => current - 1)}
        onNext={() => controller.setPage((current) => current + 1)}
      />

      <ModelImportModal
        isOpen={controller.showImportModal}
        onClose={() => controller.setShowImportModal(false)}
        schema={schema}
        onImportSuccess={controller.handleImportSuccess}
      />
    </div>
  )
}
