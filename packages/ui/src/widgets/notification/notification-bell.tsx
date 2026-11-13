"use client"

import React, { useEffect, useRef, useState } from "react"
import { Bell, Check, Trash2 } from "lucide-react"
import { useNotificationStore } from "@workspace/state"
import Link from "next/link"

function getIconColor(type: string): string {
  switch (type) {
    case "success":
      return "bg-success/10 text-success"
    case "warning":
      return "bg-warning/10 text-warning"
    case "error":
      return "bg-destructive/10 text-destructive"
    case "prayer":
      return "bg-info/10 text-info"
    case "achievement":
      return "bg-warning/10 text-warning"
    default:
      return "bg-primary/10 text-primary"
  }
}

export function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const unreadCount = useNotificationStore((state) => state.getUnreadCount())
  const notifications = useNotificationStore((state) => state.notifications)
  const markAsRead = useNotificationStore((state) => state.markAsRead)
  const markAllAsRead = useNotificationStore((state) => state.markAllAsRead)
  const clearAll = useNotificationStore((state) => state.clearAll)
  const rootRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      if (
        rootRef.current &&
        !rootRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener("pointerdown", handlePointerDown)
    return () => document.removeEventListener("pointerdown", handlePointerDown)
  }, [])

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape" && isOpen) {
      event.preventDefault()
      setIsOpen(false)
      triggerRef.current?.focus()
    }
  }

  return (
    <div className="relative" ref={rootRef} onKeyDown={handleKeyDown}>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-label={
          unreadCount > 0
            ? `Notifications, ${unreadCount} unread`
            : "Notifications"
        }
        aria-expanded={isOpen}
        aria-controls="notification-panel"
        className="relative flex h-11 w-11 items-center justify-center rounded-full border border-border bg-card text-primary transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        <Bell aria-hidden="true" className="h-4 w-4" />
        {mounted && unreadCount > 0 && (
          <span
            aria-hidden="true"
            className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[8px] font-bold text-destructive-foreground shadow-sm"
          >
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      <div
        id="notification-panel"
        hidden={!isOpen}
        role="region"
        aria-labelledby="notification-panel-title"
        className="absolute top-full right-0 z-[100] mt-2 w-[min(24rem,calc(100vw-2rem))] overflow-hidden rounded-md border border-border bg-card shadow-sm"
      >
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <h2
            id="notification-panel-title"
            className="text-sm font-semibold text-foreground"
          >
            Notifications
          </h2>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={markAllAsRead}
              aria-label="Mark all notifications as read"
              className="flex h-11 w-11 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <Check aria-hidden="true" className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={clearAll}
              aria-label="Clear all notifications"
              className="flex h-11 w-11 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <Trash2 aria-hidden="true" className="h-4 w-4" />
            </button>
          </div>
        </div>

        <ul className="max-h-96 overflow-y-auto divide-y divide-border/50">
          {notifications.length === 0 ? (
            <li className="flex flex-col items-center justify-center gap-2 px-4 py-10 text-center text-muted-foreground">
              <Bell aria-hidden="true" className="h-7 w-7" />
              <p className="text-sm">No notifications.</p>
            </li>
          ) : (
            notifications.map((notification) => (
              <li key={notification.id} className="px-4 py-3">
                <div className="flex items-start gap-3">
                  <span
                    aria-hidden="true"
                    className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${getIconColor(notification.type)}`}
                  >
                    <Bell className="h-3.5 w-3.5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    {notification.read ? (
                      <NotificationContent
                        notification={notification}
                        mounted={mounted}
                      />
                    ) : (
                      <button
                        type="button"
                        onClick={() => markAsRead(notification.id)}
                        aria-label={`Mark ${notification.title} as read`}
                        className="min-h-11 w-full rounded-sm text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                      >
                        <NotificationContent
                          notification={notification}
                          mounted={mounted}
                        />
                      </button>
                    )}
                    {notification.actionUrl && (
                      <Link
                        href={notification.actionUrl}
                        className="mt-2 inline-flex min-h-11 items-center rounded-md border border-border px-3 text-sm text-primary transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                      >
                        {notification.actionLabel || "View"}
                      </Link>
                    )}
                  </div>
                  {!notification.read && (
                    <span className="sr-only">Unread</span>
                  )}
                </div>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  )
}

function NotificationContent({
  notification,
  mounted,
}: {
  notification: {
    title: string
    message: string
    timestamp: Date | number
  }
  mounted: boolean
}) {
  const timestamp = new Date(
    notification.timestamp instanceof Date
      ? notification.timestamp.getTime()
      : notification.timestamp
  )

  return (
    <>
      <div className="flex items-start justify-between gap-2">
        <span className="text-sm font-semibold text-foreground">
          {notification.title}
        </span>
        <time
          dateTime={timestamp.toISOString()}
          className="shrink-0 text-xs text-muted-foreground"
        >
          {mounted
            ? timestamp.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })
            : "—"}
        </time>
      </div>
      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
        {notification.message}
      </p>
    </>
  )
}
