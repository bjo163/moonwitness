"use client"

import React from "react"
import { ShieldCheck, Activity, Layers, Flame, BookOpen } from "lucide-react"

export function HaditsAnalyticsPanel() {
  return (
    <div className="space-y-4">
      {/* 1. Authenticity Distribution */}
      <div className="rounded-xl border border-border bg-card p-4 shadow-lg">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-success" />
            <span className="font-mono text-xs font-black tracking-wider text-foreground uppercase">
              Authenticity Matrix
            </span>
          </div>
          <span className="font-mono text-[9px] text-success">100% Indexed</span>
        </div>

        <div className="space-y-2">
          {[
            { label: "Sahih (Authentic)", pct: "68%", color: "bg-emerald-500", count: "127,596" },
            { label: "Hasan (Good)", pct: "22%", color: "bg-blue-500", count: "41,281" },
            { label: "Da'if (Weak)", pct: "8%", color: "bg-amber-500", count: "15,011" },
            { label: "Mawdhu' (Fabricated)", pct: "2%", color: "bg-red-500", count: "3,754" },
          ].map((item, i) => (
            <div key={i} className="space-y-1">
              <div className="flex justify-between font-mono text-[9px]">
                <span className="text-foreground/60">{item.label}</span>
                <span className="text-foreground/40">{item.count} ({item.pct})</span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted/30">
                <div className={`h-full ${item.color}`} style={{ width: item.pct }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Top Narrators / Ruwat */}
      <div className="rounded-xl border border-border bg-card p-4 shadow-lg">
        <div className="mb-3 flex items-center gap-2">
          <Layers className="h-4 w-4 text-primary" />
          <span className="font-mono text-xs font-black tracking-wider text-foreground uppercase">
            Top Narrators (Al-Mukthirun)
          </span>
        </div>

        <div className="space-y-2 font-mono text-[10px]">
          {[
            { name: "Abu Hurairah (r.a)", count: "5,374 Hadiths", role: "Sahabi" },
            { name: "Abdullah ibn Umar (r.a)", count: "2,630 Hadiths", role: "Sahabi" },
            { name: "Anas ibn Malik (r.a)", count: "2,286 Hadiths", role: "Sahabi" },
            { name: "Aisyah bint Abi Bakr (r.a)", count: "2,210 Hadiths", role: "Ummul Mukminin" },
            { name: "Abdullah ibn Abbas (r.a)", count: "1,660 Hadiths", role: "Sahabi" },
          ].map((narrator, i) => (
            <div
              key={i}
              className="flex items-center justify-between rounded border border-border bg-card/[0.02] p-2 hover:border-border"
            >
              <div>
                <div className="font-bold text-foreground">{narrator.name}</div>
                <div className="text-[8px] text-primary/70">{narrator.role}</div>
              </div>
              <span className="text-[9px] text-foreground/40">{narrator.count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Prophetic Wisdom Highlight */}
      <div className="relative overflow-hidden rounded-xl border border-border bg-gradient-to-b from-card -background p-4 shadow-lg">
        <div className="mb-2 flex items-center gap-2 text-primary">
          <BookOpen className="h-4 w-4" />
          <span className="font-mono text-[10px] font-black uppercase">Jawami&apos; al-Kalim</span>
        </div>
        <p className="font-arabic mb-2 text-right text-sm text-foreground">
          إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ
        </p>
        <p className="text-[10px] text-foreground/60 italic">
          &ldquo;Actions are judged solely by intentions.&rdquo;
        </p>
        <div className="mt-2 font-mono text-[8px] text-primary/60">
          Sahih Bukhari #1 • Sahih Muslim #1907
        </div>
      </div>
    </div>
  )
}
