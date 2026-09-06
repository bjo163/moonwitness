"use client"

import React, { useEffect, useState } from "react"
import Link from "next/link"
import {
  Boxes,
  Layers,
  Search,
  ArrowRight,
  Sparkles,
  Database,
  CheckCircle2,
  FolderKanban,
  Ticket,
  ShieldCheck,
  Package,
  Warehouse,
  Coins,
  Handshake,
  Mail,
  MapPin,
  Clock,
  Activity,
  Bot,
  Scale,
  Zap,
  BookOpen,
  RefreshCw,
} from "lucide-react"
import { Badge, Button, Card, CardContent, CardHeader, CardTitle, Input } from "@workspace/ui"
import { apiClient } from "@moon/client"

export interface ApiAddonModel {
  name: string
  description: string
  recName: string
  defaultView: string
  icon: string
  accentColor: string
}

export interface ApiAddonManifest {
  id: string
  name: string
  packageName: string
  description: string
  depends: string[]
  primaryModel: string
  modelCount: number
  models: ApiAddonModel[]
  category?: string
}

// Icon dictionary mapped dynamically
const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  project: FolderKanban,
  helpdesk: Ticket,
  cab: ShieldCheck,
  crm: Handshake,
  product: Package,
  stock: Warehouse,
  account: Coins,
  witness: BookOpen,
  khidra: Bot,
  mizan: Scale,
  mail: Mail,
  geo: MapPin,
  cron: Clock,
  performance: Activity,
  shootgun: Zap,
  base: Database,
}

const CATEGORY_MAP: Record<string, string> = {
  project: "Enterprise Operations",
  helpdesk: "Enterprise Operations",
  cab: "Enterprise Operations",
  crm: "Enterprise Operations",
  product: "Enterprise Operations",
  stock: "Enterprise Operations",
  account: "Enterprise Operations",
  witness: "Celestial & Knowledge",
  khidra: "Celestial & Knowledge",
  mizan: "Celestial & Knowledge",
  geo: "Celestial & Knowledge",
  mail: "System Services",
  cron: "System Services",
  performance: "System Services",
  shootgun: "System Services",
  base: "Core",
}

const COLOR_MAP: Record<string, string> = {
  project: "text-blue-500 bg-blue-500/10 border-blue-500/30",
  helpdesk: "text-amber-500 bg-amber-500/10 border-amber-500/30",
  cab: "text-emerald-500 bg-emerald-500/10 border-emerald-500/30",
  crm: "text-indigo-500 bg-indigo-500/10 border-indigo-500/30",
  product: "text-purple-500 bg-purple-500/10 border-purple-500/30",
  stock: "text-cyan-500 bg-cyan-500/10 border-cyan-500/30",
  account: "text-rose-500 bg-rose-500/10 border-rose-500/30",
  witness: "text-sky-500 bg-sky-500/10 border-sky-500/30",
  khidra: "text-teal-500 bg-teal-500/10 border-teal-500/30",
  mizan: "text-violet-500 bg-violet-500/10 border-violet-500/30",
  mail: "text-orange-500 bg-orange-500/10 border-orange-500/30",
  geo: "text-blue-600 bg-blue-600/10 border-blue-600/30",
  cron: "text-pink-500 bg-pink-500/10 border-pink-500/30",
  performance: "text-red-500 bg-red-500/10 border-red-500/30",
  shootgun: "text-yellow-500 bg-yellow-500/10 border-yellow-500/30",
  base: "text-muted-foreground bg-muted border-border",
}

