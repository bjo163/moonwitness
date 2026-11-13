import Image from "next/image"
import { resolveVisualizationColor } from "@workspace/ui"

export function OSGlobalKnowledgeNetworkRightColumn() {
  return (
    <div className="flex flex-col gap-6 lg:col-span-3">
      <div className="rounded-xl border border-border bg-background p-4">
        <div className="mb-4 flex items-center justify-between">
          <div className="text-[10px] font-black tracking-widest text-primary uppercase">
            LATEST RESEARCH
          </div>
          <div className="cursor-pointer text-[9px] text-primary hover:text-foreground">
            View All
          </div>
        </div>
        <div className="space-y-3">
          {[
            {
              n: "The Moon as a Sign in the Night Journey",
              a: "Aisha Rahman",
              cat: "ASTRONOMY",
              t: "2h ago",
              c: "#00F0FF",
              img: "/assets/cam_moon.png",
            },
            {
              n: "Mercy in the Qur'an: A Thematic Study",
              a: "Yusuf Al-Hakim",
              cat: "QUR'AN",
              t: "4h ago",
              c: "#10B981",
              img: "/assets/hero_bg.png",
            },
            {
              n: "The Treaty of Hudaybiyyah Lessons for Today",
              a: "Omar Faruq",
              cat: "HISTORY",
              t: "6h ago",
              c: "#F59E0B",
              img: "/assets/mod_history.png",
            },
            {
              n: "The Names of Allah and Their Universe",
              a: "Fatimah Zahra",
              cat: "TAFSIR",
              t: "8h ago",
              c: "#3B82F6",
              img: "/assets/hero_bg.png",
            },
          ].map((research, i) => (
            <div
              key={i}
              className="group flex cursor-pointer items-center gap-3 rounded p-2 transition-colors hover:bg-muted/30"
            >
              <div className="h-12 w-12 shrink-0 overflow-hidden rounded border border-border bg-primary group-hover:border-primary/50">
                <Image
                  unoptimized
                  width={120}
                  height={120}
                  alt="Avatar"
                  src={research.img}
                  className="h-full w-full object-cover opacity-80"
                />
              </div>
              <div className="flex-1">
                <div className="mb-1 text-[10px] leading-tight font-bold text-foreground group-hover:text-primary">
                  {research.n}
                </div>
                <div className="text-[8px] text-primary">{research.a}</div>
              </div>
              <div className="shrink-0 text-right">
                <div
                  className="mb-1 inline-block rounded border border-current px-1.5 py-0.5 text-[8px] font-bold uppercase"
                  style={{ color: resolveVisualizationColor(research.c) }}
                >
                  {research.cat}
                </div>
                <div className="block font-mono text-[7px] text-primary">
                  {research.t}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-1 flex-col rounded-xl border border-border bg-background p-4">
        <div className="mb-4 flex items-center justify-between">
          <div className="text-[10px] font-black tracking-widest text-primary uppercase">
            TOP CONTRIBUTORS
          </div>
          <div className="cursor-pointer text-[9px] text-primary hover:text-foreground">
            View All
          </div>
        </div>
        <div className="space-y-4">
          {[
            { i: "01", n: "Aisha Rahman", r: "Researcher", pts: "12,540 pts" },
            { i: "02", n: "Yusuf Al-Hakim", r: "Translator", pts: "9,820 pts" },
            { i: "03", n: "Omar Faruq", r: "Historian", pts: "8,410 pts" },
            { i: "04", n: "Fatimah Zahra", r: "Researcher", pts: "7,230 pts" },
            { i: "05", n: "Iman Al-Fatih", r: "Developer", pts: "6,780 pts" },
          ].map((user, i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="font-mono text-[10px] font-black text-warning">
                  {user.i}
                </div>
                <div className="flex h-6 w-6 items-center justify-center overflow-hidden rounded-full bg-muted text-[10px]">
                  👤
                </div>
                <div>
                  <div className="text-[10px] font-bold text-foreground">
                    {user.n}
                  </div>
                  <div className="text-[8px] text-primary">{user.r}</div>
                </div>
              </div>
              <div className="font-mono text-[9px] text-primary">
                {user.pts}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
