"use client"

import React from "react"
import { WifiOff, RefreshCw } from "lucide-react"
import { useOfflineStatus } from "../lib/offline-sync"

export function OfflineStatusIndicator() {
  const { isOnline, pendingCount } = useOfflineStatus()

  if (isOnline && pendingCount === 0) return null

  return (
    <div className="flex items-center gap-2 rounded border border-amber-500/40 bg-amber-950/40 px-2.5 py-1 text-xs font-mono text-amber-300 backdrop-blur-md animate-pulse">
      {isOnline ? (
        <>
          <RefreshCw className="h-3 w-3 animate-spin text-warning" />
          <span>RECONCILING {pendingCount} PENDING MUTATIONS</span>
        </>
      ) : (
        <>
          <WifiOff className="h-3 w-3 text-warning" />
          <span>OFFLINE BUFFER: {pendingCount} MUTATIONS QUEUED</span>
        </>
      )}
    </div>
  )
}