export function AppsView() {
  const [addons, setAddons] = useState<ApiAddonManifest[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("All")
  const [seedingId, setSeedingId] = useState<string | null>(null)
  const [seedingSuccess, setSeedingSuccess] = useState<string | null>(null)

  const categories = ["All", "Enterprise Operations", "Celestial & Knowledge", "System Services", "Core"]

  const fetchAddonsFromApi = async () => {
    try {
      setLoading(true)
      const res = await apiClient.get<{ count: number; addons: ApiAddonManifest[] }>("/api/meta/addons")
      if (res.data?.addons) {
        setAddons(res.data.addons)
      }
    } catch (err) {
      console.error("Failed to load addons from API:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAddonsFromApi()
  }, [])

  const filteredModules = addons.filter((m) => {
    const cat = CATEGORY_MAP[m.id] || "Enterprise Operations"
    const matchesCat = selectedCategory === "All" || cat === selectedCategory
    const matchesSearch =
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.description.toLowerCase().includes(search.toLowerCase()) ||
      m.packageName.toLowerCase().includes(search.toLowerCase()) ||
      (m.models || []).some((mod) => mod.name.toLowerCase().includes(search.toLowerCase()))
    return matchesCat && matchesSearch
  })

  const handleSeedPackage = async (packageId: string) => {
    try {
      setSeedingId(packageId)
      setSeedingSuccess(null)
      const res = await apiClient.post<{ success: boolean; message: string }>("/api/system/demo-seed", {
        package: packageId || undefined,
      })
      if (res.data?.success) {
        setSeedingSuccess(
          packageId
            ? `Successfully seeded demo data for ${packageId}!`
            : "Successfully seeded demo data for all modules!"
        )
        setTimeout(() => setSeedingSuccess(null), 4000)
      }
    } catch (err: any) {
      alert(`Seed failed: ${err?.message || err}`)
    } finally {
      setSeedingId(null)
    }
  }

  return (
    <div className="flex flex-col gap-6 font-sans">
      {/* Header Banner */}
      <div className="rounded-2xl border border-border bg-card/80 p-6 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-4">
            <span className="flex h-12 w-12 items-center justify-center rounded-xl border border-primary/30 bg-primary/10 text-primary">
              <Boxes className="h-6 w-6" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight text-foreground">
                  App Center & Addon Matrix
                </h1>
                <Badge variant="outline" className="border-primary/40 text-primary font-mono text-[10px]">
                  Delivered Directly by API
                </Badge>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                All models, schemas, and view manifests are introspected dynamically from the API backend.
                Click any model workspace to open its live interactive Kanban, Table, or Form view.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={fetchAddonsFromApi}
              disabled={loading}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-2 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
              Sync API
            </Button>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleSeedPackage("")}
              disabled={seedingId !== null}
              className="inline-flex items-center gap-1.5 rounded-lg border border-primary/40 bg-primary/10 px-3.5 py-2 text-xs font-semibold text-primary hover:bg-primary/20 transition-colors disabled:opacity-50"
            >
              <Sparkles className="h-4 w-4" />
              {seedingId === "" ? "Seeding all..." : "Seed All Modules"}
            </Button>
          </div>
        </div>

        {seedingSuccess && (
          <div className="mt-4 flex items-center gap-2 rounded-lg border border-success/30 bg-success/10 px-4 py-2.5 text-xs font-semibold text-success">
            <CheckCircle2 className="h-4 w-4" />
            {seedingSuccess}
          </div>
        )}

        {/* Filter and Search Bar */}
        <div className="mt-6 flex flex-col gap-3 pt-4 border-t border-border sm:flex-row sm:items-center sm:justify-between">
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-1.5">
            {categories.map((cat) => (
              <Button
                type="button"
                variant={selectedCategory === cat ? "default" : "ghost"}
                size="sm"
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                  selectedCategory === cat
                    ? "bg-primary text-primary-foreground font-semibold"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                }`}
              >
                {cat}
              </Button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search apps or models..."
              className="w-full rounded-lg border border-input bg-background pl-9 pr-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-[30vh] space-y-3">
          <RefreshCw className="w-6 h-6 text-primary animate-spin" />
          <span className="text-xs font-mono text-muted-foreground">
            Introspecting registered Addons & Models from API...
          </span>
        </div>
      ) : (
        /* Addons Grid */
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filteredModules.map((addon) => {
            const Icon = ICON_MAP[addon.id] || Boxes
            const colorClass = COLOR_MAP[addon.id] || "text-primary bg-primary/10 border-primary/30"
            const isSeeding = seedingId === addon.id

            return (
              <Card
                key={addon.id}
                className="flex flex-col justify-between rounded-xl border border-border bg-card shadow-sm hover:border-primary/40 transition-all"
              >
                <div>
                  {/* Card Top */}
                  <CardHeader className="p-5 pb-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <span className={`flex h-10 w-10 items-center justify-center rounded-lg border ${colorClass}`}>
                          <Icon className="h-5 w-5" />
                        </span>
                        <div>
                          <CardTitle className="text-sm font-bold text-foreground">
                            {addon.name}
                          </CardTitle>
                          <span className="font-mono text-[11px] text-muted-foreground">
                            {addon.packageName}
                          </span>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-[10px] font-mono border-border">
                        {addon.modelCount} models
                      </Badge>
                    </div>
                  </CardHeader>

                  <CardContent className="px-5 pb-4 space-y-4">
                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                      {addon.description || `Canonical ${addon.name} domain module.`}
                    </p>

                    {/* Dependencies */}
                    {addon.depends && addon.depends.length > 0 && (
                      <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                        <span className="font-semibold">Depends on:</span>
                        {addon.depends.map((dep) => (
                          <span key={dep} className="rounded bg-muted px-1.5 py-0.5 font-mono">
                            {dep}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Available Models (Delivered by API) */}
                    <div className="rounded-lg border border-border/60 bg-muted/20 p-3">
                      <span className="block text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                        Model-Driven Workspaces:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {(addon.models || []).slice(0, 6).map((m) => (
                          <Link
                            key={m.name}
                            href={`/matrix/${m.name}`}
                            className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-2.5 py-1 text-xs font-mono font-medium text-foreground hover:border-primary hover:text-primary transition-colors"
                          >
                            <Layers className="h-3 w-3 text-muted-foreground" />
                            <span>{m.recName ? m.name : m.name}</span>
                            <span className="text-[9px] text-muted-foreground">({m.defaultView})</span>
                          </Link>
                        ))}
                        {addon.models && addon.models.length > 6 && (
                          <span className="text-[10px] font-mono text-muted-foreground self-center px-1">
                            +{addon.models.length - 6} more
                          </span>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </div>

                {/* Card Footer Actions */}
                <div className="flex items-center justify-between border-t border-border px-5 py-3 bg-muted/10 rounded-b-xl">
                  <button
                    onClick={() => handleSeedPackage(addon.id)}
                    disabled={isSeeding}
                    className="text-[11px] font-medium text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50 inline-flex items-center gap-1"
                  >
                    <Database className="h-3 w-3" />
                    {isSeeding ? "Seeding..." : "Load Demo Data"}
                  </button>

                  {addon.primaryModel && (
                    <Link
                      href={`/matrix/${addon.primaryModel}`}
                      className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 transition-colors"
                    >
                      <span>Open Workspace</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  )}
                </div>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}

export { AppsView as AppCenterView }
