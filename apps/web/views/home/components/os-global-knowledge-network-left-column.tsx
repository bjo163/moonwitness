import {
  Activity,
  BookOpen,
  Eye,
  FolderGit2,
  Globe2,
  Languages,
  MessageSquare,
  Moon,
  Users,
} from "lucide-react"
import { resolveVisualizationColor } from "@workspace/ui"

export function OSGlobalKnowledgeNetworkLeftColumn() {
  return (
    <div className="flex flex-col space-y-6 lg:col-span-3">
      <div className="rounded-xl border border-blue-500/30 bg-background p-4 shadow-sm">
        <div className="mb-4 text-[10px] font-black tracking-widest text-blue-400 uppercase">
          COMMUNITY OVERVIEW
        </div>
        <div className="space-y-3">
          {[
            {
              l: "GLOBAL MEMBERS",
              v: "12,842",
              d: "+342 this month",
              icon: Users,
              c: "#00F0FF",
            },
            {
              l: "ACTIVE TODAY",
              v: "1,827",
              d: "+18.6%",
              icon: Activity,
              c: "#10B981",
            },
            {
              l: "PROJECTS",
              v: "158",
              d: "+12 new",
              icon: FolderGit2,
              c: "#F59E0B",
            },
            {
              l: "COUNTRIES",
              v: "87",
              d: "+5 new",
              icon: Globe2,
              c: "#3B82F6",
            },
            {
              l: "LANGUAGES",
              v: "23",
              d: "+2 new",
              icon: MessageSquare,
              c: "#A855F7",
            },
          ].map((stat, i) => (
            <div
              key={i}
              className="flex items-center gap-3 rounded border border-border bg-background p-2 transition-colors hover:border-border"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-muted/30">
                <stat.icon
                  className="h-4 w-4"
                  style={{ color: resolveVisualizationColor(stat.c) }}
                />
              </div>
              <div className="flex-1">
                <div className="text-[8px] tracking-wider text-primary uppercase">
                  {stat.l}
                </div>
                <div
                  className="text-sm font-black"
                  style={{ color: resolveVisualizationColor(stat.c) }}
                >
                  {stat.v}
                </div>
              </div>
              <div className="w-16 text-right text-[8px] text-success">
                {stat.d}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-1 flex-col rounded-xl border border-border bg-background p-4">
        <div className="mb-4 flex items-center justify-between">
          <div className="text-[10px] font-black tracking-widest text-primary uppercase">
            NETWORK ACTIVITY
          </div>
          <div className="cursor-pointer text-[9px] font-bold text-primary transition-colors hover:text-foreground">
            View All
          </div>
        </div>
        <div className="mb-3 flex items-center gap-2 text-[9px] font-black tracking-widest text-success uppercase">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />{" "}
          LIVE FEED
        </div>
        <div className="space-y-4 font-mono">
          {[
            {
              n: "New moon sighting reported",
              s: "Indonesia - West Java",
              icon: Eye,
              c: "#00F0FF",
              t: "2 min ago",
            },
            {
              n: "New research published",
              s: "The Signs in the Heavens",
              icon: BookOpen,
              c: "#F59E0B",
              t: "15 min ago",
            },
            {
              n: "Qur'an translation updated",
              s: "Español - Surah Al-Furqan",
              icon: Languages,
              c: "#A855F7",
              t: "1 hour ago",
            },
            {
              n: "New contributor joined",
              s: "Canada",
              icon: Users,
              c: "#10B981",
              t: "2 hours ago",
            },
            {
              n: "Eclipse observation added",
              s: "14 May 2026",
              icon: Moon,
              c: "#3B82F6",
              t: "3 hours ago",
            },
          ].map((act, i) => (
            <div key={i} className="relative flex items-start gap-3">
              {i !== 4 && (
                <div className="absolute top-[26px] bottom-[-16px] left-[13px] w-px bg-muted/30" />
              )}
              <div
                className="z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-border bg-background"
                style={{ borderColor: resolveVisualizationColor(act.c) }}
              >
                <act.icon
                  className="h-3.5 w-3.5"
                  style={{ color: resolveVisualizationColor(act.c) }}
                />
              </div>
              <div className="flex-1">
                <div className="mb-0.5 text-[10px] leading-tight font-bold text-foreground">
                  {act.n}
                </div>
                <div className="truncate text-[9px] text-primary">{act.s}</div>
              </div>
              <div className="text-[8px] whitespace-nowrap text-primary">
                {act.t}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
