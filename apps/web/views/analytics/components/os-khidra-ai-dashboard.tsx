"use client"

import React, { useState, useEffect } from "react"
import { KhidraHeader } from "./khidra/khidra-header"
import { KhidraIdentitySidebar } from "./khidra/khidra-identity-sidebar"
import { KhidraHologramCanvas } from "./khidra/khidra-hologram-canvas"
import { KhidraTopicsRow } from "./khidra/khidra-topics-row"
import { KhidraConversationSidebar } from "./khidra/khidra-conversation-sidebar"
import { KhidraBottomPanels } from "./khidra/khidra-bottom-panels"

/**
 * ◈ OS Khidra AI Dashboard (Blueprint 10)
 *
 * Modular AI knowledge companion dashboard composing focused conversational and capability widgets.
 */
export function OSKhidraAiDashboard() {
  const [clockWIB, setClockWIB] = useState("06:50:16 WIB")

  useEffect(() => {
    const tick = () => {
      const now = new Date()
      setClockWIB(
        now.toLocaleTimeString("en-US", {
          hour12: false,
          timeZone: "Asia/Jakarta",
        }) + " WIB"
      )
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <section
      id="khidra"
      className="bg-background relative z-10 overflow-hidden border-b border-success/30 py-20 font-mono text-foreground"
    >
      <div className="relative z-10 mx-auto max-w-7xl space-y-6 px-6 sm:px-10">
        {/* Layer 1: Top Header */}
        <KhidraHeader clockWIB={clockWIB} />

        {/* Layer 2: Three-Column Main Layout */}
        <div className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-12">
          {/* Left: Identity Sidebar */}
          <KhidraIdentitySidebar />

          {/* Center: Hologram Canvas & Topics Row */}
          <div className="flex flex-col gap-6 lg:col-span-5">
            <KhidraHologramCanvas />
            <KhidraTopicsRow />
          </div>

          {/* Right: Conversation Window */}
          <KhidraConversationSidebar />
        </div>

        {/* Layer 3: Bottom Panels & Footer */}
        <KhidraBottomPanels />
      </div>
    </section>
  )
}
