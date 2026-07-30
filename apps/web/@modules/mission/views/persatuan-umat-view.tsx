"use client"

import { useState } from "react"
import { Sparkles, Heart, Users, CheckCircle2 } from "lucide-react"
import { useLanguage } from "@core/contexts"
import { GlobalPrayerWallWidget } from "@core/widgets"
import { ContextBlock } from "@core/ui"

type CovenantPillar = {
  number: string
  title: string
  quranAyah: string
  quranRef: string
  medinaArticle: string
  description: string
}

const MEDINA_COVENANT_PILLARS: CovenantPillar[] = [
  {
    number: "01",
    title: "RAHMATAN LIL 'ALAMIN (KASIH SAYANG UNTUK SELURUH ALAM)",
    quranAyah: "وَمَا أَرْسَلْنَاكَ إِلَّا رَحْمَةً لِّلْعَالَمِينَ",
    quranRef: "Q.S Al-Anbiya' (21:107)",
    medinaArticle: "Prinsip Dasar Piagam Madinah",
    description:
      "Al-Qur'an diturunkan dan Rasulullah SAW diutus bukan untuk satu kelompok saja, melainkan sebagai sumber rahmat, kedamaian, dan kasih sayang universal bagi seluruh umat manusia dan alam semesta.",
  },
  {
    number: "02",
    title: "SATU PERSAUDARAAN MANUSIA (UNIVERSAL HUMAN BROTHERHOOD)",
    quranAyah:
      "يَا أَيُّهَا النَّاسُ إِنَّا خَلَقْنَاكُم مِّن ذَكَرٍ وَأُنثَىٰ وَجَعَلْنَاكُمْ شُعُوبًا وَقَبَائِلَ لِتَعَارَفُوا",
    quranRef: "Q.S Al-Hujurat (49:13)",
    medinaArticle: "Pasal 1 Piagam Madinah",
    description:
      "Seluruh manusia diciptakan dari satu asal keturunan yang sama. Perbedaan bangsa, suku, dan warna kulit adalah keagungan tanda Pencipta agar saling mengenal (Lita'arafu) dan berbuat baik.",
  },
  {
    number: "03",
    title: "KEADILAN MULTI-IMAN & KEMERDEKAAN BERAGAMA",
    quranAyah:
      "لَا إِكْرَاهَ فِي الدِّينِ ۖ قَد تَّبَيَّنَ الرُّشْدُ مِنَ الْغَيِّ",
    quranRef: "Q.S Al-Baqarah (2:256) & Q.S Al-Ma'idah (5:8)",
    medinaArticle: "Pasal 25 Piagam Madinah",
    description:
      "Tidak ada paksaan dalam beragama. Setiap warga masyarakat berhak memeluk keyakinannya secara damai, dan keadilan hukum harus ditegakkan secara objektif tanpa diskriminasi.",
  },
  {
    number: "04",
    title: "PERLINDUNGAN JIWA & PERTOLONGAN BERSAMA (TA'AWUN)",
    quranAyah:
      "مَن قَتَلَ نَفْسًا بِغَيْرِ نَفْسٍ أَوْ فَسَادٍ فِي الْأَرْضِ فَكَأَنَّمَا قَتَلَ النَّاسَ جَمِيعًا",
    quranRef: "Q.S Al-Ma'idah (5:32) & Al-Ma'idah (5:2)",
    medinaArticle: "Pasal 16 & 37 Piagam Madinah",
    description:
      "Menjaga kehormatan dan kesucian satu nyawa manusia setara dengan menyelamatkan seluruh umat manusia. Wajib tolong-menolong dalam kebajikan dan ketaqwaan.",
  },
  {
    number: "05",
    title: "TAFAKUR KOSMIK & KEDAMAIAN UNIVERSAL (ULUL ALBAB)",
    quranAyah:
      "الَّذِينَ يَذْكُرُونَ اللَّهَ قِيَامًا وَقُعُودًا وَعَلَىٰ جُنُوبِهِمْ وَيَتَفَكَّرُونَ فِي خَلْقِ السَّمَاوَاتِ وَالْأَرْضِ",
    quranRef: "Q.S Ali 'Imran (3:190-191)",
    medinaArticle: "Visi Masa Depan Peradaban",
    description:
      "Meneladani ulul albab yang senantiasa bertafakur atas rahasia keagungan tatanan kosmos, bulan, bintang, dan bumi demi melahirkan kedamaian abadi bagi peradaban.",
  },
]

