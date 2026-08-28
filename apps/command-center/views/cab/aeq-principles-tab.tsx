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
      <div className="clip-card border border-white/10 bg-black/40 p-3">
        <p className="font-mono text-[10px] text-white/30">
          AEQ4 Standary Principles (700,000 CE) — Tujuh prinsip yang menjadi
          konstitusi seluruh operasi MoonWitness OS.
        </p>
      </div>
      {PRINCIPLES.map((p) => (
        <div
          key={p.num}
          className="clip-card flex gap-4 border border-white/5 bg-black/30 p-4 transition-all hover:border-white/15"
        >
          <span className="font-mono text-2xl font-black text-white/10">
            {p.num}
          </span>
          <div className="flex flex-col gap-1">
            <span className="font-sans text-sm font-bold text-white">
              {p.title}
            </span>
            <span className="font-mono text-xs text-white/40">{p.desc}</span>
            <span className="font-mono text-[9px] text-yellow-400/50">
              {p.ref}
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}
