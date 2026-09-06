import { RefreshCw } from "lucide-react"
import { AddonCard } from "./addon-card"
import type { ApiAddonManifest } from "./types"

export function AddonsGrid({
  addons,
  loading,
  onSeed,
  seedingId,
}: {
  addons: ApiAddonManifest[]
  loading: boolean
  onSeed: (packageId: string) => void
  seedingId: string | null
}) {
  if (loading) {
    return (
      <div className="flex min-h-[30vh] flex-col items-center justify-center space-y-3">
        <RefreshCw className="h-6 w-6 animate-spin text-primary" />
        <span className="text-xs font-mono text-muted-foreground">Introspecting registered Addons & Models from API...</span>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
      {addons.map((addon) => (
        <AddonCard key={addon.id} addon={addon} isSeeding={seedingId === addon.id} onSeed={onSeed} />
      ))}
    </div>
  )
}
