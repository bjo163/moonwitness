"use client"

import React, { useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import {
  Search,
  Orbit,
  BookOpen,
  ScrollText,
  ShieldCheck,
  ExternalLink,
  Sparkles,
  Command,
} from "lucide-react"
import { APP_PORTS } from "@workspace/types"
import { Button } from "./button"
import { Input } from "./input"
import { getCommandPaletteItems, type CommandPaletteItemData } from "./command-palette-data"

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

    const handleOpen = () => setOpen(true)

    window.addEventListener("keydown", handleKeyDown)
    window.addEventListener("moonwitness:command-palette:open", handleOpen)
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      window.removeEventListener("moonwitness:command-palette:open", handleOpen)
    }
  }, [isOpen, isControlled, controlledOnClose, handleClose])

  if (!isOpen) return null

  const filterText = query.toLowerCase().trim()
  const allItems = getCommandPaletteItems(commandCenterUrl)

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
    <div className="fixed inset-0 z-[99999] flex items-start justify-center bg-background/95 p-4 pt-20 animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-2xl overflow-hidden rounded-md border border-border bg-card font-mono shadow-sm"
        onClick={(e) => e.stopPropagation()}
      >
        <CommandPaletteSearch query={query} onChange={setQuery} />

        <CommandPaletteResults items={filteredItems} query={query} onSelect={handleSelect} />

        <CommandPaletteFooter />
      </div>
    </div>
  )
}

function CommandPaletteSearch({ query, onChange }: { query: string; onChange: (value: string) => void }) {
  return <div className="flex items-center gap-3 border-b border-border px-4 py-3.5"><Search className="h-5 w-5 text-primary" /><Input type="text" value={query} onChange={(event) => onChange(event.target.value)} placeholder="Search Ayahs, Hadiths, Observatories, or Commands... (Cmd+K)" autoFocus className="flex-1 bg-transparent font-sans text-sm text-foreground placeholder-zinc-500 outline-none" /><kbd className="hidden items-center gap-1 rounded border border-border bg-muted px-2 py-0.5 text-[10px] text-primary sm:inline-flex"><Command className="h-3 w-3" /> K</kbd></div>
}

function CommandPaletteResults({
  items,
  query,
  onSelect,
}: {
  items: CommandPaletteItemData[]
  query: string
  onSelect: (item: CommandPaletteItemData) => void
}) {
  return <div className="max-h-96 overflow-y-auto p-2">{items.length === 0 ? <div className="p-8 text-center text-xs text-muted-foreground">No divine coordinates or commands matching &quot;{query}&quot;</div> : <div className="space-y-1">{items.map((item, index) => <CommandPaletteItem key={`${item.label}-${index}`} item={item} onSelect={onSelect} />)}</div>}</div>
}

function CommandPaletteFooter() {
  return (
    <div className="flex items-center justify-between border-t border-border bg-card px-4 py-2 text-xs text-muted-foreground">
      <div className="flex items-center gap-2">
        <span>Navigate <kbd className="rounded border border-border px-1 py-0.5 text-[8px]">↑↓</kbd></span>
        <span>Select <kbd className="rounded border border-border px-1 py-0.5 text-[8px]">↵</kbd></span>
        <span>Close <kbd className="rounded border border-border px-1 py-0.5 text-[8px]">ESC</kbd></span>
      </div>
      <div className="text-primary">MoonWitness navigation</div>
    </div>
  )
}

function CommandPaletteItem({
  item,
  onSelect,
}: {
  item: CommandPaletteItemData
  onSelect: (item: CommandPaletteItemData) => void
}) {
  const Icon = item.category.includes("Portal") || item.category.includes("HOME")
    ? Orbit
    : item.category.includes("Scripture")
      ? BookOpen
      : item.category.includes("Hadith")
        ? ScrollText
        : item.category.includes("Command Center")
          ? ShieldCheck
          : Sparkles

  return (
    <Button
      type="button"
      variant="ghost"
      onClick={() => onSelect(item)}
      className="group flex w-full items-center justify-between rounded-md px-3.5 py-2.5 text-left transition-colors hover:bg-primary/10 hover:text-primary"
    >
      <div className="flex items-center gap-3">
        <Icon className="h-4 w-4 text-primary" />
        <div>
          <div className="text-xs font-semibold text-foreground group-hover:text-primary">
            {item.label}
          </div>
          <div className="text-xs text-muted-foreground">
            {item.category}
          </div>
        </div>
      </div>
      {item.isExternal ? (
        <ExternalLink className="h-3.5 w-3.5 text-muted-foreground group-hover:text-fuchsia-400" />
      ) : (
        <span className="text-xs text-muted-foreground group-hover:text-primary">
          Open ↵
        </span>
      )}
    </Button>
  )
}
