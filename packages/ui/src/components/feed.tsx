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
    <div className="flex h-full flex-col rounded-xl border border-border bg-card p-5 text-card-foreground shadow-sm">
      <div className="mb-4 flex items-center justify-between border-b border-border pb-3">
        <div>
          <h3 className="font-sans text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Knowledge Feed
          </h3>
          <p className="font-sans text-[11px] text-muted-foreground">
            Recent updates across categories
          </p>
        </div>
        <Search className="h-4 w-4 text-muted-foreground" />
      </div>

      <div className="scrollbar-hide mb-4 flex gap-1.5 overflow-x-auto pb-1">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`rounded-md border px-2.5 py-1 font-sans text-xs font-medium whitespace-nowrap transition-colors ${
              activeTab === tab
                ? "border-border bg-accent text-accent-foreground font-semibold shadow-sm"
                : "border-border text-muted-foreground hover:bg-accent hover:text-foreground"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="flex-1 space-y-2.5">
        {filteredFeed.map((item) => (
          <div
            key={item.id}
            className="flex gap-3.5 rounded-lg border border-border bg-muted/20 p-3 transition-colors hover:bg-accent/40"
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-border bg-card text-primary shadow-sm">
              <BookOpen className="h-4 w-4" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="mb-0.5 truncate font-sans text-xs font-semibold text-foreground">
                {item.title}
              </p>
              <div className="flex items-center justify-between">
                <span className="truncate font-sans text-[11px] text-muted-foreground">
                  {item.subtitle}
                </span>
                <span className="shrink-0 rounded border border-border bg-muted px-1.5 py-0.5 font-sans text-[10px] text-foreground">
                  {item.category}
                </span>
              </div>
            </div>
            <div className="flex shrink-0 items-end">
              <span className="font-mono text-[10px] text-muted-foreground">
                {item.time}
              </span>
            </div>
          </div>
        ))}
      </div>

      <button className="mt-4 flex items-center justify-center gap-1.5 border-t border-border pt-3 font-sans text-xs font-medium text-primary hover:underline">
        View All Updates <ArrowRight className="h-3 w-3" />
      </button>
    </div>
  )
}

export { Feed as ErpKnowledgeFeed }
