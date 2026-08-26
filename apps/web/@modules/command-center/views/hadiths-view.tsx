"use client"

import { useEffect, useState } from "react"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@workspace/ui/components/card"
import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@workspace/ui/components/dialog"
import { ContextBlock } from "@core/ui"

type HadithEntry = {
  id: string
  book: string
  number: number
  arabicText: string
  translation: string
  grade: string
  topic: string
}

const INITIAL_HADITHS: HadithEntry[] = [
  {
    id: "1",
    book: "Shahih Bukhari",
    number: 1,
    arabicText: "إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ",
    translation: "Sesungguhnya setiap amalan itu tergantung pada niatnya.",
    grade: "Shahih Utama",
    topic: "Niat & Keikhlasan",
  },
  {
    id: "2",
    book: "Shahih Muslim",
    number: 223,
    arabicText: "الطُّهُورُ شَطْرُ الإِيمَانِ",
    translation: "Bersuci itu adalah setengah dari keimanan.",
    grade: "Shahih Utama",
    topic: "Thaharah & Keberkahan",
  },
]

export function ErpHadithsView() {
  const [hadiths, setHadiths] = useState<HadithEntry[]>(INITIAL_HADITHS)
  const [editingId, setEditingId] = useState<string | null>(null)

  // Edit Inline Form State
  const [editBook, setEditBook] = useState("")
  const [editNumber, setEditNumber] = useState(1)
  const [editArabic, setEditArabic] = useState("")
  const [editTranslation, setEditTranslation] = useState("")

  // Add State
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [addBook, setAddBook] = useState("Shahih Bukhari")
  const [addNumber, setAddNumber] = useState(1)
  const [addArabic, setAddArabic] = useState("")
  const [addTranslation, setAddTranslation] = useState("")

  const [notification, setNotification] = useState("")

  useEffect(() => {
    const saved = localStorage.getItem("mw_erp_hadiths_data")
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed) && parsed.length > 0) {
          setTimeout(() => setHadiths(parsed), 0)
        }
      } catch (e) {
        console.error("Failed to load HADITHS data state:", e)
      }
    }
  }, [])

  const saveHadithsState = (newHadiths: HadithEntry[]) => {
    setHadiths(newHadiths)
    localStorage.setItem("mw_erp_hadiths_data", JSON.stringify(newHadiths))
  }

  const showNotify = (msg: string) => {
    setNotification(msg)
    setTimeout(() => setNotification(""), 3500)
  }

  const startEdit = (h: HadithEntry) => {
    setEditingId(h.id)
    setEditBook(h.book)
    setEditNumber(h.number)
    setEditArabic(h.arabicText)
    setEditTranslation(h.translation)
  }

  const saveInlineEdit = (id: string) => {
    if (!editBook.trim() || !editTranslation.trim()) return

    const updated = hadiths.map((h) => {
      if (h.id === id) {
        return {
          ...h,
          book: editBook.trim(),
          number: Number(editNumber) || 1,
          arabicText: editArabic.trim(),
          translation: editTranslation.trim(),
        }
      }
      return h
    })

    saveHadithsState(updated)
    setEditingId(null)
    showNotify(
      `✅ Hadits ${editBook} #${editNumber} berhasil diperbarui & disimpan permanen!`
    )
  }

  const handleAddHadith = (e: React.FormEvent) => {
    e.preventDefault()
    if (!addBook.trim() || !addTranslation.trim()) return

    const newHadith: HadithEntry = {
      id: Date.now().toString(),
      book: addBook.trim(),
      number: Number(addNumber) || 1,
      arabicText: addArabic.trim() || "📜",
      translation: addTranslation.trim(),
      grade: "Shahih Verified",
      topic: "Akhlaq & Tauhid",
    }

    const updated = [newHadith, ...hadiths]
    saveHadithsState(updated)
    setIsAddOpen(false)
    setAddArabic("")
    setAddTranslation("")
    showNotify(
      `✅ Entry Hadits ${newHadith.book} #${newHadith.number} berhasil ditambahkan!`
    )
  }

  const handleDeleteHadith = (id: string, book: string, num: number) => {
    if (
      !confirm(
        `Apakah Anda yakin ingin menghapus entri Hadits ${book} #${num}?`
      )
    )
      return
    const updated = hadiths.filter((h) => h.id !== id)
    saveHadithsState(updated)
    showNotify(`🗑️ Hadits ${book} #${num} telah dihapus.`)
  }

  return (
    <>
      <div className="space-y-6">
        <ContextBlock
          title="DATABASE HADITS ROTASI"
          subtitle="Kelola daftar hadits yang akan ditampilkan pada sistem rotasi harian jamaah (Daily Rotation)."
          operation="HADITH-DATABASE-MGMT"
          status="ONLINE"
          accentColor="knowledge"
        />

        {/* Header */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div />

          <Button
            onClick={() => setIsAddOpen(true)}
            className="shrink-0 rounded-xl bg-purple-600 px-4 py-2 text-xs font-bold text-white shadow-md hover:bg-purple-700"
          >
            ➕ Tambah Entry Hadits
          </Button>
        </div>

        {notification && (
          <div className="flex animate-in items-center gap-2 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-xs font-bold text-emerald-600 fade-in dark:text-emerald-400">
            <span>{notification}</span>
          </div>
        )}

        {/* Hadith List */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Indeksasi & Koleksi Hadits Active</CardTitle>
              <CardDescription>
                Klik Edit Terjemahan untuk mengedit data hadits secara langsung
              </CardDescription>
            </div>
            <Badge variant="secondary" className="bg-purple-600 text-white">
              {hadiths.length} Entries
            </Badge>
          </CardHeader>
          <CardContent className="space-y-4">
            {hadiths.map((h) => {
              const isEditing = editingId === h.id

              return (
                <div
                  key={h.id}
                  className="space-y-3 rounded-2xl border border-border/40 bg-card p-4 transition-all hover:bg-muted/20"
                >
                  {isEditing ? (
                    /* EDIT INLINE FORM */
                    <div className="space-y-3 rounded-xl border border-purple-500/30 bg-muted/40 p-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-purple-600 dark:text-purple-400">
                          ✏️ Edit Hadits #{h.id}
                        </span>
                        <Badge variant="outline" className="text-[10px]">
                          Inline Mode
                        </Badge>
                      </div>

                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <div>
                          <Label className="mb-1 block text-[11px]">
                            Nama Kitab Hadits
                          </Label>
                          <Input
                            type="text"
                            value={editBook}
                            onChange={(e) => setEditBook(e.target.value)}
                            required
                          />
                        </div>

                        <div>
                          <Label className="mb-1 block text-[11px]">
                            Nomor Hadits
                          </Label>
                          <Input
                            type="number"
                            value={editNumber}
                            onChange={(e) =>
                              setEditNumber(Number(e.target.value))
                            }
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <Label className="mb-1 block text-[11px]">
                          Matan Arab (Opsional)
                        </Label>
                        <Input
                          type="text"
                          value={editArabic}
                          onChange={(e) => setEditArabic(e.target.value)}
                        />
                      </div>

                      <div>
                        <Label className="mb-1 block text-[11px]">
                          Terjemahan Hadits
                        </Label>
                        <Input
                          type="text"
                          value={editTranslation}
                          onChange={(e) => setEditTranslation(e.target.value)}
                          required
                        />
                      </div>

                      <div className="flex items-center justify-end gap-2 pt-2">
                        <Button
                          variant="outline"
                          onClick={() => setEditingId(null)}
                          className="h-8 rounded-xl px-3 text-xs font-bold"
                        >
                          Batal
                        </Button>
                        <Button
                          onClick={() => saveInlineEdit(h.id)}
                          className="h-8 rounded-xl bg-purple-600 px-4 text-xs font-bold text-white hover:bg-purple-700"
                        >
                          💾 Simpan Perubahan
                        </Button>
                      </div>
                    </div>
                  ) : (
                    /* NORMAL VIEW */
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-extrabold text-foreground">
                            {h.book} (No. {h.number})
                          </span>
                          <Badge
                            variant="secondary"
                            className="bg-purple-600 text-[9px] text-white"
                          >
                            {h.grade}
                          </Badge>
                          <Badge variant="outline" className="text-[9px]">
                            {h.topic}
                          </Badge>
                        </div>

                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            onClick={() => startEdit(h)}
                            className="h-7 rounded-xl px-2.5 text-[11px] font-bold"
                          >
                            ✏️ Edit Terjemahan
                          </Button>
                          <Button
                            variant="destructive"
                            onClick={() =>
                              handleDeleteHadith(h.id, h.book, h.number)
                            }
                            className="h-7 rounded-xl px-2.5 text-[11px] font-bold"
                          >
                            🗑️ Hapus
                          </Button>
                        </div>
                      </div>

                      {h.arabicText && (
                        <p className="font-arabic text-right text-base leading-loose font-bold text-primary">
                          {h.arabicText}
                        </p>
                      )}

                      <p className="rounded-xl border border-border/30 bg-muted/40 p-3 text-xs text-muted-foreground">
                        "{h.translation}"
                      </p>
                    </div>
                  )}
                </div>
              )
            })}
          </CardContent>
        </Card>
      </div>

      {/* ADD MODAL */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
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
              <Button
                variant="outline"
                type="button"
                onClick={() => setIsAddOpen(false)}
              >
                Batal
              </Button>
              <Button
                type="submit"
                className="bg-purple-600 font-bold text-white hover:bg-purple-700"
              >
                Simpan Hadits
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
