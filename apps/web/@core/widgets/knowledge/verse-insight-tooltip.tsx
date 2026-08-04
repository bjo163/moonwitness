"use client"

import React, { useState, useEffect } from "react"
import { useInsightStore } from "@core/store/insight-store"
import { Sparkles, Loader2 } from "lucide-react"

interface VerseInsightTooltipProps {
  verseKey: string
  arabicText?: string
  translation?: string
  children: React.ReactNode
}

export function VerseInsightTooltip({ verseKey, arabicText, translation, children }: VerseInsightTooltipProps) {
  const [showTooltip, setShowTooltip] = useState(false)
  const [insight, setInsight] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const { getInsight } = useInsightStore()

  useEffect(() => {
    let timeout: NodeJS.Timeout
    if (showTooltip && !insight && !loading) {
      setLoading(true)
      // Slight delay before fetching so we don't spam API on quick mouseovers
      timeout = setTimeout(async () => {
        const result = await getInsight(verseKey, arabicText || "", translation || "")
        setInsight(result)
        setLoading(false)
      }, 500)
    }
    return () => clearTimeout(timeout)
  }, [showTooltip, insight, loading, getInsight, verseKey, arabicText, translation])

  return (
    <div 
      className="relative inline-block group"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      {children}
      
      {showTooltip && (
        <div className="absolute z-50 left-1/2 -translate-x-1/2 bottom-full mb-2 w-72 md:w-96 rounded-xl border border-cyan-500/30 bg-space/95 p-4 shadow-[0_0_20px_rgba(0,240,255,0.15)] backdrop-blur-md animate-in fade-in slide-in-from-bottom-2">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="h-4 w-4 text-cyan-400" />
            <span className="font-sans text-[10px] font-black text-white uppercase tracking-widest">
              AI Insight Engine (MW-{verseKey})
            </span>
          </div>
          <div className="font-serif text-xs leading-relaxed text-cyan-50/90 italic border-l-2 border-cyan-500/50 pl-3">
            {loading ? (
              <span className="flex items-center gap-2 text-cyan-400">
                <Loader2 className="h-3 w-3 animate-spin" />
                Synthesizing Divine Knowledge...
              </span>
            ) : insight ? (
              `"${insight}"`
            ) : (
              "Waiting for uplink..."
            )}
          </div>
        </div>
      )}
    </div>
  )
}
