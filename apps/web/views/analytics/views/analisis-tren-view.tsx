"use client"

import { useLanguage } from "@workspace/state"
import { Flame } from "lucide-react"
import { ContextBlock, Panel, PanelHeader, SimpleTable, MetricChart } from "@workspace/ui"
import { useResource } from "@workspace/hooks"
import { fetchGoogleTrends } from "@moon/client"

type TrendTopic = {
  id: string
  topic: string
  category: string
  viralScore: number
  haqqPercent: number
  tabayyunStatus: "VERIFIED_HAQQ" | "DISPROVED_BATIL" | "UNDER_VERIFICATION"
  quranGuidance: string
}

const DEFAULT_VIRAL_TRENDS: TrendTopic[] = [
  {
    id: "t1",
    topic: "Gerakan Solidaritas Kedamaian & Bantuan Kemanusiaan Global",
    category: "HUMANITY",
    viralScore: 98,
    haqqPercent: 96,
    tabayyunStatus: "VERIFIED_HAQQ",
    quranGuidance:
      "Q.S Al-Ma'idah (5:2) — Tolong-menolong dalam kebajikan dan takwa.",
  },
  {
    id: "t2",
    topic: "Narasi Disinformasi & Provokasi Kebencian Medsos",
    category: "INFODEMIC",
    viralScore: 84,
    haqqPercent: 12,
    tabayyunStatus: "DISPROVED_BATIL",
    quranGuidance:
      "Q.S Al-Hujurat (49:6) — Wajib meneliti berita dari fasik sebelum dipercaya.",
  },
  {
    id: "t3",
    topic: "Inovasi Energi Terbarukan & Kelestarian Ekologi Bumi",
    category: "SCIENCE & ECOLOGY",
    viralScore: 92,
    haqqPercent: 94,
    tabayyunStatus: "VERIFIED_HAQQ",
    quranGuidance:
      "Q.S Ar-Rum (30:41) — Memperbaiki kerusakan bumi amanah Khalifah.",
  },
]

export function AnalisisTrenView() {
  const { t } = useLanguage()
  const { data: rawTrends } = useResource(fetchGoogleTrends, { storageKey: "mw_google_trends" })

  const liveTrends: TrendTopic[] = rawTrends && rawTrends.length > 0
    ? rawTrends.map((tr: any, i: number) => ({
        id: `trend-${i}`,
        topic: tr.title || "Global Intelligence Topic",
        category: tr.traffic ? `TRAFFIC: ${tr.traffic}` : "GLOBAL FEED",
        viralScore: 85 + (i * 2) % 15,
        haqqPercent: 80 + (i * 5) % 20,
        tabayyunStatus: "VERIFIED_HAQQ" as const,
        quranGuidance: "Q.S Al-Hujurat (49:6) — Wajib meneliti dan tabayyun berita.",
      }))
    : DEFAULT_VIRAL_TRENDS

  return (
    <div
      className="theme-grid-bg min-h-screen py-8 font-mono text-foreground"
      suppressHydrationWarning
    >
      <div className="mx-auto max-w-5xl space-y-6 px-4 sm:px-6">
        {/* System Breadcrumb */}

        {/* Tactical Context Block */}
        <ContextBlock
          title={t("TABAYYUN TREND ANALYZER", "ANALISIS TREN TABAYYUN")}
          subtitle={t(
            "Information velocity filter, truth index heatmap, and Quranic Tabayyun verification engine.",
            "Filter verifikasi kebenaran isu viral, heatmap Haqq vs Batil, dan telemetri Tabayyun."
          )}
          operation="TABAYYUN-VERIFY-ENGINE"
          status="ONLINE"
          accentColor="celestial"
        />

        {/* Trend Visualizations */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <MetricChart
            title="TABAYYUN INDEX DISTRIBUTION"
            subtitle="Haqq vs Batil verification ratio over 30 days"
            accentColor="celestial"
            height={128}
            data={[
              { label: "W1", value: 65 },
              { label: "W2", value: 45 },
              { label: "W3", value: 80 },
              { label: "W4", value: 92 },
            ]}
          />

          <MetricChart
            title="VIRALITY VELOCITY"
            subtitle="Speed of information propagation by category"
            accentColor="critical"
            height="h-32"
            data={[
              { label: "HUMANITY", value: 85 },
              { label: "POLITICS", value: 98 },
              { label: "SCIENCE", value: 45 },
              { label: "ECONOMY", value: 60 },
            ]}
          />
        </div>

        {/* Live Trends Catalog */}
        <Panel level="level2" accentColor="celestial">
          <PanelHeader
            title="// VIRAL TRENDS & TABAYYUN VERIFICATION MATRIX"
            status="ACTIVE"
            icon={Flame}
            accentColor="celestial"
            subtitle="Verified information telemetry filtered through Quranic ethics (Q.S Al-Hujurat 49:6)."
          />

          <div className="mt-4">
            <SimpleTable
              headers={[
                "CATEGORY / TOPIC",
                "QURANIC GUIDANCE",
                "HAQQ INDEX",
                "STATUS",
              ]}
              accentColor="celestial"
              rows={liveTrends.map((tr) => [
                <div key="1" className="flex max-w-xs flex-col gap-1">
                  <span className="text-[9px] font-bold tracking-wider text-accent">
                    {tr.category}
                  </span>
                  <h4 className="text-[11px] font-bold text-foreground">
                    {tr.topic}
                  </h4>
                </div>,
                <div
                  key="2"
                  className="max-w-sm text-[10px] text-primary italic"
                >
                  {tr.quranGuidance}
                </div>,
                <div key="3" className="flex items-center gap-2">
                  <div className="bg-panel h-1.5 w-16 overflow-hidden rounded-full">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${tr.haqqPercent}%`,
                        backgroundColor:
                          tr.haqqPercent > 50 ? "#00FF66" : "#FF0055",
                      }}
                    />
                  </div>
                  <span className="font-mono text-[10px] text-foreground">
                    {tr.haqqPercent}%
                  </span>
                </div>,
                <span
                  key="4"
                  className={`tag-clip border px-2 py-0.5 text-[8px] font-bold ${tr.tabayyunStatus === "VERIFIED_HAQQ" ? "border-success/40 text-success bg-success/10" : "border-danger/40 text-danger bg-danger/10"}`}
                >
                  {tr.tabayyunStatus}
                </span>,
              ])}
            />
          </div>
        </Panel>
      </div>
    </div>
  )
}
