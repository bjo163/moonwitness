"use client"
import { useMounted } from "@workspace/hooks"

import { useState, useEffect } from "react"
import { Keyboard } from "lucide-react"
import { Modal, ModalTrigger } from "../../components/modal"

type ShortcutItem = {
  keyCombo: string
  action: string
  category: string
}

const SHORTCUTS_LIST: ShortcutItem[] = [
  {
    keyCombo: "CTRL + K",
    action: "Buka Mesin Pencari Universal & Voice Search",
    category: "SEARCH",
  },
  {
    keyCombo: "ESC",
    action: "Tutup Seluruh Modal / Kembali Ke Port",
    category: "NAVIGATION",
  },
  {
    keyCombo: "SPACEBAR",
    action: "Play / Pause Murottal Audio Recitation",
    category: "AUDIO",
  },
  {
    keyCombo: "ALT + B",
    action: "Buka Vault Bookmark Ayat & Hadits Favorit",
    category: "VAULT",
  },
  {
    keyCombo: "ALT + Q",
    action: "Buka Selector Pemilih Qari Tilawah",
    category: "AUDIO",
  },
  {
    keyCombo: "ALT + T",
    action: "Buka Legend Panduan Tajwid Warna Neon",
    category: "READING",
  },
  {
    keyCombo: "?",
    action: "Tampilkan Modal Panduan Shortcuts HUD Ini",
    category: "SYSTEM",
  },
]

export function KeyboardShortcutsModal() {
  const mounted = useMounted()
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "?" && !isOpen) {
        e.preventDefault()
        setIsOpen(true)
      } else if (e.key === "Escape" && isOpen) {
        setIsOpen(false)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isOpen])

  return (
    <>
      <ModalTrigger
        icon={Keyboard}
        label="[ KEYBOARD HUD ]"
        onClick={() => setIsOpen(true)}
        title="Buka Panduan Keyboard Shortcuts HUD (Tekan ?)"
        color="cyan"
      />

      <Modal
        isOpen={isOpen && mounted}
        onClose={() => setIsOpen(false)}
        title="// KEYBOARD SHORTCUTS COMMAND OVERLAY"
        icon={Keyboard}
        maxWidth="max-w-lg"
        borderColor="border-primary/60"
        glowColor="rgba(0,240,255,0.3)"
      >
        <div className="space-y-3 p-6 text-xs">
          <div className="bg-background rounded-md border border-primary/30 p-2.5 text-[10px] text-muted">
            // SYSTEM HOTKEYS: PINDAH & KONTROL SISTEM SECARA CEPAT
          </div>

          <div className="space-y-2">
            {SHORTCUTS_LIST.map((sc, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-border/40 bg-card bg-background rounded-md flex items-center justify-between gap-2 border border-primary/20 p-3"
              >
                <div>
                  <span className="block text-[8px] font-bold text-muted">
                    {/* {sc.category} */}
                  </span>
                  <span className="text-xs font-bold text-foreground">
                    {sc.action}
                  </span>
                </div>

                <kbd className="bg-panel shrink-0 rounded border border-primary/40 px-2.5 py-1 text-xs font-black text-primary">
                  {sc.keyCombo}
                </kbd>
              </div>
            ))}
          </div>
        </div>
      </Modal>
    </>
  )
}
