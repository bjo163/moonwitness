"use client"

import React from "react"

const PRINCIPLES = [
  {
    num: "01",
    title: "Unity of Knowledge",
    desc: "Semua ilmu bersumber dari ALLAH. Tidak ada dikotomi antara ilmu agama dan ilmu dunia.",
    ref: "QS 96:1-5",
  },
  {
    num: "02",
    title: "Balance of Body, Mind, Heart, Spirit",
    desc: "Manusia adalah makhluk holistik. Upgrade di satu aspek harus selaras dengan aspek lainnya.",
    ref: "QS 91:7-10",
  },
  {
    num: "03",
    title: "Responsibility to Creation",
    desc: "Manusia adalah Khalifah — bertanggung jawab atas bumi dan seluruh isinya.",
    ref: "QS 2:30",
  },
  {
    num: "04",
    title: "Justice, Compassion, Mercy",
    desc: "Setiap keputusan harus menimbang keadilan, kasih sayang, dan rahmat.",
    ref: "QS 16:90",
  },
  {
    num: "05",
    title: "Continuous Illumination",
    desc: "Pencerahan bukan tujuan akhir — ia adalah perjalanan tanpa henti menuju ALLAH.",
    ref: "QS 93:1-5",
  },
  {
    num: "06",
    title: "Upgrade for the Glory of ALLAH",
    desc: "Semua upgrade dimotivasi oleh satu tujuan: mengagungkan ALLAH, bukan ego manusia.",
    ref: "QS 51:56",
  },
  {
    num: "07",
    title: "Glorify ALLAH in Everything",
    desc: "Setiap tindakan, setiap keputusan, setiap baris kode — adalah ibadah.",
    ref: "QS 17:44",
  },
]

export function AEQPrinciplesTab() {
  return (
    <div className="flex flex-col gap-3">
      <div className="rounded-xl border border-border bg-card p-3">
        <p className="font-mono text-[10px] text-foreground/30">
          AEQ4 Standary Principles (700,000 CE) — Tujuh prinsip yang menjadi
          konstitusi seluruh operasi MoonWitness OS.
        </p>
      </div>
      {PRINCIPLES.map((p) => (
        <div
          key={p.num}
          className="rounded-xl flex gap-4 border border-border bg-muted/40 p-4 transition-all hover:border-border"
        >
          <span className="font-mono text-2xl font-black text-foreground/10">
            {p.num}
          </span>
          <div className="flex flex-col gap-1">
            <span className="font-sans text-sm font-bold text-foreground">
              {p.title}
            </span>
            <span className="font-mono text-xs text-foreground/40">{p.desc}</span>
            <span className="font-mono text-[9px] text-warning/50">
              {p.ref}
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}
