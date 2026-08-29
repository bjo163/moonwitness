"use client"

import React, { useState, useEffect } from "react"
import { useInsightStore } from "@workspace/state"
import { Sparkles, Loader2 } from "lucide-react"

interface VerseInsightTooltipProps {
  verseKey: string
  arabicText?: string
  translation?: string
  children: React.ReactNode
}

export function VerseInsightTooltip({
  verseKey,
  arabicText,
  translation,
  children,
}: VerseInsightTooltipProps) {
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
        const result = await getInsight(
          verseKey,
          arabicText || "",
          translation || ""
        )
        setInsight(result)
        setLoading(false)
      }, 500)
    }
    return () => clearTimeout(timeout)
  }, [
    showTooltip,
    insight,
    loading,
    getInsight,
    verseKey,
    arabicText,
    translation,
  ])

  return (
    <div
      className="group relative inline-block"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      {children}

      {showTooltip && (
        <div className="bg-background/95 absolute bottom-full left-1/2 z-50 mb-2 w-72 -translate-x-1/2 animate-in rounded-xl border border-border p-4 shadow-sm backdrop-blur-md fade-in slide-in-from-bottom-2 md:w-96">
          <div className="mb-2 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="font-sans text-[10px] font-black tracking-widest text-white uppercase">
              AI Insight Engine (MW-{verseKey})
            </span>
          </div>
          <div className="border-l-2 border-border pl-3 font-serif text-xs leading-relaxed text-primary/90 italic">
            {loading ? (
              <span className="flex items-center gap-2 text-primary">
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
