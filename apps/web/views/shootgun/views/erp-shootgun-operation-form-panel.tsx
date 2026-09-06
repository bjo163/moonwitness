"use client"

import type { ChangeEvent, FormEvent } from "react"
import { ScrollText } from "lucide-react"
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
  NativeSelect,
  NativeSelectOption,
  Textarea,
} from "@workspace/ui"
import type { OperationForm, Verse } from "./erp-shootgun-types"

type OperationFormPanelProps = {
  form: OperationForm
  editingId: number | null
  isSaving: boolean
  verses: Verse[]
  verseLabel: (verse: Verse) => string
  onChange: (patch: Partial<OperationForm>) => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
  onClose: () => void
}

export function ERPShootgunOperationFormPanel({
  form,
  editingId,
  isSaving,
  verses,
  verseLabel,
  onChange,
  onSubmit,
  onClose,
}: OperationFormPanelProps) {
  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        showCloseButton={false}
        className="max-h-[calc(100vh-2rem)] max-w-3xl overflow-y-auto border-border bg-background p-0"
      >
        <form onSubmit={onSubmit}>
          <DialogHeader className="border-b border-border p-4">
            <DialogTitle className="text-sm font-semibold text-foreground">
              {editingId ? "EDIT OPERATION" : "NEW OPERATION"}
            </DialogTitle>
            <DialogDescription className="mt-1 text-xs text-muted-foreground">
              Verse references can be selected from all four scriptures.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 p-4 sm:grid-cols-2">
            <label className="space-y-1.5 sm:col-span-2">
              <span className="text-xs text-foreground">Name</span>
              <Input
                required
                value={form.name}
                onChange={(event: ChangeEvent<HTMLInputElement>) =>
                  onChange({ name: event.target.value })
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
                  onChange({ targetUrl: event.target.value })
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
                  onChange({ targetImage: event.target.value })
                }
                className="h-9 w-full border border-border bg-card px-3 text-sm text-foreground outline-none focus:border-border"
              />
            </label>
            <label className="space-y-1.5 sm:col-span-2">
              <span className="text-xs text-foreground">Argument</span>
              <Textarea
                value={form.argument}
                onChange={(event: ChangeEvent<HTMLTextAreaElement>) =>
                  onChange({ argument: event.target.value })
                }
                className="min-h-24 w-full border border-border bg-card p-3 text-sm text-foreground outline-none focus:border-border"
              />
            </label>
            <label className="space-y-1.5 sm:col-span-2">
              <span className="text-xs text-foreground">Wisdom</span>
              <Textarea
                value={form.wisdom}
                onChange={(event: ChangeEvent<HTMLTextAreaElement>) =>
                  onChange({ wisdom: event.target.value })
                }
                className="min-h-24 w-full border border-border bg-card p-3 text-sm text-foreground outline-none focus:border-border"
              />
            </label>
            <label className="space-y-1.5 sm:col-span-2">
              <span className="flex items-center gap-2 text-xs text-foreground">
                <ScrollText className="size-4 text-primary" /> Verse references
              </span>
              <NativeSelect
                multiple
                value={form.verseIds.map(String)}
                onChange={(event: ChangeEvent<HTMLSelectElement>) =>
                  onChange({
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

          <DialogFooter className="border-t border-border p-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="h-9 px-3 text-xs text-foreground hover:text-foreground"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSaving}
              className="inline-flex h-9 items-center gap-2 bg-primary px-4 text-xs font-semibold text-primary-foreground disabled:opacity-60"
            >
              {isSaving ? "SAVING..." : "SAVE OPERATION"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
