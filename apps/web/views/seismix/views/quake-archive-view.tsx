"use client"

import { useState, useMemo } from "react"
import {
  Database,
  Search,
  Filter,
  Calendar,
  MapPin,
  Activity,
  Layers,
  AlertTriangle,
  ChevronDown,
  ArrowUpDown,
  Eye,
  Globe,
  Clock,
  TrendingUp,
} from "lucide-react"
import { ContextBlock } from "@workspace/ui"
import { Panel, PanelHeader } from "@workspace/ui"
import { HUDTabs } from "@workspace/ui"

// ── ARCHIVE DATA ─────────────────────────────────────────
type HistoricQuake = {
  id: string
  name: string
  date: string
  magnitude: number
  depth: number
  location: string
  casualties: string
  type: "megathrust" | "strike-slip" | "normal" | "volcanic"
  tsunamiGenerated: boolean
  description: string
  coordinates: { lat: number; lng: number }
}

const HISTORIC_QUAKES: HistoricQuake[] = [
  {
    id: "HQ-001",
    name: "GREAT CHILEAN EARTHQUAKE",
    date: "1960-05-22",
    magnitude: 9.5,
    depth: 33,
    location: "VALDIVIA, CHILE",
    casualties: "1,000 — 6,000",
    type: "megathrust",
    tsunamiGenerated: true,
    description:
      "The most powerful earthquake ever recorded. Generated a massive tsunami that crossed the Pacific Ocean, reaching Hawaii and Japan.",
    coordinates: { lat: -38.1, lng: -73.0 },
  },
  {
    id: "HQ-002",
    name: "GREAT ALASKA EARTHQUAKE",
    date: "1964-03-27",
    magnitude: 9.2,
    depth: 25,
    location: "PRINCE WILLIAM SOUND, ALASKA",
    casualties: "131",
    type: "megathrust",
    tsunamiGenerated: true,
    description:
      "Strongest earthquake in North American history. Caused ground fissures, landslides, and tsunamis that devastated coastal communities.",
    coordinates: { lat: 61.0, lng: -147.5 },
  },
  {
    id: "HQ-003",
    name: "SUMATRA–ANDAMAN EARTHQUAKE",
    date: "2004-12-26",
    magnitude: 9.1,
    depth: 30,
    location: "INDIAN OCEAN, SUMATRA",
    casualties: "227,898",
    type: "megathrust",
    tsunamiGenerated: true,
    description:
      "Triggered the devastating Indian Ocean tsunami. One of the deadliest natural disasters in history, affecting 14 countries.",
    coordinates: { lat: 3.3, lng: 95.9 },
  },
  {
    id: "HQ-004",
    name: "TŌHOKU EARTHQUAKE",
    date: "2011-03-11",
    magnitude: 9.1,
    depth: 29,
    location: "PACIFIC OCEAN, JAPAN",
    casualties: "19,759",
    type: "megathrust",
    tsunamiGenerated: true,
    description:
      "Triggered a massive tsunami and the Fukushima Daiichi nuclear disaster. Most powerful earthquake ever recorded in Japan.",
    coordinates: { lat: 38.3, lng: 142.4 },
  },
  {
    id: "HQ-005",
    name: "KASHMIR EARTHQUAKE",
    date: "2005-10-08",
    magnitude: 7.6,
    depth: 26,
    location: "MUZAFFARABAD, PAKISTAN",
    casualties: "87,351",
    type: "strike-slip",
    tsunamiGenerated: false,
    description:
      "Devastating earthquake in the Himalayan region. Destroyed entire villages and left millions homeless.",
    coordinates: { lat: 34.5, lng: 73.6 },
  },
  {
    id: "HQ-006",
    name: "HAITI EARTHQUAKE",
    date: "2010-01-12",
    magnitude: 7.0,
    depth: 13,
    location: "PORT-AU-PRINCE, HAITI",
    casualties: "316,000",
    type: "strike-slip",
    tsunamiGenerated: false,
    description:
      "Shallow earthquake near a densely populated capital. Catastrophic devastation to infrastructure, immense loss of life.",
    coordinates: { lat: 18.5, lng: -72.5 },
  },
  {
    id: "HQ-007",
    name: "KAMCHATKA EARTHQUAKE",
    date: "1952-11-04",
    magnitude: 9.0,
    depth: 21,
    location: "KAMCHATKA, RUSSIA",
    casualties: "~2,336",
    type: "megathrust",
    tsunamiGenerated: true,
    description:
      "Generated destructive tsunamis across the Pacific. Led to the creation of the Pacific Tsunami Warning System.",
    coordinates: { lat: 52.8, lng: 159.5 },
  },
  {
    id: "HQ-008",
    name: "SICHUAN EARTHQUAKE",
    date: "2008-05-12",
    magnitude: 7.9,
    depth: 19,
    location: "WENCHUAN, SICHUAN, CHINA",
    casualties: "87,587",
    type: "normal",
    tsunamiGenerated: false,
    description:
      "Powerful earthquake along the Longmenshan fault. Triggered massive landslides and quake lakes, devastating the region.",
    coordinates: { lat: 31.0, lng: 103.4 },
  },
]

