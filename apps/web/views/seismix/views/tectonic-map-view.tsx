"use client"

import { useState, useEffect } from "react"
import {
  Map as MapIcon,
  Layers,
  Activity,
  Globe,
  ArrowRight,
  ChevronDown,
  AlertTriangle,
  Compass,
  Move,
  TrendingUp,
} from "lucide-react"
import { ContextBlock } from "@core/ui/context-block"
import { Panel, PanelHeader } from "@core/ui/panel"
import { Tabs } from "@core/ui/tabs"
import { SeismicTectonicRadar } from "@workspace/ui"

// ── PLATE DATA ───────────────────────────────────────────
type TectonicPlate = {
  id: string
  name: string
  type: "continental" | "oceanic" | "micro"
  area: string
  velocity: string
  direction: string
  boundaryType: "convergent" | "divergent" | "transform"
  neighbors: string[]
  seismicRisk: "low" | "moderate" | "high" | "extreme"
  color: string
}

const TECTONIC_PLATES: TectonicPlate[] = [
  {
    id: "PACIFIC",
    name: "PACIFIC PLATE",
    type: "oceanic",
    area: "103.3M km²",
    velocity: "56-102 mm/yr",
    direction: "NW",
    boundaryType: "convergent",
    neighbors: ["North American", "Philippine", "Australian", "Nazca"],
    seismicRisk: "extreme",
    color: "#FF0055",
  },
  {
    id: "NORTH-AM",
    name: "NORTH AMERICAN PLATE",
    type: "continental",
    area: "75.9M km²",
    velocity: "15-25 mm/yr",
    direction: "W-SW",
    boundaryType: "transform",
    neighbors: ["Pacific", "Juan de Fuca", "Caribbean", "Eurasian"],
    seismicRisk: "high",
    color: "#FFE600",
  },
  {
    id: "EURASIAN",
    name: "EURASIAN PLATE",
    type: "continental",
    area: "67.8M km²",
    velocity: "7-14 mm/yr",
    direction: "E",
    boundaryType: "convergent",
    neighbors: ["African", "Indian", "Philippine", "North American"],
    seismicRisk: "high",
    color: "#00F0FF",
  },
  {
    id: "AFRICAN",
    name: "AFRICAN PLATE",
    type: "continental",
    area: "61.3M km²",
    velocity: "15-35 mm/yr",
    direction: "NE",
    boundaryType: "divergent",
    neighbors: ["Eurasian", "South American", "Arabian", "Somali"],
    seismicRisk: "moderate",
    color: "#00FF66",
  },
  {
    id: "ANTARCTIC",
    name: "ANTARCTIC PLATE",
    type: "continental",
    area: "60.9M km²",
    velocity: "10-16 mm/yr",
    direction: "Rotational",
    boundaryType: "divergent",
    neighbors: ["South American", "African", "Australian", "Pacific"],
    seismicRisk: "low",
    color: "#A100FF",
  },
  {
    id: "INDO-AUST",
    name: "INDO-AUSTRALIAN PLATE",
    type: "continental",
    area: "58.9M km²",
    velocity: "60-75 mm/yr",
    direction: "NE",
    boundaryType: "convergent",
    neighbors: ["Eurasian", "Pacific", "Antarctic"],
    seismicRisk: "extreme",
    color: "#FF9900",
  },
  {
    id: "SOUTH-AM",
    name: "SOUTH AMERICAN PLATE",
    type: "continental",
    area: "43.6M km²",
    velocity: "27-34 mm/yr",
    direction: "W",
    boundaryType: "convergent",
    neighbors: ["Nazca", "African", "Caribbean", "Antarctic"],
    seismicRisk: "high",
    color: "#d477ff",
  },
  {
    id: "NAZCA",
    name: "NAZCA PLATE",
    type: "oceanic",
    area: "15.6M km²",
    velocity: "53-76 mm/yr",
    direction: "E",
    boundaryType: "convergent",
    neighbors: ["Pacific", "South American", "Antarctic", "Cocos"],
    seismicRisk: "extreme",
    color: "#FF3355",
  },
]

