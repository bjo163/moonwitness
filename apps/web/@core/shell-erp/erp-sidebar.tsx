"use client"

import React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ShieldCheck, LayoutDashboard, BarChart3, Users, BookOpen, LogOut, Target, Telescope, Clock, Network, Brain, FolderKanban, CheckSquare, Globe, FlaskConical, Activity } from "lucide-react"
import { ERP_QUICK_LAUNCH } from "@modules/erp"
import { buildNavigation } from "@modules/index"

const getIcon = (iconName?: string) => {
  const props = { className: "h-5 w-5" }
  switch (iconName) {
    case "LayoutDashboard": return <LayoutDashboard {...props} />
    case "Target": return <Target {...props} />
    case "Telescope": return <Telescope {...props} />
    case "Clock": return <Clock {...props} />
    case "Network": return <Network {...props} />
    case "Brain": return <Brain {...props} />
    case "FolderKanban": return <FolderKanban {...props} />
    case "CheckSquare": return <CheckSquare {...props} />
    case "BarChart3": return <BarChart3 {...props} />
    case "Users": return <Users {...props} />
    case "Globe": return <Globe {...props} />
    case "FlaskConical": return <FlaskConical {...props} />
    case "BookOpen": return <BookOpen {...props} />
    default: return <LayoutDashboard {...props} />
  }
}

export function ErpSidebar() {
  const pathname = usePathname()

  const handleLogout = () => {
    localStorage.removeItem("mw_user_profile")
    window.dispatchEvent(new Event("storage"))
    window.location.href = "/auth/login"
  }

  return (
    <aside className="fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-cyan-500/20 bg-black/80 backdrop-blur-xl">
      {/* Brand Header */}
      <div className="flex h-20 items-center gap-3 border-b border-cyan-500/20 px-6">
        <ShieldCheck className="h-8 w-8 text-knowledge drop-shadow-[0_0_10px_rgba(217,70,239,0.5)]" />
        <div className="flex flex-col">
          <span className="font-sans text-sm font-black tracking-widest text-knowledge">ERP CORE</span>
          <span className="font-mono text-[9px] text-primary/60">SYS-VER 1.0</span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto scrollbar-hide">
        <div className="px-4 py-4">
          <p className="mb-2 px-2 font-mono text-[10px] tracking-[0.2em] text-primary/50 uppercase">Navigation</p>
          <ul className="space-y-1">
            {buildNavigation("ERP_SIDEBAR").map((item) => {
              const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`)
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2.5 font-mono text-xs transition-colors ${
                      isActive
                        ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shadow-[0_0_15px_rgba(34,211,238,0.1)]"
                        : "text-primary/70 hover:bg-black/40 hover:text-white"
                    }`}
                  >
                    {getIcon(item.icon)}
                    {item.label}
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>

        <div className="px-4 py-2">
          <p className="mb-2 px-2 font-mono text-[10px] tracking-[0.2em] text-primary/50 uppercase">Quick Launch</p>
          <ul className="space-y-1">
            {ERP_QUICK_LAUNCH.map((item) => {
              const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`)
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2.5 font-mono text-xs transition-colors ${
                      isActive
                        ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"
                        : "text-primary/70 hover:bg-black/40 hover:text-white"
                    }`}
                  >
                    {getIcon(item.icon)}
                    {item.label}
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>

        {/* System Status Widget */}
        <div className="px-4 py-4">
          <p className="mb-2 px-2 font-mono text-[10px] tracking-[0.2em] text-primary/50 uppercase">System Status</p>
          <div className="rounded-lg border border-cyan-500/20 bg-black/40 p-4">
            <div className="mb-2 flex items-center justify-center">
              <Activity className="h-8 w-8 text-cyan-400 animate-pulse" />
            </div>
            <p className="text-center font-mono text-[10px] text-primary/70">All Systems Operational</p>
            <div className="mt-2 flex items-center justify-between font-mono text-[9px] text-cyan-400/70">
              <span>Uptime: 13d 21h 43m</span>
              <span>100%</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Footer / System Action */}
      <div className="border-t border-cyan-500/20 p-4">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-4 py-3 font-mono text-xs text-red-400 transition-colors hover:bg-red-500/10"
        >
          <LogOut className="h-5 w-5" />
          SYSTEM LOGOUT
        </button>
      </div>
    </aside>
  )
}
