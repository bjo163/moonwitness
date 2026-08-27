"use client"

import { useState, useEffect } from "react"
import { Mic, Check, Volume2 } from "lucide-react"
import { Modal } from "@workspace/ui"
import { ModalTrigger } from "@workspace/ui"

export type QariOption = {
  id: string
  name: string
  arabicName: string
  subtext: string
  cdnPath: string
}

export const QARI_LIST: QariOption[] = [
  {
    id: "alafasy",
    name: "Shaykh Mishary Rashid Alafasy",
    arabicName: "مشاري بن راشد العفاسي",
    subtext: "Kuwait • Clear Crisp Murattal",
    cdnPath: "ar.alafasy",
  },
  {
    id: "abdulbasit",
    name: "Shaykh Abdul Basit Abdul Samad",
    arabicName: "عبد الباسط عبد الصمد",
    subtext: "Egypt • Legendary Emotional Recitation",
    cdnPath: "ar.abdulbasitmurattal",
  },
  {
    id: "saadghamdi",
    name: "Shaykh Saad Al-Ghamdi",
    arabicName: "سعد الغامدي",
    subtext: "Saudi Arabia • Melodic Warm Recitation",
    cdnPath: "ar.saadghamdi",
  },
  {
    id: "husary",
    name: "Shaykh Mahmoud Khalil Al-Husary",
    arabicName: "محمود خليل الحصري",
    subtext: "Egypt • Canonical Tajweed Precision",
    cdnPath: "ar.husary",
  },
]

export function QariSelectorModal() {
  const [mounted, setMounted] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [selectedQariId, setSelectedQariId] = useState("alafasy")

  useEffect(() => {
    setTimeout(() => setMounted(true), 0)
    const saved = localStorage.getItem("mw_active_qari")
    if (saved) {
      setSelectedQariId(saved)
    }
  }, [])

  function selectQari(qariId: string) {
    setSelectedQariId(qariId)
    localStorage.setItem("mw_active_qari", qariId)
    window.dispatchEvent(new CustomEvent("mw_qari_changed", { detail: qariId }))
    setIsOpen(false)
  }

  const activeQariObj =
    QARI_LIST.find((q) => q.id === selectedQariId) || QARI_LIST[0]!

  return (
    <>
      <ModalTrigger
        icon={Mic}
        label={`[ QARI: ${activeQariObj.name.split(" ")[1]?.toUpperCase() || "ALAFASY"} ]`}
        onClick={() => setIsOpen(true)}
        title="Ganti Qari Tilawah Al-Qur'an"
        color="green"
      />

      <Modal
        isOpen={isOpen && mounted}
        onClose={() => setIsOpen(false)}
        title="// PILIH RECITATOR / QARI TILAWAH"
        icon={Volume2}
        maxWidth="max-w-lg"
        borderColor="border-success/50"
        glowColor="rgba(0,255,102,0.25)"
      >
        <div className="space-y-3 p-6">
          {QARI_LIST.map((qari) => {
            const isSelected = qari.id === selectedQariId
            return (
              <button
                key={qari.id}
                onClick={() => selectQari(qari.id)}
                className={`tag-clip flex w-full items-center justify-between border p-3.5 text-left transition-all ${
                  isSelected
                    ? "bg-success/15 border-success text-white shadow-[0_0_15px_rgba(0,255,102,0.2)]"
                    : "bg-space hover:border-success/50 border-primary/20 text-muted hover:text-foreground"
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-foreground">
                      {qari.name}
                    </span>
                    <span className="text-success arabic-text text-[10px]">
                      {qari.arabicName}
                    </span>
                  </div>
                  <p className="font-mono text-[9px] text-muted">
                    {qari.subtext}
                  </p>
                </div>

                {isSelected && (
                  <div className="tag-clip bg-success/20 border-success text-success flex items-center gap-1 border px-2 py-1 text-[9px] font-bold">
                    <Check className="h-3 w-3" />
                    <span>ACTIVE</span>
                  </div>
                )}
              </button>
            )
          })}
        </div>
      </Modal>
    </>
  )
}
