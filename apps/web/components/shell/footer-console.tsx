"use client"
import { useMounted } from "@workspace/hooks"

import React, { useState, useEffect } from "react"
import { ShieldCheck } from "lucide-react"

export function OSFooterConsole() {
  const mounted = useMounted()
  const [currentTime, setCurrentTime] = useState("")

  useEffect(() => {
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
    <footer className="z-50 w-full border-t border-border bg-card text-sm text-muted-foreground">
      <div className="mx-auto flex max-w-[1700px] flex-col items-center justify-between gap-4 px-6 py-3 sm:flex-row sm:px-10">
        <div className="flex items-center gap-3">
          <ShieldCheck className="text-success h-4 w-4" />
          <span>© 2026 MoonWitness OS — Global observation network</span>
        </div>

        <div className="flex items-center gap-6 font-medium">
          <span className="cursor-pointer transition-colors hover:text-primary">
            Telemetry
          </span>
          <span className="hover:text-info cursor-pointer transition-colors">
            Protocol
          </span>
          <span className="cursor-pointer transition-colors hover:text-foreground">
            Compact
          </span>
          <span className="hover:text-success cursor-pointer transition-colors">
            Khidra
          </span>
        </div>

        <div className="hidden font-mono text-xs text-primary lg:block">
          {mounted ? currentTime : "00:00:00 WIB"}
        </div>
      </div>
    </footer>
  )
}
