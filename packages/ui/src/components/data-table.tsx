"use client"

import React from "react"
import { Card, CardContent } from "./card"
import { useDataTableController } from "./data-table-controller"
import { DataTableBody, DataTableFormDialog, DataTableHeader } from "./data-table-presentation"
import type { DataTableProps } from "./data-table.types"
export type { CrudColumn, DataTableProps } from "./data-table.types"

export function DataTable<T = any>({
  modelName,
  title,
  description,
  columns,
  icon,
  topWidgets,
  sideWidgets,
  tabs,
  activeTab,
  onTabChange,
  filters,
  filterWidgets,
  customActions,
}: DataTableProps<T>) {
  const controller = useDataTableController<T>({ modelName, filters })

  return (
    <div className="space-y-6">
      {topWidgets && <div className="mb-6">{topWidgets}</div>}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className={`space-y-6 ${sideWidgets ? "lg:col-span-8" : "lg:col-span-12"}`}>
          <Card className="border-border bg-card shadow-xl backdrop-blur-md">
            <DataTableHeader
              title={title}
              description={description}
              icon={icon}
              customActions={customActions}
              tabs={tabs}
              activeTab={activeTab}
              onTabChange={onTabChange}
              searchQuery={controller.searchQuery}
              onSearchChange={controller.setSearchQuery}
              filterWidgets={filterWidgets}
              onAdd={controller.beginAdd}
            />
            <CardContent className="p-0">
              <DataTableBody
                modelName={modelName}
                title={title}
                columns={columns}
                data={controller.data}
                loading={controller.loading}
                error={controller.error}
                onRetry={() => controller.fetch(filters)}
                onEdit={controller.beginEdit}
                onDelete={controller.handleDelete}
              />
            </CardContent>
          </Card>
        </div>

        {sideWidgets && <div className="space-y-6 lg:col-span-4">{sideWidgets}</div>}
      </div>

      {controller.submitError && <div className="text-xs text-rose-400">{controller.submitError}</div>}

      <DataTableFormDialog
        modelName={modelName}
        columns={columns}
        isOpen={controller.isAddOpen || controller.isEditOpen}
        isEdit={controller.isEditOpen}
        editingId={controller.editingId}
        formData={controller.formData}
        isSubmitting={controller.isSubmitting}
        onOpenChange={(open) => {
          if (!open) controller.closeDialog()
        }}
        onInputChange={controller.handleInputChange}
        onCancel={controller.closeDialog}
        onSave={() => controller.handleSave(controller.isEditOpen)}
      />
    </div>
  )
}
