"use client"

import React from "react"

export interface ReaderTopHeaderProps {
  scriptureName: string
  scriptureArabic?: string
  scriptureTag?: string
  scriptureDesc?: string
  stats?: Record<string, any>
}

export function ReaderTopHeader({
  scriptureName,
  scriptureArabic,
  scriptureTag,
  scriptureDesc,
  stats,
}: ReaderTopHeaderProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="flex flex-col items-start justify-between gap-4 px-6 py-4 md:flex-row md:items-center">
        <div className="max-w-2xl flex-1">
          <div className="mb-2 flex items-center gap-4">
            <h1 className="text-3xl font-black tracking-tight md:text-4xl">
              {scriptureName}
            </h1>
            {scriptureArabic && (
              <span lang="ar" dir="rtl" className="font-arabic text-2xl text-warning">
                {scriptureArabic}
              </span>
            )}
            {scriptureTag && (
              <span className="rounded border border-teal-500/30 bg-teal-500/10 px-2 py-1 text-[9px] font-bold tracking-widest text-teal-400">
                {scriptureTag}
              </span>
            )}
          </div>
          {scriptureDesc && <p className="text-sm text-foreground/60">{scriptureDesc}</p>}
        </div>

        <div className="flex flex-wrap items-center gap-6 text-xs text-foreground/50">
          {stats &&
            Object.entries(stats).map(([key, value]) => (
              <div key={key} className="flex flex-col gap-1">
                <span className="text-[10px] font-bold tracking-widest uppercase">
                  {key}
                </span>
                <span className="text-sm font-bold text-foreground">
                  {value as React.ReactNode}
                </span>
              </div>
            ))}
        </div>
      </div>
    </header>
  )
}
