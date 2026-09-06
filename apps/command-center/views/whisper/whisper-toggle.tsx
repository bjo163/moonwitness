import { ChevronDown, ChevronUp, MessageCircle } from "lucide-react"
import { Button } from "@workspace/ui"

export function WhisperToggle({ isOpen, activeCount, onToggle }: { isOpen: boolean; activeCount: number; onToggle: () => void }) {
  return (
    <Button
      type="button"
      variant="ghost"
      onClick={onToggle}
      className={`flex w-full items-center justify-between gap-2 rounded-none px-2 py-2 font-mono text-[10px] tracking-widest uppercase transition-all ${isOpen ? "text-warning" : "text-muted-foreground hover:text-foreground"}`}
    >
      <span className="flex items-center gap-2">
        <MessageCircle className="h-3.5 w-3.5" />
        WHISPER CHANNEL
        {activeCount > 0 && <span className="rounded-md border border-yellow-400/30 px-1.5 py-0.5 text-[8px] text-warning">{activeCount}</span>}
      </span>
      <span className="font-mono text-[8px] text-muted-foreground">
        {isOpen ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
      </span>
    </Button>
  )
}
