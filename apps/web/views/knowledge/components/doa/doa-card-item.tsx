"use client"

import React, { useState } from "react"
import { Bookmark, Share2, PlayCircle, ShieldCheck, Check } from "lucide-react"
import { Button } from "@workspace/ui"

export interface FormattedDoaItem {
  id: string | number
  title: string
  arabic: string
  latin?: string
  translation: string
  source?: string
  category?: string
  repetition?: number
}

interface DoaCardItemProps {
  item: FormattedDoaItem
}

export function DoaCardItem({ item }: DoaCardItemProps) {
  const [count, setCount] = useState(0)
  const target = item.repetition || 1

  return (
    <div className="group relative rounded-xl border border-border bg-card p-5 shadow-lg transition-all duration-300 hover:border-emerald-500/40 hover:bg-card">
      {/* Top Metadata */}
      <div className="mb-4 flex items-center justify-between border-b border-border pb-3">
        <div>
          <h3 className="font-mono text-sm font-black text-foreground">{item.title}</h3>
          {item.category && (
            <span className="font-mono text-[9px] text-success/80 uppercase">
              {item.category}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {item.source && (
            <span className="rounded border border-success/30 bg-success/10 px-2 py-0.5 font-mono text-[8px] font-bold text-success">
              {item.source}
            </span>
          )}
          <Button type="button" variant="ghost" size="icon" aria-label={`Bookmark ${item.title}`} className="text-foreground/30 transition-colors hover:text-foreground">
            <Bookmark className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {/* Arabic Text */}
      <div className="font-arabic my-4 text-right text-xl leading-relaxed text-foreground/95 drop-shadow-sm sm:text-2xl">
        {item.arabic}
      </div>

      {/* Latin Transliteration */}
      {item.latin && (
        <p className="mb-2 font-mono text-[11px] text-success/80 italic">
          {item.latin}
        </p>
      )}

      {/* Translation */}
      <p className="mb-4 text-xs leading-relaxed text-foreground">
        &ldquo;{item.translation}&rdquo;
      </p>

      {/* Bottom Counter & Action Bar */}
      <div className="flex items-center justify-between border-t border-border pt-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => setCount((prev) => Math.min(prev + 1, target))}
          className={`flex items-center gap-2 rounded-lg border px-3 py-1.5 font-mono text-xs font-bold transition-all ${
            count >= target
              ? "border-emerald-500 bg-success/20 text-success"
              : "border-border bg-muted/30 text-foreground hover:border-emerald-500/40 hover:text-foreground"
          }`}
        >
          {count >= target ? (
            <>
              <Check className="h-3.5 w-3.5 text-success" />
              <span>COMPLETED ({count}/{target})</span>
            </>
          ) : (
            <span>COUNT: {count} / {target}</span>
          )}
        </Button>

        <div className="flex items-center gap-2 text-foreground/40">
          <Button type="button" variant="ghost" className="flex items-center gap-1 font-mono text-[10px] hover:text-success">
            <PlayCircle className="h-3.5 w-3.5" />
            <span>Audio</span>
          </Button>
          <Button type="button" variant="ghost" className="flex items-center gap-1 font-mono text-[10px] hover:text-success">
            <Share2 className="h-3.5 w-3.5" />
            <span>Share</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
