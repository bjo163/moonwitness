"use client"

import React, { useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import {
  Search,
  Orbit,
  Telescope,
  BookOpen,
  ScrollText,
  ShieldCheck,
  LayoutDashboard,
  Users,
  Terminal,
  Compass,
  Moon,
  Calculator,
  ExternalLink,
  Sparkles,
  Command,
} from "lucide-react"
import { NAVIGATION_MESH } from "@workspace/types"

import { APP_PORTS } from "@workspace/types"

export interface CommandPaletteProps {
  isOpen?: boolean
  onClose?: () => void
  commandCenterUrl?: string
}

export function CommandPalette({
  isOpen: controlledIsOpen,
  onClose: controlledOnClose,
  commandCenterUrl = `http://localhost:${APP_PORTS.COMMAND_CENTER}`,
}: CommandPaletteProps) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const router = useRouter()

  const isControlled = controlledIsOpen !== undefined
  const isOpen = isControlled ? controlledIsOpen : open

  const handleClose = useCallback(() => {
    if (isControlled && controlledOnClose) {
      controlledOnClose()
    } else {
      setOpen(false)
    }
    setQuery("")
  }, [isControlled, controlledOnClose])

  // Global Keyboard Shortcut (Cmd+K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        if (isControlled && controlledOnClose) {
          if (isOpen) controlledOnClose()
          else setOpen(true)
        } else {
          setOpen((prev) => !prev)
        }
      }
      if (e.key === "Escape" && isOpen) {
        handleClose()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, isControlled, controlledOnClose, handleClose])

  if (!isOpen) return null

  type CommandItem = {
    label: string
    href: string
    category: string
    isExternal?: boolean
  }

  const filterText = query.toLowerCase().trim()

  const portalLinks: CommandItem[] = NAVIGATION_MESH.portal.flatMap((p: { label: string; href: string; subLinks?: ReadonlyArray<{ label: string; href: string }> }) => {
    const main: CommandItem[] = [{ label: p.label, href: p.href, category: "Public Portal" }]
    const subs: CommandItem[] = (p.subLinks || []).map((s: { label: string; href: string }) => ({
      label: s.label,
      href: s.href,
      category: p.label,
    }))
    return [...main, ...subs]
  })

  const commandCenterLinks: CommandItem[] = NAVIGATION_MESH.commandCenter.map((c) => ({
    label: c.label,
    href: `${commandCenterUrl}${c.href}`,
    category: "Command Center (Admin)",
    isExternal: true,
  }))

  const scriptures: CommandItem[] = [
    { label: "Surah Al-Fatihah (1:1-7)", href: "/knowledge/kitab?surah=1", category: "Scripture Hub" },
    { label: "Surah Al-Baqarah — Ayat Kursi (2:255)", href: "/knowledge/kitab?surah=2&ayah=255", category: "Scripture Hub" },
    { label: "Surah Yasin (36:1-83)", href: "/knowledge/kitab?surah=36", category: "Scripture Hub" },
    { label: "Surah Al-Kahf (18:1-110)", href: "/knowledge/kitab?surah=18", category: "Scripture Hub" },
    { label: "Surah Al-Mulk (67:1-30)", href: "/knowledge/kitab?surah=67", category: "Scripture Hub" },
  ]

  const matrixModels: CommandItem[] = [
    { label: "Tasks & Backlog (pj.task)", href: "/matrix/pj.task", category: "Matrix Workspace" },
    { label: "Projects & Milestones (pj.project)", href: "/matrix/pj.project", category: "Matrix Workspace" },
    { label: "Support Tickets (hd.ticket)", href: "/matrix/hd.ticket", category: "Matrix Workspace" },
    { label: "CAB RFC Governance (cab.change)", href: "/matrix/cab.change", category: "Matrix Workspace" },
    { label: "Background Scheduled Jobs (ir.cron)", href: "/matrix/ir.cron", category: "Matrix Workspace" },
    { label: "Worker Queue & Jobs (ir.queue.job)", href: "/matrix/ir.queue.job", category: "Matrix Workspace" },
    { label: "Cron Execution Logs (ir.cron.log)", href: "/matrix/ir.cron.log", category: "Matrix Workspace" },
    { label: "CRM Outreach Leads (crm.lead)", href: "/matrix/crm.lead", category: "Matrix Workspace" },
    { label: "Product Catalog (product.template)", href: "/matrix/product.template", category: "Matrix Workspace" },
    { label: "Warehouses (stock.warehouse)", href: "/matrix/stock.warehouse", category: "Matrix Workspace" },
    { label: "Inventory Moves (stock.move)", href: "/matrix/stock.move", category: "Matrix Workspace" },
    { label: "Financial Ledger (account.account)", href: "/matrix/account.account", category: "Matrix Workspace" },
    { label: "Ethical Cases (mz.case)", href: "/matrix/mz.case", category: "Matrix Workspace" },
    { label: "AI Conversations (kh.conversation)", href: "/matrix/kh.conversation", category: "Matrix Workspace" },
    { label: "Operations Log (sg.operation)", href: "/matrix/sg.operation", category: "Matrix Workspace" },
    { label: "System Telemetry & Requests (px.request)", href: "/matrix/px.request", category: "Matrix Workspace" },
    { label: "Observatory Cities (geo.city)", href: "/matrix/geo.city", category: "Matrix Workspace" },
    { label: "Automation Rules (ir.automation)", href: "/matrix/ir.automation", category: "Matrix Workspace" },
    { label: "Outbound Webhooks (ir.webhook)", href: "/matrix/ir.webhook", category: "Matrix Workspace" },
    { label: "Webhook Dispatch Logs (ir.webhook.log)", href: "/matrix/ir.webhook.log", category: "Matrix Workspace" },
    { label: "Report Templates (ir.report)", href: "/matrix/ir.report", category: "Matrix Workspace" },
    { label: "Dashboard Widgets (ir.dashboard.widget)", href: "/matrix/ir.dashboard.widget", category: "Matrix Workspace" },
  ]

  const hadiths: CommandItem[] = [
    { label: "Shahih Al-Bukhari (7,563 Hadiths)", href: "/knowledge/hadits?book=bukhari", category: "Hadith Compendiums" },
    { label: "Shahih Muslim (3,033 Hadiths)", href: "/knowledge/hadits?book=muslim", category: "Hadith Compendiums" },
    { label: "Sunan Abu Dawud", href: "/knowledge/hadits?book=abudawud", category: "Hadith Compendiums" },
    { label: "Jami' At-Tirmidzi", href: "/knowledge/hadits?book=tirmidzi", category: "Hadith Compendiums" },
  ]

  const allItems: CommandItem[] = [...portalLinks, ...commandCenterLinks, ...matrixModels, ...scriptures, ...hadiths]

  const filteredItems = filterText
    ? allItems.filter(
        (item) =>
          item.label.toLowerCase().includes(filterText) ||
          item.category.toLowerCase().includes(filterText)
      )
    : allItems.slice(0, 12)

  const handleSelect = (item: { href: string; isExternal?: boolean }) => {
    handleClose()
    if (item.isExternal || item.href.startsWith("http")) {
      window.location.href = item.href
    } else {
      router.push(item.href)
    }
  }

  return (
    <div className="fixed inset-0 z-[99999] flex items-start justify-center bg-card p-4 pt-20 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-border bg-card/95 font-mono shadow-sm"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Header Bar */}
        <div className="flex items-center gap-3 border-b border-border px-4 py-3.5">
          <Search className="h-5 w-5 text-primary" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search Ayahs, Hadiths, Observatories, or Commands... (Cmd+K)"
            autoFocus
            className="flex-1 bg-transparent font-sans text-sm text-foreground placeholder-zinc-500 outline-none"
          />
          <kbd className="hidden items-center gap-1 rounded border border-border bg-muted px-2 py-0.5 text-[10px] text-primary sm:inline-flex">
            <Command className="h-3 w-3" /> K
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-2">
          {filteredItems.length === 0 ? (
            <div className="p-8 text-center text-xs text-muted-foreground">
              No divine coordinates or commands matching &quot;{query}&quot;
            </div>
          ) : (
            <div className="space-y-1">
              {filteredItems.map((item, index) => (
                <button
                  key={`${item.label}-${index}`}
                  onClick={() => handleSelect(item)}
                  className="flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-left transition-all hover:bg-primary/10 hover:text-primary group"
                >
                  <div className="flex items-center gap-3">
                    {item.category.includes("Portal") || item.category.includes("HOME") ? (
                      <Orbit className="h-4 w-4 text-primary" />
                    ) : item.category.includes("Scripture") ? (
                      <BookOpen className="h-4 w-4 text-success" />
                    ) : item.category.includes("Hadith") ? (
                      <ScrollText className="h-4 w-4 text-warning" />
                    ) : item.category.includes("Command Center") ? (
                      <ShieldCheck className="h-4 w-4 text-fuchsia-400" />
                    ) : (
                      <Sparkles className="h-4 w-4 text-primary" />
                    )}
                    <div>
                      <div className="text-xs font-semibold text-foreground group-hover:text-primary">
                        {item.label}
                      </div>
                      <div className="text-[10px] text-muted-foreground uppercase tracking-wider">
                        {item.category}
                      </div>
                    </div>
                  </div>
                  {item.isExternal ? (
                    <ExternalLink className="h-3.5 w-3.5 text-muted-foreground group-hover:text-fuchsia-400" />
                  ) : (
                    <span className="text-[10px] text-muted-foreground group-hover:text-primary tracking-widest uppercase">
                      GO ↵
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer Hints */}
        <div className="flex items-center justify-between border-t border-border bg-card px-4 py-2 text-[10px] text-muted-foreground">
          <div className="flex items-center gap-2">
            <span>Navigate <kbd className="rounded border border-border px-1 py-0.5 text-[8px]">↑↓</kbd></span>
            <span>Select <kbd className="rounded border border-border px-1 py-0.5 text-[8px]">↵</kbd></span>
            <span>Close <kbd className="rounded border border-border px-1 py-0.5 text-[8px]">ESC</kbd></span>
          </div>
          <div className="text-primary">MOONWITNESS OS TELEMETRY</div>
        </div>
      </div>
    </div>
  )
}