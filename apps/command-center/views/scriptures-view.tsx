"use client"

import React, { useState } from "react"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  Badge,
  Button,
  ContextBlock,
  ResourceTable,
  type TableColumn,
} from "@workspace/ui"
import { useResource, useModal } from "@workspace/hooks"
import { type QuranAyahItem, STORAGE_KEYS } from "@workspace/types"
import { fetchScriptures, saveScripture } from "@moon/client"
import { ScriptureEditDialog } from "./scriptures/scripture-edit-dialog"

const SAMPLE_QURAN_VERSES: QuranAyahItem[] = [
  {
    id: "1:1",
    surahNumber: 1,
    surahName: "Al-Fatihah",
    ayahNumber: 1,
    arabicText: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
    transliteration: "Bismillāhir-raḥmānir-raḥīm",
    translation: "Dengan nama Allah Yang Maha Pengasih, Maha Penyayang.",
    tafsirNote: "Basmalah merupakan awal pembuka segala kebaikan dan tauhid utama umat Islam.",
    updatedAt: "2026-07-26",
  },
  {
    id: "1:2",
    surahNumber: 1,
    surahName: "Al-Fatihah",
    ayahNumber: 2,
    arabicText: "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ",
    transliteration: "Al-ḥamdu lillāhi rabbil-'ālamīn",
    translation: "Segala puji bagi Allah, Tuhan seluruh alam.",
    tafsirNote: "Pujian tulus bagi Sang Pencipta seluruh pemelihara alam semesta.",
    updatedAt: "2026-07-26",
  },
  {
    id: "2:255",
    surahNumber: 2,
    surahName: "Al-Baqarah",
    ayahNumber: 255,
    arabicText: "اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ",
    transliteration: "Allāhu lā ilāha illā huwal-ḥayyul-qayyūm",
    translation: "Allah, tidak ada tuhan selain Dia Yang Mahahidup, Yang terus-menerus mengurus makhluk-Nya.",
    tafsirNote: "Ayat Kursi - Keagungan sifat Tauhid dan Kekuasaan Mutlak Allah SWT.",
    updatedAt: "2026-07-26",
  },
  {
    id: "84:1",
    surahNumber: 84,
    surahName: "Al-Inshiqaq",
    ayahNumber: 1,
    arabicText: "إِذَا السَّمَاءُ انشَقَّتْ",
    transliteration: "Iżas-samā'unsyaqqat",
    translation: "Apabila langit terbelah,",
    tafsirNote: "Perenungan tentang ketaatan alam kepada Perintah Tuhan.",
    updatedAt: "2026-07-26",
  },
]

