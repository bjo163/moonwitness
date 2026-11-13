"use client"

import React, { useState } from "react"
import { Check, Copy } from "lucide-react"
import { cn } from "@workspace/ui/lib/utils"

export interface CopyButtonProps {
  value: string
  label?: string
  copiedLabel?: string
  iconOnly?: boolean
  className?: string
  onCopy?: () => void
}

export function CopyButton({
  value,
  label = "Copy",
  copiedLabel = "Copied",
  iconOnly = false,
  className = "",
  onCopy,
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async (event: React.MouseEvent) => {
    event.stopPropagation()
    if (!navigator.clipboard) return
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
      onCopy?.()
      setTimeout(() => setCopied(false), 1600)
    } catch {
      // Ignore clipboard write failures gracefully
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={copied ? copiedLabel : label}
      title={copied ? copiedLabel : label}
      className={cn(
        "inline-flex items-center justify-center gap-1.5 rounded-md border border-border bg-card text-xs font-medium text-foreground transition-colors hover:bg-accent",
        iconOnly ? "h-8 w-8 p-0" : "px-2.5 py-1.5",
        copied && "text-success border-success/30",
        className
      )}
    >
      {copied ? (
        <Check className="h-3.5 w-3.5 text-success" aria-hidden="true" />
      ) : (
        <Copy className="h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />
      )}
      {!iconOnly && <span>{copied ? copiedLabel : label}</span>}
    </button>
  )
}

export interface CopyActionItem {
  label: string
  value: string
  copiedLabel?: string
}

export interface CopyActionsGroupProps {
  items: CopyActionItem[]
  className?: string
  label?: string
}

export function CopyActionsGroup({
  items,
  className = "",
  label = "Copy actions",
}: CopyActionsGroupProps) {
  return (
    <div className={cn("flex flex-wrap gap-2", className)} aria-label={label}>
      {items.map((item, index) => (
        <CopyButton
          key={index}
          value={item.value}
          label={item.label}
          copiedLabel={item.copiedLabel || "Copied"}
        />
      ))}
    </div>
  )
}
