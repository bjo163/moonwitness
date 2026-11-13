"use client"

import React from "react"
import { Button } from "@workspace/ui"
import { Moon, BookOpen, FileText, Brain } from "lucide-react"
import { Timeline, TimelineItem } from "@workspace/ui"

export function RecentActivity() {
  const activities = [
    {
      title: "Submitted Moon Observation",
      description: "Moon Phase - Waning Crescent 12.4%",
      date: "Today",
      time: "06:45 WIB",
      icon: <Moon className="h-4 w-4" />,
      tag: "Observatory",
    },
    {
      title: "Studied Qur'an Verse",
      description: "Surah Al-Mulk (67:3-5)",
      date: "Today",
      time: "05:12 WIB",
      icon: <BookOpen className="h-4 w-4" />,
      tag: "Scripture",
    },
    {
      title: "Completed Research Paper",
      description: "The Miracle of the Moon in Qur'an",
      date: "Yesterday",
      time: "22:30 WIB",
      icon: <FileText className="h-4 w-4" />,
      tag: "Research",
    },
    {
      title: "AI Discussion with KHIDRA",
      description: "Astronomical alignment in ancient times",
      date: "Yesterday",
      time: "15:48 WIB",
      icon: <Brain className="h-4 w-4" />,
      tag: "KHIDRA AI",
    },
  ]

  return (
    <div className="h-full rounded-md border border-border bg-card p-6 shadow-xs text-card-foreground">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="font-sans text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Recent Activity
        </h3>
        <Button type="button" variant="link" className="font-sans text-xs font-medium text-primary hover:underline">
          View All
        </Button>
      </div>

      <Timeline>
        {activities.map((act, i) => (
          <TimelineItem
            key={i}
            date={act.date}
            time={act.time}
            title={act.title}
            description={act.description}
            icon={act.icon}
            tag={act.tag}
          />
        ))}
      </Timeline>
    </div>
  )
}
