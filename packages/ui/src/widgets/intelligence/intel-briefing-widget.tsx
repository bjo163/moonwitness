"use client"

import React, { useState, useRef } from "react"
import { Radio, Loader2, X, Download, Camera } from "lucide-react"
import { toPng } from "html-to-image"
import { apiPost } from "@moon/client"

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
    } catch {
      // Ignore
    }
  }

  const generateBriefing = async () => {
    setIsOpen(true)
    setIsLoading(true)
    setError("")
    setBriefing("")
    setImageUrl(null)

    try {
      const data = await apiPost<any>("/api/intel/briefing", {})
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
        type="button"
        onClick={generateBriefing}
        className="flex w-full items-center justify-center gap-2 rounded-md border border-border bg-card p-4 text-sm font-semibold text-primary transition-colors hover:bg-muted"
      >
        <Radio className="h-5 w-5" />
        Generate daily briefing
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4">
          <div className="relative flex h-[80vh] w-full max-w-4xl flex-col overflow-hidden rounded-md border border-border bg-card">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border bg-card p-4">
              <div className="flex items-center gap-3">
                <Radio className="h-5 w-5 text-primary" />
                <div>
                  <div className="text-sm font-semibold text-foreground">
                    Khidra intelligence network
                  </div>
                  <div className="mt-0.5 text-xs text-muted-foreground">
                    Eschatological Daily Briefing
                  </div>
                </div>
              </div>
              <button
                type="button"
                aria-label="Close briefing"
                onClick={() => setIsOpen(false)}
                className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Content */}
            <div className="hide-scrollbar flex-1 overflow-y-auto bg-card/90">
              <div
                ref={contentRef}
                className="min-h-full bg-card p-6"
              >
                {isLoading ? (
                  <div className="flex h-full flex-col items-center justify-center gap-4 pt-20 text-primary">
                    <Loader2 className="h-8 w-8 animate-spin" />
                    <div className="text-center text-sm font-medium">
                      Preparing briefing…
                      <br />
                      <span className="text-xs text-muted-foreground">
                        Processing Climate, Economy, & Seismic Data
                      </span>
                    </div>
                  </div>
                ) : error ? (
                  <div className="flex h-full flex-col items-center justify-center pt-20 text-center text-sm font-medium text-destructive">
                    Unable to load briefing
                    <br />
                    {error}
                  </div>
                ) : (
                  <div className="prose max-w-prose text-base leading-relaxed whitespace-pre-wrap text-foreground">
                    {imageUrl && (
                      <div className="mb-6 overflow-hidden rounded-lg border-2 border-primary/30 shadow-sm">
                        <img
                          src={imageUrl}
                          alt="Intel Briefing Infographic"
                          className="w-full object-cover"
                        />
                        <div className="border-t border-border bg-muted/40 p-2 text-center text-xs text-muted-foreground">
                          Khidra-generated infographic
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
              <div className="flex items-center justify-between border-t border-border bg-card p-4">
                <div className="text-success flex items-center gap-2 text-sm font-medium">
                  <div className="bg-success h-2 w-2 rounded-full" />
                  Briefing ready
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    className="flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm font-medium text-primary transition-colors hover:bg-muted"
                    onClick={captureSnapshot}
                  >
                    <Camera className="h-3.5 w-3.5" /> Capture image
                  </button>
                  <button
                    type="button"
                    className="flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm font-medium text-primary transition-colors hover:bg-muted"
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
                    <Download className="h-3.5 w-3.5" /> Export markdown
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
