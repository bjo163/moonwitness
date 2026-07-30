"use client"

import { useState } from "react"
import { useLanguage } from "@core/contexts"
import { Download, Award, CheckCircle2 } from "lucide-react"
import { ContextBlock } from "@core/ui"

export function SertifikatPiagamView() {
  const { t } = useLanguage()
  const [userName, setUserName] = useState("")
  const [country, setCountry] = useState("")
  const [isPledged, setIsPledged] = useState(false)

  function handleGenerateCertificate() {
    if (!userName.trim() || !country.trim()) return
    setIsPledged(true)
  }

  function handleDownloadPNG() {
    const canvas = document.createElement("canvas")
    canvas.width = 1000
    canvas.height = 650
    const ctx = canvas.getContext("2d")
    if (ctx) {
      // BG
      ctx.fillStyle = "#05070A"
      ctx.fillRect(0, 0, 1000, 650)
      ctx.strokeStyle = "#00FF66"
      ctx.lineWidth = 6
      ctx.strokeRect(30, 30, 940, 590)

      // Inner Border
      ctx.strokeStyle = "#00F0FF"
      ctx.lineWidth = 1.5
      ctx.strokeRect(45, 45, 910, 560)

      // Header
      ctx.fillStyle = "#00FF66"
      ctx.font = "bold 20px Orbitron, sans-serif"
      ctx.fillText(
        "MOONWITNESS V4.0 // DIVINE GLOBAL HUMAN UNITY NETWORK",
        70,
        90
      )

      ctx.fillStyle = "#F5F5F5"
      ctx.font = "black 32px Orbitron, sans-serif"
      ctx.fillText("SERTIFIKAT DUTA KEDAMAIAN & KEMANUSIAAN GLOBAL", 70, 150)

      ctx.fillStyle = "#8B9BB0"
      ctx.font = "16px monospace"
      ctx.fillText("Dengan ini menyatakan bahwa:", 70, 220)

      // Name
      ctx.fillStyle = "#00F0FF"
      ctx.font = "bold 36px sans-serif"
      ctx.fillText(userName.toUpperCase(), 70, 280)

      ctx.fillStyle = "#FFE600"
      ctx.font = "bold 18px monospace"
      ctx.fillText(`NEGARA / DOMISILI: ${country.toUpperCase()}`, 70, 320)

      // Pledge Text
      ctx.fillStyle = "#F5F5F5"
      ctx.font = "italic 16px monospace"
      ctx.fillText(
        '"Telah secara resmi menandatangani Komitmen Digital Piagam Madinah Modern',
        70,
        390
      )
      ctx.fillText(
        'untuk menjunjung tinggi persaudaraan universal, keadilan, dan kedamaian kemanusiaan."',
        70,
        420
      )

      // Verification Stamp
      ctx.fillStyle = "#00FF66"
      ctx.font = "bold 14px monospace"
      ctx.fillText(
        `VERIFIED ID: MW-AMBASSADOR-${Date.now()} • ALLAH SWT PROJECT PLANNER`,
        70,
        550
      )

      const link = document.createElement("a")
      link.download = `MoonWitness_Ambassador_${userName.replace(/\s+/g, "_")}.png`
      link.href = canvas.toDataURL("image/png")
      link.click()
    }
  }

  return (
    <div
      className="theme-grid-bg min-h-screen py-10 font-mono text-foreground"
      suppressHydrationWarning
    >
      <div className="mx-auto max-w-4xl space-y-6 px-4 sm:px-6">
        <ContextBlock
          title="GENERATE SERTIFIKAT DUTA KEDAMAIAN PIAGAM MADINAH"
          subtitle="Registrasi dan unduh sertifikat resmi Duta Kedamaian Global (Peace Ambassador) sebagai bukti komitmen memegang teguh Piagam Madinah Modern."
          operation="PEACE-AMBASSADOR-CERT"
          status="ONLINE"
          accentColor="success"
        />

        {/* Form Card */}
        {!isPledged ? (
          <div className="panel-box border-success/40 bg-space space-y-4 border p-6 font-mono">
            <div className="text-success text-xs font-bold">
              {/* FORM PENANDATANGANAN DUTA KEDAMAIAN: */}
            </div>

            <div className="space-y-3">
              <div>
                <label className="mb-1 block text-[10px] text-primary uppercase">
                  {/* NAMA LENGKAP: */}
                </label>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="Masukkan nama lengkap Anda..."
                  className="bg-panel border-success/30 tag-clip w-full border p-3 text-xs text-foreground focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-1 block text-[10px] text-primary uppercase">
                  {/* NEGARA / DOMISILI: */}
                </label>
                <input
                  type="text"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  placeholder="Contoh: Indonesia, Malaysia, United Kingdom..."
                  className="bg-panel border-success/30 tag-clip w-full border p-3 text-xs text-foreground focus:outline-none"
                />
              </div>

              <button
                onClick={handleGenerateCertificate}
                className="btn-primary btn-primary-green btn-clip flex w-full items-center justify-center gap-2 py-3 text-xs font-bold"
              >
                <Award className="text-success h-4 w-4" />
                <span>[ TANDATANGANI KOMITMEN & GENERATE SERTIFIKAT ]</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="panel-box border-success/60 bg-space space-y-5 border-2 p-8 text-center shadow-[0_0_40px_rgba(0,255,102,0.25)]">
            <div className="bg-success/15 border-success/40 text-success inline-flex items-center gap-2 rounded-full border px-4 py-1 text-xs font-bold uppercase">
              <CheckCircle2 className="text-success h-4 w-4" />
              <span>SERTIFIKAT BERHASIL DITERBITKAN</span>
            </div>

            <div className="bg-space border-success/30 tag-clip space-y-3 border p-6 text-left">
              <span className="block text-[9px] text-primary">
                {/* PREVIEW SERTIFIKAT: */}
              </span>
              <h2 className="text-xl font-bold text-primary">
                {userName.toUpperCase()}
              </h2>
              <span className="block text-xs font-bold text-accent">
                DOMISILI: {country.toUpperCase()}
              </span>
              <p className="text-xs text-foreground italic">
                &ldquo;Telah secara resmi menandatangani Komitmen Digital Piagam
                Madinah Modern untuk menjunjung tinggi persaudaraan universal,
                keadilan, dan kedamaian kemanusiaan.&rdquo;
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={handleDownloadPNG}
                className="btn-primary btn-primary-green btn-clip flex items-center gap-2 px-6 py-3 text-xs font-bold"
              >
                <Download className="text-success h-4 w-4" />
                <span>[ 📥 DOWNLOAD SERTIFIKAT PNG HD ]</span>
              </button>

              <button
                onClick={() => setIsPledged(false)}
                className="btn-primary btn-primary-ghost btn-clip px-4 py-3 text-xs font-bold"
              >
                <span>EDIT DATA</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

