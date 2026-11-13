import { Button } from "@workspace/ui"
import type { WhisperTier } from "../whisper-mercy"
import { TIER_CONFIG } from "./whisper-config"

const TIERS: WhisperTier[] = ["DIVINE", "SHADOW", "HUMAN"]

export function WhisperTierSelector({ selectedTier, onSelect }: { selectedTier: WhisperTier; onSelect: (tier: WhisperTier) => void }) {
  return (
    <div className="flex gap-2">
      {TIERS.map((tier) => {
        const config = TIER_CONFIG[tier]
        return (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            key={tier}
            onClick={() => onSelect(tier)}
            className={`flex flex-1 items-center justify-center gap-1 rounded-lg border px-2 py-1.5 font-mono text-[8px] font-bold uppercase tracking-widest transition-all ${selectedTier === tier ? `${config.border} ${config.color} ${config.bg}` : "border-border/40 text-muted-foreground hover:border-border/70"}`}
          >
            {config.icon} {tier}
          </Button>
        )
      })}
    </div>
  )
}
