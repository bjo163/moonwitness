import React, { type ElementType } from "react"
import {
  Network,
  Link2,
  Activity,
  Database,
  Clock,
  BookOpen,
  Users,
  Map,
  Zap,
  CheckCircle2,
  Globe2,
  ArrowRight,
  Search,
} from "lucide-react"
import { Button } from "../../components/button"
import { useKnowledgeGraph } from "@workspace/hooks"

const iconMap: Record<string, ElementType> = {
  Users,
  BookOpen,
  Map,
}

type TopEntityItem = { i: string; col: string; n: string; c: number | string }

type GraphStatistics = {
  totalEntities: number
  totalConnections: number
  activeRelations: number
  dataSources: number
  lastUpdated: string
}

type GraphAnalyticsController = {
  loading: boolean
  statistics?: GraphStatistics
  topEntities: TopEntityItem[]
}

/* eslint-disable @typescript-eslint/no-magic-numbers -- Mock coordinate arrays for SVG growth visualizations */
const GROWTH_CHART_X = [0, 20, 40, 60, 80, 100, 120, 140, 160] as const
const GROWTH_CHART_Y1 = [90, 80, 85, 70, 60, 65, 40, 20, 10] as const
const GROWTH_CHART_Y2 = [100, 95, 100, 90, 85, 90, 70, 65, 50] as const
const EXPLORER_NODES_X = [10, 40, 70, 100, 130, 160, 20, 80, 120, 150] as const
const EXPLORER_NODES_Y = [10, 25, 5, 30, 15, 40, 40, 45, 5, 20] as const
/* eslint-enable @typescript-eslint/no-magic-numbers */

function useGraphAnalyticsController(): GraphAnalyticsController {
  const { data, loading } = useKnowledgeGraph()

  return {
    loading,
    statistics: data?.statistics,
    topEntities: (data?.topEntities as TopEntityItem[] | undefined) ?? [],
  }
}

type GraphStatisticsPanelProps = Pick<GraphAnalyticsController, "loading" | "statistics">

function GraphStatisticsPanel({ loading, statistics }: GraphStatisticsPanelProps) {
  const items = [
    { icon: Network, label: "Total Entities", value: statistics?.totalEntities },
    { icon: Link2, label: "Total Connections", value: statistics?.totalConnections },
    { icon: Activity, label: "Active Relations", value: statistics?.activeRelations },
    { icon: Database, label: "Data Sources", value: statistics?.dataSources },
  ]

  return (
    <div className="bg-background flex flex-col justify-between rounded-xl border border-border p-4">
      <div className="mb-4 text-[9px] font-black tracking-widest text-primary uppercase">
        GRAPH STATISTICS
      </div>
      <div className="space-y-2 text-[9px]">
        {items.map(({ icon: Icon, label, value }) => (
          <div key={label} className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-primary">
              <Icon className="h-3.5 w-3.5" /> {label}
            </span>
            <span className="font-mono text-foreground">
              {loading ? "..." : value}
            </span>
          </div>
        ))}
        <div className="mt-2 flex items-center justify-between border-t border-border pt-2">
          <span className="flex items-center gap-2 text-primary">
            <Clock className="h-3.5 w-3.5" /> Last Updated
          </span>
          <span className="font-mono text-primary">
            {loading ? "..." : statistics?.lastUpdated}
          </span>
        </div>
      </div>
    </div>
  )
}

function ConnectionStrengthPanel() {
  return (
    <div className="bg-background flex flex-col rounded-xl border border-border p-4">
      <div className="mb-4 text-[9px] font-black tracking-widest text-primary uppercase">
        CONNECTION STRENGTH
      </div>
      <div className="flex flex-1 items-center justify-between">
        <div className="relative flex h-20 w-20 shrink-0 items-center justify-center rounded-full border-4 border-primary shadow-sm">
          <div
            className="absolute inset-0 rounded-full border-[4px] border-secondary border-r-transparent border-b-transparent"
            style={{ transform: "rotate(-20deg)" }}
          />
          <div
            className="absolute inset-0 rounded-full border-[4px] border-primary border-b-transparent border-l-transparent shadow-sm"
            style={{ transform: "rotate(70deg)" }}
          />
          <div
            className="border-success absolute inset-0 rounded-full border-[4px] border-t-transparent border-r-transparent"
            style={{ transform: "rotate(160deg)" }}
          />
          <div
            className="border-knowledge absolute inset-0 rounded-full border-[4px] border-t-transparent border-l-transparent"
            style={{ transform: "rotate(220deg)" }}
          />

          <div className="text-center">
            <div className="font-mono text-sm leading-none font-black text-foreground">
              128K
            </div>
            <div className="mt-0.5 text-[5px] font-bold text-primary uppercase">
              Total
              <br />
              Connections
            </div>
          </div>
        </div>

        <div className="flex-1 space-y-1.5 pl-4 text-[9px]">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-foreground">
              <span className="h-2 w-2 rounded-full bg-secondary" /> Strong
            </span>
            <span className="font-mono text-primary">42%</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-foreground">
              <span className="h-2 w-2 rounded-full bg-primary" /> Medium
            </span>
            <span className="font-mono text-primary">35%</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-foreground">
              <span className="bg-success h-2 w-2 rounded-full" /> Weak
            </span>
            <span className="font-mono text-primary">17%</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-foreground">
              <span className="bg-knowledge h-2 w-2 rounded-full" /> Potential
            </span>
            <span className="font-mono text-primary">6%</span>
          </div>
        </div>
      </div>
    </div>
  )
}

