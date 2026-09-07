"use client"

import React from "react"
import { BookOpen, Star, Check } from "lucide-react"
import { Button, NativeSelect, NativeSelectOption } from "@workspace/ui"

interface KitabLeftSidebarProps {
  activeCollection: "all" | "canonical" | "additional"
  onCollectionChange: (collection: "all" | "canonical" | "additional") => void
}

export function KitabLeftSidebar({ activeCollection, onCollectionChange }: KitabLeftSidebarProps) {
  return (
    <div className="w-full flex-shrink-0 space-y-6 lg:w-48">
      <div>
        <h3 className="mb-3 px-2 text-sm font-semibold text-foreground">
          Knowledge menu
        </h3>
        <div className="space-y-1">
          {[
            "Overview",
            "Qur'an (Kahf)",
            "Taurat (Torah)",
            "Zabur (Psalms)",
            "Injil (Gospel)",
            "Other Scriptures",
          ].map((item, i) => {
            const collection = i === 0 ? "all" : i === 5 ? "additional" : "canonical"
            const isActive = activeCollection === collection
            return (
            <Button
              variant="ghost"
              key={i}
              type="button"
              onClick={() => onCollectionChange(collection as "all" | "canonical" | "additional")}
              className={`flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm font-medium transition-colors ${isActive ? "border border-primary/30 bg-primary/10 text-primary" : "text-muted-foreground hover:bg-accent hover:text-foreground"}`}
            >
              <BookOpen
                className={`h-3.5 w-3.5 ${i === 0 ? "text-blue-400" : "text-foreground/30"}`}
              />
              {item}
            </Button>
            )
          })}
        </div>
      </div>

      <div>
        <h3 className="mb-3 px-2 text-sm font-semibold text-foreground">
          Quick access
        </h3>
        <div className="space-y-1">
          {[
            "Ayat of the Day",
            "Hadith Collection",
            "Daily Adhkar",
            "Prophetic Stories",
            "Comparative Study",
            "Research Lab",
          ].map((item, i) => (
            <Button type="button" variant="ghost"
              key={i}
              className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <div className="flex h-4 w-4 items-center justify-center rounded-full bg-blue-500/10">
                <Star className="h-2 w-2 text-blue-400/50" />
              </div>
              {item}
            </Button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="mb-3 px-2 text-sm font-semibold text-foreground">
          Filter
        </h3>
        {["All Languages", "All Topics", "All Periods", "All Traditions"].map((f, i) => (
          <NativeSelect
            key={i}
            className="w-full appearance-none rounded-md border border-border bg-card px-3 py-2 text-sm text-muted-foreground transition-colors outline-none focus:border-primary/50"
          >
            <NativeSelectOption>{f}</NativeSelectOption>
          </NativeSelect>
        ))}
      </div>
    </div>
  )
}

export function KitabRightTimeline() {
  const timelineItems = [
    {
      title: "Taurat",
      year: "~1445 BCE",
      author: "Moses (a.s)",
      color: "amber",
    },
    {
      title: "Zabur",
      year: "~1000 BCE",
      author: "David (a.s)",
      color: "blue",
    },
    {
      title: "Injil",
      year: "~30 CE",
      author: "Jesus (a.s)",
      color: "purple",
    },
    {
      title: "Al-Qur'an",
      year: "610-632 CE",
      author: "Muhammad ﷺ",
      subauthor: "(Final & Universal)",
      color: "emerald",
    },
  ]

  return (
    <div className="w-full flex-shrink-0 space-y-4 lg:w-56">
      <div className="rounded-md border border-border bg-card p-5">
        <h3 className="mb-5 text-sm font-semibold text-foreground">
          Revelation timeline
        </h3>

        <div className="relative space-y-4 before:absolute before:inset-0 before:ml-[15px] before:w-0.5 before:bg-border">
          {timelineItems.map((item, i) => (
            <div key={i} className="group relative flex items-start gap-4">
              <div
                className="z-10 flex h-8 w-8 items-center justify-center rounded-full border-[3px] border-card bg-primary/20 text-primary shadow-sm"
              >
                <BookOpen className="h-3.5 w-3.5" />
              </div>
              <div className="pt-0.5">
                <div className="text-[11px] font-black text-foreground">{item.title}</div>
                <div className="font-mono text-[9px] text-primary">{item.year}</div>
                <div className="text-[9px] text-muted-foreground">{item.author}</div>
                {item.subauthor && (
                  <div className="text-[8px] text-muted-foreground/60">{item.subauthor}</div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 border-t border-border pt-5">
          <div className="mb-2 flex items-center gap-1.5 text-[9px] font-black text-foreground uppercase">
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Final Revelation (Khatam)
          </div>
          <p className="mb-3 text-[9px] leading-relaxed text-muted-foreground">
            Al-Qur&apos;an — Guidance for all humanity.
          </p>
          <ul className="mb-5 space-y-1.5 text-[8.5px] text-muted-foreground">
            <li className="flex items-start gap-1.5">
              <Check className="h-3 w-3 shrink-0 text-success" /> Clarifies & Confirms
            </li>
            <li className="flex items-start gap-1.5">
              <Check className="h-3 w-3 shrink-0 text-success" /> Completes Previous Scriptures
            </li>
            <li className="flex items-start gap-1.5">
              <Check className="h-3 w-3 shrink-0 text-success" /> Preserved Eternally by Allah SWT
            </li>
          </ul>
          <Button type="button" variant="ghost" className="w-full rounded border border-border bg-muted/40 py-1.5 text-[9px] font-black text-foreground uppercase transition-colors hover:bg-muted">
            Learn More
          </Button>
        </div>
      </div>

      {/* Arabic Quote */}
      <div className="relative flex flex-col items-center justify-center overflow-hidden rounded-md border border-border bg-card p-5 text-center">
        <div className="arabic-text relative z-10 mb-2 text-xl text-warning">
          كُلُّ نَفْسٍ ذَائِقَةُ الْمَوْتِ
        </div>
        <p className="relative z-10 text-sm text-muted-foreground italic">
          &ldquo;Every soul will taste death.&rdquo;
          <span className="mt-1 block text-xs text-muted-foreground not-italic">
            (QS. Ali Imran 3:185)
          </span>
        </p>
      </div>
    </div>
  )
}
