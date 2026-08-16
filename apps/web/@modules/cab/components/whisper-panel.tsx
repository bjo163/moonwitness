"use client"

/**
 * WHISPER SYSTEM — Ephemeral Communication
 *
 * Komunikasi sementara antara:
 *   DIVINE → SHADOW → HUMAN
 *
 * Sifat: fana, terikat masa, mengacu pada sifat ALLAH dalam menciptakan waktu.
 *
 * "Kullu man 'alayha fan" — semua yang ada di bumi fana. (QS 55:26)
 * "Wa kana amrullahi maqdura" — urusan ALLAH itu sudah ditentukan kadarnya. (QS 33:38)
 *
 * Whisper expire berdasarkan pilihan:
 *   3 hari   → "Tiga hari seperti persinggahan musafir"
 *   7 hari   → "Siklus mingguan ciptaan ALLAH"
 *   40 hari  → "Masa perenungan dan perubahan"
 */

import React, { useState, useEffect, useRef, useCallback } from "react"
import {
  MessageCircle,
  Send,
  Clock,
  Trash2,
  Infinity,
  User,
  Star,
  Heart,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Sparkles,
} from "lucide-react"

// ─────────────────────────────────────────────────────────────────────────────
// MERCY WHISPER POOL — Asmaul Husna + Rahmat Ayat
// DIVINE auto-whisper ketika tombol MERCY ditekan
// ─────────────────────────────────────────────────────────────────────────────

