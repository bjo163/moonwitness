import {
  ArrowRight,
  BookOpen,
  Eye,
  Globe2,
  Languages,
  MessageSquare,
  Users,
} from "lucide-react"
import { resolveVisualizationColor } from "@workspace/ui"

export function OSGlobalKnowledgeNetworkCenterColumn() {
  return (
    <div className="flex flex-col gap-6 lg:col-span-6">
      <div className="relative flex min-h-[350px] flex-col overflow-hidden rounded-2xl border-2 border-primary/20 bg-background p-4">
        <div className="relative z-10 mb-2 flex items-center justify-between">
          <div className="text-[10px] font-black tracking-widest text-primary uppercase">
            GLOBAL RESEARCH MAP
          </div>
          <div className="flex items-center gap-1 rounded-full border border-emerald-500/50 bg-success/20 px-2 py-1 text-[9px] font-bold text-success">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />{" "}
            LIVE
          </div>
        </div>
        <div className="absolute inset-0 mt-10 opacity-70">
          <div className="h-full w-full bg-[radial-gradient(ellipse_at_center,rgba(0,240,255,0.1)_0%,transparent_70%)]" />
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPgo8cmVjdCB3aWR0aD0iOCIgaGVpZ2h0PSI4IiBmaWxsPSIjMDAwIiBmaWxsLW9wYWNpdHk9IjAuMCIvPgo8Y2lyY2xlIGN4PSI0IiBjeT0iNCIgcj0iMC41IiBmaWxsPSIjMzBENDc0Ii8+Cjwvc3ZnPg==')] opacity-50" />
          <div className="absolute top-[40%] left-[20%] h-3 w-3 animate-pulse rounded-full bg-primary shadow-sm" />
          <div className="absolute top-[30%] left-[45%] h-2 w-2 rounded-full bg-emerald-400 shadow-sm" />
          <div className="absolute top-[25%] left-[55%] h-5 w-5 animate-pulse rounded-full bg-primary shadow-sm" />
          <div className="absolute top-[50%] left-[75%] h-3 w-3 rounded-full bg-amber-400 shadow-sm" />
          <div className="absolute top-[60%] left-[80%] h-2 w-2 rounded-full bg-blue-400 shadow-sm" />
          <svg
            className="absolute inset-0 z-0 h-full w-full opacity-40"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            <path
              d="M 20 40 Q 30 30 45 30"
              fill="none"
              stroke={resolveVisualizationColor("#00F0FF")}
              strokeWidth="1"
              strokeDasharray="2 2"
            />
            <path
              d="M 45 30 Q 50 20 55 25"
              fill="none"
              stroke={resolveVisualizationColor("#A855F7")}
              strokeWidth="1"
              strokeDasharray="2 2"
            />
            <path
              d="M 55 25 Q 65 30 75 50"
              fill="none"
              stroke={resolveVisualizationColor("#F59E0B")}
              strokeWidth="1"
              strokeDasharray="2 2"
            />
          </svg>
        </div>
        <div className="relative z-10 mt-auto grid grid-cols-5 gap-2 border-t border-border pt-4">
          {[
            { l: "Observations", v: "3,248", icon: Eye, c: "#00F0FF" },
            { l: "Research Papers", v: "732", icon: BookOpen, c: "#A855F7" },
            { l: "Translations", v: "1,923", icon: Languages, c: "#10B981" },
            { l: "Discussions", v: "5,112", icon: MessageSquare, c: "#F59E0B" },
            { l: "Contributors", v: "12,842", icon: Users, c: "#3B82F6" },
          ].map((stat, i) => (
            <div
              key={i}
              className="rounded border border-border bg-background/80 p-2 text-center backdrop-blur"
            >
              <div className="mb-1 flex justify-center">
                <stat.icon
                  className="h-3 w-3"
                  style={{ color: resolveVisualizationColor(stat.c) }}
                />
              </div>
              <div className="text-[7px] tracking-widest text-primary uppercase">
                {stat.l}
              </div>
              <div
                className="mt-0.5 font-mono text-[11px] font-black"
                style={{ color: resolveVisualizationColor(stat.c) }}
              >
                {stat.v}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid h-full grid-cols-1 gap-4 md:grid-cols-3">
        <div className="flex flex-col rounded-xl border border-border bg-background p-4">
          <div className="mb-4 flex items-center justify-between">
            <div className="text-[9px] font-black tracking-widest text-primary uppercase">
              COMMUNITY OBSERVATIONS
            </div>
            <div className="cursor-pointer text-[8px] text-primary hover:text-foreground">
              View All
            </div>
          </div>
          <div className="flex flex-1 flex-col items-center justify-center text-center">
            <div className="mb-3 h-16 w-16 overflow-hidden rounded-full shadow-sm">
              <img
                src="/assets/cam_moon.png"
                alt="Moon knowledge network"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="mb-0.5 text-[10px] font-bold text-foreground">
              New Moon Sighting
            </div>
            <div className="mb-2 text-[9px] text-primary">
              Hilal Shawwal 1447 H
            </div>
            <div className="mb-0.5 font-mono text-[9px] text-primary">
              Indonesia - Aceh
            </div>
            <div className="text-[8px] text-primary">12 May 2026</div>
          </div>
          <div className="mt-3 flex justify-center border-t border-border pt-3">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="flex h-6 w-6 items-center justify-center overflow-hidden rounded-full border border-border bg-muted text-[8px]"
                >
                  👤
                </div>
              ))}
              <div className="z-10 flex h-6 w-6 items-center justify-center rounded-full border border-border bg-muted text-[8px] font-bold text-primary">
                +124
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col rounded-xl border border-border bg-background p-4">
          <div className="mb-4 flex items-center justify-between">
            <div className="text-[9px] font-black tracking-widest text-primary uppercase">
              OPEN PROJECTS
            </div>
            <div className="cursor-pointer text-[8px] text-primary hover:text-foreground">
              View All
            </div>
          </div>
          <div className="flex-1 space-y-4">
            {[
              { n: "Qur'an Multilingual Project", p: 72 },
              { n: "Hadith Visualization Project", p: 58 },
              { n: "Islamic Timeline Project", p: 65 },
              { n: "Astronomy Atlas Project", p: 41 },
              { n: "Knowledge Graph AI", p: 33 },
            ].map((project, i) => (
              <div key={i}>
                <div className="mb-1 flex justify-between text-[9px]">
                  <span className="text-foreground">{project.n}</span>
                  <span className="font-mono text-primary">{project.p}%</span>
                </div>
                <div className="h-1 overflow-hidden rounded-full bg-background">
                  <div
                    className="h-full rounded-full bg-blue-500"
                    style={{ width: `${project.p}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col items-center justify-between rounded-xl border border-border bg-background p-4 text-center">
          <div className="mb-2 flex w-full items-center justify-between">
            <div className="text-[9px] font-black tracking-widest text-success uppercase">
              TRANSLATION NETWORK
            </div>
          </div>
          <div className="relative my-2 h-24 w-24">
            <Globe2 className="h-full w-full text-success/20" />
            <div className="absolute inset-0 rounded-full bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPgo8cmVjdCB3aWR0aD0iOCIgaGVpZ2h0PSI4IiBmaWxsPSIjMDAwIiBmaWxsLW9wYWNpdHk9IjAuMCIvPgo8Y2lyY2xlIGN4PSI0IiBjeT0iNCIgcj0iMC41IiBmaWxsPSIjMzBENDc0Ii8+Cjwvc3ZnPg==')] [mask-image:radial-gradient(circle,white,transparent)] opacity-60" />
          </div>
          <div>
            <div className="text-sm font-black text-success">23 Languages</div>
            <div className="mt-1 text-[9px] text-primary">
              1,923 Verses Translated
            </div>
          </div>
          <button
            type="button"
            className="mt-3 flex w-full items-center justify-center gap-1 rounded border border-emerald-500/40 bg-transparent py-2 text-[9px] font-black tracking-widest text-success uppercase transition-colors hover:bg-success/10"
          >
            JOIN TRANSLATION <ArrowRight className="h-3 w-3" />
          </button>
        </div>
      </div>
    </div>
  )
}
