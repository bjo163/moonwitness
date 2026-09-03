"use client"

import React from "react"
import Image from "next/image"
import Link from "next/link"
import { Book, CheckCircle2, Check } from "lucide-react"

export interface CanonicalScriptureCard {
  id: number | string
  name: string
  original_name: string
  image: string
  subtitle: string
  authentic: boolean
  authLabel: string
  stats: {
    col1: string
    val1: string
    col2: string
    val2: string
    col3: string
    val3: string
  }
  religion: string
  color: string
}

interface KitabCanonicalGridProps {
  cards: CanonicalScriptureCard[]
}

export function KitabCanonicalGrid({ cards }: KitabCanonicalGridProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <div
          key={card.id}
          className="group relative flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-2xl transition-all duration-300 hover:border-blue-500/40"
        >
          {/* Number Badge */}
          <div className="absolute top-3 left-3 z-20 flex h-6 w-6 items-center justify-center rounded border border-warning/30 bg-card text-[10px] font-black text-warning backdrop-blur-md">
            {card.id}
          </div>
          {/* Primary Tag */}
          <div className="absolute top-3 right-3 z-20 rounded border border-blue-500/30 bg-blue-500/20 px-2 py-0.5 text-[8px] font-black text-blue-300 uppercase backdrop-blur-md">
            PRIMARY
          </div>

          {/* Image Cover */}
          <div className="relative flex h-44 w-full items-center justify-center overflow-hidden border-b border-border bg-card">
            <Image
              src={card.image}
              alt={card.name}
              fill
              className="object-cover opacity-80 transition-all duration-[2s] group-hover:scale-110 group-hover:opacity-100"
            />
            <div className="absolute inset-0 bg-gradient-to-t -background to-transparent opacity-80" />
          </div>

          {/* Card Body */}
          <div className="relative z-10 -mt-8 flex flex-1 flex-col items-center p-4 text-center">
            <h2 className="text-xl font-black tracking-widest text-foreground drop-shadow-md">
              {card.name}
            </h2>
            <div className="mb-1 text-[10px] font-black tracking-[0.2em] text-blue-400 uppercase">
              {card.original_name}
            </div>

            <div className="mb-2 text-[10px] text-foreground/50">{card.subtitle}</div>

            {/* Authenticity Badge */}
            <div
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 ${card.authentic ? "border border-success/30 bg-success/10 text-success" : "border border-border bg-muted/30 text-foreground/40"} mb-5 text-[9px] font-black`}
            >
              {card.authentic ? (
                <CheckCircle2 className="h-3 w-3" />
              ) : (
                <Check className="h-3 w-3" />
              )}
              {card.authLabel}
            </div>

            {/* Stats Grid */}
            <div className="mb-4 grid w-full grid-cols-3 gap-1 border-y border-border py-3">
              <div>
                <div className="mb-1 text-[8px] tracking-wider text-foreground/40 uppercase">
                  {card.stats.col1}
                </div>
                <div className="text-xs font-black text-foreground">{card.stats.val1}</div>
              </div>
              <div className="border-x border-border">
                <div className="mb-1 text-[8px] tracking-wider text-foreground/40 uppercase">
                  {card.stats.col2}
                </div>
                <div className="text-xs font-black text-foreground">{card.stats.val2}</div>
              </div>
              <div>
                <div className="mb-1 text-[8px] tracking-wider text-foreground/40 uppercase">
                  {card.stats.col3}
                </div>
                <div className="text-xs font-black text-foreground">{card.stats.val3}</div>
              </div>
            </div>

            {/* Religion Tag */}
            <div className="mb-5 inline-flex w-full items-center justify-center gap-2 rounded bg-blue-500/10 px-3 py-1.5 text-[9px] font-bold text-blue-300/80">
              <Book className="h-3 w-3" />
              {card.religion}
            </div>

            {/* Buttons */}
            <div className="mt-auto flex w-full gap-2">
              <Link
                href={`/knowledge/kitab/${card.id}`}
                className="flex flex-1 items-center justify-center rounded-lg bg-blue-500 py-2 text-[10px] font-black tracking-widest text-foreground shadow-lg shadow-blue-500/20 transition-colors hover:bg-blue-400"
              >
                EXPLORE
              </Link>
              <button className="flex-1 rounded-lg border border-border bg-transparent py-2 text-[10px] font-black tracking-widest text-foreground transition-colors hover:bg-muted/30">
                STUDY
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
