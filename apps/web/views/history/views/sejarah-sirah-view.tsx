"use client"

import { useState } from "react"
import { MapPin } from "lucide-react"
import { ContextBlock } from "@workspace/ui"
import { useModelRecords } from "@workspace/hooks"

type SirahEvent = {
  yearStr: string
  title: string
  location: string
  geoCoordinates: string
  description: string
  scriptureRef: string
  category: string
}

const DEFAULT_SIRAH_EVENTS: SirahEvent[] = [
  {
    yearStr: "610 M (1 Sebelum Hijriyah)",
    title: "Turunnya Wahyu Pertama di Gua Hira",
    location: "Jabal An-Nur, Makkah Al-Mukarramah",
    geoCoordinates: "21.4574° N, 39.8592° E",
    description:
      "Malaikat Jibril a.s. menyampaikan wahyu pertama lima ayat pertama Surah Al-'Alaq kepada Rasulullah SAW.",
    scriptureRef: "Q.S Al-'Alaq (96:1-5)",
    category: "WAHYU",
  },
  {
    yearStr: "621 M (3 Tahun Sebelum Hijriyah)",
    title: "Peristiwa Mukjizat Isra' Mi'raj",
    location: "Makkah ➔ Masjid Al-Aqsa (Yerusalem) ➔ Sidratul Muntaha",
    geoCoordinates: "31.7780° N, 35.2354° E",
    description:
      "Perjalanan malam ajaib dari Masjidil Haram ke Masjidil Aqsa dan naik menembus 7 langit menerima perintah Shalat 5 Waktu.",
    scriptureRef: "Q.S Al-Isra' (17:1) & An-Najm (53:13-18)",
    category: "MUKJIZAT",
  },
  {
    yearStr: "622 M (1 Hijriyah)",
    title: "Peristiwa Hijrah Agung ke Yatsrib (Madinah)",
    location: "Makkah ➔ Gua Thawr ➔ Quba ➔ Madinah Munawwarah",
    geoCoordinates: "24.4672° N, 39.6112° E",
    description:
      "Migrasi bersejarah umat Islam meletakkan batu pertama peradaban Madinah Munawwarah dan penetapan Kalender Hijriyah.",
    scriptureRef: "Q.S At-Taubah (9:40)",
    category: "HIJRAH",
  },
  {
    yearStr: "624 M (17 Ramadan 2 H)",
    title: "Perang Badr Al-Kubra (Kemenangan Al-Furqan)",
    location: "Lembah Badr (130 KM Selatan Madinah)",
    geoCoordinates: "23.7844° N, 38.7905° E",
    description:
      "Kemenangan menentukan 313 pasukan Muslimin melawan 1.000 pasukan Quraisy dengan bantuan malaikat yang diutus Allah.",
    scriptureRef: "Q.S Ali 'Imran (3:123) & Al-Anfal (8:9)",
    category: "PERANG",
  },
  {
    yearStr: "630 M (20 Ramadan 8 H)",
    title: "Fathu Makkah (Pembebasan Kota Makkah)",
    location: "Kota Makkah Al-Mukarramah",
    geoCoordinates: "21.4225° N, 39.8262° E",
    description:
      "Pembebasan damai kota suci Makkah dan pembersihan Ka'bah dari 360 berhala tanpa pertumpahan darah besar.",
    scriptureRef: "Q.S An-Nasr (110:1-3)",
    category: "PEMBEBASAN",
  },
]

