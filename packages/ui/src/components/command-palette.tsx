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

export interface CommandPaletteProps {
  isOpen?: boolean
  onClose?: () => void
  commandCenterUrl?: string
}

export function CommandPalette({
  isOpen: controlledIsOpen,
  onClose: controlledOnClose,
  commandCenterUrl = "http://localhost:3001",
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

  const hadiths: CommandItem[] = [
    { label: "Shahih Al-Bukhari (7,563 Hadiths)", href: "/knowledge/hadits?book=bukhari", category: "Hadith Compendiums" },
    { label: "Shahih Muslim (3,033 Hadiths)", href: "/knowledge/hadits?book=muslim", category: "Hadith Compendiums" },
    { label: "Sunan Abu Dawud", href: "/knowledge/hadits?book=abudawud", category: "Hadith Compendiums" },
    { label: "Jami' At-Tirmidzi", href: "/knowledge/hadits?book=tirmidzi", category: "Hadith Compendiums" },
  ]

  const allItems: CommandItem[] = [...portalLinks, ...commandCenterLinks, ...scriptures, ...hadiths]

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
    <div className="fixed inset-0 z-[99999] flex items-start justify-center bg-black/80 p-4 pt-20 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-cyan-500/40 bg-[#0A0F17]/95 font-mono shadow-[0_0_50px_rgba(0,240,255,0.25)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Header Bar */}
        <div className="flex items-center gap-3 border-b border-cyan-500/20 px-4 py-3.5">
          <Search className="h-5 w-5 text-cyan-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search Ayahs, Hadiths, Observatories, or Commands... (Cmd+K)"
            autoFocus
            className="flex-1 bg-transparent font-sans text-sm text-white placeholder-zinc-500 outline-none"
          />
          <kbd className="hidden items-center gap-1 rounded border border-cyan-500/30 bg-cyan-950/40 px-2 py-0.5 text-[10px] text-cyan-400 sm:inline-flex">
            <Command className="h-3 w-3" /> K
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-2">
          {filteredItems.length === 0 ? (
            <div className="p-8 text-center text-xs text-zinc-400">
              No divine coordinates or commands matching &quot;{query}&quot;
            </div>
          ) : (
            <div className="space-y-1">
              {filteredItems.map((item, index) => (
                <button
                  key={`${item.label}-${index}`}
                  onClick={() => handleSelect(item)}
                  className="flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-left transition-all hover:bg-cyan-500/10 hover:text-cyan-300 group"
                >
                  <div className="flex items-center gap-3">
                    {item.category.includes("Portal") || item.category.includes("HOME") ? (
                      <Orbit className="h-4 w-4 text-cyan-400" />
                    ) : item.category.includes("Scripture") ? (
                      <BookOpen className="h-4 w-4 text-emerald-400" />
                    ) : item.category.includes("Hadith") ? (
                      <ScrollText className="h-4 w-4 text-amber-400" />
                    ) : item.category.includes("Command Center") ? (
                      <ShieldCheck className="h-4 w-4 text-fuchsia-400" />
                    ) : (
                      <Sparkles className="h-4 w-4 text-cyan-400" />
                    )}
                    <div>
                      <div className="text-xs font-semibold text-zinc-100 group-hover:text-cyan-300">
                        {item.label}
                      </div>
                      <div className="text-[10px] text-zinc-500 uppercase tracking-wider">
                        {item.category}
                      </div>
                    </div>
                  </div>
                  {item.isExternal ? (
                    <ExternalLink className="h-3.5 w-3.5 text-zinc-500 group-hover:text-fuchsia-400" />
                  ) : (
                    <span className="text-[10px] text-zinc-500 group-hover:text-cyan-400 tracking-widest uppercase">
                      GO ↵
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer Hints */}
        <div className="flex items-center justify-between border-t border-white/10 bg-black/40 px-4 py-2 text-[10px] text-zinc-400">
          <div className="flex items-center gap-2">
            <span>Navigate <kbd className="rounded border border-white/20 px-1 py-0.5 text-[8px]">↑↓</kbd></span>
            <span>Select <kbd className="rounded border border-white/20 px-1 py-0.5 text-[8px]">↵</kbd></span>
            <span>Close <kbd className="rounded border border-white/20 px-1 py-0.5 text-[8px]">ESC</kbd></span>
          </div>
          <div className="text-cyan-400">MOONWITNESS OS TELEMETRY</div>
        </div>
      </div>
    </div>
  )
}