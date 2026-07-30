"use client"

/* eslint-disable-next-line no-restricted-imports -- Standard iconography in eclipse tracker view */
import { Sun, Moon, Compass, ShieldCheck } from "lucide-react"
import { ContextBlock } from "@core/ui"

type EclipseEvent = {
  dateStr: string
  type: "LUNAR" | "SOLAR"
  title: string
  visibility: string
  duration: string
  prayerGuidance: string
}

const UPCOMING_ECLIPSES: EclipseEvent[] = [
  {
    dateStr: "2026-08-12",
    type: "SOLAR",
    title: "Gerhana Matahari Total (Total Solar Eclipse)",
    visibility: "Eropa Utara, Samudra Atlantik, Asia Utara",
    duration: "2 Menit 18 Detik",
    prayerGuidance:
      "Disunnahkan melaksanakan Shalat Kusuf (Gerhana Matahari) 2 Rakaat dengan 4 Ruku & Khutbah.",
  },
  {
    dateStr: "2026-08-28",
    type: "LUNAR",
    title: "Gerhana Bulan Sebagian (Partial Lunar Eclipse)",
    visibility: "Indonesia, Asia Tenggara, Samudra Hindia",
    duration: "1 Jam 34 Menit",
    prayerGuidance:
      "Disunnahkan melaksanakan Shalat Khusuf (Gerhana Bulan) berjamā'ah di Masjid disertai Khutbah.",
  },
  {
    dateStr: "2027-02-06",
    type: "SOLAR",
    title: "Gerhana Matahari Cincin (Annular Solar Eclipse)",
    visibility: "Amerika Selatan, Afrika Barat, Samudra Pasifik",
    duration: "7 Menit 51 Detik",
    prayerGuidance:
      "Disunnahkan Shalat Kusuf, Bertakbir, Berdoa, Beristighfar, dan Bersedekah.",
  },
]

export function EclipseTrackerView() {
  return (
    <>
      <ContextBlock
        title="SIMULASI & PREDIKSI GERHANA (KUSUF/KHUSUF)"
        subtitle="Pemantauan kronometer astronomi untuk kejadian gerhana matahari (Kusuf) dan gerhana bulan (Khusuf) beserta panduan tata cara shalat sunnah gerhana."
        operation="ECLIPSE-CHRONOMETER"
        status="ONLINE"
        accentColor="astronomy"
      />

      {/* Live Sun & Moon Telemetry Widget */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="panel-box bg-space/95 space-y-2 border border-accent/40 p-5">
          <span className="block text-[9px] text-primary">
            {/* DERAJAT KETINGGIAN MATAHARI */}
          </span>
          <div className="font-display flex items-center gap-2 text-xl font-black text-accent">
            <Sun className="h-5 w-5 text-accent" />
            <span>+64.12° ALT</span>
          </div>
          <p className="text-[9px] text-primary">
            Posisi Matahari Di Atas Horison Jakarta
          </p>
        </div>

        <div className="panel-box bg-space/95 space-y-2 border border-primary/40 p-5">
          <span className="block text-[9px] text-primary">
            {/* ILUMINASI CAHAYA REMBULAN */}
          </span>
          <div className="font-display flex items-center gap-2 text-xl font-black text-primary">
            <Moon className="h-5 w-5 text-primary" />
            <span>93.4% LIGHT</span>
          </div>
          <p className="text-[9px] text-primary">
            Fase Cembung Akhir (Waxing Gibbous)
          </p>
        </div>

        <div className="panel-box border-success/40 bg-space/95 space-y-2 border p-5">
          <span className="block text-[9px] text-primary">
            {/* BAYANGAN RASHUL QIBLAH */}
          </span>
          <div className="text-success font-display flex items-center gap-2 text-xl font-black">
            <Compass className="text-success h-5 w-5" />
            <span>0.18 RATIO</span>
          </div>
          <p className="text-[9px] text-primary">
            Presisi Arah Kiblat Matahari
          </p>
        </div>
      </div>

      {/* Upcoming Eclipse Events */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs font-bold text-accent">
          <span>{/* PREDIKSI PERISTIWA GERHANA GLOBAL MENDATANG */}</span>
          <span className="tag-clip tag-clip-yellow tag-clip px-2 py-0.5 text-[8px]">
            ASTRONOMICAL ALGORITHM
          </span>
        </div>

        <div className="space-y-3">
          {UPCOMING_ECLIPSES.map((ev, idx) => (
            <div
              key={idx}
              className="panel-box bg-space tag-clip space-y-3 border border-primary/30 p-5"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-primary/15 pb-2">
                <div className="flex items-center gap-2">
                  {ev.type === "SOLAR" ? (
                    <Sun className="h-4 w-4 text-accent" />
                  ) : (
                     <Moon className="h-4 w-4 text-primary" />
                  )}
                  <h3 className="font-display text-sm font-bold text-foreground">
                    {ev.title}
                  </h3>
                </div>
                <span className="tag-clip tag-clip px-2 py-0.5 text-[9px] font-bold">
                  {ev.dateStr}
                </span>
              </div>

              <div className="grid grid-cols-1 gap-2 text-xs sm:grid-cols-2">
                <p className="text-primary">
                  <span className="font-bold text-white">
                    Wilayah Visibilitas:
                  </span>{" "}
                  {ev.visibility}
                </p>
                <p className="text-primary">
                  <span className="font-bold text-white">
                    Durasi Peristiwa:
                  </span>{" "}
                  {ev.duration}
                </p>
              </div>

              <div className="bg-panel border-success/30 text-success flex items-start gap-2 border p-3 font-mono text-xs">
                <ShieldCheck className="text-success mt-0.5 h-4 w-4 shrink-0" />
                <div>
                  <span className="block text-[10px] font-bold uppercase">
                    {/* TUNTUNAN IBADAH SYARI&apos;AT: */}
                  </span>
                  <p className="text-foreground">{ev.prayerGuidance}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
