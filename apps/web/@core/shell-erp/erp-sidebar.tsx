"use client"

import React, { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useMoonStore } from "@core/store/moon-store"
import {
  ShieldCheck,
  LayoutDashboard,
  BarChart3,
  Users,
  BookOpen,
  LogOut,
  Target,
  Telescope,
  Clock,
  Network,
  Brain,
  FolderKanban,
  CheckSquare,
  Globe,
  Settings,
  Bell,
  CreditCard,
  User,
  FlaskConical,
  Activity,
  Scale,
  Crosshair,
  ScrollText,
  Database,
  ChevronDown,
  ChevronRight,
} from "lucide-react"
import type { NavLinkConfig } from "@workspace/types"

function getIcon(name?: string) {
  const props = { className: "w-4 h-4 shrink-0" }
  switch (name) {
    case "LayoutDashboard":
      return <LayoutDashboard {...props} />
    case "Target":
      return <Target {...props} />
    case "Telescope":
      return <Telescope {...props} />
    case "BookOpen":
      return <BookOpen {...props} />
    case "ScrollText":
      return <ScrollText {...props} />
    case "Clock":
      return <Clock {...props} />
    case "Network":
      return <Network {...props} />
    case "Brain":
      return <Brain {...props} />
    case "FolderKanban":
      return <FolderKanban {...props} />
    case "CheckSquare":
      return <CheckSquare {...props} />
    case "BarChart3":
      return <BarChart3 {...props} />
    case "Users":
      return <Users {...props} />
    case "Globe":
      return <Globe {...props} />
    case "FlaskConical":
      return <FlaskConical {...props} />
    case "Activity":
      return <Activity {...props} />
    case "Settings":
      return <Settings {...props} />
    case "ShieldCheck":
      return <ShieldCheck {...props} />
    case "Bell":
      return <Bell {...props} />
    case "CreditCard":
      return <CreditCard {...props} />
    case "User":
      return <User {...props} />
    case "Scale":
      return <Scale {...props} />
    case "Crosshair":
      return <Crosshair {...props} />
    case "Database":
      return <Database {...props} />
    default:
      return <LayoutDashboard {...props} />
  }
}

