import {
  Book,
  BookOpen,
  ChevronRight,
  Clock,
  Globe,
  Map,
  Search,
} from "lucide-react"
import { Panel, resolveVisualizationColor } from "@workspace/ui"
import type {
  HistoricalCivilization,
  HistoricalEvent,
  HistoricalProphet,
  HistoricalScriptureReference,
} from "./os-historical-intelligence-data"

export type HistoricalIntelligenceHeaderProps = {
  searchValue: string
  onSearchChange: (value: string) => void
}

export function HistoricalIntelligenceHeader({
  searchValue,
  onSearchChange,
}: HistoricalIntelligenceHeaderProps) {
  return (
    <div className="flex flex-col justify-between gap-6 border-b border-border pb-6 xl:flex-row xl:items-end">
      <div className="max-w-3xl space-y-4">
        <div className="inline-flex items-center gap-3 rounded-sm border-2 border-teal-500/60 bg-background px-3.5 py-1.5 text-xs font-black tracking-[0.25em] text-teal-300 uppercase shadow-sm">
          <span className="rounded-xs bg-teal-500 px-1.5 py-0.5 font-black text-foreground">
            06
          </span>
          <span>HISTORICAL INTELLIGENCE</span>
        </div>
        <h2 className="font-mono text-2xl font-black tracking-wider text-foreground uppercase drop-shadow-sm sm:text-4xl">
          Timeline of Prophets, Civilizations, and Divine Events
        </h2>
      </div>

      <div className="flex w-full shrink-0 flex-col items-center gap-4 md:flex-row xl:w-auto">
        <div className="hide-scrollbar flex w-full items-center gap-2 overflow-x-auto pb-2 text-[10px] font-bold tracking-wider text-foreground uppercase md:w-auto md:pb-0">
          <span className="mr-2 text-primary">FILTER BY:</span>
          {[
            "ALL",
            "PROPHET",
            "CIVILIZATION",
            "ASTRONOMY",
            "SCRIPTURE",
            "EVENT",
          ].map((filter, index) => (
            <button
              key={filter}
              type="button"
              className={`border px-3 py-1.5 ${index === 0 ? "border-teal-400 bg-teal-900/40 text-teal-300 shadow-sm" : "border-border hover:border-teal-500/50"} shrink-0 rounded transition-all`}
            >
              {filter}
            </button>
          ))}
        </div>
        <div className="relative w-full shrink-0 md:w-64">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-primary" />
          <input
            type="search"
            value={searchValue}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search timeline..."
            aria-label="Search timeline"
            className="w-full rounded-md border border-border bg-background py-1.5 pr-4 pl-9 font-mono text-xs text-foreground focus:border-teal-400 focus:outline-none"
          />
        </div>
      </div>
    </div>
  )
}

export function HistoricalOverviewPanel() {
  return (
    <Panel
      accentColor="secondary"
      className="group flex cursor-pointer flex-col bg-background/80 p-6 backdrop-blur-xl transition-all duration-300 hover:border-border hover:shadow-sm"
    >
      <div className="mb-4 text-xs font-black tracking-wider text-teal-400 uppercase">
        TIMELINE OVERVIEW
      </div>

      <div className="bg-radial-gradient relative mb-4 flex h-40 w-full items-center justify-center overflow-hidden rounded-full border border-teal-500/20 from-teal-900/40 to-transparent shadow-inner">
        <div className="theme-grid-bg absolute inset-0 opacity-40 mix-blend-overlay" />
        <Globe className="animate-spin-slow h-24 w-24 text-teal-400/50 drop-shadow-sm filter" />
        <div className="absolute top-1/2 left-0 h-px w-full bg-teal-400/30 shadow-sm" />
        <div className="absolute top-0 left-1/2 h-full w-px bg-teal-400/30 shadow-sm" />
      </div>

      <div className="grid grid-cols-4 gap-2 border-t border-border pt-4 text-center">
        <div>
          <div className="text-lg font-black text-foreground">7</div>
          <div className="text-[7px] text-primary uppercase">PROPHETS</div>
        </div>
        <div>
          <div className="text-lg font-black text-teal-400">24</div>
          <div className="text-[7px] text-primary uppercase">CIVILIZATIONS</div>
        </div>
        <div>
          <div className="text-lg font-black text-warning">152</div>
          <div className="text-[7px] text-primary uppercase">KEY EVENTS</div>
        </div>
        <div>
          <div className="text-lg font-black text-primary">89</div>
          <div className="text-[7px] text-primary uppercase">ASTRO EVENTS</div>
        </div>
      </div>
    </Panel>
  )
}

