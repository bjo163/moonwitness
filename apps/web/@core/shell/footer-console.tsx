"use client"

import React, { useState, useEffect } from "react"
import { ShieldCheck } from "lucide-react"

export function OSFooterConsole() {
  const [mounted, setMounted] = useState(false)
  const [currentTime, setCurrentTime] = useState("")

  useEffect(() => {
    setTimeout(() => setMounted(true), 0)
    const tick = () => {
      setCurrentTime(
        new Date().toLocaleTimeString("id-ID", { timeZone: "Asia/Jakarta" }) +
          " WIB"
      )
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <footer className="z-50 w-full border-t border-white/10 bg-black/20 font-mono text-[10px] tracking-widest text-primary uppercase backdrop-blur-md">
      <div className="mx-auto flex max-w-[1700px] flex-col items-center justify-between gap-4 px-6 py-3 sm:flex-row sm:px-10">
        <div className="flex items-center gap-3">
          <ShieldCheck className="h-4 w-4 text-emerald-400" />
          <span>© 2026 MOONWITNESS OS — GLOBAL ESCHATOLOGY OBSERVATORY</span>
        </div>

        <div className="flex items-center gap-6 font-bold text-white/50">
          <span className="cursor-pointer transition-colors hover:text-cyan-400">
            [ TELEMETRY ]
          </span>
          <span className="cursor-pointer transition-colors hover:text-fuchsia-400">
            [ PROTOCOL ]
          </span>
          <span className="cursor-pointer transition-colors hover:text-white">
            [ COMPACT ]
          </span>
          <span className="cursor-pointer transition-colors hover:text-emerald-400">
            [ KHIDRA ]
          </span>
        </div>

        <div className="hidden font-bold text-cyan-300 lg:block">
          {mounted ? currentTime : "00:00:00 WIB"}
        </div>
      </div>
    </footer>
  )
}
