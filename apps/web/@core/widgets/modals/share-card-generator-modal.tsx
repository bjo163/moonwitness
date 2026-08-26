"use client"
import { useMounted } from "@core/hooks"

import { useState, useEffect } from "react"
import { Share2, Copy, Check, Sparkles, Moon, Download } from "lucide-react"
import { Modal } from "@core/ui/modal"
import { ModalTrigger } from "@core/ui"

type ShareCardProps = {
  surahName: string
  surahNumber: number
  ayahNumber: number
  textArabic: string
  textLatin: string
  translationId: string
  asIcon?: boolean
}

export function ShareCardGeneratorModal({
  surahName,
  surahNumber,
  ayahNumber,
  textArabic,
  textLatin,
  translationId,
  asIcon = false,
}: ShareCardProps) {
  const mounted = useMounted()
  const [isOpen, setIsOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  function handleCopyCardText() {
    const cardText = `◈ MOONWITNESS TRANSMISSION CARD ◈\nQ.S ${surahName} (${surahNumber}:${ayahNumber})\n\n${textArabic}\n\n"${translationId}"\n\n- Transmitted via MoonWitness Observatory (https://moonwitness.com)`
    navigator.clipboard.writeText(cardText)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <>
      {asIcon ? (
        <button
          onClick={() => setIsOpen(true)}
          title="Export Infographic Share Card"
          className="flex h-6 w-6 items-center justify-center rounded bg-white/5 text-[10px] text-blue-400 transition-colors hover:bg-blue-500/20 hover:text-blue-300"
        >
          <Share2 className="h-3 w-3" />
        </button>
      ) : (
        <ModalTrigger
          icon={Share2}
          label="[ EXPORT SHARE CARD ]"
          onClick={() => setIsOpen(true)}
          title="Buat Kartu Infografis Transmisi Harian"
          color="cyan"
        />
      )}

      <Modal
        isOpen={isOpen && mounted}
        onClose={() => setIsOpen(false)}
        title="// TRANSMISSION INFOGRAPHIC SHARE CARD"
        icon={Sparkles}
        maxWidth="max-w-lg"
      >
        <div className="space-y-4 p-6">
          <div className="panel-box bg-space relative space-y-4 overflow-hidden border-2 border-primary/50 p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-primary/20 pb-3">
              <div className="flex items-center gap-2">
                <Moon className="h-5 w-5 text-primary" />
                <span className="font-display text-sm font-black tracking-widest text-foreground">
                  MOON<span className="text-primary">WITNESS</span>
                </span>
              </div>
              <span className="text-success text-[9px] font-bold">
                ● TRANSMISSION ACTIVE
              </span>
            </div>

            <div className="arabic-text py-2 text-right text-xl leading-loose font-bold text-foreground">
              {textArabic}
            </div>

            <div className="space-y-1">
              <div className="text-xs font-bold text-primary">
                Q.S {surahName} ({surahNumber}:{ayahNumber})
              </div>
              <p className="text-xs leading-relaxed text-muted italic">
                &ldquo;{translationId}&rdquo;
              </p>
            </div>

            <div className="flex items-center justify-between border-t border-primary/15 pt-3 text-[8px] text-muted">
              <span>MOONWITNESS OBSERVATORY TELEMETRY</span>
              <span>UTC +7 // ASIA/JAKARTA</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleCopyCardText}
              className="btn-primary flex w-full items-center justify-center gap-2 py-2.5 text-xs font-bold btn-clip"
            >
              {copied ? (
                <Check className="text-success h-4 w-4" />
              ) : (
                <Copy className="h-4 w-4 text-primary" />
              )}
              <span>
                {copied ? "[ CARD TEXT COPIED! ]" : "[ COPY INFOGRAPHIC TEXT ]"}
              </span>
            </button>

            <button
              onClick={() => {
                const canvas = document.createElement("canvas")
                canvas.width = 800
                canvas.height = 500
                const ctx = canvas.getContext("2d")
                if (ctx) {
                  ctx.fillStyle = "#05070A"
                  ctx.fillRect(0, 0, 800, 500)
                  ctx.strokeStyle = "#00F0FF"
                  ctx.lineWidth = 4
                  ctx.strokeRect(20, 20, 760, 460)

                  ctx.fillStyle = "#00F0FF"
                  ctx.font = "bold 16px Orbitron, sans-serif"
                  ctx.fillText(
                    `MOONWITNESS TRANSMISSION // Q.S ${surahName} (${surahNumber}:${ayahNumber})`,
                    40,
                    60
                  )

                  ctx.fillStyle = "#F5F5F5"
                  ctx.font = "bold 24px sans-serif"
                  ctx.textAlign = "right"
                  ctx.fillText(textArabic, 740, 160)

                  ctx.fillStyle = "#8B9BB0"
                  ctx.font = "italic 16px monospace"
                  ctx.textAlign = "left"
                  ctx.fillText(`"${translationId.slice(0, 70)}..."`, 40, 300)

                  ctx.fillStyle = "#00FF66"
                  ctx.font = "bold 14px monospace"
                  ctx.fillText(
                    `GPS QIBLA: 295.14° NNE • MOONWITNESS OBSERVATORY`,
                    40,
                    440
                  )

                  const link = document.createElement("a")
                  link.download = `MoonWitness_Share_${surahNumber}_${ayahNumber}.png`
                  link.href = canvas.toDataURL("image/png")
                  link.click()
                }
              }}
              className="btn-primary btn-primary-purple flex w-full items-center justify-center gap-2 py-2.5 text-xs font-bold btn-clip"
            >
              <Download className="h-4 w-4 text-secondary" />
              <span>[ 📥 DOWNLOAD IMAGE PNG ]</span>
            </button>
          </div>
        </div>
      </Modal>
    </>
  )
}
