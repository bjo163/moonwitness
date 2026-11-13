import Image from "next/image"
import Link from "next/link"
import { Activity, ArrowRight, BookOpen, Calendar, Clock, Compass, Layers, Search, Sparkles } from "lucide-react"
import { Input, resolveVisualizationColor } from "@workspace/ui"

const modules = [
  ["01", "QUR'AN", "The Final Revelation", "#10B981", "/assets/mod_quran.png", "623", "6,236", "78%", 78, "/kitab/quran"],
  ["02", "HADITH", "The Prophetic Wisdom", "#A855F7", "/assets/mod_hadith.png", "284", "64", "63%", 63, "/hadits"],
  ["03", "HISTORY", "Timeless Civilizations", "#F59E0B", "/assets/mod_history.png", "256", "1,024", "57%", 57, "/sejarah-sirah"],
  ["04", "ASTRONOMY", "The Signs in the Universe", "#3B82F6", "/assets/mod_astronomy.png", "158", "3,712", "72%", 72, "/kalender-lunar"],
  ["05", "EARTH SCIENCE", "Our Planet, Our Trust", "#00F0FF", "/assets/mod_earth.png", "92", "612", "66%", 66, "/mukjizat-sains"],
  ["06", "WISDOM PATH", "Reflections & Philosophy", "#EC4899", "/assets/mod_wisdom.png", "73", "492", "61%", 61, "/diagnostik-hikmah"],
  ["07", "KHIDRA AI", "AI Knowledge Companion", "#10B981", "/assets/mod_khidra.png", "08", "1.2K", "84%", 84, "/khidra"],
] as const

const quickAccess = [["DAILY VERSE", "Today's Inspiration", BookOpen, "#00F0FF", "/inspirasi-harian"], ["DAILY HADITH", "Prophetic Guidance", Sparkles, "#A855F7", "/hadits"], ["HISTORY TIMELINE", "Explore Events", Clock, "#F59E0B", "/sejarah-sirah"], ["ASTRO CALENDAR", "Celestial Events", Calendar, "#3B82F6", "/kalender-lunar"], ["PRAYER TIMES", "Stay on Schedule", Activity, "#10B981", "/jadwal-sholat"], ["QIBLA DIRECTION", "Find the Qibla", Compass, "#00F0FF", "/arah-kiblat"]] as const

