"use client"

/**
 * WHISPER SYSTEM — Ephemeral Communication
 *
 * Komunikasi sementara antara:
 *   DIVINE → SHADOW → HUMAN
 *
 * Sifat: fana, terikat masa, mengacu pada sifat ALLAH dalam menciptakan waktu.
 */

import { useEffect, useRef, useState } from "react"
import { useLocalStorage } from "@workspace/hooks"
import {
  type WhisperTier,
  type WhisperExpiry,
  type Whisper,
  MercyButton,
  sendMercyWhisper,
  generateWhisperId as generateId,
} from "./whisper-mercy"
import { WhisperComposer } from "./whisper/whisper-composer"
import { WhisperExpiryPicker } from "./whisper/whisper-expiry-picker"
import { WhisperMessages } from "./whisper/whisper-messages"
import { WhisperTheologyNote } from "./whisper/whisper-theology-note"
import { WhisperTierSelector } from "./whisper/whisper-tier-selector"
import { WhisperToggle } from "./whisper/whisper-toggle"
import { WhisperWarning } from "./whisper/whisper-warning"

export {
  MercyButton,
  sendMercyWhisper,
  type Whisper,
  type WhisperTier,
  type WhisperExpiry,
}

interface WhisperPanelProps {
  requestId: string
  requestTitle: string
}

export function WhisperPanel({ requestId, requestTitle: _requestTitle }: WhisperPanelProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [storedWhispers, setStoredWhispers] = useLocalStorage<Whisper[]>(`mw_whisper_${requestId}`, [])
  const [inputValue, setInputValue] = useState("")
  const [selectedTier, setSelectedTier] = useState<WhisperTier>("SHADOW")
  const [selectedExpiry, setSelectedExpiry] = useState<WhisperExpiry>(7)
  const [showExpiryPicker, setShowExpiryPicker] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  const now = Date.now()
  const whispers = storedWhispers.filter((whisper) => whisper.expiresAt > now)

  useEffect(() => {
    if (isOpen) bottomRef.current?.scrollIntoView({ behavior: "smooth" })
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

    const active = storedWhispers.filter((whisper) => whisper.expiresAt > sendTime)
    setStoredWhispers([...active, newWhisper])
    setInputValue("")
  }

  const handleDelete = (id: string) => {
    setStoredWhispers(storedWhispers.filter((whisper) => whisper.id !== id))
  }

  return (
    <div className="mt-4 border-t border-border/30 pt-3">
      <WhisperToggle isOpen={isOpen} activeCount={whispers.length} onToggle={() => setIsOpen(!isOpen)} />

      {isOpen && (
        <div className="mt-2 flex flex-col gap-3">
          <WhisperTheologyNote />
          <WhisperMessages bottomRef={bottomRef} onDelete={handleDelete} whispers={whispers} />
          <WhisperExpiryPicker
            selectedExpiry={selectedExpiry}
            showPicker={showExpiryPicker}
            onSelect={(expiry) => {
              setSelectedExpiry(expiry)
              setShowExpiryPicker(false)
            }}
            onToggle={() => setShowExpiryPicker(!showExpiryPicker)}
          />
          <WhisperTierSelector selectedTier={selectedTier} onSelect={setSelectedTier} />
          <WhisperComposer inputValue={inputValue} selectedTier={selectedTier} onChange={setInputValue} onSend={handleSend} />
          <WhisperWarning />
        </div>
      )}
    </div>
  )
}
