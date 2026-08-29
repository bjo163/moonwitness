"use client"

import React, { useState } from "react"
import { Bookmark, Share2, PlayCircle, ShieldCheck, Check } from "lucide-react"

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
    <div className="group relative rounded-xl border border-white/10 bg-card p-5 shadow-lg transition-all duration-300 hover:border-emerald-500/40 hover:bg-card">
      {/* Top Metadata */}
      <div className="mb-4 flex items-center justify-between border-b border-white/5 pb-3">
        <div>
          <h3 className="font-mono text-sm font-black text-white">{item.title}</h3>
          {item.category && (
            <span className="font-mono text-[9px] text-emerald-400/80 uppercase">
              {item.category}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {item.source && (
            <span className="rounded border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 font-mono text-[8px] font-bold text-emerald-400">
              {item.source}
            </span>
          )}
          <button className="text-white/30 transition-colors hover:text-white">
            <Bookmark className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Arabic Text */}
      <div className="font-arabic my-4 text-right text-xl leading-relaxed text-white/95 drop-shadow-sm sm:text-2xl">
        {item.arabic}
      </div>

      {/* Latin Transliteration */}
      {item.latin && (
        <p className="mb-2 font-mono text-[11px] text-emerald-300/80 italic">
          {item.latin}
        </p>
      )}

      {/* Translation */}
      <p className="mb-4 text-xs leading-relaxed text-white/70">
        &ldquo;{item.translation}&rdquo;
      </p>

      {/* Bottom Counter & Action Bar */}
      <div className="flex items-center justify-between border-t border-white/5 pt-3">
        <button
          onClick={() => setCount((prev) => Math.min(prev + 1, target))}
          className={`flex items-center gap-2 rounded-lg border px-3 py-1.5 font-mono text-xs font-bold transition-all ${
            count >= target
              ? "border-emerald-500 bg-emerald-500/20 text-emerald-300"
              : "border-white/10 bg-white/5 text-white/70 hover:border-emerald-500/40 hover:text-white"
          }`}
        >
          {count >= target ? (
            <>
              <Check className="h-3.5 w-3.5 text-emerald-400" />
              <span>COMPLETED ({count}/{target})</span>
            </>
          ) : (
            <span>COUNT: {count} / {target}</span>
          )}
        </button>

        <div className="flex items-center gap-2 text-white/40">
          <button className="flex items-center gap-1 font-mono text-[10px] hover:text-emerald-400">
            <PlayCircle className="h-3.5 w-3.5" />
            <span>Audio</span>
          </button>
          <button className="flex items-center gap-1 font-mono text-[10px] hover:text-emerald-400">
            <Share2 className="h-3.5 w-3.5" />
            <span>Share</span>
          </button>
        </div>
      </div>
    </div>
  )
}
