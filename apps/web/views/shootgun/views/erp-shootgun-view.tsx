"use client"

import { FormEvent, useEffect, useState } from "react"
import {
  ExternalLink,
  Pencil,
  Plus,
  Save,
  ScrollText,
  Trash2,
  X,
} from "lucide-react"
import { ContextBlock } from "@workspace/ui"
import { moonClientInstance } from "@moon/client"

type Operation = {
  id: number
  name: string
  argument?: string
  targetUrl?: string
  targetImage?: string
  wisdom?: string
  verseIds?: number[]
}

type Verse = {
  id: number
  scriptureId: number
  bookId: number
  chapterNumber: number
  verseNumber: number
  translationId?: string
  translationEn?: string
}

type Scripture = { id: number; name: string }
type Book = { id: number; name: string }

const emptyOperation = {
  name: "",
  argument: "",
  targetUrl: "",
  targetImage: "",
  wisdom: "",
  verseIds: [] as number[],
}

export function ERPShootgunView() {
  const client = moonClientInstance
  const [operations, setOperations] = useState<Operation[]>([])
  const [verses, setVerses] = useState<Verse[]>([])
  const [scriptures, setScriptures] = useState<Scripture[]>([])
  const [books, setBooks] = useState<Book[]>([])
  const [form, setForm] = useState(emptyOperation)
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

  return (
    <div className="space-y-6">
      <ContextBlock
        title="SHOOTGUN OPERATIONS"
        subtitle="Create and maintain operation records for the public archive."
        operation="SHOOTGUN-OPS"
        status="ONLINE"
        accentColor="primary"
      />

      <section className="border border-border bg-black/40 backdrop-blur-md">
        <div className="flex flex-col gap-4 border-b border-border p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-sm font-semibold tracking-wider text-white">
              OPERATION RECORDS
            </h2>
            <p className="mt-1 text-xs text-slate-400">
              {operations.length} record(s) visible in the public archive.
            </p>
          </div>
          <button
            onClick={openCreate}
            className="inline-flex h-9 items-center justify-center gap-2 bg-primary px-3 text-xs font-semibold text-slate-950 hover:bg-primary"
          >
            <Plus className="size-4" /> ADD OPERATION
          </button>
        </div>

        {error && (
          <p className="border-b border-red-400/30 bg-red-950/30 px-4 py-3 text-xs text-red-200">
            {error}
          </p>
        )}

        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-xs">
            <thead className="border-b border-border text-slate-500">
              <tr>
                <th className="px-4 py-3 font-medium">NAME</th>
                <th className="px-4 py-3 font-medium">ARGUMENT</th>
                <th className="px-4 py-3 font-medium">VERSE REFERENCES</th>
                <th className="px-4 py-3 text-right font-medium">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {operations.map((operation) => (
                <tr
                  key={operation.id}
                  className="border-b border-border text-slate-300"
                >
                  <td className="px-4 py-3 font-medium text-white">
                    {operation.name}
                  </td>
                  <td className="max-w-80 px-4 py-3 leading-5">
                    {operation.argument || "-"}
                  </td>
                  <td className="px-4 py-3">
                    {operation.verseIds?.length ?? 0} selected
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      {operation.targetUrl && (
                        <a
                          href={operation.targetUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 text-slate-400 hover:text-primary"
                          title="Open target"
                        >
                          <ExternalLink className="size-4" />
                        </a>
                      )}
                      <button
                        onClick={() => openEdit(operation)}
                        className="p-1.5 text-slate-400 hover:text-primary"
                        title="Edit operation"
                      >
                        <Pencil className="size-4" />
                      </button>
                      <button
                        onClick={() => remove(operation.id)}
                        className="p-1.5 text-slate-400 hover:text-red-300"
                        title="Delete operation"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {operations.length === 0 && !error && (
                <tr>
                  <td
                    colSpan={4}
                    className="px-4 py-10 text-center text-slate-500"
                  >
                    No operation records yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/75 p-4 sm:items-center">
          <form
            onSubmit={save}
            className="my-4 w-full max-w-3xl border border-border bg-slate-950 shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-border p-4">
              <div>
                <h2 className="text-sm font-semibold text-white">
                  {editingId ? "EDIT OPERATION" : "NEW OPERATION"}
                </h2>
                <p className="mt-1 text-xs text-slate-400">
                  Verse references can be selected from all four scriptures.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="p-1 text-slate-400 hover:text-white"
                title="Close form"
              >
                <X className="size-5" />
              </button>
            </div>
            <div className="grid gap-4 p-4 sm:grid-cols-2">
              <label className="space-y-1.5 sm:col-span-2">
                <span className="text-xs text-slate-300">Name</span>
                <input
                  required
                  value={form.name}
                  onChange={(event) =>
                    setForm({ ...form, name: event.target.value })
                  }
                  className="h-9 w-full border border-border bg-black/40 px-3 text-sm text-white outline-none focus:border-border"
                />
              </label>
              <label className="space-y-1.5">
                <span className="text-xs text-slate-300">Target URL</span>
                <input
                  type="url"
                  value={form.targetUrl}
                  onChange={(event) =>
                    setForm({ ...form, targetUrl: event.target.value })
                  }
                  className="h-9 w-full border border-border bg-black/40 px-3 text-sm text-white outline-none focus:border-border"
                />
              </label>
              <label className="space-y-1.5">
                <span className="text-xs text-slate-300">Target image URL</span>
                <input
                  type="url"
                  value={form.targetImage}
                  onChange={(event) =>
                    setForm({ ...form, targetImage: event.target.value })
                  }
                  className="h-9 w-full border border-border bg-black/40 px-3 text-sm text-white outline-none focus:border-border"
                />
              </label>
              <label className="space-y-1.5 sm:col-span-2">
                <span className="text-xs text-slate-300">Argument</span>
                <textarea
                  value={form.argument}
                  onChange={(event) =>
                    setForm({ ...form, argument: event.target.value })
                  }
                  className="min-h-24 w-full border border-border bg-black/40 p-3 text-sm text-white outline-none focus:border-border"
                />
              </label>
              <label className="space-y-1.5 sm:col-span-2">
                <span className="text-xs text-slate-300">Wisdom</span>
                <textarea
                  value={form.wisdom}
                  onChange={(event) =>
                    setForm({ ...form, wisdom: event.target.value })
                  }
                  className="min-h-24 w-full border border-border bg-black/40 p-3 text-sm text-white outline-none focus:border-border"
                />
              </label>
              <label className="space-y-1.5 sm:col-span-2">
                <span className="flex items-center gap-2 text-xs text-slate-300">
                  <ScrollText className="size-4 text-primary" /> Verse
                  references
                </span>
                <select
                  multiple
                  value={form.verseIds.map(String)}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      verseIds: Array.from(
                        event.currentTarget.selectedOptions,
                        (option) => Number(option.value)
                      ),
                    })
                  }
                  className="h-48 w-full border border-border bg-black/40 p-2 text-xs text-white outline-none focus:border-border"
                >
                  {verses.map((verse) => (
                    <option key={verse.id} value={verse.id}>
                      {verseLabel(verse)}
                    </option>
                  ))}
                </select>
                <span className="block text-[11px] text-slate-500">
                  {form.verseIds.length} verse(s) selected. The first 200 verses
                  are available for selection.
                </span>
              </label>
            </div>
            <div className="flex justify-end gap-3 border-t border-border p-4">
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="h-9 px-3 text-xs text-slate-300 hover:text-white"
              >
                Cancel
              </button>
              <button
                disabled={isSaving}
                className="inline-flex h-9 items-center gap-2 bg-primary px-4 text-xs font-semibold text-slate-950 disabled:opacity-60"
              >
                <Save className="size-4" />
                {isSaving ? "SAVING..." : "SAVE OPERATION"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
