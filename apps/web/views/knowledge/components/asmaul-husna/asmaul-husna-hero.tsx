"use client"

import React from "react"
import { Sparkles, Clock, Database, Search } from "lucide-react"
import { Input } from "@workspace/ui"

interface AsmaulHusnaHeroProps {
  totalCount: number
  timeString: string
  searchQuery: string
  onSearchChange: (val: string) => void
}

export function AsmaulHusnaHero({
  totalCount,
  timeString,
  searchQuery,
  onSearchChange
}: AsmaulHusnaHeroProps) {
  return (
    <div className="space-y-4">
      {/* 1. Flat Header Banner */}
      <div className="relative flex flex-col justify-between gap-4 border-b border-border pb-4 md:flex-row md:items-center">
        <div>
          <div className="mb-1 flex items-center gap-3">
            <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
              Asmaul Husna matrix
            </h1>
            <span className="rounded-md border border-border bg-muted px-2 py-1 text-xs text-primary">
              99 divine attributes
            </span>
          </div>
          <p className="text-sm text-muted-foreground">
            Systematic Ontology of Divine Names, Transcendence & Cosmic Reflection
          </p>
        </div>

        <div className="flex items-center gap-4 text-right">
          <div className="hidden text-xs text-muted-foreground md:block">
            <div className="flex items-center gap-1.5 text-primary">
              <Clock className="h-3 w-3" />
              <span>Telemetry: {timeString} UTC</span>
            </div>
            <div>Status: synchronized</div>
          </div>
          <div className="arabic-text text-xl text-primary">
            وَلِلَّهِ الْأَسْمَاءُ الْحُسْنَىٰ فَادْعُوهُ بِهَا
          </div>
        </div>
      </div>

      {/* 2. Stats & Search Toolbar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-foreground/30" />
          <Input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search divine name in Arabic, transliteration, or meaning..."
            className="w-full rounded-md border-border bg-card py-2.5 pl-10 text-sm placeholder:text-muted-foreground focus:border-ring"
          />
        </div>

        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5 rounded-md border border-border bg-card px-3 py-2">
            <Database className="h-3.5 w-3.5 text-primary" />
            <span>Total: <strong className="text-foreground">{totalCount} names</strong></span>
          </div>
        </div>
      </div>
    </div>
  )
}
