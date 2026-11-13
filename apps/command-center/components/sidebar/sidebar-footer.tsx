"use client"

import { LogOut } from "lucide-react"

interface CommandCenterSidebarFooterProps {
  onLogout: () => void
}

export function CommandCenterSidebarFooter({ onLogout }: CommandCenterSidebarFooterProps) {
  return (
    <div className="border-t border-border p-4">
      <button
        type="button"
        onClick={onLogout}
        className="flex min-h-11 w-full items-center gap-3 rounded-lg px-3 text-xs font-medium text-destructive transition-colors hover:bg-destructive/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <LogOut className="h-4 w-4" />
        <span>Sign out</span>
      </button>
    </div>
  )
}
