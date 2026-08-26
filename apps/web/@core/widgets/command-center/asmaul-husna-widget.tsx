"use client"

import React, { useEffect, useState } from "react"
import { Sparkles, Loader2, Volume2 } from "lucide-react"
import { internalApi } from "@core/api/internal-api"

type AsmaulHusna = {
  number: number
  name: string
  transliteration: string
  translation: string
}

export function AsmaulHusnaWidget() {
  const [data, setData] = useState<AsmaulHusna[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchNames() {
      try {
        const json = await internalApi<{ names: AsmaulHusna[] }>(
          "/api/witness/asmaul-husna"
        )
        if (json.names && json.names.length > 0) {
          setData(json.names)
          // Pick a random one for today based on day of year, or just random
          const dayOfYear = Math.floor(
            (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) /
              1000 /
              60 /
              60 /
              24
          )
          setCurrentIndex(dayOfYear % json.names.length)
        }
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchNames()
  }, [])

  if (loading) {
    return (
      <div className="bg-space/60 flex min-h-[120px] items-center justify-center rounded-2xl border border-blue-500/20 p-5">
        <Loader2 className="h-6 w-6 animate-spin text-blue-400" />
      </div>
    )
  }

  if (data.length === 0) return null

  const current = data[currentIndex]
  if (!current) return null

  return (
    <div className="bg-space/60 group relative overflow-hidden rounded-2xl border border-blue-500/20 p-5 backdrop-blur-xl">
      {/* Background decoration */}
      <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-blue-500/10 blur-2xl"></div>

      <div className="relative z-10 mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-blue-400" />
          <h3 className="font-sans text-[10px] font-bold tracking-wider text-blue-400 uppercase">
            Divine Attributes
          </h3>
        </div>
        <div className="font-mono text-[9px] text-primary/50">
          {current.number} / 99
        </div>
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center py-2 text-center">
        <div className="mb-1 font-serif text-3xl text-white drop-shadow-[0_0_10px_rgba(59,130,246,0.6)]">
          {current.name}
        </div>
        <div className="mb-1 font-mono text-sm font-bold tracking-widest text-blue-300 uppercase">
          {current.transliteration}
        </div>
        <div className="font-sans text-xs text-primary/80 italic">
          "{current.translation}"
        </div>
      </div>

      {/* Controls */}
      <div className="relative z-10 mt-2 flex justify-end opacity-0 transition-opacity group-hover:opacity-100">
        <button
          onClick={() => setCurrentIndex((prev) => (prev + 1) % data.length)}
          className="rounded bg-blue-500/20 px-2 py-1 text-[9px] font-bold tracking-widest text-blue-400 uppercase hover:text-white"
        >
          Next Name
        </button>
      </div>
    </div>
  )
}
