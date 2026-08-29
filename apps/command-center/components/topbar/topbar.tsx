"use client"

import { Bell, Database, Menu, Search, X } from "lucide-react"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { apiPost } from "@moon/client"

const titles: Record<string, string> = { "/dashboard": "Dashboard", "/users": "Users", "/hadiths": "Hadith archive", "/scriptures": "Scripture database", "/terminal": "Developer terminal", "/profile": "Profile" }

export function CommandCenterTopbar({ onMenu }: { onMenu: () => void }) {
  const pathname = usePathname()
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [seeding, setSeeding] = useState(false)
  const title = titles[pathname] ?? (pathname.split("/").filter(Boolean).pop()?.replaceAll("-", " ") ?? "Dashboard")

  async function seedDemoData() {
    if (!window.confirm("Initialize demo data across the command center?")) return
    setSeeding(true)
    try { await apiPost("/api/system/demo-seed", {}) } finally { setSeeding(false) }
  }

  return <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur sm:px-6">
    <div className="flex min-w-0 items-center gap-3"><button onClick={onMenu} aria-label="Open navigation" className="rounded-md p-2 text-slate-500 hover:bg-slate-100 lg:hidden"><Menu className="h-5 w-5" /></button><div><p className="text-xs font-medium uppercase tracking-wide text-slate-400">Operations</p><h1 className="truncate text-lg font-semibold capitalize text-slate-900">{title}</h1></div></div>
    <div className="flex items-center gap-2 sm:gap-3"><button className="hidden items-center gap-2 rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 md:flex" aria-label="Search"><Search className="h-4 w-4" />Search<span className="rounded border border-slate-200 px-1.5 text-[10px] text-slate-400">⌘K</span></button><button onClick={seedDemoData} disabled={seeding} className="hidden items-center gap-2 rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 disabled:opacity-50 sm:flex"><Database className="h-4 w-4" />{seeding ? "Seeding..." : "Seed demo"}</button><div className="relative"><button onClick={() => setNotificationsOpen((value) => !value)} aria-label="Notifications" className="relative rounded-md p-2 text-slate-500 hover:bg-slate-100"><Bell className="h-5 w-5" /><span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-blue-600" /></button>{notificationsOpen && <div className="absolute right-0 top-11 w-80 rounded-lg border border-slate-200 bg-white p-4 shadow-lg"><div className="mb-3 flex items-center justify-between"><p className="text-sm font-semibold text-slate-900">Notifications</p><button onClick={() => setNotificationsOpen(false)} aria-label="Close notifications"><X className="h-4 w-4 text-slate-400" /></button></div><p className="text-sm text-slate-600">Background workers are operating normally.</p></div>}</div><div className="hidden h-8 w-px bg-slate-200 sm:block" /><div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-xs font-semibold text-white" aria-label="Operator profile">OP</div></div>
  </header>
}
