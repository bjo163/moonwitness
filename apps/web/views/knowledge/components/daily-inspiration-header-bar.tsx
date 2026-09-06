"use client"

import React from "react"
import {
  Share2,
  Loader2,
  Moon,
  Link as LinkIcon,
  MessageSquare,
  Palette,
} from "lucide-react"
import { DailyData } from "../lib/daily-inspiration-data"

interface DailyInspirationHeaderBarProps {
  data: DailyData
  liveTime: string
  copiedUrl: boolean
  copied: boolean
  copiedPrompt: boolean
  isExporting: boolean
  rotationPercentFormatted: string
  copyDynamicShareUrl: () => void
  copyVerseForWhatsApp: () => void
  copyImagePrompt: () => void
  exportDashboardPNG: () => void
  t: (en: string, id: string) => string
}

export function DailyInspirationHeaderBar({
  data,
  liveTime,
  copiedUrl,
  copied,
  copiedPrompt,
  isExporting,
  rotationPercentFormatted,
  copyDynamicShareUrl,
  copyVerseForWhatsApp,
  copyImagePrompt,
  exportDashboardPNG,
  t,
}: DailyInspirationHeaderBarProps) {
  return (
    <div className="mb-4 flex flex-wrap items-center justify-between border-b border-border pb-3 text-[9px] tracking-widest text-foreground uppercase">
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary shadow-sm"></span>
          GLOBAL SIGNAL <span className="font-bold text-primary">ONLINE</span>
        </div>
        <div className="flex items-center gap-2 text-blue-300">
          <Moon className="h-3 w-3" />
          {data.prayerPeriod?.name?.toUpperCase() || "NIGHT CYCLE"}{" "}
          <span className="font-medium text-primary">{liveTime}</span>
        </div>
      </div>

      {data.globalStats && (
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 border-r border-border pr-4">
            <button
              onClick={copyDynamicShareUrl}
              title={
                copiedUrl
                  ? t("COPIED", "TERSALIN")
                  : t("COPY LINK", "SALIN TAUTAN")
              }
              className="flex h-6 w-6 items-center justify-center rounded bg-muted/30 text-[10px] text-primary transition-colors hover:bg-primary/10 hover:text-primary"
            >
              <LinkIcon className="h-3 w-3" />
            </button>
            <button
              onClick={copyVerseForWhatsApp}
              title={
                copied
                  ? t("COPIED", "TERSALIN")
                  : t("SHARE TRANSMISSION", "BAGIKAN HIKMAH")
              }
              className="flex h-6 w-6 items-center justify-center rounded bg-muted/30 text-[10px] text-success transition-colors hover:bg-success/20 hover:text-success"
            >
              <MessageSquare className="h-3 w-3" />
            </button>
            <button
              onClick={copyImagePrompt}
              title={
                copiedPrompt
                  ? t("PROMPT COPIED!", "PROMPT TERSALIN!")
                  : t("SHARE PROMPT", "SHARE PROMPT")
              }
              className="flex h-6 w-6 items-center justify-center rounded bg-muted/30 text-[10px] text-fuchsia-400 transition-colors hover:bg-fuchsia-500/20 hover:text-fuchsia-300"
            >
              <Palette className="h-3 w-3" />
            </button>
            <button
              onClick={exportDashboardPNG}
              disabled={isExporting}
              title={
                isExporting
                  ? t("EXPORTING...", "MENGEKSPOR...")
                  : t("EXPORT FULL DASHBOARD", "EKSPOR INFOGRAFIS")
              }
              className="flex h-6 w-6 items-center justify-center rounded bg-muted/30 text-[10px] text-indigo-400 transition-colors hover:bg-indigo-500/20 hover:text-indigo-300 disabled:opacity-50"
            >
              {isExporting ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                <Share2 className="h-3 w-3" />
              )}
            </button>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex flex-col text-right">
              <span className="text-[8px] text-warning/80 uppercase">
                ROTATION{" "}
                {data.globalStats.seenAyahsCount.toLocaleString("en-US")} /{" "}
                {data.globalStats.totalAyahs.toLocaleString("en-US")}
              </span>
              <span>GLOBAL PROGRESS</span>
            </div>
            <span className="text-lg font-bold text-foreground drop-shadow-sm">
              {rotationPercentFormatted}%
            </span>
            <div className="flex h-4 items-end gap-[2px]">
              {[40, 70, 45, 90, 65, 80, 50, 100, 60, 30].map((h, i) => (
                <div
                  key={i}
                  className="w-[2px] rounded-t bg-primary/10"
                  style={{ height: `${h}%` }}
                ></div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
