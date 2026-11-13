import { createPortal } from "react-dom"
import Link from "next/link"
import { Check, Copy, Square, Volume2 } from "lucide-react"
import type { RandomInspirationData } from "./random-warp-generator-data"

type RandomWarpGeneratorModalProps = {
  mounted: boolean
  isOpen: boolean
  warping: boolean
  warpData: RandomInspirationData | null
  copied: boolean
  isPlayingAudio: boolean
  onClose: () => void
  onNavigate: () => void
  onWarp: () => void
  onToggleAudio: () => void
  onCopy: () => void
}

export function RandomWarpGeneratorModal({
  mounted,
  isOpen,
  warping,
  warpData,
  copied,
  isPlayingAudio,
  onClose,
  onNavigate,
  onWarp,
  onToggleAudio,
  onCopy,
}: RandomWarpGeneratorModalProps) {
  if (!isOpen || !mounted || typeof document === "undefined") return null

  return createPortal(
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-background/95 p-4 font-mono backdrop-blur-2xl">
      <div className="relative my-auto flex max-h-[85vh] w-full max-w-lg flex-col overflow-hidden rounded-xl border border-primary/50 bg-card shadow-sm">
        <div className="holo-scan-bar" />
        <div className="flex shrink-0 items-center justify-between border-b border-primary/20 bg-background/80 px-6 py-4">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 animate-pulse rounded-full bg-success" />
            <span className="text-xs font-black tracking-widest text-primary uppercase">
              // TELEPORTATION WARP PORTAL
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex items-center gap-1 rounded border border-primary/20 bg-background px-2.5 py-1 text-xs font-bold text-primary transition-all hover:border-primary/60 hover:text-foreground"
          >
            [✕ CLOSE]
          </button>
        </div>
        <div className="theme-scrollbar grow space-y-5 overflow-y-auto p-6 sm:p-8">
          {warping ? (
            <div className="space-y-3 py-16 text-center">
              <div className="spectrum-bar justify-center">
                <span />
                <span />
                <span />
                <span />
              </div>
              <p className="animate-pulse text-xs font-bold text-primary">
                // WARPING RANDOM SCRIPTURE TRANSMISSION...
              </p>
            </div>
          ) : warpData ? (
            <div className="animate-in space-y-4 fade-in">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="rounded-md border border-emerald-500/40 bg-success/10 px-2 py-0.5 font-mono text-[10px] text-success">
                  📖 Q.S {warpData.surahName} ({warpData.surahNumber}:
                  {warpData.ayahNumber})
                </span>
                <span className="rounded-md border border-amber-500/40 bg-warning/10 px-2 py-0.5 font-mono text-[9px] text-warning">
                  ✨ {warpData.asmaulName}
                </span>
              </div>
              <div className="arabic-text py-2 text-right text-2xl leading-[2.2] font-bold text-foreground sm:text-3xl">
                {warpData.textArabic}
              </div>
              <p className="text-xs font-bold text-success italic">
                &ldquo;{warpData.textLatin}&rdquo;
              </p>
              <div className="rounded-md border border-primary/20 bg-background p-3 text-xs text-foreground/90">
                &ldquo;{warpData.translationId}&rdquo;
              </div>
              <div className="rounded-md border border-secondary/40 bg-secondary/15 p-3 text-xs text-primary">
                <span className="mb-1 block font-bold text-accent">
                  📜 KAITAN HADITS NABAWI:
                </span>
                &ldquo;{warpData.hadithText}&rdquo;
              </div>
              <div className="flex flex-wrap items-center justify-between gap-2 border-t border-primary/15 pt-3">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={onWarp}
                    className="btn-primary px-3.5 py-2 text-[10px]"
                  >
                    🔄 WARP AGAIN
                  </button>
                  {warpData.audioUrl && (
                    <button
                      type="button"
                      onClick={onToggleAudio}
                      className={`btn-primary flex items-center gap-1.5 px-3 py-2 text-[10px] ${isPlayingAudio ? "btn-primary-purple text-primary" : "btn-primary-ghost text-success"}`}
                    >
                      {isPlayingAudio ? (
                        <>
                          <Square className="h-3 w-3 animate-pulse fill-current" />
                          <span>PAUSE</span>
                        </>
                      ) : (
                        <>
                          <Volume2 className="h-3 w-3" />
                          <span>AUDIO</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={onCopy}
                    className="btn-primary btn-primary-ghost flex items-center gap-1 px-3 py-2 text-[10px] text-primary"
                    title="Copy Transmission Link"
                  >
                    {copied ? (
                      <>
                        <Check className="h-3 w-3 text-success" />
                        <span className="text-success">COPIED!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3 w-3" />
                        <span>COPY</span>
                      </>
                    )}
                  </button>
                  <Link
                    href={`/kitab/quran/${warpData.surahNumber}`}
                    onClick={onNavigate}
                    className="btn-primary px-3.5 py-2 text-[10px]"
                  >
                    READ SURAH →
                  </Link>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>,
    document.body
  )
}
