"use client"

import { useState } from "react"

type CopyActionsProps = {
  reference: string
  link: string
}

export function CopyActions({ reference, link }: CopyActionsProps) {
  const [copied, setCopied] = useState<string | null>(null)

  async function copy(label: string, value: string) {
    if (!navigator.clipboard) return
    await navigator.clipboard.writeText(value)
    setCopied(label)
    window.setTimeout(() => setCopied(null), 1600)
  }

  return (
    <div className="flex flex-wrap gap-2" aria-label="Citation actions">
      <button type="button" onClick={() => void copy("reference", reference)} className="rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground hover:bg-accent">
        {copied === "reference" ? "Copied" : "Copy reference"}
      </button>
      <button type="button" onClick={() => void copy("citation", reference)} className="rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground hover:bg-accent">
        {copied === "citation" ? "Copied" : "Copy citation"}
      </button>
      <button type="button" onClick={() => void copy("link", link)} className="rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground hover:bg-accent">
        {copied === "link" ? "Copied" : "Copy link"}
      </button>
    </div>
  )
}