export function OSKnowledgeModuleCards() {
  return <div className="grid grid-cols-1 items-stretch gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7">{modules.map(([num, id, sub, color, image, first, second, progress, percentage, href]) => <Link key={id} href={href} className="group relative flex min-h-[360px] cursor-pointer flex-col justify-between overflow-hidden rounded-md border border-border bg-card p-4 transition-colors hover:border-primary" style={{ borderTopColor: resolveVisualizationColor(color) }}><div><div className="flex items-center gap-1.5 font-mono text-sm font-semibold text-foreground"><span className="rounded-sm bg-muted px-1.5 py-0.5 text-xs text-primary">{num}</span><span className="truncate" style={{ color: resolveVisualizationColor(color) }}>{id}</span></div><div className="truncate font-sans text-xs text-muted-foreground">{sub}</div></div><div className="relative my-4 flex h-36 w-full items-center justify-center overflow-hidden rounded-md border border-border bg-background"><Image unoptimized width={120} height={120} src={image} alt={id} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" /></div><div className="space-y-2.5 border-t border-border pt-3"><div className="grid grid-cols-3 gap-1 text-center font-mono"><ModuleStat label="Topics" value={first} /><ModuleStat label="Data" value={second} /><ModuleStat label="Progress" value={progress} accent={color} /></div><div className="flex h-1.5 w-full overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full" style={{ width: `${percentage}%`, backgroundColor: resolveVisualizationColor(color) }} /></div></div></Link>)}</div>
}

function ModuleStat({ label, value, accent }: { label: string; value: string; accent?: string }) {
  return <div className="truncate"><div className="text-xs text-muted-foreground">{label}</div><div className="mt-0.5 text-sm font-semibold text-foreground" style={{ color: accent ? resolveVisualizationColor(accent) : undefined }}>{value}</div></div>
}

export function OSKnowledgeDockPanels() {
  return <div className="grid grid-cols-1 items-stretch gap-6 pt-2 lg:grid-cols-12"><OSKnowledgeFeatured /><OSKnowledgeQuickAccess /><OSKnowledgeSummary /></div>
}

function OSKnowledgeFeatured() {
  return <div className="flex flex-col justify-between overflow-hidden rounded-md border border-border bg-card p-5 lg:col-span-4"><div className="space-y-4"><div className="text-xs font-medium text-muted-foreground">Featured module · <span className="text-success">Live</span></div><div><h3 className="text-2xl font-semibold text-foreground">Qur&apos;an explorer</h3><p className="mt-2 font-sans text-sm leading-relaxed text-muted-foreground">Explore the wisdom of the Qur&apos;an through thematic study, tafsir, and cross-topic connections.</p></div><div className="grid grid-cols-2 gap-2 pt-2 text-sm font-medium text-foreground"><span className="flex items-center gap-1.5 rounded-md border border-border px-2.5 py-2"><BookOpen className="h-3.5 w-3.5 text-success" /> Tafsir</span><span className="flex items-center gap-1.5 rounded-md border border-border px-2.5 py-2"><Layers className="h-3.5 w-3.5 text-primary" /> Themes</span><span className="flex items-center gap-1.5 rounded-md border border-border px-2.5 py-2"><Sparkles className="h-3.5 w-3.5 text-warning" /> Cross links</span><span className="flex items-center gap-1.5 rounded-md border border-border px-2.5 py-2"><Search className="h-3.5 w-3.5 text-primary" /> Search</span></div></div><Link href="/kitab/quran" className="mt-6 flex w-full items-center justify-between rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground"><span>Open module</span><ArrowRight className="h-4 w-4" /></Link></div>
}

function OSKnowledgeQuickAccess() {
  return <div className="flex flex-col justify-between space-y-4 rounded-md border border-border bg-card p-5 lg:col-span-4"><div className="text-sm font-semibold text-foreground">Quick access</div><div className="grid flex-1 grid-cols-1 gap-3 sm:grid-cols-2">{quickAccess.map(([title, subtitle, Icon, color, href]) => <Link key={title} href={href} className="group flex cursor-pointer flex-col justify-between rounded-md border border-border bg-background p-3 transition-colors hover:border-primary hover:bg-muted"><div className="flex items-center justify-between"><Icon className="h-4 w-4" style={{ color: resolveVisualizationColor(color) }} /><ArrowRight className="h-3.5 w-3.5 text-primary transition-transform group-hover:translate-x-1" /></div><div className="mt-2"><div className="font-sans text-sm font-medium text-foreground group-hover:text-primary">{title}</div><div className="truncate font-sans text-xs text-muted-foreground">{subtitle}</div></div></Link>)}</div></div>
}

function OSKnowledgeSummary() {
  return <div className="flex flex-col justify-between space-y-5 rounded-md border border-border bg-card p-5 lg:col-span-4"><div className="text-sm font-semibold text-foreground">Learning summary</div><div className="my-auto flex items-center justify-between gap-4"><div className="relative flex h-24 w-24 shrink-0 items-center justify-center rounded-full border-4 border-primary"><div className="text-center font-mono"><div className="text-xs text-muted-foreground">Overall</div><div className="text-xl font-semibold text-foreground">68%</div><div className="text-xs text-primary">Progress</div></div></div><div className="flex-1 space-y-3 font-mono text-sm"><Metric label="Completed topics" value="853" /><Metric label="In progress" value="312" /><Metric label="Not started" value="83" /></div></div><div className="border-t border-border pt-3"><div className="mb-2 text-xs font-medium text-muted-foreground">Weekly activity</div><div className="flex h-8 items-end justify-between gap-2 px-2">{[40, 55, 30, 65, 100, 75, 50].map((height, index) => <span key={index} className="w-2 rounded-t-sm bg-primary" style={{ height: `${height}%` }} />)}</div></div></div>
}

function Metric({ label, value }: { label: string; value: string }) {
  return <div className="flex items-center justify-between border-b border-border pb-1.5"><span className="text-primary">{label}</span><span className="text-sm font-black text-primary">{value}</span></div>
}

export function OSKnowledgeDockFooter({ searchQuery, onSearchChange }: { searchQuery: string; onSearchChange: (value: string) => void }) {
  return <div className="flex flex-col items-center justify-between gap-6 rounded-md border border-border bg-card p-5 md:flex-row"><div className="flex max-w-xl items-center gap-3 font-serif text-sm text-primary italic md:text-base"><span className="shrink-0 text-3xl opacity-50">&ldquo;</span><div>Say, [O Muhammad], &ldquo;Are those who know equal to those who do not know?&rdquo;<span className="mt-1 block font-mono text-xs font-medium not-italic text-muted-foreground">(Qur&apos;an 39:9)</span></div></div><div className="flex w-full shrink-0 flex-col items-center gap-3 sm:flex-row md:w-auto"><div className="relative w-full sm:w-72"><Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-primary" /><Input type="text" value={searchQuery} onChange={(event) => onSearchChange(event.target.value)} placeholder="Search across all modules..." className="w-full rounded-md border border-border bg-background py-2 pr-16 pl-9 text-sm text-foreground focus:border-primary focus:outline-none" /><span className="absolute top-1/2 right-2.5 -translate-y-1/2 font-mono text-xs text-primary">Ctrl K</span></div><Link href="/kitab" className="flex w-full items-center justify-center gap-2 rounded-md border border-primary bg-primary px-5 py-2.5 text-sm font-medium whitespace-nowrap text-primary-foreground sm:w-auto">Browse all modules <ArrowRight className="h-4 w-4" /></Link></div></div>
}
