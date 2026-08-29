"use client"

import { useLanguage } from "@workspace/state"
import { ShieldCheck, CheckCircle2 } from "lucide-react"
import { ContextBlock, Panel, PanelHeader, Button } from "@workspace/ui"

type PropheticToolkit = {
  id: string
  toolkitName: string
  role: string
  quranAyah: string
  quranRef: string
  operationalFramework: string
  actionTool: string
}

const PROPHETIC_TOOLKITS: PropheticToolkit[] = [
  {
    id: "tk1",
    toolkitName: "1. DIVINE MASTER CHARTER (RAHMATAN LIL 'ALAMIN)",
    role: "Visi Utama Penciptaan Manusia & Misi Profetik Universal",
    quranAyah: "وَمَا أَرْسَلْنَاكِ إِلَّا رَحْمَةً لِّلْعَالَمِينَ",
    quranRef: "Q.S Al-Anbiya' (21:107) & Q.S Al-Ahzab (33:45-46)",
    operationalFramework:
      "Menempatkan kasih sayang Ilahi dan kemaslahatan universal sebagai tujuan tertinggi dalam setiap kebijakan sosial, hukum, dan ekonomi.",
    actionTool: "Manifesto Rahmatan lil 'Alamin Generator",
  },
  {
    id: "tk2",
    toolkitName: "2. MODUL MU'AKHAT (BROTHERHOOD & SOCIAL CAPITAL)",
    role: "Penyatuan Komunitas Aus-Khazraj & Anshar-Muhajirin",
    quranAyah:
      "إِنَّمَا الْمُؤْمِنُونَ إِخْوَةٌ فَأَصْلِحُوا بَيْنَ أَخَوَيْكُمْ",
    quranRef: "Q.S Al-Hujurat (49:10) & Q.S Ali 'Imran (3:103)",
    operationalFramework:
      "Menghubungkan kelompok masyarakat kaya dan miskin, pendatang dan warga lokal dalam ikatan persaudaraan sejati untuk saling berbagi sumber daya.",
    actionTool: "Global Brotherhood Matcher Engine",
  },
  {
    id: "tk3",
    toolkitName: "3. KONSTITUSI MADINAH BUILDER (CIVILIZATIONAL CONTRACT)",
    role: "Perjanjian Hukum & Hak Asasi Manusia Inklusif",
    quranAyah:
      "لَا إِكْرَاهَ فِي الدِّينِ ۖ قَد تَّبَيَّنَ الرُّشْدُ مِنَ الْغَيِّ",
    quranRef: "Q.S Al-Baqarah (2:256) & Q.S Al-Ma'idah (5:8)",
    operationalFramework:
      "Menjamin kebebasan beragama, perlindungan hak minoritas, dan kepastian hukum yang adil bagi seluruh warga tanpa memandang ras atau suku.",
    actionTool: "Interactive Medina Covenant Builder",
  },
  {
    id: "tk4",
    toolkitName: "4. PROTOKOL DIPLOMASI LEMBUT & HILM (SOFT DIPLOMACY)",
    role: "Metodologi Pemaafan (Afwu) & Musyawarah Damai",
    quranAyah:
      "فَبِمَا رَحْمَةٍ مِّنَ اللَّهِ لِنتَ لَهُمْ ۖ وَلَوْ كُنتَ فَظًّا غَلِيظَ الْقَلْبِ لَانفَضُّوا مِنْ حَوْلِكَ",
    quranRef: "Q.S Ali 'Imran (3:159) & Q.S An-Nahl (16:125)",
    operationalFramework:
      "Mengutamakan sikap lemah lembut, pemaafan atas kesalahan orang lain, dan diplomasi hikmah dalam menyelesaikan sengketa.",
    actionTool: "Prophetic Conflict Resolution Protocol",
  },
  {
    id: "tk5",
    toolkitName: "5. FRAMEWORK SYURA & SERVANT LEADERSHIP",
    role: "Kepemimpinan Pelayan (Sayyidul Qaumi Khadimuhum)",
    quranAyah: "وَأَمْرُهُمْ شُورَىٰ بَيْنَهُمْ",
    quranRef: "Q.S Ash-Shura (42:38) & Q.S Ali 'Imran (3:159)",
    operationalFramework:
      "Pengambilan keputusan berdasarkan musyawarah transparan dan kepemimpinan yang melayani kebutuhan rakyat, bukan dilayani.",
    actionTool: "Syura Decision-Making Matrix",
  },
]

