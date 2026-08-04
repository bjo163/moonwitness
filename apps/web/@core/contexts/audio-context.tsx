"use client"

import React, { createContext, useContext, useState, useEffect, useRef } from "react"
import { Howl } from "howler"
import { useToast } from "./toast-provider"
import { useAchievementStore } from "@core/store/achievement-store"

type AudioContextState = {
  isPlaying: boolean
  currentSurah: { number: number; name: string }
  play: (surah: { number: number; name: string }) => void
  togglePlay: () => void
  volume: number
  setVolume: (val: number) => void
  playbackRate: number
  setPlaybackRate: (rate: number) => void
  isLooping: boolean
  toggleLoop: () => void
}

const AudioContext = createContext<AudioContextState | undefined>(undefined)

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentSurah, setCurrentSurah] = useState({
    number: 1,
    name: "Al-Fatihah",
  })
  const [volume, setVolume] = useState(0.5)
  const [playbackRate, setPlaybackRateState] = useState(1)
  const [isLooping, setIsLooping] = useState(false)
  const soundRef = useRef<Howl | null>(null)
  const { toast } = useToast()
  const unlockAchievement = useAchievementStore(s => s.unlockAchievement)

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (soundRef.current) {
        soundRef.current.unload()
      }
    }
  }, [])

  // Sync volume & rate & loop
  useEffect(() => {
    if (soundRef.current) {
      soundRef.current.volume(volume)
      soundRef.current.rate(playbackRate)
      soundRef.current.loop(isLooping)
    }
  }, [volume, playbackRate, isLooping])

  const setPlaybackRate = (rate: number) => {
    setPlaybackRateState(rate)
  }

  const toggleLoop = () => {
    setIsLooping(prev => !prev)
  }

  const play = (surah: { number: number; name: string }) => {
    setCurrentSurah(surah)
    setIsPlaying(true)
    
    // Unlock Explorer Achievement
    unlockAchievement("quran_explorer", toast)

    if (soundRef.current) {
      soundRef.current.unload()
    }

    const paddedNumber = String(surah.number).padStart(3, '0')
    const url = `https://everyayah.com/data/Alafasy_128kbps/${paddedNumber}001.mp3` // Only playing the first Ayah for demo

    soundRef.current = new Howl({
      src: [url],
      html5: true,
      volume,
      rate: playbackRate,
      loop: isLooping,
      onplay: () => setIsPlaying(true),
      onpause: () => setIsPlaying(false),
      onend: () => setIsPlaying(false),
      onloaderror: () => {
        setIsPlaying(false)
      },
      onplayerror: () => {
        setIsPlaying(false)
      }
    })

    soundRef.current.play()
  }

  const togglePlay = () => {
    if (soundRef.current) {
      if (isPlaying) {
        soundRef.current.pause()
      } else {
        soundRef.current.play()
      }
    } else {
      // If no sound loaded, load default
      play(currentSurah)
    }
  }

  return (
    <AudioContext.Provider
      value={{ 
        isPlaying, currentSurah, play, togglePlay, 
        volume, setVolume, 
        playbackRate, setPlaybackRate, 
        isLooping, toggleLoop 
      }}
    >
      {children}
    </AudioContext.Provider>
  )
}

export function useGlobalAudio() {
  const context = useContext(AudioContext)
  if (context === undefined) {
    throw new Error("useGlobalAudio must be used within an AudioProvider")
  }
  return context
}