export function HistoricalTimeRangePanel() {
  return (
    <Panel
      accentColor="secondary"
      className="bg-background/80 p-5 backdrop-blur-xl"
    >
      <div className="mb-4 text-xs font-black tracking-wider text-foreground uppercase">
        TIME RANGE
      </div>
      <div className="mb-2 flex items-end justify-between">
        <div>
          <div className="text-[9px] text-primary">FROM</div>
          <div className="text-lg font-black text-teal-400">-4000</div>
          <div className="text-[9px] text-foreground">BEFORE CE</div>
        </div>
        <div className="text-right">
          <div className="text-[9px] text-primary">TO</div>
          <div className="text-lg font-black text-primary">2025</div>
          <div className="text-[9px] text-foreground">CE</div>
        </div>
      </div>
      <div className="relative mt-4 h-1 w-full rounded-full bg-muted/30">
        <div className="absolute right-[5%] left-[10%] h-full bg-gradient-to-r from-teal-400 to-transparent shadow-sm" />
        <div className="absolute top-1/2 left-[10%] h-3 w-3 -translate-y-1/2 rounded-full bg-card shadow-sm" />
        <div className="absolute top-1/2 right-[5%] h-3 w-3 -translate-y-1/2 rounded-full bg-card shadow-sm" />
      </div>
    </Panel>
  )
}

export function HistoricalScriptureReferencesPanel({
  references,
}: {
  references: readonly HistoricalScriptureReference[]
}) {
  return (
    <Panel
      accentColor="secondary"
      className="flex flex-1 flex-col bg-background/80 p-5 backdrop-blur-xl"
    >
      <div className="mb-4 text-xs font-black tracking-wider text-foreground uppercase">
        SCRIPTURE REFERENCES
      </div>
      <div className="flex-1 space-y-3 font-mono text-xs">
        {references.map((reference) => (
          <div
            key={reference.name}
            className="group flex cursor-pointer items-center justify-between"
          >
            <span className="flex items-center gap-2 font-bold text-primary transition-colors group-hover:text-foreground">
              <Book
                className="h-3.5 w-3.5"
                style={{ color: resolveVisualizationColor(reference.color) }}
              />
              {reference.name}
            </span>
            <span className="font-black text-foreground">
              {reference.value}
            </span>
          </div>
        ))}
      </div>
      <button
        type="button"
        className="mt-2 flex items-center justify-end gap-1 border-t border-border pt-4 text-right text-[10px] font-bold text-teal-400 uppercase transition-colors hover:text-foreground"
      >
        VIEW ALL REFERENCES <ChevronRight className="h-3 w-3" />
      </button>
    </Panel>
  )
}

