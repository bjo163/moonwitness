"use client"

import React from "react"
import Image from "next/image"
import { ArrowRight } from "lucide-react"
import { Button, resolveSemanticColor, type SemanticColorToken } from "@workspace/ui"

const HIGHLIGHT_ITEMS = [
  {
    era: "PROPHETS",
    e: "Prophet Ibrahim (AS) Born",
    d: "The birth of Prophet Ibrahim (AS), the friend of Allah.",
    y: "2000 BCE",
    c: "warning" as SemanticColorToken,
  },
  {
    era: "CIVILIZATIONS",
    e: "The Rise of Bani Isra'il",
    d: "Bani Isra'il entered Egypt during the time of Prophet Yusuf (AS).",
    y: "1700 BCE",
    c: "warning" as SemanticColorToken,
  },
  {
    era: "PROPHETS",
    e: "Prophet Muhammad (SAW) Born",
    d: "The birth of the final prophet and messenger.",
    y: "570 CE",
    c: "warning" as SemanticColorToken,
  },
  {
    era: "EMPIRES",
    e: "Rise of Ottoman Empire",
    d: "Ottoman Empire became a major power in the world.",
    y: "1299 CE",
    c: "info" as SemanticColorToken,
  },
  {
    era: "ASTRONOMY",
    e: "First Telescope Invented",
    d: "Galileo built the first telescope and changed astronomy forever.",
    y: "1608 CE",
    c: "primary" as SemanticColorToken,
  },
]

export function PropheticTimelineHighlights() {
  return (
    <div className="bg-background flex flex-col rounded-xl border border-border p-4 lg:col-span-3">
      <div className="mb-4 flex items-center justify-between">
        <div className="text-[9px] font-black tracking-widest text-primary uppercase">
          TIMELINE HIGHLIGHTS
        </div>
        <div className="cursor-pointer text-[8px] text-primary hover:text-foreground">
          View All
        </div>
      </div>

      <div className="hide-scrollbar flex-1 space-y-3 overflow-y-auto">
        {HIGHLIGHT_ITEMS.map((hl, i) => (
          <div
            key={i}
            className="group flex cursor-pointer gap-3 rounded p-1.5 transition-colors hover:bg-muted/30"
          >
            <div className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded border border-border bg-primary">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent" />
              <Image
                unoptimized
                width={120}
                height={120}
                src="/assets/landscape-temp.jpg"
                alt="Timeline era portrait"
                className="h-full w-full object-cover opacity-50 transition-opacity group-hover:opacity-100"
              />
            </div>
            <div className="flex-1">
              <div className="mb-0.5 flex items-start justify-between">
                <div
                  className="text-[7px] font-black uppercase"
                  style={{ color: resolveSemanticColor(hl.c) }}
                >
                  {hl.era}
                </div>
                <div className="font-mono text-[8px] text-primary">
                  {hl.y}
                </div>
              </div>
              <div className="mb-1 text-[10px] leading-tight font-bold text-foreground">
                {hl.e}
              </div>
              <div className="line-clamp-2 font-sans text-[8px] text-primary">
                {hl.d}
              </div>
            </div>
          </div>
        ))}
      </div>

      <Button type="button" variant="outline" size="sm" className="mt-3 w-full text-[8px] font-bold tracking-widest uppercase">
        EXPLORE ALL HIGHLIGHTS <ArrowRight className="h-2.5 w-2.5" />
      </Button>
    </div>
  )
}
