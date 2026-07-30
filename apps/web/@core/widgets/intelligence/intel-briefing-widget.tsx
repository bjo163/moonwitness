"use client"

import React, { useState, useRef } from "react"
import { Radio, Loader2, X, Download, Camera } from "lucide-react"
import { toPng } from "html-to-image"

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
      const dataUrl = await toPng(contentRef.current, { backgroundColor: '#000' })
      const a = document.createElement("a")
      a.href = dataUrl
      a.download = `khidra_snapshot_${new Date().toISOString().split('T')[0]}.png`
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
      const res = await fetch("/api/intel/briefing", { method: "POST" })
      if (!res.ok) throw new Error("Failed to generate briefing")
      const data = await res.json()
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
        className="bg-primary/10 border-primary/50 text-primary hover:bg-primary/20 flex w-full items-center justify-center gap-2 rounded-xl border-2 p-4 font-black tracking-widest uppercase shadow-[0_0_15px_rgba(0,240,255,0.2)] transition-all hover:scale-[1.02]"
      >
        <Radio className="h-5 w-5 animate-pulse" />
        GENERATE DAILY TRANSMISSION
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-space border-primary/50 relative flex h-[80vh] w-full max-w-4xl flex-col rounded-xl border-2 shadow-[0_0_50px_rgba(0,240,255,0.15)] overflow-hidden">
            
            {/* Header */}
            <div className="border-b border-white/10 bg-black/50 p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Radio className="h-5 w-5 text-primary animate-pulse" />
                <div>
                  <div className="text-primary text-xs font-black tracking-[0.2em]">KHIDRA INTELLIGENCE NETWORK</div>
                  <div className="text-white/50 text-[9px] uppercase tracking-widest mt-0.5">Eschatological Daily Briefing</div>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-white/50 hover:text-white transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto hide-scrollbar bg-black/90">
              <div ref={contentRef} className="p-6 font-mono min-h-full bg-black">
                {isLoading ? (
                  <div className="flex h-full flex-col items-center justify-center gap-4 text-primary pt-20">
                    <Loader2 className="h-8 w-8 animate-spin" />
                    <div className="text-xs font-bold tracking-widest uppercase animate-pulse text-center">
                      Aggregating Global Sensors...<br/>
                      <span className="text-white/50 text-[10px]">Processing Climate, Economy, & Seismic Data</span>
                    </div>
                  </div>
                ) : error ? (
                  <div className="text-red-500 flex flex-col items-center justify-center h-full text-sm font-bold tracking-widest text-center pt-20">
                    [SYSTEM MALFUNCTION]<br/>
                    {error}
                  </div>
                ) : (
                  <div className="text-white/90 text-[11px] leading-loose whitespace-pre-wrap prose prose-invert max-w-none">
                    {imageUrl && (
                      <div className="mb-6 rounded-lg overflow-hidden border-2 border-primary/30 shadow-[0_0_30px_rgba(0,240,255,0.2)]">
                        <img src={imageUrl} alt="Intel Briefing Infographic" className="w-full object-cover" />
                        <div className="bg-black/80 text-primary text-[8px] tracking-widest uppercase p-2 border-t border-primary/30 text-center">
                          KHIDRA GENERATED INFOGRAPHIC — SECURE CLEARANCE LEVEL 5
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
              <div className="border-t border-white/10 bg-black/50 p-4 flex justify-between items-center">
                <div className="text-success text-[10px] tracking-widest font-bold flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-success animate-pulse"/>
                  TRANSMISSION COMPLETE
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    className="flex items-center gap-2 border border-primary/30 text-primary px-3 py-1.5 rounded hover:bg-primary/10 text-[10px] tracking-widest font-bold transition-colors"
                    onClick={captureSnapshot}
                  >
                    <Camera className="h-3 w-3" /> CAPTURE INFOGRAPHIC
                  </button>
                  <button 
                    className="flex items-center gap-2 border border-primary/30 text-primary px-3 py-1.5 rounded hover:bg-primary/10 text-[10px] tracking-widest font-bold transition-colors"
                    onClick={() => {
                      const blob = new Blob([briefing], { type: "text/markdown" })
                      const url = URL.createObjectURL(blob)
                      const a = document.createElement("a")
                      a.href = url
                      a.download = `khidra_intel_${new Date().toISOString().split('T')[0]}.md`
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
