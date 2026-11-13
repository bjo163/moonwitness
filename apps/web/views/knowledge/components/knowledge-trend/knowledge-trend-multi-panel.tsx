"use client"

import React from "react"
import { FileText, Moon, Sun, Globe2, Brain, BookOpen } from "lucide-react"
import { resolveVisualizationColor } from "@workspace/ui"

const POPULAR_QUESTIONS = [
  { q: "When will the Moon be sighted?", c: "12,842" },
  { q: "How is Hilal visibility calculated?", c: "9,721" },
  { q: "What is the true meaning of life?", c: "8,653" },
  { q: "What are the signs of Qiyamah?", c: "7,321" },
  { q: "How was the universe created?", c: "6,128" },
]

const POPULAR_RESEARCH = [
  { n: "Hilal Visibility Algorithm v2.1", c: "10.2K views" },
  { n: "Moon & Tides Correlation Study", c: "8.7K views" },
  { n: "The Night Journey (Isra' Mi'raj)", c: "6.9K views" },
  { n: "Qur'an & Astronomy Connections", c: "5.4K views" },
  { n: "AI for Islamic Knowledge Graph", c: "5.1K views" },
]

const ASTRONOMY_EVENTS = [
  {
    n: "Next New Moon",
    d: "28 May 2025",
    c: "2 days",
    icon: Moon,
    clr: "#00F0FF",
  },
  {
    n: "Annular Solar Eclipse",
    d: "2 Oct 2024",
    c: "129 days",
    icon: Sun,
    clr: "#F59E0B",
  },
  {
    n: "Lunar Eclipse",
    d: "14 Mar 2025",
    c: "250 days",
    icon: Moon,
    clr: "#3B82F6",
  },
  {
    n: "Planetary Alignment",
    d: "23 Aug 2025",
    c: "381 days",
    icon: Globe2,
    clr: "#A855F7",
  },
]

export function KnowledgeTrendMultiPanel() {
  return (
    <div className="grid grid-cols-1 items-stretch gap-4 md:grid-cols-3 lg:grid-cols-5">
      {/* Popular Questions */}
      <div className="bg-background rounded-xl border border-border p-4">
        <div className="mb-4 flex items-center justify-between">
          <div className="text-[9px] font-black tracking-widest text-primary uppercase">
            POPULAR QUESTIONS
          </div>
          <div className="cursor-pointer text-[8px] text-primary hover:text-foreground">
            View All
          </div>
        </div>
        <div className="space-y-3">
          {POPULAR_QUESTIONS.map((q, i) => (
            <div
              key={i}
              className="group flex cursor-pointer items-center justify-between rounded p-1 text-[9px] transition-colors hover:bg-muted/30"
            >
              <div className="flex items-center gap-2 text-foreground group-hover:text-primary">
                <div className="flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full border border-primary/50 text-[7px] text-primary">
                  ?
                </div>
                <span className="w-36 truncate">{q.q}</span>
              </div>
              <span className="font-mono text-primary group-hover:text-foreground">
                {q.c}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Popular Research */}
      <div className="bg-background rounded-xl border border-border p-4">
        <div className="mb-4 flex items-center justify-between">
          <div className="text-[9px] font-black tracking-widest text-primary uppercase">
            POPULAR RESEARCH
          </div>
          <div className="cursor-pointer text-[8px] text-primary hover:text-foreground">
            View All
          </div>
        </div>
        <div className="space-y-3">
          {POPULAR_RESEARCH.map((r, i) => (
            <div
              key={i}
              className="group flex cursor-pointer items-center justify-between rounded p-1 text-[9px] transition-colors hover:bg-muted/30"
            >
              <div className="flex items-center gap-2 text-foreground group-hover:text-primary">
                <FileText className="h-3.5 w-3.5 shrink-0 text-primary group-hover:text-primary" />
                <span className="w-36 truncate">{r.n}</span>
              </div>
              <span className="font-mono text-primary group-hover:text-foreground">
                {r.c}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Popular Astronomy Events */}
      <div className="bg-background rounded-xl border border-border p-4">
        <div className="mb-4 flex items-center justify-between">
          <div className="text-[9px] font-black tracking-widest text-primary uppercase">
            POPULAR ASTRONOMY EVENTS
          </div>
          <div className="cursor-pointer text-[8px] text-primary hover:text-foreground">
            View All
          </div>
        </div>
        <div className="space-y-3">
          {ASTRONOMY_EVENTS.map((ev, i) => (
            <div
              key={i}
              className="group flex cursor-pointer items-center justify-between rounded p-1 text-[9px] transition-colors hover:bg-muted/30"
            >
              <div className="flex items-center gap-2">
                <div className="bg-background flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-border">
                  <ev.icon
                    className="h-3.5 w-3.5"
                    style={{ color: resolveVisualizationColor(ev.clr) }}
                  />
                </div>
                <div>
                  <div className="text-foreground group-hover:text-primary">
                    {ev.n}
                  </div>
                  <div className="text-[8px] text-primary">{ev.d}</div>
                </div>
              </div>
              <span className="font-mono text-foreground group-hover:text-primary">
                {ev.c}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Trending Topics Cloud */}
      <div className="bg-background flex flex-col rounded-xl border border-border p-4">
        <div className="mb-4 text-[9px] font-black tracking-widest text-primary uppercase">
          TRENDING TOPICS CLOUD
        </div>

        <div className="bg-background flex flex-1 flex-wrap items-center justify-center gap-2 rounded-lg border border-border p-2">
          <span className="text-3xl font-black text-primary">Moon</span>
          <span className="text-xl font-bold text-secondary">AI</span>
          <span className="text-success text-2xl font-black">Astronomy</span>
          <span className="text-warning text-lg font-bold">Qur'an</span>
          <span className="text-sm font-bold text-primary">Science</span>
          <span className="text-sm font-bold text-rose-500">History</span>
          <span className="text-xs text-primary">Hadith</span>
          <span className="text-xs text-primary">Faith</span>
          <span className="text-[10px] text-primary">Prophets</span>
          <span className="text-[10px] text-success">Civilization</span>
          <span className="text-[9px] text-warning">Eschatology</span>
          <span className="text-knowledge text-[9px]">Knowledge</span>
        </div>
      </div>

      {/* Weekly Insights */}
      <div className="bg-background flex flex-col rounded-xl border border-border p-4">
        <div className="mb-4 flex items-center justify-between">
          <div className="text-[9px] font-black tracking-widest text-primary uppercase">
            WEEKLY INSIGHTS
          </div>
          <div className="cursor-pointer text-[8px] text-primary hover:text-foreground">
            View All
          </div>
        </div>
        <div className="flex-1 space-y-4">
          <div className="flex items-start gap-3">
            <Moon className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <div className="text-[9px] leading-relaxed text-foreground">
              Interest in{" "}
              <span className="text-primary">Moon observation</span> increased
              42% due to upcoming Hilal season.
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Brain className="text-knowledge mt-0.5 h-4 w-4 shrink-0" />
            <div className="text-[9px] leading-relaxed text-foreground">
              AI-related research is growing rapidly in Islamic knowledge
              exploration.
            </div>
          </div>
          <div className="flex items-start gap-3">
            <BookOpen className="mt-0.5 h-4 w-4 shrink-0 text-success" />
            <div className="text-[9px] leading-relaxed text-foreground">
              Qur'an reflections are most active during evening hours.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
