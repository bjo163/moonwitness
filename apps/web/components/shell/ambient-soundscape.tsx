"use client"

import { useState, useEffect, useRef } from "react"
import { Volume2, VolumeX } from "lucide-react"

type AmbientTrack = {
  id: string
  name: string
  freq: number
  type: OscillatorType
}

const AMBIENT_PRESETS: AmbientTrack[] = [
  { id: "cosmic", name: "Cosmic Space Hum", freq: 108, type: "sine" },
  { id: "rain", name: "Sacred Rain Frequency", freq: 174, type: "triangle" },
  { id: "oasis", name: "Oasis Stream Harmony", freq: 285, type: "sine" },
  { id: "breeze", name: "Desert Night Breeze", freq: 432, type: "sine" },
]

const SOFT_DRONE_GAIN = 0.015

export function AmbientSoundscape() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [selectedTrack, setSelectedTrack] = useState<AmbientTrack>(
    AMBIENT_PRESETS[0]!
  )
  const audioCtxRef = useRef<AudioContext | null>(null)
  const oscRef = useRef<OscillatorNode | null>(null)
  const gainRef = useRef<GainNode | null>(null)

  useEffect(() => {
    return () => {
      if (oscRef.current) {
        try {
          oscRef.current.stop()
        } catch {
          /* ignore */
        }
        oscRef.current.disconnect()
        oscRef.current = null
      }
      if (gainRef.current) {
        gainRef.current.disconnect()
        gainRef.current = null
      }
    }
  }, [])

  const startAudio = (track: AmbientTrack) => {
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext })
            .webkitAudioContext
        )()
      }
      const ctx = audioCtxRef.current

      if (oscRef.current) {
        oscRef.current.stop()
        oscRef.current.disconnect()
      }
      if (gainRef.current) {
        gainRef.current.disconnect()
      }

      const osc = ctx.createOscillator()
      const gain = ctx.createGain()

      osc.type = track.type
      osc.frequency.setValueAtTime(track.freq, ctx.currentTime)

      // Very soft background drone
      gain.gain.setValueAtTime(SOFT_DRONE_GAIN, ctx.currentTime)

      osc.connect(gain)
      gain.connect(ctx.destination)

      osc.start()
      oscRef.current = osc
      gainRef.current = gain
      setIsPlaying(true)
    } catch (e) {
      console.error("Audio playback error:", e)
    }
  }

  const stopAudio = () => {
    if (oscRef.current) {
      try {
        oscRef.current.stop()
      } catch {
        /* ignore */
      }
      oscRef.current.disconnect()
      oscRef.current = null
    }
    if (gainRef.current) {
      gainRef.current.disconnect()
      gainRef.current = null
    }
    setIsPlaying(false)
  }

  const togglePlay = () => {
    if (isPlaying) {
      stopAudio()
    } else {
      startAudio(selectedTrack)
    }
  }

  const _selectTrack = (track: AmbientTrack) => {
    setSelectedTrack(track)
    if (isPlaying) {
      startAudio(track)
    }
  }

  return (
    <div className="flex items-center gap-1.5 font-sans">
      <button
        onClick={togglePlay}
        className={`flex cursor-pointer items-center gap-1 border px-2 py-1 text-xs font-medium transition-colors clip-tag ${
          isPlaying
            ? "border-success/60 bg-success/10 text-success"
            : "border-border text-muted-foreground hover:border-primary hover:text-primary"
        }`}
        title="Toggle Ambient Audio Soundscape"
      >
        {isPlaying ? (
          <Volume2 className="text-success h-3.5 w-3.5" />
        ) : (
          <VolumeX className="h-3.5 w-3.5" />
        )}
        <span>{isPlaying ? selectedTrack.name : "Ambient sound"}</span>
      </button>
    </div>
  )
}

export { AmbientSoundscape as CyberAmbientSoundscape }