export function PersatuanUmatView() {
  const { t } = useLanguage()
  const [pledged, setPledged] = useState(false)
  const [pledgeCount, setPledgeCount] = useState(12847)

  function handlePledge() {
    if (!pledged) {
      setPledged(true)
      setPledgeCount((prev) => prev + 1)
    }
  }

  return (
    <div
      className="theme-grid-bg min-h-screen py-10 font-mono text-foreground"
      suppressHydrationWarning
    >
      <div className="mx-auto max-w-5xl space-y-6 px-4 sm:px-6">
        <ContextBlock
          title="PIAGAM PERSATUAN UMAT MANUSIA"
          subtitle="Deklarasi dan piagam persaudaraan kemanusiaan universal yang bersumber dari nilai-nilai Al-Qur'an dan Konstitusi Piagam Madinah."
          operation="HUMAN-UNITY-CHARTER"
          status="ONLINE"
          accentColor="success"
        />

        {/* Core Quranic Manifesto Banner */}
        <div className="panel-box bg-space/95 space-y-3 border border-accent/50 p-6">
          <div className="flex items-center justify-between text-xs font-bold text-accent">
            <span className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-accent" />
              <span>LANDASAN WAHYU SUPREMA: Q.S AL-ANBIYA&apos; (21:107)</span>
            </span>
            <span className="tag-clip tag-clip-yellow tag-clip text-[9px]">
              RAHMATAN LIL &apos;ALAMIN
            </span>
          </div>
          <div className="arabic-text text-right text-2xl leading-loose font-black text-foreground sm:text-3xl">
            وَمَا أَرْسَلْنَاكَ إِلَّا رَحْمَةً لِّلْعَالَمِينَ
          </div>
          <p className="text-xs font-bold text-accent italic">
            &ldquo;Dan Kami tidak mengutus engkau (Muhammad), melainkan untuk
            (menjadi) rahmat bagi seluruh alam.&rdquo;
          </p>
        </div>

        {/* 5 Pillars of Medina Charter & Quranic Virtues */}
        <div className="space-y-4">
          <div className="text-success flex items-center justify-between text-xs font-bold">
            <span>
              {/* 5 PILAR LANDASAN AL-QUR&apos;AN & PIAGAM MADINAH MODERN */}
            </span>
            <span className="text-[10px] text-primary">
              KONSENSUS PERADABAN UNIVERSAL
            </span>
          </div>

          <div className="space-y-4">
            {MEDINA_COVENANT_PILLARS.map((pillar) => (
              <div
                key={pillar.number}
                className="panel-box border-success/30 bg-space tag-clip space-y-3 border p-6"
              >
                <div className="border-success/20 flex flex-wrap items-center justify-between gap-2 border-b pb-3">
                  <div className="flex items-center gap-3">
                    <span className="tag-clip bg-panel border-success/50 text-success border px-3 py-1 text-sm font-black">
                      #{pillar.number}
                    </span>
                    <h3 className="font-display text-sm font-black text-foreground">
                      {pillar.title}
                    </h3>
                  </div>
                  <span className="tag-clip tag-clip-yellow tag-clip text-[9px] font-bold">
                    {pillar.quranRef}
                  </span>
                </div>

                <div className="text-success arabic-text text-right text-lg leading-relaxed font-bold sm:text-xl">
                  {pillar.quranAyah}
                </div>

                <div className="bg-panel border-success/20 space-y-1 border p-3 text-xs text-primary">
                  <span className="text-success block text-[9px] font-bold uppercase">
                    {/* SUBTANSI LANDASAN: */}
                  </span>
                  <p className="leading-relaxed text-foreground">
                    {pillar.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Global Prayer Wall Widget */}
        <GlobalPrayerWallWidget />

        {/* Global Covenant Digital Pledge Section */}
        <div className="panel-box bg-space space-y-5 border-2 border-primary/50 p-8 text-center shadow-[0_0_40px_rgba(0,240,255,0.2)]">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/15 px-4 py-1 text-xs font-bold text-primary uppercase">
            <Heart className="h-4 w-4 text-primary" />
            <span>IKRAR GLOBAL PERSAUDARAAN KEMANUSIAAN</span>
          </div>

          <h2 className="font-display text-xl font-black tracking-widest text-foreground uppercase sm:text-3xl">
            FIRMA IKRAR PERSATUAN UMAT KOSMIK
          </h2>

          <p className="mx-auto max-w-xl text-xs leading-relaxed text-primary">
            Dengan menekan tombol di bawah ini, Anda meneguhkan komitmen diri
            untuk menjadi bagian dari pembawa rahmat, keadilan, dan kedamaian
            universal bagi seluruh umat manusia.
          </p>

          <div className="pt-2">
            <button
              onClick={handlePledge}
              disabled={pledged}
              className={`btn-primary btn-clip mx-auto flex items-center gap-3 px-8 py-3.5 text-xs font-black transition-all sm:text-sm ${
                pledged
                  ? "bg-success/20 text-success border-success"
                  : "border-primary bg-primary/20 text-primary hover:bg-primary/40"
              }`}
            >
              {pledged ? (
                <CheckCircle2 className="text-success h-5 w-5" />
              ) : (
                <Users className="h-5 w-5 text-primary" />
              )}
              <span>
                {pledged
                  ? "[ IKRAR PERSATUAN TERVERIFIKASI ]"
                  : "[ TEGUHKAN IKRAR PERSATUAN KEMANUSIAAN ]"}
              </span>
            </button>
          </div>

          <div className="text-success pt-1 text-[10px] font-bold tracking-widest">
            TOTAL 🛰️ {pledgeCount.toLocaleString("en-US")} JIWA MANUSIA TELAH
            MENANDATANGANI IKRAR PERDAMAIAN GLOBAL
          </div>
        </div>
      </div>
    </div>
  )
}
