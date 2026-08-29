"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronDown, ChevronRight, LogOut, ShieldCheck, X } from "lucide-react"
import { useState } from "react"
import { navigationItems, utilityItems } from "../navigation/navigation-items"

function active(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`)
}

export function CommandCenterSidebar({ onLogout, open, onClose }: { onLogout: () => void; open: boolean; onClose: () => void }) {
  const pathname = usePathname()
  const [expanded, setExpanded] = useState<Record<string, boolean>>({})

  return (
    <>
      {open && <button aria-label="Close navigation" className="fixed inset-0 z-40 bg-slate-950/40 lg:hidden" onClick={onClose} />}
      <aside className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-slate-200 bg-white transition-transform lg:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex h-16 items-center justify-between border-b border-slate-200 px-5">
          <Link href="/dashboard" className="flex items-center gap-3" onClick={onClose}>
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900 text-white"><ShieldCheck className="h-5 w-5" /></span>
            <span><span className="block text-sm font-semibold text-slate-900">MoonWitness</span><span className="block text-xs text-slate-500">Command Center</span></span>
          </Link>
          <button className="rounded-md p-2 text-slate-500 hover:bg-slate-100 lg:hidden" aria-label="Close navigation" onClick={onClose}><X className="h-4 w-4" /></button>
        </div>
        <nav className="flex-1 overflow-y-auto px-3 py-5" aria-label="Primary navigation">
          <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wide text-slate-400">Workspace</p>
          <ul className="space-y-1">
            {navigationItems.map((item) => {
              const isActive = active(pathname, item.href)
              const isOpen = expanded[item.label] ?? isActive
              return <li key={item.href}>
                <div className={`flex items-center rounded-md ${isActive ? "bg-slate-100" : "hover:bg-slate-50"}`}>
                  <Link href={item.href} onClick={onClose} className={`flex min-w-0 flex-1 items-center gap-3 px-3 py-2 text-sm ${isActive ? "font-medium text-slate-900" : "text-slate-600"}`}><item.icon className="h-4 w-4 shrink-0" />{item.label}</Link>
                  {item.children && <button aria-label={`${isOpen ? "Collapse" : "Expand"} ${item.label}`} onClick={() => setExpanded((current) => ({ ...current, [item.label]: !isOpen }))} className="p-2 text-slate-400 hover:text-slate-700">{isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}</button>}
                </div>
                {item.children && isOpen && <ul className="ml-5 border-l border-slate-200 pl-3 pt-1">{item.children.map((sub) => <li key={sub.href}><Link href={sub.href} onClick={onClose} className={`flex items-center gap-2 rounded-md px-3 py-1.5 text-sm ${active(pathname, sub.href) ? "font-medium text-slate-900" : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"}`}><sub.icon className="h-3.5 w-3.5" />{sub.label}</Link></li>)}</ul>}
              </li>
            })}
          </ul>
          <p className="px-3 pb-2 pt-7 text-[11px] font-semibold uppercase tracking-wide text-slate-400">Utilities</p>
          <ul className="space-y-1">{utilityItems.map((item) => <li key={item.href}><Link href={item.href} onClick={onClose} className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900"><item.icon className="h-4 w-4" />{item.label}</Link></li>)}</ul>
        </nav>
        <div className="border-t border-slate-200 p-4"><div className="mb-3 flex items-center gap-3 rounded-lg bg-slate-50 p-3"><span className="h-2 w-2 rounded-full bg-emerald-500" /><div><p className="text-xs font-medium text-slate-800">All systems operational</p><p className="text-[11px] text-slate-500">Command Center online</p></div></div><button onClick={onLogout} className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-slate-600 hover:bg-red-50 hover:text-red-700"><LogOut className="h-4 w-4" />Sign out</button></div>
      </aside>
    </>
  )
}
