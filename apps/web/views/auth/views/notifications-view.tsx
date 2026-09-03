"use client"

import { Bell, CheckCheck, Trash2 } from "lucide-react"
import { useNotificationStore } from "@workspace/state"
import { AccountPage } from "./account-view"

export function NotificationsView() {
  const { notifications, markAllAsRead, clearAll, markAsRead } = useNotificationStore()
  return (
    <AccountPage title="Notifications" active="Notifications">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          {notifications.filter((item) => !item.read).length} unread notifications
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={markAllAsRead}
            className="rounded-md flex items-center gap-2 border border-border px-3 py-2 text-xs font-medium text-foreground hover:bg-accent"
          >
            <CheckCheck className="h-4 w-4 text-primary" /> Mark all read
          </button>
          <button
            type="button"
            onClick={clearAll}
            className="rounded-md flex items-center gap-2 border border-destructive/30 px-3 py-2 text-xs font-medium text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="h-4 w-4" /> Clear
          </button>
        </div>
      </div>

      {notifications.length === 0 ? (
        <div className="flex items-center gap-3 rounded-xl border border-dashed border-border p-6 text-sm text-muted-foreground">
          <Bell className="h-5 w-5 text-primary" /> No notifications yet.
        </div>
      ) : (
        <ul className="space-y-3">
          {notifications.map((item) => (
            <li
              key={item.id}
              className={`rounded-xl border p-4 transition-colors ${
                item.read
                  ? "border-border/60 bg-card/40 opacity-70"
                  : "border-primary/40 bg-primary/5 shadow-sm"
              }`}
            >
              <button
                type="button"
                onClick={() => markAsRead(item.id)}
                className="w-full text-left"
              >
                <p className="font-semibold text-foreground">{item.title}</p>
                <p className="mt-1 text-sm text-muted-foreground">{item.message}</p>
              </button>
            </li>
          ))}
        </ul>
      )}
    </AccountPage>
  )
}
