"use client"

import { useState } from "react"
import { useLanguage } from "@core/contexts"
import { Scale, Download } from "lucide-react"
import { ContextBlock, Panel, PanelHeader, Button } from "@core/ui"

export function KalkulatorZakatView() {
  const { t } = useLanguage()
  const [totalWealth, setTotalWealth] = useState<number>(100000000)
  const [goldPrice, setGoldPrice] = useState<number>(1400000)
  const [isCalculated, setIsCalculated] = useState(false)

  const nisabGoldValue = 85 * goldPrice
  const isObligatory = totalWealth >= nisabGoldValue
  const zakatAmount = isObligatory ? totalWealth * 0.025 : 0

  function handleCalculate() {
    setIsCalculated(true)
  }

  function handleDownloadReceipt() {
    const canvas = document.createElement("canvas")
    canvas.width = 800
    canvas.height = 500
    const ctx = canvas.getContext("2d")
    if (ctx) {
      ctx.fillStyle = "#05070A"
      ctx.fillRect(0, 0, 800, 500)
      ctx.strokeStyle = "#00FF66"
      ctx.lineWidth = 4
      ctx.strokeRect(20, 20, 760, 460)

      ctx.fillStyle = "#00FF66"
      ctx.font = "bold 18px Orbitron, sans-serif"
      ctx.fillText("MOONWITNESS OS V6.5 // KALKULASI ZAKAT REAL-TIME", 40, 60)

      ctx.fillStyle = "#F5F5F5"
      ctx.font = "bold 24px sans-serif"
      ctx.fillText(
        `TOTAL HARTA / ASET: Rp ${totalWealth.toLocaleString("id-ID")}`,
        40,
        140
      )

      ctx.fillStyle = "#FFE600"
      ctx.font = "bold 18px monospace"
      ctx.fillText(
        `NISAB EMAS (85 gram): Rp ${nisabGoldValue.toLocaleString("id-ID")}`,
        40,
        200
      )

      ctx.fillStyle = isObligatory ? "#00FF66" : "#8B9BB0"
      ctx.font = "bold 28px Orbitron, sans-serif"
      ctx.fillText(
        isObligatory
          ? `ZAKAT MAAL WAJIB DIBAYAR (2.5%): Rp ${zakatAmount.toLocaleString("id-ID")}`
          : "BELUM MENCAPAI NISAB (TIDAK WAJIB ZAKAT)",
        40,
        290
      )

      const link = document.createElement("a")
      link.download = `zakat-receipt-${Date.now()}.png`
      link.href = canvas.toDataURL("image/png")
      link.click()
    }
  }

  return (
    <div
      className="theme-grid-bg min-h-screen py-8 font-mono text-foreground"
      suppressHydrationWarning
    >
      <div className="mx-auto max-w-5xl space-y-6 px-4 sm:px-6">
        {/* System Breadcrumb */}

        {/* Tactical Context Block */}
        <ContextBlock
          title={t("ZAKAT MAAL CALCULATOR", "KALKULATOR ZAKAT MAAL REAL-TIME")}
          subtitle={t(
            "Atomic Zakat calculator based on 85g gold Nisab standard (Bayt Al-Mal telemetry).",
            "Kalkulator Zakat Maal & Fitrah presisi berdasarkan nisab emas 85 gram."
          )}
          operation="BAYT-AL-MAL-CALCULATOR"
          status="ONLINE"
          accentColor="success"
        />

        {/* Calculator Form & Results Panel */}
        <Panel level="level2" accentColor="success">
          <PanelHeader
            title="// ZAKAT MAAL COMPUTATION FORM"
            status="ACTIVE"
            icon={Scale}
            accentColor="success"
            subtitle="Calculate obligatory 2.5% Zakat Maal based on current gold prices."
          />

          <div className="mt-4 grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-xs font-bold text-primary">
                  TOTAL HARTA / ASET SAVINGS (IDR):
                </label>
                <input
                  type="number"
                  value={totalWealth}
                  onChange={(e) => setTotalWealth(Number(e.target.value))}
                  className="bg-space border-success/40 text-success tag-clip focus:border-success w-full border p-3 text-sm font-bold focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold text-primary">
                  HARGA EMAS PER GRAM (IDR):
                </label>
                <input
                  type="number"
                  value={goldPrice}
                  onChange={(e) => setGoldPrice(Number(e.target.value))}
                  className="bg-space border-success/40 tag-clip w-full border p-3 text-sm font-bold text-accent focus:border-accent focus:outline-none"
                />
              </div>

              <Button
                variant="primary"
                accentColor="success"
                onClick={handleCalculate}
                className="w-full py-3"
              >
                HITUNG KALKULASI ZAKAT →
              </Button>
            </div>

            <div className="bg-space border-success/30 tag-clip flex flex-col justify-between space-y-4 border p-5">
              <div>
                <p className="text-[9px] font-bold text-primary uppercase">
                  {/* HASIL KALKULASI ZAKAT: */}
                </p>
                <div className="mt-2 space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-primary">Nisab Emas (85g):</span>
                    <span className="font-bold text-accent">
                      Rp {nisabGoldValue.toLocaleString("id-ID")}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-primary">Status Wajib:</span>
                    <span
                      className={
                        isObligatory
                          ? "text-success font-bold"
                          : "text-danger font-bold"
                      }
                    >
                      {isObligatory ? "WAJIB ZAKAT (WAJIB)" : "BELUM NISHAB"}
                    </span>
                  </div>
                </div>

                <div className="border-success/20 mt-4 border-t pt-3">
                  <span className="block text-[10px] text-primary">
                    ZAKAT 2.5% YANG HARUS DIBAYAR:
                  </span>
                  <span className="text-success text-2xl font-black">
                    Rp {zakatAmount.toLocaleString("id-ID")}
                  </span>
                </div>
              </div>

              {isCalculated && (
                <Button
                  variant="console"
                  accentColor="success"
                  onClick={handleDownloadReceipt}
                  className="w-full text-xs"
                >
                  <Download className="mr-1 h-4 w-4" /> UNDUH TANDA TERIMA PNG
                </Button>
              )}
            </div>
          </div>
        </Panel>
      </div>
    </div>
  )
}

