"use client"

import React, { useState } from "react"
import { ArrowRight, BookOpen, Search } from "lucide-react"

type FeedItem = {
  id: string
  category: string
  title: string
  subtitle: string
  time: string
}

type KnowledgeFeedProps = {
  feed: FeedItem[]
}

const TABS = [
  "All",
  "Qur'an",
  "Hadith",
  "Astronomy",
  "History",
  "Research",
  "Community",
]

export function Feed({ feed }: KnowledgeFeedProps) {
  const [activeTab, setActiveTab] = useState("All")

  const filteredFeed =
    activeTab === "All" ? feed : feed.filter((f) => f.category === activeTab)

  return (
    <div className="bg-background/60 flex h-full flex-col rounded-2xl border border-border p-5 backdrop-blur-xl">
      <div className="mb-4 flex items-center justify-between border-b border-border pb-4">
        <div>
          <h3 className="font-sans text-xs font-bold tracking-wider text-primary uppercase">
            Knowledge Feed
          </h3>
          <p className="font-sans text-[10px] text-primary/60">
            Latest Updates from Across the Universe
          </p>
        </div>
        <Search className="h-4 w-4 text-primary/50" />
      </div>

      <div className="scrollbar-hide mb-4 flex gap-2 overflow-x-auto">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`rounded-md border px-3 py-1 font-mono text-[10px] whitespace-nowrap transition-colors ${
              activeTab === tab
                ? "border-border bg-primary/10 text-primary"
                : "border-border text-primary/60 hover:border-border hover:text-white"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="flex-1 space-y-3">
        {filteredFeed.map((item) => (
          <div
            key={item.id}
            className="flex gap-4 rounded-xl border border-border bg-black/20 p-3 transition-colors hover:border-border hover:bg-black/40"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-border bg-primary/10 text-primary">
              <BookOpen className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="mb-1 truncate font-sans text-sm font-medium text-white">
                {item.title}
              </p>
              <div className="flex items-center justify-between">
                <span className="truncate font-sans text-xs text-primary/60">
                  {item.subtitle}
                </span>
                <span className="shrink-0 rounded bg-primary/10 px-2 py-0.5 font-mono text-[9px] text-primary">
                  {item.category}
                </span>
              </div>
            </div>
            <div className="flex shrink-0 items-end">
              <span className="font-mono text-[9px] text-primary/40">
                {item.time}
              </span>
            </div>
          </div>
        ))}
      </div>

      <button className="mt-4 flex items-center justify-center gap-2 border-t border-border pt-4 font-mono text-[10px] font-medium text-primary uppercase hover:text-primary">
        View All Feed <ArrowRight className="h-3 w-3" />
      </button>
    </div>
  )
}

export { Feed as ErpKnowledgeFeed }