const BOUNDARY_INFO = {
  convergent: {
    label: "CONVERGENT",
    desc: "Plates colliding — forms mountains, subduction zones, deep trenches",
    icon: ArrowRight,
    color: "#FF0055",
  },
  divergent: {
    label: "DIVERGENT",
    desc: "Plates separating — new crust formed at mid-ocean ridges",
    icon: Move,
    color: "#00FF66",
  },
  transform: {
    label: "TRANSFORM",
    desc: "Plates sliding laterally — produces shallow earthquakes along faults",
    icon: TrendingUp,
    color: "#FFE600",
  },
} as const

const RISK_COLORS = {
  low: "#00FF66",
  moderate: "#FFE600",
  high: "#FF9900",
  extreme: "#FF0055",
} as const

// ── PLATE CARD ───────────────────────────────────────────
function PlateCard({
  plate,
  isSelected,
  onSelect,
}: {
  plate: TectonicPlate
  isSelected: boolean
  onSelect: () => void
}) {
  const riskColor = RISK_COLORS[plate.seismicRisk]
  const boundary = BOUNDARY_INFO[plate.boundaryType]

  return (
    <button
      onClick={onSelect}
      className="panel-box bg-space/80 w-full border p-4 text-left transition-all duration-300 hover:-translate-y-0.5"
      style={{
        borderColor: isSelected ? `${plate.color}50` : "rgba(0,240,255,0.1)",
        boxShadow: isSelected ? `0 0 20px ${plate.color}20` : "none",
        background: isSelected ? `${plate.color}05` : "transparent",
      }}
    >
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span
            className="h-2.5 w-2.5 rounded-full"
            style={{ background: plate.color }}
          />
          <span
            className="font-mono text-[10px] font-bold tracking-widest"
            style={{ color: plate.color }}
          >
            {plate.name}
          </span>
        </div>
        <span
          className="tag-clip border px-1.5 py-0.5 font-mono text-[7px] font-bold tracking-widest uppercase"
          style={{
            color: riskColor,
            borderColor: `${riskColor}40`,
            background: `${riskColor}10`,
          }}
        >
          {plate.seismicRisk}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2 font-mono text-[8px]">
        <div>
          <span className="text-primary">AREA</span>
          <span className="ml-1 text-foreground">{plate.area}</span>
        </div>
        <div>
          <span className="text-primary">VEL</span>
          <span className="ml-1 text-foreground">{plate.velocity}</span>
        </div>
        <div>
          <span className="text-primary">DIR</span>
          <span className="ml-1 text-foreground">{plate.direction}</span>
        </div>
        <div>
          <span className="text-primary">TYPE</span>
          <span className="ml-1 text-foreground uppercase">{plate.type}</span>
        </div>
      </div>

      <div className="mt-2 flex items-center gap-1 font-mono text-[7px]">
        <span style={{ color: boundary.color }}>◉ {boundary.label}</span>
      </div>
    </button>
  )
}

// ── PLATE DETAIL ─────────────────────────────────────────
function PlateDetail({ plate }: { plate: TectonicPlate }) {
  const boundary = BOUNDARY_INFO[plate.boundaryType]
  const BoundaryIcon = boundary.icon
  const riskColor = RISK_COLORS[plate.seismicRisk]

  return (
    <Panel level="level2" accentColor="accent">
      <PanelHeader
        title={plate.name}
        icon={Layers}
        status="SELECTED"
        accentColor="accent"
        subtitle={`${plate.type.toUpperCase()} plate — ${plate.area} surface area`}
      />

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: "VELOCITY", value: plate.velocity },
          { label: "DIRECTION", value: plate.direction },
          { label: "BOUNDARY", value: boundary.label },
          { label: "SEISMIC RISK", value: plate.seismicRisk.toUpperCase() },
        ].map((item) => (
          <div
            key={item.label}
            className="panel-box border border-primary/10 p-3"
          >
            <span className="mb-1 block font-mono text-[8px] font-bold tracking-widest text-primary">
              {item.label}
            </span>
            <span
              className="font-mono text-sm font-bold"
              style={{ color: plate.color }}
            >
              {item.value}
            </span>
          </div>
        ))}
      </div>

      {/* Boundary explanation */}
      <div
        className="mt-4 border p-4"
        style={{
          borderColor: `${boundary.color}25`,
          background: `${boundary.color}05`,
        }}
      >
        <div className="mb-2 flex items-center gap-2">
          <BoundaryIcon className="h-4 w-4" style={{ color: boundary.color }} />
          <span
            className="font-mono text-[10px] font-bold tracking-widest"
            style={{ color: boundary.color }}
          >
            {boundary.label} BOUNDARY
          </span>
        </div>
        <p className="font-mono text-[9px] leading-relaxed text-primary">
          {boundary.desc}
        </p>
      </div>

      {/* Neighboring plates */}
      <div className="mt-4">
        <span className="mb-2 block font-mono text-[9px] font-bold tracking-widest text-primary">
          NEIGHBORING PLATES
        </span>
        <div className="flex flex-wrap gap-2">
          {plate.neighbors.map((n) => (
            <span
              key={n}
              className="tag-clip border border-primary/20 bg-primary/5 px-2 py-1 font-mono text-[8px] font-bold tracking-widest text-foreground uppercase"
            >
              {n}
            </span>
          ))}
        </div>
      </div>
    </Panel>
  )
}

