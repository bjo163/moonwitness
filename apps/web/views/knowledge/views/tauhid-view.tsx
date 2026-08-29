"use client"

import { useLanguage } from "@workspace/state"
import { ContextBlock } from "@workspace/ui"

export function TauhidPortalView() {
  const { t } = useLanguage()

  const tauhidPillars = [
    {
      title: "Tauhid Rububiyyah",
      desc: t(
        "Believing that Allah SWT is the Sole Creator, Sovereign Owner, Controller, and Sustainer of the entire universe.",
        "Meyakini bahwa Allah SWT adalah satu-satunya Pencipta, Pemilik, Pengatur, dan Pemelihara seluruh alam semesta."
      ),
    },
    {
      title: "Tauhid Uluhiyyah",
      desc: t(
        "Believing and declaring Allah SWT as the Only God worthy of worship and devotion without partners.",
        "Meyakini dan mengesakan Allah SWT sebagai satu-satunya Tuhan yang berhak disembah dan diibadahi tanpa sekutu."
      ),
    },
    {
      title: "Tauhid Asma' wa Sifat",
      desc: t(
        "Believing in all perfect Names and Attributes of Allah SWT as affirmed in the Holy Qur'an and Sunnah.",
        "Meyakini nama-nama dan sifat-sifat Allah SWT yang sempurna sebagaimana yang Dia tetapkan dalam Al-Qur'an dan Sunnah."
      ),
    },
  ]

  return (
    <div className="theme-grid-bg min-h-screen py-8 font-mono text-foreground">
      <div className="mx-auto max-w-5xl space-y-6 px-4 sm:px-6">
        <ContextBlock
          title={t(
            "TAUHID PRINCIPLES & MONOTHEISM",
            "PRINSIP TAUHID & MONOTEISME"
          )}
          subtitle={t(
            "The core essence of all divine revelations throughout human history: declaring the pure Oneness of the Almighty Creator without partners.",
            "Inti ajaran dari seluruh wahyu Ilahi yang diturunkan kepada para Nabi dan Rasul sepanjang sejarah manusia: mengesakan Tuhan Yang Maha Kuasa tanpa sekutu."
          )}
          operation="TAUHID-PILLARS-SYNC"
          status="ONLINE"
          accentColor="knowledge"
        />

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {tauhidPillars.map((pillar, idx) => (
            <div
              key={pillar.title}
              className="flex flex-col justify-between space-y-4 rounded-xl border border-border/40 bg-card p-6 shadow-sm"
            >
              <div>
                <div className="mb-4 flex items-center justify-between">
                  <span className="rounded-md border border-amber-500/40 bg-amber-500/10 text-amber-500 px-2 py-0.5 font-mono text-[9px]">
                    PILLAR 0{idx + 1}
                  </span>
                  <span className="font-bold text-accent">☝️</span>
                </div>
                <h3 className="mb-2 text-lg font-black tracking-wider text-foreground uppercase">
                  {pillar.title}
                </h3>
                <p className="text-xs leading-relaxed text-primary">
                  {pillar.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
