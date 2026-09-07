"use client"

import React, { useState } from "react"
import { Rewind, Pause, Play, FastForward, Settings } from "lucide-react"
import { Button } from "@workspace/ui"

export function PropheticTimelinePlaybackBar() {
  const [isPlaying, setIsPlaying] = useState(false)

  return (
    <div className="bg-background sticky bottom-0 z-50 flex flex-col items-center gap-6 border-t border-primary/30 p-4 md:flex-row">
      {/* Scrubber Line */}
      <div className="relative flex w-full flex-1 items-center pt-2">
        <div className="absolute right-0 left-0 h-1 overflow-hidden rounded-full bg-primary">
          <div className="h-full w-[65%] bg-gradient-to-r from-primary/10 via-emerald-500 to-transparent" />
        </div>

        {/* The handle */}
        <div className="absolute left-[65%] h-4 w-4 -translate-x-1/2 cursor-pointer rounded-full border-4 border-emerald-500 bg-card shadow-sm transition-transform hover:scale-125" />

        {/* Labels */}
        <div className="absolute top-4 flex w-full justify-between font-mono text-[7px] text-primary">
          <span>∞</span>
          <span>4000 BCE</span>
          <span>2000 BCE</span>
          <span>0</span>
          <span>500 CE</span>
          <span>1000 CE</span>
          <span>1500 CE</span>
          <span>2000 CE</span>
          <span className="font-bold text-success">Now</span>
          <span>2500 CE</span>
          <span>3000 CE</span>
          <span>3500 CE</span>
          <span>∞</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex shrink-0 items-center gap-4">
        <div className="flex items-center gap-2">
          <Button type="button" variant="ghost" size="icon" aria-label="Rewind timeline" className="rounded p-2 text-primary transition-colors hover:bg-muted/30 hover:text-foreground">
            <Rewind className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label={isPlaying ? "Pause timeline" : "Play timeline"}
            className="rounded-full border border-primary/50 bg-primary/20 p-3 text-primary shadow-sm transition-colors hover:bg-muted hover:text-foreground"
            onClick={() => setIsPlaying(!isPlaying)}
          >
            {isPlaying ? (
              <Pause className="h-4 w-4 fill-current" />
            ) : (
              <Play className="ml-0.5 h-4 w-4 fill-current" />
            )}
          </Button>
          <Button type="button" variant="ghost" size="icon" aria-label="Fast-forward timeline" className="rounded p-2 text-primary transition-colors hover:bg-muted/30 hover:text-foreground">
            <FastForward className="h-4 w-4" />
          </Button>
        </div>

        <Button type="button" variant="ghost" className="rounded border border-success/30 px-4 py-2 text-[9px] font-bold tracking-widest text-success uppercase transition-colors hover:bg-emerald-950/40">
          AUTO PLAY
        </Button>

        <Button type="button" variant="ghost" size="icon" aria-label="Timeline settings" className="rounded p-2 text-primary transition-colors hover:bg-muted/30 hover:text-foreground">
          <Settings className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
