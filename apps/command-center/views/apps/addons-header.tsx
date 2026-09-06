import { Boxes, CheckCircle2, RefreshCw, Search, Sparkles } from "lucide-react"
import { Badge, Button, Input } from "@workspace/ui"

export function AddonsHeader({
  categories,
  loading,
  onSeedAll,
  onSearchChange,
  onSelectCategory,
  onSync,
  search,
  seeding,
  seedingAll,
  seedingSuccess,
  selectedCategory,
}: {
  categories: readonly string[]
  loading: boolean
  onSeedAll: () => void
  onSearchChange: (value: string) => void
  onSelectCategory: (category: string) => void
  onSync: () => void
  search: string
  seeding: boolean
  seedingAll: boolean
  seedingSuccess: string | null
  selectedCategory: string
}) {
  return (
    <div className="rounded-2xl border border-border bg-card/80 p-6 shadow-sm">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-start gap-4">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl border border-primary/30 bg-primary/10 text-primary">
            <Boxes className="h-6 w-6" />
          </span>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-foreground">App Center & Addon Matrix</h1>
              <Badge variant="outline" className="border-primary/40 text-primary font-mono text-[10px]">
                Delivered Directly by API
              </Badge>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              All models, schemas, and view manifests are introspected dynamically from the API backend. Click any model workspace to open its live interactive Kanban, Table, or Form view.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onSync}
            disabled={loading}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-2 text-xs font-semibold text-muted-foreground transition-colors hover:text-foreground disabled:opacity-50"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
            Sync API
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onSeedAll}
            disabled={seeding}
            className="inline-flex items-center gap-1.5 rounded-lg border border-primary/40 bg-primary/10 px-3.5 py-2 text-xs font-semibold text-primary transition-colors hover:bg-primary/20 disabled:opacity-50"
          >
            <Sparkles className="h-4 w-4" />
            {seedingAll ? "Seeding all..." : "Seed All Modules"}
          </Button>
        </div>
      </div>

      {seedingSuccess && (
        <div className="mt-4 flex items-center gap-2 rounded-lg border border-success/30 bg-success/10 px-4 py-2.5 text-xs font-semibold text-success">
          <CheckCircle2 className="h-4 w-4" />
          {seedingSuccess}
        </div>
      )}

      <div className="mt-6 flex flex-col gap-3 border-t border-border pt-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-1.5">
          {categories.map((category) => (
            <Button
              type="button"
              variant={selectedCategory === category ? "default" : "ghost"}
              size="sm"
              key={category}
              onClick={() => onSelectCategory(category)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${selectedCategory === category ? "bg-primary font-semibold text-primary-foreground" : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"}`}
            >
              {category}
            </Button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search apps or models..."
            className="w-full rounded-lg border border-input bg-background py-1.5 pl-9 pr-3 text-xs text-foreground outline-none placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>
    </div>
  )
}
