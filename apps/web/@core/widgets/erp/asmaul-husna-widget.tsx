"use client"

import React, { useEffect, useState } from "react"
import { Sparkles, Loader2, Volume2 } from "lucide-react"

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
        const res = await fetch("/api/witness/asmaul-husna")
        if (res.ok) {
          const json = await res.json()
          if (json.names && json.names.length > 0) {
            setData(json.names)
            // Pick a random one for today based on day of year, or just random
            const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 1000 / 60 / 60 / 24)
            setCurrentIndex(dayOfYear % json.names.length)
          }
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
      <div className="bg-space/60 rounded-2xl border border-blue-500/20 p-5 flex items-center justify-center min-h-[120px]">
        <Loader2 className="h-6 w-6 text-blue-400 animate-spin" />
      </div>
    )
  }

  if (data.length === 0) return null

  const current = data[currentIndex]
  if (!current) return null

  return (
    <div className="bg-space/60 relative rounded-2xl border border-blue-500/20 p-5 backdrop-blur-xl overflow-hidden group">
      {/* Background decoration */}
      <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-blue-500/10 blur-2xl"></div>
      
      <div className="mb-2 flex items-center justify-between relative z-10">
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

      <div className="flex flex-col items-center justify-center text-center py-2 relative z-10">
        <div className="font-serif text-3xl text-white drop-shadow-[0_0_10px_rgba(59,130,246,0.6)] mb-1">
          {current.name}
        </div>
        <div className="font-mono text-sm font-bold text-blue-300 tracking-widest mb-1 uppercase">
          {current.transliteration}
        </div>
        <div className="font-sans text-xs text-primary/80 italic">
          "{current.translation}"
        </div>
      </div>
      
      {/* Controls */}
      <div className="mt-2 flex justify-end relative z-10 opacity-0 group-hover:opacity-100 transition-opacity">
        <button 
          onClick={() => setCurrentIndex((prev) => (prev + 1) % data.length)}
          className="text-[9px] text-blue-400 hover:text-white uppercase font-bold tracking-widest bg-blue-500/20 px-2 py-1 rounded"
        >
          Next Name
        </button>
      </div>
    </div>
  )
}
