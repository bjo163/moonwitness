"use client"

import { useState } from "react"
import { useLanguage } from "@core/contexts"
import { Search } from "lucide-react"
import { ContextBlock } from "@core/ui"

type CovenantEntry = {
  id: string
  city: string
  country: string
  signatory: string
  signedDate: string
  status: string
}

const COVENANT_REGISTRY: CovenantEntry[] = [
  {
    id: "c1",
    city: "Jakarta",
    country: "Indonesia",
    signatory: "Komunitas Kedamaian Nusantara",
    signedDate: "2026-07-27",
    status: "VERIFIED_ACTIVE",
  },
  {
    id: "c2",
    city: "Kairo",
    country: "Mesir",
    signatory: "Jamaah Al-Azhar Harmony",
    signedDate: "2026-07-26",
    status: "VERIFIED_ACTIVE",
  },
  {
    id: "c3",
    city: "London",
    country: "Inggris",
    signatory: "Interfaith Peace Council UK",
    signedDate: "2026-07-25",
    status: "VERIFIED_ACTIVE",
  },
  {
    id: "c4",
    city: "Tokyo",
    country: "Jepang",
    signatory: "Tokyo Civilizational Forum",
    signedDate: "2026-07-24",
    status: "VERIFIED_ACTIVE",
  },
  {
    id: "c5",
    city: "Istanbul",
    country: "Turki",
    signatory: "Anatolia Peace Delegation",
    signedDate: "2026-07-23",
    status: "VERIFIED_ACTIVE",
  },
]

export function PiagamPeradabanView() {
  const { t } = useLanguage()
  const [searchTerm, setSearchTerm] = useState("")

  const filteredEntries = COVENANT_REGISTRY.filter(
    (e) =>
      e.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.country.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div
      className="theme-grid-bg min-h-screen py-10 font-mono text-foreground"
      suppressHydrationWarning
    >
      <div className="mx-auto max-w-5xl space-y-6 px-4 sm:px-6">
        <ContextBlock
          title="REGISTER DITA KEDAMAIAN & PIAGAM PERADABAN MADINAH DUNIA"
          subtitle="Direktori resmi penandatanganan komitmen damai dan Piagam Madinah Modern oleh komunitas, tokoh, dan warga dari berbagai kota di dunia demi terwujudnya persaudaraan kemanusiaan universal."
          operation="PEACE-TREATY-REGISTRY"
          status="ONLINE"
          accentColor="success"
        />

        {/* Search Bar */}
        <div className="flex items-center gap-2">
          <Search className="text-success h-4 w-4" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari berdasarkan kota atau negara (Contoh: Jakarta, Kairo, Tokyo)..."
            className="bg-panel border-success/30 tag-clip w-full border p-3 text-xs text-foreground placeholder-[#8B9BB0] focus:outline-none"
          />
        </div>

        {/* Registry Table List */}
        <div className="space-y-3">
          <div className="text-success flex items-center justify-between text-xs font-bold">
            <span>
              {/* DAFTAR REGISTER KOTA-KOTA PENANDATANGAN PERJANJIAN DAMAI */}
            </span>
            <span className="text-[10px] text-primary">
              {filteredEntries.length} KOTA TERKONSENSUS
            </span>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {filteredEntries.map((item) => (
              <div
                key={item.id}
                className="panel-box border-success/30 bg-space tag-clip flex flex-wrap items-center justify-between gap-3 border p-4 text-xs"
              >
                <div>
                  <h3 className="font-display text-sm font-bold text-foreground">
                    {item.city}, {item.country}
                  </h3>
                  <span className="block text-[9px] text-primary">
                    {/* PENANDATANGAN: {item.signatory} */}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-[10px] text-primary">
                    TANGGAL: {item.signedDate}
                  </span>
                  <span className="tag-clip tag-clip-green tag-clip text-[8px] font-bold">
                    ● {item.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
