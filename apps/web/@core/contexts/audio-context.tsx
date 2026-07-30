"use client"

import React, { createContext, useContext, useState } from "react"

type AudioContextState = {
  isPlaying: boolean
  currentSurah: { number: number; name: string }
  play: (surah: { number: number; name: string }) => void
  togglePlay: () => void
}

const AudioContext = createContext<AudioContextState | undefined>(undefined)

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentSurah, setCurrentSurah] = useState({
    number: 1,
    name: "Al-Fatihah",
  })

  const play = (surah: { number: number; name: string }) => {
    setCurrentSurah(surah)
    setIsPlaying(true)
  }

  const togglePlay = () => {
    setIsPlaying((prev) => !prev)
  }

  return (
    <AudioContext.Provider
      value={{ isPlaying, currentSurah, play, togglePlay }}
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
