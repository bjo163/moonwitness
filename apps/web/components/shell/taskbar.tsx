"use client"
import { useMounted, safeGetStorage, safeSetStorage } from "@workspace/hooks"

import { useState, useEffect, useRef } from "react"
import { usePathname } from "next/navigation"
import { calculateLunarPhase, LunarPhaseInfo } from "@moon/client"
import { getSunInfo, SunInfo } from "@moon/client"
import { useLanguage } from "@workspace/state"
import { useGlobalAudio } from "@workspace/state"
import { TaskbarAudioPlayer } from "./taskbar/taskbar-audio-player"
import { TaskbarClock } from "./taskbar/taskbar-clock"
import { TaskbarSystemStatus } from "./taskbar/taskbar-system-status"

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
    const cached = safeGetStorage("mw_last_location")
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
          safeSetStorage(
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
        <TaskbarSystemStatus activeConnections={activeConnections} lunarInfo={lunarInfo} sunInfo={sunInfo} onPlayDuhaChime={playDuhaChime} />
        <TaskbarClock time={timeStr} />
        <TaskbarAudioPlayer
          currentSurah={currentSurah}
          isPlaying={isPlaying}
          playbackRate={playbackRate}
          isLooping={isLooping}
          onTogglePlay={togglePlay}
          onToggleLoop={toggleLoop}
          onSetPlaybackRate={setPlaybackRate}
        />
      </div>
    </div>
  )
}
