"use client"

import React, { useEffect, useState } from "react"
import {
  Share2,
  PlaySquare,
  Hash,
  Camera,
  ArrowUpRight,
  MessageSquareWarning,
} from "lucide-react"

type SocialMetric = {
  id: string
  platform: "X" | "YouTube" | "Instagram"
  topic: string
  volume: number
  sentiment: "Positive" | "Neutral" | "Negative"
}

export function SocialMediaTrendsWidget() {
  const [metrics, setMetrics] = useState<SocialMetric[]>([])

  useEffect(() => {
    // Generate Initial Seed Data
    const initialTopics = [
      { p: "X", t: "#AIRevolution", v: 450000, s: "Positive" },
      { p: "X", t: "Global Economy", v: 1200000, s: "Negative" },
      { p: "X", t: "#SpaceXLaunch", v: 850000, s: "Positive" },
      {
        p: "YouTube",
        t: "James Webb Telescope New Images",
        v: 3400000,
        s: "Positive",
      },
      { p: "YouTube", t: "Tech Layoffs Explained", v: 2100000, s: "Negative" },
      { p: "Instagram", t: "Oasis Reunion 2025", v: 5600000, s: "Neutral" },
      { p: "Instagram", t: "Cyberpunk Aesthetic", v: 900000, s: "Positive" },
    ]

    const state = initialTopics.map((t, i) => ({
      id: `seed-${i}`,
      platform: t.p as "X" | "YouTube" | "Instagram",
      topic: t.t,
      volume: t.v,
      sentiment: t.s as "Positive" | "Neutral" | "Negative",
    }))

    setMetrics(state)

    // Simulate real-time volume changes
    const interval = setInterval(() => {
      setMetrics((prev) =>
        prev
          .map((m) => {
            // Randomly increase volume by 100 to 5000
            const boost = Math.floor(Math.random() * 5000) + 100
            return {
              ...m,
              volume: m.volume + boost,
            }
          })
          .sort((a, b) => b.volume - a.volume)
      ) // keep sorted by volume
    }, 2500)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="bg-background flex flex-col rounded-xl border border-white/10 p-4 lg:col-span-12 xl:col-span-8">
      <div className="mb-4 flex items-center justify-between border-b border-white/10 pb-2">
        <div className="flex items-center gap-2 text-[10px] font-black tracking-widest text-secondary uppercase">
          <Share2 className="h-4 w-4" />
          SOCIAL MEDIA PULSE
          <span className="animate-pulse rounded-[2px] border border-secondary/50 bg-secondary/20 px-1.5 py-0.5 text-[8px] text-secondary">
            LIVE
          </span>
        </div>
        <div className="flex items-center gap-3 font-mono text-[10px] text-white/50">
          <div className="flex items-center gap-1">
            <Hash className="h-3 w-3 text-[#1DA1F2]" /> X
          </div>
          <div className="flex items-center gap-1">
            <PlaySquare className="h-3 w-3 text-[#FF0000]" /> YT
          </div>
          <div className="flex items-center gap-1">
            <Camera className="h-3 w-3 text-[#E1306C]" /> IG
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <div className="mb-2 grid grid-cols-12 gap-4 border-b border-white/5 pb-2 text-[8px] font-bold tracking-widest text-secondary/50">
          <div className="col-span-2">PLATFORM</div>
          <div className="col-span-5">VIRAL TOPIC / HASHTAG</div>
          <div className="col-span-3">ENGAGEMENT VOL.</div>
          <div className="col-span-2 text-right">SENTIMENT</div>
        </div>

        <div className="hide-scrollbar flex h-[250px] flex-col space-y-1 overflow-y-auto">
          {metrics.map((metric) => (
            <div
              key={metric.id}
              className="group grid grid-cols-12 items-center gap-4 rounded border border-transparent bg-white/5 px-2 py-2 text-[9px] transition-colors hover:border-secondary/30 hover:bg-white/10"
            >
              <div className="col-span-2 flex items-center gap-2 font-bold">
                {metric.platform === "X" && (
                  <Hash className="h-3.5 w-3.5 text-[#1DA1F2]" />
                )}
                {metric.platform === "YouTube" && (
                  <PlaySquare className="h-3.5 w-3.5 text-[#FF0000]" />
                )}
                {metric.platform === "Instagram" && (
                  <Camera className="h-3.5 w-3.5 text-[#E1306C]" />
                )}
                <span className="opacity-70 group-hover:opacity-100">
                  {metric.platform}
                </span>
              </div>

              <div className="col-span-5 flex items-center gap-2">
                <span className="truncate font-bold text-white transition-colors group-hover:text-secondary">
                  {metric.topic}
                </span>
                {metric.volume > 3000000 && (
                  <ArrowUpRight className="h-3 w-3 animate-bounce text-red-500" />
                )}
              </div>

              <div className="col-span-3 font-mono text-secondary">
                {metric.volume.toLocaleString()}
              </div>

              <div className="col-span-2 text-right">
                <span
                  className={`rounded-sm px-2 py-0.5 text-[7px] font-black tracking-wider uppercase ${
                    metric.sentiment === "Positive"
                      ? "bg-success/20 text-success border-success/30 border"
                      : metric.sentiment === "Negative"
                        ? "border border-red-500/30 bg-red-500/20 text-red-400"
                        : "border border-white/20 bg-white/10 text-white/70"
                  } `}
                >
                  {metric.sentiment}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
