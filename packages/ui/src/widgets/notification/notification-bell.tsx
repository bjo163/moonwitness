"use client"

import React, { useState, useRef, useEffect } from "react"
import { Bell, Check, Trash2, X } from "lucide-react"
import {
  useNotificationStore,
  NotificationItem,
} from "@workspace/state"
import Link from "next/link"

export function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false)
  const unreadCount = useNotificationStore((s) => s.getUnreadCount())
  const notifications = useNotificationStore((s) => s.notifications)
  const markAsRead = useNotificationStore((s) => s.markAsRead)
  const markAllAsRead = useNotificationStore((s) => s.markAllAsRead)
  const clearAll = useNotificationStore((s) => s.clearAll)
  const panelRef = useRef<HTMLDivElement>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        panelRef.current &&
        !panelRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const getIconColor = (type: string) => {
    switch (type) {
      case "success":
        return "text-emerald-400 bg-emerald-500/10"
      case "warning":
        return "text-amber-400 bg-amber-500/10"
      case "error":
        return "text-red-400 bg-red-500/10"
      case "prayer":
        return "text-fuchsia-400 bg-fuchsia-500/10"
      case "achievement":
        return "text-amber-300 bg-amber-500/20"
      default:
        return "text-cyan-400 bg-cyan-500/10"
    }
  }

  return (
    <div className="relative" ref={panelRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative flex h-9 w-9 items-center justify-center rounded-full border border-cyan-500/30 bg-black/40 text-cyan-400 transition-colors hover:border-cyan-400 hover:bg-cyan-950/50 hover:text-cyan-300"
      >
        <Bell className="h-4 w-4" />
        {mounted && unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[8px] font-bold text-white shadow-sm">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="bg-background/95 absolute top-full right-0 z-[100] mt-2 w-80 overflow-hidden rounded-xl border border-cyan-500/30 shadow-sm backdrop-blur-xl sm:w-96">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-cyan-500/20 bg-black/40 px-4 py-3">
            <h3 className="font-mono text-[10px] font-bold tracking-widest text-cyan-300 uppercase">
              System Notifications
            </h3>
            <div className="flex items-center gap-2">
              <button
                onClick={markAllAsRead}
                title="Mark all as read"
                className="rounded p-1 text-cyan-500 transition-colors hover:bg-cyan-500/10 hover:text-cyan-300"
              >
                <Check className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={clearAll}
                title="Clear all"
                className="rounded p-1 text-red-500 transition-colors hover:bg-red-500/10 hover:text-red-400"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-center opacity-50">
                <Bell className="mb-2 h-8 w-8 text-cyan-500" />
                <p className="font-mono text-xs text-cyan-400">
                  NO NEW TRANSMISSIONS
                </p>
              </div>
            ) : (
              <div className="flex flex-col divide-y divide-cyan-500/10">
                {notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className={`flex flex-col gap-2 px-4 py-3 transition-colors hover:bg-white/5 ${!notif.read ? "bg-cyan-500/5" : ""}`}
                    onClick={() => {
                      if (!notif.read) markAsRead(notif.id)
                    }}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${getIconColor(notif.type)}`}
                      >
                        <Bell className="h-3 w-3" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between">
                          <h4
                            className={`font-sans text-xs font-bold ${!notif.read ? "text-white" : "text-slate-300"}`}
                          >
                            {notif.title}
                          </h4>
                          <span className="ml-2 shrink-0 font-mono text-[9px] text-cyan-500/50">
                            {new Date(notif.timestamp).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                        <p
                          className={`mt-0.5 font-mono text-[10px] leading-relaxed ${!notif.read ? "text-cyan-100" : "text-slate-400"}`}
                        >
                          {notif.message}
                        </p>

                        {notif.actionUrl && (
                          <Link
                            href={notif.actionUrl}
                            className="mt-2 inline-block rounded border border-cyan-500/30 px-2 py-1 font-mono text-[9px] font-bold tracking-widest text-cyan-400 uppercase transition-colors hover:bg-cyan-500/20 hover:text-cyan-300"
                          >
                            {notif.actionLabel || "View Action"}
                          </Link>
                        )}
                      </div>
                      {!notif.read && (
                        <div className="shrink-0 pt-1">
                          <div className="h-2 w-2 rounded-full bg-cyan-400 shadow-sm" />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
