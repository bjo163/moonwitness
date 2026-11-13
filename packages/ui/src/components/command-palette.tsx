"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import {
  BookOpen,
  Command as CommandIcon,
  ExternalLink,
  Orbit,
  ScrollText,
  ShieldCheck,
  Sparkles,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  Command as CommandRoot,
} from "./command"
import {
  getCommandPaletteItems,
  type CommandPaletteItemData,
} from "./command-palette-data"

export interface CommandPaletteProps {
  isOpen?: boolean
  onClose?: () => void
  onOpenChange?: (open: boolean) => void
  commandCenterUrl?: string
}

function getCommandIcon(category: string): LucideIcon {
  if (category.includes("Portal") || category.includes("HOME")) return Orbit
  if (category.includes("Scripture")) return BookOpen
  if (category.includes("Hadith")) return ScrollText
  if (category.includes("Command Center")) return ShieldCheck
  return Sparkles
}

export function CommandPalette({
  isOpen: controlledIsOpen,
  onClose,
  onOpenChange,
  commandCenterUrl,
}: CommandPaletteProps) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const router = useRouter()
  const isControlled = controlledIsOpen !== undefined
  const isOpen = isControlled ? controlledIsOpen : open
  const items = useMemo(
    () => getCommandPaletteItems(commandCenterUrl),
    [commandCenterUrl]
  )
  const groupedItems = useMemo(() => {
    const groups = new Map<string, CommandPaletteItemData[]>()
    for (const item of items) {
      const group = groups.get(item.category) ?? []
      group.push(item)
      groups.set(item.category, group)
    }
    return [...groups.entries()]
  }, [items])

  const handleOpenChange = useCallback(
    (nextOpen: boolean) => {
      if (!nextOpen) setQuery("")

      if (!isControlled) {
        setOpen(nextOpen)
      } else if (nextOpen) {
        onOpenChange?.(true)
      } else if (onClose) {
        onClose()
      } else {
        onOpenChange?.(false)
      }
    },
    [isControlled, onClose, onOpenChange]
  )

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault()
        handleOpenChange(!isOpen)
      }
    }

    const handleOpen = () => handleOpenChange(true)

    window.addEventListener("keydown", handleKeyDown)
    window.addEventListener("moonwitness:command-palette:open", handleOpen)
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      window.removeEventListener("moonwitness:command-palette:open", handleOpen)
    }
  }, [handleOpenChange, isOpen])

  const handleSelect = useCallback(
    (item: CommandPaletteItemData) => {
      handleOpenChange(false)
      if (item.isExternal) {
        window.location.assign(item.href)
      } else {
        router.push(item.href)
      }
    },
    [handleOpenChange, router]
  )

  return (
    <CommandDialog
      open={isOpen}
      onOpenChange={handleOpenChange}
      title="MoonWitness navigation"
      description="Search and open pages across MoonWitness."
      className="top-[12%] max-w-2xl p-0 sm:max-w-2xl"
    >
      <CommandRoot className="max-h-[min(70vh,36rem)] rounded-md bg-card font-mono">
        <div className="flex items-center gap-3 border-b border-border px-4">
          <CommandInput
            value={query}
            onValueChange={setQuery}
            placeholder="Search pages, scripture, hadith, or commands"
            autoFocus
            className="h-12 font-sans"
          />
          <kbd className="hidden items-center gap-1 rounded border border-border bg-muted px-2 py-1 text-[10px] text-muted-foreground sm:inline-flex">
            <CommandIcon aria-hidden="true" className="h-3 w-3" /> K
          </kbd>
        </div>
        <CommandList className="max-h-[min(55vh,28rem)] p-2">
          <CommandEmpty className="text-muted-foreground">
            No matching pages or commands.
          </CommandEmpty>
          {groupedItems.map(([category, groupItems]) => (
            <CommandGroup key={category} heading={category}>
              {groupItems.map((item) => {
                const Icon = getCommandIcon(item.category)
                return (
                  <CommandItem
                    key={`${item.href}-${item.label}`}
                    value={`${item.label} ${item.category}`}
                    onSelect={() => handleSelect(item)}
                    className="min-h-11 cursor-pointer px-3 py-2"
                  >
                    <Icon aria-hidden="true" className="h-4 w-4 text-primary" />
                    <span className="min-w-0 flex-1 truncate">{item.label}</span>
                    {item.isExternal && (
                      <ExternalLink
                        aria-label="Opens the Command Center in a new location"
                        className="h-3.5 w-3.5 text-muted-foreground"
                      />
                    )}
                  </CommandItem>
                )
              })}
            </CommandGroup>
          ))}
        </CommandList>
        <div
          aria-label="Keyboard shortcuts"
          className="flex flex-wrap items-center justify-between gap-2 border-t border-border bg-card px-4 py-2 text-xs text-muted-foreground"
        >
          <span>
            Navigate <kbd className="rounded border border-border px-1">↑↓</kbd>
            <span className="sr-only"> arrow keys</span>
          </span>
          <span>
            Open <kbd className="rounded border border-border px-1">Enter</kbd>
          </span>
          <span>
            Close <kbd className="rounded border border-border px-1">Esc</kbd>
          </span>
        </div>
      </CommandRoot>
    </CommandDialog>
  )
}
