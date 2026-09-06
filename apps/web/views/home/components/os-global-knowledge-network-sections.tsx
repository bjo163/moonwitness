import {
  ArrowRight,
  BookOpen,
  Calendar,
  Code,
  Heart,
  Hexagon,
  Languages,
  Telescope,
} from "lucide-react"
import { Button, resolveVisualizationColor } from "@workspace/ui"

type ColorValue = string

export type NetworkHeaderProps = {
  sectionNumber: string
  label: string
  title: string
  arabicQuote: string
  quote: string
  reference: string
}

export function NetworkHeader({
  sectionNumber,
  label,
  title,
  arabicQuote,
  quote,
  reference,
}: NetworkHeaderProps) {
  return (
    <div className="flex flex-col justify-between gap-6 border-b border-border pb-6 xl:flex-row xl:items-center">
      <div className="max-w-2xl space-y-4">
        <div className="inline-flex items-center gap-3 rounded-sm border-2 border-blue-500/60 bg-background px-3.5 py-1.5 text-xs font-black tracking-[0.25em] text-blue-300 uppercase shadow-sm">
          <span className="rounded-xs bg-blue-500 px-1.5 py-0.5 font-black text-foreground">
            {sectionNumber}
          </span>
          <span>{label}</span>
        </div>
        <h2 className="font-mono text-xl font-black tracking-widest text-foreground uppercase drop-shadow-sm sm:text-2xl">
          {title}
        </h2>
      </div>
      <div className="border-l-2 border-blue-400 bg-gradient-to-r from-primary to-transparent p-4 text-center xl:text-left">
        <div
          className="mb-2 font-arabic text-sm font-bold text-blue-400"
          dir="rtl"
        >
          {arabicQuote}
        </div>
        <div className="font-sans text-[11px] text-blue-100 italic">
          &quot;{quote}&quot;{" "}
          <span className="mt-1 ml-1 block font-mono font-black text-blue-400 not-italic xl:mt-0 xl:inline">
            {reference}
          </span>
        </div>
      </div>
      <div className="relative hidden h-20 flex-1 opacity-60 lg:block">
        <svg
          className="absolute inset-0 h-full w-full"
          preserveAspectRatio="none"
        >
          <path
            d="M0,50 Q100,20 200,50 T400,50"
            fill="none"
            stroke={resolveVisualizationColor("#3B82F6")}
            strokeWidth="1"
            strokeDasharray="4 4"
          />
          <circle
            cx="200"
            cy="50"
            r="4"
            fill={resolveVisualizationColor("#3B82F6")}
          />
          <circle
            cx="100"
            cy="20"
            r="3"
            fill={resolveVisualizationColor("#00F0FF")}
          />
          <circle
            cx="300"
            cy="80"
            r="5"
            fill={resolveVisualizationColor("#10B981")}
          />
          <circle
            cx="50"
            cy="70"
            r="3"
            fill={resolveVisualizationColor("#EC4899")}
          />
        </svg>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/10 to-transparent" />
      </div>
    </div>
  )
}

export type ContributionItem = {
  name: string
  description: string
  icon: typeof Telescope
  color: ColorValue
}

export type ContributionSectionProps = {
  items: readonly ContributionItem[]
  onBecomeContributor?: () => void
}

