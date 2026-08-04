"use client"
import { useMounted } from "@core/hooks"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { calculateLunarPhase, LunarPhaseInfo } from "@core/utils/lunar-phase"
import { useLanguage } from "@core/contexts"
import { useGlobalAudio } from "@core/contexts"
import { GlobalLiveAudioTranslator } from "./global-live-audio-translator"
import { Play, Pause, SkipForward, SkipBack, Music, Users, Activity, Compass, Repeat, Gauge } from "lucide-react"
import { useMoonStore } from "@core/store/moon-store"

export function Taskbar() {
  const pathname = usePathname()
  const { lang } = useLanguage()
  const { isPlaying, currentSurah, togglePlay, playbackRate, setPlaybackRate, isLooping, toggleLoop } = useGlobalAudio()
  const { activeConnections } = useMoonStore()
  const mounted = useMounted()
  const [timeStr, setTimeStr] = useState("")
  const [lunarInfo, setLunarInfo] = useState<LunarPhaseInfo | null>(null)

  useEffect(() => {
    setTimeout(() => {
      setLunarInfo(calculateLunarPhase(new Date(), lang === "id" ? "id" : "en"))
    }, 0)

    const timer = setInterval(() => {
      const now = new Date()
      setTimeStr(
        now.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        })
      )
    }, 1000)

    return () => clearInterval(timer)
  }, [lang])

  // Hide global taskbar on dedicated system portals
  if (
    pathname?.startsWith("/erp") ||
    pathname?.startsWith("/console") ||
    pathname?.startsWith("/auth")
  ) {
    return null
  }

  if (!mounted) return null

  return (
    <div
      className="fixed right-0 bottom-0 left-0 z-[50] border-t border-white/10 bg-black/20 font-mono backdrop-blur-md select-none"
      style={{ height: "34px" }}
    >
      <div className="flex h-full items-center justify-between gap-2 px-3 text-[10px] tracking-widest uppercase sm:px-6">
        {/* ── LEFT: System Status ────────────────────────────────── */}
        <div className="flex shrink-0 items-center gap-4 text-primary sm:gap-6">
          {/* SYS ONLINE indicator */}
          <span className="flex items-center gap-1.5 font-bold text-emerald-400" title="System Online">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400 shadow-[0_0_8px_#10B981]" />
            <span className="hidden sm:inline">SYS</span>
          </span>

          <span className="hidden h-3 w-px bg-white/10 sm:block" />

          {/* Active Connections */}
          <span className="hidden items-center gap-1.5 sm:flex text-emerald-400/80" title="Active Connections">
            <Users className="h-3 w-3 text-emerald-400" />
            <strong className="font-black text-emerald-400">{activeConnections}</strong>
          </span>

          <span className="hidden h-3 w-px bg-white/10 sm:block" />

          {/* Latency */}
          <span className="hidden items-center gap-1.5 sm:flex" title="Network Latency">
            <Activity className="h-3 w-3 text-cyan-400" />
            <strong className="font-black text-cyan-400">12MS</strong>
          </span>

          <span className="hidden h-3 w-px bg-white/10 md:block" />

          {/* Qibla */}
          <span className="hidden items-center gap-1.5 md:flex" title="Qibla Direction">
            <Compass className="h-3 w-3 text-cyan-400" />
            <strong className="font-black text-cyan-400">295.14°</strong>
          </span>

          <span className="hidden h-3 w-px bg-white/10 lg:block" />

          {/* Lunar Phase */}
          {lunarInfo && (
            <span className="hidden items-center gap-1.5 lg:flex" title={lunarInfo.phaseName}>
              <span className="text-amber-400">◐</span>
              <span>
                <strong className="font-black text-amber-400">
                  {lunarInfo.illuminationPercent}%
                </strong>
              </span>
            </span>
          )}
        </div>

        {/* ── CENTER: Clock ──────────────────────────────────────── */}
        <div className="flex shrink-0 items-center gap-1.5 rounded border border-cyan-500/20 bg-cyan-950/20 px-3 py-0.5 font-black text-cyan-300 shadow-[0_0_10px_rgba(0,240,255,0.1)]">
          <span>{timeStr || "00:00:00"}</span>
          <span className="hidden text-[9px] text-white/50 sm:inline">WIB</span>
        </div>

        {/* ── RIGHT: Audio Player + Version ──────────────────────── */}
        <div className="flex shrink-0 items-center gap-4 text-primary sm:gap-6">
          {/* Audio Player — compact inline */}
          <div className="hidden items-center gap-2 sm:flex">
            <Music className="h-3 w-3 animate-pulse text-cyan-400" />
            <span className="max-w-[120px] truncate font-bold text-cyan-400">
              #{currentSurah.number} {currentSurah.name}
            </span>

            {/* Transport controls */}
            <div className="ml-2 flex items-center gap-1">
              <button
                aria-label="Previous"
                className="flex items-center justify-center p-1 transition-colors hover:text-cyan-400"
              >
                <SkipBack className="h-3 w-3" />
              </button>
              <button
                onClick={togglePlay}
                aria-label={isPlaying ? "Pause" : "Play"}
                className="flex items-center justify-center p-1 text-cyan-400 transition-colors hover:text-emerald-400"
              >
                {isPlaying ? (
                  <Pause className="h-3.5 w-3.5 text-emerald-400" />
                ) : (
                  <Play className="h-3.5 w-3.5" />
                )}
              </button>
              <button
                aria-label="Next"
                className="flex items-center justify-center p-1 transition-colors hover:text-cyan-400"
              >
                <SkipForward className="h-3 w-3" />
              </button>
            </div>
            
            {/* Speed & Loop Controls */}
            <div className="ml-2 flex items-center gap-2">
              <button
                onClick={toggleLoop}
                aria-label="Toggle Loop"
                className={`flex items-center justify-center p-1 transition-colors ${isLooping ? 'text-fuchsia-400' : 'text-cyan-400/50 hover:text-cyan-400'}`}
              >
                <Repeat className="h-3 w-3" />
              </button>
              <button
                onClick={() => setPlaybackRate(playbackRate === 1 ? 1.5 : playbackRate === 1.5 ? 2 : 1)}
                aria-label="Toggle Speed"
                className="flex items-center gap-1 p-1 text-[9px] font-bold text-cyan-400/80 transition-colors hover:text-cyan-400"
              >
                <Gauge className="h-3 w-3" />
                {playbackRate}x
              </button>
            </div>
          </div>

          <span className="hidden h-3 w-px bg-white/10 sm:block" />

          {/* Audio Translate */}
          <div className="hidden md:block">
            <GlobalLiveAudioTranslator />
          </div>

          <span className="hidden h-3 w-px bg-white/10 md:block" />

          {/* Version badge */}
          <span className="rounded border border-white/20 bg-white/5 px-2 py-0.5 text-[9px] font-bold text-white/50">
            MW-OS V6.5
          </span>
        </div>
      </div>
    </div>
  )
}

// Backward compatibility alias
export { Taskbar as HUDTaskbar }
