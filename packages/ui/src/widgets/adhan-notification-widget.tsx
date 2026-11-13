"use client"
import { useMounted, safeGetStorage, safeSetStorage } from "@workspace/hooks"

import { useState, useEffect } from "react"
import { Volume2, VolumeX } from "lucide-react"

export function AdhanNotificationWidget() {
  const mounted = useMounted()
  const [adhanEnabled, setAdhanEnabled] = useState(true)

  useEffect(() => {
    setTimeout(() => {
      const saved = safeGetStorage("mw_adhan_enabled")
      if (saved) {
        setAdhanEnabled(saved === "true")
      }
    }, 0)
  }, [])

  function toggleAdhan() {
    const nextState = !adhanEnabled
    setAdhanEnabled(nextState)
    safeSetStorage("mw_adhan_enabled", String(nextState))

    if (nextState) {
      // Audio preview test
      const audio = new Audio(
        "https://cdn.islamic.network/quran/audio/128/ar.alafasy/1.mp3"
      )
      audio.play().catch(() => {})
    }
  }

  if (!mounted) return null

  return (
    <button
      onClick={toggleAdhan}
      className={`rounded-md flex cursor-pointer items-center gap-1 border px-2.5 py-0.5 text-[9px] font-black transition-all ${
        adhanEnabled
          ? "bg-success/15 text-success border-success/40 hover:bg-success/25"
          : "bg-background border-primary/20 text-primary hover:text-foreground"
      }`}
      title="Sakelar Alarm Suara Azan Taktis Waktu Shalat"
    >
      {adhanEnabled ? (
        <Volume2 className="text-success h-3 w-3" />
      ) : (
        <VolumeX className="h-3 w-3 text-primary" />
      )}
      <span>[ ADHAN: {adhanEnabled ? "ACTIVE" : "MUTED"} ]</span>
    </button>
  )
}