export function ContributionSection({
  items,
  onBecomeContributor,
}: ContributionSectionProps) {
  return (
    <div className="grid grid-cols-1 items-stretch gap-6 pt-2 lg:grid-cols-12">
      <div className="rounded-xl border border-border bg-background p-6 lg:col-span-8">
        <div className="mb-6 flex items-center gap-2 text-[10px] font-black tracking-widest text-primary uppercase">
          <span className="text-lg leading-none text-blue-500">“</span> HOW YOU
          CAN CONTRIBUTE
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 md:grid-cols-5">
          {items.map((item) => {
            const Icon = item.icon
            return (
              <div
                key={item.name}
                className="group flex cursor-pointer flex-col items-center rounded p-2 text-center transition-colors hover:bg-muted/30"
              >
                <Icon
                  className="mb-3 h-8 w-8"
                  style={{ color: resolveVisualizationColor(item.color) }}
                />
                <div className="mb-1.5 line-clamp-2 text-[9px] font-bold text-foreground uppercase">
                  {item.name}
                </div>
                <div className="text-[8px] leading-relaxed text-primary">
                  {item.description}
                </div>
              </div>
            )
          })}
        </div>
      </div>
      <div className="relative flex flex-col justify-center overflow-hidden rounded-xl border-2 border-blue-500/40 bg-background p-6 shadow-sm lg:col-span-4">
        <div className="relative z-10 text-center">
          <div className="mb-3 text-sm font-black tracking-widest text-foreground uppercase">
            TOGETHER WE LIGHT THE PATH OF KNOWLEDGE
          </div>
          <div className="mb-6 font-sans text-[10px] text-blue-100/70">
            Join thousands of seekers, researchers, and observers around the
            world.
          </div>
          <Button
            type="button"
            onClick={onBecomeContributor}
            className="w-full border border-blue-500/50 bg-background py-3 text-[10px] font-black tracking-widest text-blue-400 uppercase hover:bg-blue-500/20"
          >
            BECOME A CONTRIBUTOR <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </div>
  )
}

export type NetworkFooterProps = { onMeetupClick?: () => void }

export function NetworkFooter({ onMeetupClick }: NetworkFooterProps) {
  const bars = [
    8, 14, 5, 12, 18, 6, 9, 15, 7, 11, 4, 16, 10, 13, 5, 17, 8, 12, 6, 14, 7, 9,
    15, 5, 11, 13, 6, 18, 4, 10,
  ]
  return (
    <div className="mt-6 flex flex-col items-center justify-between gap-6 border-t border-border px-2 pt-4 font-mono text-[9px] font-bold tracking-widest text-primary uppercase lg:flex-row">
      <div className="flex items-center gap-4">
        <Hexagon className="h-6 w-6 text-blue-500/50" />
        <div>
          <div className="text-foreground">GLOBAL SYNC</div>
          <div>All nodes connected</div>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="text-right">
          <div className="text-primary">NETWORK STATUS</div>
          <div className="flex items-center gap-1.5 text-success">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />{" "}
            STABLE
          </div>
        </div>
      </div>
      <div className="hidden items-center gap-0.5 opacity-50 md:flex">
        {bars.map((height, index) => (
          <div key={index} className="w-[1px] bg-blue-400" style={{ height }} />
        ))}
      </div>
      <button
        type="button"
        onClick={onMeetupClick}
        className="flex items-center gap-3 text-left"
      >
        <Calendar className="h-5 w-5 text-primary" />
        <div>
          <div className="text-primary">NEXT COMMUNITY MEETUP</div>
          <div className="text-foreground">14 June 2026 • 20:00 WIB</div>
        </div>
      </button>
      <div className="flex items-center gap-4 text-right">
        <div className="max-w-[200px] font-sans text-foreground/60 normal-case italic">
          &quot;Indeed, the believers are but brothers.&quot;
          <br />
          <span className="font-mono text-[8px] font-bold text-primary uppercase not-italic">
            Qur&apos;an 49:10
          </span>
        </div>
        <div className="flex h-8 w-8 items-center justify-center rounded border border-border">
          <Hexagon className="h-4 w-4 text-primary" />
        </div>
      </div>
    </div>
  )
}

export const defaultContributionItems: readonly ContributionItem[] = [
  {
    name: "REPORT OBSERVATION",
    description: "Share your moon sighting and sky observations.",
    icon: Telescope,
    color: "#00F0FF",
  },
  {
    name: "WRITE & RESEARCH",
    description: "Publish articles, papers, and knowledge for the ummah.",
    icon: BookOpen,
    color: "#10B981",
  },
  {
    name: "TRANSLATE",
    description: "Help translate Qur'an, and knowledge into more languages.",
    icon: Languages,
    color: "#3B82F6",
  },
  {
    name: "DEVELOP",
    description: "Build tools, features, and open source solutions.",
    icon: Code,
    color: "#F59E0B",
  },
  {
    name: "SUPPORT",
    description: "Support the mission through dua, time, or resources.",
    icon: Heart,
    color: "#EC4899",
  },
]
