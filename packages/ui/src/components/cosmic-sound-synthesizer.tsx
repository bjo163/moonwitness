"use client"

import React, { useState, useEffect, useCallback } from "react"
import { Volume2, VolumeX, Radio } from "lucide-react"

/**
 * Procedural Web Audio API Cosmic Synthesizer
 * Produces crisp sci-fi telemetry sound effects without any external asset dependencies
 */
class CosmicAudioEngine {
  private ctx: AudioContext | null = null
  private isMuted: boolean = false

  constructor() {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("mw_audio_muted")
      this.isMuted = saved === "true"
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
      localStorage.setItem("mw_audio_muted", String(this.isMuted))
      window.dispatchEvent(new CustomEvent("mw_audio_toggle", { detail: { isMuted: this.isMuted } }))
    }
    return this.isMuted
  }

  public getMuted(): boolean {
    return this.isMuted
  }

  public playTacticalClick() {
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

  public playAlignmentChime() {
    if (this.isMuted) return
    this.initContext()
    if (!this.ctx) return

    // 528Hz Solfeggio resonant frequency chord
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

    const notes = [523.25, 659.25, 783.99, 1046.5] // C5 Major chord
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

export const cosmicAudio = new CosmicAudioEngine()

/**
 * Floating HUD Audio Controls Button
 */
export function CosmicAudioToggle({ className = "" }: { className?: string }) {
  const [isMuted, setIsMuted] = useState(true)

  useEffect(() => {
    setIsMuted(cosmicAudio.getMuted())

    const handleToggle = (e: any) => {
      setIsMuted(e.detail.isMuted)
    }
    window.addEventListener("mw_audio_toggle", handleToggle)
    return () => window.removeEventListener("mw_audio_toggle", handleToggle)
  }, [])

  const handleToggleAudio = () => {
    const muted = cosmicAudio.toggleMute()
    setIsMuted(muted)
    if (!muted) {
      cosmicAudio.playAlignmentChime()
    }
  }

  return (
    <button
      onClick={handleToggleAudio}
      title={isMuted ? "Enable Cosmic Audio (Press M)" : "Mute Cosmic Audio (Press M)"}
      className={`group flex items-center gap-1.5 px-2.5 py-1 rounded-lg border font-mono text-[10px] transition-all ${
        isMuted
          ? "border-zinc-800 bg-black/60 text-zinc-500 hover:text-zinc-300"
          : "border-cyan-500/40 bg-cyan-950/40 text-cyan-300 shadow-[0_0_15px_rgba(0,240,255,0.25)]"
      } ${className}`}
    >
      {isMuted ? (
        <VolumeX className="h-3.5 w-3.5" />
      ) : (
        <Volume2 className="h-3.5 w-3.5 animate-pulse text-cyan-400" />
      )}
      <span className="hidden sm:inline">
        {isMuted ? "AUDIO: OFF" : "AUDIO: ACTIVE"}
      </span>
      <kbd className="hidden lg:inline text-[8px] bg-white/10 px-1 rounded text-zinc-400">
        M
      </kbd>
    </button>
  )
}