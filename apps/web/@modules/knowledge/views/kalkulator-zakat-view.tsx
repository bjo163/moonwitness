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
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val)
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Input Panel */}
        <div className="lg:col-span-2 panel-box bg-space border-2 border-primary/50 shadow-[0_0_30px_rgba(0,240,255,0.1)] p-6">
          <div className="flex items-center gap-3 border-b border-primary/20 pb-4 mb-6">
            <Calculator className="w-5 h-5 text-primary" />
            <h2 className="text-sm font-bold text-primary tracking-widest">INPUT ASET KEKAYAAN (HAUL 1 TAHUN)</h2>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-primary/70 mb-2">TABUNGAN & UANG TUNAI</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-primary font-bold">Rp</span>
                <input 
                  type="number"
                  min="0"
                  className="w-full bg-black/50 border border-primary/30 rounded-none p-3 pl-12 text-foreground focus:outline-none focus:border-primary font-mono"
                  placeholder="0"
                  onChange={(e) => setSavings(Number(e.target.value) || 0)}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-primary/70 mb-2">SAHAM, REKSADANA, ATAU INVESTASI LAIN</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-primary font-bold">Rp</span>
                <input 
                  type="number"
                  min="0"
                  className="w-full bg-black/50 border border-primary/30 rounded-none p-3 pl-12 text-foreground focus:outline-none focus:border-primary font-mono"
                  placeholder="0"
                  onChange={(e) => setInvestments(Number(e.target.value) || 0)}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-primary/70 mb-2">NILAI EMAS/PERAK SIMPANAN (BUKAN PERHIASAN DIPAKAI)</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-primary font-bold">Rp</span>
                <input 
                  type="number"
                  min="0"
                  className="w-full bg-black/50 border border-primary/30 rounded-none p-3 pl-12 text-foreground focus:outline-none focus:border-primary font-mono"
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
            <div className="flex items-center gap-2 mb-4 text-xs font-bold text-primary/70">
              <TrendingUp className="w-4 h-4 text-warning" />
              GLOBAL GOLD INDEX
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center border-b border-primary/10 pb-2">
                <span className="text-[10px] text-primary/50">HARGA EMAS / GRAM</span>
                <span className="font-mono text-xs text-foreground font-bold">{formatCurrency(MOCK_GOLD_PRICE_PER_GRAM)}</span>
              </div>
              <div className="flex justify-between items-center border-b border-primary/10 pb-2">
                <span className="text-[10px] text-primary/50">BATAS NISAB (85 GRAM)</span>
                <span className="font-mono text-xs text-warning font-bold">{formatCurrency(NISAB_VALUE)}</span>
              </div>
            </div>
          </div>

          {/* Calculation Result */}
          <div className={`panel-box border-2 p-6 transition-all duration-500 ${isEligible ? 'bg-success/10 border-success shadow-[0_0_30px_rgba(0,255,102,0.2)]' : 'bg-black/50 border-primary/30'}`}>
            <div className="text-center mb-6">
              <div className="text-[10px] font-bold text-primary/50 tracking-widest mb-2">TOTAL AKUMULASI HARTA</div>
              <div className="text-2xl font-mono font-black text-white">{formatCurrency(totalWealth)}</div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-primary/70">STATUS WAJIB ZAKAT</span>
                {isEligible ? (
                  <span className="tag-clip bg-success text-black px-2 py-1 text-[10px] font-bold flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" /> WAJIB (MELEBIHI NISAB)
                  </span>
                ) : (
                  <span className="tag-clip bg-primary/20 text-primary px-2 py-1 text-[10px] font-bold">
                    BELUM MENCAPAI NISAB
                  </span>
                )}
              </div>

              <div className="pt-4 border-t border-primary/20">
                <div className="text-[10px] font-bold text-primary/50 tracking-widest mb-1 text-center">ZAKAT YANG HARUS DIKELUARKAN (2.5%)</div>
                <div className={`text-3xl font-mono font-black text-center ${isEligible ? 'text-success' : 'text-primary/30'}`}>
                  {formatCurrency(zakatAmount)}
                </div>
              </div>
            </div>
          </div>

          <div className="text-[9px] text-primary/50 text-center leading-relaxed">
            <Coins className="w-3 h-3 inline-block mr-1 opacity-50" />
            Catatan: Sistem ini murni alat bantu hitung (Read-Only). Kami tidak mengumpulkan, menyimpan, atau mengirimkan data finansial Anda ke peladen mana pun. Privasi harta umat terjamin.
          </div>

        </div>
      </div>
    </>
  )
}
