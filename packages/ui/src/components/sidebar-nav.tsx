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
    <aside className="fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-border bg-card/95 backdrop-blur-xl">
      {/* Brand Header */}
      <div className="flex h-20 items-center justify-between border-b border-border px-6">
        <div className="flex items-center gap-3">
          <ShieldCheck className="h-8 w-8 text-primary" />
          <div className="flex flex-col">
            <span className="font-sans text-sm font-bold tracking-wider text-foreground">
              {brandTitle}
            </span>
            <span className="font-mono text-[9px] text-muted-foreground">
              {brandSubtitle}
            </span>
          </div>
        </div>
        {deckUrl && (
          <a
            href={deckUrl}
            title="Return to Public Deck"
            className="rounded-md border border-border bg-secondary px-2 py-0.5 font-mono text-[10px] text-foreground hover:bg-accent"
          >
            PORTAL ↗
          </a>
        )}
      </div>

      {/* Navigation list */}
      <nav className="scrollbar-hide flex-1 overflow-y-auto">
        <div className="px-4 py-4">
          <p className="mb-2 px-2 font-sans text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
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
                            ? "bg-primary/10 text-primary font-semibold"
                            : "text-muted-foreground hover:bg-accent hover:text-foreground"
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
                        <ul className="mt-0.5 ml-4 space-y-0.5 border-l border-border pl-3">
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
                                      ? "bg-primary/10 text-primary font-semibold"
                                      : "text-muted-foreground hover:bg-accent hover:text-foreground"
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
                          ? "bg-primary/10 text-primary font-semibold"
                          : "text-muted-foreground hover:bg-accent hover:text-foreground"
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
          <p className="mb-2 px-2 font-sans text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
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
                        ? "border border-border bg-accent text-foreground font-semibold"
                        : "text-muted-foreground hover:bg-accent hover:text-foreground"
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
      <div className="mt-auto border-t border-border bg-muted/20 p-4">
        <p className="mb-2 font-sans text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
          System Status
        </p>
        <div className="flex items-center gap-3">
          <div className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border bg-background">
            <Target className="h-4 w-4 text-emerald-500" />
          </div>
          <div className="flex flex-col">
            <span className="font-sans text-xs font-semibold text-emerald-500">
              All Systems Operational
            </span>
            <span className="font-mono text-[9px] text-muted-foreground">
              Uptime: 99.98%
            </span>
          </div>
        </div>
      </div>

      <div className="border-t border-border p-4">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 font-sans text-xs text-destructive transition-colors hover:bg-destructive/10"
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </button>
      </div>
    </aside>
  )
}

export { Sidebar as CommandCenterSidebar }