const MERCY_POOL: { arabic: string; latin: string; meaning: string; ref: string }[] = [
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

/**
 * Ambil satu mercy whisper secara rotasi (bukan acak —
 * berurutan agar setiap mercy tersampaikan bergantian).
 */
function getMercyMessage(requestId: string, count: number) {
  const idx = (requestId.charCodeAt(requestId.length - 1) + count) % MERCY_POOL.length
  const m = MERCY_POOL[idx]!
  return `${m.arabic}\n\n"${m.meaning}"\n\n— ${m.latin} · ${m.ref}`
}

/**
 * Kirim MERCY whisper ke localStorage channel request tertentu.
 * Bisa dipanggil dari luar WhisperPanel (e.g., dari card header).
 */
export function sendMercyWhisper(requestId: string): void {
  if (typeof window === "undefined") return
  const existing = loadWhispers(requestId)
  const content = getMercyMessage(requestId, existing.length)
  const now = Date.now()
  const newWhisper: Whisper = {
    id: generateId(),
    requestId,
    tier: "DIVINE",
    content,
    createdAt: now,
    expiresAt: now + 7 * 86_400_000, // Default 7 hari
    isRead: false,
  }
  const updated = [...existing, newWhisper]
  saveWhispers(requestId, updated)
}

// ─────────────────────────────────────────────────────────────────────────────
// MERCY BUTTON — Standalone, bisa dipakai di luar WhisperPanel
// ─────────────────────────────────────────────────────────────────────────────

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
      className={`
        group flex items-center gap-1.5 hud-clip-btn border px-3 py-1.5
        font-mono text-[9px] font-bold tracking-widest uppercase
        transition-all duration-300
        ${
          glowing
            ? "border-yellow-300/80 bg-yellow-400/20 text-yellow-200 shadow-[0_0_20px_rgba(255,230,0,0.4)]"
            : sent
            ? "border-yellow-400/50 bg-yellow-400/10 text-yellow-300"
            : "border-yellow-400/20 bg-transparent text-yellow-400/50 hover:border-yellow-400/50 hover:bg-yellow-400/10 hover:text-yellow-300 hover:shadow-[0_0_12px_rgba(255,230,0,0.2)]"
        }
      `}
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


// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────

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

// ─────────────────────────────────────────────────────────────────────────────
// EXPIRY CONFIG — based on sifat ALLAH menciptakan masa
// ─────────────────────────────────────────────────────────────────────────────

const EXPIRY_OPTIONS: { days: WhisperExpiry; label: string; desc: string; ref: string }[] = [
  {
    days: 3,
    label: "3 HARI",
    desc: "Persinggahan musafir",
    ref: "QS 2:28 — kehidupan adalah persinggahan",
  },
  {
    days: 7,
    label: "7 HARI",
    desc: "Siklus mingguan ciptaan ALLAH",
    ref: "QS 41:9-12 — ALLAH menciptakan dalam enam masa",
  },
  {
    days: 40,
    label: "40 HARI",
    desc: "Masa perenungan dan perubahan",
    ref: "QS 7:142 — Nabi Musa di gunung 40 malam",
  },
]

const TIER_CONFIG: Record<WhisperTier, {
  label: string
  icon: React.ReactNode
  color: string
  border: string
  bg: string
  align: string
}> = {
  DIVINE: {
    label: "DIVINE",
    icon: <Infinity className="h-3 w-3" />,
    color: "text-yellow-300",
    border: "border-yellow-400/40",
    bg: "bg-yellow-400/8",
    align: "items-start",
  },
  SHADOW: {
    label: "SHADOW",
    icon: <Star className="h-3 w-3" />,
    color: "text-white",
    border: "border-white/20",
    bg: "bg-white/5",
    align: "items-end",
  },
  HUMAN: {
    label: "HUMAN",
    icon: <User className="h-3 w-3" />,
    color: "text-cyber-cyan",
    border: "border-cyber-cyan/30",
    bg: "bg-cyber-cyan/5",
    align: "items-start",
  },
}

// ─────────────────────────────────────────────────────────────────────────────
// STORAGE — localStorage (pure, no server needed)
// Decentralized: setiap device menyimpan whisper-nya sendiri
// ─────────────────────────────────────────────────────────────────────────────

function storageKey(requestId: string) {
  return `mw_whisper_${requestId}`
}

function loadWhispers(requestId: string): Whisper[] {
  if (typeof window === "undefined") return []
  try {
    const raw = localStorage.getItem(storageKey(requestId))
    if (!raw) return []
    const all: Whisper[] = JSON.parse(raw)
    const now = Date.now()
    // Auto-expire: buang yang sudah habis masanya
    return all.filter((w) => w.expiresAt > now)
  } catch {
    return []
  }
}

function saveWhispers(requestId: string, whispers: Whisper[]) {
  if (typeof window === "undefined") return
  const now = Date.now()
  // Hanya simpan yang belum expired
  const active = whispers.filter((w) => w.expiresAt > now)
  localStorage.setItem(storageKey(requestId), JSON.stringify(active))
}

function generateId() {
  return `wsp_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
}

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function formatTimeLeft(expiresAt: number): { text: string; urgent: boolean } {
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

function formatDate(ms: number) {
  return new Date(ms).toLocaleString("id-ID", {
    day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit",
  })
}

// ─────────────────────────────────────────────────────────────────────────────
// WHISPER BUBBLE
// ─────────────────────────────────────────────────────────────────────────────

function WhisperBubble({
  whisper,
  onDelete,
}: {
  whisper: Whisper
  onDelete: (id: string) => void
}) {
  const cfg = TIER_CONFIG[whisper.tier]
  const timeLeft = formatTimeLeft(whisper.expiresAt)
  const isShadow = whisper.tier === "SHADOW"

  return (
    <div className={`flex flex-col gap-1 ${isShadow ? "items-end" : "items-start"}`}>
      {/* Tier label */}
      <div className={`flex items-center gap-1 ${isShadow ? "flex-row-reverse" : "flex-row"}`}>
        <span className={`${cfg.color} flex items-center gap-1 font-mono text-[8px] font-bold tracking-widest uppercase`}>
          {cfg.icon} {cfg.label}
        </span>
        <span className="font-mono text-[8px] text-white/20">
          {formatDate(whisper.createdAt)}
        </span>
      </div>

      {/* Bubble */}
      <div
        className={`
          relative max-w-[85%] hud-clip-card border px-3 py-2
          ${cfg.border} ${cfg.bg}
        `}
      >
        <p className={`font-mono text-xs ${cfg.color} leading-relaxed`}>
          {whisper.content}
        </p>

        {/* Expiry + delete row */}
        <div className={`mt-2 flex items-center justify-between gap-2`}>
          <span
            className={`flex items-center gap-1 font-mono text-[8px] ${
              timeLeft.urgent ? "text-yellow-400/70" : "text-white/20"
            }`}
          >
            <Clock className="h-2.5 w-2.5" />
            {timeLeft.text}
          </span>
          <button
            onClick={() => onDelete(whisper.id)}
            className="text-white/15 transition-colors hover:text-red-400/60"
            title="Hapus whisper"
          >
            <Trash2 className="h-3 w-3" />
          </button>
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// WHISPER PANEL — Main Component
// ─────────────────────────────────────────────────────────────────────────────

interface WhisperPanelProps {
  requestId: string
  requestTitle: string
}

export function WhisperPanel({ requestId, requestTitle }: WhisperPanelProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [whispers, setWhispers] = useState<Whisper[]>([])
  const [inputValue, setInputValue] = useState("")
  const [selectedTier, setSelectedTier] = useState<WhisperTier>("SHADOW")
  const [selectedExpiry, setSelectedExpiry] = useState<WhisperExpiry>(7)
  const [showExpiryPicker, setShowExpiryPicker] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  // Load on mount & when opened
  useEffect(() => {
    if (isOpen) {
      setWhispers(loadWhispers(requestId))
    }
  }, [isOpen, requestId])

  // Scroll to bottom on new message
  useEffect(() => {
    if (isOpen) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" })
    }
  }, [whispers, isOpen])

  // Tick every minute to refresh expiry display
  useEffect(() => {
    if (!isOpen) return
    const id = setInterval(() => {
      setWhispers(loadWhispers(requestId))
    }, 60_000)
    return () => clearInterval(id)
  }, [isOpen, requestId])

  const handleSend = () => {
    if (!inputValue.trim()) return

    const now = Date.now()
    const newWhisper: Whisper = {
      id: generateId(),
      requestId,
      tier: selectedTier,
      content: inputValue.trim(),
      createdAt: now,
      expiresAt: now + selectedExpiry * 86_400_000,
      isRead: false,
    }

    const updated = [...whispers, newWhisper]
    setWhispers(updated)
    saveWhispers(requestId, updated)
    setInputValue("")
  }

  const handleDelete = (id: string) => {
    const updated = whispers.filter((w) => w.id !== id)
    setWhispers(updated)
    saveWhispers(requestId, updated)
  }

  const activeCount = whispers.filter((w) => w.expiresAt > Date.now()).length
  const selectedExpiryConfig = EXPIRY_OPTIONS.find((e) => e.days === selectedExpiry)!

  return (
    <div className="mt-4 border-t border-white/5 pt-3">
      {/* Toggle button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          flex w-full items-center justify-between gap-2 rounded-none px-2 py-2
          font-mono text-[10px] tracking-widest uppercase transition-all
          ${isOpen
            ? "text-yellow-400/80"
            : "text-white/25 hover:text-white/50"
          }
        `}
      >
        <span className="flex items-center gap-2">
          <MessageCircle className="h-3.5 w-3.5" />
          WHISPER CHANNEL
          {activeCount > 0 && (
            <span className="hud-clip-tag border border-yellow-400/30 px-1.5 py-0.5 text-[8px] text-yellow-400">
              {activeCount}
            </span>
          )}
        </span>
        <span className="font-mono text-[8px] text-white/20">
          {isOpen ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
        </span>
      </button>

      {isOpen && (
        <div className="mt-2 flex flex-col gap-3">
          {/* Theology note */}
          <div className="flex items-start gap-2 rounded-none border border-yellow-400/10 bg-yellow-400/4 px-3 py-2">
            <Infinity className="mt-0.5 h-3 w-3 shrink-0 text-yellow-400/40" />
            <p className="font-mono text-[9px] text-yellow-400/40 italic">
              Whisper ini bersifat fana — ia akan berakhir pada masanya. &quot;Kullu man &apos;alayha fan.&quot; QS 55:26
            </p>
          </div>

          {/* Chat area */}
          <div className="flex max-h-64 flex-col gap-2 overflow-y-auto rounded-none border border-white/5 bg-black/30 p-3">
            {whispers.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-6 text-center">
                <MessageCircle className="mb-2 h-6 w-6 text-white/10" />
                <p className="font-mono text-[9px] text-white/20">
                  Belum ada whisper. Mulai komunikasi antar layer.
                </p>
              </div>
            ) : (
              whispers.map((w) => (
                <WhisperBubble key={w.id} whisper={w} onDelete={handleDelete} />
              ))
            )}
            <div ref={bottomRef} />
          </div>

          {/* Expiry picker */}
          <div className="relative">
            <button
              onClick={() => setShowExpiryPicker(!showExpiryPicker)}
              className="flex w-full items-center justify-between border border-white/10 bg-black/30 px-3 py-2 font-mono text-[9px] text-white/40 hover:border-white/20"
            >
              <span className="flex items-center gap-2">
                <Clock className="h-3 w-3" />
                Masa berlaku: {selectedExpiryConfig.label} — {selectedExpiryConfig.desc}
              </span>
              <ChevronDown className="h-3 w-3" />
            </button>

            {showExpiryPicker && (
              <div className="absolute left-0 right-0 top-full z-10 border border-white/10 bg-black/90 backdrop-blur-md">
                {EXPIRY_OPTIONS.map((opt) => (
                  <button
                    key={opt.days}
                    onClick={() => {
                      setSelectedExpiry(opt.days)
                      setShowExpiryPicker(false)
                    }}
                    className="flex w-full flex-col px-3 py-2 text-left hover:bg-white/5"
                  >
                    <span className="font-mono text-[10px] font-bold text-white/70">{opt.label} — {opt.desc}</span>
                    <span className="font-mono text-[8px] text-yellow-400/40">{opt.ref}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Tier selector */}
          <div className="flex gap-2">
            {(["DIVINE", "SHADOW", "HUMAN"] as WhisperTier[]).map((tier) => {
              const cfg = TIER_CONFIG[tier]
              return (
                <button
                  key={tier}
                  onClick={() => setSelectedTier(tier)}
                  className={`
                    flex flex-1 items-center justify-center gap-1 hud-clip-btn border px-2 py-1.5
                    font-mono text-[8px] font-bold tracking-widest uppercase transition-all
                    ${selectedTier === tier
                      ? `${cfg.border} ${cfg.color} ${cfg.bg}`
                      : "border-white/10 text-white/25 hover:border-white/20"
                    }
                  `}
                >
                  {cfg.icon} {tier}
                </button>
              )
            })}
          </div>

          {/* Input */}
          <div className="flex gap-2">
            <input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend() } }}
              placeholder={`Whisper dari ${selectedTier}...`}
              className="
                flex-1 border border-white/10 bg-black/40 px-3 py-2
                font-mono text-xs text-white placeholder:text-white/20
                focus:border-yellow-400/30 focus:outline-none
              "
            />
            <button
              onClick={handleSend}
              disabled={!inputValue.trim()}
              className="
                hud-clip-btn border border-yellow-400/30 bg-yellow-400/8 px-3 py-2
                text-yellow-400 transition-all
                hover:bg-yellow-400/15 hover:shadow-[0_0_10px_rgba(255,230,0,0.15)]
                disabled:cursor-not-allowed disabled:opacity-30
              "
            >
              <Send className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Warning */}
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-3 w-3 shrink-0 text-white/15" />
            <p className="font-mono text-[8px] text-white/15">
              Whisper disimpan secara lokal. Tidak ada server. Akan hilang otomatis sesuai masa yang dipilih.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
