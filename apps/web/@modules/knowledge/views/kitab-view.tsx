"use client"

import { useLanguage } from "@core/contexts"
import {
  BookOpen,
  Scroll,
  BookCheck,
  Flame,
  Search,
  ArrowRight,
} from "lucide-react"
import { ContextBlock, Panel, PanelHeader, Button } from "@core/ui"

export function KitabPortalView() {
  const { t } = useLanguage()

  const scriptureCards = [
    {
      title: "Al-Qur'anul Karim",
      arab: "القرآن الكريم",
      recipient: t("Prophet Muhammad PBUH", "Nabi Muhammad SAW"),
      religion: t("Islam (Universal Humanity)", "Islam (Seluruh Umat Manusia)"),
      status: t("Final & Preserved Codex", "Kanon Terakhir & Terpelihara"),
      desc: t(
        "The final transcendent codex revealed to Prophet Muhammad PBUH, containing 114 Surahs and 30 Juz.",
        "Kitab suci penutup wahyu Allah SWT yang diturunkan kepada Nabi Muhammad SAW untuk seluruh umat manusia. Berisi 114 Surah dan 30 Juz."
      ),
      href: "/kitab/quran",
      icon: BookOpen,
      accentColor: "system" as const,
    },
    {
      title: "Torah (Taurat of Moses)",
      arab: "التوراة",
      recipient: t("Prophet Moses (Musa a.s)", "Nabi Musa a.s."),
      religion: t(
        "Judaism & Christianity (Old Testament)",
        "Yahudi (Yudaisme) & Kristen (Perjanjian Lama)"
      ),
      status: t("Revealed to Prophet Moses", "Wahyu Kepada Nabi Musa a.s."),
      desc: t(
        "The divine scripture revealed to Prophet Moses as guidance, law, and light for the Children of Israel.",
        "Kitab suci yang diturunkan Allah SWT kepada Nabi Musa a.s. sebagai petunjuk, hukum, dan cahaya bagi Bani Israil."
      ),
      href: "/kitab/taurat",
      icon: Scroll,
      accentColor: "success" as const,
    },
    {
      title: "Psalms (Zabur of David)",
      arab: "الزبور",
      recipient: t("Prophet David (Daud a.s)", "Nabi Daud a.s."),
      religion: t(
        "Judaism (Tehillim) & Christianity (Psalms)",
        "Yahudi (Tehillim) & Kristen (Psalms)"
      ),
      status: t("Revealed to Prophet David", "Wahyu Kepada Nabi Daud a.s."),
      desc: t(
        "The divine scripture containing praises, prayers, and celestial wisdom revealed to Prophet David.",
        "Kitab yang berisi puji-pujian (tasbīḥ), doa, zikir, dan hikmah yang diturunkan Allah SWT kepada Nabi Daud a.s."
      ),
      href: "/kitab/zabur",
      icon: Flame,
      accentColor: "astronomy" as const,
    },
    {
      title: "Gospel (Injil of Jesus)",
      arab: "الإنجيل",
      recipient: t("Prophet Jesus (Isa a.s)", "Nabi Isa a.s."),
      religion: t(
        "Christianity (New Testament)",
        "Kristen (Nasrani / Perjanjian Baru)"
      ),
      status: t("Revealed to Prophet Jesus", "Wahyu Kepada Nabi Isa a.s."),
      desc: t(
        "The holy scripture revealed to Prophet Jesus containing truth, mercy, and divine guidance.",
        "Kitab suci yang diturunkan Allah SWT kepada Nabi Isa a.s. berisi ajaran kebenaran, kasih sayang, dan petunjuk."
      ),
      href: "/kitab/injil",
      icon: BookCheck,
      accentColor: "knowledge" as const,
    },
  ]

  return (
    <div
      className="theme-grid-bg min-h-screen py-8 font-mono text-foreground"
      suppressHydrationWarning
    >
      <div className="mx-auto max-w-5xl space-y-6 px-4 sm:px-6">
        <ContextBlock
          title={t("CANONICAL SCRIPTURE CODICES", "DIREKTORI MANUSKRIP ILAHI")}
          subtitle={t(
            "Affirming faith in divine scriptures is an essential pillar of Monotheistic truth. Allah SWT revealed His divine light across human epochs.",
            "Beriman kepada Kitab-Kitab Allah merupakan Rukun Iman ketiga. Allah SWT telah menurunkan firman dan petunjuk-Nya kepada para Nabi & Rasul sepanjang sejarah manusia sebagai penerang tauhid."
          )}
          operation="CODEX-DIRECTORY"
          status="ONLINE"
          accentColor="knowledge"
        />

        {/* Cross-Codex Search */}
        <Button
          href="/kitab/search"
          variant="console"
          accentColor="system"
          className="w-full"
        >
          <Search className="h-4 w-4" />
          {t(
            "UNIVERSAL CROSS-CODEX SEARCH ENGINE",
            "MESIN PENCARIAN LINTAS MANUSKRIP"
          )}
        </Button>

        {/* 4 Major Scripture Cards */}
        <PanelHeader
          title={`4 ${t("MAJOR CANONICAL CODICES", "MANUSKRIP ILAHI UTAMA")}`}
          status="SYNCED"
          icon={BookOpen}
          accentColor="knowledge"
        />

        <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2">
          {scriptureCards.map((item, idx) => (
            <Panel key={idx} level="level2" accentColor={item.accentColor}>
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div
                      className="tag-clip bg-space flex h-12 w-12 items-center justify-center border"
                      style={{ borderColor: `rgba(0, 240, 255, 0.3)` }}
                    >
                      <item.icon
                        className="h-6 w-6"
                        style={{ color: "#00F0FF" }}
                      />
                    </div>
                    <div>
                      <span className="block text-[9px] font-extrabold tracking-wider text-primary uppercase">
                        {item.status}
                      </span>
                      <h3 className="text-lg font-black tracking-wider text-foreground uppercase">
                        {item.title}
                      </h3>
                    </div>
                  </div>
                  <span className="arabic-text font-serif text-2xl font-bold text-primary">
                    {item.arab}
                  </span>
                </div>

                <div className="bg-space tag-clip space-y-1 border border-primary/20 p-3 text-xs">
                  <div className="flex justify-between">
                    <span className="text-primary">
                      {/* {t("RECIPIENT", "PENERIMA")}: */}
                    </span>
                    <span className="font-bold text-foreground">
                      {item.recipient}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-primary">
                      {/* {t("TRADITION", "TRADISI")}: */}
                    </span>
                    <span className="text-success font-bold">
                      {item.religion}
                    </span>
                  </div>
                </div>

                <p className="text-xs leading-relaxed text-primary">
                  {item.desc}
                </p>
              </div>

              <div className="mt-4">
                <Button
                  href={item.href}
                  variant="ghost"
                  accentColor="system"
                  className="w-full justify-between"
                >
                  <span>{t("OPEN CODEX", "BUKA MANUSKRIP")}</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </Panel>
          ))}
        </div>
      </div>
    </div>
  )
}

