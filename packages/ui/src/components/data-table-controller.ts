"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { useMoonModel } from "@moon/client"

type DataTableControllerOptions<T> = {
  modelName: string
  filters?: Record<string, any>
}

export function useDataTableController<T = any>({
  modelName,
  filters,
}: DataTableControllerOptions<T>) {
  const [searchQuery, setSearchQuery] = useState("")
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [formData, setFormData] = useState<Record<string, any>>({})
  const [editingId, setEditingId] = useState<number | string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const { data, loading, error, fetch, create, update, remove } = useMoonModel<T>(
    modelName,
    filters,
  )

  useEffect(() => {
    fetch(filters)
  }, [filters, fetch])

  const filteredData = useMemo(() => {
    if (!searchQuery.trim()) return data
    const query = searchQuery.toLowerCase()

    return data.filter((item: any) =>
      Object.values(item).some(
        (value) =>
          typeof value === "string" && value.toLowerCase().includes(query),
      ),
    )
  }, [data, searchQuery])

  const beginAdd = useCallback(() => {
    setFormData({})
    setEditingId(null)
    setIsAddOpen(true)
  }, [])

  const beginEdit = useCallback((row: any) => {
    setEditingId(row.id)
    setFormData(row)
    setIsEditOpen(true)
  }, [])

  const closeDialog = useCallback(() => {
    setIsAddOpen(false)
    setIsEditOpen(false)
    setSubmitError(null)
  }, [])

  const handleInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((current) => ({
        ...current,
        [event.target.name]: event.target.value,
      }))
    },
    [],
  )

  const handleSave = useCallback(
    async (isEdit: boolean) => {
      setIsSubmitting(true)
      setSubmitError(null)

      try {
        if (isEdit && editingId != null) {
          await update(editingId, formData as Partial<T>)
        } else {
          await create(formData as Partial<T>)
        }
        setFormData({})
        setIsAddOpen(false)
        setIsEditOpen(false)
      } catch (err: any) {
        setSubmitError(err.message || "Save failed")
      } finally {
        setIsSubmitting(false)
      }
    },
    [create, editingId, formData, update],
  )

  const handleDelete = useCallback(
    async (id: number | string) => {
      if (!window.confirm("Are you sure you want to delete this record?")) return

      try {
        await remove(id)
      } catch (err: any) {
        console.error(err)
      }
    },
    [remove],
  )

  return {
    data: filteredData,
    loading,
    error,
    fetch,
    searchQuery,
    setSearchQuery,
    formData,
    editingId,
    isAddOpen,
    isEditOpen,
    isSubmitting,
    submitError,
    beginAdd,
    beginEdit,
    closeDialog,
    handleInputChange,
    handleSave,
    handleDelete,
  }
}