export function SejarahSirahView() {
  const { records: eventRecords } = useModelRecords("wx.figure", { limit: 10 })

  const sirahEvents: SirahEvent[] = eventRecords.length > 0
    ? eventRecords.map((e: any, idx: number) => ({
        yearStr: e.lifeStart ? `${e.lifeStart} – ${e.lifeEnd || "M"}` : (DEFAULT_SIRAH_EVENTS[idx]?.yearStr || "Era Sirah"),
        title: e.name || DEFAULT_SIRAH_EVENTS[idx]?.title || "Peristiwa Sejarah",
        location: e.notes ? e.notes.split(",")[0] : (DEFAULT_SIRAH_EVENTS[idx]?.location || "Makkah / Madinah"),
        geoCoordinates: DEFAULT_SIRAH_EVENTS[idx]?.geoCoordinates || "21.4225° N, 39.8262° E",
        description: e.notes || (DEFAULT_SIRAH_EVENTS[idx]?.description || "Catatan peristiwa sejarah peradaban."),
        scriptureRef: DEFAULT_SIRAH_EVENTS[idx]?.scriptureRef || "Q.S Al-Ahzab",
        category: DEFAULT_SIRAH_EVENTS[idx]?.category || "SEJARAH",
      }))
    : DEFAULT_SIRAH_EVENTS

  const [selectedEvent, setSelectedEvent] = useState<SirahEvent>(
    sirahEvents[0]!
  )

  return (
    <div
      className="theme-grid-bg min-h-screen py-10 font-mono text-foreground"
      suppressHydrationWarning
    >
      <div className="mx-auto max-w-5xl space-y-6 px-4 sm:px-6">
        <ContextBlock
          title="PEMETAAN GEOSPASIAL SIRAH NABAWIYAH"
          subtitle="Kronologi historis dan visualisasi titik koordinat geografis dari perjalanan hidup dan misi kenabian Rasulullah SAW (Sirah Nabawiyah)."
          operation="SEERAH-GEOSPATIAL-MAPPING"
          status="ONLINE"
          accentColor="success"
        />

        {/* Selected Event Telemetry Panel */}
        {selectedEvent && (
          <div className="panel-box bg-space/95 space-y-4 border border-primary/50 p-6 shadow-[0_0_30px_rgba(0,240,255,0.2)]">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-primary/20 pb-3">
              <div className="font-display flex items-center gap-2">
                <MapPin className="text-success h-5 w-5" />
                <h3 className="text-base font-black text-primary">
                  {selectedEvent.title}
                </h3>
              </div>
              <span className="clip-tag border border-cyber-green/40 bg-cyber-green/10 text-cyber-green px-3 py-1 font-mono text-xs font-bold">
                {selectedEvent.yearStr}
              </span>
            </div>

            <div className="grid grid-cols-1 gap-3 text-xs sm:grid-cols-2">
              <div className="bg-space tag-clip border border-primary/20 p-3">
                <span className="block text-[9px] text-primary">
                  {/* LOKASI GEOGRAFIS */}
                </span>
                <span className="font-bold text-foreground">
                  {selectedEvent.location}
                </span>
                <span className="text-success mt-0.5 block text-[9px]">
                  GEO: {selectedEvent.geoCoordinates}
                </span>
              </div>

              <div className="bg-space tag-clip border border-primary/20 p-3">
                <span className="block text-[9px] text-primary">
                  {/* RUJUKAN AYAT & MANUSKRIP */}
                </span>
                <span className="font-bold text-accent">
                  {selectedEvent.scriptureRef}
                </span>
              </div>
            </div>

            <p className="bg-space border border-primary/15 p-3 font-mono text-xs leading-relaxed text-primary">
              &gt; {selectedEvent.description}
            </p>
          </div>
        )}

        {/* Historical Events Grid Timeline */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-primary">
            <span>{/* SIMULASI GARIS WAKTU PERISTIWA HISTORIS */}</span>
            <span className="text-[10px] text-primary">
              KLIK EVENT UNTUK RINCIAN TAKTIS
            </span>
          </div>

          <div className="space-y-2.5">
            {sirahEvents.map((ev, idx) => {
              const isSelected = selectedEvent?.title === ev.title
              return (
                <button
                  key={idx}
                  onClick={() => setSelectedEvent(ev)}
                  className={`tag-clip flex w-full items-center justify-between border p-4 text-left transition-all ${
                    isSelected
                      ? "border-primary bg-primary/20 text-white shadow-[0_0_15px_rgba(0,240,255,0.3)]"
                      : "bg-space border-primary/20 text-primary hover:border-primary/60 hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="tag-clip bg-panel border border-primary/40 px-2.5 py-1 text-xs font-bold text-primary">
                      #{idx + 1}
                    </div>
                    <div>
                      <h4 className="font-display text-xs font-bold text-foreground">
                        {ev.title}
                      </h4>
                      <p className="text-[10px] text-primary">
                        {ev.location} • {ev.yearStr}
                      </p>
                    </div>
                  </div>

                  <span className="tag-clip tag-clip px-2 py-0.5 text-[8px] font-bold">
                    {ev.category}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
