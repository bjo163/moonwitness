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

export interface HadithAddDialogProps {
  isOpen: boolean
  onClose: () => void
  addBook: string
  setAddBook: (v: string) => void
  addNumber: number
  setAddNumber: (v: number) => void
  addArabic: string
  setAddArabic: (v: string) => void
  addTranslation: string
  setAddTranslation: (v: string) => void
  handleAddHadith: (e: React.FormEvent) => void
}

export function HadithAddDialog({
  isOpen,
  onClose,
  addBook,
  setAddBook,
  addNumber,
  setAddNumber,
  addArabic,
  setAddArabic,
  addTranslation,
  setAddTranslation,
  handleAddHadith,
}: HadithAddDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md rounded-3xl p-6">
        <DialogHeader>
          <DialogTitle>➕ Tambah Entry Hadits Baru</DialogTitle>
          <DialogDescription>
            Masukkan matan Arab dan terjemahan hadits
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleAddHadith} className="space-y-4">
          <div>
            <Label className="mb-1 block">Nama Kitab Hadits *</Label>
            <Input
              type="text"
              placeholder="contoh: Shahih Bukhari"
              value={addBook}
              onChange={(e) => setAddBook(e.target.value)}
              required
            />
          </div>

          <div>
            <Label className="mb-1 block">Nomor Hadits *</Label>
            <Input
              type="number"
              value={addNumber}
              onChange={(e) => setAddNumber(Number(e.target.value))}
              required
            />
          </div>

          <div>
            <Label className="mb-1 block">Matan Arab (Opsional)</Label>
            <Input
              type="text"
              placeholder="Tuliskan matan Arab"
              value={addArabic}
              onChange={(e) => setAddArabic(e.target.value)}
            />
          </div>

          <div>
            <Label className="mb-1 block">Terjemahan Hadits *</Label>
            <Input
              type="text"
              placeholder="Tuliskan terjemahan Indonesia..."
              value={addTranslation}
              onChange={(e) => setAddTranslation(e.target.value)}
              required
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" type="button" onClick={onClose}>
              Batal
            </Button>
            <Button type="submit" className="bg-primary font-bold text-white hover:bg-primary">
              Simpan Hadits
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
