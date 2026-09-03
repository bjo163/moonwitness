"use client"

import React from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  Button,
  Input,
  Label,
} from "@workspace/ui"
import { type QuranAyahItem } from "@workspace/types"

export interface ScriptureEditDialogProps {
  editingVerse: QuranAyahItem | null
  onClose: () => void
  editArabic: string
  setEditArabic: (v: string) => void
  editTranslit: string
  setEditTranslit: (v: string) => void
  editTranslation: string
  setEditTranslation: (v: string) => void
  editTafsir: string
  setEditTafsir: (v: string) => void
  handleSaveEdit: (e: React.FormEvent) => void
  handleSyncFromApi: () => void
  syncingApi: boolean
}

export function ScriptureEditDialog({
  editingVerse,
  onClose,
  editArabic,
  setEditArabic,
  editTranslit,
  setEditTranslit,
  editTranslation,
  setEditTranslation,
  editTafsir,
  setEditTafsir,
  handleSaveEdit,
  handleSyncFromApi,
  syncingApi,
}: ScriptureEditDialogProps) {
  if (!editingVerse) return null

  return (
    <Dialog open={!!editingVerse} onOpenChange={onClose}>
      <DialogContent className="max-w-xl rounded-3xl p-6">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle>✏️ Edit Ayat & Tafsir Al-Qur&apos;an</DialogTitle>
              <DialogDescription>
                Q.S {editingVerse.surahName} ({editingVerse.surahNumber}:{editingVerse.ayahNumber})
              </DialogDescription>
            </div>

            <Button
              type="button"
              onClick={handleSyncFromApi}
              disabled={syncingApi}
              className="h-8 rounded-xl bg-emerald-600 text-[11px] font-bold text-foreground hover:bg-emerald-700"
            >
              {syncingApi ? "⏳ Syncing..." : "🔄 Pull dari API"}
            </Button>
          </div>
        </DialogHeader>

        <form onSubmit={handleSaveEdit} className="space-y-4 pt-2">
          <div>
            <Label htmlFor="scripture-arabic" className="mb-1 block text-xs">Teks Arab (Uthmani) *</Label>
            <Input
              id="scripture-arabic"
              type="text"
              value={editArabic}
              onChange={(e) => setEditArabic(e.target.value)}
              className="font-arabic text-right text-base font-bold"
              required
            />
          </div>

          <div>
            <Label htmlFor="scripture-translit" className="mb-1 block text-xs">Transliterasi (Teks Latin)</Label>
            <Input
              id="scripture-translit"
              type="text"
              value={editTranslit}
              onChange={(e) => setEditTranslit(e.target.value)}
              className="font-serif text-xs italic"
            />
          </div>

          <div>
            <Label htmlFor="scripture-translation" className="mb-1 block text-xs">Terjemahan Resmi Kemenag RI *</Label>
            <Input
              id="scripture-translation"
              type="text"
              value={editTranslation}
              onChange={(e) => setEditTranslation(e.target.value)}
              className="text-xs font-semibold"
              required
            />
          </div>

          <div>
            <Label htmlFor="scripture-tafsir" className="mb-1 block text-xs">Catatan Tafsir / Hikmah Periodik *</Label>
            <Input
              id="scripture-tafsir"
              type="text"
              value={editTafsir}
              onChange={(e) => setEditTafsir(e.target.value)}
              className="text-xs"
              required
            />
          </div>

          <div className="flex justify-end gap-2 border-t border-border/40 pt-2">
            <Button variant="outline" type="button" onClick={onClose}>
              Batal
            </Button>
            <Button type="submit" className="bg-primary font-bold text-foreground hover:bg-primary">
              💾 Simpan Terjemahan & Tafsir
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
