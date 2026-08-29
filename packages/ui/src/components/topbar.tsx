"use client"

import React, { useState } from "react"
import { Bell, Sparkles, Database, CheckCircle2, AlertTriangle, X } from "lucide-react"
import { usePathname } from "next/navigation"
import { Button } from "./button"
import { ThemeToggle } from "./theme-toggle"
import { apiPost } from "@moon/client"
import { APP_PORTS } from "@workspace/types"
import { cosmicAudio } from "./cosmic-sound-synthesizer"

const getApiBase = () => {
  if (typeof window !== "undefined" && process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL
  }
  return `http://127.0.0.1:${APP_PORTS.API_BACKEND}`
}

export type UserProfile = {
  name?: string
  email?: string
  title?: string
  role?: string
  avatarUrl?: string
}

export function Topbar({
  profile = { name: "Operator", role: "admin" },
  title,
  rightActions,
  onPublicClick,
}: {
  profile?: UserProfile
  title?: string
  rightActions?: React.ReactNode
  onPublicClick?: () => void
}) {
  const pathname = usePathname()
  const [seeding, setSeeding] = useState(false)
  const [seedResult, setSeedResult] = useState<string | null>(null)
  const [showNotifications, setShowNotifications] = useState(false)
  const [notifications] = useState([
    { id: 1, title: "Cron Loop Active", text: "Background runner polling every 30s", time: "Just now", type: "info" },
    { id: 2, title: "Worker Queue Standby", text: "CosmicWorker default pool online (5 slots)", time: "1m ago", type: "success" },
    { id: 3, title: "Ephemeris Synced", text: "Prayer azimuths recalculated", time: "5m ago", type: "info" },
  ])

  const pageTitle =
    title ||
    pathname?.split("/").pop()?.replace(/-/g, " ") ||
    "Dashboard"

  const handleSeedDemoData = async () => {
    if (!window.confirm("Initialize complete demo matrix across all 16 addon packages?")) return
    setSeeding(true)
    setSeedResult(null)
    try {
      const res = await apiPost<any>(`${getApiBase()}/api/system/demo-seed`, {})
      cosmicAudio.playHarmonic528()
      setSeedResult(res?.message || "Demo matrix seeded successfully!")
      setTimeout(() => {
        window.location.reload()
      }, 1500)
    } catch (e: any) {
      cosmicAudio.playAlertTone()
      setSeedResult(`Failed: ${e?.message || e}`)
    } finally {
      setSeeding(false)
    }
  }

  return (
    <header className="sticky top-0 z-40 flex h-20 w-full items-center justify-between border-b border-border bg-card/85 px-6 shadow-sm backdrop-blur-md">
      {/* Page Title */}
      <div className="flex items-center gap-4">
        <h2 className="font-sans text-lg font-bold tracking-wider text-foreground uppercase">
          {pageTitle}
        </h2>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-4 md:gap-6">
        {/* Seed Demo Button */}
        <button
          onClick={handleSeedDemoData}
          disabled={seeding}
          title="Seed all 16 addon demo datasets"
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/10 border border-amber-500/30 rounded-lg text-xs font-mono text-amber-600 dark:text-amber-400 hover:bg-amber-500/20 uppercase transition-all disabled:opacity-50"
        >
          <Database className="w-3.5 h-3.5" />
          {seeding ? "SEEDING..." : "SEED DEMO"}
        </button>

        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications((v) => !v)}
            className="p-2 text-muted-foreground hover:text-foreground border border-transparent hover:border-border rounded-full transition-all relative"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full animate-pulse" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-card border border-border rounded-xl shadow-2xl p-3 z-50 font-sans">
              <div className="flex items-center justify-between border-b border-border pb-2 mb-2">
                <span className="text-xs font-bold text-foreground uppercase tracking-wider">System Notifications</span>
                <button onClick={() => setShowNotifications(false)} className="text-muted-foreground hover:text-foreground">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {notifications.map((n) => (
                  <div key={n.id} className="p-2 bg-muted/40 border border-border/40 rounded-lg text-xs">
                    <div className="flex items-center justify-between text-[10px] text-primary font-medium">
                      <span>{n.title}</span>
                      <span className="text-muted-foreground">{n.time}</span>
                    </div>
                    <p className="text-muted-foreground text-[11px] mt-0.5">{n.text}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <ThemeToggle />

        {rightActions}

        {/* User Profile */}
        <div className="flex items-center gap-3 border-l border-border/50 pl-4 md:pl-6">
          <div className="hidden flex-col items-end sm:flex">
            <span className="font-sans text-sm font-bold text-foreground">
              {profile?.name || "User"}
            </span>
            <span className="font-mono text-[10px] text-primary">
              {profile?.title || profile?.role || "Administrator"}
            </span>
          </div>
          <div className="flex h-9 w-9 items-center justify-center rounded-full border border-primary/40 bg-primary/10 font-mono text-xs font-bold text-primary">
            {profile?.name ? profile.name.substring(0, 2).toUpperCase() : "US"}
          </div>
        </div>

        {onPublicClick && (
          <Button
            variant="outline"
            size="sm"
            className="hidden md:flex"
            onClick={onPublicClick}
          >
            Public Portal ↗
          </Button>
        )}
      </div>

      {seedResult && (
        <div className="fixed bottom-6 right-6 z-50 p-4 bg-card/95 border border-border rounded-xl shadow-2xl font-sans text-xs text-foreground flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-500" />
          <span>{seedResult}</span>
        </div>
      )}
    </header>
  )
}
