import type { ComponentType } from "react"
import Link from "next/link"
import {
  Activity,
  ArrowRight,
  BookOpen,
  Boxes,
  Bot,
  Clock,
  Coins,
  Database,
  FolderKanban,
  Handshake,
  Layers,
  Mail,
  MapPin,
  Package,
  Scale,
  ShieldCheck,
  Ticket,
  Warehouse,
  Zap,
} from "lucide-react"
import { Badge, Card, CardContent, CardHeader, CardTitle } from "@workspace/ui"
import type { ApiAddonManifest } from "./types"

const ICON_MAP: Record<string, ComponentType<{ className?: string }>> = {
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

export function AddonCard({
  addon,
  isSeeding,
  onSeed,
}: {
  addon: ApiAddonManifest
  isSeeding: boolean
  onSeed: (packageId: string) => void
}) {
  const Icon = ICON_MAP[addon.id] || Boxes
  const colorClass = COLOR_MAP[addon.id] || "text-primary bg-primary/10 border-primary/30"

  return (
    <Card className="flex flex-col justify-between rounded-xl border border-border bg-card shadow-sm transition-all hover:border-primary/40">
      <div>
        <CardHeader className="p-5 pb-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className={`flex h-10 w-10 items-center justify-center rounded-lg border ${colorClass}`}>
                <Icon className="h-5 w-5" />
              </span>
              <div>
                <CardTitle className="text-sm font-bold text-foreground">{addon.name}</CardTitle>
                <span className="font-mono text-[11px] text-muted-foreground">{addon.packageName}</span>
              </div>
            </div>
            <Badge variant="outline" className="border-border text-[10px] font-mono">
              {addon.modelCount} models
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-4 px-5 pb-4">
          <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">
            {addon.description || `Canonical ${addon.name} domain module.`}
          </p>

          {addon.depends && addon.depends.length > 0 && (
            <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
              <span className="font-semibold">Depends on:</span>
              {addon.depends.map((dependency) => (
                <span key={dependency} className="rounded bg-muted px-1.5 py-0.5 font-mono">
                  {dependency}
                </span>
              ))}
            </div>
          )}

          <div className="rounded-lg border border-border/60 bg-muted/20 p-3">
            <span className="mb-2 block text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Model-Driven Workspaces:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {(addon.models || []).slice(0, 6).map((model) => (
                <Link
                  key={model.name}
                  href={`/matrix/${model.name}`}
                  className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-2.5 py-1 text-xs font-mono font-medium text-foreground transition-colors hover:border-primary hover:text-primary"
                >
                  <Layers className="h-3 w-3 text-muted-foreground" />
                  <span>{model.name}</span>
                  <span className="text-[9px] text-muted-foreground">({model.defaultView})</span>
                </Link>
              ))}
              {addon.models && addon.models.length > 6 && (
                <span className="self-center px-1 text-[10px] font-mono text-muted-foreground">
                  +{addon.models.length - 6} more
                </span>
              )}
            </div>
          </div>
        </CardContent>
      </div>

      <div className="flex items-center justify-between rounded-b-xl border-t border-border bg-muted/10 px-5 py-3">
        <button
          type="button"
          onClick={() => onSeed(addon.id)}
          disabled={isSeeding}
          className="inline-flex items-center gap-1 text-[11px] font-medium text-muted-foreground transition-colors hover:text-foreground disabled:opacity-50"
        >
          <Database className="h-3 w-3" />
          {isSeeding ? "Seeding..." : "Load Demo Data"}
        </button>

        {addon.primaryModel && (
          <Link
            href={`/matrix/${addon.primaryModel}`}
            className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
          >
            <span>Open Workspace</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        )}
      </div>
    </Card>
  )
}
