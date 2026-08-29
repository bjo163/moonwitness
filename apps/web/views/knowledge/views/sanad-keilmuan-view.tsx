"use client"

import { useLanguage } from "@workspace/state"
import { ContextBlock } from "@workspace/ui"
import { useModelRecords } from "@workspace/hooks"

type ScholarNode = {
  generation: string
  name: string
  title: string
  era: string
  role: string
}

const DEFAULT_SCHOLAR_SANAD_NODES: ScholarNode[] = [
  {
    generation: "ERA 0 (SUMBER WAHYU)",
    name: "PROPHET MUHAMMAD SAW",
    title: "Rahmatan lil 'Alamin",
    era: "571 - 632 M",
    role: "Penerima Wahyu Al-Qur'an & Sumber Sunnah Nabawi",
  },
  {
    generation: "ERA 1 (PARASAHABAT)",
    name: "ABDULLAH IBN MAS'UD R.A.",
    title: "Faqih ash-Sahabah",
    era: "Wafat 32 H",
    role: "Rantai Sanad Utama Tafsir & Fiqih Kufah",
  },
  {
    generation: "ERA 2 (TABI'IN)",
    name: "AL-HASAN AL-BASRI & AL-QAMA",
    title: "Imam at-Tabi'in",
    era: "Wafat 110 H",
    role: "Transmisi Keilmuan Hadits & Fiqih Tabi'in",
  },
  {
    generation: "ERA 3 (IMAM MAZHAB)",
    name: "IMAM ABU HANIFAH & IMAM MALIK",
    title: "Imam al-A'zam & Imam Daril Hijrah",
    era: "80 - 179 H",
    role: "Penyusun Mazhab Fiqih Klasik & Kitab Al-Muwatta",
  },
  {
    generation: "ERA 4 (IMAM SYAFI'I)",
    name: "IMAM MUHAMMAD IBN IDRIS ASY-SYAFI'I",
    title: "Nasir as-Sunnah",
    era: "150 - 204 H",
    role: "Penyusun Kitab Ar-Risalah (Usul Fiqih) & Al-Umm",
  },
]

export function SanadKeilmuanView() {
  const { t } = useLanguage()
  const { records: figureRecords } = useModelRecords("wx.figure", { limit: 10 })

  const scholarNodes: ScholarNode[] = figureRecords.length > 0
    ? figureRecords.map((f: any, idx: number) => ({
        generation: `GEN ${idx + 1} (${f.tradition || "TRANSMISI"})`,
        name: String(f.name || "").toUpperCase(),
        title: f.notes ? f.notes.split(".")[0] : (DEFAULT_SCHOLAR_SANAD_NODES[idx]?.title || "Ulama & Sanad"),
        era: f.lifeStart ? `${f.lifeStart} – ${f.lifeEnd || "M"}` : (DEFAULT_SCHOLAR_SANAD_NODES[idx]?.era || "Era Klasik"),
        role: f.notes || (DEFAULT_SCHOLAR_SANAD_NODES[idx]?.role || "Transmisi Keilmuan Shahih"),
      }))
    : DEFAULT_SCHOLAR_SANAD_NODES

  return (
    <div
      className="theme-grid-bg min-h-screen py-10 font-mono text-foreground"
      suppressHydrationWarning
    >
      <div className="mx-auto max-w-4xl space-y-6 px-4 sm:px-6">
        <ContextBlock
          title="VISUALIZER SILSILAH SANAD KEILMUAN ISLAM"
          subtitle="Pemetaan taktis rantai silsilah transmisi keilmuan Al-Qur'an, Hadits, dan Fiqih yang menyambung tanpa terputus (Isnad Mutassil) dari Rasulullah SAW hingga para Imam Mujtahid."
          operation="ISLAMIC-SANAD-NETWORK"
          status="ONLINE"
          accentColor="success"
        />

        {/* Sanad Nodes Timeline */}
        <div className="before:bg-success/30 relative space-y-4 before:absolute before:top-2 before:bottom-2 before:left-4 before:w-0.5">
          {scholarNodes.map((node, idx) => (
            <div key={idx} className="relative pl-10">
              <div className="bg-success border-panel absolute top-3 left-2 h-4 w-4 animate-pulse rounded-full border-2" />

              <div className="panel-box border-success/40 bg-space tag-clip space-y-2 border p-5">
                <div className="flex items-center justify-between text-[10px] font-bold text-primary">
                  <span className="text-success">
                    {/* {node.generation} */}
                  </span>
                  <span>{node.era}</span>
                </div>

                <h3 className="font-display text-base font-black text-foreground">
                  {node.name}
                </h3>
                <span className="clip-tag border border-cyber-yellow/40 bg-cyber-yellow/10 text-cyber-yellow px-2 py-0.5 font-mono text-[9px] font-bold">
                  {node.title}
                </span>

                <p className="pt-1 text-xs leading-relaxed text-primary">
                  {node.role}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
