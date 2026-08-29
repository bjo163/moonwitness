"use client"

import { Bell, CheckCheck, Trash2 } from "lucide-react"
import { useNotificationStore } from "@workspace/state"
import { AccountPage } from "./account-view"

export function NotificationsView() {
  const { notifications, markAllAsRead, clearAll, markAsRead } = useNotificationStore()
  return <AccountPage title="Notifications" active="Notifications"><div className="mb-5 flex flex-wrap items-center justify-between gap-3"><p className="text-sm text-muted-foreground">{notifications.filter((item) => !item.read).length} unread signals</p><div className="flex gap-2"><button type="button" onClick={markAllAsRead} className="clip-btn flex items-center gap-2 border border-cyber-cyan/25 px-3 py-2 text-xs text-cyber-cyan hover:bg-cyber-cyan/10"><CheckCheck className="h-4 w-4" /> Mark read</button><button type="button" onClick={clearAll} className="clip-btn flex items-center gap-2 border border-cyber-pink/30 px-3 py-2 text-xs text-cyber-pink hover:bg-cyber-pink/10"><Trash2 className="h-4 w-4" /> Clear</button></div></div>{notifications.length === 0 ? <div className="flex items-center gap-3 border border-dashed border-cyber-cyan/25 p-6 text-sm text-muted-foreground"><Bell className="h-5 w-5 text-cyber-cyan" /> No notifications yet.</div> : <ul className="space-y-3">{notifications.map((item) => <li key={item.id} className={`border p-4 ${item.read ? "border-cyber-cyan/15 opacity-70" : "border-cyber-cyan/40 bg-cyber-cyan/5"}`}><button type="button" onClick={() => markAsRead(item.id)} className="w-full text-left"><p className="font-semibold text-foreground">{item.title}</p><p className="mt-1 text-sm text-muted-foreground">{item.message}</p></button></li>)}</ul>}</AccountPage>
}
