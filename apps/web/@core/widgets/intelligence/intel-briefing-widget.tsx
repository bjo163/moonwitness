"use client"

import React, { useState, useRef } from "react"
import { Radio, Loader2, X, Download, Camera } from "lucide-react"
import { toPng } from "html-to-image"
import { internalApi } from "@core/api/internal-api"

export function IntelBriefingWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [briefing, setBriefing] = useState("")
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const contentRef = useRef<HTMLDivElement>(null)

  const captureSnapshot = async () => {
    if (!contentRef.current) return
    try {
      const dataUrl = await toPng(contentRef.current, {
        backgroundColor: "#000",
      })
      const a = document.createElement("a")
      a.href = dataUrl
      a.download = `khidra_snapshot_${new Date().toISOString().split("T")[0]}.png`
      a.click()
    } catch (err) {
      console.error("Failed to capture snapshot:", err)
    }
  }

  const generateBriefing = async () => {
    setIsOpen(true)
    setIsLoading(true)
    setError("")
    setBriefing("")
    setImageUrl(null)

    try {
      const data = await internalApi<any>("/api/intel/briefing", {
        method: "POST",
      })
      setBriefing(data.briefing)
      if (data.imageUrl) setImageUrl(data.imageUrl)
    } catch (e: any) {
      setError(e.message || "Failed to establish connection to Khidra.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <button
        onClick={generateBriefing}
        className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-primary/50 bg-primary/10 p-4 font-black tracking-widest text-primary uppercase shadow-[0_0_15px_rgba(0,240,255,0.2)] transition-all hover:scale-[1.02] hover:bg-primary/20"
      >
        <Radio className="h-5 w-5 animate-pulse" />
        GENERATE DAILY TRANSMISSION
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="bg-space relative flex h-[80vh] w-full max-w-4xl flex-col overflow-hidden rounded-xl border-2 border-primary/50 shadow-[0_0_50px_rgba(0,240,255,0.15)]">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 bg-black/50 p-4">
              <div className="flex items-center gap-3">
                <Radio className="h-5 w-5 animate-pulse text-primary" />
                <div>
                  <div className="text-xs font-black tracking-[0.2em] text-primary">
                    KHIDRA INTELLIGENCE NETWORK
                  </div>
                  <div className="mt-0.5 text-[9px] tracking-widest text-white/50 uppercase">
                    Eschatological Daily Briefing
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white/50 transition-colors hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Content */}
            <div className="hide-scrollbar flex-1 overflow-y-auto bg-black/90">
              <div
                ref={contentRef}
                className="min-h-full bg-black p-6 font-mono"
              >
                {isLoading ? (
                  <div className="flex h-full flex-col items-center justify-center gap-4 pt-20 text-primary">
                    <Loader2 className="h-8 w-8 animate-spin" />
                    <div className="animate-pulse text-center text-xs font-bold tracking-widest uppercase">
                      Aggregating Global Sensors...
                      <br />
                      <span className="text-[10px] text-white/50">
                        Processing Climate, Economy, & Seismic Data
                      </span>
                    </div>
                  </div>
                ) : error ? (
                  <div className="flex h-full flex-col items-center justify-center pt-20 text-center text-sm font-bold tracking-widest text-red-500">
                    [SYSTEM MALFUNCTION]
                    <br />
                    {error}
                  </div>
                ) : (
                  <div className="prose prose-invert max-w-none text-[11px] leading-loose whitespace-pre-wrap text-white/90">
                    {imageUrl && (
                      <div className="mb-6 overflow-hidden rounded-lg border-2 border-primary/30 shadow-[0_0_30px_rgba(0,240,255,0.2)]">
                        <img
                          src={imageUrl}
                          alt="Intel Briefing Infographic"
                          className="w-full object-cover"
                        />
                        <div className="border-t border-primary/30 bg-black/80 p-2 text-center text-[8px] tracking-widest text-primary uppercase">
                          KHIDRA GENERATED INFOGRAPHIC — SECURE CLEARANCE LEVEL
                          5
                        </div>
                      </div>
                    )}
                    {briefing}
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            {!isLoading && briefing && (
              <div className="flex items-center justify-between border-t border-white/10 bg-black/50 p-4">
                <div className="text-success flex items-center gap-2 text-[10px] font-bold tracking-widest">
                  <div className="bg-success h-2 w-2 animate-pulse rounded-full" />
                  TRANSMISSION COMPLETE
                </div>
                <div className="flex items-center gap-2">
                  <button
                    className="flex items-center gap-2 rounded border border-primary/30 px-3 py-1.5 text-[10px] font-bold tracking-widest text-primary transition-colors hover:bg-primary/10"
                    onClick={captureSnapshot}
                  >
                    <Camera className="h-3 w-3" /> CAPTURE INFOGRAPHIC
                  </button>
                  <button
                    className="flex items-center gap-2 rounded border border-primary/30 px-3 py-1.5 text-[10px] font-bold tracking-widest text-primary transition-colors hover:bg-primary/10"
                    onClick={() => {
                      const blob = new Blob([briefing], {
                        type: "text/markdown",
                      })
                      const url = URL.createObjectURL(blob)
                      const a = document.createElement("a")
                      a.href = url
                      a.download = `khidra_intel_${new Date().toISOString().split("T")[0]}.md`
                      a.click()
                    }}
                  >
                    <Download className="h-3 w-3" /> EXPORT LOG
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
