"use client"
import { useMounted } from "@workspace/hooks"

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
  const [timeStr, setTimeStr] = useState("")
  const [lunarInfo, setLunarInfo] = useState<LunarPhaseInfo | null>(null)
  const [sunInfo, setSunInfo] = useState<SunInfo | null>(null)
  const [userCoords, setUserCoords] = useState<{
    lat: number
    lng: number
  } | null>(null)
  const prevDuhaStatus = useRef<string | null>(null)

  // Get geolocation once
  useEffect(() => {
    // Try cache first
    const cached = localStorage.getItem("mw_last_location")
    if (cached) {
      try {
        const { lat, lng, timestamp } = JSON.parse(cached)
        if (Date.now() - timestamp < 86400000) {
          setUserCoords({ lat, lng })
        }
      } catch {}
    }

    if (typeof navigator !== "undefined" && "geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude
          const lng = pos.coords.longitude
          localStorage.setItem(
            "mw_last_location",
            JSON.stringify({ lat, lng, timestamp: Date.now() })
          )
          setUserCoords({ lat, lng })
        },
        () => {
          // Fallback to Jakarta if denied
          if (!userCoords) setUserCoords({ lat: -6.2088, lng: 106.8456 })
        },
        { timeout: 5000, enableHighAccuracy: false, maximumAge: 3600000 }
      )
    } else if (!userCoords) {
      setUserCoords({ lat: -6.2088, lng: 106.8456 })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const initialUpdate = setTimeout(() => {
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

    return () => {
      clearTimeout(initialUpdate)
      clearInterval(timer)
    }
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
      className="fixed right-0 bottom-0 left-0 z-[50] border-t border-border bg-card select-none"
      style={{ height: "44px" }}
    >
      <div className="flex h-full items-center justify-between gap-1 px-2 text-xs tracking-wide sm:gap-2 sm:px-6">
        {/* ── LEFT: System Status ────────────────────────────────── */}
        <div className="flex shrink-0 items-center gap-4 text-primary sm:gap-6">
          {/* SYS ONLINE indicator */}
          <span
            className="text-success flex items-center gap-1.5 font-medium"
            title="System Online"
          >
            <span className="bg-success h-1.5 w-1.5 rounded-full" />
            <span className="hidden sm:inline">System</span>
          </span>

          <span className="hidden h-3 w-px bg-border sm:block" />

          {/* Active Connections */}
          <span
            className="text-success/80 hidden items-center gap-1.5 font-mono sm:flex"
            title="Active Connections"
          >
            <Users className="text-success h-3 w-3" />
            <strong className="text-success font-semibold">
              {activeConnections}
            </strong>
          </span>

          <span className="hidden h-3 w-px bg-border sm:block" />

          {/* Latency */}
          <span
            className="hidden items-center gap-1.5 font-mono sm:flex"
            title="Network Latency"
          >
            <Activity className="h-3 w-3 text-primary" />
            <strong className="font-semibold text-primary">12 ms</strong>
          </span>

          <span className="hidden h-3 w-px bg-border md:block" />

          {/* Qibla */}
          <span
            className="hidden items-center gap-1.5 font-mono md:flex"
            title="Qibla Direction"
          >
            <Compass className="h-3 w-3 text-primary" />
            <strong className="font-semibold text-primary">295.14°</strong>
          </span>

          <span className="hidden h-3 w-px bg-border lg:block" />

          {/* Lunar Phase */}
          {lunarInfo && (
            <span
              className="hidden items-center gap-1.5 lg:flex"
              title={lunarInfo.phaseName}
            >
              <span className="text-warning">◐</span>
              <span>
                <strong className="text-warning font-mono font-semibold">
                  {lunarInfo.illuminationPercent}%
                </strong>
              </span>
            </span>
          )}

          <span className="hidden h-3 w-px bg-border lg:block" />

          {/* Sun Position & Duha Status */}
          {sunInfo && (
            <button
              onClick={() => playDuhaChime(sunInfo.duhaStatus === "AFDHAL")}
              type="button"
              className="hidden items-center gap-1.5 rounded-sm transition-opacity hover:opacity-80 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none lg:flex"
              aria-label={`Sun position ${sunInfo.altitude} degrees, ${sunInfo.duhaLabel || sunInfo.label}`}
              title={`Solar Altitude: ${sunInfo.altitude}° — ${sunInfo.duhaLabel || sunInfo.label}`}
            >
              <Sun
                className={`h-3 w-3 ${
                  sunInfo.duhaStatus === "AFDHAL"
                    ? "text-warning"
                    : sunInfo.duhaStatus === "ACTIVE"
                      ? "text-warning"
                      : sunInfo.altitude > 0
                        ? "text-warning/60"
                        : "text-muted-foreground"
                }`}
              />
              <strong
                className={`font-mono font-semibold ${
                  sunInfo.duhaStatus === "AFDHAL"
                    ? "text-warning"
                    : sunInfo.duhaStatus === "ACTIVE"
                      ? "text-warning"
                      : sunInfo.altitude > 0
                        ? "text-warning/70"
                        : "text-muted-foreground"
                }`}
              >
                {sunInfo.altitude}°
              </strong>
              {sunInfo.duhaLabel && (
                <span
                  className={`text-xs font-medium ${
                    sunInfo.duhaStatus === "AFDHAL"
                      ? "text-warning"
                      : "text-success/70"
                  }`}
                >
                  {sunInfo.duhaLabel}
                </span>
              )}
            </button>
          )}
        </div>

        {/* ── CENTER: Clock ──────────────────────────────────────── */}
        <div className="flex shrink-0 items-center gap-1.5 rounded-md border border-primary/40 bg-primary/10 px-3 py-1 font-mono text-sm font-semibold text-primary">
          <span>{timeStr || "00:00:00"}</span>
          <span className="hidden text-xs text-muted-foreground sm:inline">
            WIB
          </span>
        </div>

        {/* ── RIGHT: Audio Player + Version ──────────────────────── */}
        <div className="flex shrink-0 items-center gap-4 text-primary sm:gap-6">
          {/* Audio Player — compact inline */}
          <div className="flex items-center gap-1 sm:gap-2">
            <Music className="hidden h-3 w-3 text-primary sm:block" />
            <span className="hidden max-w-[120px] truncate font-medium text-primary sm:inline-block">
              #{currentSurah.number} {currentSurah.name}
            </span>

            {/* Transport controls */}
            <div className="flex items-center gap-1 sm:ml-2">
              <button
                aria-label="Previous"
                className="flex items-center justify-center p-1 text-muted-foreground transition-colors hover:text-primary"
              >
                <SkipBack className="h-3 w-3" />
              </button>
              <button
                onClick={togglePlay}
                aria-label={isPlaying ? "Pause" : "Play"}
                className="hover:text-success flex items-center justify-center p-1 text-primary transition-colors"
              >
                {isPlaying ? (
                  <Pause className="text-success h-3.5 w-3.5" />
                ) : (
                  <Play className="h-3.5 w-3.5" />
                )}
              </button>
              <button
                aria-label="Next"
                className="flex items-center justify-center p-1 text-muted-foreground transition-colors hover:text-primary"
              >
                <SkipForward className="h-3 w-3" />
              </button>
            </div>

            {/* Speed & Loop Controls */}
            <div className="hidden items-center gap-2 sm:ml-2 sm:flex">
              <button
                onClick={toggleLoop}
                aria-label="Toggle Loop"
                className={`flex items-center justify-center p-1 transition-colors ${isLooping ? "text-info" : "text-muted-foreground hover:text-primary"}`}
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
                className="flex items-center gap-1 p-1 font-mono text-xs text-primary/80 transition-colors hover:text-primary"
              >
                <Gauge className="h-3 w-3" />
                {playbackRate}x
              </button>
            </div>
          </div>

          <span className="hidden h-3 w-px bg-border sm:block" />

          {/* Audio Translate */}
          <div className="hidden md:block">
            <GlobalLiveAudioTranslator />
          </div>

          <span className="hidden h-3 w-px bg-border md:block" />

          {/* Version badge */}
          <span className="border border-border bg-muted px-2 py-1 text-xs text-muted-foreground clip-tag">
            MW-OS v6.5
          </span>
        </div>
      </div>
    </div>
  )
}

// Backward compatibility alias
export { Taskbar as HUDTaskbar }
