"use client"

import React from "react"
import { Star, ChevronRight, Search, Network, Book, Sparkles, ArrowRight } from "lucide-react"
import { Button, Input } from "@workspace/ui"

const SUGGESTED_QUESTIONS = [
  "What are the signs of the Day of Judgment?",
  "How many verses in the Qur'an about the Moon?",
  "Explain Surah Ar-Rahman",
  "What is the story of Prophet Yunus (AS)?",
  "How to improve my understanding of Qur'an?",
]

export function KhidraConversationSidebar() {
  return (
    <div className="flex flex-col gap-6 lg:col-span-4">
      {/* Conversation Window */}
      <div className="bg-background flex flex-1 flex-col rounded-xl border border-success/30 p-4 shadow-xs">
        <div className="mb-4 text-[10px] font-black tracking-widest text-success uppercase">
          KHIDRA CONVERSATION
        </div>

        {/* Chat History */}
        <div className="mb-4 flex-1 space-y-6 overflow-y-auto pr-2">
          {/* User Message */}
          <div className="flex gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded border border-primary/30 bg-primary/20">
              <div className="h-4 w-4 rounded-full border border-primary bg-primary/40" />
            </div>
            <div className="flex-1">
              <div className="mb-1 text-[10px] font-bold text-primary uppercase">
                YOU
              </div>
              <div className="rounded-lg rounded-tl-xs border border-border bg-muted/40 p-3 text-xs text-foreground">
                What is the significance of the night journey?
              </div>
              <div className="mt-1 text-right font-mono text-[8px] text-muted-foreground">
                06:49 WIB
              </div>
            </div>
          </div>

          {/* Khidra Message */}
          <div className="flex gap-3">
            <div className="bg-background flex h-8 w-8 shrink-0 items-center justify-center rounded border border-success/50 shadow-xs">
              <Star className="h-4 w-4 text-success" />
            </div>
            <div className="flex-1">
              <div className="mb-1 text-[10px] font-bold text-success uppercase">
                KHIDRA
              </div>
              <div className="bg-background space-y-3 rounded-lg rounded-tl-xs border border-success/30 p-3 text-xs leading-relaxed text-foreground shadow-xs">
                <p>
                  The Night Journey (Isra and Mi&apos;raj) is a miraculous journey of Prophet Muhammad ﷺ from Masjid Al-Haram to Masjid Al-Aqsa and then to the heavens.
                </p>
                <p>
                  It signifies the honor of the Prophet ﷺ and the establishment of the five daily prayers.
                </p>
                <p className="font-mono text-[10px] text-success">
                  (Qur&apos;an 17:1)
                </p>
              </div>
              <div className="mt-1 text-right font-mono text-[8px] text-muted-foreground">
                06:50 WIB
              </div>
            </div>
          </div>
        </div>

        {/* Chat Input & Action Chips */}
        <div className="space-y-2">
          <div className="relative">
            <Input
              type="text"
              placeholder="Ask anything..."
              className="bg-background w-full rounded-lg border border-border p-3 pr-10 font-sans text-sm text-foreground transition-colors outline-none hover:border-success/50 focus:border-success"
            />
            <Button type="button" variant="ghost" size="icon" aria-label="Send question" className="absolute top-1/2 right-3 -translate-y-1/2 text-success hover:text-success/80">
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>

          <div className="flex flex-wrap gap-2 text-[9px] font-bold tracking-wider text-muted-foreground uppercase">
            <Button type="button" variant="ghost" className="flex items-center gap-1 rounded border border-border bg-muted/30 px-2 py-1 hover:border-success/50">
              <Search className="h-3 w-3" /> Deep Search
            </Button>
            <Button type="button" variant="ghost" className="flex items-center gap-1 rounded border border-border bg-muted/30 px-2 py-1 hover:border-success/50">
              <Network className="h-3 w-3 text-primary" /> Cross Reference
            </Button>
            <Button type="button" variant="ghost" className="flex items-center gap-1 rounded border border-border bg-muted/30 px-2 py-1 hover:border-success/50">
              <Book className="h-3 w-3 text-warning" /> Sources
            </Button>
            <Button type="button" variant="ghost" className="flex items-center gap-1 rounded border border-border bg-muted/30 px-2 py-1 hover:border-success/50">
              <Sparkles className="h-3 w-3 text-primary" /> Explain More
            </Button>
          </div>
        </div>
      </div>

      {/* Suggested Questions */}
      <div className="bg-background rounded-xl border border-border p-4">
        <div className="mb-3 text-[10px] font-black tracking-widest text-primary uppercase">
          SUGGESTED QUESTIONS
        </div>

        <div className="space-y-1">
          {SUGGESTED_QUESTIONS.map((q, i) => (
            <div
              key={i}
              className="bg-background group flex cursor-pointer items-center justify-between rounded border border-transparent p-2 transition-colors hover:border-success/30 hover:bg-success/5"
            >
              <span className="text-[10px] text-foreground group-hover:text-success">
                {q}
              </span>
              <ArrowRight className="h-3 w-3 text-muted-foreground transition-colors group-hover:text-success" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