// ── MAIN VIEW ────────────────────────────────────────────
export function TectonicMapView() {
  const [selectedPlate, setSelectedPlate] = useState<string>("PACIFIC")
  const [viewMode, setViewMode] = useState("plates")

  const currentPlate = TECTONIC_PLATES.find((p) => p.id === selectedPlate)

  const viewTabs = [
    { id: "plates", label: "PLATES", icon: Layers },
    { id: "boundaries", label: "BOUNDARIES", icon: Activity },
    { id: "hotspots", label: "HOTSPOTS", icon: AlertTriangle },
  ]

  return (
    <div className="mx-auto max-w-5xl space-y-6 px-4 pb-20 sm:px-6">
      <ContextBlock
        title="TECTONIC MAP — PLATE DYNAMICS"
        subtitle="Interactive visualization of Earth's major tectonic plates, boundary types, and seismic risk zones."
        operation="TECTONIC.MAP"
        status="ACTIVE"
        accentColor="accent"
      />

      <Tabs
        tabs={viewTabs}
        activeTab={viewMode}
        onChange={setViewMode}
        accentColor="accent"
      />

      {/* Interactive Seismic Tectonic Live Radar */}
      <SeismicTectonicRadar height={320} />

      {/* Plate grid */}
      <Panel level="level2" accentColor="accent">
        <PanelHeader
          title="MAJOR TECTONIC PLATES"
          icon={Globe}
          status="8 PLATES"
          accentColor="accent"
          subtitle="Select a plate to view detailed telemetry and boundary analysis"
        />

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {TECTONIC_PLATES.map((plate) => (
            <PlateCard
              key={plate.id}
              plate={plate}
              isSelected={selectedPlate === plate.id}
              onSelect={() => setSelectedPlate(plate.id)}
            />
          ))}
        </div>
      </Panel>

      {/* Detail panel */}
      {currentPlate && <PlateDetail plate={currentPlate} />}

      {/* Boundary types legend */}
      <Panel level="level3" accentColor="system">
        <PanelHeader
          title="PLATE BOUNDARY TYPES"
          icon={Compass}
          status="REFERENCE"
          accentColor="system"
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {Object.entries(BOUNDARY_INFO).map(([key, info]) => {
            const Icon = info.icon
            return (
              <div
                key={key}
                className="panel-box border p-4 transition-all hover:-translate-y-0.5"
                style={{
                  borderColor: `${info.color}25`,
                }}
              >
                <div className="mb-2 flex items-center gap-2">
                  <Icon className="h-4 w-4" style={{ color: info.color }} />
                  <span
                    className="font-mono text-[10px] font-bold tracking-widest"
                    style={{ color: info.color }}
                  >
                    {info.label}
                  </span>
                </div>
                <p className="font-mono text-[8px] leading-relaxed text-primary">
                  {info.desc}
                </p>
              </div>
            )
          })}
        </div>
      </Panel>
    </div>
  )
}