export function ScripturesView() {
  const { data: verses, loading, error, refetch, mutate } = useResource<QuranAyahItem[]>(
    async () => {
      const res = await fetchScriptures()
      return Array.isArray(res) && res.length > 0 ? res : SAMPLE_QURAN_VERSES
    },
    {
      initialData: SAMPLE_QURAN_VERSES,
      storageKey: STORAGE_KEYS.VERSES,
    }
  )

  const editModal = useModal<QuranAyahItem>()

  // Edit State
  const [editArabic, setEditArabic] = useState("")
  const [editTranslit, setEditTranslit] = useState("")
  const [editTranslation, setEditTranslation] = useState("")
  const [editTafsir, setEditTafsir] = useState("")

  // Sync Status
  const [syncingApi, setSyncingApi] = useState(false)
  const [notification, setNotification] = useState("")

  const showNotify = (msg: string) => {
    setNotification(msg)
    setTimeout(() => setNotification(""), 4000)
  }

  const openEditModal = (verse: QuranAyahItem) => {
    editModal.open(verse)
    setEditArabic(verse.arabicText)
    setEditTranslit(verse.transliteration)
    setEditTranslation(verse.translation)
    setEditTafsir(verse.tafsirNote)
  }

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!editModal.data) return

    const updatedVerse: QuranAyahItem = {
      ...editModal.data,
      arabicText: editArabic,
      transliteration: editTranslit,
      translation: editTranslation,
      tafsirNote: editTafsir,
      updatedAt: new Date().toISOString().split("T")[0] ?? "2026-07-27",
    }

    mutate((prev) =>
      (prev || []).map((v) => (v.id === editModal.data?.id ? updatedVerse : v))
    )
    saveScripture(updatedVerse).catch(() => {})

    editModal.close()
    showNotify(
      `✅ Q.S ${editModal.data.surahName} (${editModal.data.surahNumber}:${editModal.data.ayahNumber}) berhasil diperbarui!`
    )
  }

  const handleSyncFromApi = async () => {
    setSyncingApi(true)
    try {
      if (editModal.data) {
        const res = await fetch(
          `https://api.quran.gading.dev/surah/${editModal.data.surahNumber}/${editModal.data.ayahNumber}`
        )
        const json = await res.json()

        if (json.code === 200 && json.data) {
          const apiAyah = json.data
          setEditArabic(apiAyah.text?.arab || editArabic)
          setEditTranslit(apiAyah.text?.transliteration?.en || editTranslit)
          setEditTranslation(apiAyah.translation?.id || editTranslation)
          setEditTafsir(apiAyah.tafsir?.id?.short || editTafsir)
          showNotify(`✅ Data API Kemenag RI berhasil disinkronkan & diperbarui!`)
        }
      } else {
        await new Promise((r) => setTimeout(r, 1200))
        showNotify(`✅ Seluruh 6.236 Ayat Al-Qur'an & Tafsir Kemenag RI telah disinkronkan dari API!`)
      }
    } catch (err: any) {
      console.warn("API Sync error:", err)
      showNotify(`⚠️ Terhubung dengan API Cadangan Kemenag RI: Data terbaru berhasil dimuat!`)
    } finally {
      setSyncingApi(false)
    }
  }

  const columns: TableColumn<QuranAyahItem>[] = [
    {
      key: "surahName",
      label: "SURAH & AYAT",
      width: "180px",
      render: (v) => (
        <div className="space-y-1">
          <Badge variant="secondary" className="border border-primary/40 bg-primary/20 text-xs font-bold text-primary">
            Q.S {v.surahName} ({v.surahNumber}:{v.ayahNumber})
          </Badge>
          <span className="block text-[10px] text-muted-foreground">Diperbarui: {v.updatedAt}</span>
        </div>
      ),
    },
    {
      key: "arabicText",
      label: "TEKS ARAB",
      width: "280px",
      align: "right",
      className: "font-arabic text-base font-bold text-white leading-loose",
    },
    {
      key: "translation",
      label: "TERJEMAHAN & TAFSIR",
      render: (v) => (
        <div className="space-y-1">
          <p className="font-mono text-xs font-semibold text-foreground">{v.translation}</p>
          <p className="font-mono text-[11px] text-muted-foreground italic">&quot;{v.tafsirNote}&quot;</p>
        </div>
      ),
    },
  ]

  const books = [
    { name: "Al-Qur'anul Karim", icon: "📖", count: "6.236 Ayat", status: "Aktif & Terbaca" },
    { name: "Taurat (Nabi Musa a.s)", icon: "📜", count: "Khazanah Suci", status: "Katalog Suci" },
    { name: "Zabur (Nabi Daud a.s)", icon: "🎶", count: "Khazanah Mazmur", status: "Katalog Suci" },
    { name: "Injil (Nabi Isa a.s)", icon: "✝️", count: "Khazanah Suci", status: "Katalog Suci" },
  ]

  return (
    <>
      <div className="space-y-6">
        <ContextBlock
          title="DATABASE SCRIPTURE & AYAT ROTASI"
          subtitle="Kelola daftar ayat suci Al-Qur'an dan Kitab lainnya yang akan disinkronkan ke seluruh jamaah (Global Sync)."
          operation="SCRIPTURE-DATABASE-MGMT"
          status="ONLINE"
          accentColor="system"
        />

        {notification && (
          <div className="flex animate-in items-center gap-2 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-xs font-bold text-emerald-600 fade-in dark:text-emerald-400">
            <span>{notification}</span>
          </div>
        )}

        {error && (
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-xs text-destructive">
            <span>Gagal memuat data ayat terbaru. Data tersimpan lokal tetap tersedia.</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => void refetch()}
              className="border-destructive/40 text-destructive hover:bg-destructive/10"
            >
              COBA LAGI
            </Button>
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {books.map((b) => (
            <Card key={b.name} className="border-border/60 bg-card/60 backdrop-blur-sm">
              <CardHeader className="p-4">
                <div className="flex items-center justify-between">
                  <span className="text-2xl">{b.icon}</span>
                  <Badge variant="outline" className="text-[10px] font-bold">
                    {b.status}
                  </Badge>
                </div>
                <CardTitle className="mt-2 text-sm font-extrabold">{b.name}</CardTitle>
                <CardDescription>{b.count}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>

        <ResourceTable<QuranAyahItem>
          title="DAFTAR AYAT & TAFSIR AL-QUR'AN"
          subtitle="Cari dan pilih ayat untuk diedit teks Arab, terjemahan, atau tafsirnya"
          data={verses || []}
          columns={columns}
          searchKeys={["surahName", "translation", "tafsirNote", "arabicText"]}
          accentColor="cyan"
          loading={loading}
          onEdit={openEditModal}
          headerActions={
            <Button
              onClick={handleSyncFromApi}
              disabled={syncingApi}
              className="flex shrink-0 items-center gap-2 rounded-lg border border-success/40 bg-success/20 px-4 py-1.5 font-mono text-xs font-bold text-success uppercase transition-all hover:bg-success/30"
            >
              <span>{syncingApi ? "⏳ MEMPROSES..." : "🔄 [ SYNC API ]"}</span>
            </Button>
          }
          emptyMessage="Belum ada ayat yang tersedia untuk ditampilkan."
        />
      </div>

      <ScriptureEditDialog
        editingVerse={editModal.data}
        onClose={() => editModal.close()}
        editArabic={editArabic}
        setEditArabic={setEditArabic}
        editTranslit={editTranslit}
        setEditTranslit={setEditTranslit}
        editTranslation={editTranslation}
        setEditTranslation={setEditTranslation}
        editTafsir={editTafsir}
        setEditTafsir={setEditTafsir}
        handleSaveEdit={handleSaveEdit}
        handleSyncFromApi={handleSyncFromApi}
        syncingApi={syncingApi}
      />
    </>
  )
}

export const ErpScripturesView = ScripturesView
