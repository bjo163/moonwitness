"use client"
import { useMounted } from "@workspace/hooks"

import { useState, useEffect } from "react"
import { Bot, X, Sparkles, Database, Minimize2, Cpu } from "lucide-react"
import { PropheticAIChatTerminal } from "../components/chat"
import { createPortal } from "react-dom"
import { usePathname } from "next/navigation"

export function FlyingPropheticAIWidget() {
  const mounted = useMounted()
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  // Jika sedang berada langsung di halaman /diagnostik-hikmah (yang sudah fullscreen), kita sembunyikan widget terbangnya agar tidak duplikatif
  const isOnDedicatedPage = pathname === "/diagnostik-hikmah"

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

  if (!mounted || isOnDedicatedPage) return null

  return (
    <>
      {/* FLYING WIDGET PILL (Mengapung elegan di kanan bawah di atas HUD Taskbar) */}
      <div className="group fixed right-3 bottom-12 z-[8888] flex items-center gap-2 sm:right-6 sm:bottom-14">
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="group bg-space/95 hover:bg-space border-success/80 hover:border-success relative flex cursor-pointer items-center gap-2 rounded-full border-2 px-3.5 py-2 text-foreground shadow-[0_0_25px_rgba(0,255,102,0.45)] backdrop-blur-lg transition-all duration-300 hover:shadow-[0_0_35px_rgba(0,255,102,0.7)] active:scale-95 sm:px-4 sm:py-2.5"
          title="Open KHIDRA AI - Quranic Wisdom Terminal"
        >
          {/* Animasi Orb Glow & Pulse Dot */}
          <div className="bg-success/20 border-success/50 relative flex h-6 w-6 items-center justify-center rounded-full border transition-transform duration-300 group-hover:rotate-12 sm:h-7 sm:w-7">
            <Cpu className="text-success h-4 w-4 animate-pulse" />
            <span className="absolute -top-1 -right-1 flex h-2 w-2 sm:h-2.5 sm:w-2.5">
              <span className="bg-success absolute inline-flex h-full w-full animate-ping rounded-full opacity-75"></span>
              <span className="bg-success relative inline-flex h-2 w-2 rounded-full sm:h-2.5 sm:w-2.5"></span>
            </span>
          </div>

          {/* Label Teks Flying Pill */}
          <div className="flex flex-col pr-1 text-left font-mono">
            <span className="flex items-center gap-1 text-[11px] font-black tracking-wider text-foreground uppercase group-hover:text-white sm:text-xs">
              <span>KHIDRA AI</span>
              <Sparkles className="text-success hidden h-3 w-3 shrink-0 sm:inline" />
            </span>
            <span className="text-success -mt-0.5 text-[8px] font-bold tracking-widest uppercase opacity-90 sm:text-[9px]">
              // READY
            </span>
          </div>
        </button>
      </div>

      {/* FULL-SCREEN COMMAND OVERLAY PORTAL */}
      {isOpen &&
        createPortal(
          <div className="bg-space fixed inset-0 z-[999999] flex animate-in flex-col overflow-hidden font-mono text-foreground duration-200 zoom-in-95 fade-in">
            {/* Header Overlay yang Ringkas & Bersih */}
            <div className="bg-space border-success/40 z-10 flex h-11 shrink-0 items-center justify-between border-b px-3 shadow-[0_4px_25px_rgba(0,255,102,0.15)] sm:px-6">
              <div className="flex items-center gap-2.5">
                <div className="bg-success/20 border-success/60 flex h-6 w-6 items-center justify-center rounded-full border">
                  <Bot className="text-success h-3.5 w-3.5 animate-pulse" />
                </div>
                <span className="text-xs font-black tracking-wider text-foreground uppercase sm:text-sm">
                  KHIDRA AI{" "}
                  <span className="text-success">{/* WISDOM CORE */}</span>
                </span>
              </div>

              <div className="flex items-center gap-2 sm:gap-3">
                <div className="bg-success/10 border-success/30 text-success hidden items-center gap-1 rounded-sm border px-2.5 py-1 text-[10px] font-bold uppercase sm:flex">
                  <Database className="text-success h-3 w-3 animate-pulse" />
                  <span>SUPABASE ONLINE</span>
                </div>

                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="bg-success/20 hover:bg-success/40 border-success flex cursor-pointer items-center gap-1.5 rounded-sm border px-3 py-1.5 text-xs font-bold text-foreground uppercase shadow-[0_0_15px_rgba(0,255,102,0.3)] transition-all active:scale-95"
                  title="Minimize to Floating Orb [ESC]"
                >
                  <Minimize2 className="text-success h-4 w-4" />
                  <span>
                    MINIMIZE <span className="hidden sm:inline">[ESC]</span>
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="text-danger rounded-sm border border-red-500/50 bg-red-500/15 p-1.5 transition-colors hover:bg-red-500 hover:text-white"
                  title="Close Terminal"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Ruang Chat Full Workspace */}
            <div className="relative min-h-0 w-full flex-1 overflow-hidden">
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
