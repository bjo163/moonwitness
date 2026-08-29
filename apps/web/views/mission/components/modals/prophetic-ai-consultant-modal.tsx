"use client"

import { useState, useEffect } from "react"
import { Bot, X, Radio } from "lucide-react"
import { PropheticAIChatTerminal } from "@workspace/ui"
import { createPortal } from "react-dom"

export function PropheticAIConsultantModal() {
  const [mounted, setMounted] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    setTimeout(() => setMounted(true), 0)
  }, [])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false)
      }
    }
    if (isOpen) {
      document.body.style.overflow = "hidden"
      window.addEventListener("keydown", handleKeyDown)
    } else {
      document.body.style.overflow = "unset"
    }
    return () => {
      document.body.style.overflow = "unset"
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [isOpen])

  return (
    <>
      {/* Tombol Trigger Eksplisit yang Sangat Responsif dan Klikable */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation()
          setIsOpen(true)
        }}
        className="bg-success/20 hover:bg-success text-success border-success/60 relative z-20 mt-auto flex w-full cursor-pointer items-center justify-center gap-2 rounded-sm border px-3 py-2.5 text-xs font-bold tracking-wider uppercase shadow-sm transition-all duration-200 hover:text-white active:scale-95"
      >
        <Bot className="h-4 w-4" />
        <span>[ OPEN KHIDRA AI - FULLSCREEN OVERLAY ]</span>
      </button>

      {isOpen &&
        mounted &&
        createPortal(
          <div className="bg-background fixed inset-0 z-[999999] flex animate-in flex-col overflow-hidden font-mono text-foreground duration-150 zoom-in-95 fade-in">
            {/* Header Overlay */}
            <div className="bg-background border-success/40 z-10 flex h-10 shrink-0 items-center justify-between border-b px-3 sm:h-11 sm:px-6">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="text-success flex items-center gap-1.5 text-xs font-bold tracking-wider uppercase">
                  <Radio className="text-success h-3.5 w-3.5 shrink-0 animate-pulse" />
                  <span className="max-w-[180px] truncate sm:max-w-none">
                    KHIDRA AI // WISDOM CORE
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="text-danger flex cursor-pointer items-center gap-1 rounded-sm border border-red-500/50 bg-red-500/20 p-1.5 text-xs font-bold uppercase transition-colors hover:bg-red-500 hover:text-white sm:px-3 sm:py-1"
                >
                  <X className="h-4 w-4" />
                  <span className="hidden sm:inline">CLOSE [ESC]</span>
                </button>
              </div>
            </div>

            {/* Terminal Container */}
            <div className="relative min-h-0 w-full flex-1">
              <PropheticAIChatTerminal
                maxHeight="h-full"
                fullWorkspace={true}
              />
            </div>
          </div>,
          document.body
        )}
    </>
  )
}
