import { ChevronDown, Clock } from "lucide-react"
import { Button } from "@workspace/ui"
import type { WhisperExpiry } from "../whisper-mercy"
import { EXPIRY_OPTIONS } from "./whisper-config"

export function WhisperExpiryPicker({
  selectedExpiry,
  showPicker,
  onSelect,
  onToggle,
}: {
  selectedExpiry: WhisperExpiry
  showPicker: boolean
  onSelect: (expiry: WhisperExpiry) => void
  onToggle: () => void
}) {
  const selectedOption = EXPIRY_OPTIONS.find((option) => option.days === selectedExpiry)!

  return (
    <div className="relative">
      <Button type="button" variant="outline" size="sm" onClick={onToggle} className="flex w-full items-center justify-between border border-border/40 bg-card/60 px-3 py-2 font-mono text-[9px] text-muted-foreground hover:border-border/70">
        <span className="flex items-center gap-2">
          <Clock className="h-3 w-3" />
          Masa berlaku: {selectedOption.label} — {selectedOption.desc}
        </span>
        <ChevronDown className="h-3 w-3" />
      </Button>

      {showPicker && (
        <div className="absolute top-full right-0 left-0 z-10 border border-border/40 bg-card/95 shadow-md backdrop-blur-md">
          {EXPIRY_OPTIONS.map((option) => (
            <Button
              type="button"
              variant="ghost"
              key={option.days}
              onClick={() => onSelect(option.days)}
              className="flex w-full flex-col px-3 py-2 text-left hover:bg-muted/50"
            >
              <span className="font-mono text-[10px] font-bold text-foreground">{option.label} — {option.desc}</span>
              <span className="font-mono text-[8px] text-warning/80">{option.ref}</span>
            </Button>
          ))}
        </div>
      )}
    </div>
  )
}
