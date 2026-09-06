"use client"

import React, { useState, useEffect } from "react"
import { Volume2, VolumeX } from "lucide-react"
import { safeGetStorage, safeSetStorage } from "@workspace/hooks"

/**
 * Procedural Web Audio API Synthesizer
 * Produces crisp notification and interaction sound effects without any external asset dependencies
 */
class SystemAudioEngine {
  private ctx: AudioContext | null = null
  private isMuted: boolean = true

  constructor() {
    if (typeof window !== "undefined") {
      const saved = safeGetStorage("mw_audio_muted")
      this.isMuted = saved ? saved === "true" : true
    }
  }

  private initContext() {
    if (!this.ctx && typeof window !== "undefined") {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext
      if (AudioCtx) {
        this.ctx = new AudioCtx()
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume()
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted
    if (typeof window !== "undefined") {
      safeSetStorage("mw_audio_muted", String(this.isMuted))
      window.dispatchEvent(new CustomEvent("mw_audio_toggle", { detail: { isMuted: this.isMuted } }))
    }
    return this.isMuted
  }

  public getMuted(): boolean {
    return this.isMuted
  }

  public playClick() {
    if (this.isMuted) return
    this.initContext()
    if (!this.ctx) return

    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()
    osc.type = "sine"
    osc.frequency.setValueAtTime(1800, this.ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(400, this.ctx.currentTime + 0.03)

    gain.gain.setValueAtTime(0.08, this.ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.03)

    osc.connect(gain)
    gain.connect(this.ctx.destination)
    osc.start()
    osc.stop(this.ctx.currentTime + 0.03)
  }

  public playTacticalClick() {
    this.playClick()
  }

  public playAlignmentChime() {
    if (this.isMuted) return
    this.initContext()
    if (!this.ctx) return

    const freqs = [528, 792, 1056]
    freqs.forEach((f, idx) => {
      if (!this.ctx) return
      const osc = this.ctx.createOscillator()
      const gain = this.ctx.createGain()
      osc.type = "sine"
      osc.frequency.setValueAtTime(f, this.ctx.currentTime + idx * 0.05)

      gain.gain.setValueAtTime(0.06, this.ctx.currentTime + idx * 0.05)
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.6)

      osc.connect(gain)
      gain.connect(this.ctx.destination)
      osc.start(this.ctx.currentTime + idx * 0.05)
      osc.stop(this.ctx.currentTime + 0.6)
    })
  }

  public playModalPulse() {
    if (this.isMuted) return
    this.initContext()
    if (!this.ctx) return

    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()
    osc.type = "triangle"
    osc.frequency.setValueAtTime(120, this.ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(40, this.ctx.currentTime + 0.15)

    gain.gain.setValueAtTime(0.12, this.ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.15)

    osc.connect(gain)
    gain.connect(this.ctx.destination)
    osc.start()
    osc.stop(this.ctx.currentTime + 0.15)
  }

  public playScanSweep() {
    if (this.isMuted) return
    this.initContext()
    if (!this.ctx) return

    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()
    osc.type = "sawtooth"
    osc.frequency.setValueAtTime(600, this.ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(2400, this.ctx.currentTime + 0.08)

    gain.gain.setValueAtTime(0.04, this.ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.08)

    osc.connect(gain)
    gain.connect(this.ctx.destination)
    osc.start()
    osc.stop(this.ctx.currentTime + 0.08)
  }

  public playDropPing() {
    if (this.isMuted) return
    this.initContext()
    if (!this.ctx) return

    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()
    osc.type = "sine"
    osc.frequency.setValueAtTime(880, this.ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(440, this.ctx.currentTime + 0.08)

    gain.gain.setValueAtTime(0.1, this.ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.08)

    osc.connect(gain)
    gain.connect(this.ctx.destination)
    osc.start()
    osc.stop(this.ctx.currentTime + 0.08)
  }

  public playSuccessChime() {
    if (this.isMuted) return
    this.initContext()
    if (!this.ctx) return

    const notes = [523.25, 659.25, 783.99, 1046.5]
    notes.forEach((freq, i) => {
      if (!this.ctx) return
      const osc = this.ctx.createOscillator()
      const gain = this.ctx.createGain()
      osc.type = "sine"
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime + i * 0.04)

      gain.gain.setValueAtTime(0.08, this.ctx.currentTime + i * 0.04)
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.4)

      osc.connect(gain)
      gain.connect(this.ctx.destination)
      osc.start(this.ctx.currentTime + i * 0.04)
      osc.stop(this.ctx.currentTime + 0.4)
    })
  }

  public playAlertTone() {
    if (this.isMuted) return
    this.initContext()
    if (!this.ctx) return

    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()
    osc.type = "sawtooth"
    osc.frequency.setValueAtTime(220, this.ctx.currentTime)
    osc.frequency.setValueAtTime(180, this.ctx.currentTime + 0.08)

    gain.gain.setValueAtTime(0.08, this.ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.2)

    osc.connect(gain)
    gain.connect(this.ctx.destination)
    osc.start()
    osc.stop(this.ctx.currentTime + 0.2)
  }

  public playHarmonic528() {
    this.playAlignmentChime()
  }
}

export const soundEngine = new SystemAudioEngine()

/**
 * Enterprise Audio Toggle Control
 */
export function AudioToggle({ className = "" }: { className?: string }) {
  const [isMuted, setIsMuted] = useState(true)

  useEffect(() => {
    setIsMuted(soundEngine.getMuted())

    const handleToggle = (e: any) => {
      setIsMuted(e.detail.isMuted)
    }
    window.addEventListener("mw_audio_toggle", handleToggle)
    return () => window.removeEventListener("mw_audio_toggle", handleToggle)
  }, [])

  const handleToggleAudio = () => {
    const muted = soundEngine.toggleMute()
    setIsMuted(muted)
    if (!muted) {
      soundEngine.playAlignmentChime()
    }
  }

  return (
    <button
      onClick={handleToggleAudio}
      title={isMuted ? "Enable Audio (Press M)" : "Mute Audio (Press M)"}
      className={`group flex items-center gap-1.5 px-2.5 py-1 rounded-lg border font-mono text-[10px] transition-colors ${
        isMuted
          ? "border-border bg-card text-muted-foreground hover:text-foreground"
          : "border-primary/40 bg-primary/10 text-primary shadow-sm"
      } ${className}`}
    >
      {isMuted ? (
        <VolumeX className="h-3.5 w-3.5" />
      ) : (
        <Volume2 className="h-3.5 w-3.5 text-primary" />
      )}
      <span className="hidden sm:inline">
        {isMuted ? "Audio: Off" : "Audio: On"}
      </span>
      <kbd className="hidden lg:inline text-[8px] bg-muted px-1 rounded text-muted-foreground">
        M
      </kbd>
    </button>
  )
}