export function HistoricalJourneyPanel({
  prophets,
}: {
  prophets: readonly HistoricalProphet[]
}) {
  return (
    <div className="relative rounded-xl border-2 border-border bg-background p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between text-xs font-black tracking-widest text-primary uppercase">
        <span>--- THE JOURNEY OF GUIDANCE ---</span>
      </div>

      <div className="hide-scrollbar relative z-10 flex snap-x gap-4 overflow-x-auto pb-6">
        {prophets.map((prophet) => (
          <div
            key={prophet.num}
            className="min-w-[180px] flex-shrink-0 snap-start sm:min-w-[220px]"
          >
            <div className="group relative flex h-64 flex-col justify-between overflow-hidden rounded-xl border border-border bg-background shadow-lg">
              <div className="absolute inset-0 z-10 bg-gradient-to-br from-card via-card/40 to-transparent" />
              <div
                className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-luminosity transition-transform duration-700 group-hover:scale-110"
                style={{ backgroundImage: `url(${prophet.img})` }}
              />
              <div className="absolute inset-0 z-10 bg-gradient-to-t from-background via-transparent to-transparent" />

              <div className="relative z-20 p-4">
                <div className="mb-2 flex h-6 w-6 items-center justify-center rounded-sm border border-border bg-card text-[10px] font-black text-foreground backdrop-blur-sm">
                  {prophet.num}
                </div>
                <div className="text-lg font-black text-foreground drop-shadow-md">
                  {prophet.name}
                </div>
                <div className="mt-1 font-mono text-[10px] text-primary">
                  {prophet.era}
                </div>
              </div>

              <div className="relative z-20 p-3 pt-0">
                <div className="flex items-start gap-2">
                  <prophet.icon
                    className="mt-0.5 h-4 w-4 shrink-0"
                    style={{ color: resolveVisualizationColor(prophet.color) }}
                  />
                  <div className="text-[10px] leading-tight font-bold tracking-wider text-foreground uppercase">
                    {prophet.title}
                    <br />
                    <span
                      style={{
                        color: resolveVisualizationColor(prophet.color),
                      }}
                    >
                      {prophet.sub}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="absolute right-6 bottom-6 left-6 z-0 flex h-0.5 justify-between bg-muted/30">
        {prophets.map((prophet) => (
          <div
            key={prophet.num}
            className="relative h-3 w-3 -translate-y-[5px] rounded-full border-2 bg-background"
            style={{
              borderColor: resolveVisualizationColor(prophet.color),
              boxShadow: `0 0 10px ${resolveVisualizationColor(prophet.color)}`,
            }}
          >
            <div className="absolute -top-6 left-1/2 h-6 w-px -translate-x-1/2 bg-muted/30" />
          </div>
        ))}
      </div>

      <button
        type="button"
        className="absolute top-1/2 right-0 z-20 flex h-full w-12 -translate-y-1/2 items-center justify-end bg-gradient-to-l from-background to-transparent pr-2 opacity-0 transition-opacity hover:opacity-100"
      >
        <ChevronRight className="h-8 w-8 text-foreground drop-shadow-lg" />
      </button>
    </div>
  )
}

export function HistoricalCivilizationsPanel({
  civilizations,
}: {
  civilizations: readonly HistoricalCivilization[]
}) {
  return (
    <div className="relative rounded-xl border-2 border-border bg-background p-6 shadow-sm">
      <div className="mb-4 text-xs font-black tracking-widest text-primary uppercase">
        --- MAJOR CIVILIZATIONS &amp; KINGDOMS ---
      </div>

      <div className="hide-scrollbar relative z-10 flex snap-x gap-4 overflow-x-auto pb-2">
        {civilizations.map((civilization) => (
          <div
            key={civilization.name}
            className="min-w-[150px] flex-shrink-0 snap-start sm:min-w-[180px]"
          >
            <div className="group relative flex h-44 flex-col justify-between overflow-hidden rounded-lg border border-border bg-background shadow-lg">
              <div className="absolute inset-0 z-10 bg-gradient-to-b from-background via-transparent to-background opacity-80" />
              <div className="absolute inset-0 bg-[url('/assets/hero_bg.png')] bg-cover bg-center opacity-40 mix-blend-color-dodge sepia transition-transform duration-700 group-hover:scale-110" />
              <div className="relative z-20 p-3">
                <div className="text-sm leading-tight font-black text-foreground drop-shadow-md">
                  {civilization.name}
                  <br />
                  EMPIRE
                </div>
                <div className="mt-1.5 font-mono text-[9px] text-primary">
                  {civilization.era}
                </div>
              </div>
              <div className="relative z-20 flex justify-center border-t border-border p-3 pb-2">
                <Map
                  className="h-4 w-4 opacity-50"
                  style={{
                    color: resolveVisualizationColor(civilization.color),
                  }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        className="absolute top-1/2 right-0 z-20 flex h-full w-12 -translate-y-1/2 items-center justify-end bg-gradient-to-l from-background to-transparent pr-2 opacity-0 transition-opacity hover:opacity-100"
      >
        <ChevronRight className="h-8 w-8 text-foreground drop-shadow-lg" />
      </button>
    </div>
  )
}

export function HistoricalEventsPanel({
  events,
}: {
  events: readonly HistoricalEvent[]
}) {
  return (
    <Panel
      accentColor="primary"
      className="border border-primary/30 bg-background/90 p-8 shadow-sm backdrop-blur-xl"
    >
      <div className="mb-4 text-xs font-black tracking-widest text-primary uppercase">
        --- KEY HISTORICAL EVENTS ---
      </div>
      <div className="grid grid-cols-1 gap-x-8 gap-y-3 font-mono text-[10px] sm:grid-cols-2 md:text-[11px]">
        {events.map((event) => (
          <div
            key={event.title}
            className="group flex cursor-pointer items-center justify-between rounded px-1.5 py-1 transition-colors hover:bg-muted/30"
          >
            <div className="flex items-center gap-2 text-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-teal-400 shadow-sm group-hover:animate-ping" />
              <span className="truncate transition-colors group-hover:text-teal-300">
                {event.title}
              </span>
            </div>
            <div className="shrink-0 font-bold text-teal-400">{event.date}</div>
          </div>
        ))}
      </div>
      <div className="mt-4 border-t border-border pt-4 text-right">
        <button
          type="button"
          className="ml-auto flex items-center justify-end gap-1 text-[10px] font-bold text-teal-400 uppercase transition-colors hover:text-foreground"
        >
          VIEW FULL TIMELINE <ChevronRight className="h-3 w-3" />
        </button>
      </div>
    </Panel>
  )
}

export function HistoricalInsightsPanel() {
  return (
    <Panel
      accentColor="primary"
      className="group relative col-span-1 flex h-full flex-col justify-between overflow-hidden bg-background/80 p-6 backdrop-blur-xl lg:col-span-3"
    >
      <div className="absolute right-0 bottom-0 translate-x-1/4 translate-y-1/4">
        <BookOpen className="h-48 w-48 -rotate-12 transform text-teal-900/40 transition-all duration-1000 group-hover:scale-110 group-hover:text-teal-800/60" />
      </div>
      <div className="relative z-10">
        <div className="mb-6 text-xs font-black tracking-widest text-teal-400 uppercase">
          HISTORICAL INSIGHTS
        </div>
        <div className="relative border-l-2 border-teal-400 py-1 pl-4 font-serif text-sm leading-relaxed text-foreground italic md:text-base">
          <span className="absolute -top-2 -left-[11px] flex h-4 items-center bg-background text-3xl leading-none text-teal-500">
            &quot;
          </span>
          Indeed in the stories of the past there is a lesson for those of
          understanding.
        </div>
        <div className="mt-4 font-mono text-[11px] font-black text-teal-400 drop-shadow-sm">
          Qur&apos;an 12:111
        </div>
      </div>
    </Panel>
  )
}

export function HistoricalStatusFooter() {
  return (
    <div className="flex flex-col items-center justify-between gap-4 border-t border-border px-2 pt-4 font-mono text-[9px] font-bold tracking-widest text-primary uppercase sm:flex-row">
      <div className="flex items-center gap-4">
        <span className="flex items-center gap-1.5">
          <Clock className="h-3 w-3" /> CHRONO SYNC
        </span>
        <span>LAST UPDATED: 25 MAY 2025 06:50 WIB</span>
      </div>
      <div className="flex items-center gap-2">
        HISTORY DATABASE STATUS{" "}
        <span className="flex items-center gap-1 text-success">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />{" "}
          SYNCHRONIZED
        </span>
      </div>
      <div className="hidden text-right text-foreground/50 lg:block">
        DATA SOURCES: QUR&apos;AN | HADITH | HISTORICAL RECORDS | ASTRONOMICAL
        DATA
      </div>
    </div>
  )
}
