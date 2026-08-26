"use client"

import { useState } from "react"
import { Calculator, Coins, TrendingUp, ShieldCheck } from "lucide-react"
import { ContextBlock } from "@core/ui"

// Simulasi harga emas global (real-time API can be hooked here)
const MOCK_GOLD_PRICE_PER_GRAM = 1350000 // Rupiah
const NISAB_GOLD_GRAMS = 85
const NISAB_VALUE = MOCK_GOLD_PRICE_PER_GRAM * NISAB_GOLD_GRAMS
const ZAKAT_RATE = 0.025 // 2.5%

export function KalkulatorZakatView() {
  const [savings, setSavings] = useState<number>(0)
  const [investments, setInvestments] = useState<number>(0)
  const [goldSilver, setGoldSilver] = useState<number>(0)

  const totalWealth = savings + investments + goldSilver
  const isEligible = totalWealth >= NISAB_VALUE
  const zakatAmount = isEligible ? totalWealth * ZAKAT_RATE : 0

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(val)
  }

  return (
    <>
      <ContextBlock
        title="MESIN BAITUL MAL (KALKULATOR ZAKAT)"
        subtitle="Modul analitik ekonomi untuk mengkalkulasi kewajiban zakat mal secara real-time berdasarkan simulasi fluktuasi harga emas global. Sistem ini bersifat read-only (tidak menyimpan data finansial pengguna)."
        operation="WEALTH-DISTRIBUTION"
        status="ONLINE"
        accentColor="success"
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Input Panel */}
        <div className="panel-box bg-space border-2 border-primary/50 p-6 shadow-[0_0_30px_rgba(0,240,255,0.1)] lg:col-span-2">
          <div className="mb-6 flex items-center gap-3 border-b border-primary/20 pb-4">
            <Calculator className="h-5 w-5 text-primary" />
            <h2 className="text-sm font-bold tracking-widest text-primary">
              INPUT ASET KEKAYAAN (HAUL 1 TAHUN)
            </h2>
          </div>

          <div className="space-y-6">
            <div>
              <label className="mb-2 block text-xs font-bold text-primary/70">
                TABUNGAN & UANG TUNAI
              </label>
              <div className="relative">
                <span className="absolute top-1/2 left-4 -translate-y-1/2 font-bold text-primary">
                  Rp
                </span>
                <input
                  type="number"
                  min="0"
                  className="w-full rounded-none border border-primary/30 bg-black/50 p-3 pl-12 font-mono text-foreground focus:border-primary focus:outline-none"
                  placeholder="0"
                  onChange={(e) => setSavings(Number(e.target.value) || 0)}
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-xs font-bold text-primary/70">
                SAHAM, REKSADANA, ATAU INVESTASI LAIN
              </label>
              <div className="relative">
                <span className="absolute top-1/2 left-4 -translate-y-1/2 font-bold text-primary">
                  Rp
                </span>
                <input
                  type="number"
                  min="0"
                  className="w-full rounded-none border border-primary/30 bg-black/50 p-3 pl-12 font-mono text-foreground focus:border-primary focus:outline-none"
                  placeholder="0"
                  onChange={(e) => setInvestments(Number(e.target.value) || 0)}
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-xs font-bold text-primary/70">
                NILAI EMAS/PERAK SIMPANAN (BUKAN PERHIASAN DIPAKAI)
              </label>
              <div className="relative">
                <span className="absolute top-1/2 left-4 -translate-y-1/2 font-bold text-primary">
                  Rp
                </span>
                <input
                  type="number"
                  min="0"
                  className="w-full rounded-none border border-primary/30 bg-black/50 p-3 pl-12 font-mono text-foreground focus:border-primary focus:outline-none"
                  placeholder="0"
                  onChange={(e) => setGoldSilver(Number(e.target.value) || 0)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Output/Telemetry Panel */}
        <div className="space-y-6">
          {/* Global Market Data */}
          <div className="panel-box bg-panel border border-primary/30 p-6">
            <div className="mb-4 flex items-center gap-2 text-xs font-bold text-primary/70">
              <TrendingUp className="text-warning h-4 w-4" />
              GLOBAL GOLD INDEX
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-primary/10 pb-2">
                <span className="text-[10px] text-primary/50">
                  HARGA EMAS / GRAM
                </span>
                <span className="font-mono text-xs font-bold text-foreground">
                  {formatCurrency(MOCK_GOLD_PRICE_PER_GRAM)}
                </span>
              </div>
              <div className="flex items-center justify-between border-b border-primary/10 pb-2">
                <span className="text-[10px] text-primary/50">
                  BATAS NISAB (85 GRAM)
                </span>
                <span className="text-warning font-mono text-xs font-bold">
                  {formatCurrency(NISAB_VALUE)}
                </span>
              </div>
            </div>
          </div>

          {/* Calculation Result */}
          <div
            className={`panel-box border-2 p-6 transition-all duration-500 ${isEligible ? "bg-success/10 border-success shadow-[0_0_30px_rgba(0,255,102,0.2)]" : "border-primary/30 bg-black/50"}`}
          >
            <div className="mb-6 text-center">
              <div className="mb-2 text-[10px] font-bold tracking-widest text-primary/50">
                TOTAL AKUMULASI HARTA
              </div>
              <div className="font-mono text-2xl font-black text-white">
                {formatCurrency(totalWealth)}
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-primary/70">
                  STATUS WAJIB ZAKAT
                </span>
                {isEligible ? (
                  <span className="tag-clip bg-success flex items-center gap-1 px-2 py-1 text-[10px] font-bold text-black">
                    <ShieldCheck className="h-3 w-3" /> WAJIB (MELEBIHI NISAB)
                  </span>
                ) : (
                  <span className="tag-clip bg-primary/20 px-2 py-1 text-[10px] font-bold text-primary">
                    BELUM MENCAPAI NISAB
                  </span>
                )}
              </div>

              <div className="border-t border-primary/20 pt-4">
                <div className="mb-1 text-center text-[10px] font-bold tracking-widest text-primary/50">
                  ZAKAT YANG HARUS DIKELUARKAN (2.5%)
                </div>
                <div
                  className={`text-center font-mono text-3xl font-black ${isEligible ? "text-success" : "text-primary/30"}`}
                >
                  {formatCurrency(zakatAmount)}
                </div>
              </div>
            </div>
          </div>

          <div className="text-center text-[9px] leading-relaxed text-primary/50">
            <Coins className="mr-1 inline-block h-3 w-3 opacity-50" />
            Catatan: Sistem ini murni alat bantu hitung (Read-Only). Kami tidak
            mengumpulkan, menyimpan, atau mengirimkan data finansial Anda ke
            peladen mana pun. Privasi harta umat terjamin.
          </div>
        </div>
      </div>
    </>
  )
}
