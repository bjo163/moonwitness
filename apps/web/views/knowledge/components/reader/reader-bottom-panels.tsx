"use client"

import React from "react"
import { CheckCircle2 } from "lucide-react"

export interface ReaderBottomPanelsProps {
  bottomPanels?: {
    themes?: string[]
    related?: Array<{ ref: string; desc: string }>
    tafsir_highlight?: { text: string; author: string }
    science?: string[]
  }
}

export function ReaderBottomPanels({ bottomPanels }: ReaderBottomPanelsProps) {
  if (!bottomPanels) return null

  return (
    <div className="border-t border-border bg-card px-6 py-5">
      <div className="mx-auto grid max-w-[1920px] grid-cols-1 gap-4 md:grid-cols-4">
        {bottomPanels.themes && bottomPanels.themes.length > 0 && (
          <div>
            <h4 className="mb-4 text-[10px] font-black tracking-widest text-foreground/50 uppercase">
              THEMES & TOPICS
            </h4>
            <div className="flex flex-wrap gap-2">
              {bottomPanels.themes.map((t, i) => (
                <span
                  key={i}
                  className="cursor-pointer rounded border border-border bg-muted/30 px-2 py-1 text-[9px] font-bold text-foreground/60 transition-colors hover:border-blue-500/50 hover:text-foreground"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        )}

        {bottomPanels.related && bottomPanels.related.length > 0 && (
          <div>
            <h4 className="mb-4 text-[10px] font-black tracking-widest text-foreground/50 uppercase">
              RELATED VERSES
            </h4>
            <div className="space-y-2">
              {bottomPanels.related.map((r, i) => (
                <div key={i} className="text-xs">
                  <span className="mr-2 font-bold text-blue-400">{r.ref}</span>
                  <span className="text-foreground/50">{r.desc}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {bottomPanels.tafsir_highlight && (
          <div>
            <h4 className="mb-4 text-[10px] font-black tracking-widest text-foreground/50 uppercase">
              TAFSIR HIGHLIGHT
            </h4>
            <p className="border-l-2 border-amber-500 pl-3 text-xs leading-relaxed text-foreground/60 italic">
              &quot;{bottomPanels.tafsir_highlight.text}&quot;
              <span className="mt-2 block font-bold text-foreground/40 not-italic">
                — {bottomPanels.tafsir_highlight.author}
              </span>
            </p>
          </div>
        )}

        {bottomPanels.science && bottomPanels.science.length > 0 && (
          <div>
            <h4 className="mb-4 text-[10px] font-black tracking-widest text-foreground/50 uppercase">
              FEATURES
            </h4>
            <ul className="space-y-2 text-xs text-foreground/60">
              {bottomPanels.science.map((s, i) => (
                <li key={i} className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-3 w-3 text-teal-500" />
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}