export function ToolkitRasulullahView() {
  const { t } = useLanguage()

  return (
    <div
      className="theme-grid-bg min-h-screen py-8 font-mono text-foreground"
      suppressHydrationWarning
    >
      <div className="mx-auto max-w-5xl space-y-6 px-4 sm:px-6">
        {/* Standard System Breadcrumb (Task 15) */}

        {/* Standard Tactical Context Block (Task 16) */}
        <ContextBlock
          title={t(
            "TOOLKITS PERADABAN RASULULLAH SAW",
            "PROPHETIC CIVILIZATION TOOLKITS"
          )}
          subtitle={t(
            "Divine operational toolkits guided by Allah SWT as Divine Project Planner & executed through Rasulullah SAW for global human unity.",
            "Platform operasional persatuan kemanusiaan global yang dipandu langsung oleh wahyu Ilahi Allah SWT sebagai Divine Project Planner."
          )}
          operation="PROPHETIC-UNITY-MATRIX"
          status="ONLINE"
          accentColor="success"
        />

        {/* 5 Prophetic Toolkits Catalog */}
        <div className="space-y-5">
          <PanelHeader
            title="// 5 DIVINE OPERATIONAL TOOLKITS RASULULLAH SAW"
            status="SYNCED"
            icon={ShieldCheck}
            accentColor="success"
            subtitle="Operational framework for global peace, Medina charter, and human unity."
          />

          <div className="space-y-4">
            {PROPHETIC_TOOLKITS.map((tk) => (
              <Panel key={tk.id} level="level2" accentColor="success">
                <div className="border-success/20 mb-3 flex flex-wrap items-center justify-between gap-2 border-b pb-3">
                  <div>
                    <h3 className="font-sans text-sm font-bold text-foreground">
                      {tk.toolkitName}
                    </h3>
                    <p className="mt-0.5 text-[10px] text-primary">
                      {/* PERAN: {tk.role} */}
                    </p>
                  </div>
                  <span className="rounded-md border border-emerald-500/40 bg-emerald-500/10 text-emerald-500 px-2 py-0.5 font-mono text-[9px] font-bold">
                    {tk.quranRef}
                  </span>
                </div>

                <div className="text-success arabic-text my-2 text-right text-xl leading-loose font-bold sm:text-2xl">
                  {tk.quranAyah}
                </div>

                <div className="grid grid-cols-1 gap-3 pt-1 text-xs sm:grid-cols-2">
                  <div className="bg-background border-success/20 tag-clip border p-3">
                    <p className="text-[9px] font-bold text-primary uppercase">
                      {/* FRAMEWORK OPERASIONAL: */}
                    </p>
                    <p className="mt-1 text-[11px] leading-relaxed text-foreground">
                      {tk.operationalFramework}
                    </p>
                  </div>

                  <div className="bg-background border-success/20 tag-clip flex flex-col justify-between border p-3">
                    <div>
                      <p className="text-[9px] font-bold text-primary uppercase">
                        {/* INSTRUMEN AKSI: */}
                      </p>
                      <p className="text-success mt-1 flex items-center gap-1.5 text-xs font-bold">
                        <CheckCircle2 className="text-success h-4 w-4" />
                        {tk.actionTool}
                      </p>
                    </div>
                    <div className="mt-3">
                      <Button
                        variant="default"
                        className="w-full py-1.5 text-[10px] bg-emerald-600 hover:bg-emerald-500 text-white"
                      >
                        EKSEKUSI TOOLKIT →
                      </Button>
                    </div>
                  </div>
                </div>
              </Panel>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
