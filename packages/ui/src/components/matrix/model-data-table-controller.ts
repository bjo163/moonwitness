"use client"

import { useCallback, useMemo, useState } from "react"
import type { ModelSchema } from "@workspace/types"

export const MODEL_DATA_TABLE_PAGE_SIZE = 15

export function getModelColumnKeys(schema: ModelSchema) {
  const tableConfig = schema.views?.table
  if (tableConfig?.columns && tableConfig.columns.length > 0) {
    return tableConfig.columns
  }

  return Object.keys(schema.fields)
    .filter((fieldName) => !schema.fields[fieldName]?.invisible && schema.fields[fieldName]?.type !== "text")
    .slice(0, 7)
}

export function filterModelRecords(records: any[], schema: ModelSchema, search: string) {
  if (!search.trim()) return records
  const query = search.toLowerCase().trim()
  const searchKeys = schema.views?.table?.searchKeys || [schema.recName || "name"]

  return records.filter((record) =>
    searchKeys.some((key) => {
      const value = record[key]
      return value !== undefined && value !== null && String(value).toLowerCase().includes(query)
    }),
  )
}

export function paginateModelRecords(records: any[], page: number, pageSize = MODEL_DATA_TABLE_PAGE_SIZE) {
  const start = (page - 1) * pageSize
  return records.slice(start, start + pageSize)
}

function getExportValue(record: any, key: string) {
  let value = record[key]
  if (typeof value === "object" && value !== null) {
    value = value.name || value.title || value.id
  }
  return value === undefined || value === null ? "" : String(value)
}

export function createModelCsv(records: any[], columnKeys: string[]) {
  const headers = columnKeys.join(",")
  const rows = records.map((record) =>
    columnKeys.map((key) => `"${getExportValue(record, key).replace(/"/g, '""')}"`).join(","),
  )
  return [headers, ...rows].join("\n")
}

type ModelDataTableControllerOptions = {
  schema: ModelSchema
  records: any[]
}

export function useModelDataTableController({ schema, records }: ModelDataTableControllerOptions) {
  const [search, setSearchValue] = useState("")
  const [page, setPage] = useState(1)
  const [showExportMenu, setShowExportMenu] = useState(false)
  const [showImportModal, setShowImportModal] = useState(false)

  const columnKeys = useMemo(() => getModelColumnKeys(schema), [schema])
  const filteredRecords = useMemo(
    () => filterModelRecords(records, schema, search),
    [records, schema, search],
  )
  const totalPages = Math.max(1, Math.ceil(filteredRecords.length / MODEL_DATA_TABLE_PAGE_SIZE))
  const paginatedRecords = useMemo(
    () => paginateModelRecords(filteredRecords, page),
    [filteredRecords, page],
  )

  const setSearch = useCallback((value: string) => {
    setSearchValue(value)
    setPage(1)
  }, [])

  const handleExportCsv = useCallback(() => {
    if (records.length === 0) return
    const blob = new Blob([createModelCsv(records, columnKeys)], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `${schema.name}-export.csv`
    link.click()
    URL.revokeObjectURL(url)
    setShowExportMenu(false)
  }, [columnKeys, records, schema.name])

  const handleExportJson = useCallback(() => {
    if (records.length === 0) return
    const blob = new Blob([JSON.stringify(records, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `${schema.name}-export.json`
    link.click()
    URL.revokeObjectURL(url)
    setShowExportMenu(false)
  }, [records, schema.name])

  const handleImportSuccess = useCallback(() => {
    setShowImportModal(false)
    window.location.reload()
  }, [])

  return {
    search,
    setSearch,
    page,
    setPage,
    showExportMenu,
    setShowExportMenu,
    showImportModal,
    setShowImportModal,
    columnKeys,
    filteredRecords,
    totalPages,
    paginatedRecords,
    handleExportCsv,
    handleExportJson,
    handleImportSuccess,
  }
}