// ── MAGNITUDE COLOR SYSTEM ───────────────────────────────
function getMagnitudeStyle(mag: number) {
  if (mag >= 9.0)
    return { color: "#FF0055", glow: "rgba(255,0,85,0.3)", label: "MEGA" }
  if (mag >= 8.0)
    return { color: "#FF3355", glow: "rgba(255,51,85,0.25)", label: "GREAT" }
  if (mag >= 7.0)
    return { color: "#FF9900", glow: "rgba(255,153,0,0.2)", label: "MAJOR" }
  return { color: "#FFE600", glow: "rgba(255,230,0,0.2)", label: "STRONG" }
}

const TYPE_COLORS = {
  megathrust: "#FF0055",
  "strike-slip": "#FFE600",
  normal: "#00F0FF",
  volcanic: "#FF9900",
} as const

// ── QUAKE DETAIL CARD ────────────────────────────────────
function QuakeDetailCard({ quake }: { quake: HistoricQuake }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const magStyle = getMagnitudeStyle(quake.magnitude)
  const typeColor = TYPE_COLORS[quake.type]

  return (
    <div
      className="panel-box bg-space/80 border transition-all duration-300"
      style={{
        borderColor: `${magStyle.color}20`,
      }}
    >
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex w-full items-start justify-between gap-3 p-4 text-left"
      >
        <div className="min-w-0 flex-1">
          <div className="mb-1 flex flex-wrap items-center gap-2">
            {/* Magnitude badge */}
            <span
              className="tag-clip flex items-center gap-1 border px-2 py-0.5 font-mono text-[10px] font-bold tracking-widest"
              style={{
                color: magStyle.color,
                borderColor: `${magStyle.color}50`,
                background: `${magStyle.color}12`,
                boxShadow: `0 0 10px ${magStyle.glow}`,
              }}
            >
              M {quake.magnitude.toFixed(1)}
            </span>
            {/* Type badge */}
            <span
              className="tag-clip border px-1.5 py-0.5 font-mono text-[7px] font-bold tracking-widest uppercase"
              style={{
                color: typeColor,
                borderColor: `${typeColor}30`,
                background: `${typeColor}08`,
              }}
            >
              {quake.type.replace("-", " ")}
            </span>
            {quake.tsunamiGenerated && (
              <span className="tag-clip border border-cyan-500/30 bg-cyan-500/8 px-1.5 py-0.5 font-mono text-[7px] font-bold tracking-widest text-cyan-400">
                TSUNAMI
              </span>
            )}
          </div>

          <h4 className="text-xs font-bold tracking-wider text-foreground uppercase">
            {quake.name}
          </h4>

          <div className="mt-1 flex flex-wrap items-center gap-3 font-mono text-[8px] text-primary">
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {quake.date}
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {quake.location}
            </span>
            <span className="flex items-center gap-1">
              <Layers className="h-3 w-3" />
              {quake.depth} KM DEPTH
            </span>
          </div>
        </div>

        <ChevronDown
          className={`h-4 w-4 shrink-0 text-primary transition-transform duration-300 ${
            isExpanded ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Expanded details */}
      {isExpanded && (
        <div
          className="border-t px-4 pt-3 pb-4"
          style={{ borderColor: `${magStyle.color}15` }}
        >
          <p className="mb-3 font-mono text-[9px] leading-relaxed text-primary">
            {quake.description}
          </p>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="panel-box border border-primary/10 p-2">
              <span className="block font-mono text-[7px] font-bold tracking-widest text-primary">
                CASUALTIES
              </span>
              <span className="text-danger font-mono text-xs font-bold">
                {quake.casualties}
              </span>
            </div>
            <div className="panel-box border border-primary/10 p-2">
              <span className="block font-mono text-[7px] font-bold tracking-widest text-primary">
                MAGNITUDE
              </span>
              <span
                className="font-mono text-xs font-bold"
                style={{ color: magStyle.color }}
              >
                {quake.magnitude} {magStyle.label}
              </span>
            </div>
            <div className="panel-box border border-primary/10 p-2">
              <span className="block font-mono text-[7px] font-bold tracking-widest text-primary">
                COORDINATES
              </span>
              <span className="font-mono text-[9px] font-bold text-foreground">
                {quake.coordinates.lat.toFixed(1)}°,{" "}
                {quake.coordinates.lng.toFixed(1)}°
              </span>
            </div>
            <div className="panel-box border border-primary/10 p-2">
              <span className="block font-mono text-[7px] font-bold tracking-widest text-primary">
                TSUNAMI
              </span>
              <span
                className={`font-mono text-xs font-bold ${
                  quake.tsunamiGenerated ? "text-cyan-400" : "text-primary"
                }`}
              >
                {quake.tsunamiGenerated ? "YES" : "NO"}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ── MAGNITUDE TIMELINE ───────────────────────────────────
function MagnitudeTimeline({ quakes }: { quakes: HistoricQuake[] }) {
  const sorted = [...quakes].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  )

  return (
    <Panel level="level3" accentColor="system">
      <PanelHeader
        title="MAGNITUDE TIMELINE"
        icon={TrendingUp}
        status="HISTORICAL"
        accentColor="system"
      />

      <div className="space-y-2">
        {sorted.map((q) => {
          const magStyle = getMagnitudeStyle(q.magnitude)
          const barWidth = (q.magnitude / 10) * 100

          return (
            <div key={q.id} className="flex items-center gap-3">
              <span className="w-16 shrink-0 font-mono text-[8px] text-primary">
                {q.date.slice(0, 4)}
              </span>
              <div className="relative h-3 flex-1 bg-white/3">
                <div
                  className="absolute inset-y-0 left-0 transition-all duration-500"
                  style={{
                    width: `${barWidth}%`,
                    background: `linear-gradient(90deg, ${magStyle.color}40, ${magStyle.color})`,
                    boxShadow: `0 0 8px ${magStyle.glow}`,
                  }}
                />
              </div>
              <span
                className="w-8 shrink-0 font-mono text-[9px] font-bold"
                style={{ color: magStyle.color }}
              >
                {q.magnitude}
              </span>
            </div>
          )
        })}
      </div>
    </Panel>
  )
}

// ── MAIN VIEW ────────────────────────────────────────────
export function QuakeArchiveView() {
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState<"magnitude" | "date">("magnitude")
  const [filterType, setFilterType] = useState<string>("all")

  const filteredQuakes = useMemo(() => {
    let results = [...HISTORIC_QUAKES]

    // Filter by search
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      results = results.filter(
        (quake) =>
          quake.name.toLowerCase().includes(q) ||
          quake.location.toLowerCase().includes(q)
      )
    }

    // Filter by type
    if (filterType !== "all") {
      results = results.filter((quake) => quake.type === filterType)
    }

    // Sort
    if (sortBy === "magnitude") {
      results.sort((a, b) => b.magnitude - a.magnitude)
    } else {
      results.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      )
    }

    return results
  }, [searchQuery, sortBy, filterType])

  const tabs = [
    { id: "all", label: "ALL", icon: Globe },
    { id: "megathrust", label: "MEGATHRUST", icon: AlertTriangle },
    { id: "strike-slip", label: "STRIKE-SLIP", icon: Activity },
    { id: "normal", label: "NORMAL", icon: Layers },
  ]

  return (
    <div className="mx-auto max-w-5xl space-y-6 px-4 pb-20 sm:px-6">
      <ContextBlock
        title="QUAKE ARCHIVE — HISTORICAL DATABASE"
        subtitle="Comprehensive archive of significant historical earthquakes. Sortable by magnitude, date, and fault type for seismological research."
        operation="QUAKE.ARCHIVE"
        status="OPERATIONAL"
        accentColor="accent"
      />

      {/* Search + sort controls */}
      <Panel level="level3" accentColor="accent">
        <div className="flex flex-wrap items-center gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2 text-primary" />
            <input
              type="text"
              placeholder="QUERY DATABASE..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full border border-primary/15 bg-transparent py-2 pr-3 pl-9 font-mono text-[10px] font-bold tracking-widest text-foreground placeholder:text-primary/50 focus:border-accent/40 focus:outline-none"
            />
          </div>

          {/* Sort toggle */}
          <button
            onClick={() =>
              setSortBy(sortBy === "magnitude" ? "date" : "magnitude")
            }
            className="flex items-center gap-2 border border-primary/20 px-3 py-2 font-mono text-[9px] font-bold tracking-widest text-primary transition-all btn-clip hover:border-primary/40"
          >
            <ArrowUpDown className="h-3.5 w-3.5" />
            SORT: {sortBy === "magnitude" ? "MAGNITUDE" : "DATE"}
          </button>
        </div>
      </Panel>

      {/* Type filter tabs */}
      <HUDTabs
        tabs={tabs}
        activeTab={filterType}
        onChange={setFilterType}
        accentColor="accent"
      />

      {/* Stats row */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="panel-box border border-primary/10 p-3 text-center">
          <span className="block font-mono text-[8px] font-bold tracking-widest text-primary">
            TOTAL RECORDS
          </span>
          <span className="font-mono text-lg font-bold text-accent">
            {filteredQuakes.length}
          </span>
        </div>
        <div className="panel-box border border-primary/10 p-3 text-center">
          <span className="block font-mono text-[8px] font-bold tracking-widest text-primary">
            MAX MAGNITUDE
          </span>
          <span className="text-danger font-mono text-lg font-bold">
            {filteredQuakes.length > 0
              ? Math.max(...filteredQuakes.map((q) => q.magnitude)).toFixed(1)
              : "—"}
          </span>
        </div>
        <div className="panel-box border border-primary/10 p-3 text-center">
          <span className="block font-mono text-[8px] font-bold tracking-widest text-primary">
            TSUNAMI EVENTS
          </span>
          <span className="text-system font-mono text-lg font-bold">
            {filteredQuakes.filter((q) => q.tsunamiGenerated).length}
          </span>
        </div>
        <div className="panel-box border border-primary/10 p-3 text-center">
          <span className="block font-mono text-[8px] font-bold tracking-widest text-primary">
            DATE RANGE
          </span>
          <span className="font-mono text-xs font-bold text-foreground">
            1952 — 2011
          </span>
        </div>
      </div>

      {/* Quake list */}
      <div className="space-y-3">
        {filteredQuakes.length === 0 ? (
          <Panel level="level3" accentColor="accent">
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Database className="mb-3 h-8 w-8 text-primary" />
              <span className="font-mono text-xs font-bold tracking-widest text-primary">
                NO RECORDS FOUND
              </span>
              <span className="mt-1 font-mono text-[9px] text-primary">
                Adjust search query or filter parameters
              </span>
            </div>
          </Panel>
        ) : (
          filteredQuakes.map((quake) => (
            <QuakeDetailCard key={quake.id} quake={quake} />
          ))
        )}
      </div>

      {/* Timeline */}
      <MagnitudeTimeline quakes={HISTORIC_QUAKES} />
    </div>
  )
}
