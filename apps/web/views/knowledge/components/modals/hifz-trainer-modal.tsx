"use client"

import { useState, useEffect } from "react"
import { Sparkles, RotateCcw } from "lucide-react"
import { Modal } from "@core/ui/modal"
import { ModalTrigger } from "@core/ui"

type HifzTrainerProps = {
  surahName: string
  surahNumber: number
  ayahNumber: number
  textArabic: string
  translationId: string
}

export function HifzTrainerModal({
  surahName,
  surahNumber,
  ayahNumber,
  textArabic,
  translationId,
}: HifzTrainerProps) {
  const [mounted, setMounted] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [hideMode, setHideMode] = useState<"NONE" | "BLUR" | "HIDE">("NONE")
  const [repeatCount, setRepeatCount] = useState(0)

  useEffect(() => {
    setTimeout(() => setMounted(true), 0)
  }, [])

  return (
    <>
      <ModalTrigger
        icon={Sparkles}
        label="[ HIFZ MEMORIZATION TRAINER ]"
        onClick={() => setIsOpen(true)}
        title="Buka Asisten Menghafal Ayat (Hifz Trainer)"
        color="purple"
        hideLabelOnMobile={true}
      />

      <Modal
        isOpen={isOpen && mounted}
        onClose={() => setIsOpen(false)}
        title="// HIFZ MEMORIZATION COMPANION"
        icon={Sparkles}
        maxWidth="max-w-lg"
        borderColor="border-secondary/60"
        glowColor="rgba(161,0,255,0.3)"
      >
        <div className="space-y-4 p-6 text-xs">
          <div className="flex items-center justify-between">
            <span className="tag-clip tag-clip px-2 py-0.5 text-[8px] font-bold">
              Q.S {surahName} ({surahNumber}:{ayahNumber})
            </span>
            <span className="text-success text-[10px] font-bold">
              PENGULANGAN: {repeatCount}x
            </span>
          </div>

          {/* Mode Controls */}
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => setHideMode("NONE")}
              className={`tag-clip border py-2 text-[10px] font-bold transition-all ${
                hideMode === "NONE"
                  ? "border-primary bg-primary/20 text-primary"
                  : "bg-space border-primary/20 text-muted"
              }`}
            >
              SHOW ALL
            </button>
            <button
              onClick={() => setHideMode("BLUR")}
              className={`tag-clip border py-2 text-[10px] font-bold transition-all ${
                hideMode === "BLUR"
                  ? "border-accent bg-accent/20 text-accent"
                  : "bg-space border-primary/20 text-muted"
              }`}
            >
              BLUR TEXT
            </button>
            <button
              onClick={() => setHideMode("HIDE")}
              className={`tag-clip border py-2 text-[10px] font-bold transition-all ${
                hideMode === "HIDE"
                  ? "bg-danger/20 text-danger border-danger"
                  : "bg-space border-primary/20 text-muted"
              }`}
            >
              HIDE ALL
            </button>
          </div>

          {/* Arabic Verse Interactive Hifz Card */}
          <div className="panel-box bg-space space-y-4 border border-secondary/30 p-6 text-center">
            <div
              className={`arabic-text text-2xl leading-loose font-bold text-foreground transition-all duration-300 sm:text-3xl ${
                hideMode === "BLUR"
                  ? "blur-md select-none"
                  : hideMode === "HIDE"
                    ? "opacity-0 select-none"
                    : ""
              }`}
            >
              {textArabic}
            </div>

            <p className="text-xs text-muted italic">
              &ldquo;{translationId}&rdquo;
            </p>
          </div>

          {/* Repeat Counter & Self-Test Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setRepeatCount((prev) => prev + 1)}
              className="btn-primary flex w-full items-center justify-center gap-2 py-2 text-xs font-bold btn-clip"
            >
              <RotateCcw className="h-3.5 w-3.5 text-primary" />
              <span>[ HITUNG PENGULANGAN HAFALAN (+1) ]</span>
            </button>
          </div>
        </div>
      </Modal>
    </>
  )
}
