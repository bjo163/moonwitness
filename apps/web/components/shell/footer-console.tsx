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
    <footer className="z-50 w-full border-t border-border bg-cyber-panel text-sm text-muted-foreground">
      <div className="mx-auto flex max-w-[1700px] flex-col items-center justify-between gap-4 px-6 py-3 sm:flex-row sm:px-10">
        <div className="flex items-center gap-3">
          <ShieldCheck className="h-4 w-4 text-cyber-green" />
          <span>© 2026 MoonWitness OS — Global observation network</span>
        </div>

        <div className="flex items-center gap-6 font-medium">
          <span className="cursor-pointer transition-colors hover:text-cyber-cyan">
            Telemetry
          </span>
          <span className="cursor-pointer transition-colors hover:text-cyber-purple">
            Protocol
          </span>
          <span className="cursor-pointer transition-colors hover:text-foreground">
            Compact
          </span>
          <span className="cursor-pointer transition-colors hover:text-cyber-green">
            Khidra
          </span>
        </div>

        <div className="hidden font-mono text-xs text-cyber-cyan lg:block">
          {mounted ? currentTime : "00:00:00 WIB"}
        </div>
      </div>
    </footer>
  )
}
