"use client"

import type { FormEvent } from "react"
import { useEffect, useState } from "react"
import { ContextBlock } from "@workspace/ui"
import { moonClientInstance } from "@moon/client"
import { ERPShootgunOperationFormPanel } from "./erp-shootgun-operation-form-panel"
import { ERPShootgunOperationRecordsPanel } from "./erp-shootgun-operation-records-panel"
import {
  emptyOperation,
  type Book,
  type Operation,
  type OperationForm,
  type Scripture,
  type Verse,
} from "./erp-shootgun-types"

function useErpShootgunController() {
  const client = moonClientInstance
  const [operations, setOperations] = useState<Operation[]>([])
  const [verses, setVerses] = useState<Verse[]>([])
  const [scriptures, setScriptures] = useState<Scripture[]>([])
  const [books, setBooks] = useState<Book[]>([])
  const [form, setForm] = useState<OperationForm>(emptyOperation)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const load = async () => {
    try {
      const [operationRows, verseRows, scriptureRows, bookRows] =
        await Promise.all([
          client.model<Operation>("sg.operation").fetch(),
          client.model<Verse>("wx.scripture.verse").limit(200).fetch(),
          client.model<Scripture>("wx.scripture").fetch(),
          client.model<Book>("wx.scripture.book").fetch(),
        ])
      setOperations(Array.isArray(operationRows) ? operationRows : [])
      setVerses(Array.isArray(verseRows) ? verseRows : [])
      setScriptures(Array.isArray(scriptureRows) ? scriptureRows : [])
      setBooks(Array.isArray(bookRows) ? bookRows : [])
      setError(null)
    } catch (loadError) {
      console.error("Unable to load Shootgun data:", loadError)
      setError("Operation data could not be loaded.")
    }
  }

  useEffect(() => {
    void load()
  }, [client])

  const openCreate = () => {
    setEditingId(null)
    setForm(emptyOperation)
    setIsFormOpen(true)
  }

  const openEdit = (operation: Operation) => {
    setEditingId(operation.id)
    setForm({
      name: operation.name,
      argument: operation.argument ?? "",
      targetUrl: operation.targetUrl ?? "",
      targetImage: operation.targetImage ?? "",
      wisdom: operation.wisdom ?? "",
      verseIds: operation.verseIds ?? [],
    })
    setIsFormOpen(true)
  }

  const save = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSaving(true)
    try {
      if (editingId) {
        await client.model<Operation>("sg.operation").update(editingId, form)
      } else {
        await client.model<Operation>("sg.operation").create(form)
      }
      setIsFormOpen(false)
      await load()
    } catch (saveError) {
      console.error("Unable to save operation:", saveError)
      setError("Operation could not be saved.")
    } finally {
      setIsSaving(false)
    }
  }

  const remove = async (id: number) => {
    if (!confirm("Delete this operation record?")) return
    try {
      await client.model<Operation>("sg.operation").delete(id)
      await load()
    } catch (removeError) {
      console.error("Unable to delete operation:", removeError)
      setError("Operation could not be deleted.")
    }
  }

  const verseLabel = (verse: Verse) => {
    const scripture =
      scriptures.find((item) => item.id === verse.scriptureId)?.name ??
      "Scripture"
    const book = books.find((item) => item.id === verse.bookId)?.name ?? "Book"
    const text = verse.translationId ?? verse.translationEn ?? "No translation"
    return `${scripture} | ${book} ${verse.chapterNumber}:${verse.verseNumber} | ${text.slice(0, 90)}`
  }

  const updateForm = (patch: Partial<OperationForm>) => {
    setForm((currentForm) => ({ ...currentForm, ...patch }))
  }

  return {
    operations,
    error,
    form,
    editingId,
    isFormOpen,
    isSaving,
    verses,
    openCreate,
    openEdit,
    remove,
    save,
    setIsFormOpen,
    updateForm,
    verseLabel,
  }
}

export function ERPShootgunView() {
  const {
    operations,
    error,
    form,
    editingId,
    isFormOpen,
    isSaving,
    verses,
    openCreate,
    openEdit,
    remove,
    save,
    setIsFormOpen,
    updateForm,
    verseLabel,
  } = useErpShootgunController()

  return (
    <div className="space-y-6">
      <ContextBlock
        title="SHOOTGUN OPERATIONS"
        subtitle="Create and maintain operation records for the public archive."
        operation="SHOOTGUN-OPS"
        status="ONLINE"
        accentColor="primary"
      />

      <ERPShootgunOperationRecordsPanel
        operations={operations}
        error={error}
        onCreate={openCreate}
        onEdit={openEdit}
        onRemove={remove}
      />

      {isFormOpen && (
        <ERPShootgunOperationFormPanel
          form={form}
          editingId={editingId}
          isSaving={isSaving}
          verses={verses}
          verseLabel={verseLabel}
          onChange={updateForm}
          onSubmit={save}
          onClose={() => setIsFormOpen(false)}
        />
      )}
    </div>
  )
}