export function ErpSidebar({ erpModules }: { erpModules: NavLinkConfig[] }) {
  const pathname = usePathname()
  const { logout } = useMoonStore()
  const [expandedModules, setExpandedModules] = useState<
    Record<string, boolean>
  >({})

  const handleLogout = () => {
    logout()
    window.location.href = "/auth/login"
  }

  // ── Dynamic nav from module registry — reads ALL ERP_SIDEBAR modules ──
  const toggleModule = (label: string) => {
    setExpandedModules((prev) => ({ ...prev, [label]: !prev[label] }))
  }

  return (
    <aside className="fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-cyan-500/20 bg-black/80 backdrop-blur-xl">
      {/* Brand Header */}
      <div className="flex h-20 items-center gap-3 border-b border-cyan-500/20 px-6">
        <ShieldCheck className="text-knowledge h-8 w-8 drop-shadow-[0_0_10px_rgba(217,70,239,0.5)]" />
        <div className="flex flex-col">
          <span className="text-knowledge font-sans text-sm font-black tracking-widest">
            ERP CORE
          </span>
          <span className="font-mono text-[9px] text-primary/60">
            SYS-VER 1.0
          </span>
        </div>
      </div>

      {/* Navigation from module registry */}
      <nav className="scrollbar-hide flex-1 overflow-y-auto">
        <div className="px-4 py-4">
          <p className="mb-2 px-2 font-sans text-[10px] font-bold tracking-widest text-cyan-500/70 uppercase">
            Modules
          </p>
          <ul className="space-y-0.5">
            {erpModules.map((mod) => {
              const isExpanded = expandedModules[mod.label] ?? true
              const hasSubLinks = mod.subLinks && mod.subLinks.length > 1
              const modBase = "/" + mod.href.split("/").filter(Boolean)[0]
              const isModActive = pathname?.startsWith(modBase)

              return (
                <li key={mod.href}>
                  {hasSubLinks ? (
                    <>
                      <button
                        onClick={() => toggleModule(mod.label)}
                        className={`flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2 font-sans text-xs transition-colors ${
                          isModActive
                            ? "bg-cyan-500/10 text-cyan-400"
                            : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          {getIcon(mod.icon)}
                          <span className="text-[10px] font-semibold tracking-wider uppercase">
                            {mod.label}
                          </span>
                        </span>
                        {isExpanded ? (
                          <ChevronDown className="h-3 w-3 opacity-50" />
                        ) : (
                          <ChevronRight className="h-3 w-3 opacity-50" />
                        )}
                      </button>
                      {isExpanded && (
                        <ul className="mt-0.5 ml-4 space-y-0.5 border-l border-cyan-500/10 pl-3">
                          {mod.subLinks?.map((sub) => {
                            const isActive =
                              pathname === sub.href ||
                              pathname?.startsWith(`${sub.href}/`)
                            return (
                              <li key={sub.href}>
                                <Link
                                  href={sub.href}
                                  className={`flex items-center gap-2 rounded-md px-2 py-1.5 font-sans text-xs transition-colors ${
                                    isActive
                                      ? "bg-cyan-500/10 text-cyan-400"
                                      : "text-slate-500 hover:bg-white/5 hover:text-slate-300"
                                  }`}
                                >
                                  {getIcon(sub.icon)}
                                  {sub.label}
                                </Link>
                              </li>
                            )
                          })}
                        </ul>
                      )}
                    </>
                  ) : (
                    <Link
                      href={mod.href}
                      className={`flex items-center gap-2 rounded-lg px-3 py-2 font-sans text-xs transition-colors ${
                        pathname === mod.href || pathname?.startsWith(mod.href)
                          ? "bg-cyan-500/10 text-cyan-400"
                          : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
                      }`}
                    >
                      {getIcon(mod.icon)}
                      {mod.label}
                    </Link>
                  )}
                </li>
              )
            })}
          </ul>
        </div>

        {/* Account section — static */}
        <div className="px-4 py-2">
          <p className="mb-2 px-2 font-sans text-[10px] font-bold tracking-widest text-cyan-500/70 uppercase">
            Account
          </p>
          <ul className="space-y-1">
            {[
              { label: "My Profile", href: "/erp/profile", icon: "User" },
              { label: "Settings", href: "/erp/settings", icon: "Settings" },
              {
                label: "Security Center",
                href: "/erp/security",
                icon: "ShieldCheck",
              },
              {
                label: "Notifications",
                href: "/erp/notifications",
                icon: "Bell",
              },
              { label: "Organizations", href: "/erp/orgs", icon: "Users" },
              { label: "Billing", href: "/erp/billing", icon: "CreditCard" },
            ].map((item) => {
              const isActive =
                pathname === item.href || pathname?.startsWith(`${item.href}/`)
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2 font-sans text-xs transition-colors ${
                      isActive
                        ? "border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.1)]"
                        : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
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
      </nav>

      {/* System Status Footer */}
      <div className="mt-auto border-t border-cyan-500/20 bg-black/40 p-4">
        <p className="mb-2 font-sans text-[10px] font-bold tracking-widest text-cyan-500/70 uppercase">
          System Status
        </p>
        <div className="flex items-center gap-3">
          <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-cyan-500/30 bg-cyan-500/10">
            <Target className="h-5 w-5 text-cyan-400 opacity-50" />
            <div className="absolute inset-0 animate-[spin_4s_linear_infinite] rounded-full border border-cyan-400 border-t-transparent" />
            <div className="absolute inset-1 animate-[spin_3s_linear_infinite_reverse] rounded-full border border-cyan-500/50 border-b-transparent" />
          </div>
          <div className="flex flex-col">
            <span className="font-sans text-xs font-semibold text-emerald-400">
              All Systems Operational
            </span>
            <span className="font-mono text-[9px] text-slate-500">
              Uptime: 134d 21h 43m
            </span>
          </div>
        </div>
        <button className="mt-3 flex w-full items-center justify-center gap-2 rounded-md border border-cyan-500/30 px-3 py-1.5 font-sans text-[10px] text-cyan-400 transition-colors hover:bg-cyan-500/10">
          View System Health &rarr;
        </button>
      </div>

      <div className="border-t border-cyan-500/20 p-4">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 font-sans text-xs text-red-400 transition-colors hover:bg-red-500/10 hover:text-red-300"
        >
          <LogOut className="h-4 w-4" />
          Disconnect
        </button>
      </div>
    </aside>
  )
}
