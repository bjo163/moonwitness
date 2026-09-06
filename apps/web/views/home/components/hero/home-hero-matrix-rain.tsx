"use client"

import React from "react"
import {
  HISTORY_EVENTS,
  TRAITS,
  AYAH_WORDS,
  PROPHETS,
  NAMES_OF_ALLAH,
} from "./home-hero-constants"

export const AudioWave = () => (
  <div className="flex items-center justify-center gap-1.5 opacity-80">
    <div className="h-4 w-1 animate-[audioWave_0.9s_ease-in-out_infinite] rounded-full bg-primary" />
    <div className="h-4 w-1 animate-[audioWave_1.2s_ease-in-out_infinite_0.2s] rounded-full bg-primary" />
    <div className="h-4 w-1 animate-[audioWave_0.8s_ease-in-out_infinite_0.4s] rounded-full bg-primary" />
    <div className="h-4 w-1 animate-[audioWave_1.1s_ease-in-out_infinite_0.1s] rounded-full bg-primary" />
    <div className="h-4 w-1 animate-[audioWave_1.3s_ease-in-out_infinite_0.3s] rounded-full bg-primary" />
  </div>
)

export const MatrixLayer = ({
  words,
  delay,
  colorClass,
  shadowColor,
  colCount,
  speedMult,
  sizeClasses,
}: {
  words: string[]
  delay: number
  colorClass: string
  shadowColor: string
  colCount: number
  speedMult: number
  sizeClasses: string[]
}) => {
  return (
    <div
      className="pointer-events-none absolute inset-0 opacity-0"
      style={{ animation: `fadeInReveal 3s ease-in ${delay}s forwards` }}
    >
      {Array.from({ length: colCount }).map((_, i) => {
        const isUp = i % 2 === 0
        const duration = (6 + Math.random() * 8) * speedMult
        const offsetDelay = Math.random() * 20
        const itemCount = 3 + Math.floor(Math.random() * 3)
        const randomGap = [16, 24, 32][Math.floor(Math.random() * 3)] || 24
        const shuffledWords = [...words].sort(() => Math.random() - 0.5)

        return (
          <div
            key={i}
            className={`absolute flex flex-col font-bold ${colorClass} opacity-70 will-change-transform ${
              isUp
                ? "animate-[matrixUp_var(--dur)_linear_infinite]"
                : "animate-[matrixDown_var(--dur)_linear_infinite]"
            }`}
            style={
              {
                left: `${(i / colCount) * 100}%`,
                gap: `${randomGap * 0.25}rem`,
                "--dur": `${duration}s`,
                animationDelay: `-${offsetDelay}s`,
                filter: `drop-shadow(0 0 8px ${shadowColor})`,
              } as React.CSSProperties
            }
          >
            {Array.from({ length: itemCount }).map((_, j) => {
              const randomSize =
                sizeClasses[Math.floor(Math.random() * sizeClasses.length)]
              return (
                <div
                  key={j}
                  className={randomSize}
                  style={{ opacity: 0.4 + Math.random() * 0.6 }}
                >
                  {shuffledWords[j % shuffledWords.length]}
                </div>
              )
            })}
          </div>
        )
      })}
    </div>
  )
}

export const DivineMatrixRain = ({ active }: { active: boolean }) => {
  if (!active) return null

  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      {/* Phase 0: History / Deja Vu (Starts at 0s, fast, mysterious indigo) */}
      <MatrixLayer
        words={HISTORY_EVENTS}
        delay={0}
        colorClass="text-indigo-900/40 font-mono tracking-tight"
        shadowColor="rgba(49, 46, 129, 0.2)"
        colCount={6}
        speedMult={0.8}
        sizeClasses={["text-lg", "text-xl"]}
      />

      {/* Phase 1: Good Traits (Starts at 3s, slow, purple) */}
      <MatrixLayer
        words={TRAITS}
        delay={3}
        colorClass="text-primary/50 font-sans tracking-widest"
        shadowColor="rgba(192, 132, 252, 0.5)"
        colCount={5}
        speedMult={1.5}
        sizeClasses={["text-xl", "text-2xl"]}
      />

      {/* Phase 2: Ayah Words (Starts at 6s, medium speed, ambienting cyan) */}
      <MatrixLayer
        words={AYAH_WORDS}
        delay={6}
        colorClass="text-primary/60 font-mono tracking-widest"
        shadowColor="rgba(34, 211, 238, 0.8)"
        colCount={6}
        speedMult={1.2}
        sizeClasses={["text-2xl", "text-3xl"]}
      />

      {/* Phase 3: Prophets (Starts at 10s, intense emerald) */}
      <MatrixLayer
        words={PROPHETS}
        delay={10}
        colorClass="text-success/80 font-arabic"
        shadowColor="rgba(52, 211, 153, 1)"
        colCount={8}
        speedMult={0.8}
        sizeClasses={["text-3xl", "text-4xl"]}
      />

      {/* Phase 4: Names of ALLAH - Absolute Climax (Starts at 15s) */}
      <MatrixLayer
        words={NAMES_OF_ALLAH}
        delay={15}
        colorClass="text-primary font-arabic"
        shadowColor="rgba(165, 243, 252, 1)"
        colCount={10}
        speedMult={0.5}
        sizeClasses={["text-4xl", "text-5xl", "text-6xl"]}
      />
    </div>
  )
}
