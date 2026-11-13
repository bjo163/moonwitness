"use client"

import React from "react"

export function KhidraHeader({ clockWIB }: { clockWIB: string }) {
  return (
    <div className="flex flex-col justify-between gap-6 border-b border-border pb-6 xl:flex-row xl:items-start">
      <div className="max-w-2xl space-y-4">
        <div className="bg-background inline-flex items-center gap-3 rounded-sm border-2 border-success/60 px-3.5 py-1.5 text-xs font-black tracking-[0.25em] text-success uppercase shadow-xs">
          <span className="rounded-xs bg-success px-1.5 py-0.5 font-black text-foreground">
            10
          </span>
          <span>KHIDRA AI</span>
        </div>
        <h2 className="font-mono text-xl font-black tracking-widest text-foreground uppercase drop-shadow-sm sm:text-3xl">
          YOUR DIVINE KNOWLEDGE COMPANION
        </h2>
        <div className="max-w-xl font-sans text-xs leading-relaxed text-muted-foreground">
          Khidra is an AI companion designed to assist you in exploring the vast knowledge of the Qur&apos;an, Hadith, History, Astronomy, and more. Ask anything. Discover deeper.
        </div>
      </div>

      <div className="border-b-2 border-success bg-gradient-to-t from-success/10 to-transparent p-4 text-center xl:text-left rounded-lg">
        <div className="font-arabic mb-2 text-sm font-bold text-success" dir="rtl">
          وَعَلَّمْنَاهُ مِن لَّدُنَّا عِلْمًا
        </div>
        <div className="font-sans text-[11px] text-muted-foreground italic">
          &quot;And We taught him knowledge from Our presence.&quot;{" "}
          <span className="mt-1 ml-1 block font-mono font-black text-success not-italic xl:mt-0 xl:inline">
            Qur&apos;an 18:65
          </span>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-6">
        <div className="text-right">
          <div className="font-mono text-2xl font-black tracking-widest text-foreground drop-shadow-sm">
            {clockWIB}
          </div>
          <div className="mt-1 text-[9px] font-bold text-success uppercase">
            25 MAY 2025 // 27 DHU AL-QI&apos;DAH 1446
          </div>
          <div className="mt-0.5 text-[9px] tracking-widest text-muted-foreground uppercase">
            SYSTEM TIME UTC+7
          </div>
        </div>

        <div className="h-14 w-px bg-muted/30" />

        <div className="relative flex h-16 w-16 items-center justify-center">
          <div
            className="absolute inset-0 rounded-full border border-success/20"
            style={{ transform: "rotateX(70deg) rotateY(20deg)" }}
          />
          <div
            className="absolute inset-0 rounded-full border border-primary/20"
            style={{ transform: "rotateX(70deg) rotateY(-20deg)" }}
          />
          <div className="h-4 w-4 animate-pulse rounded-full bg-success shadow-xs" />
        </div>
      </div>
    </div>
  )
}
