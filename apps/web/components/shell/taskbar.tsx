"use client"
import { useMounted, useGeolocation } from "@workspace/hooks"

import { useState, useEffect, useRef } from "react"
import { usePathname } from "next/navigation"
import { calculateLunarPhase, LunarPhaseInfo } from "@moon/client"
import { getSunInfo, SunInfo } from "@moon/client"
import { useLanguage } from "@workspace/state"
import { useGlobalAudio } from "@workspace/state"
import { GlobalLiveAudioTranslator } from "./global-live-audio-translator"
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Music,
  Users,
  Activity,
  Compass,
  Repeat,
  Gauge,
  Sun,
} from "lucide-react"

export function Taskbar() {
  const pathname = usePathname()
  const { lang } = useLanguage()
  const {
    isPlaying,
    currentSurah,
    togglePlay,
    playbackRate,
    setPlaybackRate,
    isLooping,
    toggleLoop,
  } = useGlobalAudio()
  const activeConnections = 48
  const mounted = useMounted()
  const geo = useGeolocation()
  const userCoords =
    geo.lat !== null && geo.lng !== null
      ? { lat: geo.lat, lng: geo.lng }
      : { lat: -6.2088, lng: 106.8456 }
  const [timeStr, setTimeStr] = useState("")
  const [lunarInfo, setLunarInfo] = useState<LunarPhaseInfo | null>(null)
  const [sunInfo, setSunInfo] = useState<SunInfo | null>(null)
  const prevDuhaStatus = useRef<string | null>(null)

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

      // Update sun info every tick
      if (userCoords) {
        setSunInfo(getSunInfo(now, userCoords.lat, userCoords.lng))
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [lang, userCoords])

  const playDuhaChime = (isAfdhal: boolean) => {
    try {
      const AudioContextClass =
        window.AudioContext || (window as any).webkitAudioContext
      if (AudioContextClass) {
        const ctx = new AudioContextClass()

        const playTone = (freq1: number, freq2: number, startTime: number) => {
          const osc = ctx.createOscillator()
          const gain = ctx.createGain()
          osc.connect(gain)
          gain.connect(ctx.destination)

          osc.type = "sine"
          osc.frequency.setValueAtTime(freq1, startTime)
          osc.frequency.exponentialRampToValueAtTime(freq2, startTime + 1.2)

          // Volume lebih kencang (peak di 1.0)
          gain.gain.setValueAtTime(0, startTime)
          gain.gain.linearRampToValueAtTime(1.0, startTime + 0.05)
          gain.gain.exponentialRampToValueAtTime(0.01, startTime + 1.2)

          osc.start(startTime)
          osc.stop(startTime + 1.2)
        }

        if (isAfdhal) {
          // Double chime tinggi untuk Afdhal
          playTone(880, 440, ctx.currentTime)
          playTone(1046.5, 523.25, ctx.currentTime + 0.4) // C6
        } else {
          // Double chime standar untuk Duha
          playTone(523.25, 261.63, ctx.currentTime) // C5
          playTone(659.25, 329.63, ctx.currentTime + 0.4) // E5
        }
      }
    } catch (e) {
      console.error("Failed to play alarm chime", e)
    }
  }

  // Play alarm sound when Duha status changes
  useEffect(() => {
    if (!sunInfo) return

    if (
      prevDuhaStatus.current &&
      prevDuhaStatus.current !== sunInfo.duhaStatus
    ) {
      if (sunInfo.duhaStatus === "AFDHAL" || sunInfo.duhaStatus === "ACTIVE") {
        playDuhaChime(sunInfo.duhaStatus === "AFDHAL")
      }
    }

    prevDuhaStatus.current = sunInfo.duhaStatus
  }, [sunInfo])

  // Hide global taskbar on dedicated system portals
  if (
    pathname?.startsWith("/command-center") ||
    pathname?.startsWith("/auth")
  ) {
    return null
  }

  if (!mounted) return null

  return (
    <div
      className="fixed right-0 bottom-0 left-0 z-[50] border-t border-cyan-500/20 bg-black/50 font-mono shadow-sm backdrop-blur-xl select-none"
      style={{ height: "44px" }}
    >
      <div className="flex h-full items-center justify-between gap-1 px-2 text-[10px] tracking-widest uppercase sm:gap-2 sm:px-6">
        {/* ── LEFT: System Status ────────────────────────────────── */}
        <div className="flex shrink-0 items-center gap-4 text-primary sm:gap-6">
          {/* SYS ONLINE indicator */}
          <span
            className="flex items-center gap-1.5 font-bold text-emerald-400"
            title="System Online"
          >
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400 shadow-sm" />
            <span className="hidden sm:inline">SYS</span>
          </span>

          <span className="hidden h-3 w-px bg-white/10 sm:block" />

          {/* Active Connections */}
          <span
            className="hidden items-center gap-1.5 text-emerald-400/80 sm:flex"
            title="Active Connections"
          >
            <Users className="h-3 w-3 text-emerald-400" />
            <strong className="font-black text-emerald-400">
              {activeConnections}
            </strong>
          </span>

          <span className="hidden h-3 w-px bg-white/10 sm:block" />

          {/* Latency */}
          <span
            className="hidden items-center gap-1.5 sm:flex"
            title="Network Latency"
          >
            <Activity className="h-3 w-3 text-cyan-400" />
            <strong className="font-black text-cyan-400">12MS</strong>
          </span>

          <span className="hidden h-3 w-px bg-white/10 md:block" />

          {/* Qibla */}
          <span
            className="hidden items-center gap-1.5 md:flex"
            title="Qibla Direction"
          >
            <Compass className="h-3 w-3 text-cyan-400" />
            <strong className="font-black text-cyan-400">295.14°</strong>
          </span>

          <span className="hidden h-3 w-px bg-white/10 lg:block" />

          {/* Lunar Phase */}
          {lunarInfo && (
            <span
              className="hidden items-center gap-1.5 lg:flex"
              title={lunarInfo.phaseName}
            >
              <span className="text-amber-400">◐</span>
              <span>
                <strong className="font-black text-amber-400">
                  {lunarInfo.illuminationPercent}%
                </strong>
              </span>
            </span>
          )}

          <span className="hidden h-3 w-px bg-white/10 lg:block" />

          {/* Sun Position & Duha Status */}
          {sunInfo && (
            <span
              onClick={() => playDuhaChime(sunInfo.duhaStatus === "AFDHAL")}
              className="hidden cursor-pointer items-center gap-1.5 transition-opacity hover:opacity-80 lg:flex"
              title={`Solar Altitude: ${sunInfo.altitude}° — ${sunInfo.duhaLabel || sunInfo.label}`}
            >
              <Sun
                className={`h-3 w-3 ${
                  sunInfo.duhaStatus === "AFDHAL"
                    ? "animate-pulse text-amber-400"
                    : sunInfo.duhaStatus === "ACTIVE"
                      ? "text-amber-400"
                      : sunInfo.altitude > 0
                        ? "text-amber-400/60"
                        : "text-zinc-600"
                }`}
              />
              <strong
                className={`font-black ${
                  sunInfo.duhaStatus === "AFDHAL"
                    ? "text-amber-400 drop-shadow-sm"
                    : sunInfo.duhaStatus === "ACTIVE"
                      ? "text-amber-400"
                      : sunInfo.altitude > 0
                        ? "text-amber-400/70"
                        : "text-zinc-500"
                }`}
              >
                {sunInfo.altitude}°
              </strong>
              {sunInfo.duhaLabel && (
                <span
                  className={`text-[9px] font-bold ${
                    sunInfo.duhaStatus === "AFDHAL"
                      ? "text-amber-400 drop-shadow-sm"
                      : "text-emerald-400/70"
                  }`}
                >
                  {sunInfo.duhaLabel}
                </span>
              )}
            </span>
          )}
        </div>

        {/* ── CENTER: Clock ──────────────────────────────────────── */}
        <div className="flex shrink-0 items-center gap-1.5 rounded border border-cyan-500/20 bg-cyan-950/20 px-3 py-0.5 font-black text-cyan-300 shadow-sm">
          <span>{timeStr || "00:00:00"}</span>
          <span className="hidden text-[9px] text-white/50 sm:inline">WIB</span>
        </div>

        {/* ── RIGHT: Audio Player + Version ──────────────────────── */}
        <div className="flex shrink-0 items-center gap-4 text-primary sm:gap-6">
          {/* Audio Player — compact inline */}
          <div className="flex items-center gap-1 sm:gap-2">
            <Music className="hidden h-3 w-3 animate-pulse text-cyan-400 sm:block" />
            <span className="hidden max-w-[120px] truncate font-bold text-cyan-400 sm:inline-block">
              #{currentSurah.number} {currentSurah.name}
            </span>

            {/* Transport controls */}
            <div className="flex items-center gap-1 sm:ml-2">
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
            <div className="hidden items-center gap-2 sm:ml-2 sm:flex">
              <button
                onClick={toggleLoop}
                aria-label="Toggle Loop"
                className={`flex items-center justify-center p-1 transition-colors ${isLooping ? "text-fuchsia-400" : "text-cyan-400/50 hover:text-cyan-400"}`}
              >
                <Repeat className="h-3 w-3" />
              </button>
              <button
                onClick={() =>
                  setPlaybackRate(
                    playbackRate === 1 ? 1.5 : playbackRate === 1.5 ? 2 : 1
                  )
                }
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
