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
import { useLocalStorage } from "@workspace/hooks"
import { readStoredWhispers, writeStoredWhispers } from "../lib/whisper-storage"
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
import { Button, Input } from "@workspace/ui"

import {
  type WhisperTier,
  type WhisperExpiry,
  type Whisper,
  MercyButton,
  sendMercyWhisper,
  generateWhisperId as generateId,
  formatTimeLeft,
  formatDate,
} from "./whisper-mercy"

export {
  MercyButton,
  sendMercyWhisper,
  type Whisper,
  type WhisperTier,
  type WhisperExpiry,
}


// ─────────────────────────────────────────────────────────────────────────────
// EXPIRY CONFIG — based on sifat ALLAH menciptakan masa
// ─────────────────────────────────────────────────────────────────────────────

const EXPIRY_OPTIONS: {
  days: WhisperExpiry
  label: string
  desc: string
  ref: string
}[] = [
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

const TIER_CONFIG: Record<
  WhisperTier,
  {
    label: string
    icon: React.ReactNode
    color: string
    border: string
    bg: string
    align: string
  }
> = {
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
    color: "text-foreground",
    border: "border-border",
    bg: "bg-muted/30",
    align: "items-end",
  },
  HUMAN: {
    label: "HUMAN",
    icon: <User className="h-3 w-3" />,
    color: "text-primary",
    border: "border-primary/30",
    bg: "bg-primary/5",
    align: "items-start",
  },
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
    <div
      className={`flex flex-col gap-1 ${isShadow ? "items-end" : "items-start"}`}
    >
      {/* Tier label */}
      <div
        className={`flex items-center gap-1 ${isShadow ? "flex-row-reverse" : "flex-row"}`}
      >
        <span
          className={`${cfg.color} flex items-center gap-1 font-mono text-[8px] font-bold tracking-widest uppercase`}
        >
          {cfg.icon} {cfg.label}
        </span>
        <span className="font-mono text-[8px] text-foreground/20">
          {formatDate(whisper.createdAt)}
        </span>
      </div>

      {/* Bubble */}
      <div
        className={`rounded-xl relative max-w-[85%] border px-3 py-2 ${cfg.border} ${cfg.bg} `}
      >
        <p className={`font-mono text-xs ${cfg.color} leading-relaxed`}>
          {whisper.content}
        </p>

        {/* Expiry + delete row */}
        <div className={`mt-2 flex items-center justify-between gap-2`}>
          <span
            className={`flex items-center gap-1 font-mono text-[8px] ${
              timeLeft.urgent ? "text-warning/70" : "text-foreground/20"
            }`}
          >
            <Clock className="h-2.5 w-2.5" />
            {timeLeft.text}
          </span>
          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            onClick={() => onDelete(whisper.id)}
            className="text-foreground/15 transition-colors hover:text-destructive/60"
            title="Hapus whisper"
          >
            <Trash2 className="h-3 w-3" />
          </Button>
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
  const [storedWhispers, setStoredWhispers] = useLocalStorage<Whisper[]>(
    `mw_whisper_${requestId}`,
    []
  )
  const [inputValue, setInputValue] = useState("")
  const [selectedTier, setSelectedTier] = useState<WhisperTier>("SHADOW")
  const [selectedExpiry, setSelectedExpiry] = useState<WhisperExpiry>(7)
  const [showExpiryPicker, setShowExpiryPicker] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  const now = Date.now()
  const whispers = storedWhispers.filter((w) => w.expiresAt > now)

  // Scroll to bottom on new message
  useEffect(() => {
    if (isOpen) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" })
    }
  }, [whispers.length, isOpen])

  const handleSend = () => {
    if (!inputValue.trim()) return

    const sendTime = Date.now()
    const newWhisper: Whisper = {
      id: generateId(),
      requestId,
      tier: selectedTier,
      content: inputValue.trim(),
      createdAt: sendTime,
      expiresAt: sendTime + selectedExpiry * 86_400_000,
      isRead: false,
    }

    const active = storedWhispers.filter((w) => w.expiresAt > sendTime)
    setStoredWhispers([...active, newWhisper])
    setInputValue("")
  }

  const handleDelete = (id: string) => {
    setStoredWhispers(storedWhispers.filter((w) => w.id !== id))
  }

  const activeCount = whispers.length
  const selectedExpiryConfig = EXPIRY_OPTIONS.find(
    (e) => e.days === selectedExpiry
  )!

  return (
    <div className="mt-4 border-t border-border/30 pt-3">
      {/* Toggle button */}
      <Button
        type="button"
        variant="ghost"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex w-full items-center justify-between gap-2 rounded-none px-2 py-2 font-mono text-[10px] tracking-widest uppercase transition-all ${
          isOpen ? "text-warning" : "text-muted-foreground hover:text-foreground"
        } `}
      >
        <span className="flex items-center gap-2">
          <MessageCircle className="h-3.5 w-3.5" />
          WHISPER CHANNEL
          {activeCount > 0 && (
            <span className="rounded-md border border-yellow-400/30 px-1.5 py-0.5 text-[8px] text-warning">
              {activeCount}
            </span>
          )}
        </span>
        <span className="font-mono text-[8px] text-muted-foreground">
          {isOpen ? (
            <ChevronUp className="h-3 w-3" />
          ) : (
            <ChevronDown className="h-3 w-3" />
          )}
        </span>
      </Button>

      {isOpen && (
        <div className="mt-2 flex flex-col gap-3">
          {/* Theology note */}
          <div className="flex items-start gap-2 rounded-none border border-yellow-400/20 bg-yellow-400/5 px-3 py-2">
            <Infinity className="mt-0.5 h-3 w-3 shrink-0 text-warning/60" />
            <p className="font-mono text-[9px] text-warning/80 italic">
              Whisper ini bersifat fana — ia akan berakhir pada masanya.
              &quot;Kullu man &apos;alayha fan.&quot; QS 55:26
            </p>
          </div>

          {/* Chat area */}
          <div className="flex max-h-64 flex-col gap-2 overflow-y-auto rounded-none border border-border/40 bg-card/60 p-3">
            {whispers.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-6 text-center">
                <MessageCircle className="mb-2 h-6 w-6 text-muted-foreground/30" />
                <p className="font-mono text-[9px] text-muted-foreground">
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
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowExpiryPicker(!showExpiryPicker)}
              className="flex w-full items-center justify-between border border-border/40 bg-card/60 px-3 py-2 font-mono text-[9px] text-muted-foreground hover:border-border/70"
            >
              <span className="flex items-center gap-2">
                <Clock className="h-3 w-3" />
                Masa berlaku: {selectedExpiryConfig.label} —{" "}
                {selectedExpiryConfig.desc}
              </span>
              <ChevronDown className="h-3 w-3" />
            </Button>

            {showExpiryPicker && (
              <div className="absolute top-full right-0 left-0 z-10 border border-border/40 bg-card/95 shadow-md backdrop-blur-md">
                {EXPIRY_OPTIONS.map((opt) => (
                  <Button
                    type="button"
                    variant="ghost"
                    key={opt.days}
                    onClick={() => {
                      setSelectedExpiry(opt.days)
                      setShowExpiryPicker(false)
                    }}
                    className="flex w-full flex-col px-3 py-2 text-left hover:bg-muted/50"
                  >
                    <span className="font-mono text-[10px] font-bold text-foreground">
                      {opt.label} — {opt.desc}
                    </span>
                    <span className="font-mono text-[8px] text-warning/80">
                      {opt.ref}
                    </span>
                  </Button>
                ))}
              </div>
            )}
          </div>

          {/* Tier selector */}
          <div className="flex gap-2">
            {(["DIVINE", "SHADOW", "HUMAN"] as WhisperTier[]).map((tier) => {
              const cfg = TIER_CONFIG[tier]
              return (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  key={tier}
                  onClick={() => setSelectedTier(tier)}
                  className={`rounded-lg flex flex-1 items-center justify-center gap-1 border px-2 py-1.5 font-mono text-[8px] font-bold tracking-widest uppercase transition-all ${
                    selectedTier === tier
                      ? `${cfg.border} ${cfg.color} ${cfg.bg}`
                      : "border-border/40 text-muted-foreground hover:border-border/70"
                  } `}
                >
                  {cfg.icon} {tier}
                </Button>
              )
            })}
          </div>

          {/* Input */}
          <div className="flex gap-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  handleSend()
                }
              }}
              placeholder={`Whisper dari ${selectedTier}...`}
              className="flex-1 border border-border/40 bg-card/60 px-3 py-2 font-mono text-xs text-foreground placeholder:text-muted-foreground focus:border-yellow-400/50 focus:outline-none"
            />
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={handleSend}
              disabled={!inputValue.trim()}
              className="rounded-lg border border-yellow-400/30 bg-yellow-400/10 px-3 py-2 text-warning transition-all hover:bg-yellow-400/20 hover:shadow-sm disabled:cursor-not-allowed disabled:opacity-30"
            >
              <Send className="h-3.5 w-3.5" />
            </Button>
          </div>

          {/* Warning */}
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-3 w-3 shrink-0 text-foreground/15" />
            <p className="font-mono text-[8px] text-foreground/15">
              Whisper disimpan secara lokal. Tidak ada server. Akan hilang
              otomatis sesuai masa yang dipilih.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
