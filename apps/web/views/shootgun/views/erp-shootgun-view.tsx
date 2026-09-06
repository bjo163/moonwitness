"use client"

import { ChangeEvent, FormEvent, useEffect, useState } from "react"
import {
  ExternalLink,
  Pencil,
  Plus,
  Save,
  ScrollText,
  Trash2,
  X,
} from "lucide-react"
import { Button, ContextBlock, Input, NativeSelect, NativeSelectOption, Table, TableBody, TableCell, TableHead, TableHeader, TableRow, Textarea } from "@workspace/ui"
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

      <section className="border border-border bg-card backdrop-blur-md">
        <div className="flex flex-col gap-4 border-b border-border p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-sm font-semibold tracking-wider text-foreground">
              OPERATION RECORDS
            </h2>
            <p className="mt-1 text-xs text-muted-foreground">
              {operations.length} record(s) visible in the public archive.
            </p>
          </div>
          <Button
            type="button"
            size="sm"
            onClick={openCreate}
            className="inline-flex h-9 items-center justify-center gap-2 bg-primary px-3 text-xs font-semibold text-primary-foreground hover:bg-primary"
          >
            <Plus className="size-4" /> ADD OPERATION
          </Button>
        </div>

        {error && (
          <p className="border-b border-destructive/30 bg-red-950/30 px-4 py-3 text-xs text-red-200">
            {error}
          </p>
        )}

        <div className="overflow-x-auto">
          <Table className="w-full min-w-[760px] text-left text-xs">
            <TableHeader className="border-b border-border text-muted-foreground">
              <TableRow>
                <TableHead className="px-4 py-3 font-medium">NAME</TableHead>
                <TableHead className="px-4 py-3 font-medium">ARGUMENT</TableHead>
                <TableHead className="px-4 py-3 font-medium">VERSE REFERENCES</TableHead>
                <TableHead className="px-4 py-3 text-right font-medium">ACTIONS</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {operations.map((operation) => (
                <TableRow
                  key={operation.id}
                  className="border-b border-border text-foreground"
                >
                  <TableCell className="px-4 py-3 font-medium text-foreground">
                    {operation.name}
                  </TableCell>
                  <TableCell className="max-w-80 px-4 py-3 leading-5">
                    {operation.argument || "-"}
                  </TableCell>
                  <TableCell className="px-4 py-3">
                    {operation.verseIds?.length ?? 0} selected
                  </TableCell>
                  <TableCell className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      {operation.targetUrl && (
                        <a
                          href={operation.targetUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 text-muted-foreground hover:text-primary"
                          title="Open target"
                        >
                          <ExternalLink className="size-4" />
                        </a>
                      )}
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-xs"
                        onClick={() => openEdit(operation)}
                        className="p-1.5 text-muted-foreground hover:text-primary"
                        title="Edit operation"
                      >
                        <Pencil className="size-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-xs"
                        onClick={() => remove(operation.id)}
                        className="p-1.5 text-muted-foreground hover:text-red-300"
                        title="Delete operation"
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {operations.length === 0 && !error && (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="px-4 py-10 text-center text-muted-foreground"
                  >
                    No operation records yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </section>

      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-card/75 p-4 sm:items-center">
          <form
            onSubmit={save}
            className="my-4 w-full max-w-3xl border border-border bg-background shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-border p-4">
              <div>
                <h2 className="text-sm font-semibold text-foreground">
                  {editingId ? "EDIT OPERATION" : "NEW OPERATION"}
                </h2>
                <p className="mt-1 text-xs text-muted-foreground">
                  Verse references can be selected from all four scriptures.
                </p>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                onClick={() => setIsFormOpen(false)}
                className="p-1 text-muted-foreground hover:text-foreground"
                title="Close form"
              >
                <X className="size-5" />
              </Button>
            </div>
            <div className="grid gap-4 p-4 sm:grid-cols-2">
              <label className="space-y-1.5 sm:col-span-2">
                <span className="text-xs text-foreground">Name</span>
                <Input
                  required
                  value={form.name}
                  onChange={(event: ChangeEvent<HTMLInputElement>) =>
                    setForm({ ...form, name: event.target.value })
                  }
                  className="h-9 w-full border border-border bg-card px-3 text-sm text-foreground outline-none focus:border-border"
                />
              </label>
              <label className="space-y-1.5">
                <span className="text-xs text-foreground">Target URL</span>
                <Input
                  type="url"
                  value={form.targetUrl}
                  onChange={(event: ChangeEvent<HTMLInputElement>) =>
                    setForm({ ...form, targetUrl: event.target.value })
                  }
                  className="h-9 w-full border border-border bg-card px-3 text-sm text-foreground outline-none focus:border-border"
                />
              </label>
              <label className="space-y-1.5">
                <span className="text-xs text-foreground">Target image URL</span>
                <Input
                  type="url"
                  value={form.targetImage}
                  onChange={(event: ChangeEvent<HTMLInputElement>) =>
                    setForm({ ...form, targetImage: event.target.value })
                  }
                  className="h-9 w-full border border-border bg-card px-3 text-sm text-foreground outline-none focus:border-border"
                />
              </label>
              <label className="space-y-1.5 sm:col-span-2">
                <span className="text-xs text-foreground">Argument</span>
                <Textarea
                  value={form.argument}
                  onChange={(event: ChangeEvent<HTMLTextAreaElement>) =>
                    setForm({ ...form, argument: event.target.value })
                  }
                  className="min-h-24 w-full border border-border bg-card p-3 text-sm text-foreground outline-none focus:border-border"
                />
              </label>
              <label className="space-y-1.5 sm:col-span-2">
                <span className="text-xs text-foreground">Wisdom</span>
                <Textarea
                  value={form.wisdom}
                  onChange={(event: ChangeEvent<HTMLTextAreaElement>) =>
                    setForm({ ...form, wisdom: event.target.value })
                  }
                  className="min-h-24 w-full border border-border bg-card p-3 text-sm text-foreground outline-none focus:border-border"
                />
              </label>
              <label className="space-y-1.5 sm:col-span-2">
                <span className="flex items-center gap-2 text-xs text-foreground">
                  <ScrollText className="size-4 text-primary" /> Verse
                  references
                </span>
                <NativeSelect
                  multiple
                  value={form.verseIds.map(String)}
                  onChange={(event: ChangeEvent<HTMLSelectElement>) =>
                    setForm({
                      ...form,
                      verseIds: Array.from(
                        event.currentTarget.selectedOptions,
                        (option) => Number(option.value)
                      ),
                    })
                  }
                  className="h-48 w-full border border-border bg-card p-2 text-xs text-foreground outline-none focus:border-border"
                >
                  {verses.map((verse) => (
                    <NativeSelectOption key={verse.id} value={verse.id}>
                      {verseLabel(verse)}
                    </NativeSelectOption>
                  ))}
                </NativeSelect>
                <span className="block text-[11px] text-muted-foreground">
                  {form.verseIds.length} verse(s) selected. The first 200 verses
                  are available for selection.
                </span>
              </label>
            </div>
            <div className="flex justify-end gap-3 border-t border-border p-4">
              <Button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="h-9 px-3 text-xs text-foreground hover:text-foreground"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSaving}
                className="inline-flex h-9 items-center gap-2 bg-primary px-4 text-xs font-semibold text-primary-foreground disabled:opacity-60"
              >
                <Save className="size-4" />
                {isSaving ? "SAVING..." : "SAVE OPERATION"}
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
