"use client"

import React, { useState } from "react"
import { Q4Q_LEVELS, type ScriptureTag } from "./cab-data"

export function EightLevelsTab() {
  const [selected, setSelected] = useState<number | null>(null)

  return (
    <div className="flex flex-col gap-3">
      <div className="rounded-xl border border-white/10 bg-black/40 p-3">
        <p className="font-mono text-[10px] text-white/30">
          8 Level Pengembangan Kesadaran Manusia · Q4Q Standard (700,000 CE) —
          Empat Kitab sebagai fondasi setiap level
        </p>
      </div>

      {Q4Q_LEVELS.map((lvl) => {
        const LvlIcon = lvl.icon
        const isSelected = selected === lvl.level

        return (
          <button
            key={lvl.level}
            onClick={() => setSelected(isSelected ? null : lvl.level)}
            className={`rounded-xl w-full border text-left transition-all duration-200 hover:translate-y-[-1px] ${
              isSelected
                ? `${lvl.border} bg-black/70 shadow-sm`
                : "border-white/5 bg-black/30 hover:border-white/15"
            }`}
          >
            <div className="flex items-center gap-3 p-3">
              <div
                className={`rounded-md flex h-8 w-8 shrink-0 items-center justify-center border ${lvl.border}`}
              >
                <LvlIcon className={`h-4 w-4 ${lvl.color}`} />
              </div>
              <div className="flex flex-1 flex-col">
                <div className="flex items-center gap-2">
                  <span
                    className={`font-mono text-[9px] font-bold ${lvl.color}`}
                  >
                    L{lvl.level} · {lvl.code}
                  </span>
                  <span className="font-mono text-[9px] text-white/30">·</span>
                  <span className="font-mono text-[9px] text-white/40">
                    {lvl.arabicTerm}
                  </span>
                </div>
                <span className="font-sans text-sm font-bold text-white">
                  {lvl.name}
                </span>
              </div>
              <span
                className={`font-mono text-[8px] text-white/20 ${isSelected ? "opacity-100" : ""}`}
              >
                {isSelected ? "▲" : "▼"}
              </span>
            </div>

            {isSelected && (
              <div className="border-t border-white/5 p-4">
                <div className="mb-3">
                  <p className="mb-1 font-mono text-[9px] tracking-widest text-white/30 uppercase">
                    Core Question
                  </p>
                  <p
                    className={`font-sans text-sm font-bold italic ${lvl.color}`}
                  >
                    &quot;{lvl.coreQuestion}&quot;
                  </p>
                </div>
                <p className="mb-4 font-mono text-xs text-white/50">
                  {lvl.desc}
                </p>

                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {[
                    {
                      tag: "Q" as ScriptureTag,
                      label: "QUR'AN (Primary)",
                      ref: lvl.quranRef,
                      color: "text-yellow-400",
                      border: "border-yellow-400/20",
                    },
                    {
                      tag: "T" as ScriptureTag,
                      label: "TORAH (Ref)",
                      ref: lvl.torahRef,
                      color: "text-blue-400",
                      border: "border-blue-400/20",
                    },
                    {
                      tag: "Z" as ScriptureTag,
                      label: "ZABUR (Ref)",
                      ref: lvl.zaburRef,
                      color: "text-emerald-400",
                      border: "border-emerald-400/20",
                    },
                    {
                      tag: "G" as ScriptureTag,
                      label: "GOSPEL (Ref)",
                      ref: lvl.gospelRef,
                      color: "text-red-400",
                      border: "border-red-400/20",
                    },
                  ].map((s) => (
                    <div
                      key={s.tag}
                      className={`rounded-xl border ${s.border} bg-black/40 p-2`}
                    >
                      <p
                        className={`mb-1 font-mono text-[8px] font-bold ${s.color}`}
                      >
                        [{s.tag}] {s.label}
                      </p>
                      <p className="font-mono text-[9px] text-white/50">
                        {s.ref}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </button>
        )
      })}
    </div>
  )
}
