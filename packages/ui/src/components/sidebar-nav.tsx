"use client"

import React, { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
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
  Terminal,
  Ticket,
  Handshake,
  Package,
  Warehouse,
  BookText,
  Map,
} from "lucide-react"
import { APP_PORTS } from "@workspace/types"

export type SidebarItem = {
  label: string
  href: string
  icon?: string
  subLinks?: Array<{ label: string; href: string; icon?: string }>
}

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
    case "Terminal":
      return <Terminal {...props} />
    case "Ticket":
      return <Ticket {...props} />
    case "Handshake":
      return <Handshake {...props} />
    case "Package":
      return <Package {...props} />
    case "Warehouse":
      return <Warehouse {...props} />
    case "BookText":
      return <BookText {...props} />
    case "Map":
      return <Map {...props} />
    default:
      return <LayoutDashboard {...props} />
  }
}

const DEFAULT_SIDEBAR_ITEMS: SidebarItem[] = [
  { label: "Matrix Control", href: "/dashboard", icon: "LayoutDashboard" },
  {
    label: "Work Management",
    href: "/matrix/pj.task",
    icon: "FolderKanban",
    subLinks: [
      { label: "Task Pipeline", href: "/matrix/pj.task", icon: "CheckSquare" },
      { label: "Projects", href: "/matrix/pj.project", icon: "FolderKanban" },
      { label: "Sprints", href: "/matrix/pj.sprint", icon: "Clock" },
      { label: "Milestones", href: "/matrix/pj.milestone", icon: "Target" },
    ],
  },
  {
    label: "Support Desk",
    href: "/matrix/hd.ticket",
    icon: "Ticket",
    subLinks: [
      { label: "Tickets", href: "/matrix/hd.ticket", icon: "Ticket" },
      { label: "Teams", href: "/matrix/hd.team", icon: "Users" },
      { label: "SLA Policies", href: "/matrix/hd.sla", icon: "Clock" },
    ],
  },
  {
    label: "CAB Governance",
    href: "/matrix/cab.change",
    icon: "ShieldCheck",
    subLinks: [
      { label: "Change Requests", href: "/matrix/cab.change", icon: "ShieldCheck" },
      { label: "Review Meetings", href: "/matrix/cab.meeting", icon: "Users" },
      { label: "Decisions", href: "/matrix/cab.decision", icon: "Scale" },
    ],
  },
  {
    label: "Outreach & CRM",
    href: "/matrix/crm.lead",
    icon: "Handshake",
    subLinks: [
      { label: "Partnership Leads", href: "/matrix/crm.lead", icon: "Handshake" },
      { label: "Outreach Teams", href: "/matrix/crm.team", icon: "Users" },
    ],
  },
  {
    label: "Operations & ERP",
    href: "/matrix/product.template",
    icon: "Package",
    subLinks: [
      { label: "Product Catalog", href: "/matrix/product.template", icon: "Package" },
      { label: "Warehouses", href: "/matrix/stock.warehouse", icon: "Warehouse" },
      { label: "Inventory Moves", href: "/matrix/stock.move", icon: "Activity" },
      { label: "Financial Ledger", href: "/matrix/account.account", icon: "BookText" },
    ],
  },
  {
    label: "Intelligence & AI",
    href: "/matrix/mz.case",
    icon: "Brain",
    subLinks: [
      { label: "Ethical Cases", href: "/matrix/mz.case", icon: "Scale" },
      { label: "AI Dialogues", href: "/matrix/kh.conversation", icon: "Brain" },
      { label: "Operations Log", href: "/matrix/sg.operation", icon: "Crosshair" },
    ],
  },
  {
    label: "Telemetry & Logs",
    href: "/matrix/px.request",
    icon: "BarChart3",
    subLinks: [
      { label: "Request Monitor", href: "/matrix/px.request", icon: "Activity" },
      { label: "Query Benchmarks", href: "/matrix/px.query", icon: "Database" },
      { label: "Dashboard Widgets", href: "/matrix/ir.dashboard.widget", icon: "LayoutDashboard" },
      { label: "System Telemetry", href: "/analytics", icon: "BarChart3" },
    ],
  },
  {
    label: "Background Jobs",
    href: "/matrix/ir.cron",
    icon: "Clock",
    subLinks: [
      { label: "Scheduled Actions", href: "/matrix/ir.cron", icon: "Clock" },
      { label: "Worker Queue & Jobs", href: "/matrix/ir.queue.job", icon: "Layers" },
      { label: "Execution Logs", href: "/matrix/ir.cron.log", icon: "Activity" },
    ],
  },
  {
    label: "Automations & Mesh",
    href: "/matrix/ir.automation",
    icon: "Zap",
    subLinks: [
      { label: "Automation Rules", href: "/matrix/ir.automation", icon: "Zap" },
      { label: "Outbound Webhooks", href: "/matrix/ir.webhook", icon: "Globe" },
      { label: "Webhook Logs", href: "/matrix/ir.webhook.log", icon: "Activity" },
      { label: "Report Templates", href: "/matrix/ir.report", icon: "FileText" },
    ],
  },
  {
    label: "Reference Geodata",
    href: "/matrix/geo.province",
    icon: "Map",
    subLinks: [
      { label: "Provinces", href: "/matrix/geo.province", icon: "Map" },
      { label: "Observatory Cities", href: "/matrix/geo.city", icon: "Globe" },
    ],
  },
  { label: "Hadith Archive", href: "/hadiths", icon: "BookOpen" },
  { label: "Scripture DB", href: "/scriptures", icon: "ScrollText" },
  { label: "Identity & Access", href: "/users", icon: "Users" },
  { label: "Dev Terminal", href: "/terminal", icon: "Terminal" },
]

