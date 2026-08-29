"use client"

import React, { useState } from "react"
import {
  Badge,
  Button,
  ContextBlock,
  ResourceTable,
  type TableColumn,
} from "@workspace/ui"
import { useResource, useModal } from "@workspace/hooks"
import { type HadithEntry, STORAGE_KEYS } from "@workspace/types"
import { fetchHadiths, saveHadith } from "@moon/client"
import { HadithAddDialog } from "./hadiths/hadith-add-dialog"

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

export function HadithsView() {
  const { data: hadiths, loading, error, refetch, mutate } = useResource<HadithEntry[]>(
    async () => {
      const res = await fetchHadiths()
      return Array.isArray(res) && res.length > 0 ? res : INITIAL_HADITHS
    },
    {
      initialData: INITIAL_HADITHS,
      storageKey: STORAGE_KEYS.HADITHS,
    }
  )

  const addModal = useModal<HadithEntry>()
  const [notification, setNotification] = useState("")

  // Form states for Add modal
  const [addBook, setAddBook] = useState("Shahih Bukhari")
  const [addNumber, setAddNumber] = useState(1)
  const [addArabic, setAddArabic] = useState("")
  const [addTranslation, setAddTranslation] = useState("")

  const showNotify = (msg: string) => {
    setNotification(msg)
    setTimeout(() => setNotification(""), 3500)
  }

  const handleDeleteHadith = (item: HadithEntry) => {
    if (confirm(`Yakin ingin menghapus ${item.book} No. ${item.number}?`)) {
      mutate((prev) => (prev || []).filter((h) => h.id !== item.id))
      showNotify(`🗑️ Hadits ${item.book} (No. ${item.number}) dihapus.`)
    }
  }

  const handleAddHadith = (e: React.FormEvent) => {
    e.preventDefault()
    const newEntry: HadithEntry = {
      id: Date.now().toString(),
      book: addBook,
      number: addNumber,
      arabicText: addArabic,
      translation: addTranslation,
      grade: "Shahih Verified",
      topic: "Umum & Adab",
    }

    mutate((prev) => [newEntry, ...(prev || [])])
    saveHadith(newEntry).catch(() => {})

    addModal.close()
    setAddArabic("")
    setAddTranslation("")
    showNotify(`✅ Hadits baru ${addBook} No. ${addNumber} berhasil ditambahkan!`)
  }

  const columns: TableColumn<HadithEntry>[] = [
    {
      key: "book",
      label: "KITAB & NOMOR",
      width: "180px",
      render: (h) => (
        <div className="space-y-1">
          <span className="font-extrabold text-foreground">{h.book}</span>
          <div className="flex items-center gap-1.5">
            <Badge variant="secondary" className="bg-muted text-primary dark:text-primary border border-border text-[9px] font-semibold">
              No. {h.number}
            </Badge>
            <Badge variant="outline" className="text-[9px]">
              {h.grade || "Shahih"}
            </Badge>
          </div>
        </div>
      ),
    },
    {
      key: "arabicText",
      label: "MATAN ARAB",
      width: "260px",
      align: "right",
      className: "font-arabic text-sm font-bold text-foreground",
    },
    {
      key: "translation",
      label: "TERJEMAHAN INDONESIA",
      render: (h) => (
        <p className="font-mono text-xs text-muted-foreground">
          &quot;{h.translation}&quot;
        </p>
      ),
    },
  ]

  return (
    <>
      <div className="space-y-6">
        <ContextBlock
          title="MANAJEMEN DATABASE HADITS"
          subtitle="Entri, revisi terjemahan, dan sinkronisasi koleksi Kitab 9 Imam untuk konsumsi jamaah secara real-time."
          operation="HADITH-CATALOG-MGMT"
          status="ONLINE"
          accentColor="primary"
        />

        {notification && (
          <div className="flex animate-in items-center gap-2 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-xs font-bold text-emerald-600 fade-in dark:text-emerald-400">
            <span>{notification}</span>
          </div>
        )}

        {error && (
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-cyber-pink/30 bg-cyber-pink/10 p-4 text-xs text-cyber-pink">
            <span>Gagal menyegarkan katalog hadits. Data tersimpan lokal tetap tersedia.</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => void refetch()}
              className="border-cyber-pink/40 text-cyber-pink hover:bg-cyber-pink/10"
            >
              COBA LAGI
            </Button>
          </div>
        )}

        <ResourceTable<HadithEntry>
          title="DAFTAR ENTRI HADITS PILIHAN"
          subtitle={`Menampilkan ${hadiths?.length || 0} hadits aktif dalam sistem database`}
          data={hadiths || []}
          columns={columns}
          searchKeys={["book", "translation", "arabicText", "number"]}
          accentColor="purple"
          loading={loading}
          onDelete={handleDeleteHadith}
          emptyMessage="Belum ada entri hadits yang tersedia."
          headerActions={
            <Button
              onClick={() => addModal.open()}
              className="flex items-center gap-2 rounded-lg border border-border bg-muted px-4 py-1.5 text-xs font-semibold text-primary dark:text-primary hover:bg-muted"
            >
              <span>+ Tambah Hadits</span>
            </Button>
          }
        />
      </div>

      <HadithAddDialog
        isOpen={addModal.isOpen}
        onClose={() => addModal.close()}
        addBook={addBook}
        setAddBook={setAddBook}
        addNumber={addNumber}
        setAddNumber={setAddNumber}
        addArabic={addArabic}
        setAddArabic={setAddArabic}
        addTranslation={addTranslation}
        setAddTranslation={setAddTranslation}
        handleAddHadith={handleAddHadith}
      />
    </>
  )
}

export const ErpHadithsView = HadithsView
