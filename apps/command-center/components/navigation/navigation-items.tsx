import {
  Activity,
  BarChart3,
  BookOpen,
  BriefcaseBusiness,
  CalendarClock,
  CheckSquare,
  Database,
  FileText,
  FolderKanban,
  Globe2,
  Handshake,
  LayoutDashboard,
  Map,
  Package,
  Scale,
  ScrollText,
  Settings,
  ShieldCheck,
  Terminal,
  Ticket,
  Users,
  Warehouse,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"

export type NavigationItem = {
  label: string
  href: string
  icon: LucideIcon
  children?: Array<{ label: string; href: string; icon: LucideIcon }>
}

const child = (label: string, href: string, icon: LucideIcon) => ({ label, href, icon })

export const navigationItems: NavigationItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  {
    label: "Work management", href: "/matrix/pj.task", icon: BriefcaseBusiness,
    children: [child("Tasks", "/matrix/pj.task", CheckSquare), child("Projects", "/matrix/pj.project", FolderKanban), child("Sprints", "/matrix/pj.sprint", CalendarClock)],
  },
  {
    label: "Support desk", href: "/matrix/hd.ticket", icon: Ticket,
    children: [child("Tickets", "/matrix/hd.ticket", Ticket), child("Teams", "/matrix/hd.team", Users)],
  },
  {
    label: "CAB governance", href: "/matrix/cab.change", icon: ShieldCheck,
    children: [child("Change requests", "/matrix/cab.change", ShieldCheck), child("Decisions", "/matrix/cab.decision", Scale)],
  },
  {
    label: "Outreach & CRM", href: "/matrix/crm.lead", icon: Handshake,
    children: [child("Partnership leads", "/matrix/crm.lead", Handshake), child("Outreach teams", "/matrix/crm.team", Users)],
  },
  {
    label: "Operations", href: "/matrix/product.template", icon: Package,
    children: [child("Product catalog", "/matrix/product.template", Package), child("Warehouses", "/matrix/stock.warehouse", Warehouse), child("Inventory moves", "/matrix/stock.move", Activity)],
  },
  {
    label: "Telemetry", href: "/matrix/px.request", icon: BarChart3,
    children: [child("Request monitor", "/matrix/px.request", Activity), child("Query benchmarks", "/matrix/px.query", Database), child("System telemetry", "/analytics", BarChart3)],
  },
  { label: "Hadith archive", href: "/hadiths", icon: BookOpen },
  { label: "Scripture database", href: "/scriptures", icon: ScrollText },
  { label: "Users", href: "/users", icon: Users },
  { label: "Dev terminal", href: "/terminal", icon: Terminal },
]

export const utilityItems = [
  { label: "Reference geodata", href: "/matrix/geo.city", icon: Map },
  { label: "Reports", href: "/matrix/ir.report", icon: FileText },
  { label: "Settings", href: "/profile", icon: Settings },
  { label: "Public portal", href: process.env.NEXT_PUBLIC_PUBLIC_PORTAL_URL ?? "/", icon: Globe2 },
]