export function Sidebar({
  items = DEFAULT_SIDEBAR_ITEMS,
  brandTitle = "COMMAND CENTER",
  brandSubtitle = "SYS-VER 1.0",
  deckUrl = `http://localhost:${APP_PORTS.PUBLIC_PORTAL}`,
  onLogout,
}: {
  items?: SidebarItem[]
  brandTitle?: string
  brandSubtitle?: string
  deckUrl?: string
  onLogout?: () => void
}) {
  const pathname = usePathname()
  const [expandedModules, setExpandedModules] = useState<
    Record<string, boolean>
  >({})

  const handleLogout = () => {
    if (onLogout) {
      onLogout()
    } else {
      window.location.href = "/auth/login"
    }
  }

  const toggleModule = (label: string) => {
    setExpandedModules((prev) => ({ ...prev, [label]: !prev[label] }))
  }

  return (
    <aside className="fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-cyan-500/20 bg-black/80 backdrop-blur-xl">
      {/* Brand Header */}
      <div className="flex h-20 items-center justify-between border-b border-cyber-purple/20 px-6">
        <div className="flex items-center gap-3">
          <ShieldCheck className="h-8 w-8 text-cyber-purple drop-shadow-[0_0_10px_rgba(161,0,255,0.5)]" />
          <div className="flex flex-col">
            <span className="font-sans text-sm font-black tracking-widest text-cyber-purple">
              {brandTitle}
            </span>
            <span className="font-mono text-[9px] text-primary/60">
              {brandSubtitle}
            </span>
          </div>
        </div>
        {deckUrl && (
          <a
            href={deckUrl}
            title="Return to Public Deck"
            className="rounded border border-primary/20 bg-primary/10 px-1.5 py-0.5 font-mono text-[9px] text-primary hover:bg-primary/20"
          >
            DECK ↗
          </a>
        )}
      </div>

      {/* Navigation list */}
      <nav className="scrollbar-hide flex-1 overflow-y-auto">
        <div className="px-4 py-4">
          <p className="mb-2 px-2 font-sans text-[10px] font-bold tracking-widest text-cyber-purple/70 uppercase">
            Modules
          </p>
          <ul className="space-y-0.5">
            {items.map((mod) => {
              const isExpanded = expandedModules[mod.label] ?? true
              const hasSubLinks = mod.subLinks && mod.subLinks.length > 0
              const isModActive = pathname === mod.href || pathname?.startsWith(mod.href + "/")

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

        {/* Account section */}
        <div className="px-4 py-2">
          <p className="mb-2 px-2 font-sans text-[10px] font-bold tracking-widest text-cyber-purple/70 uppercase">
            Account
          </p>
          <ul className="space-y-1">
            {[
              {
                label: "My Profile",
                href: "/command-center/profile",
                icon: "User",
              },
            ].map((item) => {
              const isActive =
                pathname === item.href || pathname?.startsWith(`${item.href}/`)
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2 font-sans text-xs transition-colors ${
                      isActive
                        ? "border border-cyber-purple/30 bg-cyber-purple/10 text-cyber-purple shadow-[0_0_15px_rgba(161,0,255,0.1)]"
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

export { Sidebar as CommandCenterSidebar }

