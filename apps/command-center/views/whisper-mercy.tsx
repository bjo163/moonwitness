"use client"

import React, { useState, useCallback } from "react"
import { Heart, Sparkles } from "lucide-react"
import { readStoredWhispers, writeStoredWhispers } from "../lib/whisper-storage"

export type WhisperTier = "DIVINE" | "SHADOW" | "HUMAN"
export type WhisperExpiry = 3 | 7 | 40 // days

export interface Whisper {
  id: string
  requestId: string
  tier: WhisperTier
  content: string
  createdAt: number
  expiresAt: number
  isRead: boolean
}

export function generateWhisperId(): string {
  return `wsp_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
}

export const MERCY_POOL: {
  arabic: string
  latin: string
  meaning: string
  ref: string
}[] = [
  {
    arabic: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
    latin: "Bismillahir Rahmanir Rahim",
    meaning: "Dengan nama ALLAH Yang Maha Pengasih lagi Maha Penyayang",
    ref: "QS 1:1",
  },
  {
    arabic: "وَرَحْمَتِي وَسِعَتْ كُلَّ شَيْءٍ",
    latin: "Wa rahmatī wasi'at kulla syai'",
    meaning: "Dan rahmat-Ku meliputi segala sesuatu",
    ref: "QS 7:156",
  },
  {
    arabic: "إِنَّ اللَّهَ غَفُورٌ رَحِيمٌ",
    latin: "Innallaha Ghafururrahim",
    meaning: "Sesungguhnya ALLAH Maha Pengampun lagi Maha Penyayang",
    ref: "QS 2:173",
  },
  {
    arabic: "يَا رَحْمَٰنُ يَا رَحِيمُ",
    latin: "Ya Rahman, Ya Rahim",
    meaning: "Wahai Yang Maha Pengasih, Wahai Yang Maha Penyayang",
    ref: "Asmaul Husna #1 & #2",
  },
  {
    arabic: "وَهُوَ الْغَفُورُ الْوَدُودُ",
    latin: "Wa Huwal Ghafurul Wadud",
    meaning: "Dan Dialah Yang Maha Pengampun lagi Maha Mencintai",
    ref: "QS 85:14",
  },
  {
    arabic: "رَبَّنَا وَسِعْتَ كُلَّ شَيْءٍ رَحْمَةً وَعِلْمًا",
    latin: "Rabbana wasi'ta kulla syai'ir rahmataw wa 'ilma",
    meaning: "Ya Tuhan kami, rahmat dan ilmu-Mu meliputi segala sesuatu",
    ref: "QS 40:7",
  },
  {
    arabic: "الرَّحْمَٰنُ عَلَى الْعَرْشِ اسْتَوَىٰ",
    latin: "Ar-Rahmanu 'alal 'arsyis tawa",
    meaning: "Yang Maha Pengasih bersemayam di atas Arasy",
    ref: "QS 20:5",
  },
  {
    arabic: "وَاللَّهُ يُحِبُّ الْمُحْسِنِينَ",
    latin: "Wallahu yuhibbul muhsinin",
    meaning: "Dan ALLAH mencintai orang-orang yang berbuat kebaikan",
    ref: "QS 3:134",
  },
  {
    arabic: "إِنَّ مَعَ الْعُسْرِ يُسْرًا",
    latin: "Inna ma'al 'usri yusra",
    meaning: "Sesungguhnya bersama kesulitan ada kemudahan",
    ref: "QS 94:6",
  },
  {
    arabic: "وَهُوَ أَرْحَمُ الرَّاحِمِينَ",
    latin: "Wa Huwa Arhamur Rahimin",
    meaning: "Dan Dialah Yang Paling Penyayang di antara para penyayang",
    ref: "QS 12:64",
  },
  {
    arabic: "يَا لَطِيفُ يَا خَبِيرُ",
    latin: "Ya Latifu, Ya Khabir",
    meaning: "Wahai Yang Maha Lembut, Wahai Yang Maha Mengetahui",
    ref: "Asmaul Husna #30 & #31",
  },
  {
    arabic: "رَبِّ اغْفِرْ وَارْحَمْ وَأَنتَ خَيْرُ الرَّاحِمِينَ",
    latin: "Rabbighfir warham wa Anta khairur rahimin",
    meaning: "Ya Tuhanku, ampunilah dan berilah rahmat, Engkaulah sebaik-baik pemberi rahmat",
    ref: "QS 23:118",
  },
]

export function getMercyMessage(requestId: string, count: number): string {
  const idx = (requestId.charCodeAt(requestId.length - 1) + count) % MERCY_POOL.length
  const m = MERCY_POOL[idx]!
  return `${m.arabic}\n\n"${m.meaning}"\n\n— ${m.latin} · ${m.ref}`
}

export function sendMercyWhisper(requestId: string): void {
  if (typeof window === "undefined") return
  const existing = readStoredWhispers(requestId)
  const content = getMercyMessage(requestId, existing.length)
  const now = Date.now()
  const newWhisper: Whisper = {
    id: generateWhisperId(),
    requestId,
    tier: "DIVINE",
    content,
    createdAt: now,
    expiresAt: now + 7 * 86_400_000,
    isRead: false,
  }
  const updated = [...existing, newWhisper]
  writeStoredWhispers(requestId, updated)
}

interface MercyButtonProps {
  requestId: string
  onMercySent?: () => void
}

export function MercyButton({ requestId, onMercySent }: MercyButtonProps) {
  const [glowing, setGlowing] = useState(false)
  const [sent, setSent] = useState(false)

  const handleMercy = useCallback(() => {
    sendMercyWhisper(requestId)
    setGlowing(true)
    setSent(true)
    onMercySent?.()
    setTimeout(() => setGlowing(false), 1200)
    setTimeout(() => setSent(false), 2500)
  }, [requestId, onMercySent])

  return (
    <button
      onClick={handleMercy}
      title="Kirim MERCY — DIVINE whisper rahmat"
      className={`group rounded-lg flex items-center gap-1.5 border px-3 py-1.5 font-mono text-[9px] font-bold tracking-widest uppercase transition-all duration-300 ${
        glowing
          ? "border-yellow-300/80 bg-yellow-400/20 text-yellow-200 shadow-sm"
          : sent
            ? "border-yellow-400/50 bg-yellow-400/10 text-yellow-300"
            : "border-yellow-400/20 bg-transparent text-warning/50 hover:border-yellow-400/50 hover:bg-yellow-400/10 hover:text-yellow-300 hover:shadow-sm"
      } `}
    >
      <Heart
        className={`h-3 w-3 transition-all duration-300 ${
          glowing ? "scale-125 fill-yellow-300" : "group-hover:scale-110"
        }`}
      />
      {sent ? (
        <span className="flex items-center gap-1">
          <Sparkles className="h-3 w-3" />
          RAHMAT TERKIRIM
        </span>
      ) : (
        "MERCY"
      )}
    </button>
  )
}

export function formatTimeLeft(expiresAt: number): { text: string; urgent: boolean } {
  const diff = expiresAt - Date.now()
  if (diff <= 0) return { text: "EXPIRED", urgent: true }

  const days = Math.floor(diff / 86_400_000)
  const hours = Math.floor((diff % 86_400_000) / 3_600_000)
  const mins = Math.floor((diff % 3_600_000) / 60_000)

  if (days > 1) return { text: `${days}d ${hours}h tersisa`, urgent: false }
  if (days === 1) return { text: `1d ${hours}h tersisa`, urgent: true }
  if (hours > 0) return { text: `${hours}h ${mins}m tersisa`, urgent: true }
  return { text: `${mins}m tersisa`, urgent: true }
}

export function formatDate(ms: number): string {
  return new Date(ms).toLocaleString("id-ID", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  })
}
