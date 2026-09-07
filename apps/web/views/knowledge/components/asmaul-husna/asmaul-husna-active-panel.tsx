"use client"

import React from "react"
import { Sparkles, BookOpen, Layers, Star, Info } from "lucide-react"
import type { FormattedAsmaulHusnaItem } from "./asmaul-husna-card-item"

interface AsmaulHusnaActivePanelProps {
  item: FormattedAsmaulHusnaItem
}

export function AsmaulHusnaActivePanel({ item }: AsmaulHusnaActivePanelProps) {
  return (
    <div className="sticky top-6 space-y-4">
      {/* Active Focus Card */}
      <div className="relative overflow-hidden rounded-md border border-border bg-card p-5">

        <div className="relative z-10 text-center">
          <div className="mb-2 inline-flex items-center gap-1 rounded-md border border-border bg-muted px-2 py-1 text-xs font-medium text-primary">
            <Sparkles className="h-3 w-3" />
            <span>Selected attribute #{item.id}</span>
          </div>

          <div className="arabic-text my-4 text-4xl text-foreground">
            {item.arabic}
          </div>

          <h2 className="text-xl font-semibold text-primary">
            {item.transliteration}
          </h2>
          <p className="mt-1 text-sm font-medium text-foreground">
            {item.meaning}
          </p>
        </div>

        <div className="relative z-10 mt-6 space-y-3 border-t border-border pt-4 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Qur&apos;anic context:</span>
            <span className="text-foreground">{item.ref}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Ontological domain:</span>
            <span className="text-primary">Divine essence & mercy</span>
          </div>
        </div>
      </div>

      {/* Reflection Guidance */}
      <div className="rounded-md border border-border bg-card p-4 text-sm">
        <div className="mb-2 flex items-center gap-2 text-primary">
          <Info className="h-4 w-4" />
          <span className="font-semibold">Spiritual reflection</span>
        </div>
        <p className="leading-relaxed text-muted-foreground">
          Contemplating on &ldquo;{item.transliteration}&rdquo; nurtures awareness of Divine omnipotence and aligns human actions toward mercy, justice, and devotion.
        </p>
      </div>
    </div>
  )
}
