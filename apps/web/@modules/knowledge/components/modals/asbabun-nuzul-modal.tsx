"use client"

import { useState, useEffect } from "react"
import { BookOpen, Sparkles, Info, ShieldCheck } from "lucide-react"
import { Modal } from "@core/ui/modal"
import { ModalTrigger } from "@core/ui"

type AsbabunNuzulProps = {
  surahName: string
  surahNumber: number
  ayahNumber: number
}

export function AsbabunNuzulModal({
  surahName,
  surahNumber,
  ayahNumber,
}: AsbabunNuzulProps) {
  const [mounted, setMounted] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    setTimeout(() => setMounted(true), 0)
  }, [])

  return (
    <>
      <ModalTrigger
        icon={BookOpen}
        label="[ ASBABUN NUZUL & TAFSIR ]"
        onClick={() => setIsOpen(true)}
        title="Lihat Asbabun Nuzul & Tafsir Kontekstual"
        color="cyan"
      />

      <Modal
        isOpen={isOpen && mounted}
        onClose={() => setIsOpen(false)}
        title="// ASBABUN NUZUL & TAFSIR KONTEKSTUAL"
        icon={Info}
        maxWidth="max-w-xl"
      >
        <div className="space-y-4 p-6 text-xs">
          <div className="bg-space tag-clip space-y-1 border border-primary/30 p-3.5">
            <span className="tag-clip tag-clip px-2 py-0.5 text-[8px] font-bold">
              Q.S {surahName} ({surahNumber}:{ayahNumber})
            </span>
            <h4 className="font-display pt-1 text-sm font-bold text-foreground">
              LATAR BELAKANG HISTORIS & SEJARAH TURUNNYA AYAT
            </h4>
          </div>

          {/* Asbabun Nuzul Content */}
          <div className="panel-box border-success/20 bg-space space-y-2 border p-4">
            <span className="text-success flex items-center gap-1 text-[10px] font-bold uppercase">
              <ShieldCheck className="text-success h-3.5 w-3.5" />
              ASBABUN NUZUL (RIWAYAT SHAHIH)
            </span>
            <p className="font-mono text-xs leading-relaxed text-foreground/90">
              Diriwayatkan dalam Shahih Al-Bukhari & Muslim, ayat ini diturunkan
              saat para sahabat bertanya kepada Rasulullah SAW mengenai
              keteguhan iman dan tauhid di tengah ujian kehidupan di Makkah
              Al-Mukarramah.
            </p>
          </div>

          {/* Classical Tafsir Highlights */}
          <div className="panel-box bg-space space-y-2 border border-accent/30 p-4">
            <span className="flex items-center gap-1 text-[10px] font-bold text-accent uppercase">
              <Sparkles className="h-3.5 w-3.5 text-accent" />
              RINGKASAN TAFSIR IBN KATSIR & KEMENAG RI
            </span>
            <p className="text-xs leading-relaxed text-muted">
              Ayat ini mengandung penegasan keagungan tauhid dan jaminan
              ketenangan jiwa bagi orang-orang yang beriman serta beramal
              shaleh, menguatkan persaudaraan di atas kebenaran universal.
            </p>
          </div>
        </div>
      </Modal>
    </>
  )
}