type TopConnectedEntitiesPanelProps = Pick<GraphAnalyticsController, "loading" | "topEntities">

function TopConnectedEntitiesPanel({
  loading,
  topEntities,
}: TopConnectedEntitiesPanelProps) {
  return (
    <div className="bg-background flex flex-col rounded-xl border border-border p-4">
      <div className="mb-4 text-[9px] font-black tracking-widest text-primary uppercase">
        TOP CONNECTED ENTITIES
      </div>
      <div className="flex-1 space-y-2">
        {loading ? (
          <div className="animate-pulse text-xs text-foreground/50">
            Loading insights...
          </div>
        ) : (
          topEntities.map((ent, i) => {
            const IconComponent = iconMap[ent.i] || BookOpen
            return (
              <div
                key={i}
                className="group flex cursor-pointer items-center justify-between text-[9px]"
              >
                <span className="flex items-center gap-2 text-foreground transition-colors group-hover:text-foreground">
                  <span className="w-4 text-center text-primary">{i + 1}</span>
                  <IconComponent className={`h-3 w-3 ${ent.col}`} />
                  <span className="w-24 truncate">{ent.n}</span>
                </span>
                <span className="font-mono text-[8px] text-primary group-hover:text-primary">
                  {ent.c} connections
                </span>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}

function ConnectionsOverTimePanel() {
  return (
    <div className="bg-background flex flex-col rounded-xl border border-border p-4">
      <div className="mb-2 flex items-center justify-between">
        <div className="text-[9px] font-black tracking-widest text-primary uppercase">
          CONNECTIONS OVER TIME
        </div>
        <div className="flex cursor-pointer items-center gap-1 rounded bg-muted/30 px-1.5 py-0.5 text-[8px] text-primary">
          All Time ∨
        </div>
      </div>

      <div className="relative mt-2 mb-4 ml-5 flex-1 border-b border-l border-border">
        <div className="absolute top-0 -left-5 -translate-y-1/2 text-[6px] text-primary">
          150K
        </div>
        <div className="absolute bottom-[50%] -left-5 -translate-y-1/2 text-[6px] text-primary">
          100K
        </div>
        <div className="absolute bottom-[25%] -left-5 -translate-y-1/2 text-[6px] text-primary">
          50K
        </div>
        <div className="absolute bottom-0 -left-5 translate-y-1/2 text-[6px] text-primary">
          0
        </div>

        <svg
          className="absolute inset-0 h-full w-full overflow-visible"
          preserveAspectRatio="none"
        >
          <polyline
            points="0,90 20,80 40,85 60,70 80,60 100,65 120,40 140,20 160,10"
            fill="none"
            className="stroke-primary"
            strokeWidth="1.5"
          />
          <polyline
            points="0,100 20,95 40,100 60,90 80,85 100,90 120,70 140,65 160,50"
            fill="none"
            className="stroke-warning"
            strokeWidth="1.5"
          />
          {GROWTH_CHART_X.map((cx, i) => (
            <React.Fragment key={i}>
              <circle
                cx={cx}
                cy={GROWTH_CHART_Y1[i]}
                r="1.5"
                className="fill-primary"
              />
              <circle
                cx={cx}
                cy={GROWTH_CHART_Y2[i]}
                r="1.5"
                className="fill-warning"
              />
            </React.Fragment>
          ))}
        </svg>

        <div className="absolute inset-x-0 -bottom-3 flex justify-between font-mono text-[6px] text-primary">
          <span>2022</span>
          <span>2023</span>
          <span>2024</span>
          <span>2025</span>
        </div>
      </div>
      <div className="mt-1 text-center text-[7px] text-primary">
        Consistent growth of knowledge connections
      </div>
    </div>
  )
}

function DiscoveryInsightsPanel() {
  return (
    <div className="bg-background flex flex-1 flex-col rounded-xl border border-border p-3">
      <div className="mb-2 text-[9px] font-black tracking-widest text-primary uppercase">
        DISCOVERY INSIGHTS
      </div>
      <div className="flex-1 space-y-2">
        <div className="flex items-start gap-2">
          <Zap className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
          <div className="text-[8px] leading-tight text-foreground">
            New connection found between <span className="text-primary">Qur&apos;an (55:33)</span> and
            Black Holes
          </div>
        </div>
        <div className="flex items-start gap-2">
          <CheckCircle2 className="text-success mt-0.5 h-3.5 w-3.5 shrink-0" />
          <div className="text-[8px] leading-tight text-foreground">
            Strong relation discovered between Patience and 37 historical events
          </div>
        </div>
        <div className="flex items-start gap-2">
          <Globe2 className="text-warning mt-0.5 h-3.5 w-3.5 shrink-0" />
          <div className="text-[8px] leading-tight text-foreground">
            Ibrahim (AS) connected to 5 new astronomical phenomena
          </div>
        </div>
      </div>
      <Button type="button" variant="ghost" className="mt-2 flex items-center gap-1 text-[8px] font-bold text-primary transition-colors hover:text-foreground">
        View All Insights <ArrowRight className="h-2.5 w-2.5" />
      </Button>
    </div>
  )
}

function KnowledgeExplorerPanel() {
  return (
    <div className="bg-background rounded-xl border border-primary/20 p-3">
      <div className="mb-2 text-[9px] font-black tracking-widest text-primary uppercase">
        KNOWLEDGE EXPLORER
      </div>
      <div className="relative mb-2">
        <Search className="absolute top-1/2 left-2 h-3 w-3 -translate-y-1/2 text-primary" />
        <input
          type="text"
          placeholder="Search in graph..."
          className="bg-background w-full rounded border border-border py-1 pr-6 pl-6 text-[8px] text-foreground focus:outline-none"
        />
        <div className="absolute top-1/2 right-1 -translate-y-1/2 px-1 text-[6px] text-primary">
          ⌘ K
        </div>
      </div>
      <div className="relative h-12 w-full overflow-hidden opacity-50">
        <svg
          className="absolute inset-0 h-full w-full"
          preserveAspectRatio="none"
        >
          <path
            d="M 10,10 L 40,25 L 70,5 L 100,30 L 130,15 L 160,40"
            fill="none"
            className="stroke-primary"
            strokeWidth="0.5"
            strokeOpacity="0.5"
          />
          <path
            d="M 20,40 L 40,25 L 80,45 L 100,30 L 120,5 L 150,20"
            fill="none"
            className="stroke-knowledge"
            strokeWidth="0.5"
            strokeOpacity="0.5"
          />
          {EXPLORER_NODES_X.map((cx, i) => (
            <circle
              key={i}
              cx={cx}
              cy={EXPLORER_NODES_Y[i]}
              r="1"
              className="fill-white"
            />
          ))}
        </svg>
      </div>
      <Button type="button" variant="ghost" className="mt-1 flex w-full items-center justify-center gap-1 text-center text-[8px] font-bold text-primary transition-colors hover:text-foreground">
        Open Full Explorer <ArrowRight className="h-2.5 w-2.5" />
      </Button>
    </div>
  )
}

type GraphAnalyticsPresentationProps = GraphAnalyticsController

function GraphAnalyticsPresentation({
  loading,
  statistics,
  topEntities,
}: GraphAnalyticsPresentationProps) {
  return (
    <div className="grid grid-cols-1 items-stretch gap-4 pt-2 md:grid-cols-2 lg:grid-cols-5">
      <GraphStatisticsPanel loading={loading} statistics={statistics} />
      <ConnectionStrengthPanel />
      <TopConnectedEntitiesPanel loading={loading} topEntities={topEntities} />
      <ConnectionsOverTimePanel />
      <div className="flex flex-col gap-4">
        <DiscoveryInsightsPanel />
        <KnowledgeExplorerPanel />
      </div>
    </div>
  )
}

export function GraphAnalyticsWidget() {
  const controller = useGraphAnalyticsController()

  return <GraphAnalyticsPresentation {...controller} />
}
